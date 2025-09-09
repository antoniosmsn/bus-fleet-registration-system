import { CategoriaMantenimiento } from '@/types/categoria-mantenimiento';

export const mockCategoriasMantenimiento: CategoriaMantenimiento[] = [
  {
    id: '1',
    nombre: 'Mantenimiento Preventivo',
    name: 'Preventive Maintenance',
    activo: true,
    fechaCreacion: '2024-01-15',
    ultimaActualizacion: '2024-01-15'
  },
  {
    id: '2',
    nombre: 'Mantenimiento Correctivo',
    name: 'Corrective Maintenance',
    activo: true,
    fechaCreacion: '2024-01-20',
    ultimaActualizacion: '2024-02-10'
  },
  {
    id: '3',
    nombre: 'Reparación de Motor',
    name: 'Engine Repair',
    activo: true,
    fechaCreacion: '2024-02-01',
    ultimaActualizacion: '2024-02-01'
  },
  {
    id: '4',
    nombre: 'Cambio de Aceite',
    name: 'Oil Change',
    activo: true,
    fechaCreacion: '2024-02-05',
    ultimaActualizacion: '2024-02-05'
  },
  {
    id: '5',
    nombre: 'Revisión de Frenos',
    name: 'Brake Inspection',
    activo: false,
    fechaCreacion: '2024-01-10',
    ultimaActualizacion: '2024-03-01'
  },
  {
    id: '6',
    nombre: 'Mantenimiento de Transmisión',
    name: 'Transmission Maintenance',
    activo: true,
    fechaCreacion: '2024-02-20',
    ultimaActualizacion: '2024-02-20'
  },
  {
    id: '7',
    nombre: 'Reparación Eléctrica',
    name: 'Electrical Repair',
    activo: false,
    fechaCreacion: '2024-01-25',
    ultimaActualizacion: '2024-02-28'
  },
  {
    id: '8',
    nombre: 'Mantenimiento de Aire Acondicionado',
    name: 'Air Conditioning Maintenance',
    activo: true,
    fechaCreacion: '2024-03-01',
    ultimaActualizacion: '2024-03-01'
  }
];