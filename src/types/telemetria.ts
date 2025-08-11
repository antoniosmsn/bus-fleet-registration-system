export type TipoRegistro =
  | 'Entrada a ruta'
  | 'Salida de ruta'
  | 'Paso por parada'
  | 'Exceso de velocidad'
  | 'Grabación por tiempo'
  | 'Grabación por curso';

export type Sentido = 'Ingreso' | 'Salida';

export interface TelemetriaRecord {
  fechaHoraUtc: string; // ISO UTC
  placa: string;
  busId: number;
  tipoRegistro: TipoRegistro;
  parada?: string | null;
  velocidadKmH: number;
  pasajeros: number;
  espaciosDisponibles: number; // 0 si fuera de servicio
  ruta?: string | null; // vacío si fuera de servicio
  sentido?: Sentido | null; // vacío si fuera de servicio
  conductorCodigo: string; // numérico como texto para mantener ceros
  conductorNombre: string;
  empresaTransporte: string;
  empresaCliente?: string | null; // solo rutas no parque
  geocerca?: string | null;
  direccion: number; // 0-360
  lat: number | null;
  lng: number | null;
}

export interface TelemetriaFiltros {
  desdeUtc: string; // ISO UTC
  hastaUtc: string; // ISO UTC
  tiposRegistro: TipoRegistro[]; // vacío = todos
  ruta: string | '';
  placa: string;
  busId: string; // exacto si no vacío
  conductorCodigo: string; // exacto si no vacío
  conductorNombre: string; // parcial
  empresasTransporte: string[]; // múltiple
  empresasCliente: string[]; // múltiple
}

export type RolSimulado = 'Administrador' | 'Empresa de transporte' | 'Empresa cliente';
