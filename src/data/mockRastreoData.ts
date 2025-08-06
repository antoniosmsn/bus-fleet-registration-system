// Mock data for real-time tracking

export interface EmpresaCliente {
  id: string;
  nombre: string;
  activa: boolean;
}

export interface EmpresaTransporte {
  id: string;
  nombre: string;
  codigo: string;
  activa: boolean;
}

export interface RamalDetallado {
  id: string;
  nombre: string;
  tipoRuta: 'parque' | 'privado' | 'especial';
  empresaCliente?: string;
  ubicacion: string;
}

export interface AutobusRastreo {
  id: string;
  identificador: string;
  placa: string;
  empresaTransporte: string;
  empresaCliente?: string;
  tipoServicio: 'parque' | 'privado' | 'especial';
  ramal?: string;
  conductor: string;
  lat: number;
  lng: number;
  velocidad: number;
  ocupacionActual: number;
  capacidadTotal: number;
  curso: number; // 0-360 degrees
  estado: 'en_linea' | 'fuera_linea';
  ultimaTransmision: Date;
  activo: boolean;
}

// 20 Empresas Cliente
export const mockEmpresasCliente: EmpresaCliente[] = [
  { id: '1', nombre: 'Intel Corporation', activa: true },
  { id: '2', nombre: 'Abbott Laboratories', activa: true },
  { id: '3', nombre: 'Bayer S.A.', activa: true },
  { id: '4', nombre: 'Procter & Gamble', activa: true },
  { id: '5', nombre: 'Microsoft Costa Rica', activa: true },
  { id: '6', nombre: 'Amazon Web Services', activa: true },
  { id: '7', nombre: 'Pfizer Inc.', activa: true },
  { id: '8', nombre: 'Johnson & Johnson', activa: true },
  { id: '9', nombre: 'Boston Scientific', activa: true },
  { id: '10', nombre: 'Baxter International', activa: true },
  { id: '11', nombre: 'Hewlett Packard Enterprise', activa: true },
  { id: '12', nombre: 'DHL Express', activa: true },
  { id: '13', nombre: 'FedEx Corporation', activa: true },
  { id: '14', nombre: 'Coca-Cola FEMSA', activa: true },
  { id: '15', nombre: 'Nestlé Costa Rica', activa: true },
  { id: '16', nombre: 'Unilever Central America', activa: true },
  { id: '17', nombre: 'Colgate-Palmolive', activa: true },
  { id: '18', nombre: 'Kimberly-Clark', activa: true },
  { id: '19', nombre: 'Accenture Costa Rica', activa: true },
  { id: '20', nombre: 'TCS (Tata Consultancy)', activa: true }
];

