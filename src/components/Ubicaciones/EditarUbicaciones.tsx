import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ServicioUbicaciones } from "../../services/ServicioUbicaciones";
import { Ubicacion } from "../../models/Ubicacion";
import { Disponibilidad } from "../../models/Disponibilidad";
import DateTimePicker from "../Controles/DateTimePicker";
import VerDisponibilidades from "../Disponibilidades/VerDisponibilidades";
import EditarDisponibilidad from "../Disponibilidades/EditarDisponibilidad";
import Telefono from "../Controles/Telefono";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";

type Props = {
  setIsEditing: (element: boolean) => void;
  servicioUbicaciones: ServicioUbicaciones;
  ubicacionSelected: Ubicacion;
  isNewUbicacion: boolean;
  onSaveUbicacion: (element: boolean) => void;
};

function EditarUbicaciones(props: Props) {
  const [nombre, setNombreUbicacion] = useState("");
  const [direccion, setDireccionUbicacion] = useState("");
  const [telefono, setTelefonoUbicacion] = useState("");
  const [nombreContacto, setNombreContactoUbicacion] = useState("");
  const [fechaInicioContrato, setFechaInicioContratoUbicacion] = useState(
    new Date()
  );
  const [fechaFinContrato, setFechaFinContratoUbicacion] = useState(new Date());
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>(
    []
  );
  const [isDisponibilidadsOpen, setIsDisponibilidadsOpen] = useState(false);
  const [disponibilidadSelected, setDisponibilidadSelected] =
    useState<Disponibilidad>(new Disponibilidad(0, "", 0, 0));
  const [isNewDisponibilidad, setIsNewDisponibilidad] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      nombre !== "" &&
      direccion !== "" &&
      telefono !== "" &&
      nombreContacto !== "" &&
      fechaInicioContrato !== null &&
      fechaFinContrato !== null &&
      disponibilidades.length > 0;
    setIsFormValid(isValid);
  }, [
    nombre,
    direccion,
    telefono,
    nombreContacto,
    fechaInicioContrato,
    fechaFinContrato,
    disponibilidades,
  ]);

  useEffect(() => {
    if (props.ubicacionSelected) {
      setNombreUbicacion(props.ubicacionSelected.nombre);
      setDireccionUbicacion(props.ubicacionSelected.direccion);
      setTelefonoUbicacion(props.ubicacionSelected.telefono);
      setNombreContactoUbicacion(props.ubicacionSelected.nombreContacto);
      setFechaInicioContratoUbicacion(
        props.ubicacionSelected.fechaInicioContrato
      );
      setFechaFinContratoUbicacion(props.ubicacionSelected.fechaFinContrato);
      if (props.isNewUbicacion) {
        setDisponibilidades([]);
      } else {
        setDisponibilidades(props.ubicacionSelected.disponibilidades);
      }
    }
  }, [props.ubicacionSelected]);

  const handleClickCancelar = (event: boolean) => {
    props.setIsEditing(event);
  };

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = async () => {
    // Crear el objeto
    const nuevaUbicacion = new Ubicacion(
      1,
      nombre,
      direccion,
      telefono,
      nombreContacto,
      true,
      fechaInicioContrato,
      fechaFinContrato,
      disponibilidades
    );

    // Se envian los datos capturados a una base de datos
    //console.log(nuevaUbicacion);

    if (props.isNewUbicacion) {
      await props.servicioUbicaciones?.crearUbicacion(nuevaUbicacion);
    } else {
      await props.servicioUbicaciones?.actualizarUbicacion(nuevaUbicacion);
    }

    props.onSaveUbicacion(true);
  };

  function handleClickDisponibilidades(id: number, isNew: boolean): void {
    if (!isNew) {
      if (disponibilidades.length > 0) {
        const disponibilidad = disponibilidades.find(
          (disponibilidad) => disponibilidad.id === id
        );
        if (disponibilidad) {
          setDisponibilidadSelected(disponibilidad);
        }
      } else {
        console.error("No Disponibilidades found.");
      }
    } else {
      setDisponibilidadSelected(new Disponibilidad(0, "", 6, 12));
    }

    setIsDisponibilidadsOpen(true);
    setIsNewDisponibilidad(isNew);
  }

  const handleCloseModal = () => {
    setIsDisponibilidadsOpen(false);
  };

  function handleSaveDisponibilidad(disponibilidad: Disponibilidad): void {
    if (disponibilidad !== null) {
      console.log(disponibilidad);
      if (isNewDisponibilidad) {
        disponibilidades.push(disponibilidad);
      } else {
        const index = disponibilidades.findIndex(
          (disp) => disp.id == disponibilidad.id
        );
        if (index > -1) {
          disponibilidades[index] = disponibilidad;
        } else {
          console.error("Disponibilidad not found.");
        }
      }

      setDisponibilidades(disponibilidades);
    }

    setIsDisponibilidadsOpen(false);
  }

  function handlerDeleteDisponibilidad(id: number): void {
    setDisponibilidades(disponibilidades.filter((ac) => ac.id !== id));
  }

  return (
    <>
      <EditarDisponibilidad
        onSave={handleSaveDisponibilidad}
        disponibilidadSeleccionada={disponibilidadSelected}
        isEditarDisponibilidadOpen={isDisponibilidadsOpen}
        onClose={handleCloseModal}
        isNewElement={isNewDisponibilidad}
        idProximaDisponibilidad={
          isNewDisponibilidad
            ? disponibilidades.length == 0
              ? 1
              : disponibilidades[disponibilidades.length - 1].id + 1
            : disponibilidadSelected.id
        }
      ></EditarDisponibilidad>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        margin={"20px"}
        padding={"15px"}
      >
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Nombre Ubicación</FormLabel>
            <Input
              value={nombre}
              placeholder="Digite el nombre de la Ubicación"
              onChange={(e) => setNombreUbicacion(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Dirección</FormLabel>
            <Input
              value={direccion}
              placeholder="Digite la dirección de la Ubicación"
              onChange={(e) => setDireccionUbicacion(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <Telefono
              numeroCelular={Number(telefono)}
              setNumeroCelular={(telefono) =>
                setTelefonoUbicacion(telefono.toString())
              }
              isRequired={true}
              label={"Teléfono"}
              maxLength={10}
            ></Telefono>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Contacto</FormLabel>
            <Input
              value={nombreContacto}
              placeholder="Digite del contacto para ésta Ubicación"
              onChange={(e) => setNombreContactoUbicacion(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <DateTimePicker
            fechaNacimiento={fechaInicioContrato}
            setFechaNacimiento={setFechaInicioContratoUbicacion}
            isRequired={true}
            label={"Fecha inicio de contrato"}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <DateTimePicker
            fechaNacimiento={fechaFinContrato}
            setFechaNacimiento={setFechaFinContratoUbicacion}
            isRequired={true}
            label={"Fecha finalización del contrato"}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
          <FormControl isRequired>
            <FormLabel>Disponibilidades</FormLabel>
            <VerDisponibilidades
              onDelete={handlerDeleteDisponibilidad}
              onClick={handleClickDisponibilidades}
              disponibilidades={disponibilidades}
            ></VerDisponibilidades>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Button
            className="buttonSombreado"
            mt={4}
            colorScheme="blue"
            type="submit"
            margin={"30px"}
            onClick={() => handleClickCancelar(false)}
            leftIcon={<FaRegTimesCircle />}
          >
            Cancelar
          </Button>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Button
            colorScheme={isFormValid ? "blue" : "gray"}
            className="buttonSombreado"
            mt={4}
            type="submit"
            margin={"30px"}
            onClick={() => handleClickGuardar()}
            isDisabled={!isFormValid}
            leftIcon={<FaSave />}
          >
            Guardar
          </Button>
        </GridItem>
      </Grid>
    </>
  );
}

export default EditarUbicaciones;
