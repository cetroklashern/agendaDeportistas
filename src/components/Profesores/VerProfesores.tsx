import {
  TableContainer,
  Table,
  Th,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ServicioProfesores } from "../../services/ServicioProfesores";
import { Profesor } from "../../models/Profesor";
import { FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";

type Props = {
  onNewProfesorClick: (element: boolean) => void;
  onSelect: (profesor: Profesor) => void;
  isEditing: boolean;
  servicioProfesores: ServicioProfesores;
};

function VerProfesores(props: Props) {
  const [isEliminated, setIsEliminated] = useState(false);
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await props.servicioProfesores.obtenerProfesores();
        setProfesores(data);
      } catch (error) {
        console.error("Error fetching Profesores:", error);
      }
    };
    console.log("CARGANDO DATOS...");
    fetchData();
  }, [props.isEditing]);

  const handleClick = () => {
    props.onNewProfesorClick(true);
  };

  const handleClickVer = (id: String) => {
    const ubicacionSelected = profesores.find((profesor) => profesor.id === id);
    // Se selecciona el deportista para ver sus detalles o editarlos
    if (ubicacionSelected != null) {
      props.onSelect(ubicacionSelected);
    }
  };

  const handleClickEliminar = (id: string) => {
    props.servicioProfesores.eliminarProfesor(id);

    //Actualizar la vista
    setProfesores(profesores.filter((d) => d.id !== id));

    setIsEliminated(!isEliminated);
  };

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
                Nombre
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Numero de Celular
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Disponibilidad
              </Th>
              <Th style={{ textAlign: "center", border: "1px solid black" }}>
                Opciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {profesores.map((profesor) => (
              <Tr key={profesor.id}>
                <Td style={{ border: "1px solid black" }}>{profesor.nombre}</Td>
                <Td style={{ border: "1px solid black" }}>
                  {profesor.numeroCelular}
                </Td>
                <Td style={{ border: "1px solid black" }}>
                  {profesor.disponibilidades?.map((disponibilidad) => (
                    <div key={disponibilidad.id}>
                      {disponibilidad.diaDisponibilidad}
                      {": "}
                      {disponibilidad.horaInicioDisponibilidad > 12
                        ? disponibilidad.horaInicioDisponibilidad - 12 + "pm."
                        : disponibilidad.horaInicioDisponibilidad + "am."}
                      {" - "}
                      {disponibilidad.horaFinDisponibilidad > 12
                        ? disponibilidad.horaFinDisponibilidad - 12 + "pm."
                        : disponibilidad.horaFinDisponibilidad + "am."}
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
                    onClick={() => handleClickVer(profesor.id)}
                    leftIcon={<FaEye />}
                    style={{ marginRight: "8px" }}
                  >
                    Ver
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    className="buttonSombreado"
                    onClick={() => handleClickEliminar(profesor.id)}
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

export default VerProfesores;
