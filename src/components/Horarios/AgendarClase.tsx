import {
  FormLabel,
  Button,
  Grid,
  GridItem,
  ModalBody,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Grupo } from "../../models/Grupo";
import { FaSearch } from "react-icons/fa";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import { Deportista } from "../../models/Deportista";
import { Agenda } from "../../models/Agenda";
import ServicioAgendas from "../../services/ServicioAgenda";

type Props = {
  grupoSeleccionado: Grupo;
  isEditarAgendaOpen: boolean;
  onClose: () => void;
  idProximaAgenda: number;
};

function AgendarClase(props: Props) {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [agendasGrupo, setAgendasGrupo] = useState<Agenda[]>([]);
  const [isBuscarDeportistaOpen, setIsBuscarDeportistaOpen] = useState(false);
  const [nombre, setNombre] = useState("");

  const fetchData = async () => {
    if (props.grupoSeleccionado) {
      const data = await ServicioAgendas.getInstancia().obtenerAgendas();

      setAgendasGrupo(
        data.filter(
          (agenda) => agenda.grupo.idGrupo === props.grupoSeleccionado.idGrupo
        )
      );
    }
  };

  // Se carga los datos del Grupo seleccionado
  useEffect(() => {
    fetchData();
  }, [props.grupoSeleccionado]);

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = async (deportista: Deportista) => {
    if (deportista != null) {
      const nuevaAgenda = new Agenda(
        props.idProximaAgenda,
        props.grupoSeleccionado,
        deportista
      );

      // Se envían los datos capturados a la base de datos
      await ServicioAgendas.getInstancia().agregarAgenda(nuevaAgenda);

      // Volver a cargar las agendas después de guardar
      await fetchData();
    }
  };

  useEffect(() => {
    //carga de datos para cursos, profesor y ubicaciones
    const fetchData = async () => {
      try {
        if (nombre.length > 3) {
          let data =
            await ServicioDeportistas.getInstancia().obtenerDeportistasNombre(
              nombre
            );

          //filtrar los deportistas que no esten en la agenda del grupo actual
          data = data.filter(
            (deportista) =>
              !agendasGrupo.some(
                (agenda) => agenda.deportista.id === deportista.id
              )
          );

          setDeportistas(data);
        }
      } catch (error) {
        console.error("Error fetching deportistas:", error);
      }
    };

    fetchData();
  }, [nombre]);

  const handlerEliminarDeportistaClick = async (idAgenda: number) => {
    {
      await ServicioAgendas.getInstancia().eliminarAgenda(idAgenda);
      await fetchData();
    }
  };

  return (
    <>
      <Modal
        isOpen={isBuscarDeportistaOpen}
        onClose={() => setIsBuscarDeportistaOpen(false)}
      >
        <ModalOverlay />
        <ModalContent
          style={{
            minWidth: 600,
            minHeight: 500,
          }}
        >
          <ModalHeader
            bgGradient="linear(to-r,darkblue, blue.500)"
            color="white"
          >
            Buscar Deportista por nombre
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              backgroundColor: "#e0f2f1" /* Color de fondo */,
              minHeight: "40vh", // Asegura que el fondo cubra toda la pantalla
              fontFamily: "Arial, sans-serif", // Estilo de fuente opcional
              padding: "2px", // Espacio opcional para el contenido
            }}
          >
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={1}
              marginLeft={"10px"}
              marginTop={"10px"}
            >
              <GridItem rowSpan={1} colSpan={1}>
                <FormLabel>Nombre:</FormLabel>
                <Input
                  value={nombre}
                  placeholder="Digite el nombre del deportista"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </GridItem>
            </Grid>
            <Table
              variant="striped"
              textAlign="center"
              mb={4}
              style={{ borderSpacing: 0 }}
            >
              <Thead>
                <Tr>
                  <Th>Deportista</Th>
                </Tr>
              </Thead>
              <Tbody>
                {deportistas.map((deportista, index) => (
                  <Tr key={index}>
                    <Td>{deportista.nombre}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        size="sm"
                        onClick={() => {
                          setIsBuscarDeportistaOpen(false);
                          handleClickGuardar(deportista);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={props.isEditarAgendaOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            minWidth: 600,
            minHeight: 500,
          }}
        >
          <ModalHeader
            bgGradient="linear(to-r,darkblue, blue.500)"
            color="white"
          >
            Agregar Deportista al Curso
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              backgroundColor: "#e0f2f1" /* Color de fondo */,
              minHeight: "40vh", // Asegura que el fondo cubra toda la pantalla
              fontFamily: "Arial, sans-serif", // Estilo de fuente opcional
              padding: "2px", // Espacio opcional para el contenido
            }}
          >
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={1}
              marginLeft={"10px"}
              marginTop={"10px"}
            >
              <GridItem rowSpan={1} colSpan={1}>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => setIsBuscarDeportistaOpen(true)}
                  leftIcon={<FaSearch />}
                >
                  Buscar Deportista
                </Button>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormLabel>
                  Curso: {props.grupoSeleccionado.curso.nombre}
                </FormLabel>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormLabel>
                  Profesor: {props.grupoSeleccionado.profesor.nombre}
                </FormLabel>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormLabel>
                  Horario: {props.grupoSeleccionado.dia} de{" "}
                  {props.grupoSeleccionado.horaInicio} -{" "}
                  {props.grupoSeleccionado.horaFin}
                </FormLabel>
              </GridItem>
            </Grid>
            <Table
              variant="striped"
              textAlign="center"
              mb={4}
              style={{ borderSpacing: 0 }}
            >
              <Thead>
                <Tr>
                  <Th>Deportista</Th>
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agendasGrupo.map((agenda, index) => (
                  <Tr key={index}>
                    <Td>{agenda.deportista.nombre}</Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handlerEliminarDeportistaClick(agenda.idAgenda)
                        }
                      >
                        Eliminar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AgendarClase;
