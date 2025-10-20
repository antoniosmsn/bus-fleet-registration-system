export type EstadoSolicitudCambio = 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Sin solicitud';

export type SentidoServicio = 'Ingreso' | 'Salida';

export interface PuntoTrazadoRuta {
  lat: number;
  lng: number;
  orden: number;
}

export interface ServicioEmpresaTransporte {
  id: string;
  tipoRuta: string;
  transportista: string; // nombre corto
  sector: string;
  ramal: string;
  fechaServicio: string; // DD/MM/YYYY
  horaServicio: string; // HH:mm
  cliente: string; // nombre corto
  placaAutobus: string;
  sentido: SentidoServicio;
  horaSalida: string | null; // apertura del servicio
  horaLlegada: string | null; // cierre del servicio
  ocupacion: number;
  porcentajeOcupacion: number;
  ingresos: number;
  exceso: number; // visible solo con permisos
  estadoSolicitudCambio: EstadoSolicitudCambio;
  // IDs para relaciones
  empresaTransporteId: string;
  empresaClienteId: string;
  ramalId: string;
}

export interface FiltrosServicioEmpresa {
  empresaCliente: string[];
  empresaTransporte: string[];
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  tipoRuta: string[];
  sector: string[];
  ramal: string[];
  sentido: SentidoServicio[];
}

export interface DetallePasajeroMovimiento {
  id: string;
  servicioId: string;
  nombrePasajero: string; // visible solo con permisos
  cedula: string; // visible solo con permisos
  tipoPago: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  empresaTransporte: string;
  placaAutobus: string;
  sector: string;
  ramal: string;
  monto: number;
  empresaCliente: string;
  subsidio: number;
  viajeAdicional: boolean;
  numeroEmpleado: string;
  tipoPlanilla: string;
  sentido: SentidoServicio;
  parada: string;
  latitud: number;
  longitud: number;
}

export interface SolicitudCambioRutaData {
  servicioId: string;
  rutaActual: string;
  rutaNueva: string;
  sentidoActual: SentidoServicio;
  sentidoNuevo: SentidoServicio;
  motivo: string;
}

export interface RutaDisponible {
  id: string;
  nombre: string;
  codigo: string;
  sentidosDisponibles: SentidoServicio[];
  puntos?: PuntoTrazadoRuta[];
}