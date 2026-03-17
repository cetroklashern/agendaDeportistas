import {
  FormControl,
  FormLabel,
  Button,
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
  Box,
  Heading,
  Badge,
  Alert,
  AlertIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Grupo } from "../../models/Grupo";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";
import { Profesor } from "../../models/Profesor";
import { Ubicacion } from "../../models/Ubicacion";
import { Curso } from "../../models/Curso";

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
  const [cupos, setCupos] = useState(6);
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [errorDisponibilidad, setErrorDiponibilidad] = useState("");
  const [error, setError] = useState("");

  const horas = [];
  for (let i = 7; i <= 21; i++) {
    const hora = i < 10 ? `0${i}` : i;
    horas.push(`${hora}:00`);
    horas.push(`${hora}:30`);
  }

  useEffect(() => {
    setProfesores(props.profesores);
    setUbicaciones(props.ubicaciones);
    setCursos(props.cursos);
  }, [props.isEditarGrupoOpen]);

  useEffect(() => {
    if (props.grupoSeleccionado) {
      setId(props.grupoSeleccionado.idGrupo);
      setDia(props.grupoSeleccionado.dia);
      setHoraInicio(props.grupoSeleccionado.horaInicio);
      setHoraFin(props.grupoSeleccionado.horaFin);
      setCupos(props.grupoSeleccionado.cupos || 6);
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

  useEffect(() => {
    actualizarHoraFin();
  }, [curso, horaInicio]);

  function actualizarHoraFin() {
    if (horaInicio != "") {
      const partesHora = horaInicio.split(":");
      const hora = parseInt(partesHora[0], 10);
      const minuto = parseInt(partesHora[1], 10);

      if (curso != null) {
        let horaFinCalc = hora + parseInt(curso.duracionClaseHoras);
        let minutoFin = 0;
        if (minuto > 0 && parseInt(curso.duracionClaseMinutos) > 0) {
          horaFinCalc += 1;
        } else {
          minutoFin = minuto + parseInt(curso.duracionClaseMinutos);
        }
        setHoraFin(
          `${horaFinCalc < 10 ? `0${horaFinCalc}` : horaFinCalc}:${
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

  const handleClickGuardar = () => {
    if (curso != null && cupos != null && profesor != null && ubicacion != null) {
      const nuevoGrupo = new Grupo(
        props.isNewElement ? props.idProximoGrupo : id,
        curso,
        dia,
        horaInicio,
        horaFin,
        cupos,
        profesor,
        ubicacion
      );
      props.onSave(nuevoGrupo);
    }
  };

  function handlerHoraIncioChange(event: ChangeEvent<HTMLSelectElement>): void {
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
      <Modal isOpen={props.isEditarGrupoOpen} onClose={props.onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent minWidth={620}>
          <ModalHeader
            bgGradient="linear(to-r, #E91E8C, #29B6F6)"
            color="white"
            fontFamily="'Fredoka One', cursive"
            fontSize="22px"
          >
            {props.isNewElement ? "✏️ Crear Grupo" : "👁️ Ver Grupo"}
          </ModalHeader>
          <ModalCloseButton color="white" />

          <ModalBody bg="white" p={0}>

            {/* ── Sección 1: ¿Qué curso? ── */}
            <Box bg="#FFF0F7" borderBottom="2px solid" borderColor="#F48FB1" px={5} py={4}>
              <Heading
                size="sm"
                color="#C2185B"
                fontFamily="'Fredoka One', cursive"
                fontWeight="400"
                mb={3}
              >
                🎯 ¿Qué curso?
              </Heading>
              <FormControl isRequired>
                <FormLabel>Curso</FormLabel>
                <Select
                  value={curso?.idCurso}
                  placeholder="Seleccione el curso"
                  isDisabled={!props.isNewElement}
                  onChange={(e) => {
                    const selectedCurso =
                      cursos.find((u) => u.idCurso === Number(e.target.value)) || null;
                    setCurso(selectedCurso);
                  }}
                >
                  {cursos.map((c, index) => (
                    <option key={index} value={c.idCurso}>
                      {c.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {curso && (
                <HStack
                  mt={3}
                  p={3}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="#F48FB1"
                  spacing={3}
                >
                  <Box
                    w="22px"
                    h="22px"
                    borderRadius="full"
                    bg={curso.color}
                    border="2px solid"
                    borderColor="gray.200"
                    flexShrink={0}
                  />
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="#C2185B">
                      {curso.nombre}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Duración: {curso.duracionClaseHoras}h {curso.duracionClaseMinutos}min
                    </Text>
                  </Box>
                </HStack>
              )}
            </Box>

            {/* ── Sección 2: ¿Quién enseña? ── */}
            <Box bg="white" borderBottom="2px solid" borderColor="#E3F2FD" px={5} py={4}>
              <Heading
                size="sm"
                color="#0288D1"
                fontFamily="'Fredoka One', cursive"
                fontWeight="400"
                mb={3}
              >
                👨‍🏫 ¿Quién enseña?
              </Heading>
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
                  isDisabled={!props.isNewElement}
                >
                  {profesores.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* ── Sección 3: ¿Cuándo y dónde? ── */}
            <Box bg="#F0F9FF" px={5} py={4}>
              <Heading
                size="sm"
                color="#0288D1"
                fontFamily="'Fredoka One', cursive"
                fontWeight="400"
                mb={3}
              >
                📅 ¿Cuándo y dónde?
              </Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Día de la semana</FormLabel>
                    <Select
                      value={dia}
                      placeholder="Seleccione el día"
                      isDisabled={!props.isNewElement}
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
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Hora de inicio</FormLabel>
                    <Select
                      value={horaInicio}
                      placeholder="Seleccione la hora"
                      onChange={handlerHoraIncioChange}
                      isDisabled={!props.isNewElement}
                    >
                      {horas.map((hora, index) => (
                        <option key={index} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Hora de finalización</FormLabel>
                    {horaFin ? (
                      <Badge
                        colorScheme="blue"
                        fontSize="md"
                        px={4}
                        py={2}
                        borderRadius="full"
                      >
                        🕐 Finaliza a las {horaFin}
                      </Badge>
                    ) : (
                      <Badge
                        colorScheme="gray"
                        fontSize="sm"
                        px={3}
                        py={2}
                        borderRadius="full"
                      >
                        Se calcula al seleccionar curso y hora de inicio
                      </Badge>
                    )}
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Ubicación</FormLabel>
                    <Select
                      value={ubicacion?.nombre || ""}
                      placeholder="Seleccione la ubicación"
                      isDisabled={!props.isNewElement}
                      onChange={(e) => {
                        const selectedUbicacion =
                          ubicaciones.find((u) => u.nombre === e.target.value) || null;
                        setUbicacion(selectedUbicacion);
                      }}
                    >
                      {ubicaciones.map((u, index) => (
                        <option key={index} value={u.nombre}>
                          {u.nombre}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Cupos disponibles</FormLabel>
                    <NumberInput
                      value={cupos}
                      min={1}
                      max={50}
                      isDisabled={!props.isNewElement}
                      onChange={(value) => setCupos(Number(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            {/* ── Errores ── */}
            {(error || errorDisponibilidad) && (
              <Box px={5} py={3}>
                {error && (
                  <Alert status="error" borderRadius="lg" mb={2}>
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                {errorDisponibilidad && (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    {errorDisponibilidad}
                  </Alert>
                )}
              </Box>
            )}
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <Button
              colorScheme="blue"
              variant="outline"
              mr={3}
              onClick={props.onClose}
              leftIcon={<FaRegTimesCircle />}
            >
              Cerrar
            </Button>
            <Button
              colorScheme={isFormValid ? "blue" : "gray"}
              onClick={handleClickGuardar}
              isDisabled={!isFormValid}
              leftIcon={<FaSave />}
              visibility={props.isNewElement ? "visible" : "hidden"}
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
