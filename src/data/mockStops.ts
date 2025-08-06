// Mock data for bus stops (paradas)
export interface Stop {
  id: string;
  codigo: string;
  nombre: string;
  provincia: string;
  canton: string;
  distrito: string;
  estado: 'Activo' | 'Inactivo';
  lat: number;
  lng: number;
}

export const mockStops: Stop[] = [
  {
    id: '1',
    codigo: 'PARA-001',
    nombre: 'Terminal Central',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Carmen',
    estado: 'Activo',
    lat: 9.932,
    lng: -84.079
  },
  {
    id: '2',
    codigo: 'PARA-002',
    nombre: 'Parada Norte',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Merced',
    estado: 'Activo',
    lat: 9.945,
    lng: -84.085
  },
  {
    id: '3',
    codigo: 'PARA-003',
    nombre: 'Parada Sur',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    estado: 'Inactivo',
    lat: 9.925,
    lng: -84.082
  },
  {
    id: '4',
    codigo: 'PARA-004',
    nombre: 'Zona Franca',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Mata Redonda',
    estado: 'Activo',
    lat: 9.940,
    lng: -84.090
  },
  {
    id: '5',
    codigo: 'PARA-005',
    nombre: 'Universidad',
    provincia: 'San José',
    canton: 'Montes de Oca',
    distrito: 'San Pedro',
    estado: 'Activo',
    lat: 9.935,
    lng: -84.050
  },
  {
    id: '6',
    codigo: 'PARA-006',
    nombre: 'Centro Comercial',
    provincia: 'San José',
    canton: 'Escazú',
    distrito: 'Escazú',
    estado: 'Activo',
    lat: 9.920,
    lng: -84.130
  },
  {
    id: '7',
    codigo: 'PARA-007',
    nombre: 'Hospital Nacional',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    estado: 'Activo',
    lat: 9.933,
    lng: -84.088
  },
  {
    id: '8',
    codigo: 'PARA-008',
    nombre: 'Aeropuerto',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Río Segundo',
    estado: 'Activo',
    lat: 10.000,
    lng: -84.200
  },
  {
    id: '9',
    codigo: 'PARA-009',
    nombre: 'Plaza Central',
    provincia: 'Cartago',
    canton: 'Cartago',
    distrito: 'Oriental',
    estado: 'Inactivo',
    lat: 9.860,
    lng: -83.920
  },
  {
    id: '10',
    codigo: 'PARA-010',
    nombre: 'Mercado Municipal',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Alajuela',
    estado: 'Activo',
    lat: 10.016,
    lng: -84.212
  }
];