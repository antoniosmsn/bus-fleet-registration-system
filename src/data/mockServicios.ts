export interface Servicio {
  id: string;
  turno: string;
  transportista: string;
  ramal: string;
  horario: string;
  diasSemana: string[];
  sentido: 'ingreso' | 'salida';
  cantidadUnidades: number;
  porcentajeFee: number;
  agregarCapacidadAdicional: boolean;
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
    ramal: '1', // San José - Cartago
    horario: '06:00',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'ingreso',
    cantidadUnidades: 2,
    porcentajeFee: 5.5,
    agregarCapacidadAdicional: false,
    estado: 'activo',
    fechaCreacion: '2024-01-15T08:00:00Z',
    usuarioCreacion: 'admin',
    fechaModificacion: '2024-06-10T14:30:00Z',
    usuarioModificacion: 'supervisor'
  },
  {
    id: '2',
    turno: '2', // Turno B
    transportista: '2', // Autobuses del Valle
    ramal: '2', // Heredia - Alajuela
    horario: '07:30',
    diasSemana: ['lunes', 'miercoles', 'viernes'],
    sentido: 'salida',
    cantidadUnidades: 1,
    porcentajeFee: 3.0,
    agregarCapacidadAdicional: false,
    estado: 'activo',
    fechaCreacion: '2024-02-01T10:15:00Z',
    usuarioCreacion: 'operador',
  },
  {
    id: '3',
    turno: '1', // Turno A
    transportista: '3', // Empresa de Transporte Central
    ramal: '3', // Zona Franca Intel
    horario: '06:45',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    sentido: 'ingreso',
    cantidadUnidades: 3,
    porcentajeFee: 7.25,
    agregarCapacidadAdicional: false,
    estado: 'activo',
    fechaCreacion: '2024-03-05T09:20:00Z',
    usuarioCreacion: 'admin',
  },
  {
    id: '4',
    turno: '3', // Turno C
    transportista: '4', // Transportes Unidos
    ramal: '4', // Campus Tecnológico
    horario: '18:00',
    diasSemana: ['martes', 'jueves'],
    sentido: 'salida',
    cantidadUnidades: 1,
    porcentajeFee: 0,
    agregarCapacidadAdicional: false,
    estado: 'inactivo',
    fechaCreacion: '2024-04-12T16:45:00Z',
    usuarioCreacion: 'supervisor',
    fechaModificacion: '2024-05-20T11:10:00Z',
    usuarioModificacion: 'admin'
  },
  {
    id: '5',
    turno: '2', // Turno B
    transportista: '5', // Buses Express Costa Rica
    ramal: '5', // Parque Industrial
    horario: '12:30',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    sentido: 'ingreso',
    cantidadUnidades: 2,
    porcentajeFee: 4.75,
    agregarCapacidadAdicional: true,
    estado: 'activo',
    fechaCreacion: '2024-05-08T13:30:00Z',
    usuarioCreacion: 'operador',
  }
];

// Función helper para obtener servicio por ID
export const getServicioById = (id: string): Servicio | null => {
  return mockServicios.find(servicio => servicio.id === id) || null;
};