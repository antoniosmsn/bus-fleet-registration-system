
export interface Pasajero {
  id: number;
  empresaCliente: string;
  cedula: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  telefono: string;
  tipoPago: 'prepago' | 'postpago';
  empresaSubcontratista?: string;
  tipoContrato: 'directo' | 'indirecto';
  planilla: 'bisemanal' | 'contratista' | 'mensual' | 'quincenal' | 'semanal';
  limiteViajesSemana: 10 | 12 | 14 | 'sin_limite';
  limiteDiario: 2 | 'sin_limite';
  tipoSubsidio: 'por_monto' | 'porcentual';
  subsidioPorcentual: number;
  subsidioMonto: number;
  numeroEmpleadoInterno?: string;
  badgeInterno?: string;
  tagResidencia?: string;
  saldoPrepago?: number;
  saldoPostpago?: number;
  estado: 'activo' | 'inactivo' | 'cambio_password' | 'dado_de_baja' | 'solicitud_traslado' | 'traslado_rechazado';
  solicitudRuta: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;
}

export interface PasajeroFilter {
  empresaCliente?: string;
  cedula?: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo?: string;
  tipoPago?: 'prepago' | 'postpago' | 'todos';
  badgeInterno?: string;
  numeroEmpleado?: string;
  estado?: 'activo' | 'inactivo' | 'cambio_password' | 'dado_de_baja' | 'solicitud_traslado' | 'traslado_rechazado' | 'todos';
  solicitudRuta?: boolean | null;
}
