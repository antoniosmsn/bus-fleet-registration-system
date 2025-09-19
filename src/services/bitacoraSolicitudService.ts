import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';

export const aprobarSolicitudBitacora = async (solicitudId: string): Promise<boolean> => {
  try {
    // Simular una operación exitosa con delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Solicitud de bitácora aprobada exitosamente:', solicitudId);
    return true;
  } catch (error) {
    console.error('Error al aprobar solicitud de bitácora:', error);
    throw error;
  }
};

export const rechazarSolicitudBitacora = async (solicitudId: string, motivo: string): Promise<boolean> => {
  try {
    if (!motivo.trim()) {
      throw new Error('El motivo de rechazo es obligatorio');
    }

    // Simular una operación exitosa con delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Solicitud de bitácora rechazada exitosamente:', solicitudId, 'Motivo:', motivo);
    return true;
  } catch (error) {
    console.error('Error al rechazar solicitud de bitácora:', error);
    throw error;
  }
};