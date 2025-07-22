export interface SolicitudTraslado {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  empresaOrigen: string;
  empresaDestino: string;
  fechaCreacion: string;
  usuarioCreador: string;
  fechaModificacion?: string | null;
  usuarioModificador?: string | null;
  comentarios?: string;
  estado: 'aceptado' | 'activo' | 'inactivo' | 'cancelado' | 'rechazado' | 'en-solicitud-traslado';
}

export interface SolicitudTrasladoFilter {
  nombres?: string;
  apellidos?: string;
  cedula?: string;
  correo?: string;
  empresaDestino?: string;
  empresaOrigen?: string;
  fechaCreacionInicio?: string;
  fechaCreacionFin?: string;
  estado?: 'aceptado' | 'activo' | 'inactivo' | 'cancelado' | 'rechazado' | 'en-solicitud-traslado' | 'todos';
}