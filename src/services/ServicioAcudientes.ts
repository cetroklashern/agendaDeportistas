import { Acudiente } from "../models/Acudiente";
import axios from "axios";

export class ServicioAcudientes {
  private static instancia: ServicioAcudientes;
  private ruta: String;

  public static getInstancia(): ServicioAcudientes {
    if (!this.instancia) {
      this.instancia = new ServicioAcudientes();
    }

    return this.instancia;
  }

  constructor() {
    this.ruta = "http://localhost:8080/api/acudientes/";
  }

  public async obtenerAcudiente(id: string): Promise<Acudiente> {
    try {
      //realizar llamado a servicio rest
      const response = await axios.get(
        this.ruta + "buscarIdentificacion/" + id
      );

      //console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to search acudiente");
    } finally {
      console.log("finalizado buscar acudiente");
    }
  }
}
