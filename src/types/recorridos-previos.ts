export type ModoConsulta = 'servicios' | 'rango';

export interface TelemetriaPoint {
  lat: number;
  lng: number;
  speedKmH: number;
  course: number; // 0-360
  timestampUtc: string; // ISO UTC
}

export interface StopInfo {
  id: string;
  codigo: string;
  nombre: string;
  lat: number;
  lng: number;
  visitada?: boolean;
  llegadaUtc?: string | null;
}

export interface QRCluster {
  lat: number;
  lng: number;
  count: number;
}

export interface QRReading {
  cedula: string; // 9 dígitos
  lat: number;
  lng: number;
  timestampUtc: string;
  paradaNombre?: string; // para agrupación por parada
}

export interface RecorridoServicioListItem {
  id: string; // service id (long en backend)
  busId: string;
  identificador: string; // código visible bus
  placa: string;
  conductorCodigo: string;
  conductorNombre: string;
  ruta: string;
  tipoRuta: 'Parque' | 'Privada' | 'Especial';
  empresaCliente?: string | null;
  empresaTransporte: string;
  inicioUtc: string; // ISO
  finUtc: string; // ISO
}

export interface RecorridoRangoListItem {
  busId: string;
  identificador: string;
  placa: string;
  empresaTransporte: string;
  inicioFiltroUtc: string;
  finFiltroUtc: string;
}

export interface RecorridoMapData {
  modo: ModoConsulta;
  telemetria: TelemetriaPoint[];
  stops: StopInfo[];
  qrClusters: QRCluster[]; // usado cuando agrupar=true
  qrReadings: QRReading[]; // usado cuando agrupar=false
}
