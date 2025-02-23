import axios from "axios";
import Recordatorio from "../models/Recordatorio";

export class ServicioRecordatorios {
  private recordatorios: Recordatorio[];
  private static instancia: ServicioRecordatorios;
  private ruta: String;

  public static getInstancia(): ServicioRecordatorios {
    if (!this.instancia) {
      this.instancia = new ServicioRecordatorios();
      this.instancia.obtenerRecordatorios();
    }
    return this.instancia;
  }

  constructor() {
    this.recordatorios = [];
    this.ruta = "http://localhost:8080/api/recordatorios/";
  }

  //funcion para cargar recordatorios
  public async obtenerRecordatorios(): Promise<Recordatorio[]> {
    // Implementar la logica para cargar recordatorios desde la API
    try {
      // Realizar llamado a servicio rest
      const response = await axios.get(this.ruta + "listar");

      this.recordatorios = response.data;
      console.log(this.recordatorios);
      return this.recordatorios;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch recordatorios");
    } finally {
      console.log("finalizado obtener recordatorios");
    }
  }

  //funcion para cargar recordatorios
  public async obtenerRecordatoriosHoy(): Promise<Recordatorio[]> {
    // Implementar la logica para cargar recordatorios desde la API
    try {
      // Realizar llamado a servicio rest
      const response = await axios.get(this.ruta + "listarHoy");

      this.recordatorios = response.data;
      console.log(this.recordatorios);

      return this.recordatorios;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch recordatorios");
    } finally {
      console.log("finalizado obtener recordatorios hoy");
    }
  }

  // Función para buscar crear el recordatorio
  public async crearRecordatorio(
    recordatorio: Recordatorio
  ): Promise<Recordatorio> {
    try {
      // Realizar llamado a servicio rest para crear el recordatorio
      const response = await axios.post(this.ruta + "crear", recordatorio);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create recordatorio");
    } finally {
      console.log("finalizado crear recordatorio");
    }
  }

  // Función para eliminar el recordatorio
  public async eliminarRecordatorio(idRecordatorio: number): Promise<void> {
    try {
      // Realizar llamado a servicio rest para eliminar el recordatorio
      await axios.delete(this.ruta + "eliminar/" + idRecordatorio);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete recordatorio");
    } finally {
      console.log("finalizado eliminar recordatorio");
    }
  }

  // Función para actualizar el recordatorio
  public async actualizarRecordatorio(
    recordatorio: Recordatorio
  ): Promise<Recordatorio> {
    try {
      // Realizar llamado a servicio rest para actualizar el recordatorio
      const response = await axios.put(this.ruta + "actualizar", recordatorio);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update recordatorio");
    } finally {
      console.log("finalizado actualizar recordatorio");
    }
  }

  //obtener recordatorio por id
  public obtenerRecordatorio(idRecordatorio: number): Recordatorio | undefined {
    return this.recordatorios.find((r) => r.idRecordatorio === idRecordatorio);
  }
}
