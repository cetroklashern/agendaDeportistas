import { Text, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Deportista } from "../../models/Deportista";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import EditarDeportistas from "./EditarDeportistas";
import VerDeportistas from "./VerDeportistas";

const deportistaVacio = {
  id: "",
  nombre: "",
  tipoId: "",
  fechaNacimiento: new Date(),
  edad: 0,
  direccion: "",
  eps: "",
  institucionEducativa: "",
  grado: 0,
  condicionImportante: "",
  imagenPropia: false,
  fotoDeportista: "",
  fotoDocumento: "",
  fotoDeportistaUrl: "",
  fotoDocumentoUrl: "",
  informacionMensualidad: false,
  informacionReposicion: false,
  informacionVacaciones: false,
  comprobanteInscripcion: false,
  acudientes: [],
};

function GestionDeportistas() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewDeportista, setIsNewDeportista] = useState(false);
  const [deportistaSelected, setDeportistaSelected] =
    useState<Deportista>(deportistaVacio);
  const [fotoDeportista, setFotoDeportista] = useState<string>("");
  const [fotoDocumento, setFotoDocumento] = useState<string>("");

  const servicioDeportistas = ServicioDeportistas.getInstancia();

  function handleSelectDeportista(deportistaSelected: Deportista): void {
    setDeportistaSelected(deportistaSelected);
  }

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await servicioDeportistas.obtenerFotoDeportista(
          deportistaSelected.id
        );
        setFotoDeportista(response);

        const response2 = await servicioDeportistas.obtenerFotoDocumento(
          deportistaSelected.id
        );
        setFotoDocumento(response2);

        setIsEditing(true);
        setIsNewDeportista(false);
      } catch (error) {
        console.error("Error fetching fotos", error);
      }
    };

    if (deportistaSelected.id != "") {
      fetchFotos();
    }
  }, [deportistaSelected]);

  function handleNewDeportistaClick(): void {
    setIsNewDeportista(true);
    setIsEditing(true);
    setDeportistaSelected(deportistaVacio);
    setFotoDeportista("");
    setFotoDocumento("");
  }

  function handleSaveDeportista(): void {
    setIsEditing(false);
  }

  return (
    <>
      <Center p="4">
        <Text as="b" textAlign="center" fontSize="20px" color="black">
          {!!!isEditing
            ? "Listado de Deportistas Inscritos"
            : "Captura de Datos del Deportista"}
        </Text>
      </Center>
      {!!!isEditing ? (
        <VerDeportistas
          onNewDeportistaClick={handleNewDeportistaClick}
          servicioDeportistas={servicioDeportistas}
          onSelect={handleSelectDeportista}
          isEditing={isEditing}
        />
      ) : (
        <EditarDeportistas
          setIsEditing={setIsEditing}
          servicioDeportistas={servicioDeportistas}
          deportistaSelected={deportistaSelected}
          isNewDeportista={isNewDeportista}
          fotoDeportistaActual={fotoDeportista}
          fotoDocumentoActual={fotoDocumento}
          onSaveDeportista={handleSaveDeportista}
        />
      )}
    </>
  );
}

export default GestionDeportistas;
