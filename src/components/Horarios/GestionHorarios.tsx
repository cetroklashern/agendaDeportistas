import { Heading, Center } from "@chakra-ui/react";
import VerGrupos from "./VerGrupos";

type Props = { titulo: string };

function GestionHorarios(props: Props) {
  return (
    <>
      <Center p="4">
        <Heading size="lg" textAlign="center">
          {props.titulo}
        </Heading>
      </Center>
      <VerGrupos />
    </>
  );
}

export default GestionHorarios;
