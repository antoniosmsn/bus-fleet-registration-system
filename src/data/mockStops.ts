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
    codigo: '001',
    nombre: 'Plaza de la Cultura (San José)',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Carmen',
    estado: 'Activo',
    lat: 9.932,
    lng: -84.079
  },
  {
    id: '2',
    codigo: '002',
    nombre: 'Parque La Merced (San José)',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Merced',
    estado: 'Activo',
    lat: 9.945,
    lng: -84.085
  },
  {
    id: '3',
    codigo: '003',
    nombre: 'Hospital San Juan de Dios',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    estado: 'Inactivo',
    lat: 9.925,
    lng: -84.082
  },
  {
    id: '4',
    codigo: '004',
    nombre: 'Parque La Sabana (Este)',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Mata Redonda',
    estado: 'Activo',
    lat: 9.940,
    lng: -84.090
  },
  {
    id: '5',
    codigo: '005',
    nombre: 'Universidad de Costa Rica (UCR)',
    provincia: 'San José',
    canton: 'Montes de Oca',
    distrito: 'San Pedro',
    estado: 'Activo',
    lat: 9.935,
    lng: -84.050
  },
  {
    id: '6',
    codigo: '006',
    nombre: 'Parque Central de Escazú',
    provincia: 'San José',
    canton: 'Escazú',
    distrito: 'Escazú',
    estado: 'Activo',
    lat: 9.920,
    lng: -84.130
  },
  {
    id: '7',
    codigo: '007',
    nombre: 'Hospital Nacional de Niños',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    estado: 'Activo',
    lat: 9.933,
    lng: -84.088
  },
  {
    id: '8',
    codigo: '008',
    nombre: 'Aeropuerto Internacional Juan Santamaría',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Río Segundo',
    estado: 'Activo',
    lat: 10.000,
    lng: -84.200
  },
  {
    id: '9',
    codigo: '009',
    nombre: 'Parque Central de Cartago',
    provincia: 'Cartago',
    canton: 'Cartago',
    distrito: 'Oriental',
    estado: 'Inactivo',
    lat: 9.860,
    lng: -83.920
  },
  {
    id: '10',
    codigo: '010',
    nombre: 'Mercado Central de Alajuela',
    provincia: 'Alajuela',
    canton: 'Alajuela',
    distrito: 'Alajuela',
    estado: 'Activo',
    lat: 10.016,
    lng: -84.212
  }
];