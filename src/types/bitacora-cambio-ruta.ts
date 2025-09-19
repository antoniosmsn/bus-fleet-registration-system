export interface BitacoraCambioRuta {
  id: string;
  rutaOriginal: {
    id: string;
    nombre: string;
  };
  rutaFinal: {
    id: string;
    nombre: string;
  };
  numeroServicioOriginal: string;
  numeroServicioFinal: string;
  usuario: {
    id: string;
    nombreCompleto: string;
    username: string;
  };
  usuarioAprobador?: {
    id: string;
    nombreCompleto: string;
    username: string;
  };
  fechaCambio: string;
  fechaServicio: string;
  cantidadPasajerosAfectados: number;
  montoOriginal: number;
  montoFinal: number;
  estado: 'Aceptada' | 'Rechazada' | 'Pendiente';
  motivoRechazo?: string;
  empresaTransporte: {
    id: string;
    nombre: string;
  };
  autobus: {
    id: string;
    numero: string;
    placa: string;
  };
}

export interface PasajeroAfectado {
  id: string;
  nombre: string;
  cedula: string;
  tipoPago: string;
  fechaServicio: string;
  horaServicio: string;
  empresaTransporte: string;
  empresaCliente: string;
  autobus: string;
  montoOriginal: number;
  montoFinal: number;
}

export interface BitacoraCambioRutaFilter {
  rutaOriginal: string;
  rutaFinal: string;
  usuario: string;
  fechaCambioInicio: string;
  fechaCambioFin: string;
  horaCambioInicio: string;
  horaCambioFin: string;
  usarFechaServicio: boolean;
  fechaServicioInicio: string;
  fechaServicioFin: string;
  horaServicioInicio: string;
  horaServicioFin: string;
  numeroServicio: string;
  empresaTransporte: string;
  autobus: string;
  placaAutobus: string;
  estado: string;
  verSoloPendientes: boolean;
}