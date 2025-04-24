
export interface Permiso {
  id: number;
  nombre: string;
  codigo: string;
}

export interface ModuloPermiso {
  id: number;
  nombre: string;
  acciones: Permiso[];
}
