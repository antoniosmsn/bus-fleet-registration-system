export type EstadoServicio = 
  | 'Sin iniciar'
  | 'Iniciado'
  | 'Iniciado-descarga incompleta'
  | 'Cierre manual-descarga completa'
  | 'Cierre manual-descarga incompleta'
  | 'Cierre automático-descarga incompleta'
  | 'Cierre automático-descarga completa';

export type CumplimientoServicio = 'Cumplido' | 'No cumplido';

export interface CumplimientoServicioData {
  id: string;
  numeroServicio: string;
  autobus: string;
  ramal: string;
  empresaTransporte: string;
  empresaCliente: string | null;
  inicioProgramado: string;
  cierreProgramado: string;
  inicioRealizado: string | null;
  cierreRealizado: string | null;
  ultimaFechaDescarga: string | null;
  cantidadPasajeros: number;
  pasajerosTransmitidos: number;
  cantidadFaltanteDescarga: number;
  estadoServicio: EstadoServicio;
  cumplimientoServicio: CumplimientoServicio;
  puedesolicitarCambioRuta: boolean;
}

export interface FiltrosCumplimientoServicio {
  fechaInicio: string;
  fechaFin: string;
  autobus: string[];
  numeroServicio: string;
  ramal: string[];
  estadoServicio: EstadoServicio[];
  cumplimientoServicio: CumplimientoServicio[];
  empresaCliente: string[];
}