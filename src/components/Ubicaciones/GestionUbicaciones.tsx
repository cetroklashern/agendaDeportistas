import { Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import { ServicioUbicaciones } from "../../services/ServicioUbicaciones";
import VerUbicaciones from "./VerUbicaciones";
import EditarUbicaciones from "./EditarUbicaciones";
import { Ubicacion } from "../../models/Ubicacion";

function GestionUbicaciones() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUbicacion, setIsNewUbicacion] = useState(false);
  const [ubicacionSelected, setUbicacionSelected] = useState<Ubicacion>(
    new Ubicacion(
      0,
      "",
      "",
      "",
      "",
      true,
      new Date("01/01/2024"),
      new Date("12/31/2024"),
      []
    )
  );

  const servicioUbicaciones = ServicioUbicaciones.getInstancia();

  function handleSelectUbicacion(ubicacionSelected: Ubicacion): void {
    setUbicacionSelected(ubicacionSelected);
    setIsEditing(true);
    setIsNewUbicacion(false);
  }

  function handleNewUbicacionClick(): void {
    setIsNewUbicacion(true);
    setIsEditing(true);
    setUbicacionSelected(
      new Ubicacion(
        0,
        "",
        "",
        "",
        "",
        true,
        new Date("01/01/2024"),
        new Date("12/31/2024"),
        []
      )
    );
  }

  function handleSaveUbicacion(): void {
    setIsEditing(false);
  }

  return (
    <>
      <Center p="4">
        <Text as="b" textAlign="center" fontSize="20px" color="black">
          {!!!isEditing
            ? "Listado de Sedes Registradas"
            : "Captura de Datos de la Sede"}
        </Text>
      </Center>
      {!!!isEditing ? (
        <VerUbicaciones
          onNewUbicacionClick={handleNewUbicacionClick}
          servicioUbicaciones={servicioUbicaciones}
          onSelect={handleSelectUbicacion}
          isEditing={isEditing}
        />
      ) : (
        <EditarUbicaciones
          setIsEditing={setIsEditing}
          servicioUbicaciones={servicioUbicaciones}
          ubicacionSelected={ubicacionSelected}
          isNewUbicacion={isNewUbicacion}
          onSaveUbicacion={handleSaveUbicacion}
        />
      )}
    </>
  );
}

export default GestionUbicaciones;
