import { SondeoRuta } from '../types/sondeo-ruta';

export const mockSondeosRutas: SondeoRuta[] = [
  {
    id: '1',
    titulo: 'Ruta San José - Cartago Express',
    mensaje: 'Estamos evaluando la apertura de una nueva ruta directa entre San José y Cartago. Nos gustaría conocer su opinión y nivel de interés.',
    fechaPublicacion: '2024-01-15T08:00:00',
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9281, lng: -84.0907, orden: 1 },
      { lat: 9.9350, lng: -84.0850, orden: 2 },
      { lat: 9.9400, lng: -84.0750, orden: 3 },
      { lat: 9.9500, lng: -84.0650, orden: 4 }
    ],
    preguntas: [
      {
        id: 'p1',
        texto: '¿Está interesado en usar esta nueva ruta?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o1', texto: 'Sí', orden: 1 },
          { id: 'o2', texto: 'No', orden: 2 }
        ]
      },
      {
        id: 'p2',
        texto: '¿Con qué frecuencia utilizaría esta ruta?',
        obligatoria: false,
        orden: 2,
        opciones: [
          { id: 'o3', texto: 'Diariamente', orden: 1 },
          { id: 'o4', texto: '3-4 veces por semana', orden: 2 },
          { id: 'o5', texto: '1-2 veces por semana', orden: 3 },
          { id: 'o6', texto: 'Ocasionalmente', orden: 4 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 5,
    pasajerosElegibles: 245,
    estado: 'publicado',
    fechaCreacion: '2024-01-14T10:30:00',
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '2',
    titulo: 'Ruta Zona Franca - Centro Comercial',
    mensaje: 'Propuesta de ruta desde Zona Franca hasta el nuevo centro comercial. Su opinión es importante para nosotros.',
    fechaPublicacion: '2024-01-20T07:00:00',
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-3',
    rutaExistenteNombre: 'Zona Franca - Centro',
    trazado: [
      { lat: 9.9200, lng: -84.1000, orden: 1 },
      { lat: 9.9250, lng: -84.0950, orden: 2 },
      { lat: 9.9300, lng: -84.0900, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p1',
        texto: '¿Está interesado en usar esta nueva ruta?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o1', texto: 'Sí', orden: 1 },
          { id: 'o2', texto: 'No', orden: 2 }
        ]
      },
      {
        id: 'p3',
        texto: '¿En qué horario preferiría usar esta ruta?',
        obligatoria: false,
        orden: 2,
        opciones: [
          { id: 'o7', texto: 'Mañana (6am-12pm)', orden: 1 },
          { id: 'o8', texto: 'Tarde (12pm-6pm)', orden: 2 },
          { id: 'o9', texto: 'Noche (6pm-10pm)', orden: 3 }
        ]
      }
    ],
    turnosObjetivo: ['1'],
    radioKm: 3,
    pasajerosElegibles: 178,
    estado: 'publicado',
    fechaCreacion: '2024-01-19T14:20:00',
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '3',
    titulo: 'Ruta Nocturna Zona Industrial',
    mensaje: 'Evaluación de demanda para ruta nocturna en zona industrial. Ayúdenos a mejorar el servicio.',
    fechaPublicacion: '2024-01-25T18:00:00',
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9100, lng: -84.1100, orden: 1 },
      { lat: 9.9150, lng: -84.1050, orden: 2 },
      { lat: 9.9200, lng: -84.1000, orden: 3 },
      { lat: 9.9250, lng: -84.0950, orden: 4 },
      { lat: 9.9300, lng: -84.0900, orden: 5 }
    ],
    preguntas: [
      {
        id: 'p1',
        texto: '¿Está interesado en usar esta nueva ruta?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o1', texto: 'Sí', orden: 1 },
          { id: 'o2', texto: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['3'],
    radioKm: 7,
    pasajerosElegibles: 89,
    estado: 'borrador',
    fechaCreacion: '2024-01-24T16:45:00',
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  }
];
