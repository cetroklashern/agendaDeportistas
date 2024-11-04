import { Text, Center } from "@chakra-ui/react";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import RecordatorioCumpleaños from "./RecordatorioCumpleaños";

function PantallaInicio() {
  const servicioDeportistas = ServicioDeportistas.getInstancia();

  return (
    <>
      <Center p="4">
        <Text as="b" textAlign="center" fontSize="20px" color="black">
          Bienvenido a la Agenda deportistas
        </Text>
      </Center>
      <RecordatorioCumpleaños servicioDeportistas={servicioDeportistas} />
    </>
  );
}

export default PantallaInicio;
