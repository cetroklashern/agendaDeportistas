import axios from "axios";
import { Agenda } from "../models/Agenda";
import { Curso } from "../models/Curso";
import { Grupo } from "../models/Grupo";
import { Profesor } from "../models/Profesor";
import { Ubicacion } from "../models/Ubicacion";

export class ServicioAgendas {
  private agendas: Agenda[];
  private static instancia: ServicioAgendas;
  private ruta: String;

  public static getInstancia(): ServicioAgendas {
    if (!this.instancia) {
      this.instancia = new ServicioAgendas();
    }

    if (this.instancia.agendas.length === 0)
      this.instancia.cargarAgendasDummy();

    return this.instancia;
  }

  constructor() {
    this.agendas = [];
    this.ruta = "http://localhost:8080/api/agendas/";
  }

  //funcion para cargar agendas Dummy
  public cargarAgendasDummy(): Agenda[] {
    this.agendas.push(
      new Agenda(
        1,
        new Grupo(
          1,
          new Curso(
            1,
            "Mamitas 1",
            "Femenino",
            "Maternas",
            "1er trimestre",
            "",
            "1",
            "",
            "",
            "1",
            "0",
            "#77DD77"
          ),
          "Lunes",
          "08:00",
          "09:00",
          10,
          new Profesor(
            "1232313",
            "Jorge Castrillon",
            "",
            "3157895487",
            "",
            "",
            "",
            "",
            "",
            "0",
            []
          ),
          new Ubicacion(
            1,
            "NombrePrueba1",
            "Direccion1",
            "",
            "",
            true,
            new Date("01/01/2024"),
            new Date("12/31/2024"),
            []
          )
        ),
        {
          id: "123456789",
          nombre: "Liliam Bolaños",
          tipoId: "Cédula de Ciudadania",
          edad: 39,
          fechaNacimiento: new Date("2024-01-01T05:00:00.000Z"),
          direccion: "",
          eps: "",
          institucionEducativa: "",
          grado: 1,
          condicionImportante: "N",
          imagenPropia: true,
          fotoDeportista: "",
          fotoDocumento: "",
          fotoDeportistaUrl: "",
          fotoDocumentoUrl: "",
          informacionMensualidad: true,
          informacionReposicion: false,
          informacionVacaciones: true,
          comprobanteInscripcion: true,
          acudientes: [
            {
              id: "1",
              nombre: "Acudiente Test",
              tipoId: "",
              numeroCelular: 3154444444,
              direccion: "",
              correoElectronico: "",
              imagenPropia: true,
              profesionEmpresa: "",
              parentesco: "",
            },
          ],
        }
      )
    );

    return this.agendas;
  }

  public async obtenerAgendas(): Promise<Agenda[]> {
    try {
      //realizar llamado a servicio rest
      const response = await axios.get(this.ruta + "listar");

      //console.log(JSON.stringify(response.data));

      this.agendas = response.data;

      //console.log(JSON.stringify(this.agendas));
      return this.agendas;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch agendas");
    } finally {
      console.log("finalizado obtener agendas");
    }
  }

  // Función para listar todos los agendas
  public listarAgendas(): Agenda[] {
    return this.agendas;
  }

  // Función para agregar un nuevo agenda
  public async agregarAgenda(agenda: Agenda): Promise<Agenda> {
    try {
      console.log(
        "greando agenda: " +
          agenda.deportista.nombre +
          " - " +
          agenda.grupo.curso.nombre
      );
      const response = await axios.post<Agenda>(this.ruta + "crear", agenda);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create agenda");
    }
  }

  // Función para eliminar un agenda existente
  public async eliminarAgenda(id: number): Promise<void> {
    try {
      //realizar llamado a servicio rest
      await axios.delete(this.ruta + "eliminar/" + id);
    } catch (error) {
      console.error("ERROR al eliminar: " + error);
      throw new Error("Failed to delete agenda");
    } finally {
      console.log("finalizado eliminar agendas");
    }
  }

  public obtenerCantidadAgendasGrupo(idGrupo: number): number {
    /*try {
      const response = await axios.get(this.ruta + "agendasPorGrupo/" + idGrupo);
      return response.data.length;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch agendas by group");
    } finally {
      console.log("finalizado obtener agendas por grupo");
    }*/

    if (this.agendas == null) {
      return 0;
    } else {
      const agendasFiltradas = this.agendas.filter(
        (agenda) => agenda.grupo.idGrupo === idGrupo
      );

      if (agendasFiltradas.length > 0) {
        return agendasFiltradas.length;
      } else {
        return 0;
      }
    }
  }

  public obtenerAgendasGrupo(idGrupo: number): Agenda[] {
    if (this.agendas == null) {
      return this.agendas;
    } else {
      const agendasFiltradas = this.agendas.filter(
        (agenda) => agenda.grupo.idGrupo === idGrupo
      );
      return agendasFiltradas;
    }
  }
}

export default ServicioAgendas;
