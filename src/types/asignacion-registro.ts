export interface Ramal {
  id: string;
  nombre: string;
  tipoRuta: 'privada' | 'parque' | 'especial';
}

export interface EmpresaCliente {
  id: string;
  nombre: string;
  cuentasPO: CuentaPO[];
}

export interface CuentaPO {
  id: string;
  nombre: string;
  codigo: string;
  esPrincipal: boolean;
}

export interface TarifaPasajero {
  id?: string;
  monto: number;
  fechaInicioVigencia: string;
  estado: 'activo' | 'inactivo';
}

export interface TarifaServicio {
  id?: string;
  monto: number;
  fechaInicioVigencia: string;
  estado: 'activo' | 'inactivo';
}

export interface AsignacionRegistroForm {
  ramal: string;
  empresaCliente?: string;
  cuentaPO?: string;
  tipoUnidad: 'autobus' | 'buseta' | 'microbus' | '';
  tarifasPasajero: TarifaPasajero[];
  tarifasServicio: TarifaServicio[];
  montoFee: number;
}

export interface AsignacionRegistroData extends AsignacionRegistroForm {
  zonaFranca: string; // Viene de la sesión del usuario
}