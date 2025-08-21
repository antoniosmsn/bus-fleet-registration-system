export type TipoAlarma =
  | 'Exceso de velocidad'
  | 'Salida de geocerca'
  | 'Entrada no autorizada'
  | 'Parada prolongada'
  | 'Desvío de ruta'
  | 'Conductor no autorizado'
  | 'Puerta abierta en movimiento'
  | 'Pánico activado'
  | 'Falla de comunicación'
  | 'Batería baja';

export interface AlarmaRecord {
  fechaHoraGeneracion: string; // ISO UTC
  tipoAlarma: TipoAlarma;
  motivo: string;
  conductorNombre: string;
  conductorCodigo: string;
  placa: string;
  busId: number;
  ruta?: string | null;
  empresaTransporte: string;
  empresaCliente?: string | null;
  lat: number | null;
  lng: number | null;
}

export interface AlarmasFiltros {
  desdeUtc: string; // ISO UTC
  hastaUtc: string; // ISO UTC
  tiposAlarma: TipoAlarma[]; // vacío = todos
  conductor: string; // búsqueda parcial
  conductorCodigo: string; // coincidencia exacta
  placa: string; // búsqueda parcial
  busId: string; // coincidencia exacta
  ruta: string | '';
  empresasTransporte: string[]; // múltiple
  empresasCliente: string[]; // múltiple
}