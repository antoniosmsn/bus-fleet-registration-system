import { CumplimientoServicioData, EstadoServicio, CumplimientoServicio } from '@/types/cumplimiento-servicio';

// Helper function to get dynamic dates
const getToday = () => new Date();
const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};
const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

const formatDateTime = (date: Date, hours: number, minutes: number = 0) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Helper function to calculate cumplimiento based on business rules
const calcularCumplimiento = (
  estado: EstadoServicio,
  inicioRealizado: string | null,
  cierreRealizado: string | null,
  pasajerosTransmitidos: number
): CumplimientoServicio => {
  if (estado === 'Cierre manual-descarga completa' || estado === 'Cierre automático-descarga completa') {
    if (inicioRealizado && cierreRealizado && pasajerosTransmitidos > 0) {
      return 'Cumplido';
    }
  }
  return 'No cumplido';
};

export const mockCumplimientoServicios: CumplimientoServicioData[] = [
  {
    id: '1',
    numeroServicio: 'SV-001',
    autobus: 'BUS-001 (Placa: SJO-123)',
    ramal: 'San José - Cartago',
    empresaTransporte: 'Transportes San José S.A.',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 6, 0),
    cierreProgramado: formatDateTime(getToday(), 18, 0),
    inicioRealizado: formatDateTime(getToday(), 6, 5),
    cierreRealizado: formatDateTime(getToday(), 18, 15),
    ultimaFechaDescarga: formatDateTime(getToday(), 18, 30),
    cantidadPasajeros: 45,
    pasajerosTransmitidos: 45,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Cierre automático-descarga completa',
    cumplimientoServicio: 'Cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '2',
    numeroServicio: 'SV-002',
    autobus: 'BUS-002 (Placa: CTG-456)',
    ramal: 'Zona Franca Intel',
    empresaTransporte: 'Autobuses del Valle',
    empresaCliente: 'Intel Corporation',
    inicioProgramado: formatDateTime(getToday(), 17, 30),
    cierreProgramado: formatDateTime(getToday(), 19, 30),
    inicioRealizado: formatDateTime(getToday(), 17, 35),
    cierreRealizado: null,
    ultimaFechaDescarga: formatDateTime(getToday(), 18, 45),
    cantidadPasajeros: 32,
    pasajerosTransmitidos: 28,
    cantidadFaltanteDescarga: 4,
    estadoServicio: 'Iniciado-descarga incompleta',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: false
  },
  {
    id: '3',
    numeroServicio: 'SV-003',
    autobus: 'BUS-003 (Placa: HER-789)',
    ramal: 'Heredia - Alajuela',
    empresaTransporte: 'Transportes Heredia',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 5, 30),
    cierreProgramado: formatDateTime(getToday(), 22, 0),
    inicioRealizado: null,
    cierreRealizado: null,
    ultimaFechaDescarga: null,
    cantidadPasajeros: 0,
    pasajerosTransmitidos: 0,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Sin iniciar',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: false
  },
  {
    id: '4',
    numeroServicio: 'SV-004',
    autobus: 'BUS-004 (Placa: PUN-321)',
    ramal: 'Puntarenas - San José',
    empresaTransporte: 'Transportes Puntarenas',
    empresaCliente: 'Empresa Turística Costa Rica',
    inicioProgramado: formatDateTime(getToday(), 7, 0),
    cierreProgramado: formatDateTime(getToday(), 16, 0),
    inicioRealizado: formatDateTime(getToday(), 7, 10),
    cierreRealizado: formatDateTime(getToday(), 16, 30),
    ultimaFechaDescarga: formatDateTime(getToday(), 16, 45),
    cantidadPasajeros: 38,
    pasajerosTransmitidos: 35,
    cantidadFaltanteDescarga: 3,
    estadoServicio: 'Cierre manual-descarga incompleta',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '5',
    numeroServicio: 'SV-005',
    autobus: 'BUS-005 (Placa: LIM-654)',
    ramal: 'Limón - San José',
    empresaTransporte: 'Transportes del Caribe',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getYesterday(), 8, 0),
    cierreProgramado: formatDateTime(getYesterday(), 17, 0),
    inicioRealizado: formatDateTime(getYesterday(), 8, 5),
    cierreRealizado: formatDateTime(getYesterday(), 17, 20),
    ultimaFechaDescarga: formatDateTime(getYesterday(), 17, 35),
    cantidadPasajeros: 42,
    pasajerosTransmitidos: 42,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Cierre manual-descarga completa',
    cumplimientoServicio: 'Cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '6',
    numeroServicio: 'SV-006',
    autobus: 'BUS-006 (Placa: GUA-987)',
    ramal: 'Guanacaste - San José',
    empresaTransporte: 'Transportes Guanacaste',
    empresaCliente: 'Hotel Tamarindo',
    inicioProgramado: formatDateTime(getTomorrow(), 6, 30),
    cierreProgramado: formatDateTime(getTomorrow(), 20, 0),
    inicioRealizado: null,
    cierreRealizado: null,
    ultimaFechaDescarga: null,
    cantidadPasajeros: 0,
    pasajerosTransmitidos: 0,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Sin iniciar',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: false
  },
  {
    id: '7',
    numeroServicio: 'SV-007',
    autobus: 'BUS-007 (Placa: ALA-111)',
    ramal: 'Alajuela - Cartago',
    empresaTransporte: 'Transportes Unidos',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 9, 0),
    cierreProgramado: formatDateTime(getToday(), 15, 0),
    inicioRealizado: formatDateTime(getToday(), 9, 15),
    cierreRealizado: formatDateTime(getToday(), 15, 45),
    ultimaFechaDescarga: formatDateTime(getToday(), 16, 0),
    cantidadPasajeros: 28,
    pasajerosTransmitidos: 0, // Caso especial: cierre completo pero 0 pasajeros
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Cierre automático-descarga completa',
    cumplimientoServicio: 'No cumplido', // No cumplido por 0 pasajeros transmitidos
    puedesolicitarCambioRuta: true
  },
  {
    id: '8',
    numeroServicio: 'SV-008',
    autobus: 'BUS-008 (Placa: ESC-222)',
    ramal: 'Escazú - San José',
    empresaTransporte: 'Transportes Escazú',
    empresaCliente: 'Multiplaza Escazú',
    inicioProgramado: formatDateTime(getToday(), 14, 0),
    cierreProgramado: formatDateTime(getToday(), 20, 30),
    inicioRealizado: formatDateTime(getToday(), 14, 8),
    cierreRealizado: null,
    ultimaFechaDescarga: formatDateTime(getToday(), 18, 20),
    cantidadPasajeros: 25,
    pasajerosTransmitidos: 18,
    cantidadFaltanteDescarga: 7,
    estadoServicio: 'Iniciado',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: false
  },
  {
    id: '9',
    numeroServicio: 'SV-009',
    autobus: 'BUS-009 (Placa: MON-333)',
    ramal: 'Moravia - San José',
    empresaTransporte: 'Transportes Unidos',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 10, 30),
    cierreProgramado: formatDateTime(getToday(), 16, 30),
    inicioRealizado: formatDateTime(getToday(), 10, 35),
    cierreRealizado: formatDateTime(getToday(), 16, 45),
    ultimaFechaDescarga: formatDateTime(getToday(), 17, 0),
    cantidadPasajeros: 52,
    pasajerosTransmitidos: 52,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Cierre manual-descarga completa',
    cumplimientoServicio: 'Cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '10',
    numeroServicio: 'SV-010',
    autobus: 'BUS-010 (Placa: TUR-444)',
    ramal: 'Turrialba - San José',
    empresaTransporte: 'Transportes San José S.A.',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 12, 0),
    cierreProgramado: formatDateTime(getToday(), 19, 0),
    inicioRealizado: formatDateTime(getToday(), 12, 10),
    cierreRealizado: formatDateTime(getToday(), 19, 25),
    ultimaFechaDescarga: formatDateTime(getToday(), 19, 40),
    cantidadPasajeros: 38,
    pasajerosTransmitidos: 35,
    cantidadFaltanteDescarga: 3,
    estadoServicio: 'Cierre automático-descarga incompleta',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '11',
    numeroServicio: 'SV-011',
    autobus: 'BUS-011 (Placa: PAV-555)',
    ramal: 'Pavas - Aeropuerto',
    empresaTransporte: 'Autobuses del Valle',
    empresaCliente: 'Aeropuerto Juan Santamaría',
    inicioProgramado: formatDateTime(getToday(), 4, 30),
    cierreProgramado: formatDateTime(getToday(), 23, 0),
    inicioRealizado: formatDateTime(getToday(), 4, 30),
    cierreRealizado: formatDateTime(getToday(), 23, 10),
    ultimaFechaDescarga: formatDateTime(getToday(), 23, 25),
    cantidadPasajeros: 68,
    pasajerosTransmitidos: 68,
    cantidadFaltanteDescarga: 0,
    estadoServicio: 'Cierre automático-descarga completa',
    cumplimientoServicio: 'Cumplido',
    puedesolicitarCambioRuta: true
  },
  {
    id: '12',
    numeroServicio: 'SV-012',
    autobus: 'BUS-012 (Placa: DEL-666)',
    ramal: 'Desamparados - San José',
    empresaTransporte: 'Transportes Unidos',
    empresaCliente: null,
    inicioProgramado: formatDateTime(getToday(), 8, 15),
    cierreProgramado: formatDateTime(getToday(), 17, 45),
    inicioRealizado: formatDateTime(getToday(), 8, 20),
    cierreRealizado: null,
    ultimaFechaDescarga: formatDateTime(getToday(), 15, 30),
    cantidadPasajeros: 29,
    pasajerosTransmitidos: 24,
    cantidadFaltanteDescarga: 5,
    estadoServicio: 'Iniciado-descarga incompleta',
    cumplimientoServicio: 'No cumplido',
    puedesolicitarCambioRuta: false
  }
];

// Helper function to get unique values for filters
export const getUniqueAutobuses = (): string[] => {
  return [...new Set(mockCumplimientoServicios.map(s => s.autobus))];
};

export const getUniqueRamales = (): string[] => {
  return [...new Set(mockCumplimientoServicios.map(s => s.ramal))];
};

export const getUniqueEmpresasCliente = (): string[] => {
  return [...new Set(mockCumplimientoServicios.map(s => s.empresaCliente).filter(Boolean))] as string[];
};

export const estadosServicio: EstadoServicio[] = [
  'Sin iniciar',
  'Iniciado',
  'Iniciado-descarga incompleta',
  'Cierre manual-descarga completa',
  'Cierre manual-descarga incompleta',
  'Cierre automático-descarga incompleta',
  'Cierre automático-descarga completa'
];

export const cumplimientosServicio: CumplimientoServicio[] = [
  'Cumplido',
  'No cumplido'
];