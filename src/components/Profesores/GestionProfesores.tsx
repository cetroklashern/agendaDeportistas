import { Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import VerProfesores from "./VerProfesores";
import EditarProfesores from "./EditarProfesores";
import { Profesor } from "../../models/Profesor";
import { ServicioProfesores } from "../../services/ServicioProfesores";

type Props = { titulo: string };

function GestionProfesores(props: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProfesor, setIsNewProfesor] = useState(false);
  const [profesorSelected, setProfesorSelected] = useState<Profesor>(
    new Profesor("", "", "", "0", "", "", "", "", "", "0", [])
  );

  const servicioProfesores = ServicioProfesores.getInstancia();

  function handleSelectProfesor(profesorSelected: Profesor): void {
    setProfesorSelected(profesorSelected);
    setIsEditing(true);
    setIsNewProfesor(false);
  }

  function handleNewProfesorClick(): void {
    setIsNewProfesor(true);
    setIsEditing(true);
    setProfesorSelected(
      new Profesor("", "", "", "0", "", "", "", "", "", "0", [])
    );
  }

  function handleSaveProfesor(): void {
    setIsEditing(false);
  }

  return (
    <>
      <Center p="4">
        <Text as="b" textAlign="center" fontSize="20px" color="black">
          {props.titulo}
        </Text>
      </Center>
      {!!!isEditing ? (
        <VerProfesores
          onNewProfesorClick={handleNewProfesorClick}
          onSelect={handleSelectProfesor}
          isEditing={isEditing}
          servicioProfesores={servicioProfesores}
        />
      ) : (
        <EditarProfesores
          setIsEditing={setIsEditing}
          profesorSelected={profesorSelected}
          isNewProfesor={isNewProfesor}
          onSaveProfesor={handleSaveProfesor}
          servicioProfesores={servicioProfesores}
        />
      )}
    </>
  );
}

export default GestionProfesores;
