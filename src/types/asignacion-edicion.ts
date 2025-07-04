export interface TarifaExistente {
  id: string;
  monto: number;
  fechaInicioVigencia: string;
  estado: 'activo' | 'inactivo';
  esExistente: true;
}

export interface TarifaNueva {
  id: string;
  monto: number;
  fechaInicioVigencia: string;
  estado: 'activo' | 'inactivo';
  esExistente: false;
}

export type TarifaEdicion = TarifaExistente | TarifaNueva;

export interface AsignacionEdicionForm {
  id: number;
  ramal: string;
  ramalNombre: string;
  tipoRuta: 'privada' | 'parque' | 'especial';
  empresaCliente?: string;
  cuentaPO?: string;
  tipoUnidad: 'autobus' | 'buseta' | 'microbus';
  tarifasPasajero: TarifaEdicion[];
  tarifasServicio: TarifaEdicion[];
  montoFee: number;
  ocultarTarifasPasadas: boolean;
}

export interface AsignacionEdicionData {
  id: number;
  ramal: string;
  ramalNombre: string;
  tipoRuta: 'privada' | 'parque' | 'especial';
  empresaCliente?: string;
  empresaTransporte: string;
  cuentaPO?: string;
  tipoUnidad: 'autobus' | 'buseta' | 'microbus';
  tarifasPasajeroExistentes: TarifaExistente[];
  tarifasServicioExistentes: TarifaExistente[];
  montoFee: number;
}