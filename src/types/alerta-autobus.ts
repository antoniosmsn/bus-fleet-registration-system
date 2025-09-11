export interface MotivoAlertaAutobus {
  id: number;
  nombre: string;
  nombreIngles: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaAutobus {
  id: number;
  nombre: string;
  alertType: string;
  activo: boolean;
  motivos: MotivoAlertaAutobus[];
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaAutobusForm {
  nombre: string;
  alertType: string;
  motivos: MotivoAlertaAutobusForm[];
}

export interface MotivoAlertaAutobusForm {
  id?: number;
  nombre: string;
  nombreIngles: string;
  activo: boolean;
  esNuevo?: boolean;
}

export interface AlertaAutobusFiltros {
  nombre: string;
  alertType: string;
  estado: 'todos' | 'activos' | 'inactivos';
}