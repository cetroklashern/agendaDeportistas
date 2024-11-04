import {
  FormControl,
  FormLabel,
  Button,
  Grid,
  GridItem,
  Select,
  ModalBody,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Disponibilidad } from "../../models/Disponibilidad";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";

type Props = {
  disponibilidadSeleccionada: Disponibilidad;
  isEditarDisponibilidadOpen: boolean;
  onClose: () => void;
  isNewElement: boolean;
  onSave: (disponibilidad: Disponibilidad) => void;
  idProximaDisponibilidad: number;
};

function EditarDisponibilidad(props: Props) {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState(0);
  const [horaFin, setHoraFin] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [disponibilidad] = useState<Disponibilidad | null>(null);

  // Se carga los datos del Disponibilidad seleccionado
  useEffect(() => {
    if (props.disponibilidadSeleccionada) {
      setDia(props.disponibilidadSeleccionada.diaDisponibilidad);
      setHoraInicio(props.disponibilidadSeleccionada.horaInicioDisponibilidad);
      setHoraFin(props.disponibilidadSeleccionada.horaFinDisponibilidad); //);
    }
  }, [props.disponibilidadSeleccionada]);

  useEffect(() => {
    const isValid =
      dia != "" && horaInicio > 0 && horaFin > 0 && horaFin > horaInicio;
    setIsFormValid(isValid);
  }, [dia, horaInicio, horaFin]);

  useEffect(() => {
    if (disponibilidad) {
      setDia(disponibilidad.diaDisponibilidad);
      setHoraInicio(disponibilidad.horaInicioDisponibilidad);
      setHoraFin(disponibilidad.horaFinDisponibilidad);
    }
  }, [disponibilidad]);

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = () => {
    const nuevaDisponibilidad = new Disponibilidad(
      props.idProximaDisponibilidad,
      dia,
      horaInicio,
      horaFin
    );

    // Se envian los datos capturados a una base de datos
    //console.log(nuevaDisponibilidad);

    props.onSave(nuevaDisponibilidad);
  };

  return (
    <>
      <Modal isOpen={props.isEditarDisponibilidadOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            minWidth: 300,
          }}
        >
          <ModalHeader
            bgGradient="linear(to-r,darkblue, blue.500)"
            color="white"
          >
            Editar Disponibilidad
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
                  <FormLabel>Dia de la semana</FormLabel>
                  <Select
                    value={dia}
                    placeholder="Seleccione el día de la semana"
                    onChange={(e) => setDia(e.target.value)}
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Hora de apertura</FormLabel>
                  <NumberInput
                    value={horaInicio}
                    defaultValue={6}
                    max={20}
                    min={6}
                    step={1}
                    onChange={(value) => setHoraInicio(Number(value))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Hora de cierre</FormLabel>
                  <NumberInput
                    value={horaFin}
                    defaultValue={6}
                    max={22}
                    min={7}
                    step={1}
                    onChange={(value) => setHoraFin(Number(value))}
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
    </>
  );
}

export default EditarDisponibilidad;
