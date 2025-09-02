import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';

const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const getRandomServiceDate = (daysFromNow: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const empresasTransporte = [
  'Transportes San José S.A.',
  'Autobuses del Valle',
  'Empresa de Transporte Central',
  'Transportes Unidos',
  'Buses Express Costa Rica',
  'Transportes Rápidos',
  'Línea Dorada',
  'Autobuses Metropolitanos'
];

const rutas = [
  { id: '1', nombre: 'San José - Cartago', sentido: 'ingreso' as const },
  { id: '2', nombre: 'San José - Cartago', sentido: 'salida' as const },
  { id: '3', nombre: 'Alajuela', sentido: 'ingreso' as const },
  { id: '4', nombre: 'Alajuela', sentido: 'salida' as const },
  { id: '5', nombre: 'Heredia', sentido: 'ingreso' as const },
  { id: '6', nombre: 'Heredia', sentido: 'salida' as const },
  { id: '7', nombre: 'Zona Franca Intel', sentido: 'ingreso' as const },
  { id: '8', nombre: 'Zona Franca Intel', sentido: 'salida' as const },
  { id: '9', nombre: 'Cartago - Turrialba', sentido: 'ingreso' as const },
  { id: '10', nombre: 'Cartago - Turrialba', sentido: 'salida' as const }
];

const usuarios = [
  { id: 'usr_001', nombre: 'Carlos Mendoza', username: 'cmendoza' },
  { id: 'usr_002', nombre: 'Ana Rodriguez', username: 'arodriguez' },
  { id: 'usr_003', nombre: 'Luis García', username: 'lgarcia' },
  { id: 'usr_004', nombre: 'María López', username: 'mlopez' },
  { id: 'usr_005', nombre: 'Pedro Jiménez', username: 'pjimenez' }
];

const motivos = [
  'Error en selección de ruta por parte del conductor',
  'Cambio de destino por necesidades operacionales',
  'Reubicación de pasajeros por mantenimiento de ruta',
  'Ajuste por demanda de servicio',
  'Modificación por condiciones de tráfico',
  'Cambio solicitado por empresa cliente',
  'Optimización de rutas de transporte',
  'Reagrupación de servicios por eficiencia'
];

export const mockSolicitudesAprobacion: SolicitudAprobacion[] = Array.from({ length: 25 }, (_, index) => {
  const rutaOriginal = rutas[Math.floor(Math.random() * rutas.length)];
  let rutaNueva = rutas[Math.floor(Math.random() * rutas.length)];
  
  // Asegurar que la ruta nueva sea diferente a la original
  while (rutaNueva.id === rutaOriginal.id) {
    rutaNueva = rutas[Math.floor(Math.random() * rutas.length)];
  }
  
  const pasajerosAfectados = Math.floor(Math.random() * 50) + 10;
  const montoOriginal = Math.floor(Math.random() * 200000) + 100000;
  const montoFinal = Math.floor(Math.random() * 200000) + 100000;
  
  // Asignar estados de forma aleatoria: 60% pendiente, 25% aprobada, 15% rechazada
  const random = Math.random();
  let estado: 'pendiente' | 'aprobada' | 'rechazada';
  if (random < 0.6) {
    estado = 'pendiente';
  } else if (random < 0.85) {
    estado = 'aprobada';
  } else {
    estado = 'rechazada';
  }
  
  return {
    id: `sol_${(index + 1).toString().padStart(3, '0')}`,
    servicioId: `srv_${(Math.floor(Math.random() * 100) + 1).toString().padStart(3, '0')}`,
    numeroServicio: `SRV-${(Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0')}-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    fechaServicio: getRandomServiceDate(Math.floor(Math.random() * 7)),
    placaAutobus: `BUS-${(Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0')}`,
    idAutobus: (Math.floor(Math.random() * 200) + 1).toString(),
    empresaTransporte: empresasTransporte[Math.floor(Math.random() * empresasTransporte.length)],
    rutaOriginal,
    rutaNueva,
    motivo: motivos[Math.floor(Math.random() * motivos.length)],
    estado,
    fechaSolicitud: getRandomDate(Math.floor(Math.random() * 7)),
    usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
    pasajerosAfectados,
    montoOriginal,
    montoFinal
  };
});

export const getSolicitudById = (id: string): SolicitudAprobacion | null => {
  return mockSolicitudesAprobacion.find(solicitud => solicitud.id === id) || null;
};

export const getSolicitudesPendientes = (): SolicitudAprobacion[] => {
  return mockSolicitudesAprobacion.filter(solicitud => solicitud.estado === 'pendiente');
};

export const getAllSolicitudes = (): SolicitudAprobacion[] => {
  return mockSolicitudesAprobacion;
};