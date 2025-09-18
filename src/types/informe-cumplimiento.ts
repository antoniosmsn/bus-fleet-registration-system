export type EstadoRevision = 'Pendiente' | 'Revisado por Transportista' | 'Revisado por Administración' | 'Completado';

export interface InformeCumplimiento {
  id: string;
  noInforme: string;
  noSemana: number;
  fechaServicio: string; // DD/MM/YYYY
  idServicio: string;
  transportista: string;
  empresaCliente: string;
  tipoRuta: string;
  turno: string;
  ramal: string;
  tipoUnidad: string;
  placa: string;
  sentido: 'Ingreso' | 'Salida';
  ocupacion: number;
  porcentajeOcupacion: number;
  horaInicio: string; // HH:mm
  horaFinalizacion: string; // HH:mm
  tarifaPasajero: number;
  tarifaServicio: number;
  tarifaServicioTransportista: number;
  programado: boolean;
  estadoRevision: EstadoRevision;
}

export interface FiltrosInformeCumplimiento {
  noInforme: string;
  noSemana: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  idServicio: string;
  transportista: string[];
  empresaCliente: string[];
  tipoRuta: string[];
  turno: string[];
  ramal: string[];
  tipoUnidad: string[];
  placa: string[];
  sentido: ('Ingreso' | 'Salida')[];
  estadoRevision: EstadoRevision[];
  programado: (boolean | null)[];
}