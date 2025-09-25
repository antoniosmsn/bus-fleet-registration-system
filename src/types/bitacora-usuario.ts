export interface BitacoraUsuario {
  id: string;
  fechaHora: string; // ISO string
  usuario: string; // correo
  nombreCompleto: string;
  perfil: string;
  zonaFranca: string;
  accion: string;
  tipoAccion: 'Registro' | 'Edición' | 'Inicio Sesión' | 'Consulta' | 'Aprobación' | 'Rechazo';
  resultado: 'Exitoso' | 'Error' | 'Advertencia';
  descripcion?: string;
  detalles?: any;
}

export interface BitacoraUsuarioFilter {
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  usuario: string;
  tipoAccion: string; // 'todos' or specific type
  resultado: string; // 'todos' or specific result
  textoDescripcion: string;
}

export const tiposAccion = [
  { value: 'todos', label: 'Todos' },
  { value: 'Registro', label: 'Registro' },
  { value: 'Edición', label: 'Edición' },
  { value: 'Inicio Sesión', label: 'Inicio Sesión' },
  { value: 'Consulta', label: 'Consulta' },
  { value: 'Aprobación', label: 'Aprobación' },
  { value: 'Rechazo', label: 'Rechazo' }
];

export const tiposResultado = [
  { value: 'todos', label: 'Todos' },
  { value: 'Exitoso', label: 'Exitoso' },
  { value: 'Error', label: 'Error' },
  { value: 'Advertencia', label: 'Advertencia' }
];