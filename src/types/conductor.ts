
export interface Conductor {
  id: number;
  empresaTransporte: string;
  codigo: string;
  numeroCedula: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  fechaVencimientoCedula: string;
  fechaVencimientoLicencia: string;
  estado: 'Activo' | 'Inactivo';
}

export interface ConductorFilterParams {
  empresaTransporte?: string;
  nombreApellidos?: string;
  cedula?: string;
  codigo?: string;
  estado?: 'Activo' | 'Inactivo' | 'Todos';
  vencimientoEnMeses?: number | null;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortParams {
  column: keyof Conductor | null;
  direction: SortDirection;
}
