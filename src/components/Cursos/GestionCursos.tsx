import { Heading, Center } from "@chakra-ui/react";
import { useState } from "react";
import VerCursos from "./VerCursos";
import EditarCursos from "./EditarCursos";
import { ServicioCursos } from "../../services/ServicioCursos";

type Props = { titulo: string };

function GestionCursos(props: Props) {
  const [isSubmitting] = useState(false);
  const [isNewElement, setIsNewElement] = useState(false);

  const servicioCursos = ServicioCursos.getInstancia();

  return (
    <>
      <Center p="4">
        <Heading size="lg" textAlign="center">
          {props.titulo}
        </Heading>
      </Center>
      {!!!isNewElement ? (
        <VerCursos
          isSubmitting={isSubmitting}
          setIsNewElement={setIsNewElement}
          servicioCursos={servicioCursos}
        />
      ) : (
        <EditarCursos
          isSubmitting={isSubmitting}
          setIsNewElement={setIsNewElement}
          servicioCursos={servicioCursos}
        />
      )}
    </>
  );
}

export default GestionCursos;
