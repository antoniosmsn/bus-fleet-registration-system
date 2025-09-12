import { CargueCredito, DetalleCargueCredito } from '@/types/carga-creditos';
import { mockTransportistas } from './mockTransportistas';

// Función para generar fechas dinámicas de los últimos 30 días
const generateDynamicDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Empresas y usuarios reales del sistema
const empresasClientes = [
  'Cooperación Manufacturing Costa Rica Srl',
  'Abbott Medical Srl B44',
  'Abbott Medical Srl B31', 
  'Tech Solutions Inc',
  'Banco Nacional de Costa Rica',
  'Intel Costa Rica',
  'Grupo Mutual',
  'Scotiabank Costa Rica',
  'Microsoft Costa Rica',
  'Hewlett Packard Enterprise',
  'Amazon Development Center',
  'Procter & Gamble'
];

const usuariosCreacion = [
  'admin@empresa.com',
  'supervisor@empresa.com',
  'it@empresa.com',
  'hr@empresa.com',
  'manager@empresa.com',
  'operador@sistema.com'
];

const zonasfrancas = [
  'Zona Franca Coyol',
  'Zona Franca Metropolitana',
  'Zona Franca El Coyol',
  'Zona Franca América',
  'Zona Franca Cartago'
];

// Mock data para cargues de créditos
export const mockCarguesCreditos: CargueCredito[] = [
  {
    id: '1',
    fechaCargue: generateDynamicDate(0), // Hoy
    nombreArchivo: 'cargue_creditos_matutino_2025_01_15.xlsx',
    nombreUsuario: 'admin@empresa.com',
    estado: 'Procesado',
    totalRegistros: 150,
    registrosExitosos: 150,
    registrosConError: 0,
    montoTotal: 2250000,
    zonaFranca: 'Zona Franca Coyol',
    fechaCreacion: generateDynamicDate(0),
    usuarioCreacion: 'admin@empresa.com'
  },
  {
    id: '2',
    fechaCargue: generateDynamicDate(0), // Hoy
    nombreArchivo: 'cargue_creditos_vespertino_2025_01_15.xlsx',
    nombreUsuario: 'supervisor@empresa.com',
    estado: 'Procesado con error',
    totalRegistros: 85,
    registrosExitosos: 80,
    registrosConError: 5,
    montoTotal: 1200000,
    zonaFranca: 'Zona Franca Metropolitana',
    fechaCreacion: generateDynamicDate(0),
    usuarioCreacion: 'supervisor@empresa.com'
  },
  {
    id: '3',
    fechaCargue: generateDynamicDate(0), // Hoy
    nombreArchivo: 'cargue_creditos_nocturno_2025_01_15.xlsx',
    nombreUsuario: 'it@empresa.com',
    estado: 'Procesado',
    totalRegistros: 120,
    registrosExitosos: 120,
    registrosConError: 0,
    montoTotal: 1800000,
    zonaFranca: 'Zona Franca El Coyol',
    fechaCreacion: generateDynamicDate(0),
    usuarioCreacion: 'it@empresa.com'
  },
  {
    id: '4',
    fechaCargue: generateDynamicDate(0), // Hoy
    nombreArchivo: 'cargue_creditos_especial_2025_01_15.xlsx',
    nombreUsuario: 'hr@empresa.com',
    estado: 'Procesado',
    totalRegistros: 95,
    registrosExitosos: 95,
    registrosConError: 0,
    montoTotal: 1425000,
    zonaFranca: 'Zona Franca América',
    fechaCreacion: generateDynamicDate(0),
    usuarioCreacion: 'hr@empresa.com'
  },
  {
    id: '2',
    fechaCargue: generateDynamicDate(1), // Ayer
    nombreArchivo: 'carga_masiva_enero_2025.xlsx',
    nombreUsuario: 'supervisor@empresa.com',
    estado: 'Procesado con error',
    totalRegistros: 200,
    registrosExitosos: 185,
    registrosConError: 15,
    montoTotal: 2775000,
    zonaFranca: 'Zona Franca Metropolitana',
    fechaCreacion: generateDynamicDate(1),
    usuarioCreacion: 'supervisor@empresa.com'
  },
  {
    id: '3',
    fechaCargue: generateDynamicDate(2),
    nombreArchivo: 'creditos_pasajeros_diarios.xlsx',
    nombreUsuario: 'operador@sistema.com',
    estado: 'Procesado',
    totalRegistros: 89,
    registrosExitosos: 89,
    registrosConError: 0,
    montoTotal: 1335000,
    zonaFranca: 'Zona Franca El Coyol',
    fechaCreacion: generateDynamicDate(2),
    usuarioCreacion: 'operador@sistema.com'
  },
  {
    id: '4',
    fechaCargue: generateDynamicDate(3),
    nombreArchivo: 'cargue_empresas_tech.xlsx',
    nombreUsuario: 'hr@empresa.com',
    estado: 'Procesado con error',
    totalRegistros: 250,
    registrosExitosos: 230,
    registrosConError: 20,
    montoTotal: 3450000,
    zonaFranca: 'Zona Franca América',
    fechaCreacion: generateDynamicDate(3),
    usuarioCreacion: 'hr@empresa.com'
  },
  {
    id: '5',
    fechaCargue: generateDynamicDate(5),
    nombreArchivo: 'recarga_semanal_pasajeros.xlsx',
    nombreUsuario: 'manager@empresa.com',
    estado: 'Procesado',
    totalRegistros: 175,
    registrosExitosos: 175,
    registrosConError: 0,
    montoTotal: 2625000,
    zonaFranca: 'Zona Franca Cartago',
    fechaCreacion: generateDynamicDate(5),
    usuarioCreacion: 'manager@empresa.com'
  },
  {
    id: '6',
    fechaCargue: generateDynamicDate(7),
    nombreArchivo: 'carga_creditos_backup.xlsx',
    nombreUsuario: 'it@empresa.com',
    estado: 'Procesado con error',
    totalRegistros: 300,
    registrosExitosos: 280,
    registrosConError: 20,
    montoTotal: 4200000,
    zonaFranca: 'Zona Franca Coyol',
    fechaCreacion: generateDynamicDate(7),
    usuarioCreacion: 'it@empresa.com'
  },
  {
    id: '7',
    fechaCargue: generateDynamicDate(10),
    nombreArchivo: 'cargas_mensuales_diciembre.xlsx',
    nombreUsuario: 'admin@empresa.com',
    estado: 'Procesado',
    totalRegistros: 400,
    registrosExitosos: 400,
    registrosConError: 0,
    montoTotal: 6000000,
    zonaFranca: 'Zona Franca Metropolitana',
    fechaCreacion: generateDynamicDate(10),
    usuarioCreacion: 'admin@empresa.com'
  },
  {
    id: '8',
    fechaCargue: generateDynamicDate(15),
    nombreArchivo: 'carga_especial_bonificaciones.xlsx',
    nombreUsuario: 'supervisor@empresa.com',
    estado: 'Procesado con error',
    totalRegistros: 120,
    registrosExitosos: 100,
    registrosConError: 20,
    montoTotal: 1800000,
    zonaFranca: 'Zona Franca El Coyol',
    fechaCreacion: generateDynamicDate(15),
    usuarioCreacion: 'supervisor@empresa.com'
  }
];

