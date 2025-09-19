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
  inicioRealizado: string | null; // HH:mm or null
  cierreRealizado: string | null; // HH:mm or null
  ultimaDescarga: string | null; // DD/MM/YYYY HH:mm or null
  pasajeros: number;
  transmitidos: number;
  faltante: number;
  estado: string;
  cumplimiento: 'Cumplido' | 'No cumplido';
  tarifaPasajero: number;
  tarifaServicio: number;
  tarifaServicioTransportista: number;
  programado: boolean;
  cambioRuta: boolean;
  estadoRevision: EstadoRevision;
}

export interface FiltrosInformeCumplimiento {
  // Filtros básicos (de CumplimientoServicios)
  fechaInicio: string;
  fechaFin: string;
  numeroServicio: string;
  autobus: string[];
  ramal: string[];
  // Filtros de estados (de CumplimientoServicios)
  estadoServicio: string[];
  cumplimientoServicio: string[];
  // Filtros de empresas (de CumplimientoServicios)
  empresaCliente: string[];
  // Estados de revisión (conservados del original)
  estadoRevision: EstadoRevision[];
  programado: (boolean | null)[];
  verSoloPendientes: boolean;
}