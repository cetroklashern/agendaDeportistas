import { Box, Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { Grupo } from "../../models/Grupo";
import { FaEye, FaTrash, FaAddressBook } from "react-icons/fa";
import ServicioAgendas from "../../services/ServicioAgenda";

// Función para calcular la luminosidad del color
const getContrastYIQ = (hexcolor: string) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

type Props = {
  grupos: Grupo[];
  dia: string;
  hora: string | number;
  onAgendarGrupo: (grupo: Grupo) => void;
  onVerDetalleGrupo: (grupo: Grupo) => void;
  onEliminarGrupo: (idGrupo: number) => void;
};

const CeldaGrupos = (props: Props) => {
  function handlerAgendarGrupo(grupo: Grupo): void {
    props.onAgendarGrupo(grupo);
  }

  function handlerVerDetalleGrupo(grupo: Grupo): void {
    props.onVerDetalleGrupo(grupo);
  }

  function handlerEliminarGrupo(idGrupo: number): void {
    props.onEliminarGrupo(idGrupo);
  }

  function obtenerInicialesONombreCurso(nombre: string): string {
    // Si el nombre tiene más de 20 caracteres
    if (nombre.length > 25) {
      // Dividir el nombre por espacios y tomar la primera letra de cada palabra
      const palabras = nombre.split(" ");
      const iniciales = palabras
        .map((palabra) => palabra.charAt(0).toUpperCase())
        .join("");
      return iniciales;
    }
    // Si tiene 20 caracteres o menos, devolver el nombre completo
    return nombre;
  }

  const gruposDelDia = props.grupos.filter(
    (g) =>
      g.dia === props.dia &&
      g.horaInicio <= props.hora &&
      g.horaFin > props.hora
  );

  if (gruposDelDia.length > 0) {
    return (
      <Grid templateColumns={`repeat(${gruposDelDia.length}, 1fr)`} gap={2}>
        {gruposDelDia.map((grupo, index) => {
          const textColor = getContrastYIQ(grupo.curso.color);

          return (
            <GridItem key={index}>
              <Box
                borderRadius="md"
                p={0}
                height="90px"
                minWidth={"180px"}
                bg={grupo.curso.color}
                color={textColor}
                title={grupo.curso.nombre}
              >
                <Text
                  fontWeight="bold"
                  fontSize="14px"
                  height={"20px"}
                  margin={0}
                  padding={0}
                >
                  {obtenerInicialesONombreCurso(grupo.curso.nombre)}
                </Text>
                <Text fontSize="14px" height={"18px"} margin={0} padding={0}>
                  {ServicioAgendas.getInstancia().obtenerAgendasGrupo(
                    grupo.idGrupo
                  )}
                  /{grupo.cupos}
                </Text>
                <Text fontSize="12px" height={"18px"} margin={0} padding={0}>
                  {grupo.profesor.nombre}
                </Text>
                <HStack
                  spacing={2}
                  mt={1}
                  justifyContent="flex-end"
                  marginRight={"2px"}
                >
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={() => handlerAgendarGrupo(grupo)}
                    title="Agendar deportista"
                  >
                    <FaAddressBook />
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => handlerVerDetalleGrupo(grupo)}
                    title="Ver detalle Grupo"
                  >
                    <FaEye />
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handlerEliminarGrupo(grupo.idGrupo)}
                    title="Eliminar Grupo"
                  >
                    <FaTrash />
                  </Button>
                </HStack>
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    );
  }

  return <Box height="10px"></Box>;
};

export default CeldaGrupos;
