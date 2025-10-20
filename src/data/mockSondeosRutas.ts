import { SondeoRuta } from '../types/sondeo-ruta';

export const mockSondeosRutas: SondeoRuta[] = [
  {
    id: '1',
    tituloEs: 'Ruta San José - Cartago Express',
    tituloEn: 'San José - Cartago Express Route',
    mensajeEs: 'Estamos evaluando la apertura de una nueva ruta directa entre San José y Cartago. Nos gustaría conocer su opinión y nivel de interés.',
    mensajeEn: 'We are evaluating the opening of a new direct route between San José and Cartago. We would like to know your opinion and level of interest.',
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
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o1', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o2', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      },
      {
        id: 'p2',
        textoEs: '¿Con qué frecuencia utilizaría esta ruta?',
        textoEn: 'How often would you use this route?',
        obligatoria: false,
        orden: 2,
        opciones: [
          { id: 'o3', textoEs: 'Diariamente', textoEn: 'Daily', orden: 1 },
          { id: 'o4', textoEs: '3-4 veces por semana', textoEn: '3-4 times per week', orden: 2 },
          { id: 'o5', textoEs: '1-2 veces por semana', textoEn: '1-2 times per week', orden: 3 },
          { id: 'o6', textoEs: 'Ocasionalmente', textoEn: 'Occasionally', orden: 4 }
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
    tituloEs: 'Circuito Zona Franca El Coyol',
    tituloEn: 'El Coyol Free Zone Circuit',
    mensajeEs: 'Propuesta de ruta circular dentro de la zona franca para mejorar la conectividad interna.',
    mensajeEn: 'Proposed circular route within the free zone to improve internal connectivity.',
    fechaPublicacion: '2024-01-20T09:00:00',
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-5',
    rutaExistenteNombre: 'Circuito Metropolitano',
    trazado: [
      { lat: 9.9350, lng: -84.0900, orden: 1 },
      { lat: 9.9400, lng: -84.0900, orden: 2 },
      { lat: 9.9400, lng: -84.0850, orden: 3 },
      { lat: 9.9350, lng: -84.0850, orden: 4 }
    ],
    preguntas: [
      {
        id: 'p3',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o7', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o8', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      },
      {
        id: 'p4',
        textoEs: '¿Qué horario preferiría para esta ruta?',
        textoEn: 'What schedule would you prefer for this route?',
        obligatoria: false,
        orden: 2,
        opciones: [
          { id: 'o9', textoEs: 'Mañana (6:00-9:00)', textoEn: 'Morning (6:00-9:00)', orden: 1 },
          { id: 'o10', textoEs: 'Mediodía (12:00-14:00)', textoEn: 'Midday (12:00-14:00)', orden: 2 },
          { id: 'o11', textoEs: 'Tarde (16:00-19:00)', textoEn: 'Afternoon (16:00-19:00)', orden: 3 }
        ]
      }
    ],
    turnosObjetivo: ['1'],
    radioKm: 3,
    pasajerosElegibles: 180,
    estado: 'publicado',
    fechaCreacion: '2024-01-19T14:00:00',
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '3',
    tituloEs: 'Ruta Nocturna Centro - Zonas Residenciales',
    tituloEn: 'Night Route Downtown - Residential Areas',
    mensajeEs: 'Evaluación de demanda para servicio nocturno que conecte el centro con principales zonas residenciales.',
    mensajeEn: 'Demand evaluation for night service connecting downtown with main residential areas.',
    fechaPublicacion: '2024-02-01T10:00:00',
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9300, lng: -84.0850, orden: 1 },
      { lat: 9.9350, lng: -84.0900, orden: 2 },
      { lat: 9.9400, lng: -84.0950, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p5',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o12', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o13', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['3'],
    radioKm: 7,
    pasajerosElegibles: 120,
    estado: 'borrador',
    fechaCreacion: '2024-01-30T16:00:00',
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  }
];

export const getSondeosRutasByZonaFranca = (zonaFrancaId: string): SondeoRuta[] => {
  return mockSondeosRutas.filter(sondeo => sondeo.zonaFrancaId === zonaFrancaId);
};