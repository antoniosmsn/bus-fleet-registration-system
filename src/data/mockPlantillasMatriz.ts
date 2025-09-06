import { PlantillaMatriz } from '@/types/plantilla-matriz';

// Función para generar fechas dinámicas
const generarFechaDinamica = (diasAtras: number): string => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha.toISOString();
};

export const mockPlantillasMatriz: PlantillaMatriz[] = [
  {
    id: '1',
    identificador: 1001,
    nombre: 'Inspección Pre-viaje Completa',
    descripcion: 'Plantilla para revisión completa antes del inicio del servicio diario',
    activa: true,
    pesoTotal: 100,
    fechaCreacion: generarFechaDinamica(15),
    fechaActualizacion: generarFechaDinamica(5),
    usuarioCreacion: 'Admin Sistema',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Verificaciones Exteriores',
        peso: 35,
        orden: 1,
        campos: [
          {
            id: 'campo1',
            tipo: 'checkbox',
            etiqueta: '¿Carrocería sin daños visibles?',
            requerido: true,
            peso: 10,
            orden: 1,
          },
          {
            id: 'campo2',
            tipo: 'select',
            etiqueta: 'Estado de neumáticos',
            requerido: true,
            peso: 15,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Requiere cambio'],
            orden: 2,
          },
          {
            id: 'campo3',
            tipo: 'checkbox',
            etiqueta: '¿Luces operativas (delanteras y traseras)?',
            requerido: true,
            peso: 10,
            orden: 3,
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Sistema Mecánico',
        peso: 40,
        orden: 2,
        campos: [
          {
            id: 'campo4',
            tipo: 'radio',
            etiqueta: 'Estado del motor',
            requerido: true,
            peso: 20,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Crítico'],
            orden: 1,
          },
          {
            id: 'campo5',
            tipo: 'checkbox',
            etiqueta: '¿Sistema de frenos responde correctamente?',
            requerido: true,
            peso: 15,
            orden: 2,
          },
          {
            id: 'campo6',
            tipo: 'texto',
            etiqueta: 'Observaciones técnicas',
            requerido: false,
            peso: 5,
            orden: 3,
          }
        ]
      },
      {
        id: 'sec3',
        nombre: 'Documentación y Firma',
        peso: 25,
        orden: 3,
        campos: [
          {
            id: 'campo7',
            tipo: 'fecha',
            etiqueta: 'Fecha de revisión',
            requerido: true,
            peso: 10,
            orden: 1,
          },
          {
            id: 'campo8',
            tipo: 'canvas',
            etiqueta: 'Firma del conductor responsable',
            requerido: true,
            peso: 15,
            orden: 2,
          }
        ]
      }
    ]
  },
  {
    id: '2',
    identificador: 1002,
    nombre: 'Revisión Técnica Mensual',
    descripcion: 'Inspección técnica detallada para mantenimiento preventivo mensual',
    activa: true,
    pesoTotal: 100,
    fechaCreacion: generarFechaDinamica(8),
    fechaActualizacion: generarFechaDinamica(2),
    usuarioCreacion: 'Técnico Jefe',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Sistema Eléctrico',
        peso: 30,
        orden: 1,
        campos: [
          {
            id: 'campo1',
            tipo: 'select',
            etiqueta: 'Estado de la batería',
            requerido: true,
            peso: 15,
            opciones: ['Excelente', 'Bueno', 'Regular', 'Reemplazar urgente'],
            orden: 1,
          },
          {
            id: 'campo2',
            tipo: 'checkbox',
            etiqueta: '¿Alternador funcionando correctamente?',
            requerido: true,
            peso: 10,
            orden: 2,
          },
          {
            id: 'campo3',
            tipo: 'checkbox',
            etiqueta: '¿Conexiones eléctricas seguras?',
            requerido: true,
            peso: 5,
            orden: 3,
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Sistema de Frenado',
        peso: 35,
        orden: 2,
        campos: [
          {
            id: 'campo4',
            tipo: 'radio',
            etiqueta: 'Estado de pastillas de freno',
            requerido: true,
            peso: 20,
            opciones: ['Nuevas', 'Buenas', 'Desgastadas', 'Críticas'],
            orden: 1,
          },
          {
            id: 'campo5',
            tipo: 'checkbox',
            etiqueta: '¿Líquido de frenos en nivel adecuado?',
            requerido: true,
            peso: 10,
            orden: 2,
          },
          {
            id: 'campo6',
            tipo: 'canvas',
            etiqueta: 'Diagrama de puntos de inspección',
            requerido: false,
            peso: 5,
            imagenBase: '/diagrama-frenos.png',
            orden: 3,
          }
        ]
      },
      {
        id: 'sec3',
        nombre: 'Certificación Técnica',
        peso: 35,
        orden: 3,
        campos: [
          {
            id: 'campo7',
            tipo: 'fecha',
            etiqueta: 'Próxima revisión programada',
            requerido: true,
            peso: 15,
            orden: 1,
          },
          {
            id: 'campo8',
            tipo: 'texto',
            etiqueta: 'Observaciones del técnico',
            requerido: false,
            peso: 10,
            orden: 2,
          },
          {
            id: 'campo9',
            tipo: 'canvas',
            etiqueta: 'Firma y sello del técnico certificado',
            requerido: true,
            peso: 10,
            orden: 3,
          }
        ]
      }
    ]
  },
  {
    id: '3',
    identificador: 1003,
    nombre: 'Inspección de Seguridad Básica',
    descripcion: 'Verificación rápida de elementos de seguridad esenciales',
    activa: false,
    pesoTotal: 100,
    fechaCreacion: generarFechaDinamica(30),
    fechaActualizacion: generarFechaDinamica(25),
    usuarioCreacion: 'Supervisor Operaciones',
    secciones: [
      {
        id: 'sec1',
        nombre: 'Elementos de Seguridad',
        peso: 60,
        orden: 1,
        campos: [
          {
            id: 'campo1',
            tipo: 'checkbox',
            etiqueta: '¿Cinturones de seguridad operativos?',
            requerido: true,
            peso: 15,
            orden: 1,
          },
          {
            id: 'campo2',
            tipo: 'checkbox',
            etiqueta: '¿Salidas de emergencia despejadas?',
            requerido: true,
            peso: 15,
            orden: 2,
          },
          {
            id: 'campo3',
            tipo: 'select',
            etiqueta: 'Estado del extintor',
            requerido: true,
            peso: 15,
            opciones: ['Vigente', 'Por vencer', 'Vencido', 'No presente'],
            orden: 3,
          },
          {
            id: 'campo4',
            tipo: 'checkbox',
            etiqueta: '¿Botiquín completo y vigente?',
            requerido: true,
            peso: 15,
            orden: 4,
          }
        ]
      },
      {
        id: 'sec2',
        nombre: 'Validación Final',
        peso: 40,
        orden: 2,
        campos: [
          {
            id: 'campo5',
            tipo: 'radio',
            etiqueta: 'Calificación general de seguridad',
            requerido: true,
            peso: 25,
            opciones: ['Excelente', 'Bueno', 'Aceptable', 'Deficiente'],
            orden: 1,
          },
          {
            id: 'campo6',
            tipo: 'fecha',
            etiqueta: 'Fecha de la inspección',
            requerido: true,
            peso: 5,
            orden: 2,
          },
          {
            id: 'campo7',
            tipo: 'canvas',
            etiqueta: 'Firma del inspector',
            requerido: true,
            peso: 10,
            orden: 3,
          }
        ]
      }
    ]
  }
];

export const getPlantillaMatrizById = (id: string): PlantillaMatriz | null => {
  return mockPlantillasMatriz.find(plantilla => plantilla.id === id) || null;
};

export const getPlantillasMatrizActivas = (): PlantillaMatriz[] => {
  return mockPlantillasMatriz.filter(plantilla => plantilla.activa);
};

export const getProximoIdentificador = (): number => {
  const maxId = Math.max(...mockPlantillasMatriz.map(p => p.identificador));
  return maxId + 1;
};