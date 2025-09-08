import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';

export const mockSolicitudesDevolucionSaldo: SolicitudDevolucionSaldo[] = [
  {
    id: '1',
    numeroDevolucion: '5',
    cedulaPasajero: '1016119091',
    nombrePasajero: 'Brayan David',
    fechaSolicitud: '29/08/2025',
    fechaDevolucion: '',
    estado: 'pendiente_aprobacion',
    monto: 12000.00,
    motivoDevolucion: 'Changing the passenger\'s payment type',
    aprobadores: []
  },
  {
    id: '2',
    numeroDevolucion: '6',
    cedulaPasajero: '602860913',
    nombrePasajero: 'jason',
    fechaSolicitud: '03/09/2025',
    fechaDevolucion: '',
    estado: 'pendiente_aprobacion',
    monto: 24625.00,
    motivoDevolucion: 'Cambio de tipo de pago del pasajero',
    aprobadores: []
  }
];