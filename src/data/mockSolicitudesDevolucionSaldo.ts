import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';

// Función para generar fechas dinámicas
const generateDynamicDate = (daysFromToday: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

export const mockSolicitudesDevolucionSaldo: SolicitudDevolucionSaldo[] = [
  {
    id: '1',
    numeroDevolucion: '5',
    cedulaPasajero: '1016119091',
    nombrePasajero: 'Brayan David Rodríguez',
    fechaSolicitud: generateDynamicDate(-5),
    fechaDevolucion: '',
    estado: 'pendiente_aprobacion',
    monto: 12000.00,
    motivoDevolucion: 'Cambio de tipo de pago del pasajero'
  },
  {
    id: '2',
    numeroDevolucion: '6',
    cedulaPasajero: '602860913',
    nombrePasajero: 'Jason Martínez',
    fechaSolicitud: generateDynamicDate(-3),
    fechaDevolucion: '',
    estado: 'pendiente_aprobacion',
    monto: 24625.00,
    motivoDevolucion: 'Cambio de tipo de pago del pasajero'
  },
  {
    id: '3',
    numeroDevolucion: '7',
    cedulaPasajero: '1234567890',
    nombrePasajero: 'María González',
    fechaSolicitud: generateDynamicDate(-2),
    fechaDevolucion: '',
    estado: 'aprobada_pendiente_autorizacion',
    monto: 15000.00,
    motivoDevolucion: 'Error en el cobro del servicio',
    aprobadoPor: 'Admin Usuario',
    fechaAprobacion: generateDynamicDate(-1)
  },
  {
    id: '4',
    numeroDevolucion: '8',
    cedulaPasajero: '9876543210',
    nombrePasajero: 'Carlos López',
    fechaSolicitud: generateDynamicDate(-7),
    fechaDevolucion: generateDynamicDate(0),
    estado: 'completamente_aprobada',
    monto: 8500.00,
    motivoDevolucion: 'Cancelación de servicio por fuerza mayor',
    aprobadoPor: 'Admin Usuario',
    fechaAprobacion: generateDynamicDate(-3),
    autorizadoPor: 'Supervisor Zona',
    fechaAutorizacion: generateDynamicDate(-2)
  },
  {
    id: '5',
    numeroDevolucion: '9',
    cedulaPasajero: '5555555555',
    nombrePasajero: 'Ana Patricia Torres',
    fechaSolicitud: generateDynamicDate(-10),
    fechaDevolucion: '',
    estado: 'rechazada',
    monto: 50000.00,
    motivoDevolucion: 'Solicitud de reembolso completo',
    rechazadoPor: 'Admin Usuario',
    fechaRechazo: generateDynamicDate(-8),
    motivoRechazo: 'Monto excede el límite permitido'
  },
  {
    id: '6',
    numeroDevolucion: '10',
    cedulaPasajero: '1111222233',
    nombrePasajero: 'Roberto Silva',
    fechaSolicitud: generateDynamicDate(-15),
    fechaDevolucion: generateDynamicDate(-5),
    estado: 'procesada',
    monto: 18000.00,
    motivoDevolucion: 'Doble cobro por error del sistema',
    aprobadoPor: 'Admin Usuario',
    fechaAprobacion: generateDynamicDate(-12),
    autorizadoPor: 'Supervisor Zona',
    fechaAutorizacion: generateDynamicDate(-10)
  }
];