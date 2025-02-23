import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Grid,
  GridItem,
  Select,
  Checkbox,
  ModalBody,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Acudiente } from "../../models/Acudiente";
import Telefono from "../Controles/Telefono";
import Email from "../Controles/Email";
import { Constantes } from "../../models/Constantes";
import { ServicioAcudientes } from "../../services/ServicioAcudientes";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";

type Props = {
  acudienteSeleccionado: Acudiente;
  isEditarAcudienteOpen: boolean;
  onClose: () => void;
  idDeportista: string;
  isNewElement: boolean;
  onSave: (acudiente: Acudiente) => void;
};

function EditarAcudientes(props: Props) {
  const [nombre, setNombreAcudiente] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [id, setId] = useState("");
  const [numeroCelular, setNumeroCelular] = useState(0);
  const [direccion, setDireccion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [imagenPropia, setImagenPropia] = useState<boolean>(false);
  const [profesionEmpresa, setProfesionEmpresa] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [acudiente, setAcudiente] = useState<Acudiente | null>(null);
  const [loading, setLoading] = useState(false);

  const servicioAcudientes = ServicioAcudientes.getInstancia();

  // Se carga los datos del acudiente seleccionado
  useEffect(() => {
    if (props.acudienteSeleccionado) {
      setNombreAcudiente(props.acudienteSeleccionado.nombre);
      setTipoId(props.acudienteSeleccionado.tipoId);
      setId(props.acudienteSeleccionado.id);
      setNumeroCelular(props.acudienteSeleccionado.numeroCelular);
      setDireccion(props.acudienteSeleccionado.direccion);
      setCorreoElectronico(props.acudienteSeleccionado.correoElectronico);
      setImagenPropia(props.acudienteSeleccionado.imagenPropia);
      setProfesionEmpresa(props.acudienteSeleccionado.profesionEmpresa);
      setParentesco(props.acudienteSeleccionado.parentesco);
    }
  }, [props.acudienteSeleccionado]);

  useEffect(() => {
    const isValid =
      nombre !== "" &&
      tipoId !== "" &&
      id !== "" &&
      numeroCelular > 0 &&
      direccion !== "" &&
      correoElectronico !== "" &&
      profesionEmpresa !== "" &&
      parentesco !== "";
    setIsFormValid(isValid);
  }, [
    id,
    numeroCelular,
    direccion,
    correoElectronico,
    profesionEmpresa,
    parentesco,
  ]);

  useEffect(() => {
    if (acudiente) {
      setNombreAcudiente(acudiente.nombre);
      setTipoId(acudiente.tipoId);
      setId(acudiente.id);
      setNumeroCelular(acudiente.numeroCelular);
      setDireccion(acudiente.direccion);
      setCorreoElectronico(acudiente.correoElectronico);
      setImagenPropia(acudiente.imagenPropia);
      setProfesionEmpresa(acudiente.profesionEmpresa);
    }
  }, [acudiente]);

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = () => {
    // TO DO Crear el objeto en base de datos
    if (!props.isNewElement) {
    }
    const nuevoAcudiente = new Acudiente(
      id,
      nombre,
      tipoId,
      numeroCelular,
      direccion,
      correoElectronico,
      imagenPropia,
      profesionEmpresa,
      parentesco
    );

    // Se envian los datos capturados a una base de datos
    //console.log(nuevoAcudiente);

    props.onSave(nuevoAcudiente);
  };

  const handlerChangeId = async (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    if (e.target.value.length > 5) {
      // Empieza a buscar después de 5 caracteres
      setLoading(true);
      const acudiente = await servicioAcudientes.obtenerAcudiente(
        e.target.value
      );

      if (acudiente != null) {
        setAcudiente(acudiente);
      }
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={props.isEditarAcudienteOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          minWidth: 600,
        }}
      >
        <ModalHeader bgGradient="linear(to-r,darkblue, blue.500)" color="white">
          Editar Acudiente
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          style={{
            backgroundColor: "#e0f2f1" /* Color de fondo */,
            minHeight: "70vh", // Asegura que el fondo cubra toda la pantalla
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
                <FormLabel>Tipo de identificación</FormLabel>
                <Select
                  value={tipoId}
                  placeholder="Seleccione el numero de identificación"
                  onChange={(e) => setTipoId(e.target.value)}
                >
                  <option value="Cedula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Numero de Identificación</FormLabel>
                <Input
                  value={id}
                  placeholder="Digite el numero de Identificación"
                  onChange={handlerChangeId}
                />
              </FormControl>
              {loading && <p>Cargando...</p>}
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Nombre Acudiente</FormLabel>
                <Input
                  value={nombre}
                  placeholder="Digite el nombre del Acudiente"
                  onChange={(e) => setNombreAcudiente(e.target.value)}
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <Telefono
                isRequired={true}
                numeroCelular={numeroCelular}
                setNumeroCelular={(e) => setNumeroCelular(e)}
                label={"Número Celular"}
                maxLength={10}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Dirección</FormLabel>
                <Input
                  value={direccion}
                  placeholder="Digite la dirección"
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <Email
                isRequired={true}
                correoElectronico={correoElectronico}
                setCorreoElectronico={(e) => setCorreoElectronico(e)}
                label={"Correo Electronico"}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              <FormControl isRequired>
                <Checkbox
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "black",
                    },
                    "&:checked .chakra-checkbox__control": {
                      borderColor: "black",
                    },
                  }}
                  isChecked={imagenPropia}
                  onChange={(e) => {
                    setImagenPropia(e.target.checked);
                  }}
                >
                  {Constantes.IMAGEN_PROPIA_LABEL}
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Profesion Empresa</FormLabel>
                <Input
                  value={profesionEmpresa}
                  placeholder="Digite su cargo actual"
                  onChange={(e) => setProfesionEmpresa(e.target.value)}
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl isRequired>
                <FormLabel>Parentesco</FormLabel>
                <Input
                  value={parentesco}
                  placeholder="Digite el parentesco con el deportista"
                  onChange={(e) => setParentesco(e.target.value)}
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
}

export default EditarAcudientes;
