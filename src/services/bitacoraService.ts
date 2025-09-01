interface RegistroBitacora {
  usuario: string;
  fecha: string;
  accion: string;
  modulo: string;
  detalles?: any;
}

export const registrarAcceso = (modulo: string, detalles?: any) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual', // En implementación real, obtener del contexto de autenticación
    fecha: new Date().toISOString(),
    accion: 'ACCESO',
    modulo,
    detalles
  };
  
  // Aquí iría la lógica real de logging a la base de datos
  console.log('Registro en bitácora - Acceso:', registro);
  
  // En un entorno real, esto sería una llamada a la API
  // return api.post('/bitacora', registro);
};

export const registrarExportacion = (tipoArchivo: 'PDF' | 'Excel', modulo: string, filtros?: any) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual', // En implementación real, obtener del contexto de autenticación
    fecha: new Date().toISOString(),
    accion: `EXPORTAR_${tipoArchivo}`,
    modulo,
    detalles: { filtros }
  };
  
  // Aquí iría la lógica real de logging a la base de datos
  console.log('Registro en bitácora - Exportación:', registro);
  
  // En un entorno real, esto sería una llamada a la API
  // return api.post('/bitacora', registro);
};

export const registrarAtencionAlerta = (alertaId: string, atendidoPor: string) => {
  const registro: RegistroBitacora = {
    usuario: atendidoPor,
    fecha: new Date().toISOString(),
    accion: 'ATENDER_ALERTA',
    modulo: 'CAPACIDAD_CUMPLIDA',
    detalles: { alertaId }
  };
  
  // Aquí iría la lógica real de logging a la base de datos
  console.log('Registro en bitácora - Atención Alerta:', registro);
  
  // En un entorno real, esto sería una llamada a la API
  // return api.post('/bitacora', registro);
};

export const registrarTipoAlerta = (tipoAlerta: any) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual',
    fecha: new Date().toISOString(),
    accion: 'CREAR_TIPO_ALERTA',
    modulo: 'CATALOGOS_ALERTAS_PASAJEROS',
    detalles: { tipoAlerta: tipoAlerta.nombre }
  };
  
  console.log('Registro en bitácora - Crear Tipo Alerta:', registro);
};

export const registrarEdicionTipoAlerta = (tipoAlerta: any) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual',
    fecha: new Date().toISOString(),
    accion: 'EDITAR_TIPO_ALERTA',
    modulo: 'CATALOGOS_ALERTAS_PASAJEROS',
    detalles: { tipoAlerta: tipoAlerta.nombre }
  };
  
  console.log('Registro en bitácora - Editar Tipo Alerta:', registro);
};

export const registrarActivacionTipoAlerta = (tipoAlerta: any, activar: boolean) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual',
    fecha: new Date().toISOString(),
    accion: activar ? 'ACTIVAR_TIPO_ALERTA' : 'INACTIVAR_TIPO_ALERTA',
    modulo: 'CATALOGOS_ALERTAS_PASAJEROS',
    detalles: { tipoAlerta: tipoAlerta.nombre }
  };
  
  console.log('Registro en bitácora - Cambio Estado Tipo Alerta:', registro);
};

export const registrarAprobacionSolicitud = (solicitud: any) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual',
    fecha: new Date().toISOString(),
    accion: 'APROBAR_SOLICITUD',
    modulo: 'SOLICITUDES_APROBACION_CAMBIO_RUTA',
    detalles: {
      solicitudId: solicitud.id,
      rutaOriginal: solicitud.rutaOriginal.nombre,
      rutaFinal: solicitud.rutaNueva.nombre,
      numeroServicio: solicitud.numeroServicio,
      fechaServicio: solicitud.fechaServicio,
      pasajerosAfectados: solicitud.pasajerosAfectados,
      montoOriginal: solicitud.montoOriginal,
      montoFinal: solicitud.montoFinal
    }
  };
  
  console.log('Registro en bitácora - Aprobación Solicitud:', registro);
};

export const registrarRechazoSolicitud = (solicitud: any, motivo: string) => {
  const registro: RegistroBitacora = {
    usuario: 'Usuario actual',
    fecha: new Date().toISOString(),
    accion: 'RECHAZAR_SOLICITUD',
    modulo: 'SOLICITUDES_APROBACION_CAMBIO_RUTA',
    detalles: {
      solicitudId: solicitud.id,
      rutaOriginal: solicitud.rutaOriginal.nombre,
      rutaFinal: solicitud.rutaNueva.nombre,
      numeroServicio: solicitud.numeroServicio,
      fechaServicio: solicitud.fechaServicio,
      pasajerosAfectados: solicitud.pasajerosAfectados,
      montoOriginal: solicitud.montoOriginal,
      montoFinal: solicitud.montoFinal,
      motivo
    }
  };
  
  console.log('Registro en bitácora - Rechazo Solicitud:', registro);
};