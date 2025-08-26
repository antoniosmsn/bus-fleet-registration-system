import { SentidoRuta } from '@/types/cambio-ruta';

export interface Ramal {
  id: string;
  nombre: string;
  sentido: SentidoRuta;
  tipoRuta: 'publica' | 'privada' | 'especial' | 'parque';
  empresaCliente?: string;
  empresaTransporte?: string;
}

export const mockRamales: Ramal[] = [
  { id: '1', nombre: 'San José - Cartago', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '2', nombre: 'San José - Cartago', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '3', nombre: 'Heredia - Alajuela', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Autobuses del Valle' },
  { id: '4', nombre: 'Heredia - Alajuela', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Autobuses del Valle' },
  { id: '5', nombre: 'Alajuela', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Abbott', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '6', nombre: 'Alajuela', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Abbott', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '7', nombre: 'San José - Parque', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Unidos' },
  { id: '8', nombre: 'San José - Parque', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Unidos' },
  { id: '9', nombre: 'Parque Industrial', sentido: 'ingreso', tipoRuta: 'parque', empresaTransporte: 'Buses Express Costa Rica' },
  { id: '10', nombre: 'Parque Industrial', sentido: 'salida', tipoRuta: 'parque', empresaTransporte: 'Buses Express Costa Rica' },
  { id: '11', nombre: 'Cañas', sentido: 'ingreso', tipoRuta: 'especial', empresaCliente: 'Bayer', empresaTransporte: 'Transportes Rápidos' },
  { id: '12', nombre: 'Cañas', sentido: 'salida', tipoRuta: 'especial', empresaCliente: 'Bayer', empresaTransporte: 'Transportes Rápidos' },
  { id: '13', nombre: 'Zona Franca Intel', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Intel Corporation', empresaTransporte: 'Línea Dorada' },
  { id: '14', nombre: 'Zona Franca Intel', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Intel Corporation', empresaTransporte: 'Línea Dorada' },
  { id: '15', nombre: 'Campus Tecnológico', sentido: 'ingreso', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional', empresaTransporte: 'Autobuses Metropolitanos' },
  { id: '16', nombre: 'Campus Tecnológico', sentido: 'salida', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional', empresaTransporte: 'Autobuses Metropolitanos' },
  { id: '17', nombre: 'Cartago - Turrialba', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '18', nombre: 'Cartago - Turrialba', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '19', nombre: 'Belén', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Procter & Gamble', empresaTransporte: 'Autobuses del Valle' },
  { id: '20', nombre: 'Belén', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Procter & Gamble', empresaTransporte: 'Autobuses del Valle' },
  { id: '21', nombre: 'Heredia Centro', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '22', nombre: 'Heredia Centro', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Empresa de Transporte Central' }
];