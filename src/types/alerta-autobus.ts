export interface TipoAlertaAutobus {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface TipoAlertaAutobusForm {
  nombre: string;
}

export interface AlertaAutobusFiltros {
  nombre: string;
  estado: 'todos' | 'activos' | 'inactivos';
}