import { useEffect, useState } from "react";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import { Deportista } from "../../models/Deportista";
import { Box, Text, VStack } from "@chakra-ui/react";

const getMonthName = (monthIndex: number) => {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return monthNames[monthIndex];
};

const RecordatorioCumpleaños = () => {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [deportistasCumplen, setDeportistasCumplen] = useState<Deportista[]>([]);
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = getMonthName(currentMonthIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServicioDeportistas.getInstancia().obtenerDeportistas();
        setDeportistas(data);
      } catch (error) {
        console.error("Error fetching deportistas:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    setDeportistasCumplen(
      deportistas.filter((deportista) => {
        const birthMonth = new Date(deportista.fechaNacimiento).getMonth() + 1;
        return birthMonth === currentMonth;
      })
    );
  }, [deportistas]);

  return (
    <VStack align="stretch" spacing={2}>
      {deportistasCumplen.length > 0 ? (
        deportistasCumplen.map((deportista) => (
          <Box
            key={deportista.id}
            bg="#FCE4EC"
            border="1px solid"
            borderColor="#F48FB1"
            borderRadius="xl"
            px={4}
            py={3}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Text fontSize="22px">🎉</Text>
            <Box>
              <Text fontWeight="800" color="#C2185B" fontSize="15px">
                {deportista.nombre}
              </Text>
              <Text fontSize="13px" color="#880E4F">
                {new Date(deportista.fechaNacimiento).getDate()} de {currentMonthName}
              </Text>
            </Box>
          </Box>
        ))
      ) : (
        <Box
          bg="#F3E5F5"
          border="1px solid"
          borderColor="#CE93D8"
          borderRadius="xl"
          px={4}
          py={3}
        >
          <Text color="#7B1FA2" fontWeight="600">
            No hay cumpleaños este mes.
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default RecordatorioCumpleaños;
