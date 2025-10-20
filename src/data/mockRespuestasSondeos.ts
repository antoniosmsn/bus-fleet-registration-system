import { RespuestaSondeo } from '@/types/sondeo-ruta';

export const mockRespuestasSondeos: (RespuestaSondeo & { sondeoId: string })[] = [
  // Respuestas para sondeo 1
  // Pregunta 1: ¿Está interesado en usar esta nueva ruta?
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas1', fechaRespuesta: '2024-01-16T08:30:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas2', fechaRespuesta: '2024-01-16T09:15:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas3', fechaRespuesta: '2024-01-16T10:00:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas4', fechaRespuesta: '2024-01-16T11:20:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas5', fechaRespuesta: '2024-01-16T12:45:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas6', fechaRespuesta: '2024-01-16T13:30:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas7', fechaRespuesta: '2024-01-16T14:15:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o1', pasajeroId: 'pas8', fechaRespuesta: '2024-01-16T15:00:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o2', pasajeroId: 'pas9', fechaRespuesta: '2024-01-16T15:45:00' },
  { sondeoId: '1', questionId: 'p1', optionId: 'o2', pasajeroId: 'pas10', fechaRespuesta: '2024-01-16T16:30:00' },
  
  // Pregunta 2: ¿Con qué frecuencia utilizaría esta ruta?
  { sondeoId: '1', questionId: 'p2', optionId: 'o3', pasajeroId: 'pas1', fechaRespuesta: '2024-01-16T08:30:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o3', pasajeroId: 'pas2', fechaRespuesta: '2024-01-16T09:15:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o3', pasajeroId: 'pas3', fechaRespuesta: '2024-01-16T10:00:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o4', pasajeroId: 'pas4', fechaRespuesta: '2024-01-16T11:20:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o4', pasajeroId: 'pas5', fechaRespuesta: '2024-01-16T12:45:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o5', pasajeroId: 'pas6', fechaRespuesta: '2024-01-16T13:30:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o5', pasajeroId: 'pas7', fechaRespuesta: '2024-01-16T14:15:00' },
  { sondeoId: '1', questionId: 'p2', optionId: 'o6', pasajeroId: 'pas8', fechaRespuesta: '2024-01-16T15:00:00' },

  // Respuestas para sondeo 2
  // Pregunta 3: ¿Está interesado en usar esta nueva ruta?
  { sondeoId: '2', questionId: 'p3', optionId: 'o7', pasajeroId: 'pas11', fechaRespuesta: '2024-01-21T08:00:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o7', pasajeroId: 'pas12', fechaRespuesta: '2024-01-21T08:30:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o7', pasajeroId: 'pas13', fechaRespuesta: '2024-01-21T09:00:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o7', pasajeroId: 'pas14', fechaRespuesta: '2024-01-21T09:30:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o7', pasajeroId: 'pas15', fechaRespuesta: '2024-01-21T10:00:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o8', pasajeroId: 'pas16', fechaRespuesta: '2024-01-21T10:30:00' },
  { sondeoId: '2', questionId: 'p3', optionId: 'o8', pasajeroId: 'pas17', fechaRespuesta: '2024-01-21T11:00:00' },
  
  // Pregunta 4: ¿Qué horario preferiría para esta ruta?
  { sondeoId: '2', questionId: 'p4', optionId: 'o9', pasajeroId: 'pas11', fechaRespuesta: '2024-01-21T08:00:00' },
  { sondeoId: '2', questionId: 'p4', optionId: 'o9', pasajeroId: 'pas12', fechaRespuesta: '2024-01-21T08:30:00' },
  { sondeoId: '2', questionId: 'p4', optionId: 'o9', pasajeroId: 'pas13', fechaRespuesta: '2024-01-21T09:00:00' },
  { sondeoId: '2', questionId: 'p4', optionId: 'o10', pasajeroId: 'pas14', fechaRespuesta: '2024-01-21T09:30:00' },
  { sondeoId: '2', questionId: 'p4', optionId: 'o11', pasajeroId: 'pas15', fechaRespuesta: '2024-01-21T10:00:00' },
];
