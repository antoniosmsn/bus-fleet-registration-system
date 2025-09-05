export interface MotivoAlertaAutobus {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaAutobus {
  id: number;
  nombre: string;
  activo: boolean;
  motivos: MotivoAlertaAutobus[];
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaAutobusForm {
  nombre: string;
  motivos: MotivoAlertaAutobusForm[];
}

export interface MotivoAlertaAutobusForm {
  id?: number;
  nombre: string;
  activo: boolean;
  esNuevo?: boolean;
}

export interface AlertaAutobusFiltros {
  nombre: string;
  estado: 'todos' | 'activos' | 'inactivos';
}