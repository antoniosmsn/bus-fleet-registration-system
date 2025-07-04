export interface Transportista {
  id: string;
  nombre: string;
  codigo: string;
}

export const mockTransportistas: Transportista[] = [
  { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ001' },
  { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV002' },
  { id: '3', nombre: 'Empresa de Transporte Central', codigo: 'ETC003' },
  { id: '4', nombre: 'Transportes Unidos', codigo: 'TU004' },
  { id: '5', nombre: 'Buses Express Costa Rica', codigo: 'BECR005' },
  { id: '6', nombre: 'Transportes Metropolitanos', codigo: 'TM006' },
  { id: '7', nombre: 'Línea Azul Transporte', codigo: 'LAT007' },
  { id: '8', nombre: 'Servicios de Transporte Especial', codigo: 'STE008' }
];