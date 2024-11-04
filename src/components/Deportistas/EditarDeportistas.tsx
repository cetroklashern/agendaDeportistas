import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Grid,
  GridItem,
  Select,
  NumberInput,
  NumberInputField,
  Box,
  Checkbox,
  Image,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import { Deportista } from "../../models/Deportista";
import React from "react";
import VerAcudientes from "../Acudiente/VerAcudiente";
import EditarAcudientes from "../Acudiente/EditarAcudientes";
import { Acudiente } from "../../models/Acudiente";
import DateTimePicker from "../Controles/DateTimePicker";
import { Constantes } from "../../models/Constantes";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";
//import { Acudiente } from "../../models/Acudiente";

type Props = {
  setIsEditing: (element: boolean) => void;
  servicioDeportistas: ServicioDeportistas;
  deportistaSelected: Deportista;
  isNewDeportista: boolean;
  fotoDeportistaActual: string;
  fotoDocumentoActual: string;
  onSaveDeportista: (element: boolean) => void;
};

function EditarDeportistas(props: Props) {
  const [nombre, setNombreDeportista] = useState("");
  const [edad, setEdad] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [tipoId, setTipoId] = useState("");
  const [id, setId] = useState("");
  const [direccion, setDireccion] = useState("");
  const [eps, setEps] = useState("");
  const [institucionEducativa, setInstitucioneducativa] = useState("");
  const [grado, setGrado] = useState(0);
  const [condicionImportante, setCondicionImportante] = useState("");
  const [imagenPropia, setImagenPropia] = useState<boolean>(false);
  const [informacionMensualidad, setInformacionMensualidad] =
    useState<boolean>(false);
  const [informacionReposicion, setInformacionReposicion] =
    useState<boolean>(false);
  const [informacionVacaciones, setInformacionVacaciones] =
    useState<boolean>(false);
  const [comprobanteInscripcion, setComprobanteInscripcion] =
    useState<boolean>(false);
  const [acudientes, setAcudientes] = useState<Acudiente[]>([]);
  const [fotoDeportista, setFotoDeportista] = useState<File | null>(null);
  const [fotoDocumento, setFotoDocumento] = useState<File | null>(null);
  const [fotoDeportistaUrl, setFotoDeportistaUrl] = useState<string>("");
  const [fotoDocumentoUrl, setFotoDocumentoUrl] = useState<string>("");
  const [isAcudientesOpen, setIsAcudientesOpen] = useState(false);
  const [acudienteSelected, setAcudienteSelected] = useState<Acudiente>({
    id: "0",
    tipoId: "",
    nombre: "",
    direccion: "",
    numeroCelular: 0,
    correoElectronico: "",
    imagenPropia: false,
    profesionEmpresa: "",
    parentesco: "",
  });
  const [isNewAcudiente, setIsNewAcudiente] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isValid =
      nombre !== "" &&
      tipoId !== "" &&
      id !== "" &&
      edad > 0 &&
      direccion !== "" &&
      eps !== "" &&
      institucionEducativa !== "" &&
      imagenPropia !== null &&
      informacionMensualidad !== null &&
      informacionReposicion !== null &&
      informacionVacaciones !== null &&
      comprobanteInscripcion !== null &&
      acudientes.length > 0 &&
      fotoDeportista !== undefined &&
      fotoDocumento !== undefined;
    setIsFormValid(isValid);
  }, [
    id,
    nombre,
    edad,
    tipoId,
    eps,
    institucionEducativa,
    grado,
    imagenPropia,
    informacionMensualidad,
    informacionReposicion,
    informacionVacaciones,
    comprobanteInscripcion,
    acudientes,
    fotoDeportista,
    fotoDocumento,
  ]);

  useEffect(() => {
    if (props.deportistaSelected) {
      setNombreDeportista(props.deportistaSelected.nombre);
      setFechaNacimiento(props.deportistaSelected.fechaNacimiento);
      setTipoId(props.deportistaSelected.tipoId);
      setId(props.deportistaSelected.id);
      setDireccion(props.deportistaSelected.direccion);
      setEps(props.deportistaSelected.eps);
      setInstitucioneducativa(props.deportistaSelected.institucionEducativa);
      setGrado(props.deportistaSelected.grado);
      setCondicionImportante(props.deportistaSelected.condicionImportante);
      setImagenPropia(props.deportistaSelected.imagenPropia);
      setInformacionMensualidad(
        props.deportistaSelected.informacionMensualidad
      );
      setInformacionReposicion(props.deportistaSelected.informacionReposicion);
      setInformacionVacaciones(props.deportistaSelected.informacionVacaciones);
      setComprobanteInscripcion(
        props.deportistaSelected.comprobanteInscripcion
      );
      if (props.isNewDeportista) {
        setAcudientes([]);
      } else {
        setAcudientes(props.deportistaSelected.acudientes);
      }
    }
  }, [props.deportistaSelected]);

  useEffect(() => {
    if (fechaNacimiento != null) {
      console.log("Fecha Nacimiento: " + fechaNacimiento);
      //calcular la edad a partir de la fecha de nacimiento
      const hoy = new Date();
      const fechaNacimientoDeportista = new Date(fechaNacimiento);
      let edadCaculada =
        hoy.getFullYear() - fechaNacimientoDeportista.getFullYear();
      const mes = hoy.getMonth() - fechaNacimientoDeportista.getMonth();

      if (
        mes < 0 ||
        (mes === 0 && hoy.getDate() < fechaNacimientoDeportista.getDate())
      ) {
        edadCaculada--;
      }

      if (edadCaculada <= 0) {
        //calcular los meses de nacimiento
        const diasNacimiento =
          hoy.getDate() - fechaNacimientoDeportista.getDate();
        const mesesNacimiento =
          hoy.getMonth() - fechaNacimientoDeportista.getMonth();
        const añosNacimiento =
          hoy.getFullYear() - fechaNacimientoDeportista.getFullYear();
        edadCaculada = añosNacimiento * 12 + mesesNacimiento;
        if (diasNacimiento < 0) {
          edadCaculada--;
        }

        edadCaculada = edadCaculada / 12;
      }

      setEdad(edadCaculada);
    }
  }, [fechaNacimiento]);

  const handleClickCancelar = (event: boolean) => {
    props.setIsEditing(event);
  };

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = async () => {
    // Crear el objeto
    const nuevoDeportista = new Deportista(
      id,
      nombre,
      edad,
      fechaNacimiento,
      tipoId,
      direccion,
      eps,
      institucionEducativa,
      grado,
      condicionImportante,
      imagenPropia,
      "",
      "",
      fotoDeportistaUrl,
      fotoDocumentoUrl,
      informacionMensualidad,
      informacionReposicion,
      informacionVacaciones,
      comprobanteInscripcion,
      acudientes
    );

    // Se envian los datos capturados a una base de datos
    //console.log(nuevoDeportista);

    if (props.isNewDeportista) {
      await props.servicioDeportistas?.crearDeportista(
        nuevoDeportista,
        fotoDeportista,
        fotoDocumento
      );
    } else {
      await props.servicioDeportistas?.actualizarDeportista(
        nuevoDeportista,
        fotoDeportista,
        fotoDocumento
      );
    }

    props.onSaveDeportista(true);
  };

  const handleFileChange = async (
    nombre: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      try {
        const file = files[0];
        // Verificar el tipo de archivo
        const validTypes = ["image/jpeg", "image/bmp"];
        if (!validTypes.includes(file.type)) {
          setErrorMessage("Solo se permiten archivos JPG y BMP.");
          return;
        }

        // Verificar el tamaño del archivo
        const maxSizeInBytes = 800 * 1024; // 500KB
        if (file.size > maxSizeInBytes) {
          setErrorMessage("El archivo no debe exceder los 800KB.");
          return;
        }

        // Si pasa ambas validaciones, procede con el manejo del archivo
        setErrorMessage("");
        if (nombre == "Documento") {
          setFotoDocumento(file);
          // Crear una URL para la vista previa
          const fotoDocumentoUrl = URL.createObjectURL(file);
          setFotoDocumentoUrl(fotoDocumentoUrl);
        } else {
          setFotoDeportista(file); // Crear una URL para la vista previa
          const fotoDeportistaUrl = URL.createObjectURL(file);
          setFotoDeportistaUrl(fotoDeportistaUrl);
        }
      } catch (error) {
        console.error("Error creating ImageBitmap:", error);
      }
    }
  };

  function handleClickAcudientes(id: string, isNew: boolean): void {
    if (!isNew) {
      if (acudientes.length > 0) {
        const acudiente = acudientes.find((acudiente) => acudiente.id === id);
        if (acudiente) {
          setAcudienteSelected(acudiente);
        }
      } else {
        console.error("No acudientes found.");
      }
    } else {
      setAcudienteSelected({
        id: "0",
        tipoId: "",
        nombre: "",
        direccion: "",
        numeroCelular: 0,
        correoElectronico: "",
        imagenPropia: false,
        profesionEmpresa: "",
        parentesco: "",
      });
    }

    setIsAcudientesOpen(true);
    setIsNewAcudiente(isNew);
  }

  const handleCloseModal = () => {
    setIsAcudientesOpen(false);
  };

  function handleSaveAcudiente(acudiente: Acudiente): void {
    if (acudiente !== null) {
      if (isNewAcudiente) {
        acudientes.push(acudiente);
      } else {
        const index = acudientes.findIndex((ac) => ac.id === acudiente.id);
        if (index > -1) {
          acudientes[index] = acudiente;
        } else {
          console.error("Acudiente not found.");
        }
      }

      setAcudientes(acudientes);
    }

    setIsAcudientesOpen(false);
  }

  function handlerDeleteAcudiente(id: string): void {
    setAcudientes(acudientes.filter((ac) => ac.id !== id));
  }

  function mostrarEdad(): React.ReactNode {
    if (edad > 1) {
      return <span>{edad} años</span>;
    } else if (edad == 1) {
      return <span>{edad} año</span>;
    } else {
      return <span>{edad * 12} meses</span>;
    }
  }

  return (
    <>
      <EditarAcudientes
        onSave={handleSaveAcudiente}
        acudienteSeleccionado={acudienteSelected}
        isEditarAcudienteOpen={isAcudientesOpen}
        onClose={handleCloseModal}
        idDeportista={id}
        isNewElement={isNewAcudiente}
      ></EditarAcudientes>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        margin={"20px"}
        padding={"15px"}
      >
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Nombre Deportista</FormLabel>
            <Input
              value={nombre}
              placeholder="Digite el nombre del Deportista"
              onChange={(e) => setNombreDeportista(e.target.value)}
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
              <option value="Pasaporte">Tarjeta de identidad</option>
              <option value="Cedula">Cédula</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Pasaporte">Registro civil</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Numero de Identificación</FormLabel>
            <Input
              readOnly={!props.isNewDeportista}
              value={id}
              placeholder="Digite el numero de Identificación"
              onChange={(e) => setId(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <DateTimePicker
            fechaNacimiento={fechaNacimiento}
            setFechaNacimiento={setFechaNacimiento}
            isRequired={true}
            label={"Fecha de Nacimiento"}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl>
            <FormLabel>Edad</FormLabel>
            <FormLabel>{mostrarEdad()}</FormLabel>
          </FormControl>
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
            <FormLabel>Institucion educativa</FormLabel>
            <Input
              value={institucionEducativa}
              placeholder="Digite la institucion educativa a la que pertenece el deportista"
              onChange={(e) => setInstitucioneducativa(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Grado</FormLabel>
            <NumberInput
              value={grado}
              defaultValue={0}
              onChange={(value) => setGrado(Number(value))}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={3}>
          <FormControl isRequired>
            <FormLabel>Acudientes</FormLabel>
            <VerAcudientes
              onDelete={handlerDeleteAcudiente}
              onClick={handleClickAcudientes}
              acudientes={acudientes}
            ></VerAcudientes>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4}>
          <FormControl isRequired>
            <FormLabel>{Constantes.CONDICION_IMPORTANTE_LABEL}</FormLabel>
            <Textarea
              value={condicionImportante}
              placeholder="Indique si el deportista presenta alguna condicion importante"
              onChange={(e) => setCondicionImportante(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
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
              onChange={(e) => setImagenPropia(e.target.checked)}
            >
              <FormLabel>{Constantes.IMAGEN_PROPIA_LABEL}</FormLabel>
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
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
              isChecked={informacionMensualidad}
              onChange={(e) => setInformacionMensualidad(e.target.checked)}
            >
              <FormLabel>{Constantes.INFORMACION_MENSUALIDAD_LABEL}</FormLabel>
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
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
              isChecked={informacionReposicion}
              onChange={(e) => setInformacionReposicion(e.target.checked)}
            >
              <FormLabel>{Constantes.INFORMACION_REPOSICION_LABEL}</FormLabel>
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
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
              isChecked={informacionVacaciones}
              onChange={(e) => setInformacionVacaciones(e.target.checked)}
            >
              <FormLabel>{Constantes.INFORMACION_VACACIONES_LABEL}</FormLabel>
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
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
              isChecked={comprobanteInscripcion}
              onChange={(e) => setComprobanteInscripcion(e.target.checked)}
            >
              <FormLabel>{Constantes.COMPROBANTE_INSCRIPCION_LABEL}</FormLabel>
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <FormControl isRequired>
            <FormLabel>Foto del deportista</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange("Deportista", e);
              }}
            />
            {errorMessage && (
              <FormHelperText color="red.500">{errorMessage}</FormHelperText>
            )}
            {fotoDeportistaUrl != "" ? (
              <Box mt={4}>
                <Image
                  src={fotoDeportistaUrl}
                  alt="Sin Foto"
                  maxW="400px"
                  maxH="200px"
                  borderRadius="md"
                />
              </Box>
            ) : (
              <Box mt={4}>
                <Image
                  src={`data:image/jpeg;base64,${props.fotoDeportistaActual}`}
                  alt="Sin Foto"
                  maxW="400px"
                  maxH="200px"
                  borderRadius="md"
                />
              </Box>
            )}
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <FormControl isRequired>
            <FormLabel>Foto del documento</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange("Documento", e);
              }}
            />
            {fotoDocumentoUrl != "" ? (
              <Box mt={4}>
                <Image
                  src={fotoDocumentoUrl}
                  alt="Sin Foto"
                  maxW="400px"
                  maxH="200px"
                  borderRadius="md"
                />
              </Box>
            ) : (
              <Box mt={4}>
                <Image
                  src={`data:image/jpeg;base64,${props.fotoDocumentoActual}`}
                  alt="Sin Foto"
                  maxW="400px"
                  maxH="200px"
                  borderRadius="md"
                />
              </Box>
            )}
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

export default EditarDeportistas;