// 5 Empresas de Transporte
export const mockEmpresasTransporte: EmpresaTransporte[] = [
  { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ', activa: true },
  { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV', activa: true },
  { id: '3', nombre: 'Transportes Unidos', codigo: 'TU', activa: true },
  { id: '4', nombre: 'Buses Express Costa Rica', codigo: 'BECR', activa: true },
  { id: '5', nombre: 'Transportes Metropolitanos', codigo: 'TM', activa: true }
];

// 20+ Ramales con ubicaciones de Alajuela y San José
export const mockRamalesDetallados: RamalDetallado[] = [
  // Rutas Parque
  { id: '1', nombre: 'Parque Industrial Belén', tipoRuta: 'parque', ubicacion: 'Belén, Heredia' },
  { id: '2', nombre: 'Parque Tecnológico Cartago', tipoRuta: 'parque', ubicacion: 'Cartago, Costa Rica' },
  { id: '3', nombre: 'Zona Franca América', tipoRuta: 'parque', ubicacion: 'Heredia, Costa Rica' },
  { id: '4', nombre: 'Parque Industrial La Lima', tipoRuta: 'parque', ubicacion: 'Cartago, Costa Rica' },
  
  // Rutas Privadas
  { id: '5', nombre: 'Intel - Belén', tipoRuta: 'privado', empresaCliente: 'Intel Corporation', ubicacion: 'Belén, Heredia' },
  { id: '6', nombre: 'Abbott - Coyol', tipoRuta: 'privado', empresaCliente: 'Abbott Laboratories', ubicacion: 'Alajuela, Costa Rica' },
  { id: '7', nombre: 'Bayer - San Antonio', tipoRuta: 'privado', empresaCliente: 'Bayer S.A.', ubicacion: 'Belén, Heredia' },
  { id: '8', nombre: 'P&G - Escazú', tipoRuta: 'privado', empresaCliente: 'Procter & Gamble', ubicacion: 'San José, Costa Rica' },
  { id: '9', nombre: 'Microsoft - La Sabana', tipoRuta: 'privado', empresaCliente: 'Microsoft Costa Rica', ubicacion: 'San José, Costa Rica' },
  { id: '10', nombre: 'Amazon - Forum', tipoRuta: 'privado', empresaCliente: 'Amazon Web Services', ubicacion: 'Santa Ana, San José' },
  { id: '11', nombre: 'Pfizer - Lindora', tipoRuta: 'privado', empresaCliente: 'Pfizer Inc.', ubicacion: 'Santa Ana, San José' },
  
  // Rutas Especiales
  { id: '12', nombre: 'J&J - Campus Central', tipoRuta: 'especial', empresaCliente: 'Johnson & Johnson', ubicacion: 'San José Centro' },
  { id: '13', nombre: 'Boston Scientific - Heredia', tipoRuta: 'especial', empresaCliente: 'Boston Scientific', ubicacion: 'Heredia, Costa Rica' },
  { id: '14', nombre: 'Baxter - Coyol Express', tipoRuta: 'especial', empresaCliente: 'Baxter International', ubicacion: 'Alajuela, Costa Rica' },
  { id: '15', nombre: 'HPE - Zona Franca', tipoRuta: 'especial', empresaCliente: 'Hewlett Packard Enterprise', ubicacion: 'Heredia, Costa Rica' },
  { id: '16', nombre: 'DHL - Aeropuerto', tipoRuta: 'especial', empresaCliente: 'DHL Express', ubicacion: 'Alajuela, Costa Rica' },
  { id: '17', nombre: 'FedEx - Logística', tipoRuta: 'especial', empresaCliente: 'FedEx Corporation', ubicacion: 'San José, Costa Rica' },
  { id: '18', nombre: 'Coca-Cola - Distribución', tipoRuta: 'especial', empresaCliente: 'Coca-Cola FEMSA', ubicacion: 'San José, Costa Rica' },
  { id: '19', nombre: 'Nestlé - Producción', tipoRuta: 'especial', empresaCliente: 'Nestlé Costa Rica', ubicacion: 'Cartago, Costa Rica' },
  { id: '20', nombre: 'Unilever - Centro', tipoRuta: 'especial', empresaCliente: 'Unilever Central America', ubicacion: 'San José Centro' },
  { id: '21', nombre: 'TCS - Campus Tecnológico', tipoRuta: 'especial', empresaCliente: 'TCS (Tata Consultancy)', ubicacion: 'San José, Costa Rica' }
];

// Generar 150 autobuses distribuidos equitativamente
const generateAutobuses = (): AutobusRastreo[] => {
  const autobuses: AutobusRastreo[] = [];
  const conductores = [
    'Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana López', 'Luis Morales',
    'Carmen Jiménez', 'Roberto Vargas', 'Patricia Herrera', 'Miguel Castillo', 'Laura Méndez',
    'Francisco Vega', 'Rosa Alvarado', 'Diego Ramírez', 'Sofía Castro', 'Javier Solano',
    'Elena Araya', 'Andrés Chinchilla', 'Mónica Calderón', 'Ricardo Salas', 'Gabriela Rojas'
  ];

  // Coordenadas para Alajuela y San José
  const coordenadas = [
    { lat: 10.0162, lng: -84.2117 }, // Alajuela Centro
    { lat: 9.9967, lng: -84.2064 }, // Aeropuerto
    { lat: 10.0167, lng: -84.1833 }, // Coyol
    { lat: 9.9497, lng: -84.1478 }, // Belén
    { lat: 9.9326, lng: -84.0775 }, // San José Centro
    { lat: 9.9145, lng: -84.0977 }, // Escazú
    { lat: 9.9356, lng: -84.1384 }, // Santa Ana
    { lat: 9.9719, lng: -84.0817 }, // Heredia Centro
    { lat: 9.8634, lng: -83.9185 }, // Cartago Centro
    { lat: 9.9281, lng: -84.0907 }  // La Sabana
  ];

  for (let i = 1; i <= 150; i++) {
    const empresaTransporte = mockEmpresasTransporte[i % mockEmpresasTransporte.length];
    const coordenada = coordenadas[i % coordenadas.length];
    
    // Añadir variación aleatoria a las coordenadas
    const lat = coordenada.lat + (Math.random() - 0.5) * 0.02;
    const lng = coordenada.lng + (Math.random() - 0.5) * 0.02;
    
    // Distribución de tipos de servicio
    let tipoServicio: 'parque' | 'privado' | 'especial';
    let empresaCliente: string | undefined;
    let ramal: string | undefined;
    
    if (i % 3 === 0) {
      tipoServicio = 'parque';
      const ramalParque = mockRamalesDetallados.filter(r => r.tipoRuta === 'parque')[i % 4];
      ramal = ramalParque?.nombre;
    } else if (i % 3 === 1) {
      tipoServicio = 'privado';
      const empresaClienteObj = mockEmpresasCliente[i % mockEmpresasCliente.length];
      empresaCliente = empresaClienteObj.nombre;
      const ramalPrivado = mockRamalesDetallados.filter(r => r.tipoRuta === 'privado')[i % 7];
      ramal = ramalPrivado?.nombre;
    } else {
      tipoServicio = 'especial';
      const empresaClienteObj = mockEmpresasCliente[i % mockEmpresasCliente.length];
      empresaCliente = empresaClienteObj.nombre;
      const ramalEspecial = mockRamalesDetallados.filter(r => r.tipoRuta === 'especial')[i % 10];
      ramal = ramalEspecial?.nombre;
    }

    const estado = Math.random() > 0.1 ? 'en_linea' : 'fuera_linea';
    const capacidad = [25, 30, 35, 40, 45, 50][i % 6];
    const ocupacion = estado === 'en_linea' ? Math.floor(Math.random() * capacidad) : 0;
    
    autobuses.push({
      id: i.toString(),
      identificador: (100 + i).toString(),
      placa: `${empresaTransporte.codigo}${(1000 + i).toString().slice(-3)}`,
      empresaTransporte: empresaTransporte.nombre,
      empresaCliente,
      tipoServicio,
      ramal,
      conductor: conductores[i % conductores.length],
      lat,
      lng,
      velocidad: estado === 'en_linea' ? Math.floor(Math.random() * 80) + 10 : 0,
      ocupacionActual: ocupacion,
      capacidadTotal: capacidad,
      curso: Math.floor(Math.random() * 360),
      estado,
      ultimaTransmision: new Date(Date.now() - Math.random() * 300000), // Últimos 5 minutos
      activo: Math.random() > 0.05 // 95% activos
    });
  }

  return autobuses;
};

export const mockAutobusesRastreo = generateAutobuses();

// Parámetros de telemetría
export const TELEMETRIA_CONFIG = {
  INTERVALO_POLLING_SEGUNDOS: 5,
  MULTIPLICADOR_FUERA_LINEA: 6,
  TIEMPO_MAXIMO_SIN_TRANSMISION: 30 // segundos
};