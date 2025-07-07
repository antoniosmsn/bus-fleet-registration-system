export interface Servicio {
  id: string;
  turno: string;
  transportista: string;
  empresaCliente: string;
  ramal: string;
  tipoRuta: 'publica' | 'privada' | 'especial' | 'parque';
  tipoUnidad: 'autobus' | 'buseta' | 'microbus';
  horario: string;
  diasSemana: string[];
  sentido: 'ingreso' | 'salida';
  cantidadUnidades: number;
  porcentajeFee: number;
  agregarCapacidadAdicional: boolean;
  numeroServicio: string;
  tarifaPasajero: number;
  tarifaServicio: number;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

export const mockServicios: Servicio[] = [
  {
    id: '1',
    turno: '1', // Turno A
    transportista: '1', // Transportes San José S.A.
    empresaCliente: '1', // Intel Corporation
    ramal: '1', // San José - Cartago
    tipoRuta: 'publica',
    tipoUnidad: 'autobus',
    horario: '06:00',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'ingreso',
    cantidadUnidades: 2,
    porcentajeFee: 5.5,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-001',
    tarifaPasajero: 570,
    tarifaServicio: 11400,
    estado: 'activo',
    fechaCreacion: '2024-01-15T08:00:00Z',
    usuarioCreacion: 'admin@sistema.com',
    fechaModificacion: '2024-06-10T14:30:00Z',
    usuarioModificacion: 'supervisor@sistema.com'
  },
  {
    id: '2',
    turno: '2', // Turno B
    transportista: '2', // Autobuses del Valle
    empresaCliente: '2', // Microsoft Costa Rica
    ramal: '2', // Heredia - Alajuela
    tipoRuta: 'privada',
    tipoUnidad: 'buseta',
    horario: '07:30',
    diasSemana: ['lunes', 'miercoles', 'viernes'],
    sentido: 'salida',
    cantidadUnidades: 1,
    porcentajeFee: 3.0,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-002',
    tarifaPasajero: 850,
    tarifaServicio: 17000,
    estado: 'activo',
    fechaCreacion: '2024-02-01T10:15:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  {
    id: '3',
    turno: '1', // Turno A
    transportista: '3', // Empresa de Transporte Central
    empresaCliente: '1', // Intel Corporation
    ramal: '3', // Zona Franca Intel
    tipoRuta: 'privada',
    tipoUnidad: 'autobus',
    horario: '06:45',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    sentido: 'ingreso',
    cantidadUnidades: 3,
    porcentajeFee: 7.25,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-003',
    tarifaPasajero: 900,
    tarifaServicio: 27000,
    estado: 'activo',
    fechaCreacion: '2024-03-05T09:20:00Z',
    usuarioCreacion: 'admin@sistema.com',
  },
  {
    id: '4',
    turno: '3', // Turno C
    transportista: '4', // Transportes Unidos
    empresaCliente: '3', // Amazon Development Center
    ramal: '4', // Campus Tecnológico
    tipoRuta: 'especial',
    tipoUnidad: 'microbus',
    horario: '18:00',
    diasSemana: ['martes', 'jueves'],
    sentido: 'salida',
    cantidadUnidades: 1,
    porcentajeFee: 0,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-004',
    tarifaPasajero: 1200,
    tarifaServicio: 1200,
    estado: 'inactivo',
    fechaCreacion: '2024-04-12T16:45:00Z',
    usuarioCreacion: 'supervisor@sistema.com',
    fechaModificacion: '2024-05-20T11:10:00Z',
    usuarioModificacion: 'admin@sistema.com'
  },
  {
    id: '5',
    turno: '2', // Turno B
    transportista: '5', // Buses Express Costa Rica
    empresaCliente: '4', // Parque Industrial S.A.
    ramal: '5', // Parque Industrial
    tipoRuta: 'parque',
    tipoUnidad: 'buseta',
    horario: '12:30',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'ingreso',
    cantidadUnidades: 2,
    porcentajeFee: 4.75,
    agregarCapacidadAdicional: true,
    numeroServicio: 'SV-005',
    tarifaPasajero: 650,
    tarifaServicio: 13000,
    estado: 'activo',
    fechaCreacion: '2024-05-08T13:30:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  // Servicios adicionales para probar traslapes de horario
  {
    id: '6',
    turno: '1', // Turno A
    transportista: '1', // Transportes San José S.A.
    empresaCliente: '1', // Intel Corporation
    ramal: '1', // San José - Cartago
    tipoRuta: 'publica',
    tipoUnidad: 'autobus',
    horario: '06:25', // 25 minutos después del servicio 1 - debería generar conflicto
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'ingreso',
    cantidadUnidades: 1,
    porcentajeFee: 3.5,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-006',
    tarifaPasajero: 570,
    tarifaServicio: 5700,
    estado: 'activo',
    fechaCreacion: '2024-06-01T08:00:00Z',
    usuarioCreacion: 'admin@sistema.com',
  },
  {
    id: '7',
    turno: '2', // Turno B
    transportista: '2', // Autobuses del Valle
    empresaCliente: '2', // Microsoft Costa Rica
    ramal: '2', // Heredia - Alajuela
    tipoRuta: 'privada',
    tipoUnidad: 'buseta',
    horario: '07:45', // 15 minutos después del servicio 2 - debería generar conflicto
    diasSemana: ['lunes', 'miercoles', 'viernes'],
    sentido: 'salida',
    cantidadUnidades: 1,
    porcentajeFee: 2.5,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-007',
    tarifaPasajero: 850,
    tarifaServicio: 8500,
    estado: 'activo',
    fechaCreacion: '2024-06-05T10:15:00Z',
    usuarioCreacion: 'operador@sistema.com',
  },
  {
    id: '8',
    turno: '1', // Turno A
    transportista: '3', // Empresa de Transporte Central
    empresaCliente: '1', // Intel Corporation
    ramal: '7', // Zona Franca Intel
    tipoRuta: 'privada',
    tipoUnidad: 'autobus',
    horario: '08:00', // Horario sin conflicto
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'salida',
    cantidadUnidades: 2,
    porcentajeFee: 6.0,
    agregarCapacidadAdicional: false,
    numeroServicio: 'SV-008',
    tarifaPasajero: 900,
    tarifaServicio: 18000,
    estado: 'activo',
    fechaCreacion: '2024-06-10T09:20:00Z',
    usuarioCreacion: 'admin@sistema.com',
  }
];

// Función helper para obtener servicio por ID
export const getServicioById = (id: string): Servicio | null => {
  return mockServicios.find(servicio => servicio.id === id) || null;
};