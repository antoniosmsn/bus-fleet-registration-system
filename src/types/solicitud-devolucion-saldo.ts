export interface SolicitudDevolucionSaldo {
  id: string;
  numeroDevolucion: string;
  cedulaPasajero: string;
  nombrePasajero: string;
  fechaSolicitud: string;
  fechaDevolucion: string;
  estado: 'pendiente_aprobacion' | 'aprobada' | 'rechazada' | 'procesada';
  monto: number;
  motivoDevolucion: string;
  aprobadores: string[];
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