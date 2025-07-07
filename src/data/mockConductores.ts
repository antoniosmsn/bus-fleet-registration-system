export interface Conductor {
  id: string;
  nombre: string;
  apellidos: string;
  codigo: string;
  empresaTransporteId: string;
  empresaTransporte: string;
  estado: 'activo' | 'inactivo';
  cedula: string;
  telefono: string;
  fechaCreacion: string;
  usuarioCreacion: string;
}

export const mockConductores: Conductor[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez Rodríguez',
    codigo: '001',
    empresaTransporteId: '1',
    empresaTransporte: 'Transportes San José S.A.',
    estado: 'activo',
    cedula: '1-1234-5678',
    telefono: '8888-1234',
    fechaCreacion: '2024-01-15T08:00:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'González López',
    codigo: '002',
    empresaTransporteId: '3',
    empresaTransporte: 'Empresa de Transporte Central',
    estado: 'activo',
    cedula: '2-2345-6789',
    telefono: '8888-2345',
    fechaCreacion: '2024-02-01T10:15:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'Ramírez Solano',
    codigo: '003',
    empresaTransporteId: '1',
    empresaTransporte: 'Transportes San José S.A.',
    estado: 'activo',
    cedula: '1-3456-7890',
    telefono: '8888-3456',
    fechaCreacion: '2024-02-15T09:30:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '4',
    nombre: 'Ana',
    apellidos: 'Vega Mora',
    codigo: '004',
    empresaTransporteId: '5',
    empresaTransporte: 'Buses Express Costa Rica',
    estado: 'activo',
    cedula: '1-4567-8901',
    telefono: '8888-4567',
    fechaCreacion: '2024-03-01T11:00:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '5',
    nombre: 'Roberto',
    apellidos: 'Mendoza Castro',
    codigo: '005',
    empresaTransporteId: '3',
    empresaTransporte: 'Empresa de Transporte Central',
    estado: 'activo',
    cedula: '2-5678-9012',
    telefono: '8888-5678',
    fechaCreacion: '2024-03-15T08:45:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '6',
    nombre: 'Patricia',
    apellidos: 'Jiménez Vargas',
    codigo: '006',
    empresaTransporteId: '2',
    empresaTransporte: 'Autobuses del Valle',
    estado: 'activo',
    cedula: '1-6789-0123',
    telefono: '8888-6789',
    fechaCreacion: '2024-04-01T14:20:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '7',
    nombre: 'Luis',
    apellidos: 'Herrera Soto',
    codigo: '007',
    empresaTransporteId: '4',
    empresaTransporte: 'Transportes Unidos',
    estado: 'activo',
    cedula: '2-7890-1234',
    telefono: '8888-7890',
    fechaCreacion: '2024-04-15T16:10:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '8',
    nombre: 'Elena',
    apellidos: 'Campos Rojas',
    codigo: '008',
    empresaTransporteId: '1',
    empresaTransporte: 'Transportes San José S.A.',
    estado: 'activo',
    cedula: '1-8901-2345',
    telefono: '8888-8901',
    fechaCreacion: '2024-05-01T12:30:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '9',
    nombre: 'David',
    apellidos: 'Morales Chaves',
    codigo: '009',
    empresaTransporteId: '2',
    empresaTransporte: 'Autobuses del Valle',
    estado: 'activo',
    cedula: '2-9012-3456',
    telefono: '8888-9012',
    fechaCreacion: '2024-05-15T15:45:00Z',
    usuarioCreacion: 'admin@sistema.com'
  },
  {
    id: '10',
    nombre: 'Carmen',
    apellidos: 'Villalobos Quesada',
    codigo: '010',
    empresaTransporteId: '5',
    empresaTransporte: 'Buses Express Costa Rica',
    estado: 'activo',
    cedula: '1-0123-4567',
    telefono: '8888-0123',
    fechaCreacion: '2024-06-01T09:15:00Z',
    usuarioCreacion: 'admin@sistema.com'
  }
];

// Función helper para obtener conductor por ID
export const getConductorById = (id: string): Conductor | null => {
  return mockConductores.find(conductor => conductor.id === id) || null;
};

// Función helper para obtener conductores por empresa de transporte
export const getConductoresByEmpresaTransporte = (empresaTransporteId: string): Conductor[] => {
  return mockConductores.filter(conductor => 
    conductor.empresaTransporteId === empresaTransporteId && conductor.estado === 'activo'
  );
};