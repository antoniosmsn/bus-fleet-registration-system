export interface ElementoToolbox {
  id: string;
  tipo: 'texto' | 'checkbox' | 'select' | 'radio' | 'fecha' | 'canvas';
  icono: string;
  nombre: string;
  descripcion: string;
}

export interface OpcionCampo {
  id: string;
  texto: string;
  peso?: number; // Peso individual para cada opción
  seleccionada?: boolean; // Para checkboxes: indica si la opción está seleccionada en el cálculo automático
}

export interface CampoPlantilla {
  id: string;
  tipo: 'texto' | 'checkbox' | 'select' | 'radio' | 'fecha' | 'canvas';
  etiqueta: string;
  requerido: boolean;
  peso: number;
  opciones?: string[]; // Para select y radio (backward compatibility)
  opcionesConPeso?: OpcionCampo[]; // Nueva estructura para opciones con peso
  valorDefecto?: string | boolean;
  imagenBase?: string; // Para canvas - imagen base en base64
  orden: number;
}

export interface SeccionPlantilla {
  id: string;
  nombre: string;
  peso: number;
  campos: CampoPlantilla[];
  orden: number;
  columnas?: number; // Número de columnas (1-3)
  camposEnColumnas?: CampoPlantilla[][]; // Campos organizados por columnas
}

export interface PlantillaMatriz {
  id: string;
  identificador: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  secciones: SeccionPlantilla[];
  pesoTotal: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioCreacion: string;
}

export interface PlantillaMatrizFilter {
  nombre?: string;
  identificador?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'todos' | 'activos' | 'inactivos';
}

export interface PlantillaMatrizResponse {
  data: PlantillaMatriz[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlantillaBuilder {
  id: string;
  nombre: string;
  descripcion?: string;
  secciones: SeccionBuilder[];
}

export interface SeccionBuilder {
  id: string;
  nombre: string;
  peso: number;
  campos: CampoBuilder[];
  orden: number;
  expanded: boolean;
  columnas?: number; // Número de columnas (1-3)
  camposEnColumnas?: CampoBuilder[][]; // Campos organizados por columnas
}

export interface CampoBuilder extends CampoPlantilla {
  dragging?: boolean;
  editing?: boolean;
}