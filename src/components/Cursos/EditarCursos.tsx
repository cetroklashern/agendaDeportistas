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
  Heading,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ColorPicker } from "chakra-color-picker";
import { ServicioCursos } from "../../services/ServicioCursos";
import { Curso } from "../../models/Curso";
import { FaRegTimesCircle, FaSave } from "react-icons/fa";

type Props = {
  isSubmitting: boolean;
  setIsNewElement: (element: boolean) => void;
  servicioCursos: ServicioCursos;
};

function EditarCursos(props: Props) {
  const [nombreCurso, setNombreCurso] = useState("");
  const [sexo, setSexo] = useState("");
  const [clasificacionEdadInicial, setClasificacionEdadInicial] = useState("");
  const [edadInicial, setEdadInicial] = useState("");
  const [nivel, setNivel] = useState("");
  const [subNivel, setSubNivel] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracionClaseHoras, setDuracionClaseHoras] = useState("0");
  const [duracionClaseMinutos, setDuracionClaseMinutos] = useState("0");
  const [color, setColor] = useState("#FFFFFF");
  const [opcionesModalidad, setOpcionesModalidad] = useState<
    { id: string; value: string }[]
  >([]);
  const [opcionesEdadInicial, setOpcionesEdadInicial] = useState<
    { id: string; value: string }[]
  >([]);
  const [opcionesCategoria, setOpcionesCategoria] = useState<
    { id: string; value: string }[]
  >([]);
  const [opcionesNivel, setOpcionesNivel] = useState<
    { id: string; value: string }[]
  >([]);
  const [opcionesSubNivel, setOpcionesSubNivel] = useState<
    { id: string; value: string }[]
  >([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const customColors = [
    "#FFFFFF" /* White */,
    "#FF0000" /* Red */,
    "#FFA500" /* Orange */,
    "#FFFF00" /* Yellow */,
    "#008000" /* Green */,
    "#0000FF" /* Blue */,
    "#4B0082" /* Indigo */,
    "#EE82EE" /* Violet */,
    "#FF1493" /* Deep Pink */,
    "#00FFFF" /* Aqua */,
    "#FF69B4" /* Hot Pink */,
    "#FFD1DC" /* Light Pink */,
    "#AEC6CF" /* Light Blue */,
    "#77DD77" /* Pastel Green */,
    "#FDFD96" /* Pastel Yellow */,
    "#CDB4DB" /* Pastel Purple */,
    "#FFB347" /* Pastel Orange */,
    "#FF6961" /* Pastel Red */,
    "#AFEEEE" /* Pastel Turquoise */,
    "#FFDAB9" /* Pastel Peach */,
    "#E6E6FA" /* Pastel Lavender */,
    "#98FF98" /* Pastel Mint */,
    "#FF9AA2" /* Pastel Coral */,
    "#B2DFEE" /* Pastel Teal */,
    "#C8A2C8" /* Pastel Lilac */,
    "#F5F5DC" /* Pastel Beige */,
    "#FAFAD2" /* Pastel Gold */,
    "#F49AC2" /* Pastel Magenta */,
    "#A7C7E7" /* Pastel Aqua */,
    "#FFB6C1" /* Pastel Rose */,
    "#DFFF00" /* Pastel Lime */,
    "#87CEFA" /* Pastel Sky Blue */,
    "#C3CDE6" /* Pastel Periwinkle */,
    "#FFD1BA" /* Pastel Salmon */,
    "#D3D3A1" /* Pastel Olive */,
    "#D2B48C" /* Pastel Brown */,
    "#9FA8DA" /* Pastel Indigo */,
    "#D3AF37" /* Pastel Bronze */,
    "#D8D8D8" /* Pastel Silver */,
    "#DC143C" /* Pastel Crimson */,
    "#D2691E" /* Pastel Chocolate */,
  ];

  useEffect(() => {
    const isValid =
      nombreCurso !== "" &&
      sexo !== "" &&
      clasificacionEdadInicial !== "" &&
      edadInicial !== "" &&
      (Number(duracionClaseHoras) > 0 || Number(duracionClaseMinutos) > 0) &&
      color !== "";
    setIsFormValid(isValid);
  }, [
    nombreCurso,
    sexo,
    clasificacionEdadInicial,
    edadInicial,
    duracionClaseHoras,
    duracionClaseMinutos,
    color,
  ]);

  const handleClickCancelar = (event: boolean) => {
    props.setIsNewElement(event);
  };

  const handlerChangeClasificacionEdadInicial = (event: string) => {
    setClasificacionEdadInicial(event);

    if (event === "Maternas") {
      setOpcionesEdadInicial([
        { id: "1t", value: "1er Trimestre" },
        { id: "2t", value: "2do Trimestre" },
        { id: "3t", value: "3er Trimestre" },
      ]);

      setOpcionesCategoria([]);
      setOpcionesModalidad([]);

      setOpcionesSubNivel([
        { id: "1", value: "1" },
        { id: "2", value: "2" },
        { id: "3", value: "3" },
      ]);
    } else if (event === "Bebes") {
      setOpcionesEdadInicial([
        { id: "2m", value: "2 meses" },
        { id: "4m", value: "4 meses" },
        { id: "7m", value: "7 meses" },
        { id: "10m", value: "10 meses" },
      ]);

      setOpcionesCategoria([]);
      setOpcionesModalidad([]);

      setOpcionesSubNivel([
        { id: "1", value: "1" },
        { id: "2", value: "2" },
        { id: "3", value: "3" },
        { id: "4", value: "4" },
      ]);
    } else if (event === "Infantes") {
      setOpcionesEdadInicial([
        { id: "13m", value: "13 meses" },
        { id: "19m", value: "19 meses" },
        { id: "25m", value: "25 meses" },
        { id: "31m", value: "31 meses" },
        { id: "37m", value: "37 meses" },
        { id: "43m", value: "43 meses" },
        { id: "49m", value: "49 meses" },
        { id: "55m", value: "55 meses" },
      ]);

      setOpcionesModalidad([]);

      setOpcionesSubNivel([
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ]);
    } else if (event === "Niños") {
      // Se crea un array con las edades de 4 a 9 años
      setOpcionesEdadInicial([
        { id: "4a", value: "4 años" },
        { id: "5a", value: "5 años" },
        { id: "6a", value: "6 años" },
        { id: "7a", value: "7 años" },
        { id: "8a", value: "8 años" },
        { id: "9a", value: "9 años" },
      ]);

      setOpcionesCategoria([
        { id: "BLR", value: "Bailarines" },
        { id: "FIG", value: "FIG" },
        { id: "USAG", value: "USAG" },
      ]);

      setOpcionesSubNivel([]);
    } else if (event === "Adultos") {
      // Se crea un array con las edades de 18 a 50 años
      setOpcionesEdadInicial(() => {
        const opciones = [];
        for (let i = 18; i <= 50; i++) {
          opciones.push({
            id: i.toString() + "a",
            value: i.toString() + " años",
          });
        }

        return opciones;
      });

      setOpcionesModalidad([]);
      setOpcionesCategoria([]);
      setOpcionesNivel([]);
      setOpcionesSubNivel([]);
    }
  };

  const handleChangeCategoria = (event: string) => {
    console.log(event);
    setCategoria(event);
    if (event === "FIG" || event === "USAG") {
      setOpcionesModalidad([
        { id: "GAF", value: "GAF" },
        { id: "GAM", value: "GAM" },
        { id: "GRD", value: "GRD" },
      ]);
      if (event === "FIG") {
        setOpcionesNivel([
          { id: "TH", value: "Test de Habilidades" },
          { id: "AC1", value: "AC1" },
          { id: "AC2", value: "AC2" },
          { id: "AC3", value: "AC3" },
          { id: "AC4", value: "AC4" },
        ]);

        setOpcionesSubNivel([]);
      } else {
        setOpcionesNivel([
          { id: "TH", value: "Test de Habilidades" },
          { id: "N1", value: "Nivel 1" },
          { id: "N2", value: "Nivel 2" },
          { id: "N3", value: "Nivel 3" },
          { id: "N4", value: "Nivel 4" },
          { id: "N5", value: "Nivel 5" },
          { id: "N6", value: "Nivel 6" },
          { id: "N7", value: "Nivel 7" },
          { id: "N8", value: "Nivel 8" },
          { id: "N9", value: "Nivel 9" },
          { id: "N10", value: "Nivel 10" },
        ]);

        setOpcionesSubNivel([
          { id: "PTS", value: "Principiantes" },
          { id: "INT", value: "Intermedios" },
          { id: "AVZ", value: "Avanzados" },
          { id: "EXP", value: "Expertos" },
        ]);
      }
    } else if (event === "Bailarines") {
      setOpcionesModalidad([
        { id: "IND", value: "Individual" },
        { id: "PAR", value: "Parejas" },
      ]);

      setOpcionesSubNivel([
        { id: "BAS", value: "Básico" },
        { id: "INT", value: "Intermedio" },
        { id: "AVZ", value: "Avanzado" },
      ]);

      setOpcionesNivel([{ id: "acr", value: "Acrobacia" }]);
    } else {
      setOpcionesModalidad([]);
      setOpcionesNivel([]);
    }
  };

  //evento para guardar los datos capturados en pantalla
  const handleClickGuardar = async (event: boolean) => {
    // Crear el objeto curso con los datos capturados
    const nuevoCurso = new Curso(
      1,
      nombreCurso,
      sexo,
      clasificacionEdadInicial,
      edadInicial,
      nivel,
      subNivel,
      modalidad,
      categoria,
      duracionClaseHoras,
      duracionClaseMinutos,
      color
    );

    // Se envian los datos capturados a una base de datos
    console.log(nuevoCurso);

    const cursoCreado = await props.servicioCursos?.agregarCurso(nuevoCurso);

    if (!!cursoCreado) {
      props.setIsNewElement(event);
    } else {
      console.error("Error al crear el curso");
    }
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="2xl"
        border="2px solid"
        borderColor="#F48FB1"
        boxShadow="0 4px 20px rgba(233,30,140,0.1)"
        m={4}
        overflow="hidden"
      >
        {/* Header del formulario */}
        <Box
          bgGradient="linear(to-r, #E91E8C, #29B6F6)"
          px={6}
          py={4}
        >
          <Heading size="md" color="white" fontFamily="'Fredoka One', cursive">
            📚 Nuevo Curso
          </Heading>
        </Box>

        <Box p={5}>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Nombre Curso</FormLabel>
            <Input
              placeholder="Digite el nombre del Curso"
              onChange={(e) => setNombreCurso(e.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Sexo</FormLabel>
            <Select
              placeholder="Seleccione una opción"
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Mixto">Mixto</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Clasificación Edad</FormLabel>
            <Select
              onChange={(e) =>
                handlerChangeClasificacionEdadInicial(e.target.value)
              }
              placeholder="Seleccione una opción"
            >
              <option value="Maternas">Maternas</option>
              <option value="Bebes">Bebes</option>
              <option value="Infantes">Infantes</option>
              <option value="Niños">Niños</option>
              <option value="Adultos">Adultos</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Edad Inicial</FormLabel>
            <Select
              value={edadInicial}
              onChange={(e) => setEdadInicial(e.target.value)}
              disabled={opcionesEdadInicial.length === 0}
            >
              <option value="">Seleccione una opción</option>
              {opcionesEdadInicial.map((opcion) => (
                <option key={opcion.id} value={opcion.value}>
                  {opcion.value}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        {clasificacionEdadInicial === "Adultos" ? (
          <>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl>
                <FormLabel>Categoria</FormLabel>
                <Input placeholder="Categoria" />
              </FormControl>
            </GridItem>
          </>
        ) : (
          <>
            <GridItem rowSpan={1} colSpan={1}>
              <FormControl>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={categoria}
                  onChange={(e) => handleChangeCategoria(e.target.value)}
                  disabled={opcionesCategoria.length === 0}
                >
                  <option value="">Seleccione una opción</option>
                  {opcionesCategoria.map((opcion) => (
                    <option key={opcion.id} value={opcion.value}>
                      {opcion.value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </>
        )}
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl>
            <FormLabel>Modalidad</FormLabel>
            <Select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              disabled={opcionesModalidad.length === 0}
            >
              <option value="">Seleccione una opción</option>
              {opcionesModalidad.map((opcion) => (
                <option key={opcion.id} value={opcion.value}>
                  {opcion.value}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl>
            <FormLabel>Nivel</FormLabel>
            <Select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              disabled={opcionesNivel.length === 0}
            >
              <option value="">Seleccione una opción</option>
              {opcionesNivel.map((opcion) => (
                <option key={opcion.id} value={opcion.value}>
                  {opcion.value}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl>
            <FormLabel>SubNivel</FormLabel>
            <Select
              value={subNivel}
              onChange={(e) => setSubNivel(e.target.value)}
              disabled={opcionesSubNivel.length === 0}
            >
              <option value="">Seleccione una opción</option>
              {opcionesSubNivel.map((opcion) => (
                <option key={opcion.id} value={opcion.value}>
                  {opcion.value}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Duracion Clase</FormLabel>
            <Grid templateColumns="repeat(2, 1fr)">
              <NumberInput
                defaultValue={0}
                min={0}
                max={4}
                onChange={(value) => setDuracionClaseHoras(value)}
                format={(value) => `${value} hora(s)`}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <NumberInput
                defaultValue={0}
                min={0}
                max={30}
                step={30}
                onChange={(value) => setDuracionClaseMinutos(value)}
                format={(value) => `${value} minuto(s)`}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Grid>
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Color</FormLabel>
            <Box border="2px solid teal" borderRadius="md" p={1} width={"52px"}>
              <ColorPicker
                defaultColor={color}
                onChange={setColor}
                colors={customColors}
              />
            </Box>
          </FormControl>
        </GridItem>
      </Grid>
      <Box display="flex" gap={3} pt={2} pb={2}>
        <Button
          className="buttonSombreado"
          colorScheme="blue"
          isLoading={props.isSubmitting}
          type="submit"
          onClick={() => handleClickCancelar(false)}
          leftIcon={<FaRegTimesCircle />}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          className="buttonSombreado"
          colorScheme={isFormValid ? "blue" : "gray"}
          isLoading={props.isSubmitting}
          type="submit"
          onClick={() => handleClickGuardar(false)}
          isDisabled={!isFormValid}
          leftIcon={<FaSave />}
        >
          Guardar
        </Button>
      </Box>
        </Box>
      </Box>
    </>
  );
}

export default EditarCursos;
