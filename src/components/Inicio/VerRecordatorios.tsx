import { useState, useEffect } from "react";
import {
  Box,
  useToast,
  Spinner,
  Center,
  TableContainer,
  Table,
  Th,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ServicioRecordatorios } from "../../services/ServicioRecordatorios";
import Recordatorio from "../../models/Recordatorio";
import { FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";

type Props = {
  // Agrega el prop que se utilizará para abrir el formulario de nuevo recordatorio
  onNewRecordatorioClick: () => void;
  recordatorios: Recordatorio[];
  loading: boolean;
};

const VerRecordatorios = (props: Props) => {
  function handleClickVer(idRecordatorio: number): void {
    throw new Error("Function not implemented.");
  }

  function handleClickEliminar(idRecordatorio: number): void {
    throw new Error("Function not implemented.");
  }

  function handleNuevoClick(): void {
    props.onNewRecordatorioClick();
  }

  return (
    <>
      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        margin={"20px"}
        width={"200px"}
        onClick={() => handleNuevoClick()}
        className="buttonSombreado"
        leftIcon={<FaPlus />}
      >
        Agregar Nuevo
      </Button>
      <Box p={8}>
        {props.loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <>
            {props.recordatorios.length > 0 ? (
              <TableContainer m={"100hv"}>
                <Table size="sm" variant="striped" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th
                        style={{
                          textAlign: "center",
                          border: "1px solid black",
                        }}
                      >
                        Información
                      </Th>
                      <Th
                        style={{
                          textAlign: "center",
                          border: "1px solid black",
                        }}
                      >
                        Opciones
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {props.recordatorios.map((recordatorio) => (
                      <Tr key={recordatorio.idRecordatorio}>
                        <Td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                            width: "80%",
                          }}
                        >
                          <FormControl>
                            <FormLabel>{recordatorio.titulo}</FormLabel>
                            <FormLabel>{recordatorio.contenido}</FormLabel>
                          </FormControl>
                        </Td>
                        <Td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                          }}
                        >
                          <Button
                            colorScheme="blue"
                            size="sm"
                            className="buttonSombreado"
                            onClick={() =>
                              handleClickVer(recordatorio.idRecordatorio)
                            }
                            leftIcon={<FaEye />}
                            style={{ marginRight: "8px" }}
                          >
                            Ver
                          </Button>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            className="buttonSombreado"
                            onClick={() =>
                              handleClickEliminar(recordatorio.idRecordatorio)
                            }
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
            ) : (
              <Center>No hay recordatorios disponibles</Center>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default VerRecordatorios;