// Función para generar detalles de un cargue específico
export const generateDetallesCargue = (cargue: CargueCredito): DetalleCargueCredito[] => {
  const detalles: DetalleCargueCredito[] = [];
  
  // Generar registros exitosos
  for (let i = 1; i <= cargue.registrosExitosos; i++) {
    const empresa = empresasClientes[Math.floor(Math.random() * empresasClientes.length)];
    const cedula = `${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    detalles.push({
      id: `${cargue.id}-${i}`,
      cargueId: cargue.id,
      fechaCargue: cargue.fechaCargue,
      monto: Math.floor(Math.random() * 20000) + 5000, // Entre 5000 y 25000
      nombrePasajero: generateRandomName(),
      cedula,
      empresa,
      estado: 'exitoso'
    });
  }
  
  // Generar registros con error
  for (let i = 1; i <= cargue.registrosConError; i++) {
    const empresa = empresasClientes[Math.floor(Math.random() * empresasClientes.length)];
    const cedula = `${Math.floor(Math.random() * 900000000) + 100000000}`;
    const errores = [
      'Cédula no válida en el sistema',
      'Pasajero no activo',
      'Monto excede límite permitido',
      'Empresa no autorizada para carga',
      'Formato de fecha incorrecto',
      'Pasajero ya tiene carga pendiente'
    ];
    
    detalles.push({
      id: `${cargue.id}-error-${i}`,
      cargueId: cargue.id,
      fechaCargue: cargue.fechaCargue,
      monto: Math.floor(Math.random() * 20000) + 5000,
      nombrePasajero: generateRandomName(),
      cedula,
      empresa,
      estado: 'error',
      mensajeError: errores[Math.floor(Math.random() * errores.length)],
      numeroLinea: cargue.registrosExitosos + i + 1
    });
  }
  
  return detalles.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));
};

// Función auxiliar para generar nombres aleatorios
function generateRandomName(): string {
  const nombres = [
    'Arían Ledezma Fernández',
    'Ashly Dylana Pineda Espinoza',
    'Jaxon Moreira Arias',
    'María José González Ramírez',
    'Carlos Alberto Vargas Méndez',
    'Ana Carolina Jiménez Castro',
    'Luis Fernando Solano Vega',
    'Patricia Elena Hernández Morales',
    'Roberto José Chaves Rojas',
    'Carmen María Quirós Vindas',
    'Diego Andrés Campos Salas',
    'Gabriela Andrea Montero Alfaro',
    'Fernando Alonso Mora Soto',
    'Silvia Elena Ramírez Cruz',
    'José Manuel Herrera Vega'
  ];
  
  return nombres[Math.floor(Math.random() * nombres.length)];
}

// Cache de detalles para simular persistencia
const detallesCache: { [key: string]: DetalleCargueCredito[] } = {};

export const getDetallesCargue = (cargueId: string): DetalleCargueCredito[] => {
  if (!detallesCache[cargueId]) {
    const cargue = mockCarguesCreditos.find(c => c.id === cargueId);
    if (cargue) {
      detallesCache[cargueId] = generateDetallesCargue(cargue);
    }
  }
  return detallesCache[cargueId] || [];
};

export { zonasfrancas, usuariosCreacion, empresasClientes };