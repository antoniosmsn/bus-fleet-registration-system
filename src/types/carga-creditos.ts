export type EstadoCargue = 'Procesado' | 'Procesado con error';

export interface CargueCredito {
  id: string;
  fechaCargue: string;
  nombreArchivo: string;
  nombreUsuario: string;
  estado: EstadoCargue;
  totalRegistros: number;
  registrosExitosos: number;
  registrosConError: number;
  montoTotal: number;
  zonaFranca: string;
  fechaCreacion: string;
  usuarioCreacion: string;
}

export interface DetalleCargueCredito {
  id: string;
  cargueId: string;
  fechaCargue: string;
  monto: number;
  nombrePasajero: string;
  cedula: string;
  empresa: string;
  estado: 'exitoso' | 'error';
  mensajeError?: string;
  numeroLinea?: number;
}

export interface FiltrosCargueCredito {
  fechaInicio?: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  nombreArchivo?: string;
  nombreUsuario?: string;
  estado?: EstadoCargue | 'todos';
  zonaFranca?: string;
}

export interface PaginacionDetalle {
  cargueId: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}