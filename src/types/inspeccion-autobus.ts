export interface CampoInspeccion {
  id: string;
  tipo: 'texto' | 'checkbox' | 'select' | 'radio' | 'fecha' | 'canvas';
  etiqueta: string;
  requerido: boolean;
  peso: number;
  opciones?: string[]; // Para select y radio
  valorDefecto?: string | boolean;
}

export interface SeccionInspeccion {
  id: string;
  nombre: string;
  peso: number;
  campos: CampoInspeccion[];
}

export interface PlantillaInspeccion {
  id: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  secciones: SeccionInspeccion[];
  pesoTotal: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface RespuestaCampo {
  campoId: string;
  valor: string | boolean | Date;
  puntuacion?: number;
}

export interface RespuestaSeccion {
  seccionId: string;
  respuestas: RespuestaCampo[];
  puntuacionSeccion: number;
}

export interface InspeccionAutobus {
  id: string;
  consecutivo: number;
  fechaInspeccion: string;
  placa: string;
  conductor: {
    id: string;
    nombre: string;
    apellidos: string;
    codigo: string;
  };
  transportista: {
    id: string;
    nombre: string;
    codigo: string;
  };
  plantilla: {
    id: string;
    nombre: string;
  };
  kilometros: number;
  respuestas: RespuestaSeccion[];
  calificacionFinal: number;
  estado: 'completada' | 'pendiente';
  pdfUrl?: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  observaciones?: string;
}

export interface InspeccionFilter {
  fechaInicio?: string;
  fechaFin?: string;
  placa?: string;
  conductor?: string;
  transportista?: string;
  plantilla?: string;
  calificacionMin?: number;
  calificacionMax?: number;
  estado?: 'completada' | 'pendiente' | '';
}

export interface InspeccionRegistro {
  plantillaId: string;
  placa: string;
  conductorId: string;
  fechaInspeccion: string;
  kilometros: number;
  respuestas: RespuestaSeccion[];
  observaciones?: string;
}

export interface InspeccionResponse {
  data: InspeccionAutobus[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}