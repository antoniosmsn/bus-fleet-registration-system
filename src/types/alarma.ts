export type TipoAlarma =
  | 'Exceso de velocidad'
  | 'Detención prolongada'
  | 'Entrada a geocerca'
  | 'Salida de geocerca'
  | 'Botón de pánico'
  | 'Desvío de ruta';

export interface AlarmaRecord {
  fechaHoraUtc: string; // ISO UTC
  tipoAlarma: TipoAlarma;
  motivo: string;
  conductorNombre: string;
  conductorCodigo: string; // exacto
  placa: string;
  busId: number;
  ruta?: string | null;
  empresaTransporte: string;
  empresaCliente?: string | null;
  lat: number | null;
  lng: number | null;
}

export interface AlarmaFiltros {
  desdeUtc: string;
  hastaUtc: string;
  tiposAlarma: TipoAlarma[]; // vacío = todos
  conductorNombre: string; // parcial
  conductorCodigo: string; // exacto
  placa: string; // parcial
  busId: string; // exacto
  ruta: string | '';
  empresasTransporte: string[]; // múltiple
  empresasCliente: string[]; // múltiple
}
