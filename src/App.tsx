import { ChakraProvider, extendTheme, Text } from "@chakra-ui/react";
import Encabezado from "./components/Encabezado";
import { useState } from "react";
import GestionCursos from "./components/Cursos/GestionCursos";
import "./App.css";
import GestionProfesores from "./components/Profesores/GestionProfesores";
import GestionHorarios from "./components/Horarios/GestionHorarios";
import GestionDeportistas from "./components/Deportistas/GestionDeportistas";
import GestionUbicaciones from "./components/Ubicaciones/GestionUbicaciones";
import "react-datepicker/dist/react-datepicker.css";
import PantallaInicio from "./components/Inicio/PantallaIncio";

function App() {
  const [optionSelected, setOptionSelected] = useState({
    id: 0,
    name: "Inicio",
    page: "Inicio",
  });
  const opcionesMenu = [
    { id: 0, name: "Inicio", page: "Inicio" },
    { id: 1, name: "Gestión de Cursos", page: "GestionCursos" },
    { id: 2, name: "Gestión de Profesores", page: "GestionProfesores" },
    { id: 3, name: "Gestión de Ubicaciones", page: "GestionUbicaciones" },
    { id: 4, name: "Gestión Deportista", page: "Inscribir" },
    { id: 5, name: "Agendamiento de Deportistas", page: "GestionGrupos" },
  ];

  const handlerSelected = (element: {
    id: number;
    name: string;
    page: string;
  }) => {
    setOptionSelected(element);
  };

  // Tema personalizado para Chakra UI
  const theme = extendTheme({
    styles: {
      global: {
        ".react-datepicker__input-container input": {
          backgroundColor: "white",
        },
        ".react-datepicker": {
          right: "0", // Asegurar que el selector de fechas esté alineado al borde derecho
        },
        '.react-datepicker-popper[data-placement^="right"] .react-datepicker__triangle':
          {
            left: "auto",
            right: "0", // Alinear el triángulo a la derecha
          },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <div>
        <Encabezado onClick={handlerSelected} data={opcionesMenu} />
        <div
          style={{
            //backgroundColor: "#e0f2f1" /* Color de fondo */,
            backgroundImage: "url('/fondo.png')",
            backgroundSize: "cover", // Ajusta el tamaño de la imagen para cubrir todo el fondo
            backgroundRepeat: "no-repeat", // Evita que la imagen se repita
            minHeight: "100vh", // Asegura que el fondo cubra toda la pantalla
            fontFamily: "Arial, sans-serif", // Estilo de fuente opcional
            padding: "2px", // Espacio opcional para el contenido
          }}
        >
          {optionSelected.id === 1 ? (
            <GestionCursos titulo={optionSelected.name} />
          ) : optionSelected.id === 2 ? (
            <GestionProfesores titulo={optionSelected.name} />
          ) : optionSelected.id === 3 ? (
            <GestionUbicaciones />
          ) : optionSelected.id === 4 ? (
            <GestionDeportistas />
          ) : optionSelected.id === 5 ? (
            <GestionHorarios titulo={optionSelected.name} />
          ) : (
            <PantallaInicio />
          )}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
