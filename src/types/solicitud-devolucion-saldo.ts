export interface SolicitudDevolucionSaldo {
  id: string;
  numeroDevolucion: string;
  cedulaPasajero: string;
  nombrePasajero: string;
  fechaSolicitud: string;
  fechaDevolucion: string;
  estado: 'pendiente_aprobacion' | 'aprobada_pendiente_autorizacion' | 'completamente_aprobada' | 'rechazada' | 'procesada';
  monto: number;
  motivoDevolucion: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  autorizadoPor?: string;
  fechaAutorizacion?: string;
  motivoRechazo?: string;
  rechazadoPor?: string;
  fechaRechazo?: string;
}

export interface FiltrosSolicitudDevolucion {
  // Datos de devolución
  estadoDevolucion: string;
  numeroDevolucion: string;
  
  // Datos pasajero
  cedulaPasajero: string;
  nombrePasajero: string;
  
  // Fechas
  fechaInicio: string;
  fechaFin: string;
}