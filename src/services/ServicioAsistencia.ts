import axios from "axios";
import { Asistencia } from "../models/Asistencia";

export class ServicioAsistencia {
  private static instancia: ServicioAsistencia;
  private ruta: string;

  public static getInstancia(): ServicioAsistencia {
    if (!this.instancia) {
      this.instancia = new ServicioAsistencia();
    }
    return this.instancia;
  }

  constructor() {
    this.ruta = "http://localhost:8080/api/asistencias/";
  }

  public async guardarAsistencias(asistencias: Asistencia[]): Promise<void> {
    try {
      await axios.post(this.ruta + "guardar", asistencias);
    } catch (error) {
      console.error("Error guardando asistencias:", error);
      throw new Error("Failed to save asistencias");
    }
  }

  public async obtenerAsistenciasPorFecha(fecha: string): Promise<Asistencia[]> {
    try {
      const response = await axios.get<Asistencia[]>(this.ruta + "listar/" + fecha);
      return response.data;
    } catch {
      return [];
    }
  }
}

export default ServicioAsistencia;
