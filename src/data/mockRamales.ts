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
  // Transportes San José S.A. routes
  { id: '1', nombre: 'San José - Cartago', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '2', nombre: 'San José - Cartago', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '3', nombre: 'Cartago - Turrialba', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '4', nombre: 'Cartago - Turrialba', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '5', nombre: 'San José Centro', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  { id: '6', nombre: 'San José Centro', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes San José S.A.' },
  
  // Autobuses del Valle routes
  { id: '7', nombre: 'Zona Franca Intel', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Intel Corporation', empresaTransporte: 'Autobuses del Valle' },
  { id: '8', nombre: 'Zona Franca Intel', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Intel Corporation', empresaTransporte: 'Autobuses del Valle' },
  { id: '9', nombre: 'Heredia - Alajuela', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Autobuses del Valle' },
  { id: '10', nombre: 'Heredia - Alajuela', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Autobuses del Valle' },
  { id: '11', nombre: 'Belén Industrial', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Procter & Gamble', empresaTransporte: 'Autobuses del Valle' },
  { id: '12', nombre: 'Belén Industrial', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Procter & Gamble', empresaTransporte: 'Autobuses del Valle' },
  
  // Empresa de Transporte Central routes
  { id: '13', nombre: 'Alajuela Centro', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Abbott', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '14', nombre: 'Alajuela Centro', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Abbott', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '15', nombre: 'Heredia Centro', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Empresa de Transporte Central' },
  { id: '16', nombre: 'Heredia Centro', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Empresa de Transporte Central' },
  
  // Transportes Unidos routes
  { id: '17', nombre: 'San José - Parque Industrial', sentido: 'ingreso', tipoRuta: 'parque', empresaTransporte: 'Transportes Unidos' },
  { id: '18', nombre: 'San José - Parque Industrial', sentido: 'salida', tipoRuta: 'parque', empresaTransporte: 'Transportes Unidos' },
  { id: '19', nombre: 'Parque La Sabana', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Unidos' },
  { id: '20', nombre: 'Parque La Sabana', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Unidos' },
  
  // Buses Express Costa Rica routes
  { id: '21', nombre: 'Campus Tecnológico', sentido: 'ingreso', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional', empresaTransporte: 'Buses Express Costa Rica' },
  { id: '22', nombre: 'Campus Tecnológico', sentido: 'salida', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional', empresaTransporte: 'Buses Express Costa Rica' },
  { id: '23', nombre: 'Zona Franca Metropolitana', sentido: 'ingreso', tipoRuta: 'parque', empresaTransporte: 'Buses Express Costa Rica' },
  { id: '24', nombre: 'Zona Franca Metropolitana', sentido: 'salida', tipoRuta: 'parque', empresaTransporte: 'Buses Express Costa Rica' },
  
  // Transportes Rápidos routes
  { id: '25', nombre: 'Cañas Industrial', sentido: 'ingreso', tipoRuta: 'especial', empresaCliente: 'Bayer', empresaTransporte: 'Transportes Rápidos' },
  { id: '26', nombre: 'Cañas Industrial', sentido: 'salida', tipoRuta: 'especial', empresaCliente: 'Bayer', empresaTransporte: 'Transportes Rápidos' },
  { id: '27', nombre: 'Cañas Centro', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Rápidos' },
  { id: '28', nombre: 'Cañas Centro', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Rápidos' },
  
  // Transportes Heredia routes
  { id: '29', nombre: 'Heredia - San José', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Heredia' },
  { id: '30', nombre: 'Heredia - San José', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Heredia' },
  { id: '31', nombre: 'Heredia - Alajuela', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Heredia' },
  { id: '32', nombre: 'Heredia - Alajuela', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Heredia' },
  
  // Transportes Puntarenas routes
  { id: '33', nombre: 'Puntarenas - San José', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Empresa Turística Costa Rica', empresaTransporte: 'Transportes Puntarenas' },
  { id: '34', nombre: 'Puntarenas - San José', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Empresa Turística Costa Rica', empresaTransporte: 'Transportes Puntarenas' },
  { id: '35', nombre: 'Puntarenas Centro', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Puntarenas' },
  { id: '36', nombre: 'Puntarenas Centro', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Puntarenas' },
  
  // Transportes del Caribe routes
  { id: '37', nombre: 'Limón - San José', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes del Caribe' },
  { id: '38', nombre: 'Limón - San José', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes del Caribe' },
  { id: '39', nombre: 'Puerto Viejo - Limón', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes del Caribe' },
  { id: '40', nombre: 'Puerto Viejo - Limón', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes del Caribe' },
  
  // Transportes Guanacaste routes
  { id: '41', nombre: 'Guanacaste - San José', sentido: 'ingreso', tipoRuta: 'privada', empresaCliente: 'Hotel Tamarindo', empresaTransporte: 'Transportes Guanacaste' },
  { id: '42', nombre: 'Guanacaste - San José', sentido: 'salida', tipoRuta: 'privada', empresaCliente: 'Hotel Tamarindo', empresaTransporte: 'Transportes Guanacaste' },
  { id: '43', nombre: 'Liberia - Tamarindo', sentido: 'ingreso', tipoRuta: 'publica', empresaTransporte: 'Transportes Guanacaste' },
  { id: '44', nombre: 'Liberia - Tamarindo', sentido: 'salida', tipoRuta: 'publica', empresaTransporte: 'Transportes Guanacaste' }
];