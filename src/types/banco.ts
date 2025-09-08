export interface Banco {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface BancoFilter {
  nombre?: string;
}

export interface BancoForm {
  nombre: string;
}