export interface MotivoAlerta {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaPasajero {
  id: number;
  nombre: string;
  activo: boolean;
  motivos: MotivoAlerta[];
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaPasajeroForm {
  nombre: string;
  motivos: MotivoAlertaForm[];
}

export interface MotivoAlertaForm {
  id?: number;
  nombre: string;
  activo: boolean;
  esNuevo?: boolean;
}

export interface AlertaPasajeroFiltros {
  nombre: string;
  estado: 'todos' | 'activos' | 'inactivos';
}