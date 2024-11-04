import axios from "axios";
import { Grupo } from "../models/Grupo";
import { Profesor } from "../models/Profesor";
import { Curso } from "../models/Curso";
import { Ubicacion } from "../models/Ubicacion";

export class ServicioGrupos {
  private grupos: Grupo[];
  private static instancia: ServicioGrupos;
  private ruta: String;

  public static getInstancia(): ServicioGrupos {
    if (!this.instancia) {
      this.instancia = new ServicioGrupos();
    }

    //if (this.instancia.grupos.length === 0) this.instancia.cargarGruposDummy();

    return this.instancia;
  }

  constructor() {
    this.grupos = [];
    this.ruta = "http://localhost:8080/api/grupos/";
  }

  //funcion para cargar grupos Dummy
  public cargarGruposDummy(): Grupo[] {
    this.grupos.push(
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
      )
    );
    this.grupos.push(
      new Grupo(
        1,
        new Curso(
          1,
          "Mamitas 2",
          "Femenino",
          "Maternas",
          "1er trimestre",
          "",
          "1",
          "",
          "",
          "1",
          "0",
          "#77DD99"
        ),
        "Lunes",
        "08:30",
        "09:30",
        10,
        new Profesor(
          "1232313",
          "Pepito Perez",
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
      )
    );
    this.grupos.push(
      new Grupo(
        1,
        new Curso(
          1,
          "Mamitas 2",
          "Femenino",
          "Maternas",
          "1er trimestre",
          "",
          "1",
          "",
          "",
          "1",
          "0",
          "#774822"
        ),
        "Lunes",
        "08:30",
        "09:30",
        10,
        new Profesor(
          "1232313",
          "Pepito Perez",
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
      )
    );
    this.grupos.push(
      new Grupo(
        2,
        new Curso(
          2,
          "Baby 1",
          "Mixto",
          "Bebes",
          "2 meses",
          "",
          "1",
          "",
          "",
          "1",
          "0",
          "#555555"
        ),
        "Miércoles",
        "10:00",
        "11:00",
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
      )
    );
    this.grupos.push(
      new Grupo(
        3,
        new Curso(
          3,
          "Baile 1",
          "Femenino",
          "Niños",
          "6 años",
          "Acrobacia",
          "Básico",
          "Individual",
          "Bailarines",
          "1",
          "0",
          "#FF5733"
        ),
        "Jueves",
        "12:00",
        "13:00",
        8,
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
      )
    );

    return this.grupos;
  }

  //FUncion para obtener los grupos desde el backend
  public async obtenerGrupos(): Promise<Grupo[]> {
    try {
      //realizar llamado a servicio rest
      const response = await axios.get(this.ruta + "listar");

      //console.log(JSON.stringify(response.data));

      this.grupos = response.data;

      //console.log(JSON.stringify(this.grupos));
      return this.grupos;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch grupos");
    } finally {
      console.log("finalizado obtener grupos");
    }
  }

  // Función para listar todos los grupos
  public listarGrupos(): Grupo[] {
    return this.grupos;
  }

  // Función para agregar un nuevo grupo
  public async agregarGrupo(grupo: Grupo): Promise<Grupo> {
    try {
      const response = await axios.post<Grupo>(this.ruta + "crear", grupo);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create grupo");
    }
  }

  public async actualizarGrupo(grupo: Grupo): Promise<Grupo> {
    try {
      const response = await axios.post<Grupo>(this.ruta + "actualizar", grupo);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create grupo");
    }
  }

  // Función para eliminar un grupo existente
  public async eliminarGrupo(id: number): Promise<void> {
    try {
      //realizar llamado a servicio rest
      const response = await axios.delete(this.ruta + "eliminar/" + id);

      if (response.status === 200)
        this.grupos = this.grupos.filter((g) => g.idGrupo !== id);
    } catch (error) {
      console.error("ERROR al eliminar: " + error);
      throw new Error("Failed to delete grupo");
    } finally {
      console.log("finalizado eliminar grupos");
    }
  }

  // Función para obtener un grupo por su id
  public obtenerGrupoPorId(id: number): Grupo | undefined {
    return this.grupos.find((c) => c.idGrupo === id);
  }

  // Función para obtener el siguiente id disponible
  public obtenerSiguienteId(): number {
    return this.grupos.length + 1;
  }
}
