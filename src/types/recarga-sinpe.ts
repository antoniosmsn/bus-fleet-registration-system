export interface HistorialArchivoSinpe {
  id: string;
  fecha: Date;
  usuario: string;
  nombreArchivo: string;
  estadoConciliacion: 'Éxito' | 'Parcial' | 'Con errores';
  totalRegistros: number;
  registrosConciliados: number;
  registrosNoConciliados: number;
  montoTotal: number;
  montoConciliado: number;
}

export interface DetalleConciliacionSinpe {
  id: string;
  archivoId: string;
  cedula: string;
  nombre: string;
  monto: number;
  conciliado: boolean;
  estadoCargue?: 'Cargado' | 'Duplicado' | 'Error';
  fechaMovimiento: Date;
  referencia: string;
  linea: number;
}

export interface FiltrosHistorial {
  fechaInicio?: Date;
  fechaFin?: Date;
  usuario?: string;
  nombreArchivo?: string;
}

export interface FiltrosDetalle {
  cedula?: string;
  nombre?: string;
  conciliado?: 'Todos' | 'Sí' | 'No';
}

export interface ResumenCargue {
  procesadas: number;
  duplicadas: number;
  conError: number;
  montoTotalAcreditado: number;
}