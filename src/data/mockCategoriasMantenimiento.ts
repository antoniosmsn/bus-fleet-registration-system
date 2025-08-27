import { CategoriaMantenimiento } from '@/types/categoria-mantenimiento';

export const mockCategoriasMantenimiento: CategoriaMantenimiento[] = [
  {
    id: '1',
    nombre: 'Mantenimiento Preventivo',
    activo: true,
    fechaCreacion: '2024-01-15',
    ultimaActualizacion: '2024-01-15'
  },
  {
    id: '2',
    nombre: 'Mantenimiento Correctivo',
    activo: true,
    fechaCreacion: '2024-01-20',
    ultimaActualizacion: '2024-02-10'
  },
  {
    id: '3',
    nombre: 'Reparación de Motor',
    activo: true,
    fechaCreacion: '2024-02-01',
    ultimaActualizacion: '2024-02-01'
  },
  {
    id: '4',
    nombre: 'Cambio de Aceite',
    activo: true,
    fechaCreacion: '2024-02-05',
    ultimaActualizacion: '2024-02-05'
  },
  {
    id: '5',
    nombre: 'Revisión de Frenos',
    activo: false,
    fechaCreacion: '2024-01-10',
    ultimaActualizacion: '2024-03-01'
  },
  {
    id: '6',
    nombre: 'Mantenimiento de Transmisión',
    activo: true,
    fechaCreacion: '2024-02-20',
    ultimaActualizacion: '2024-02-20'
  },
  {
    id: '7',
    nombre: 'Reparación Eléctrica',
    activo: false,
    fechaCreacion: '2024-01-25',
    ultimaActualizacion: '2024-02-28'
  },
  {
    id: '8',
    nombre: 'Mantenimiento de Aire Acondicionado',
    activo: true,
    fechaCreacion: '2024-03-01',
    ultimaActualizacion: '2024-03-01'
  }
];