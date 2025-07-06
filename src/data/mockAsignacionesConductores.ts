export interface AsignacionConductor {
  id: string;
  servicioId: string;
  numeroServicio: string;
  empresaTransporte: string;
  tipoUnidad: 'autobus' | 'buseta' | 'microbus';
  turno: string;
  ramal: string;
  tipoRuta: 'publica' | 'privada' | 'especial' | 'parque';
  tarifaPasajero: number;
  tarifaServicio: number;
  empresaCliente: string;
  sentido: 'ingreso' | 'salida';
  horario: string;
  fechaOperacion: string;
  conductorId?: string;
  conductorNombre?: string;
  conductorApellidos?: string;
  codigoConductor?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
  usuarioCreacion: string;
  usuarioModificacion?: string;
}

export const mockAsignacionesConductores: AsignacionConductor[] = [
  {
    id: '1',
    servicioId: '1',
    numeroServicio: 'SV-001',
    empresaTransporte: 'Transportes San José S.A.',
    tipoUnidad: 'autobus',
    turno: 'Turno A',
    ramal: 'San José - Cartago',
    tipoRuta: 'publica',
    tarifaPasajero: 570,
    tarifaServicio: 11400,
    empresaCliente: 'Intel Corporation',
    sentido: 'ingreso',
    horario: '06:00',
    fechaOperacion: '2025-01-07',
    conductorId: '1',
    conductorNombre: 'Juan',
    conductorApellidos: 'Pérez Rodríguez',
    codigoConductor: 'CN001',
    fechaCreacion: '2024-01-15T08:00:00Z',
    usuarioCreacion: 'admin@sistema.com',
    fechaModificacion: '2024-06-10T14:30:00Z',
    usuarioModificacion: 'supervisor@sistema.com'
  },
  {
    id: '2',
    servicioId: '2',
    numeroServicio: 'SV-002',
    empresaTransporte: 'Autobuses del Valle',
    tipoUnidad: 'buseta',
    turno: 'Turno B',
    ramal: 'Heredia - Alajuela',
    tipoRuta: 'privada',
    tarifaPasajero: 850,
    tarifaServicio: 17000,
    empresaCliente: 'Microsoft Costa Rica',
    sentido: 'salida',
    horario: '07:30',
    fechaOperacion: '2025-01-06',
    // Sin conductor asignado
    fechaCreacion: '2024-02-01T10:15:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  {
    id: '3',
    servicioId: '3',
    numeroServicio: 'SV-003',
    empresaTransporte: 'Empresa de Transporte Central',
    tipoUnidad: 'autobus',
    turno: 'Turno A',
    ramal: 'Zona Franca Intel',
    tipoRuta: 'privada',
    tarifaPasajero: 900,
    tarifaServicio: 27000,
    empresaCliente: 'Intel Corporation',
    sentido: 'ingreso',
    horario: '06:45',
    fechaOperacion: '2025-01-08',
    conductorId: '2',
    conductorNombre: 'María',
    conductorApellidos: 'González López',
    codigoConductor: 'CN002',
    fechaCreacion: '2024-03-05T09:20:00Z',
    usuarioCreacion: 'admin@sistema.com',
  },
  {
    id: '4',
    servicioId: '4',
    numeroServicio: 'SV-004',
    empresaTransporte: 'Transportes Unidos',
    tipoUnidad: 'microbus',
    turno: 'Turno C',
    ramal: 'Campus Tecnológico',
    tipoRuta: 'especial',
    tarifaPasajero: 1200,
    tarifaServicio: 1200,
    empresaCliente: 'Amazon Development Center',
    sentido: 'salida',
    horario: '18:00',
    fechaOperacion: '2025-01-05',
    // Sin conductor asignado
    fechaCreacion: '2024-04-12T16:45:00Z',
    usuarioCreacion: 'supervisor@sistema.com',
    fechaModificacion: '2024-05-20T11:10:00Z',
    usuarioModificacion: 'admin@sistema.com'
  },
  {
    id: '5',
    servicioId: '5',
    numeroServicio: 'SV-005',
    empresaTransporte: 'Buses Express Costa Rica',
    tipoUnidad: 'buseta',
    turno: 'Turno B',
    ramal: 'Parque Industrial',
    tipoRuta: 'parque',
    tarifaPasajero: 650,
    tarifaServicio: 13000,
    empresaCliente: 'Parque Industrial S.A.',
    sentido: 'ingreso',
    horario: '12:30',
    fechaOperacion: '2025-01-09',
    conductorId: '4',
    conductorNombre: 'Ana',
    conductorApellidos: 'Vega Mora',
    codigoConductor: 'CE001',
    fechaCreacion: '2024-05-08T13:30:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  {
    id: '6',
    servicioId: '1',
    numeroServicio: 'SV-001',
    empresaTransporte: 'Transportes San José S.A.',
    tipoUnidad: 'autobus',
    turno: 'Turno A',
    ramal: 'San José - Cartago',
    tipoRuta: 'publica',
    tarifaPasajero: 570,
    tarifaServicio: 11400,
    empresaCliente: 'Intel Corporation',
    sentido: 'ingreso',
    horario: '14:00',
    fechaOperacion: '2025-01-10',
    conductorId: '3',
    conductorNombre: 'Carlos',
    conductorApellidos: 'Ramírez Solano',
    codigoConductor: 'CS001',
    fechaCreacion: '2024-01-15T08:00:00Z',
    usuarioCreacion: 'admin@sistema.com',
  },
  {
    id: '7',
    servicioId: '2',
    numeroServicio: 'SV-002',
    empresaTransporte: 'Autobuses del Valle',
    tipoUnidad: 'buseta',
    turno: 'Turno B',
    ramal: 'Heredia - Alajuela',
    tipoRuta: 'privada',
    tarifaPasajero: 850,
    tarifaServicio: 17000,
    empresaCliente: 'Microsoft Costa Rica',
    sentido: 'salida',
    horario: '16:30',
    fechaOperacion: '2025-01-04',
    // Sin conductor asignado
    fechaCreacion: '2024-02-01T10:15:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  {
    id: '8',
    servicioId: '3',
    numeroServicio: 'SV-003',
    empresaTransporte: 'Empresa de Transporte Central',
    tipoUnidad: 'autobus',
    turno: 'Turno A',
    ramal: 'Zona Franca Intel',
    tipoRuta: 'privada',
    tarifaPasajero: 900,
    tarifaServicio: 27000,
    empresaCliente: 'Intel Corporation',
    sentido: 'salida',
    horario: '17:15',
    fechaOperacion: '2025-01-11',
    conductorId: '5',
    conductorNombre: 'Roberto',
    conductorApellidos: 'Mendoza Castro',
    codigoConductor: 'CO001',
    fechaCreacion: '2024-03-05T09:20:00Z',
    usuarioCreacion: 'admin@sistema.com',
  }
];

// Función helper para obtener asignación por ID
export const getAsignacionConductorById = (id: string): AsignacionConductor | null => {
  return mockAsignacionesConductores.find(asignacion => asignacion.id === id) || null;
};