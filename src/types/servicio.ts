
export interface Servicio {
  id?: number;
  turno: string;
  transportista: string;
  ramal: string;
  horario: string;
  diasSemana: string[];
  sentido: 'ingreso' | 'salida';
  cantidadUnidades: number;
  porcentajeFee: number;
  agregarCapacidadAdicional: boolean;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
  estado?: 'activo' | 'inactivo';
  // Campos adicionales para el listado
  empresaTransporte?: string;
  tipoUnidad?: string;
  tipoRuta?: string;
  tarifaPasajero?: number;
  tarifaServicio?: number;
  empresaCliente?: string;
  numeroServicio?: string;
}

export interface RegistroServicioForm {
  turno: string;
  transportista: string;
  ramal: string;
  servicios: {
    horario: string;
    diasSemana: string[];
    sentido: 'ingreso' | 'salida';
    cantidadUnidades: number;
    porcentajeFee: number;
    agregarCapacidadAdicional: boolean;
  }[];
}

export interface ServiciosFiltros {
  empresaCliente: string;
  transportista: string;
  tipoUnidad: string;
  diasSemana: string[];
  horarioInicio: string;
  horarioFin: string;
  ramal: string;
  tipoRuta: string;
  sentido: string;
  turno: string;
  estado: string;
}

export interface Turno {
  id: string;
  nombre: string;
}

export interface Transportista {
  id: string;
  nombre: string;
  codigo: string;
}

export interface Ramal {
  id: string;
  nombre: string;
  tipoRuta: 'publica' | 'privada' | 'especial';
  empresaCliente?: string;
}
