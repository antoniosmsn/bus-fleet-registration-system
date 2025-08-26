export type SentidoRuta = 'ingreso' | 'salida';

export interface SolicitudCambioRuta {
  id: string;
  servicioId: string;
  numeroServicio: string;
  rutaOriginal: {
    id: string;
    nombre: string;
    sentido: SentidoRuta;
  };
  rutaNueva: {
    id: string;
    nombre: string;
    sentido: SentidoRuta;
  };
  usuario: {
    id: string;
    nombre: string;
    username: string;
  };
  fechaSolicitud: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  empresaTransporte: string;
  autobus: string;
  motivo?: string;
}

export interface RutaConSentido {
  id: string;
  nombre: string;
  sentido: SentidoRuta;
  tipoRuta: 'publica' | 'privada' | 'especial' | 'parque';
  empresaCliente?: string;
  empresaTransporte?: string;
}