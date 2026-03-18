import { ChakraProvider, extendTheme } from "@chakra-ui/react";
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

  // Tema personalizado para Chakra UI — Identidad visual Exploradores Gimnasio Infantil
  const theme = extendTheme({
    fonts: {
      heading: "'Fredoka One', cursive",
      body: "'Nunito', sans-serif",
    },
    colors: {
      // Sobreescribir "blue" con rosa/magenta de la mascota búho
      blue: {
        50: "#FCE4EC",
        100: "#F8BBD0",
        200: "#F48FB1",
        300: "#F06292",
        400: "#EC407A",
        500: "#E91E8C",
        600: "#D81B60",
        700: "#C2185B",
        800: "#AD1457",
        900: "#880E4F",
      },
      // Paleta de marca Exploradores
      brand: {
        pink: "#E91E8C",
        pinkLight: "#F06292",
        blue: "#29B6F6",
        blueLight: "#81D4FA",
        coral: "#FF7043",
        yellow: "#FFD600",
        purple: "#9C27B0",
        green: "#43A047",
      },
    },
    components: {
      Button: {
        baseStyle: {
          borderRadius: "full",
          fontWeight: "700",
        },
      },
      Input: {
        defaultProps: { focusBorderColor: "#E91E8C" },
      },
      Select: {
        defaultProps: { focusBorderColor: "#E91E8C" },
      },
      Textarea: {
        defaultProps: { focusBorderColor: "#E91E8C" },
      },
      NumberInput: {
        defaultProps: { focusBorderColor: "#E91E8C" },
      },
      FormLabel: {
        baseStyle: {
          color: "#C2185B",
          fontWeight: "700",
          fontSize: "13px",
          mb: "4px",
        },
      },
      Table: {
        variants: {
          striped: {
            th: {
              bg: "#29B6F6",
              color: "white",
              borderColor: "#0288D1",
              fontFamily: "'Fredoka One', cursive",
              fontWeight: "400",
              textTransform: "none",
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
          },
        },
      },
      Heading: {
        baseStyle: {
          fontFamily: "'Fredoka One', cursive",
          fontWeight: "400",
          color: "#E91E8C",
          letterSpacing: "0.5px",
        },
      },
      Modal: {
        baseStyle: {
          header: {
            fontFamily: "'Fredoka One', cursive",
            fontWeight: "400",
          },
        },
      },
    },
    styles: {
      global: {
        body: {
          fontFamily: "'Nunito', sans-serif",
          bg: "#fce4ec",
        },
        ".react-datepicker__input-container input": {
          backgroundColor: "white",
        },
        ".react-datepicker": {
          right: "0",
        },
        '.react-datepicker-popper[data-placement^="right"] .react-datepicker__triangle':
          {
            left: "auto",
            right: "0",
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
            backgroundImage: "url('/fondo.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.88)",
              borderRadius: "20px",
              minHeight: "calc(100vh - 32px)",
              padding: "8px",
              boxShadow: "0 4px 24px rgba(233, 30, 140, 0.1)",
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
      </div>
    </ChakraProvider>
  );
}

export default App;
