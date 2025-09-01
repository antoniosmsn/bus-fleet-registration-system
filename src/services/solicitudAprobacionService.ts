import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { mockSolicitudesAprobacion } from '@/data/mockSolicitudesAprobacion';
import { registrarAprobacionSolicitud, registrarRechazoSolicitud } from './bitacoraService';

export const aprobarSolicitud = async (solicitudId: string): Promise<boolean> => {
  try {
    const solicitud = mockSolicitudesAprobacion.find(s => s.id === solicitudId);
    
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }
    
    // Simular actualización del estado
    solicitud.estado = 'aprobada';
    
    // Registrar en bitácora
    await registrarAprobacionSolicitud(solicitud);
    
    console.log('Solicitud aprobada exitosamente:', solicitudId);
    return true;
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    throw error;
  }
};

export const rechazarSolicitud = async (solicitudId: string, motivo: string): Promise<boolean> => {
  try {
    const solicitud = mockSolicitudesAprobacion.find(s => s.id === solicitudId);
    
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }
    
    if (!motivo.trim()) {
      throw new Error('El motivo de rechazo es obligatorio');
    }
    
    // Simular actualización del estado
    solicitud.estado = 'rechazada';
    
    // Registrar en bitácora
    await registrarRechazoSolicitud(solicitud, motivo);
    
    console.log('Solicitud rechazada exitosamente:', solicitudId);
    return true;
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    throw error;
  }
};

export const getSolicitudesPendientesCount = (): number => {
  return mockSolicitudesAprobacion.filter(s => s.estado === 'pendiente').length;
};