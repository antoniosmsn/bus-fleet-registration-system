export interface Empresa {
  id: number;
  nombre: string;
  activa: boolean;
}

export const mockEmpresas: Empresa[] = [
  { id: 1, nombre: 'Empresa Tecnológica ABC', activa: true },
  { id: 2, nombre: 'Corporación Industrial XYZ', activa: true },
  { id: 3, nombre: 'Servicios Logísticos LMN', activa: true },
  { id: 4, nombre: 'Empresa Manufacturera DEF', activa: true },
  { id: 5, nombre: 'Servicios Financieros GHI', activa: true },
  { id: 6, nombre: 'Constructora PQR', activa: true },
  { id: 7, nombre: 'Transporte STU', activa: true },
  { id: 8, nombre: 'Comercial VWX', activa: true },
  { id: 9, nombre: 'Alimentaria YZA', activa: true },
  { id: 10, nombre: 'Textil BCD', activa: true }
];