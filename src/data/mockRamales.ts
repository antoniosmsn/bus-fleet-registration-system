export interface Ramal {
  id: string;
  nombre: string;
  tipoRuta: 'publica' | 'privada' | 'especial' | 'parque';
  empresaCliente?: string;
}

export const mockRamales: Ramal[] = [
  { id: '1', nombre: 'San José - Cartago', tipoRuta: 'publica' },
  { id: '2', nombre: 'Heredia - Alajuela', tipoRuta: 'publica' },
  { id: '3', nombre: 'Alajuela', tipoRuta: 'privada', empresaCliente: 'Abbott' },
  { id: '4', nombre: 'San José - Parque', tipoRuta: 'publica' },
  { id: '5', nombre: 'Parque Industrial', tipoRuta: 'parque' },
  { id: '6', nombre: 'Cañas', tipoRuta: 'especial', empresaCliente: 'Bayer' },
  { id: '7', nombre: 'Zona Franca Intel', tipoRuta: 'privada', empresaCliente: 'Intel Corporation' },
  { id: '8', nombre: 'Campus Tecnológico', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional' },
  { id: '9', nombre: 'Cartago - Turrialba', tipoRuta: 'publica' },
  { id: '10', nombre: 'Belén', tipoRuta: 'privada', empresaCliente: 'Procter & Gamble' },
  { id: '11', nombre: 'Heredia Centro', tipoRuta: 'publica' }
];