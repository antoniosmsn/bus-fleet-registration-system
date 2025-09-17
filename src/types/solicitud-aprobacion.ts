export interface SolicitudAprobacion {
  id: string;
  servicioId: string;
  numeroServicio: string;
  fechaServicio: string;
  placaAutobus: string;
  idAutobus: string;
  empresaTransporte: string;
  rutaOriginal: {
    id: string;
    nombre: string;
    sentido: 'ingreso' | 'salida';
  };
  rutaNueva: {
    id: string;
    nombre: string;
    sentido: 'ingreso' | 'salida';
  };
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: string;
  usuario: {
    id: string;
    nombre: string;
    username: string;
  };
  pasajerosAfectados: number;
  montoOriginal: number;
  montoFinal: number;
}

export interface FiltrosSolicitudAprobacion {
  numeroServicio: string;
  empresaTransporte: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  placaAutobus: string;
  idAutobus: string;
  estado: string;
}

export interface BitacoraAprobacion {
  solicitudId: string;
  usuario: string;
  fecha: string;
  accion: 'APROBAR_SOLICITUD' | 'RECHAZAR_SOLICITUD';
  rutaOriginal: string;
  rutaFinal: string;
  numeroServicioOriginal: string;
  numeroServicioFinal: string;
  fechaServicio: string;
  pasajerosAfectados: number;
  montoOriginal: number;
  montoFinal: number;
  motivo?: string;
}