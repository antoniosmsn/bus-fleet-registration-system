import { RutaDisponible, SentidoServicio } from '../types/servicio-empresa-transporte';

const sentidos: SentidoServicio[] = ['Ingreso', 'Salida'];

export const mockRutasDisponibles: RutaDisponible[] = [
  {
    id: 'ruta-1',
    nombre: 'San José - Cartago',
    codigo: 'SJC-001',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-2',
    nombre: 'Heredia - Alajuela',
    codigo: 'HAL-002',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-3',
    nombre: 'Puntarenas - Guanacaste',
    codigo: 'PGU-003',
    sentidosDisponibles: ['Salida'], // Only one direction available
  },
  {
    id: 'ruta-4',
    nombre: 'Limón - San José',
    codigo: 'LSJ-004',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-5',
    nombre: 'Circuito Metropolitano',
    codigo: 'CMET-005',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-6',
    nombre: 'Zona Franca - Centro',
    codigo: 'ZFC-006',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-7',
    nombre: 'Aeropuerto - Hoteles',
    codigo: 'AH-007',
    sentidosDisponibles: [...sentidos],
  },
  {
    id: 'ruta-8',
    nombre: 'Universidad - Centro',
    codigo: 'UC-008',
    sentidosDisponibles: [...sentidos],
  }
];

export const getRutasDisponiblesForEmpresa = (empresaId: string, zonaFrancaId?: string): RutaDisponible[] => {
  // In a real implementation, this would filter based on empresa and zona franca
  // For mock purposes, return all routes
  return mockRutasDisponibles;
};