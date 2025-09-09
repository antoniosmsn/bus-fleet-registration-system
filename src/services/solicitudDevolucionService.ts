import { obtenerUsuarioActual } from './permisosService';
import { registrarAprobacionSolicitud, registrarRechazoSolicitud } from './bitacoraService';

// Simulación de base de datos en memoria
export interface ResultadoAprobacion {
  exito: boolean;
  mensaje: string;
  envioCorreo?: boolean;
}

export const aprobarSolicitud = async (solicitudId: string): Promise<ResultadoAprobacion> => {
  // Simulación de API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const usuario = obtenerUsuarioActual();
  const fecha = new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Registrar en bitácora
  registrarAprobacionSolicitud({ id: solicitudId, tipo: 'devolucion_saldo' });

  // En implementación real, actualizar la base de datos
  console.log(`Solicitud ${solicitudId} aprobada por ${usuario} el ${fecha}`);

  return {
    exito: true,
    mensaje: 'Solicitud aprobada correctamente'
  };
};

export const autorizarSolicitud = async (solicitudId: string): Promise<ResultadoAprobacion> => {
  // Simulación de API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const usuario = obtenerUsuarioActual();
  const fecha = new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Registrar en bitácora
  registrarAprobacionSolicitud({ id: solicitudId, tipo: 'autorizacion_devolucion_saldo' });

  // Simular envío de correo
  const correoEnviado = await enviarCorreoAprobacion(solicitudId);

  // En implementación real, actualizar la base de datos
  console.log(`Solicitud ${solicitudId} autorizada por ${usuario} el ${fecha}`);

  return {
    exito: true,
    mensaje: 'Solicitud autorizada correctamente',
    envioCorreo: correoEnviado
  };
};

export const rechazarSolicitud = async (solicitudId: string, motivo: string): Promise<ResultadoAprobacion> => {
  // Simulación de API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const usuario = obtenerUsuarioActual();
  const fecha = new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Registrar en bitácora
  registrarRechazoSolicitud({ id: solicitudId, tipo: 'devolucion_saldo' }, motivo);

  // En implementación real, actualizar la base de datos
  console.log(`Solicitud ${solicitudId} rechazada por ${usuario} el ${fecha}. Motivo: ${motivo}`);

  return {
    exito: true,
    mensaje: 'Solicitud rechazada correctamente'
  };
};

const enviarCorreoAprobacion = async (solicitudId: string): Promise<boolean> => {
  // Simulación de envío de correo
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Correo de aprobación enviado para solicitud ${solicitudId}`);
  console.log('Contenido del correo:', {
    destinatario: 'pasajero@ejemplo.com',
    asunto: 'Solicitud de devolución aprobada',
    mensaje: 'Su solicitud de devolución ha sido aprobada y será procesada en los próximos días hábiles.'
  });
  
  return true;
};

export const validarPermisosSolicitud = (accion: 'aprobar' | 'autorizar' | 'rechazar', estadoSolicitud: string): boolean => {
  // Validaciones de negocio
  switch (accion) {
    case 'aprobar':
      return estadoSolicitud === 'pendiente_aprobacion';
    case 'autorizar':
      return estadoSolicitud === 'aprobada_pendiente_autorizacion';
    case 'rechazar':
      return estadoSolicitud === 'pendiente_aprobacion' || estadoSolicitud === 'aprobada_pendiente_autorizacion';
    default:
      return false;
  }
};