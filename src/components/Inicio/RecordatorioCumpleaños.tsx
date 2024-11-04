import React from "react";
import { useEffect, useState } from "react";
import { ServicioDeportistas } from "../../services/ServicioDeportistas";
import { Deportista } from "../../models/Deportista";
import { Text, Center } from "@chakra-ui/react";

type Props = {
  servicioDeportistas: ServicioDeportistas;
};

// Función para obtener el nombre del mes actual
const getMonthName = (monthIndex: number) => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthNames[monthIndex];
};

const RecordatorioCumpleaños = (props: Props) => {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [deportistasCumplen, setDeportistasCumplen] = useState<Deportista[]>(
    []
  );
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = getMonthName(currentMonthIndex);

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
  }, []);

  useEffect(() => {
    // Obtener el mes actual
    const currentMonth = new Date().getMonth() + 1; // Los meses en JavaScript van de 0 a 11

    // Filtrar los deportistas que cumplen años en el mes actual
    setDeportistasCumplen(
      deportistas.filter((deportista) => {
        const birthMonth = new Date(deportista.fechaNacimiento).getMonth() + 1;
        return birthMonth === currentMonth;
      })
    );
  }, [deportistas]);

  return (
    <div style={{ margin: "20px" }}>
      <Text as="b" textAlign="center" fontSize="15px" color="black">
        Cumpleañeros de {currentMonthName}
      </Text>
      {deportistasCumplen.length > 0 ? (
        <ul>
          {deportistasCumplen.map((deportista, index) => (
            <li key={index}>
              🎉 {deportista.nombre} - Cumple años el{" "}
              {new Date(deportista.fechaNacimiento).getDate()} de{" "}
              {currentMonthName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cumpleaños este mes.</p>
      )}
    </div>
  );
};

export default RecordatorioCumpleaños;
