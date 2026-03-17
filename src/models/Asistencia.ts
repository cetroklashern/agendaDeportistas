import { Agenda } from "./Agenda";

export class Asistencia {
  idAsistencia: number;
  agenda: Agenda;
  fecha: string;
  asistio: boolean;

  constructor(
    idAsistencia: number,
    agenda: Agenda,
    fecha: string,
    asistio: boolean
  ) {
    this.idAsistencia = idAsistencia;
    this.agenda = agenda;
    this.fecha = fecha;
    this.asistio = asistio;
  }
}
