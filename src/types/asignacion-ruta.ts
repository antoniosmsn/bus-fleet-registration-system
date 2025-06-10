
export interface AsignacionRuta {
  id: number;
  ramal: string;
  tipoRuta: 'privada' | 'parque' | 'especial';
  empresaCliente: string;
  empresaTransporte: string;
  tipoUnidad: 'autobus' | 'buseta' | 'microbus';
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  tarifaVigentePasajero: number;
  tarifaVigenteServicio: number;
  fechaInicioVigencia: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string | null;
  usuarioModificacion: string | null;
}

export interface AsignacionRutaFilter {
  ramal?: string;
  empresaTransporte?: string;
  empresaCliente?: string;
  tipoRuta?: 'privada' | 'parque' | 'especial' | '';
  provincia?: string;
  canton?: string;
  sector?: string;
  tipoUnidad?: 'autobus' | 'buseta' | 'microbus' | '';
  fechaInicioVigenciaStart?: string;
  fechaInicioVigenciaEnd?: string;
  habilitarFiltroFecha?: boolean;
  estado?: 'activo' | 'inactivo' | '';
}
