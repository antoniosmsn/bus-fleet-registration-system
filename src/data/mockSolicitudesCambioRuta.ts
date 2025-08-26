import { SolicitudCambioRuta } from '@/types/cambio-ruta';

export const mockSolicitudesCambioRuta: SolicitudCambioRuta[] = [
  {
    id: '1',
    servicioId: 'srv_001',
    numeroServicio: 'SRV-001-2025-08-26',
    rutaOriginal: {
      id: '1',
      nombre: 'San José - Cartago',
      sentido: 'ingreso'
    },
    rutaNueva: {
      id: '9',
      nombre: 'Cartago - Turrialba',
      sentido: 'salida'
    },
    usuario: {
      id: 'usr_001',
      nombre: 'Carlos Mendoza',
      username: 'cmendoza'
    },
    fechaSolicitud: new Date().toISOString(),
    estado: 'pendiente',
    empresaTransporte: 'Transportes San José S.A.',
    autobus: 'BUS-001',
    motivo: 'Error en selección de ruta por parte del conductor'
  },
  {
    id: '2',
    servicioId: 'srv_002',
    numeroServicio: 'SRV-002-2025-08-25',
    rutaOriginal: {
      id: '3',
      nombre: 'Alajuela',
      sentido: 'salida'
    },
    rutaNueva: {
      id: '7',
      nombre: 'Zona Franca Intel',
      sentido: 'ingreso'
    },
    usuario: {
      id: 'usr_002',
      nombre: 'Ana Rodriguez',
      username: 'arodriguez'
    },
    fechaSolicitud: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    estado: 'aprobada',
    empresaTransporte: 'Autobuses del Valle',
    autobus: 'BUS-025',
    motivo: 'Cambio de destino por necesidades operacionales'
  }
];