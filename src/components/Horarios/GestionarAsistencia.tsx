import {
  Box,
  Center,
  Heading,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Switch,
  ModalBody,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Badge,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Agenda } from "../../models/Agenda";
import { Asistencia } from "../../models/Asistencia";
import { format } from "date-fns";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";
import { Grupo } from "../../models/Grupo";
import { Profesor } from "../../models/Profesor";
import { Curso } from "../../models/Curso";
import ServicioAsistencia from "../../services/ServicioAsistencia";

type Props = {
  isGestionarAsistenciaOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  agendas: Agenda[];
  grupos: Grupo[];
  profesores: Profesor[];
  cursos: Curso[];
  grupoFiltro?: Grupo | null;
};

function GestionarAsistencia(props: Props) {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [asistencias, setAsistencias] = useState<Record<number, boolean>>({});
  const [guardando, setGuardando] = useState(false);
  const toast = useToast();

  const diasSemana = [
    "Domingo", "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado",
  ];

  useEffect(() => {
    const selectedDateObj = new Date(selectedDate + "T00:00:00");
    const diaSeleccionado = diasSemana[selectedDateObj.getDay()];

    const filtradas = props.agendas.filter((agenda) => {
      // Cross-reference with props.grupos in case backend doesn't include grupo.dia
      const grupoCompleto = props.grupos.find((g) => g.idGrupo === agenda.grupo?.idGrupo);
      const dia = agenda.grupo?.dia ?? grupoCompleto?.dia;
      if (dia !== diaSeleccionado) return false;
      if (props.grupoFiltro) {
        return agenda.grupo?.idGrupo === props.grupoFiltro.idGrupo;
      }
      return true;
    });

    setAgendas(filtradas);

    // Inicializar todas las asistencias como "presente" (true)
    const init: Record<number, boolean> = {};
    filtradas.forEach((a) => { init[a.idAgenda] = true; });
    setAsistencias(init);
  }, [selectedDate, props.agendas, props.grupos, props.grupoFiltro]);

  const handleToggleAsistencia = (idAgenda: number) => {
    setAsistencias((prev) => ({ ...prev, [idAgenda]: !prev[idAgenda] }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const lista: Asistencia[] = agendas.map((agenda) =>
        new Asistencia(0, agenda, selectedDate, asistencias[agenda.idAgenda] !== false)
      );
      await ServicioAsistencia.getInstancia().guardarAsistencias(lista);
      toast({
        title: "Asistencia guardada",
        description: `${presentes} presentes · ${ausentes} ausentes`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      props.onSave();
    } catch {
      toast({
        title: "Error al guardar",
        description: "No se pudo conectar con el servidor. Intenta de nuevo.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setGuardando(false);
    }
  };

  const presentes = agendas.filter((a) => asistencias[a.idAgenda] !== false).length;
  const ausentes = agendas.length - presentes;

  const obtenerGrupoCompleto = (agenda: Agenda) =>
    props.grupos.find((g) => g.idGrupo === agenda.grupo?.idGrupo);

  const obtenerNombreGrupo = (agenda: Agenda) => {
    const grupo = obtenerGrupoCompleto(agenda);
    const g = grupo ?? agenda.grupo;
    return g ? `${g.dia} ${g.horaInicio} - ${g.horaFin}` : "";
  };

  const obtenerNombreCurso = (agenda: Agenda) => {
    const grupo = obtenerGrupoCompleto(agenda);
    const idCurso = grupo?.curso?.idCurso ?? agenda.grupo?.curso?.idCurso;
    const curso = props.cursos.find((c) => c.idCurso === idCurso);
    return curso?.nombre ?? grupo?.curso?.nombre ?? agenda.grupo?.curso?.nombre ?? "";
  };

  const obtenerNombreProfesor = (agenda: Agenda) => {
    const grupo = obtenerGrupoCompleto(agenda);
    const idProfesor = grupo?.profesor?.id ?? agenda.grupo?.profesor?.id;
    const profesor = props.profesores.find((p) => p.id === idProfesor);
    return profesor?.nombre ?? grupo?.profesor?.nombre ?? agenda.grupo?.profesor?.nombre ?? "";
  };

  return (
    <Modal
      isOpen={props.isGestionarAsistenciaOpen}
      onClose={props.onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent minWidth={900}>
        <ModalHeader
          bgGradient="linear(to-r, #E91E8C, #29B6F6)"
          color="white"
          fontFamily="'Fredoka One', cursive"
          fontSize="22px"
        >
          📋 {props.grupoFiltro ? `${props.grupoFiltro.curso?.nombre ?? "Grupo"} — ${props.grupoFiltro.horaInicio} a ${props.grupoFiltro.horaFin}` : "Tomar Asistencia"}
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody bg="white" p={0}>

          {/* ── Selector de fecha ── */}
          <Box bg="#FFF0F7" borderBottom="2px solid" borderColor="#F48FB1" px={6} py={4}>
            <HStack justify="space-between" align="center">
              <Box>
                <Heading size="sm" color="#C2185B" fontFamily="'Fredoka One', cursive" fontWeight="400" mb={1}>
                  📅 Selecciona la fecha
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Se mostrarán los grupos y deportistas que tienen clase ese día de la semana
                </Text>
              </Box>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                width="180px"
                bg="white"
                borderColor="#F48FB1"
                focusBorderColor="#E91E8C"
              />
            </HStack>
          </Box>

          {/* ── Resumen ── */}
          {agendas.length > 0 && (
            <Box bg="#F0F9FF" borderBottom="2px solid" borderColor="#E3F2FD" px={6} py={3}>
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.600" fontWeight="600">
                  Total: {agendas.length} deportistas
                </Text>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  ✅ Presentes: {presentes}
                </Badge>
                <Badge colorScheme="red" fontSize="sm" px={3} py={1} borderRadius="full">
                  ❌ Ausentes: {ausentes}
                </Badge>
              </HStack>
            </Box>
          )}

          {/* ── Tabla de asistencia ── */}
          <Box px={4} py={3}>
            {agendas.length === 0 ? (
              <Center flexDirection="column" py={12} gap={3}>
                <Text fontSize="3xl">🏖️</Text>
                <Heading size="md" color="#C2185B" fontFamily="'Fredoka One', cursive" fontWeight="400">
                  No hay clases este día
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  No se encontraron grupos programados para el{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-ES", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </Text>
              </Center>
            ) : (
              <Table variant="striped" colorScheme="blue" size="sm">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Curso</Th>
                    <Th textAlign="center">Profesor</Th>
                    <Th textAlign="center">Horario</Th>
                    <Th textAlign="center">Deportista</Th>
                    <Th textAlign="center">¿Asistió?</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {agendas.map((agenda, index) => {
                    const asistio = asistencias[agenda.idAgenda] !== false;
                    return (
                      <Tr key={index}>
                        <Td textAlign="center" fontSize="sm">
                          {obtenerNombreCurso(agenda)}
                        </Td>
                        <Td textAlign="center" fontSize="sm">
                          {obtenerNombreProfesor(agenda)}
                        </Td>
                        <Td textAlign="center" fontSize="sm">
                          {obtenerNombreGrupo(agenda)}
                        </Td>
                        <Td textAlign="center" fontSize="sm" fontWeight="600">
                          {agenda.deportista?.nombre ?? "—"}
                        </Td>
                        <Td textAlign="center">
                          <HStack justify="center" spacing={2}>
                            <Switch
                              isChecked={asistio}
                              onChange={() => handleToggleAsistencia(agenda.idAgenda)}
                              colorScheme="green"
                              size="md"
                            />
                            <Badge
                              colorScheme={asistio ? "green" : "red"}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {asistio ? "Presente" : "Ausente"}
                            </Badge>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Box>
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
            colorScheme="blue"
            onClick={handleGuardar}
            isDisabled={agendas.length === 0}
            isLoading={guardando}
            loadingText="Guardando..."
            leftIcon={<FaSave />}
          >
            Guardar asistencia
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GestionarAsistencia;
