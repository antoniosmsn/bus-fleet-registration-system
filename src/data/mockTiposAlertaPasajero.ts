import { TipoAlertaPasajero } from '@/types/alerta-pasajero';

export const mockTiposAlertaPasajero: TipoAlertaPasajero[] = [
  {
    id: 1,
    nombre: 'Forma de conducir',
    alertType: 'Driving Behavior',
    activo: true,
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaModificacion: '2024-01-20T14:30:00Z',
    motivos: [
      {
        id: 1,
        nombre: 'Conduce muy rápido',
        nombreIngles: 'Drives too fast',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        nombre: 'Conduce muy lento',
        nombreIngles: 'Drives too slow',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 3,
        nombre: 'No respeta normas de tránsito',
        nombreIngles: 'Does not respect traffic rules',
        activo: true,
        fechaCreacion: '2024-01-15T10:00:00Z'
      },
      {
        id: 4,
        nombre: 'Frenadas bruscas',
        nombreIngles: 'Sudden braking',
        activo: false,
        fechaCreacion: '2024-01-15T10:00:00Z'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Comportamiento con pasajeros',
    alertType: 'Passenger Interaction',
    activo: true,
    fechaCreacion: '2024-01-20T08:15:00Z',
    motivos: [
      {
        id: 5,
        nombre: 'Trato descortés',
        nombreIngles: 'Discourteous treatment',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      },
      {
        id: 6,
        nombre: 'No ayuda con equipaje',
        nombreIngles: 'Does not help with luggage',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      },
      {
        id: 7,
        nombre: 'Música muy alta',
        nombreIngles: 'Music too loud',
        activo: true,
        fechaCreacion: '2024-01-20T08:15:00Z'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Puntualidad',
    alertType: 'Punctuality',
    activo: true,
    fechaCreacion: '2024-01-25T09:30:00Z',
    motivos: [
      {
        id: 8,
        nombre: 'Retrasos frecuentes',
        nombreIngles: 'Frequent delays',
        activo: true,
        fechaCreacion: '2024-01-25T09:30:00Z'
      },
      {
        id: 9,
        nombre: 'No cumple horarios',
        nombreIngles: 'Does not meet schedules',
        activo: true,
        fechaCreacion: '2024-01-25T09:30:00Z'
      }
    ]
  },
  {
    id: 4,
    nombre: 'Estado del vehículo',
    alertType: 'Vehicle Condition',
    activo: false,
    fechaCreacion: '2024-02-01T11:45:00Z',
    motivos: [
      {
        id: 10,
        nombre: 'Vehículo sucio',
        nombreIngles: 'Dirty vehicle',
        activo: true,
        fechaCreacion: '2024-02-01T11:45:00Z'
      },
      {
        id: 11,
        nombre: 'Asientos dañados',
        nombreIngles: 'Damaged seats',
        activo: true,
        fechaCreacion: '2024-02-01T11:45:00Z'
      },
      {
        id: 12,
        nombre: 'Aire acondicionado no funciona',
        nombreIngles: 'Air conditioning does not work',
        activo: false,
        fechaCreacion: '2024-02-01T11:45:00Z'
      }
    ]
  },
  {
    id: 5,
    nombre: 'Seguridad',
    alertType: 'Safety',
    activo: true,
    fechaCreacion: '2024-02-10T16:20:00Z',
    motivos: [
      {
        id: 13,
        nombre: 'No usa cinturón de seguridad',
        nombreIngles: 'Does not wear seat belt',
        activo: true,
        fechaCreacion: '2024-02-10T16:20:00Z'
      },
      {
        id: 14,
        nombre: 'Uso de celular mientras conduce',
        nombreIngles: 'Uses cell phone while driving',
        activo: true,
        fechaCreacion: '2024-02-10T16:20:00Z'
      }
    ]
  },
  {
    id: 6,
    nombre: 'Aseo y presentación personal',
    alertType: 'Personal Hygiene',
    activo: true,
    fechaCreacion: '2024-02-15T10:30:00Z',
    motivos: [
      {
        id: 15,
        nombre: 'Uniforme sucio o desaliñado',
        nombreIngles: 'Dirty or disheveled uniform',
        activo: true,
        fechaCreacion: '2024-02-15T10:30:00Z'
      },
      {
        id: 16,
        nombre: 'Falta de identificación visible',
        nombreIngles: 'Lack of visible identification',
        activo: true,
        fechaCreacion: '2024-02-15T10:30:00Z'
      }
    ]
  },
  {
    id: 7,
    nombre: 'Comunicación',
    alertType: 'Communication',
    activo: true,
    fechaCreacion: '2024-02-20T14:15:00Z',
    motivos: [
      {
        id: 17,
        nombre: 'No informa sobre cambios de ruta',
        nombreIngles: 'Does not inform about route changes',
        activo: true,
        fechaCreacion: '2024-02-20T14:15:00Z'
      },
      {
        id: 18,
        nombre: 'No anuncia paradas',
        nombreIngles: 'Does not announce stops',
        activo: true,
        fechaCreacion: '2024-02-20T14:15:00Z'
      },
      {
        id: 19,
        nombre: 'Lenguaje inapropiado',
        nombreIngles: 'Inappropriate language',
        activo: false,
        fechaCreacion: '2024-02-20T14:15:00Z'
      }
    ]
  },
  {
    id: 8,
    nombre: 'Manejo defensivo',
    alertType: 'Defensive Driving',
    activo: true,
    fechaCreacion: '2024-02-25T09:45:00Z',
    motivos: [
      {
        id: 20,
        nombre: 'Adelantamientos peligrosos',
        nombreIngles: 'Dangerous overtaking',
        activo: true,
        fechaCreacion: '2024-02-25T09:45:00Z'
      },
      {
        id: 21,
        nombre: 'No mantiene distancia de seguridad',
        nombreIngles: 'Does not maintain safe distance',
        activo: true,
        fechaCreacion: '2024-02-25T09:45:00Z'
      }
    ]
  },
  {
    id: 9,
    nombre: 'Servicio al cliente',
    alertType: 'Customer Service',
    activo: false,
    fechaCreacion: '2024-03-01T12:00:00Z',
    motivos: [
      {
        id: 22,
        nombre: 'No ayuda a personas con discapacidad',
        nombreIngles: 'Does not help people with disabilities',
        activo: true,
        fechaCreacion: '2024-03-01T12:00:00Z'
      },
      {
        id: 23,
        nombre: 'Actitud negativa hacia consultas',
        nombreIngles: 'Negative attitude towards inquiries',
        activo: true,
        fechaCreacion: '2024-03-01T12:00:00Z'
      }
    ]
  },
  {
    id: 10,
    nombre: 'Uso de tecnología',
    alertType: 'Technology Usage',
    activo: true,
    fechaCreacion: '2024-03-05T15:30:00Z',
    motivos: [
      {
        id: 24,
        nombre: 'No usa sistema de localización',
        nombreIngles: 'Does not use location system',
        activo: true,
        fechaCreacion: '2024-03-05T15:30:00Z'
      },
      {
        id: 25,
        nombre: 'Problemas con lector de tarjetas',
        nombreIngles: 'Issues with card reader',
        activo: false,
        fechaCreacion: '2024-03-05T15:30:00Z'
      }
    ]
  },
  {
    id: 11,
    nombre: 'Emergencias',
    alertType: 'Emergency Response',
    activo: true,
    fechaCreacion: '2024-03-10T08:20:00Z',
    motivos: [
      {
        id: 26,
        nombre: 'No sigue protocolo de emergencias',
        nombreIngles: 'Does not follow emergency protocol',
        activo: true,
        fechaCreacion: '2024-03-10T08:20:00Z'
      },
      {
        id: 27,
        nombre: 'Demora en reportar incidentes',
        nombreIngles: 'Delays in reporting incidents',
        activo: true,
        fechaCreacion: '2024-03-10T08:20:00Z'
      }
    ]
  },
  {
    id: 12,
    nombre: 'Documentación',
    alertType: 'Documentation',
    activo: true,
    fechaCreacion: '2024-03-15T13:10:00Z',
    motivos: [
      {
        id: 28,
        nombre: 'Licencia vencida',
        nombreIngles: 'Expired license',
        activo: true,
        fechaCreacion: '2024-03-15T13:10:00Z'
      },
      {
        id: 29,
        nombre: 'Falta documentación del vehículo',
        nombreIngles: 'Missing vehicle documentation',
        activo: true,
        fechaCreacion: '2024-03-15T13:10:00Z'
      }
    ]
  },
  {
    id: 13,
    nombre: 'Capacitación',
    alertType: 'Training',
    activo: false,
    fechaCreacion: '2024-03-20T16:40:00Z',
    motivos: [
      {
        id: 30,
        nombre: 'No asiste a capacitaciones obligatorias',
        nombreIngles: 'Does not attend mandatory training',
        activo: true,
        fechaCreacion: '2024-03-20T16:40:00Z'
      },
      {
        id: 31,
        nombre: 'Falta conocimiento de rutas',
        nombreIngles: 'Lacks route knowledge',
        activo: true,
        fechaCreacion: '2024-03-20T16:40:00Z'
      }
    ]
  },
  {
    id: 14,
    nombre: 'Mantenimiento preventivo',
    alertType: 'Preventive Maintenance',
    activo: true,
    fechaCreacion: '2024-03-25T11:25:00Z',
    motivos: [
      {
        id: 32,
        nombre: 'No reporta fallas menores',
        nombreIngles: 'Does not report minor failures',
        activo: true,
        fechaCreacion: '2024-03-25T11:25:00Z'
      },
      {
        id: 33,
        nombre: 'No realiza inspección pre-operacional',
        nombreIngles: 'Does not perform pre-operational inspection',
        activo: true,
        fechaCreacion: '2024-03-25T11:25:00Z'
      }
    ]
  },
  {
    id: 15,
    nombre: 'Horarios y rutas',
    alertType: 'Schedule & Routes',
    activo: true,
    fechaCreacion: '2024-03-30T14:50:00Z',
    motivos: [
      {
        id: 34,
        nombre: 'Desvíos no autorizados',
        nombreIngles: 'Unauthorized detours',
        activo: true,
        fechaCreacion: '2024-03-30T14:50:00Z'
      },
      {
        id: 35,
        nombre: 'Paradas no programadas',
        nombreIngles: 'Unscheduled stops',
        activo: false,
        fechaCreacion: '2024-03-30T14:50:00Z'
      }
    ]
  }
];