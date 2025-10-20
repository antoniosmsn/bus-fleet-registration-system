import { RutaDisponible, SentidoServicio } from '../types/servicio-empresa-transporte';

const sentidos: SentidoServicio[] = ['Ingreso', 'Salida'];

export const mockRutasDisponibles: RutaDisponible[] = [
  {
    id: 'ruta-1',
    nombre: 'San José - Cartago',
    codigo: 'SJC-001',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9281, lng: -84.0907, orden: 1 },
      { lat: 9.9320, lng: -84.0800, orden: 2 },
      { lat: 9.9360, lng: -84.0700, orden: 3 },
      { lat: 9.9400, lng: -84.0600, orden: 4 },
    ]
  },
  {
    id: 'ruta-2',
    nombre: 'Heredia - Alajuela',
    codigo: 'HAL-002',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9989, lng: -84.1207, orden: 1 },
      { lat: 10.0050, lng: -84.1150, orden: 2 },
      { lat: 10.0100, lng: -84.1100, orden: 3 },
      { lat: 10.0160, lng: -84.1050, orden: 4 },
      { lat: 10.0210, lng: -84.2100, orden: 5 },
    ]
  },
  {
    id: 'ruta-3',
    nombre: 'Puntarenas - Guanacaste',
    codigo: 'PGU-003',
    sentidosDisponibles: ['Salida'],
    puntos: [
      { lat: 9.9200, lng: -84.1000, orden: 1 },
      { lat: 9.9250, lng: -84.0950, orden: 2 },
      { lat: 9.9300, lng: -84.0900, orden: 3 },
      { lat: 9.9350, lng: -84.0850, orden: 4 },
      { lat: 9.9400, lng: -84.0800, orden: 5 },
      { lat: 9.9450, lng: -84.0750, orden: 6 },
    ]
  },
  {
    id: 'ruta-4',
    nombre: 'Limón - San José',
    codigo: 'LSJ-004',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9910, lng: -83.0330, orden: 1 },
      { lat: 9.9850, lng: -83.0550, orden: 2 },
      { lat: 9.9750, lng: -83.0800, orden: 3 },
      { lat: 9.9650, lng: -83.1050, orden: 4 },
      { lat: 9.9350, lng: -83.8500, orden: 5 },
    ]
  },
  {
    id: 'ruta-5',
    nombre: 'Circuito Metropolitano',
    codigo: 'CMET-005',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9350, lng: -84.0900, orden: 1 },
      { lat: 9.9400, lng: -84.0900, orden: 2 },
      { lat: 9.9400, lng: -84.0850, orden: 3 },
      { lat: 9.9350, lng: -84.0850, orden: 4 },
      { lat: 9.9350, lng: -84.0900, orden: 5 },
    ]
  },
  {
    id: 'ruta-6',
    nombre: 'Zona Franca - Centro',
    codigo: 'ZFC-006',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9500, lng: -84.1100, orden: 1 },
      { lat: 9.9450, lng: -84.1000, orden: 2 },
      { lat: 9.9400, lng: -84.0950, orden: 3 },
      { lat: 9.9350, lng: -84.0900, orden: 4 },
    ]
  },
  {
    id: 'ruta-7',
    nombre: 'Aeropuerto - Hoteles',
    codigo: 'AH-007',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9936, lng: -84.2088, orden: 1 },
      { lat: 9.9800, lng: -84.1900, orden: 2 },
      { lat: 9.9700, lng: -84.1700, orden: 3 },
      { lat: 9.9600, lng: -84.1500, orden: 4 },
    ]
  },
  {
    id: 'ruta-8',
    nombre: 'Universidad - Centro',
    codigo: 'UC-008',
    sentidosDisponibles: [...sentidos],
    puntos: [
      { lat: 9.9400, lng: -84.0520, orden: 1 },
      { lat: 9.9380, lng: -84.0650, orden: 2 },
      { lat: 9.9350, lng: -84.0800, orden: 3 },
      { lat: 9.9330, lng: -84.0900, orden: 4 },
    ]
  }
];

export const getRutasDisponiblesForEmpresa = (empresaId: string, zonaFrancaId?: string): RutaDisponible[] => {
  // In a real implementation, this would filter based on empresa and zona franca
  // For mock purposes, return all routes
  return mockRutasDisponibles;
};