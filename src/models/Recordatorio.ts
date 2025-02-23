export default class Recordatorio {
  idRecordatorio: number;
  titulo: string;
  contenido: string;
  fechaVisible: Date;
  fechaFinVisible: Date;

  // Constructor para inicializar los atributos del recordatorio
  constructor(
    idRecordatorio: number,
    titulo: string,
    contenido: string,
    fechaVisible: Date,
    fechaFinVisible: Date
  ) {
    this.idRecordatorio = idRecordatorio;
    this.titulo = titulo;
    this.contenido = contenido;
    this.fechaVisible = fechaVisible;
    this.fechaFinVisible = fechaFinVisible;
  }
}
