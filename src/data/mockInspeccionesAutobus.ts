import { InspeccionAutobus } from '@/types/inspeccion-autobus';

// Función helper para generar fechas dinámicas
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getRandomDateInRange = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

export const mockInspeccionesAutobus: InspeccionAutobus[] = [
  // Primeros 15 registros con fecha de hoy
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `insp${i + 1}`,
    consecutivo: 2024001 + i,
    fechaInspeccion: getTodayDate(),
    placa: `CRC-${(1000 + i).toString()}`,
    conductor: {
      id: `cond${(i % 10) + 1}`,
      nombre: ['Juan', 'María', 'Carlos', 'Ana', 'Roberto', 'Patricia', 'Luis', 'Elena', 'David', 'Carmen'][i % 10],
      apellidos: ['Pérez Rodríguez', 'González López', 'Ramírez Solano', 'Vega Mora', 'Mendoza Castro', 'Jiménez Vargas', 'Herrera Soto', 'Campos Rojas', 'Morales Chaves', 'Villalobos Quesada'][i % 10],
      codigo: `00${(i % 10) + 1}`.slice(-3)
    },
    transportista: {
      id: `${(i % 8) + 1}`,
      nombre: ['Transportes San José S.A.', 'Autobuses del Valle', 'Empresa de Transporte Central', 'Transportes Unidos', 'Buses Express Costa Rica', 'Transportes Metropolitanos', 'Línea Azul Transporte', 'Servicios de Transporte Especial'][i % 8],
      codigo: ['TSJ001', 'ADV002', 'ETC003', 'TU004', 'BECR005', 'TM006', 'LAT007', 'STE008'][i % 8]
    },
    plantilla: {
      id: `${(i % 3) + 1}`,
      nombre: ['Inspección General de Autobús', 'Inspección Pre-viaje', 'Inspección Técnica Detallada'][i % 3]
    },
    kilometros: 45000 + (i * 1500),
    respuestas: [
      {
        seccionId: 'sec1',
        respuestas: [
          { campoId: 'campo1', valor: Math.random() > 0.2, puntuacion: Math.random() > 0.2 ? 8 : 0 },
          { campoId: 'campo2', valor: ['Excelente', 'Bueno', 'Regular'][Math.floor(Math.random() * 3)], puntuacion: [10, 8, 5][Math.floor(Math.random() * 3)] }
        ],
        puntuacionSeccion: Math.floor(Math.random() * 10) + 15
      }
    ],
    calificacionFinal: Math.floor(Math.random() * 30) + 70,
    estado: 'completada' as 'completada' | 'pendiente',
    pdfUrl: `storage/inspecciones/insp${i + 1}.pdf`,
    fechaCreacion: `${getTodayDate()}T${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}:00Z`,
    usuarioCreacion: 'admin@sistema.com',
    observaciones: i % 4 === 0 ? `Observación de prueba ${i + 1}` : undefined
  })),
  
  // Registros adicionales con fechas variadas
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `insp${i + 16}`,
    consecutivo: 2024016 + i,
    fechaInspeccion: getRandomDateInRange(30),
    placa: `CRC-${(2000 + i).toString()}`,
    conductor: {
      id: `cond${(i % 10) + 1}`,
      nombre: ['Juan', 'María', 'Carlos', 'Ana', 'Roberto', 'Patricia', 'Luis', 'Elena', 'David', 'Carmen'][i % 10],
      apellidos: ['Pérez Rodríguez', 'González López', 'Ramírez Solano', 'Vega Mora', 'Mendoza Castro', 'Jiménez Vargas', 'Herrera Soto', 'Campos Rojas', 'Morales Chaves', 'Villalobos Quesada'][i % 10],
      codigo: `00${(i % 10) + 1}`.slice(-3)
    },
    transportista: {
      id: `${(i % 8) + 1}`,
      nombre: ['Transportes San José S.A.', 'Autobuses del Valle', 'Empresa de Transporte Central', 'Transportes Unidos', 'Buses Express Costa Rica', 'Transportes Metropolitanos', 'Línea Azul Transporte', 'Servicios de Transporte Especial'][i % 8],
      codigo: ['TSJ001', 'ADV002', 'ETC003', 'TU004', 'BECR005', 'TM006', 'LAT007', 'STE008'][i % 8]
    },
    plantilla: {
      id: `${(i % 3) + 1}`,
      nombre: ['Inspección General de Autobús', 'Inspección Pre-viaje', 'Inspección Técnica Detallada'][i % 3]
    },
    kilometros: 35000 + (i * 2000),
    respuestas: [
      {
        seccionId: 'sec1',
        respuestas: [
          { campoId: 'campo1', valor: Math.random() > 0.3, puntuacion: Math.random() > 0.3 ? 8 : 0 },
          { campoId: 'campo2', valor: ['Excelente', 'Bueno', 'Regular'][Math.floor(Math.random() * 3)], puntuacion: [10, 8, 5][Math.floor(Math.random() * 3)] }
        ],
        puntuacionSeccion: Math.floor(Math.random() * 15) + 10
      }
    ],
    calificacionFinal: Math.floor(Math.random() * 40) + 60,
    estado: (Math.random() > 0.1 ? 'completada' : 'pendiente') as 'completada' | 'pendiente',
    pdfUrl: Math.random() > 0.1 ? `storage/inspecciones/insp${i + 16}.pdf` : undefined,
    fechaCreacion: `${getRandomDateInRange(30)}T${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00Z`,
    usuarioCreacion: ['admin@sistema.com', 'inspector1@sistema.com', 'inspector2@sistema.com'][i % 3],
    observaciones: i % 3 === 0 ? `Inspección de rutina ${i + 16}` : undefined
  }))
];

// Función helper para obtener la inspección por ID
export const getInspeccionById = (id: string): InspeccionAutobus | null => {
  return mockInspeccionesAutobus.find(inspeccion => inspeccion.id === id) || null;
};

// Función helper para obtener inspecciones por placa
export const getInspeccionesByPlaca = (placa: string): InspeccionAutobus[] => {
  return mockInspeccionesAutobus.filter(inspeccion => 
    inspeccion.placa.toLowerCase().includes(placa.toLowerCase())
  );
};

// Función helper para obtener el siguiente consecutivo
export const getNextConsecutivo = (): number => {
  const maxConsecutivo = Math.max(...mockInspeccionesAutobus.map(i => i.consecutivo));
  return maxConsecutivo + 1;
};

// Función helper para obtener inspecciones por fecha
export const getInspeccionesByFecha = (fecha: string): InspeccionAutobus[] => {
  return mockInspeccionesAutobus.filter(inspeccion => inspeccion.fechaInspeccion === fecha);
};