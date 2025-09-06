import { PlantillaInspeccion } from '@/types/inspeccion-autobus';

export const mockPlantillasInspeccion: PlantillaInspeccion[] = [
  {
    id: '1',
    nombre: 'Inspección General de Autobús',
    descripcion: 'Inspección completa para verificación general del vehículo',
    activa: true,
    pesoTotal: 100,
    fechaCreacion: '2024-01-15T08:00:00Z',
    fechaActualizacion: '2024-03-01T10:30:00Z',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Estado Exterior',
        peso: 25,
        campos: [
          {
            id: 'campo1',
            tipo: 'checkbox',
            etiqueta: '¿Carrocería en buen estado?',
            requerido: true,
            peso: 8,
          },
          {
            id: 'campo2',
            tipo: 'select',
            etiqueta: 'Estado de las llantas',
            requerido: true,
            peso: 10,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Malo']
          },
          {
            id: 'campo3',
            tipo: 'checkbox',
            etiqueta: '¿Luces funcionando correctamente?',
            requerido: true,
            peso: 7,
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Motor y Mecánica',
        peso: 30,
        campos: [
          {
            id: 'campo4',
            tipo: 'select',
            etiqueta: 'Estado del motor',
            requerido: true,
            peso: 15,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Requiere atención']
          },
          {
            id: 'campo5',
            tipo: 'checkbox',
            etiqueta: '¿Frenos funcionando adecuadamente?',
            requerido: true,
            peso: 10,
          },
          {
            id: 'campo6',
            tipo: 'texto',
            etiqueta: 'Observaciones del motor',
            requerido: false,
            peso: 5,
          }
        ]
      },
      {
        id: 'sec3',
        nombre: 'Interior y Seguridad',
        peso: 25,
        campos: [
          {
            id: 'campo7',
            tipo: 'checkbox',
            etiqueta: '¿Asientos en buen estado?',
            requerido: true,
            peso: 8,
          },
          {
            id: 'campo8',
            tipo: 'checkbox',
            etiqueta: '¿Sistema de emergencia operativo?',
            requerido: true,
            peso: 10,
          },
          {
            id: 'campo9',
            tipo: 'radio',
            etiqueta: 'Limpieza general',
            requerido: true,
            peso: 7,
            opciones: ['Excelente', 'Buena', 'Regular', 'Deficiente']
          }
        ]
      },
      {
        id: 'sec4',
        nombre: 'Documentación y Firma',
        peso: 20,
        campos: [
          {
            id: 'campo10',
            tipo: 'fecha',
            etiqueta: 'Fecha de última revisión técnica',
            requerido: true,
            peso: 10,
          },
          {
            id: 'campo11',
            tipo: 'canvas',
            etiqueta: 'Firma del inspector',
            requerido: true,
            peso: 10,
          }
        ]
      }
    ]
  },
  {
    id: '2',
    nombre: 'Inspección Pre-viaje',
    descripcion: 'Verificación rápida antes del inicio del servicio',
    activa: true,
    pesoTotal: 100,
    fechaCreacion: '2024-02-01T09:00:00Z',
    fechaActualizacion: '2024-02-01T09:00:00Z',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Verificaciones Básicas',
        peso: 50,
        campos: [
          {
            id: 'campo1',
            tipo: 'checkbox',
            etiqueta: '¿Combustible suficiente?',
            requerido: true,
            peso: 15,
          },
          {
            id: 'campo2',
            tipo: 'checkbox',
            etiqueta: '¿Luces operativas?',
            requerido: true,
            peso: 15,
          },
          {
            id: 'campo3',
            tipo: 'select',
            etiqueta: 'Estado de neumáticos',
            requerido: true,
            peso: 20,
            opciones: ['Perfecto', 'Bueno', 'Aceptable', 'Revisar']
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Confirmación del Conductor',
        peso: 50,
        campos: [
          {
            id: 'campo4',
            tipo: 'checkbox',
            etiqueta: '¿Conductor en condiciones óptimas?',
            requerido: true,
            peso: 20,
          },
          {
            id: 'campo5',
            tipo: 'texto',
            etiqueta: 'Observaciones adicionales',
            requerido: false,
            peso: 10,
          },
          {
            id: 'campo6',
            tipo: 'canvas',
            etiqueta: 'Firma del conductor',
            requerido: true,
            peso: 20,
          }
        ]
      }
    ]
  },
  {
    id: '3',
    nombre: 'Inspección Técnica Detallada',
    descripcion: 'Revisión técnica completa mensual',
    activa: true,
    pesoTotal: 100,
    fechaCreacion: '2024-01-20T14:00:00Z',
    fechaActualizacion: '2024-01-20T14:00:00Z',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Sistema Eléctrico',
        peso: 35,
        campos: [
          {
            id: 'campo1',
            tipo: 'select',
            etiqueta: 'Estado de la batería',
            requerido: true,
            peso: 15,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Reemplazar']
          },
          {
            id: 'campo2',
            tipo: 'checkbox',
            etiqueta: '¿Sistema de carga funcionando?',
            requerido: true,
            peso: 10,
          },
          {
            id: 'campo3',
            tipo: 'checkbox',
            etiqueta: '¿Conexiones eléctricas seguras?',
            requerido: true,
            peso: 10,
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Sistema de Frenado',
        peso: 35,
        campos: [
          {
            id: 'campo4',
            tipo: 'select',
            etiqueta: 'Estado de pastillas de freno',
            requerido: true,
            peso: 15,
          opciones: ['Nuevas', 'Buenas', 'Desgastadas', 'Críticas']
          },
          {
            id: 'campo5',
            tipo: 'checkbox',
            etiqueta: '¿Líquido de frenos en nivel adecuado?',
            requerido: true,
            peso: 10,
          },
          {
            id: 'campo6',
            tipo: 'texto',
            etiqueta: 'Observaciones del sistema de frenos',
            requerido: false,
            peso: 10,
          }
        ]
      },
      {
        id: 'sec3',
        nombre: 'Documentación Final',
        peso: 30,
        campos: [
          {
            id: 'campo7',
            tipo: 'fecha',
            etiqueta: 'Próxima revisión programada',
            requerido: true,
            peso: 15,
          },
          {
            id: 'campo8',
            tipo: 'canvas',
            etiqueta: 'Firma del técnico',
            requerido: true,
            peso: 15,
          }
        ]
      }
    ]
  }
];

export const getPlantillaById = (id: string): PlantillaInspeccion | null => {
  return mockPlantillasInspeccion.find(plantilla => plantilla.id === id) || null;
};

export const getPlantillasActivas = (): PlantillaInspeccion[] => {
  return mockPlantillasInspeccion.filter(plantilla => plantilla.activa);
};