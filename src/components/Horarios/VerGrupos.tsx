import { Table, Tbody, Tr, Td, Th, Thead, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ServicioGrupos } from "../../services/ServicioGrupos";
import { Grupo } from "../../models/Grupo";
import CeldaGrupos from "./CeldaGrupos";
import { FaPlus } from "react-icons/fa";
import EditarGrupo from "./EditarGrupo";
import { Curso } from "../../models/Curso";
import { Profesor } from "../../models/Profesor";
import { Ubicacion } from "../../models/Ubicacion";
import AgendarClase from "./AgendarClase";
import ServicioAgendas from "../../services/ServicioAgenda";
import { Agenda } from "../../models/Agenda";

function VerGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [isOpenEditarGrupos, setIsOpenEditarGrupos] = useState(false);
  const [errorGrupos, setErrorGrupo] = useState("");
  const [isNewGrupo, setIsNewGrupo] = useState(false);
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
    const fetchData = async () => {
      try {
        const data = await ServicioGrupos.getInstancia().obtenerGrupos();
        setGrupos(data);

        // Obtener las agendas para mostrar en la tabla
        const data2 = await ServicioAgendas.getInstancia().obtenerAgendas();
        setAgendas(data2);

        //setGrupos(ServicioGrupos.getInstancia().listarGrupos());
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, [isOpenEditarGrupos]);

  function handleNewGrupoClick(): void {
    setErrorGrupo("");
    setGrupoSeleccionado(
      new Grupo(
        0,
        new Curso(0, "", "", "", "", "", "", "", "", "", "", ""),
        "",
        "",
        "",
        8,
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
      ServicioAgendas.getInstancia().obtenerAgendasGrupo(idGrupo);

    if (numAgendas > 0) {
      alert("No se puede eliminar un grupo que tiene deportistas agendados");
      return;
    } else {
      await ServicioGrupos.getInstancia().eliminarGrupo(idGrupo);
      setGrupos(ServicioGrupos.getInstancia().listarGrupos());
    }
  }

  return (
    <>
      <EditarGrupo
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
      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        margin={"20px"}
        onClick={() => handleNewGrupoClick()}
        className="buttonSombreado"
        leftIcon={<FaPlus />}
      >
        Agregar Nuevo
      </Button>
      <Table
        variant="striped"
        textAlign="center"
        mb={4}
        style={{ borderSpacing: 0 }}
      >
        <Thead>
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
              <Td>{hora}</Td> {/* Columna de horas */}
              {dias.map((dia, diaIndex) => (
                <Td
                  key={`${horaIndex}-${diaIndex}`}
                  textAlign="center"
                  padding={0.5}
                >
                  <CeldaGrupos
                    grupos={grupos}
                    dia={dia}
                    hora={hora}
                    onAgendarGrupo={handleAgendarGrupoClick}
                    onVerDetalleGrupo={handleVerGrupoClick}
                    onEliminarGrupo={handleEliminarGrupoClick}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

export default VerGrupos;
