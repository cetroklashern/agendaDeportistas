import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Grid,
  GridItem,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ServicioProfesores } from "../../services/ServicioProfesores";
import { Profesor } from "../../models/Profesor";
import { Disponibilidad } from "../../models/Disponibilidad";
import Telefono from "../Controles/Telefono";
import Email from "../Controles/Email";
import EditarDisponibilidad from "../Disponibilidades/EditarDisponibilidad";
import VerDisponibilidades from "../Disponibilidades/VerDisponibilidades";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";

type Props = {
  setIsEditing: (element: boolean) => void;
  profesorSelected: Profesor;
  isNewProfesor: boolean;
  onSaveProfesor: (element: boolean) => void;
  servicioProfesores: ServicioProfesores;
};

function EditarProfesores(props: Props) {
  const [nombreProfesor, setNombreProfesor] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [id, setNumeroId] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  const [eps, setEps] = useState("");
  const [arl, setArl] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [numeroContacto, setNumeroContacto] = useState("");
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
      nombreProfesor !== "" &&
      tipoId !== "" &&
      id !== "" &&
      numeroCelular !== "" &&
      direccion !== "" &&
      eps !== "" &&
      arl !== "" &&
      correoElectronico !== "" &&
      nombreContacto !== "" &&
      numeroContacto !== "" &&
      disponibilidades.length > 0;
    setIsFormValid(isValid);
  }, [
    nombreProfesor,
    tipoId,
    id,
    numeroCelular,
    direccion,
    eps,
    arl,
    correoElectronico,
    nombreContacto,
    numeroContacto,
    disponibilidades,
  ]);

  useEffect(() => {
    if (props.profesorSelected) {
      setNombreProfesor(props.profesorSelected.nombre);
      setDireccion(props.profesorSelected.direccion);
      setNumeroCelular(props.profesorSelected.numeroCelular);
      setTipoId(props.profesorSelected.tipoId);
      setNumeroId(props.profesorSelected.id);
      setEps(props.profesorSelected.eps);
      setArl(props.profesorSelected.arl);
      setNombreContacto(props.profesorSelected.nombreContacto);
      setNumeroContacto(props.profesorSelected.numeroContacto);
      setCorreoElectronico(props.profesorSelected.correoElectronico);

      if (props.isNewProfesor) {
        setDisponibilidades([]);
      } else {
        setDisponibilidades(props.profesorSelected.disponibilidades);
      }
    }
  }, [props.profesorSelected]);

  const handleClickCancelar = (event: boolean) => {
    props.setIsEditing(event);
  };

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = async () => {
    // Crear el objeto
    const nuevoProfesor = new Profesor(
      id,
      nombreProfesor,
      tipoId,
      numeroCelular,
      direccion,
      eps,
      arl,
      correoElectronico,
      nombreContacto,
      numeroContacto,
      disponibilidades
    );

    // Se envian los datos capturados a una base de datos
    console.log(nuevoProfesor);

    if (props.isNewProfesor) {
      await props.servicioProfesores?.crearProfesor(nuevoProfesor);
    } else {
      await props.servicioProfesores?.actualizarProfesor(nuevoProfesor);
    }

    props.onSaveProfesor(true);
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
            <FormLabel>Nombre Profesor</FormLabel>
            <Input
              value={nombreProfesor}
              placeholder="Digite el nombre del Profesor"
              onChange={(e) => setNombreProfesor(e.target.value)}
            />
          </FormControl>
        </GridItem>
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
              onChange={(e) => setNumeroId(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Telefono
            isRequired={true}
            numeroCelular={Number(numeroCelular)}
            setNumeroCelular={(telefono) =>
              setNumeroCelular(telefono.toString())
            }
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
          <FormControl isRequired>
            <FormLabel>EPS</FormLabel>
            <Input
              value={eps}
              placeholder="Digite el nombre de la EPS"
              onChange={(e) => setEps(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>ARL</FormLabel>
            <Input
              value={arl}
              placeholder="Digite el nombre de la ARL"
              onChange={(e) => setArl(e.target.value)}
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
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl>
            <FormLabel>Nombre de Contacto</FormLabel>
            <Input
              value={nombreContacto}
              placeholder="Digite el Nombre del contacto"
              onChange={(e) => setNombreContacto(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Telefono
            isRequired={true}
            numeroCelular={Number(numeroContacto)}
            setNumeroCelular={(telefono) =>
              setNumeroContacto(telefono.toString())
            }
            label={"Número de Contacto"}
            maxLength={10}
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

export default EditarProfesores;
