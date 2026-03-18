export default class Recordatorio {
  idRecordatorio: number;
  titulo: string;
  contenido: string;
  fechaRecordatorio: Date;
  diasRecordatorio: number;

  // Constructor para inicializar los atributos del recordatorio
  constructor(
    idRecordatorio: number,
    titulo: string,
    contenido: string,
    fechaRecordatorio: Date,
    diasRecordatorio: number
  ) {
    this.idRecordatorio = idRecordatorio;
    this.titulo = titulo;
    this.contenido = contenido;
    this.fechaRecordatorio = fechaRecordatorio;
    this.diasRecordatorio = diasRecordatorio;
  }
}
