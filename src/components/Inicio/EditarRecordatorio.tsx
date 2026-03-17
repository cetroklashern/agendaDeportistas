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
  NumberInput,
  NumberInputField,
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
  const [diasRecordatorio, setDiasRecordatorio] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [recordatorio, setRecordatorio] = useState<Recordatorio>({
    idRecordatorio: 1,
    titulo: "",
    contenido: "",
    fechaRecordatorio: new Date(),
    diasRecordatorio: 1,
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
          setFechaVisible(new Date(data.fechaRecordatorio));
          setDiasRecordatorio(data.diasRecordatorio);
          setRecordatorio(data);
        }
      } else {
        // Inicializar el recordatorio vacío
        setRecordatorio({
          idRecordatorio: 1,
          titulo: "",
          contenido: "",
          fechaRecordatorio: new Date(),
          diasRecordatorio: 1,
        });
        setTitulo("");
        setContenido("");
        setFechaVisible(new Date());
        setDiasRecordatorio(1);
      }
    } catch (error) {
      console.error("Error al cargar el recordatorio:", error);
    }
  }, [props.isEditarRecordatorioOpen]);

  useEffect(() => {
    const isValid =
      titulo !== "" &&
      contenido !== "" &&
      fechaVisible !== undefined &&
      diasRecordatorio !== undefined;
    setIsFormValid(isValid);
  }, [titulo, contenido, fechaVisible, diasRecordatorio]);

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
          diasRecordatorio
        );
      } else {
        nuevoRecordatorio = new Recordatorio(
          recordatorio.idRecordatorio,
          titulo,
          contenido,
          fechaVisible,
          diasRecordatorio
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
        <ModalHeader bgGradient="linear(to-r, #E91E8C, #29B6F6)" color="white" fontFamily="'Fredoka One', cursive" fontSize="22px">
          📝 Editar Recordatorio
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody bg="white" minHeight="40vh">
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
              <FormControl isRequired>
                <FormLabel>Días Recordatorio</FormLabel>
                <NumberInput
                  value={diasRecordatorio}
                  defaultValue={0}
                  onChange={(value) => setDiasRecordatorio(Number(value))}
                >
                  <NumberInputField />
                </NumberInput>
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
