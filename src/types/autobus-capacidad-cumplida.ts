export interface AutobusCapacidadCumplida {
  id: string;
  empresaTransporte: string;
  idAutobus: string;
  placa: string;
  capacidad: number;
  fechaHoraCumplimiento: string;
  rutaAsignada: string;
  conductorAsignado: string;
  codigoConductorAsignado: string;
  atendido: boolean;
  atendidoPor?: string;
  fechaHoraAtencion?: string;
  activo: boolean;
}

export interface FiltrosCapacidadCumplida {
  empresaTransporte?: string;
  idAutobus?: string;
  placa?: string;
  fechaInicio?: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  ruta?: string;
  conductor?: string;
  codigoConductor?: string;
  estadoAtencion?: 'todos' | 'si' | 'no';
}