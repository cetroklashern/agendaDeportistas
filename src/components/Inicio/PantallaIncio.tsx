import { Box, Flex, Heading, Text } from "@chakra-ui/react";
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
    const result =
      await ServicioRecordatorios.getInstancia().obtenerRecordatorios();
    setRecordatorios(result);
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
        <Text as="b" textAlign="center" fontSize="20px" color="black">
          Bienvenido a la Agenda deportistas
        </Text>
      </Center>
      <Flex height="100vh" direction="row">
        {/* Sección Izquierda */}
        <Box
          flex="1"
          bg="transparent"
          color="black"
          p={5}
          display="flex"
          flexDirection="column"
          justifyContent="top center"
        >
          <Heading size="lg" mb={3}>
            Cumpleañeros de {currentMonthName}
          </Heading>
          <RecordatorioCumpleaños />
        </Box>

        {/* Sección Derecha */}
        <Box
          flex="2"
          bg="transparent"
          color="black"
          p={11}
          display="flex"
          flexDirection="column"
          justifyContent="top center"
        >
          <Heading size="lg" mb={5}>
            Recordatorios
          </Heading>
          <VerRecordatorios
            onNewRecordatorioClick={handleNewRecordatorioClick}
            recordatorios={recordatorios}
            loading={loading}
          />
        </Box>
      </Flex>
    </>
  );
}

export default PantallaInicio;
