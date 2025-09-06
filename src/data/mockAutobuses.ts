export interface AutobusBasico {
  id: string;
  placa: string;
  transportistaId: string;
  transportista: string;
  modelo: string;
  anio: number;
  estado: 'activo' | 'inactivo';
}

export const mockAutobuses: AutobusBasico[] = [
  {
    id: '1',
    placa: 'CRC-1001',
    transportistaId: '1',
    transportista: 'Transportes San José S.A.',
    modelo: 'Mercedes-Benz OH 1420',
    anio: 2020,
    estado: 'activo'
  },
  {
    id: '2',
    placa: 'CRC-1002',
    transportistaId: '1',
    transportista: 'Transportes San José S.A.',
    modelo: 'Volvo B270F',
    anio: 2019,
    estado: 'activo'
  },
  {
    id: '3',
    placa: 'CRC-2001',
    transportistaId: '2',
    transportista: 'Autobuses del Valle',
    modelo: 'Scania K310IB',
    anio: 2021,
    estado: 'activo'
  },
  {
    id: '4',
    placa: 'CRC-2002',
    transportistaId: '2',
    transportista: 'Autobuses del Valle',
    modelo: 'Mercedes-Benz OH 1628',
    anio: 2018,
    estado: 'activo'
  },
  {
    id: '5',
    placa: 'CRC-3001',
    transportistaId: '3',
    transportista: 'Empresa de Transporte Central',
    modelo: 'Volvo B340M',
    anio: 2022,
    estado: 'activo'
  },
  {
    id: '6',
    placa: 'CRC-3002',
    transportistaId: '3',
    transportista: 'Empresa de Transporte Central',
    modelo: 'Scania K360IB',
    anio: 2020,
    estado: 'activo'
  },
  {
    id: '7',
    placa: 'CRC-4001',
    transportistaId: '4',
    transportista: 'Transportes Unidos',
    modelo: 'Mercedes-Benz OH 1721',
    anio: 2019,
    estado: 'activo'
  },
  {
    id: '8',
    placa: 'CRC-4002',
    transportistaId: '4',
    transportista: 'Transportes Unidos',
    modelo: 'Volvo B290R',
    anio: 2021,
    estado: 'activo'
  },
  {
    id: '9',
    placa: 'CRC-5001',
    transportistaId: '5',
    transportista: 'Buses Express Costa Rica',
    modelo: 'Scania K370IB',
    anio: 2023,
    estado: 'activo'
  },
  {
    id: '10',
    placa: 'CRC-5002',
    transportistaId: '5',
    transportista: 'Buses Express Costa Rica',
    modelo: 'Mercedes-Benz OH 1730',
    anio: 2022,
    estado: 'activo'
  },
  {
    id: '11',
    placa: 'CRC-6001',
    transportistaId: '6',
    transportista: 'Transportes Metropolitanos',
    modelo: 'Volvo B380R',
    anio: 2020,
    estado: 'activo'
  },
  {
    id: '12',
    placa: 'CRC-6002',
    transportistaId: '6',
    transportista: 'Transportes Metropolitanos',
    modelo: 'Scania K380IB',
    anio: 2019,
    estado: 'activo'
  },
  {
    id: '13',
    placa: 'CRC-7001',
    transportistaId: '7',
    transportista: 'Línea Azul Transporte',
    modelo: 'Mercedes-Benz OH 1835',
    anio: 2021,
    estado: 'activo'
  },
  {
    id: '14',
    placa: 'CRC-7002',
    transportistaId: '7',
    transportista: 'Línea Azul Transporte',
    modelo: 'Volvo B420R',
    anio: 2022,
    estado: 'activo'
  },
  {
    id: '15',
    placa: 'CRC-8001',
    transportistaId: '8',
    transportista: 'Servicios de Transporte Especial',
    modelo: 'Scania K410IB',
    anio: 2023,
    estado: 'activo'
  },
  {
    id: '16',
    placa: 'CRC-8002',
    transportistaId: '8',
    transportista: 'Servicios de Transporte Especial',
    modelo: 'Mercedes-Benz OH 1940',
    anio: 2021,
    estado: 'activo'
  }
];

// Función helper para obtener autobús por placa
export const getAutobusByPlaca = (placa: string): AutobusBasico | null => {
  return mockAutobuses.find(autobus => autobus.placa === placa) || null;
};

// Función helper para obtener autobuses por transportista
export const getAutobusesByTransportista = (transportistaId: string): AutobusBasico[] => {
  return mockAutobuses.filter(autobus => autobus.transportistaId === transportistaId && autobus.estado === 'activo');
};