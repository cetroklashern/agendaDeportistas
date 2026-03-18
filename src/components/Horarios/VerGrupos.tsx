import {
  Table, Tbody, Tr, Td, Th, Thead, Button, Box,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ServicioGrupos } from "../../services/ServicioGrupos";
import { Grupo } from "../../models/Grupo";
import CeldaGrupos from "./CeldaGrupos";
import { FaPlus } from "react-icons/fa";
import { MdChecklistRtl } from "react-icons/md";
import EditarGrupo from "./EditarGrupo";
import { Curso } from "../../models/Curso";
import { Profesor } from "../../models/Profesor";
import { Ubicacion } from "../../models/Ubicacion";
import AgendarClase from "./AgendarClase";
import ServicioAgendas from "../../services/ServicioAgenda";
import { ServicioCursos } from "../../services/ServicioCursos";
import { ServicioProfesores } from "../../services/ServicioProfesores";
import { ServicioUbicaciones } from "../../services/ServicioUbicaciones";
import { Agenda } from "../../models/Agenda";
import GestionarAsistencia from "./GestionarAsistencia";

function VerGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [isOpenEditarGrupos, setIsOpenEditarGrupos] = useState(false);
  const [errorGrupos, setErrorGrupo] = useState("");
  const [isNewGrupo, setIsNewGrupo] = useState(false);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [grupoAEliminar, setGrupoAEliminar] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo>(
    new Grupo(
      0,
      new Curso(0, "", "", "", "", "", "", "", "", "", "", ""),
      "",
      "",
      "",
      6,
      new Profesor("", "", "", "", "", "", "", "", "", "0", []),
      new Ubicacion(0, "", "", "", "", false, new Date(), new Date(), [])
    )
  );
  const [isEditarAgendaOpen, setIsEditarAgendaOpen] = useState(false);
  const [isGestionarAsistenciaOpen, setIsGestionarAsistenciaOpen] =
    useState(false);
  const [grupoAsistencia, setGrupoAsistencia] = useState<Grupo | null>(null);

  const dias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const horas = [];

  // Generar horas desde las 6:00 AM hasta las 10:00 PM en intervalos de 30 minutos
  for (let i = 7; i <= 21; i++) {
    const hora = i < 10 ? `0${i}` : i;
    horas.push(`${hora}:00`);
    horas.push(`${hora}:30`);
  }

  // Obtener todos los cursos para mostrar en la tabla
  useEffect(() => {
    fetchData();
  }, [isOpenEditarGrupos, isGestionarAsistenciaOpen]);

  const fetchData = async () => {
    try {
      const data = await ServicioGrupos.getInstancia().obtenerGrupos();
      setGrupos(data);

      // Obtener las agendas para mostrar en la tabla
      const data2 = await ServicioAgendas.getInstancia().obtenerAgendas();
      setAgendas(data2);

      const data3 = await ServicioCursos.getInstancia().obtenerCursos();
      setCursos(data3);

      const data4 = await ServicioProfesores.getInstancia().obtenerProfesores();
      setProfesores(data4);

      const data5 =
        await ServicioUbicaciones.getInstancia().obtenerUbicaciones();
      setUbicaciones(data5);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  function handleNewGrupoClick(): void {
    setErrorGrupo("");
    setGrupoSeleccionado(
      new Grupo(
        0,
        new Curso(0, "", "", "", "", "", "", "", "", "", "", ""),
        "",
        "",
        "",
        6,
        new Profesor("", "", "", "", "", "", "", "", "", "0", []),
        new Ubicacion(0, "", "", "", "", false, new Date(), new Date(), [])
      )
    );
    setIsNewGrupo(true);
    setIsOpenEditarGrupos(true);
  }

  async function handleSaveGrupo(grupo: Grupo): Promise<void> {
    setErrorGrupo("");
    // validar si el profesor seleccionado ya tiene algun grupo asignado que las horas no se crucen con otros grupos asignados
    let dia = "";
    let horaInicio = "";
    let horaFin = "";

    let gruposActualesDia;

    if (isNewGrupo) {
      gruposActualesDia = grupos.filter(
        (g) => g.profesor.id === grupo.profesor.id && g.dia === grupo.dia
      );
    } else {
      gruposActualesDia = grupos.filter(
        (g) =>
          g.idGrupo !== grupo.idGrupo &&
          g.profesor.id === grupo.profesor.id &&
          g.dia === grupo.dia
      );
    }

    gruposActualesDia = gruposActualesDia.filter((g) => {
      const horaInicioPartes = g.horaInicio.split(":");
      const horaInicioGrupo =
        parseInt(horaInicioPartes[0], 10) * 60 +
        parseInt(horaInicioPartes[1], 10);
      const horaFinalPartes = g.horaFin.split(":");
      const horaFinGrupo =
        parseInt(horaFinalPartes[0], 10) * 60 +
        parseInt(horaFinalPartes[1], 10);

      const horaInicioGrupoNuevoPartes = grupo.horaInicio.split(":");
      const horaInicioGrupoNuevo =
        parseInt(horaInicioGrupoNuevoPartes[0], 10) * 60 +
        parseInt(horaInicioGrupoNuevoPartes[1], 10);
      const horaFinalGrupoNuevoPartes = grupo.horaFin.split(":");
      const horaFinGrupoNuevo =
        parseInt(horaFinalGrupoNuevoPartes[0], 10) * 60 +
        parseInt(horaFinalGrupoNuevoPartes[1], 10);

      if (
        (horaInicioGrupoNuevo >= horaInicioGrupo &&
          horaInicioGrupoNuevo < horaFinGrupo) ||
        (horaFinGrupoNuevo > horaInicioGrupo &&
          horaFinGrupoNuevo <= horaFinGrupo)
      ) {
        dia = g.dia;
        horaInicio = g.horaInicio;
        horaFin = g.horaFin;
        return true;
      } else {
        return false;
      }
    });

    if (gruposActualesDia.length > 0) {
      setErrorGrupo(
        grupo.profesor.nombre +
          " ya tiene un grupo el " +
          dia +
          " entre las " +
          horaInicio +
          " y " +
          horaFin
      );
      return;
    } else {
      setErrorGrupo("");
      if (isNewGrupo) {
        await ServicioGrupos.getInstancia().agregarGrupo(grupo);
      } else {
        await ServicioGrupos.getInstancia().actualizarGrupo(grupo);
      }
      await fetchData();

      setIsOpenEditarGrupos(false);
    }
  }

  function handleAgendarGrupoClick(grupo: Grupo): void {
    console.log("Agregando agenda");
    setGrupoSeleccionado(grupo);
    setIsEditarAgendaOpen(true);
  }

  function handleVerGrupoClick(grupo: Grupo): void {
    setErrorGrupo("");
    setGrupoSeleccionado(grupo);
    setIsNewGrupo(false);
    setIsOpenEditarGrupos(true);
  }

  async function handleEliminarGrupoClick(idGrupo: number): Promise<void> {
    const numAgendas =
      ServicioAgendas.getInstancia().obtenerCantidadAgendasGrupo(idGrupo);

    if (numAgendas > 0) {
      toast({
        title: "No se puede eliminar",
        description: "Este grupo tiene deportistas agendados. Retira los deportistas antes de eliminar el grupo.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setGrupoAEliminar(idGrupo);
    setIsAlertOpen(true);
  }

  async function confirmarEliminar(): Promise<void> {
    if (grupoAEliminar !== null) {
      await ServicioGrupos.getInstancia().eliminarGrupo(grupoAEliminar);
      fetchData();
    }
    setIsAlertOpen(false);
    setGrupoAEliminar(null);
  }

  function handleAsistencia() {
    setGrupoAsistencia(null);
    setIsGestionarAsistenciaOpen(true);
  }

  function handleAsistenciaGrupo(grupo: Grupo) {
    setGrupoAsistencia(grupo);
    setIsGestionarAsistenciaOpen(true);
  }

  function handleSaveAsistencia() {
    setIsGestionarAsistenciaOpen(false);
  }

  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontFamily="'Fredoka One', cursive" fontWeight="400" fontSize="22px" color="#C2185B">
              🗑️ Eliminar grupo
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)} variant="outline" colorScheme="blue">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmarEliminar} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <EditarGrupo
        cursos={cursos}
        profesores={profesores}
        ubicaciones={ubicaciones}
        isEditarGrupoOpen={isOpenEditarGrupos}
        error={errorGrupos}
        onClose={() => setIsOpenEditarGrupos(false)}
        idProximoGrupo={grupos.length + 1}
        isNewElement={isNewGrupo}
        onSave={handleSaveGrupo}
        grupoSeleccionado={grupoSeleccionado}
      />
      <AgendarClase
        isEditarAgendaOpen={isEditarAgendaOpen}
        onClose={() => setIsEditarAgendaOpen(false)}
        idProximaAgenda={agendas.length + 1}
        grupoSeleccionado={grupoSeleccionado}
      />
      <GestionarAsistencia
        isGestionarAsistenciaOpen={isGestionarAsistenciaOpen}
        onClose={() => setIsGestionarAsistenciaOpen(false)}
        onSave={handleSaveAsistencia}
        agendas={agendas}
        grupos={grupos}
        profesores={profesores}
        cursos={cursos}
        grupoFiltro={grupoAsistencia}
      />
      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        margin={"20px"}
        onClick={() => handleNewGrupoClick()}
        className="buttonSombreado"
        leftIcon={<FaPlus />}
      >
        Abrir Nuevo Espacio
      </Button>
      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        margin={"20px"}
        onClick={() => handleAsistencia()}
        className="buttonSombreado"
        leftIcon={<MdChecklistRtl />}
      >
        Tomar asistencia
      </Button>
      <Box overflowX="auto" overflowY="auto" maxHeight="calc(100vh - 260px)" borderRadius="xl" border="2px solid" borderColor="#F48FB1" mx={4} mb={4}>
      <Table
        variant="striped"
        colorScheme="blue"
        textAlign="center"
        style={{ borderSpacing: 0 }}
      >
        <Thead position="sticky" top={0} zIndex={2}>
          <Tr>
            <Th></Th>
            {dias.map((dia, index) => (
              <Th key={index} textAlign="center">
                {dia}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {horas.map((hora, horaIndex) => (
            <Tr key={horaIndex}>
              <Td>{hora}</Td>
              {dias.map((dia, diaIndex) => (
                <Td
                  key={`${horaIndex}-${diaIndex}`}
                  textAlign="center"
                  padding={0.5}
                >
                  <>
                    {grupos.filter(
                      (grupo) =>
                        grupo.dia === dia &&
                        grupo.horaInicio <= hora &&
                        grupo.horaFin >= hora
                    ).length > 0 ? (
                      <CeldaGrupos
                        profesores={profesores}
                        ubicaciones={ubicaciones}
                        grupos={grupos}
                        dia={dia}
                        hora={hora}
                        onAgendarGrupo={handleAgendarGrupoClick}
                        onVerDetalleGrupo={handleVerGrupoClick}
                        onEliminarGrupo={handleEliminarGrupoClick}
                        onAsistenciaGrupo={handleAsistenciaGrupo}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      </Box>
    </>
  );
}

export default VerGrupos;
