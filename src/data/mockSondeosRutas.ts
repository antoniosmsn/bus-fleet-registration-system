import { SondeoRuta } from '../types/sondeo-ruta';

// Función auxiliar para generar fechas aleatorias en el último mes
const generarFechaAleatoria = (diasAtras: number): string => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - Math.floor(Math.random() * diasAtras));
  return fecha.toISOString();
};

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
      },
      {
        id: 'p3',
        textoEs: '¿Qué horario preferiría?',
        textoEn: 'What schedule would you prefer?',
        obligatoria: false,
        orden: 3,
        opciones: [
          { id: 'o7', textoEs: '5:00 AM - 7:00 AM', textoEn: '5:00 AM - 7:00 AM', orden: 1 },
          { id: 'o8', textoEs: '7:00 AM - 9:00 AM', textoEn: '7:00 AM - 9:00 AM', orden: 2 },
          { id: 'o9', textoEs: '4:00 PM - 6:00 PM', textoEn: '4:00 PM - 6:00 PM', orden: 3 },
          { id: 'o10', textoEs: '6:00 PM - 8:00 PM', textoEn: '6:00 PM - 8:00 PM', orden: 4 }
        ]
      },
      {
        id: 'p4',
        textoEs: '¿Cuál es su principal motivo de viaje?',
        textoEn: 'What is your main travel purpose?',
        obligatoria: false,
        orden: 4,
        opciones: [
          { id: 'o11', textoEs: 'Trabajo', textoEn: 'Work', orden: 1 },
          { id: 'o12', textoEs: 'Estudio', textoEn: 'Study', orden: 2 },
          { id: 'o13', textoEs: 'Compras', textoEn: 'Shopping', orden: 3 },
          { id: 'o14', textoEs: 'Recreación', textoEn: 'Recreation', orden: 4 }
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
  },
  {
    id: '4',
    tituloEs: 'Ruta Rápida Aeropuerto - Zona Franca',
    tituloEn: 'Fast Route Airport - Free Zone',
    mensajeEs: 'Ruta express para conectar el aeropuerto internacional con las principales zonas francas.',
    mensajeEn: 'Express route to connect the international airport with the main free zones.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9937, lng: -84.2089, orden: 1 },
      { lat: 9.9850, lng: -84.1950, orden: 2 },
      { lat: 9.9750, lng: -84.1850, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p6',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o14', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o15', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 8,
    pasajerosElegibles: 310,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '5',
    tituloEs: 'Circuito Urbano Centro',
    tituloEn: 'Downtown Urban Circuit',
    mensajeEs: 'Propuesta de circuito urbano que conecta los principales puntos del centro de la ciudad.',
    mensajeEn: 'Urban circuit proposal connecting the main points of downtown.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9326, lng: -84.0894, orden: 1 },
      { lat: 9.9340, lng: -84.0850, orden: 2 },
      { lat: 9.9360, lng: -84.0820, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p7',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o16', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o17', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1'],
    radioKm: 4,
    pasajerosElegibles: 195,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '6',
    tituloEs: 'Ruta Estudiantes Universidad',
    tituloEn: 'University Students Route',
    mensajeEs: 'Ruta especializada para estudiantes universitarios que conecta campus principales.',
    mensajeEn: 'Specialized route for university students connecting main campuses.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-8',
    rutaExistenteNombre: 'Ruta Universitaria',
    trazado: [
      { lat: 9.9380, lng: -84.0510, orden: 1 },
      { lat: 9.9400, lng: -84.0480, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p8',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o18', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o19', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 6,
    pasajerosElegibles: 280,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '7',
    tituloEs: 'Ruta Expres Zonas Industriales',
    tituloEn: 'Industrial Zones Express Route',
    mensajeEs: 'Conexión rápida entre las principales zonas industriales del área metropolitana.',
    mensajeEn: 'Fast connection between the main industrial zones of the metropolitan area.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9200, lng: -84.0650, orden: 1 },
      { lat: 9.9150, lng: -84.0600, orden: 2 },
      { lat: 9.9100, lng: -84.0550, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p9',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o20', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o21', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '3'],
    radioKm: 7,
    pasajerosElegibles: 340,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '8',
    tituloEs: 'Ruta Ecológica Parques',
    tituloEn: 'Ecological Parks Route',
    mensajeEs: 'Ruta que conecta los principales parques y áreas verdes de la ciudad.',
    mensajeEn: 'Route connecting the main parks and green areas of the city.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9450, lng: -84.0700, orden: 1 },
      { lat: 9.9480, lng: -84.0680, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p10',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o22', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o23', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['2'],
    radioKm: 5,
    pasajerosElegibles: 150,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '9',
    tituloEs: 'Ruta Hospitales y Clínicas',
    tituloEn: 'Hospitals and Clinics Route',
    mensajeEs: 'Ruta especializada para conectar los principales centros médicos.',
    mensajeEn: 'Specialized route to connect the main medical centers.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9320, lng: -84.0780, orden: 1 },
      { lat: 9.9300, lng: -84.0750, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p11',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o24', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o25', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2', '3'],
    radioKm: 4,
    pasajerosElegibles: 220,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '10',
    tituloEs: 'Ruta Comercial Centro Comercial',
    tituloEn: 'Shopping Mall Commercial Route',
    mensajeEs: 'Conecta los principales centros comerciales de la zona metropolitana.',
    mensajeEn: 'Connects the main shopping malls in the metropolitan area.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-12',
    rutaExistenteNombre: 'Ruta Comercial',
    trazado: [
      { lat: 9.9400, lng: -84.0920, orden: 1 },
      { lat: 9.9380, lng: -84.0880, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p12',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o26', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o27', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['2'],
    radioKm: 6,
    pasajerosElegibles: 265,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '11',
    tituloEs: 'Ruta Turística Centro Histórico',
    tituloEn: 'Historic Downtown Tourist Route',
    mensajeEs: 'Ruta turística que recorre los principales sitios históricos del centro.',
    mensajeEn: 'Tourist route touring the main historic sites downtown.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9330, lng: -84.0830, orden: 1 },
      { lat: 9.9320, lng: -84.0810, orden: 2 },
      { lat: 9.9310, lng: -84.0790, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p13',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o28', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o29', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 5,
    pasajerosElegibles: 175,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '12',
    tituloEs: 'Ruta Nocturna Seguridad',
    tituloEn: 'Safety Night Route',
    mensajeEs: 'Ruta nocturna con paradas en zonas iluminadas y seguras.',
    mensajeEn: 'Night route with stops in well-lit and safe areas.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9280, lng: -84.0870, orden: 1 },
      { lat: 9.9260, lng: -84.0850, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p14',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o30', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o31', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['3'],
    radioKm: 6,
    pasajerosElegibles: 140,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '13',
    tituloEs: 'Ruta Express Terminal Bus',
    tituloEn: 'Bus Terminal Express Route',
    mensajeEs: 'Conexión directa entre terminales de buses y zonas de trabajo.',
    mensajeEn: 'Direct connection between bus terminals and work zones.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-15',
    rutaExistenteNombre: 'Ruta Terminal',
    trazado: [
      { lat: 9.9500, lng: -84.0950, orden: 1 },
      { lat: 9.9480, lng: -84.0900, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p15',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o32', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o33', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1'],
    radioKm: 7,
    pasajerosElegibles: 290,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '14',
    tituloEs: 'Ruta Residencial Norte',
    tituloEn: 'North Residential Route',
    mensajeEs: 'Ruta que conecta las zonas residenciales del norte con el centro.',
    mensajeEn: 'Route connecting northern residential areas with downtown.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9550, lng: -84.0850, orden: 1 },
      { lat: 9.9520, lng: -84.0820, orden: 2 },
      { lat: 9.9500, lng: -84.0800, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p16',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o34', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o35', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 8,
    pasajerosElegibles: 325,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '15',
    tituloEs: 'Ruta Deportiva Estadios',
    tituloEn: 'Sports Stadiums Route',
    mensajeEs: 'Ruta especial para días de eventos deportivos conectando estadios.',
    mensajeEn: 'Special route for sports event days connecting stadiums.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9360, lng: -84.0950, orden: 1 },
      { lat: 9.9340, lng: -84.0920, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p17',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o36', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o37', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      },
      {
        id: 'p17a',
        textoEs: '¿Con qué frecuencia asistiría a eventos deportivos?',
        textoEn: 'How often would you attend sports events?',
        obligatoria: false,
        orden: 2,
        opciones: [
          { id: 'o37a', textoEs: 'Cada semana', textoEn: 'Every week', orden: 1 },
          { id: 'o37b', textoEs: 'Una vez al mes', textoEn: 'Once a month', orden: 2 },
          { id: 'o37c', textoEs: 'Ocasionalmente', textoEn: 'Occasionally', orden: 3 }
        ]
      },
      {
        id: 'p17b',
        textoEs: '¿Qué tipo de eventos prefiere?',
        textoEn: 'What type of events do you prefer?',
        obligatoria: false,
        orden: 3,
        opciones: [
          { id: 'o37d', textoEs: 'Fútbol', textoEn: 'Soccer', orden: 1 },
          { id: 'o37e', textoEs: 'Baloncesto', textoEn: 'Basketball', orden: 2 },
          { id: 'o37f', textoEs: 'Conciertos', textoEn: 'Concerts', orden: 3 },
          { id: 'o37g', textoEs: 'Otros eventos', textoEn: 'Other events', orden: 4 }
        ]
      },
      {
        id: 'p17c',
        textoEs: '¿Viajaría acompañado?',
        textoEn: 'Would you travel with companions?',
        obligatoria: false,
        orden: 4,
        opciones: [
          { id: 'o37h', textoEs: 'Solo', textoEn: 'Alone', orden: 1 },
          { id: 'o37i', textoEs: 'Con 1-2 personas', textoEn: 'With 1-2 people', orden: 2 },
          { id: 'o37j', textoEs: 'Con 3+ personas', textoEn: 'With 3+ people', orden: 3 }
        ]
      }
    ],
    turnosObjetivo: ['2', '3'],
    radioKm: 5,
    pasajerosElegibles: 200,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '16',
    tituloEs: 'Ruta Escolar Colegios',
    tituloEn: 'School Route',
    mensajeEs: 'Ruta matutina y vespertina para estudiantes de secundaria.',
    mensajeEn: 'Morning and afternoon route for high school students.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-18',
    rutaExistenteNombre: 'Ruta Escolar',
    trazado: [
      { lat: 9.9420, lng: -84.0740, orden: 1 },
      { lat: 9.9400, lng: -84.0720, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p18',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o38', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o39', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 6,
    pasajerosElegibles: 240,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '17',
    tituloEs: 'Ruta Playera Fin de Semana',
    tituloEn: 'Weekend Beach Route',
    mensajeEs: 'Ruta de fin de semana hacia las playas cercanas.',
    mensajeEn: 'Weekend route to nearby beaches.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9300, lng: -84.0900, orden: 1 },
      { lat: 9.9250, lng: -84.0950, orden: 2 },
      { lat: 9.9200, lng: -84.1000, orden: 3 }
    ],
    preguntas: [
      {
        id: 'p19',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o40', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o41', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['2'],
    radioKm: 9,
    pasajerosElegibles: 180,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  },
  {
    id: '18',
    tituloEs: 'Ruta Cultural Museos',
    tituloEn: 'Museums Cultural Route',
    mensajeEs: 'Recorrido por los principales museos y centros culturales.',
    mensajeEn: 'Tour of the main museums and cultural centers.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9340, lng: -84.0760, orden: 1 },
      { lat: 9.9330, lng: -84.0740, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p20',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o42', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o43', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['2'],
    radioKm: 4,
    pasajerosElegibles: 160,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'admin',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '19',
    tituloEs: 'Ruta Empresarial Parque Tecnológico',
    tituloEn: 'Technology Park Business Route',
    mensajeEs: 'Conexión directa con el parque tecnológico y empresas de innovación.',
    mensajeEn: 'Direct connection to the technology park and innovation companies.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'ruta-existente',
    rutaExistenteId: 'ruta-20',
    rutaExistenteNombre: 'Ruta Tecnológica',
    trazado: [
      { lat: 9.9460, lng: -84.0650, orden: 1 },
      { lat: 9.9440, lng: -84.0620, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p21',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o44', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o45', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 7,
    pasajerosElegibles: 315,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'jperez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp1'
  },
  {
    id: '20',
    tituloEs: 'Ruta Alimentación Mercados',
    tituloEn: 'Food Markets Route',
    mensajeEs: 'Ruta que conecta los principales mercados y ferias de agricultores.',
    mensajeEn: 'Route connecting the main markets and farmers fairs.',
    fechaPublicacion: generarFechaAleatoria(30),
    tipoTrazado: 'dibujado',
    trazado: [
      { lat: 9.9310, lng: -84.0860, orden: 1 },
      { lat: 9.9290, lng: -84.0840, orden: 2 }
    ],
    preguntas: [
      {
        id: 'p22',
        textoEs: '¿Está interesado en usar esta nueva ruta?',
        textoEn: 'Are you interested in using this new route?',
        obligatoria: true,
        orden: 1,
        opciones: [
          { id: 'o46', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
          { id: 'o47', textoEs: 'No', textoEn: 'No', orden: 2 }
        ]
      }
    ],
    turnosObjetivo: ['1', '2'],
    radioKm: 5,
    pasajerosElegibles: 210,
    estado: 'publicado',
    fechaCreacion: generarFechaAleatoria(31),
    usuarioCreacion: 'mrodriguez',
    zonaFrancaId: 'zf1',
    empresaClienteId: 'emp2'
  }
];

export const getSondeosRutasByZonaFranca = (zonaFrancaId: string): SondeoRuta[] => {
  return mockSondeosRutas.filter(sondeo => sondeo.zonaFrancaId === zonaFrancaId);
};