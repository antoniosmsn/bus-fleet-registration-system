export interface MantenimientoRecord {
  id: string;
  fechaMantenimiento: string;
  placa: string;
  categoria: CategoriaMantenimiento;
  detalle: string;
  transportista: {
    id: string;
    nombre: string;
    codigo: string;
  };
  costo?: number;
  proveedor?: string;
  kilometraje?: number;
}

export interface CategoriaMantenimiento {
  id: string;
  nombre: string;
  codigo: string;
  activo: boolean;
}

export interface MantenimientoFilter {
  fechaInicio?: string;
  fechaFin?: string;
  categorias?: string[]; // IDs de categorías seleccionadas
  placa?: string;
  transportista?: string;
}

export interface MantenimientoResponse {
  data: MantenimientoRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}