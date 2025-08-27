import { TipoAlertaPasajero } from '@/types/alerta-pasajero';

export const mockTiposAlertaPasajero: TipoAlertaPasajero[] = [
  {
    id: 1,
    nombre: 'Forma de conducir',
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaModificacion: '2024-01-20T14:30:00Z',
    motivos: [
      {
        id: 1,
        nombre: 'Conduce muy rápido',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        nombre: 'Conduce muy lento',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 3,
        nombre: 'No respeta normas de tránsito',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 4,
        nombre: 'Frenadas bruscas',
        activo: false,
        fechaCreacion: '2024-01-15T10:00:00Z'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Comportamiento con pasajeros',
    activo: true,
    fechaCreacion: '2024-01-20T08:15:00Z',
    motivos: [
      {
        id: 5,
        nombre: 'Trato descortés',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      },
      {
        id: 6,
        nombre: 'No ayuda con equipaje',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      },
      {
        id: 7,
        nombre: 'Música muy alta',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Puntualidad',
    activo: true,
    fechaCreacion: '2024-01-25T09:30:00Z',
    motivos: [
      {
        id: 8,
        nombre: 'Retrasos frecuentes',
        activo: true,
        fechaCreacion: '2024-01-25T09:30:00Z'
      },
      {
        id: 9,
        nombre: 'No cumple horarios',
        activo: true,
        fechaCreacion: '2024-01-25T09:30:00Z'
      }
    ]
  },
  {
    id: 4,
    nombre: 'Estado del vehículo',
    activo: false,
    fechaCreacion: '2024-02-01T11:45:00Z',
    motivos: [
      {
        id: 10,
        nombre: 'Vehículo sucio',
        activo: true,
        fechaCreacion: '2024-02-01T11:45:00Z'
      },
      {
        id: 11,
        nombre: 'Asientos dañados',
        activo: true,
        fechaCreacion: '2024-02-01T11:45:00Z'
      },
      {
        id: 12,
        nombre: 'Aire acondicionado no funciona',
        activo: false,
        fechaCreacion: '2024-02-01T11:45:00Z'
      }
    ]
  },
  {
    id: 5,
    nombre: 'Seguridad',
    activo: true,
    fechaCreacion: '2024-02-10T16:20:00Z',
    motivos: [
      {
        id: 13,
        nombre: 'No usa cinturón de seguridad',
        activo: true,
        fechaCreacion: '2024-02-10T16:20:00Z'
      },
      {
        id: 14,
        nombre: 'Uso de celular mientras conduce',
        activo: true,
        fechaCreacion: '2024-02-10T16:20:00Z'
      }
    ]
  }
];