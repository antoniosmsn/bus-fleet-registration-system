export interface EmpresaTransporte {
  id: string;
  nombre: string;
  activa: boolean;
}

export const mockEmpresasTransporte: EmpresaTransporte[] = [
  { id: '1', nombre: 'Transportes San José S.A.', activa: true },
  { id: '2', nombre: 'Autobuses del Valle', activa: true },
  { id: '3', nombre: 'Empresa de Transporte Central', activa: true },
  { id: '4', nombre: 'Transportes Unidos', activa: true },
  { id: '5', nombre: 'Buses Express Costa Rica', activa: true },
  { id: '6', nombre: 'Transportes Rápidos', activa: true },
  { id: '7', nombre: 'Línea Dorada', activa: true },
  { id: '8', nombre: 'Autobuses Metropolitanos', activa: true },
];