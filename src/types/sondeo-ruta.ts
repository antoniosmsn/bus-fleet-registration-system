export interface PuntoTrazado {
  lat: number;
  lng: number;
  orden: number;
}

export type TipoTrazado = 'dibujado' | 'ruta-existente';

export interface OpcionPregunta {
  id: string;
  texto: string;
  orden: number;
}

export interface PreguntaSondeo {
  id: string;
  texto: string;
  opciones: OpcionPregunta[];
  obligatoria: boolean;
  orden: number;
}

export interface SondeoRuta {
  id: string;
  titulo: string;
  mensaje: string;
  fechaPublicacion: string;
  tipoTrazado: TipoTrazado;
  rutaExistenteId?: string;
  rutaExistenteNombre?: string;
  trazado: PuntoTrazado[];
  preguntas: PreguntaSondeo[];
  turnosObjetivo: string[];
  radioKm: number;
  pasajerosElegibles: number;
  estado: 'borrador' | 'publicado' | 'finalizado';
  fechaCreacion: string;
  usuarioCreacion: string;
  zonaFrancaId: string;
  empresaClienteId: string;
}

export interface SondeoRutaFormData {
  titulo: string;
  mensaje: string;
  tipoTrazado: TipoTrazado;
  rutaExistenteId?: string;
  trazado: PuntoTrazado[];
  preguntas: PreguntaSondeo[];
  turnosObjetivo: string[];
  radioKm: number;
}

export interface SondeoRutaFilter {
  titulo?: string;
  estado?: 'borrador' | 'publicado' | 'finalizado' | 'todos';
  fechaPublicacionStart?: string;
  fechaPublicacionEnd?: string;
  turno?: string;
}
