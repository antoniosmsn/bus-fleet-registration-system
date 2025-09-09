export interface CategoriaMantenimiento {
  id: string;
  nombre: string;
  name: string; // English name
  activo: boolean;
  fechaCreacion: string;
  ultimaActualizacion: string;
  isNew?: boolean; // Para identificar registros nuevos no guardados
}

export interface CategoriaMantenimientoFilter {
  nombre?: string;
  name?: string;
  estado?: 'todos' | 'activos' | 'inactivos';
}

export interface CategoriaMantenimientoResponse {
  data: CategoriaMantenimiento[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}