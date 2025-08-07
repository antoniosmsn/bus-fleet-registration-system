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
}