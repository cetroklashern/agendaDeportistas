import { Acudiente } from "./Acudiente";

export class Deportista {
  id: string;
  nombre: string;
  edad: number;
  fechaNacimiento: Date;
  tipoId: string;
  direccion: string;
  eps: string;
  institucionEducativa: string;
  grado: number;
  condicionImportante: string;
  imagenPropia: boolean;
  fotoDeportista: string;
  fotoDocumento: string;
  fotoDeportistaUrl: string;
  fotoDocumentoUrl: string;
  //aceptacion de terminos se da por el acudiente pero se mira en la pantalla del deportista
  informacionMensualidad: boolean;
  informacionReposicion: boolean;
  informacionVacaciones: boolean;
  comprobanteInscripcion: boolean;
  acudientes: Array<Acudiente>;

  constructor(
    id: string,
    nombre: string,
    edad: number,
    fechaNacimiento: Date,
    tipoId: string,
    direccion: string,
    eps: string,
    institucionEducativa: string,
    grado: number,
    condicionImportante: string,
    imagenPropia: boolean,
    fotoDeportista: string,
    fotoDocumento: string,
    fotoDeportistaUrl: string,
    fotoDocumentoUrl: string,
    informacionMensualidad: boolean,
    informacionReposicion: boolean,
    informacionVacaciones: boolean,
    comprobanteInscripcion: boolean,
    acudientes: Array<Acudiente>
  ) {
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.fechaNacimiento = fechaNacimiento;
    this.tipoId = tipoId;
    this.direccion = direccion;
    this.eps = eps;
    this.institucionEducativa = institucionEducativa;
    this.grado = grado;
    this.condicionImportante = condicionImportante;
    this.imagenPropia = imagenPropia;
    this.fotoDeportista = fotoDeportista;
    this.fotoDocumento = fotoDocumento;
    this.fotoDeportistaUrl = fotoDeportistaUrl;
    this.fotoDocumentoUrl = fotoDocumentoUrl;
    this.informacionMensualidad = informacionMensualidad;
    this.informacionReposicion = informacionReposicion;
    this.informacionVacaciones = informacionVacaciones;
    this.comprobanteInscripcion = comprobanteInscripcion;
    this.acudientes = acudientes;
  }
}
