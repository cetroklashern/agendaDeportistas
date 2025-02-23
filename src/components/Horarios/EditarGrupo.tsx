import {
  FormControl,
  FormLabel,
  Button,
  Text,
  Grid,
  GridItem,
  Select,
  ModalBody,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Grupo } from "../../models/Grupo";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";
import { Profesor } from "../../models/Profesor";
import { Ubicacion } from "../../models/Ubicacion";
import { Curso } from "../../models/Curso";
import ServicioAgendas from "../../services/ServicioAgenda";

type Props = {
  grupoSeleccionado: Grupo;
  isEditarGrupoOpen: boolean;
  onClose: () => void;
  isNewElement: boolean;
  onSave: (grupo: Grupo) => void;
  idProximoGrupo: number;
  error: string;
  profesores: Profesor[];
  ubicaciones: Ubicacion[];
  cursos: Curso[];
};

function EditarGrupo(props: Props) {
  const [id, setId] = useState(0);
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [cupos, setCupos] = useState(0);
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [habilitarHoraInicio, setHabilitarHoraInicio] = useState(true);
  const [errorDisponibilidad, setErrorDiponibilidad] = useState("");
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  const horas = [];

  // Generar horas desde las 6:00 AM hasta las 10:00 PM en intervalos de 30 minutos
  for (let i = 7; i <= 21; i++) {
    const hora = i < 10 ? `0${i}` : i;
    horas.push(`${hora}:00`);
    horas.push(`${hora}:30`);
  }

  useEffect(() => {
    const fetchData = async () => {
      setProfesores(props.profesores);
      setUbicaciones(props.ubicaciones);
      setCursos(props.cursos);
      if (props.grupoSeleccionado) {
        //await ServicioAgendas.getInstancia().obtenerAgendas();

        const numAgendas =
          ServicioAgendas.getInstancia().obtenerCantidadAgendasGrupo(
            props.grupoSeleccionado.idGrupo
          );

        setIsEditable(numAgendas === 0);
      }
    };
    fetchData();
  }, [props.isEditarGrupoOpen]);

  // Se carga los datos del Grupo seleccionado
  useEffect(() => {
    if (props.grupoSeleccionado) {
      setId(props.grupoSeleccionado.idGrupo);
      setDia(props.grupoSeleccionado.dia);
      setHoraInicio(props.grupoSeleccionado.horaInicio);
      setHoraFin(props.grupoSeleccionado.horaFin);
      setCupos(props.grupoSeleccionado.cupos);
      if (props.grupoSeleccionado.profesor.id == undefined) {
        const profesorFiltrado = props.profesores?.find(
          (profesor) =>
            profesor.id == props.grupoSeleccionado.profesor.toString()
        );
        setProfesor(profesorFiltrado ?? null);
      } else {
        setProfesor(props.grupoSeleccionado.profesor);
      }
      if (props.grupoSeleccionado.ubicacion.id == undefined) {
        const ubicacionFiltrada = props.ubicaciones?.find(
          (ubicacion) =>
            ubicacion.id == Number(props.grupoSeleccionado.ubicacion)
        );
        setUbicacion(ubicacionFiltrada ?? null);
      } else {
        setUbicacion(props.grupoSeleccionado.ubicacion);
      }
      setCurso(props.grupoSeleccionado.curso);
    }
  }, [props.grupoSeleccionado]);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  useEffect(() => {
    const isValid =
      dia != "" &&
      horaInicio != "" &&
      cupos > 0 &&
      curso != null &&
      profesor != null &&
      ubicacion != null;
    setIsFormValid(isValid);
  }, [dia, horaInicio, cupos, curso, profesor, ubicacion]);

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = () => {
    if (
      curso != null &&
      cupos != null &&
      profesor != null &&
      ubicacion != null
    ) {
      const nuevoGrupo = new Grupo(
        props.isNewElement ? props.idProximoGrupo : id,
        curso,
        dia,
        horaInicio,
        horaFin,
        6,
        profesor,
        ubicacion
      );

      // Se envian los datos capturados a una base de datos
      console.log(nuevoGrupo);

      props.onSave(nuevoGrupo);
    }
  };

  useEffect(() => {
    actualizarHoraFin();
  }, [curso, horaInicio]);

  useEffect(() => {
    if (
      curso != null &&
      curso?.idCurso > 0 &&
      profesor != null &&
      profesor?.id != "" &&
      dia != ""
    ) {
      setHabilitarHoraInicio(false);
    } else {
      setHabilitarHoraInicio(true);
    }
  }, [curso, profesor, dia]);

  function actualizarHoraFin() {
    if (horaInicio != "") {
      const partesHora = horaInicio.split(":");
      const hora = parseInt(partesHora[0], 10);
      const minuto = parseInt(partesHora[1], 10);

      if (curso != null) {
        let horaFin = hora + parseInt(curso.duracionClaseHoras);
        let minutoFin = 0;
        if (minuto > 0 && parseInt(curso.duracionClaseMinutos) > 0) {
          horaFin += 1;
        } else {
          minutoFin = minuto + parseInt(curso.duracionClaseMinutos);
        }

        setHoraFin(
          `${horaFin < 10 ? `0${horaFin}` : horaFin}:${
            minutoFin < 10 ? `0${minutoFin}` : minutoFin
          }`
        );
      } else {
        setHoraFin("");
      }
    } else {
      setHoraFin("");
    }
  }

  function handlerHoraIncioChange(event: ChangeEvent<HTMLSelectElement>): void {
    //validar que la hora seleciconada si este dentro de la disponibilidad del profesor
    const horaSeleccionada = event.target.value;
    const partesHora = horaSeleccionada.split(":");
    const hora = parseInt(partesHora[0], 10);
    const minuto = parseInt(partesHora[1], 10);
    const horaValidar = hora * 60 + minuto;

    setErrorDiponibilidad("");

    const disponibilidad = profesor?.disponibilidades.find(
      (d) =>
        d.diaDisponibilidad == dia &&
        horaValidar >= d.horaInicioDisponibilidad * 60 &&
        horaValidar <= d.horaFinDisponibilidad * 60
    );

    if (disponibilidad) {
      setHoraInicio(horaSeleccionada);
    } else {
      setErrorDiponibilidad(
        profesor?.nombre +
          " no tiene disponibilidad configurada para el " +
          dia +
          " " +
          event.target.value
      );

      setHoraInicio("");
    }
  }

  return (
    <>
      <Modal isOpen={props.isEditarGrupoOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            minWidth: 600,
            minHeight: 500,
          }}
        >
          <ModalHeader
            bgGradient="linear(to-r,darkblue, blue.500)"
            color="white"
          >
            Editar Grupo
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              backgroundColor: "#e0f2f1" /* Color de fondo */,
              minHeight: "40vh", // Asegura que el fondo cubra toda la pantalla
              fontFamily: "Arial, sans-serif", // Estilo de fuente opcional
              padding: "2px", // Espacio opcional para el contenido
            }}
          >
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={6}
              margin={"20px"}
              padding={"15px"}
            >
              <GridItem rowSpan={1} colSpan={2}>
                <FormControl isRequired>
                  <FormLabel>Curso</FormLabel>
                  <Select
                    value={curso?.idCurso}
                    placeholder="Seleccione el curso"
                    isDisabled={!props.isNewElement || !isEditable}
                    onChange={(e) => {
                      const selectedCurso =
                        cursos.find(
                          (u) => u.idCurso === Number(e.target.value)
                        ) || null;
                      setCurso(selectedCurso);
                    }}
                  >
                    {cursos.map((curso, index) => (
                      <option key={index} value={curso.idCurso}>
                        {curso.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={2}>
                <FormControl isRequired>
                  <FormLabel>Profesor</FormLabel>
                  <Select
                    value={profesor?.id || ""}
                    placeholder="Seleccione el profesor"
                    onChange={(e) => {
                      const selectedProfesor =
                        profesores.find((u) => u.id === e.target.value) || null;
                      setProfesor(selectedProfesor);
                    }}
                  >
                    {profesores.map((profesor, index) => (
                      <option key={index} value={profesor.id}>
                        {profesor.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Ubicación</FormLabel>
                  <Select
                    value={ubicacion?.nombre || ""}
                    placeholder="Seleccione la ubicación"
                    isDisabled={!isEditable}
                    onChange={(e) => {
                      const selectedUbicacion =
                        ubicaciones.find((u) => u.nombre === e.target.value) ||
                        null;
                      setUbicacion(selectedUbicacion);
                    }}
                  >
                    {ubicaciones.map((ubicacion, index) => (
                      <option key={index} value={ubicacion.nombre}>
                        {ubicacion.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Dia de la semana</FormLabel>
                  <Select
                    value={dia}
                    placeholder="Seleccione el día de la semana"
                    isDisabled={!isEditable}
                    onChange={(e) => setDia(e.target.value)}
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Hora de inicio</FormLabel>
                  <Select
                    value={horaInicio}
                    placeholder="Seleccione el hora de inicio"
                    onChange={handlerHoraIncioChange}
                    isDisabled={habilitarHoraInicio || !isEditable}
                  >
                    {horas.map((hora, index) => (
                      <option key={index} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Hora fin</FormLabel>
                  <Text>{horaFin}</Text>
                </FormControl>
              </GridItem>
              {error != "" && (
                <GridItem rowSpan={1} colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel color={"red"}>{error}</FormLabel>
                  </FormControl>
                </GridItem>
              )}
              {errorDisponibilidad != "" && (
                <GridItem rowSpan={1} colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel color={"red"}>{errorDisponibilidad}</FormLabel>
                  </FormControl>
                </GridItem>
              )}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={props.onClose}
              leftIcon={<FaRegTimesCircle />}
            >
              Cerrar
            </Button>
            <Button
              colorScheme={isFormValid ? "blue" : "gray"}
              onClick={() => handleClickGuardar()}
              isDisabled={!isFormValid}
              leftIcon={<FaSave />}
            >
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditarGrupo;
