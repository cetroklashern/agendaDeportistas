import {
  TableContainer,
  Table,
  Th,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import { Deportista } from "../../models/Deportista";
import { FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";

type Props = {
  onNewDeportistaClick: (element: boolean) => void;
  servicioDeportistas: ServicioDeportistas;
  onSelect: (deportista: Deportista) => void;
  isEditing: boolean;
};

function VerDeportistas(props: Props) {
  const [isEliminated, setIsEliminated] = useState(false);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [fotos, setFotos] = useState<Record<string, string>>({});

  //al cargar el formulario se deben obtener los cursos usando el servicioCursos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await props.servicioDeportistas.obtenerDeportistas();
        setDeportistas(data);
      } catch (error) {
        console.error("Error fetching deportistas:", error);
      }
    };
    console.log("CARGANDO DATOS...");
    fetchData();
  }, [props.isEditing]);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const fotosData: Record<string, string> = {};
        for (let deportista of deportistas) {
          const response =
            await props.servicioDeportistas.obtenerFotoDeportista(
              deportista.id
            );

          fotosData[deportista.id] = `data:image/jpeg;base64,${response}`;
        }

        setFotos(fotosData);
      } catch (error) {
        console.error("Error fetching fotos", error);
      }
    };

    if (deportistas.length > 0) {
      fetchFotos();
    }
  }, [deportistas]);

  const handleClick = () => {
    props.onNewDeportistaClick(true);
  };

  const handleClickVer = (id: string) => {
    const deportistaSelected = deportistas.find(
      (deportista) => deportista.id === id
    );
    // Se selecciona el deportista para ver sus detalles o editarlos
    if (deportistaSelected != null) {
      props.onSelect(deportistaSelected);
    }
  };

  const handleClickEliminar = (id: string) => {
    //Se elimina el deportista de la BD
    props.servicioDeportistas.eliminarDeportistas(id);

    //Actualizar la vista
    setDeportistas(deportistas.filter((d) => d.id !== id));

    setIsEliminated(!isEliminated);
  };

  // Formatear la fecha en un formato legible
  const formatDate = (date: string) => {
    const fecha = new Date(date);
    if (isNaN(fecha.getTime())) {
      return "Fecha inválida";
    }
    //console.log("FECHA: " + fecha);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return fecha.toLocaleDateString(undefined, options);
  };

  function mostrarEdad(edad: number): React.ReactNode {
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
      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        margin={"20px"}
        onClick={() => handleClick()}
        className="buttonSombreado"
        leftIcon={<FaPlus />}
      >
        Agregar Nuevo
      </Button>
      <TableContainer m={"20px"}>
        <Table size="sm" variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Foto
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Nombre
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Fecha de nacimiento
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Edad
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Documento
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Acudientes
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Opciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {deportistas.map((deportista) => (
              <Tr key={deportista.id}>
                <Td style={{ border: "1px solid black" }}>
                  <Center mt={4}>
                    {fotos[deportista.id] ? (
                      <img
                        src={fotos[deportista.id]}
                        alt="Foto Documento"
                        width="100"
                      />
                    ) : (
                      "Cargando..."
                    )}
                  </Center>
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {deportista.nombre}
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {formatDate(deportista.fechaNacimiento.toString())}
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {mostrarEdad(deportista.edad)}
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {deportista.tipoId}:{deportista.id}
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {deportista.acudientes?.map((acudiente) => (
                    <div key={acudiente.id}>
                      {acudiente.nombre} {acudiente.numeroCelular}
                      <br />
                      <br />
                    </div>
                  ))}
                </Td>
                <Td style={{ textAlign: "center", border: "1px solid black" }}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    className="buttonSombreado"
                    onClick={() => handleClickVer(deportista.id)}
                    leftIcon={<FaEye />}
                    style={{ marginRight: "8px" }}
                  >
                    Ver
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    className="buttonSombreado"
                    onClick={() => handleClickEliminar(deportista.id)}
                    leftIcon={<FaTrashAlt />}
                  >
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default VerDeportistas;
