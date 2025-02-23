import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalBody,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ServicioRecordatorios } from "../../services/ServicioRecordatorios";
import Recordatorio from "../../models/Recordatorio";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";
import DateTimePicker from "../Controles/DateTimePicker";

type Props = {
  idRecordatorio: number;
  isNewRecord: boolean;
  isEditarRecordatorioOpen: boolean;
  onClose: () => void;
  onSave: (recordatorio: Recordatorio) => void;
};

const EditRecordatorio = (props: Props) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fechaVisible, setFechaVisible] = useState(new Date());
  const [fechaFinVisible, setFechaFinVisible] = useState(new Date());
  const [isFormValid, setIsFormValid] = useState(false);
  const [recordatorio, setRecordatorio] = useState<Recordatorio>({
    idRecordatorio: 1,
    titulo: "",
    contenido: "",
    fechaVisible: new Date(),
    fechaFinVisible: new Date(),
  });

  useEffect(() => {
    try {
      if (!props.isNewRecord) {
        // Cargar el recordatorio para editar
        const data = ServicioRecordatorios.getInstancia().obtenerRecordatorio(
          props.idRecordatorio
        );

        if (data) {
          setTitulo(data?.titulo);
          setContenido(data?.contenido);
          setFechaVisible(new Date(data.fechaVisible));
          setFechaFinVisible(new Date(data.fechaFinVisible));
          setRecordatorio(data);
        }
      } else {
        // Inicializar el recordatorio vacío
        setRecordatorio({
          idRecordatorio: 1,
          titulo: "",
          contenido: "",
          fechaVisible: new Date(),
          fechaFinVisible: new Date(),
        });
      }
    } catch (error) {
      console.error("Error al cargar el recordatorio:", error);
    }
  }, [props.idRecordatorio]);

  useEffect(() => {
    const isValid =
      titulo !== "" &&
      contenido !== "" &&
      fechaVisible !== undefined &&
      fechaFinVisible !== undefined;
    setIsFormValid(isValid);
  }, [titulo, contenido, fechaVisible, fechaFinVisible]);

  const handleClickGuardar = async () => {
    // Realizar la solicitud PUT para actualizar el recordatorio
    try {
      let nuevoRecordatorio;
      if (props.isNewRecord) {
        nuevoRecordatorio = new Recordatorio(
          1,
          titulo,
          contenido,
          fechaVisible,
          fechaFinVisible
        );
      } else {
        nuevoRecordatorio = new Recordatorio(
          recordatorio.idRecordatorio,
          titulo,
          contenido,
          fechaVisible,
          fechaFinVisible
        );
      }
      props.onSave(nuevoRecordatorio);
    } catch (error) {
      console.error("Error al actualizar el recordatorio:", error);
    }
  };

  return (
    <Modal isOpen={props.isEditarRecordatorioOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          minWidth: 600,
        }}
      >
        <ModalHeader bgGradient="linear(to-r,darkblue, blue.500)" color="white">
          Editar Recordatorio
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
            templateColumns="repeat(2, 1fr)"
            gap={6}
            margin={"20px"}
            padding={"15px"}
          >
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  type="text"
                  name="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ingrese el título"
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Contenido</FormLabel>
                <Textarea
                  name="contenido"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder="Ingrese el contenido"
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl>
                <DateTimePicker
                  fechaNacimiento={fechaVisible}
                  setFechaNacimiento={setFechaVisible}
                  isRequired={true}
                  label={"Fecha inicio"}
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl>
                <DateTimePicker
                  fechaNacimiento={fechaFinVisible}
                  setFechaNacimiento={setFechaFinVisible}
                  isRequired={true}
                  label={"Fecha fin"}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={props.onClose}
            leftIcon={<FaRegTimesCircle />}
          >
            Cerrar
          </Button>
          <Button
            colorScheme={isFormValid ? "blue" : "gray"}
            onClick={() => handleClickGuardar()}
            isDisabled={!isFormValid}
            leftIcon={<FaSave />}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditRecordatorio;
