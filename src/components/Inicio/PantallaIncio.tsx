import { Box, Flex, Heading } from "@chakra-ui/react";
import RecordatorioCumpleaños from "./RecordatorioCumpleaños";
import { Center } from "@chakra-ui/react";
import VerRecordatorios from "./VerRecordatorios";
import EditRecordatorio from "./EditarRecordatorio";
import { useEffect, useState } from "react";
import Recordatorio from "../../models/Recordatorio";
import { ServicioRecordatorios } from "../../services/ServicioRecordatorios";

const getMonthName = (monthIndex: number) => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthNames[monthIndex];
};

function PantallaInicio() {
  const currentMonthIndex = new Date().getMonth(); // Los meses en JavaScript van de 0 a 11
  const currentMonthName = getMonthName(currentMonthIndex);
  const [idRecordatorio, setIdRecordatorio] = useState(0);
  const [isNewRecordatorio, setIsNewRecordatorio] = useState(false);
  const [isEditarRecordatorioOpen, setIsEditarRecordatorioOpen] =
    useState(false);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar todos los recordatorios al inicio
  useEffect(() => {
    fetchRecordatorios();
  }, []);

  const fetchRecordatorios = async () => {
    setLoading(true); // Es buena práctica indicar que la carga ha comenzado
    const result =
      await ServicioRecordatorios.getInstancia().obtenerRecordatorios();

    // Convertir la cadena de fechaRecordatorio a un objeto Date
    const recordatoriosConFechasConvertidas = result.map((rec) => ({
      ...rec,
      // Si rec.fechaRecordatorio es una cadena ISO, new Date() la parseará correctamente.
      fechaRecordatorio: new Date(rec.fechaRecordatorio),
    }));

    setRecordatorios(recordatoriosConFechasConvertidas);
    setLoading(false);
  };

  async function handleSaveRecordatorio(
    recordatorio: Recordatorio
  ): Promise<void> {
    if (isNewRecordatorio) {
      console.log("New Recordatorio");
      await ServicioRecordatorios.getInstancia().crearRecordatorio(
        recordatorio
      );
    } else {
      console.log("Edit Recordatorio");
      await ServicioRecordatorios.getInstancia().actualizarRecordatorio(
        recordatorio
      );
    }

    fetchRecordatorios();
    setIsEditarRecordatorioOpen(false);
  }

  function handleCloseRecordatorio(): void {
    setIsEditarRecordatorioOpen(false);
  }

  function handleNewRecordatorioClick(): void {
    setIdRecordatorio(recordatorios.length + 1);
    setIsNewRecordatorio(true);
    setIsEditarRecordatorioOpen(true);
  }

  async function handleDeleteRecordatorioClick(
    idRecordatorio: number
  ): Promise<void> {
    await ServicioRecordatorios.getInstancia().eliminarRecordatorio(
      idRecordatorio
    );
    fetchRecordatorios();
  }

  function handleEditRecordatorioClick(idRecordatorio: number): void {
    setIdRecordatorio(idRecordatorio);
    setIsNewRecordatorio(false);
    setIsEditarRecordatorioOpen(true);
  }

  return (
    <>
      <EditRecordatorio
        onSave={handleSaveRecordatorio}
        idRecordatorio={idRecordatorio}
        isNewRecord={isNewRecordatorio}
        isEditarRecordatorioOpen={isEditarRecordatorioOpen}
        onClose={handleCloseRecordatorio}
      ></EditRecordatorio>
      <Center p="4">
        <Heading size="xl" textAlign="center">
          ¡Bienvenido a Exploradores! 🤸
        </Heading>
      </Center>
      <Flex direction="row" gap={4} p={4} wrap="wrap">
        {/* Sección Izquierda — Cumpleañeros */}
        <Box
          flex="1"
          minW="260px"
          bg="white"
          border="2px solid"
          borderColor="#F48FB1"
          borderRadius="2xl"
          p={5}
          boxShadow="0 4px 16px rgba(233,30,140,0.12)"
          display="flex"
          flexDirection="column"
        >
          <Heading size="lg" mb={4}>
            🎂 Cumpleañeros de {currentMonthName}
          </Heading>
          <RecordatorioCumpleaños />
        </Box>

        {/* Sección Derecha — Recordatorios */}
        <Box
          flex="2"
          minW="320px"
          bg="white"
          border="2px solid"
          borderColor="#81D4FA"
          borderRadius="2xl"
          p={5}
          boxShadow="0 4px 16px rgba(41,182,246,0.12)"
          display="flex"
          flexDirection="column"
        >
          <Heading size="lg" mb={3}>
            📋 Recordatorios
          </Heading>
          <VerRecordatorios
            onNewRecordatorioClick={handleNewRecordatorioClick}
            recordatorios={recordatorios}
            loading={loading}
            onDeleteClick={handleDeleteRecordatorioClick}
            onEditClick={handleEditRecordatorioClick}
          />
        </Box>
      </Flex>
    </>
  );
}

export default PantallaInicio;
