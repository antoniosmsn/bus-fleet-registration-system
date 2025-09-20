import { InformeCumplimiento, EstadoRevision } from '@/types/informe-cumplimiento';

// Helper functions
const generateCurrentMonthDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const generateTime = (): string => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const generatePlate = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
};

// Mock data arrays
const transportistas = ['Transporte Norte', 'Buses del Sur', 'Rápidos del Este', 'Transportes Unidos', 'Líneas Metropolitanas'];
const empresasCliente = ['Zona Franca A', 'Zona Franca B', 'Corporación Central', 'Empresa Tecnológica', 'Manufactura Industrial'];
const tiposRuta = ['especial', 'privada', 'parque'];
const turnos = ['Mañana', 'Tarde', 'Noche', 'Madrugada'];
const ramales = ['Ramal Norte', 'Ramal Sur', 'Ramal Este', 'Ramal Oeste', 'Ramal Central'];
const tiposUnidad = ['Bus Articulado', 'Bus Convencional', 'Microbús', 'Buseta'];
const sentidos: ('Ingreso' | 'Salida')[] = ['Ingreso', 'Salida'];
const estadosRevision: EstadoRevision[] = ['Pendiente', 'Revisado por Transportista', 'Revisado por Administración', 'Completado'];
const estadosServicio = ['Sin iniciar', 'Iniciado', 'Iniciado-descarga incompleta', 'Cierre manual-descarga completa', 'Cierre manual-descarga incompleta', 'Cierre automático-descarga incompleta', 'Cierre automático-descarga completa'];
const cumplimientoOptions: ('Cumplido' | 'No cumplido')[] = ['Cumplido', 'No cumplido'];

// Generate week number
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Generate mock data - Ensure multiple services per client company
export const mockInformesCumplimiento: InformeCumplimiento[] = Array.from({ length: 100 }, (_, index) => {
  const fechaServicioDate = new Date();
  fechaServicioDate.setDate(fechaServicioDate.getDate() - Math.floor(Math.random() * 30));
  
  const horaInicio = generateTime();
  const [horaInicioHours, horaInicioMinutes] = horaInicio.split(':').map(Number);
  const horaFinalizacionDate = new Date();
  horaFinalizacionDate.setHours(horaInicioHours + Math.floor(Math.random() * 3) + 1, horaInicioMinutes + Math.floor(Math.random() * 60));
  const horaFinalizacion = `${String(horaFinalizacionDate.getHours()).padStart(2, '0')}:${String(horaFinalizacionDate.getMinutes()).padStart(2, '0')}`;
  
  const ocupacion = Math.floor(Math.random() * 50) + 10;
  const capacidadMaxima = 60;
  const porcentajeOcupacion = Math.round((ocupacion / capacidadMaxima) * 100);
  
  const tarifaPasajero = Math.floor(Math.random() * 1000) + 500;
  const tarifaServicio = tarifaPasajero * ocupacion;
  const tarifaServicioTransportista = Math.round(tarifaServicio * 0.85);
  
  // Ensure each company gets multiple services (distribute evenly with some randomness)
  const empresaClienteIndex = Math.floor(index / 20); // Each company gets ~20 services
  const empresaCliente = empresasCliente[empresaClienteIndex % empresasCliente.length];
  
  // Generate realistic data for new fields with controlled examples for inconsistency
  let pasajeros, transmitidos, faltante, inicioRealizado, cierreRealizado, ultimaDescarga, cumplimiento, cambioRuta;
  
  // Create specific examples for inconsistency states
  if (index < 10) {
    // POSITIVO: Perfect compliance examples (first 10 items)
    pasajeros = Math.floor(Math.random() * 40) + 10;
    transmitidos = pasajeros; // No missing passengers
    faltante = 0;
    inicioRealizado = generateTime();
    cierreRealizado = generateTime();
    ultimaDescarga = `${generateCurrentMonthDate(Math.floor(Math.random() * 2))} ${generateTime()}`;
    cumplimiento = 'Cumplido';
    cambioRuta = false; // No route change
  } else if (index >= 10 && index < 30) {
    // NEUTRO: Intermediate/pending states (items 11-30)
    pasajeros = Math.floor(Math.random() * 40) + 10;
    transmitidos = Math.floor(pasajeros * (Math.random() * 0.2 + 0.8)); // 80-100%
    faltante = pasajeros - transmitidos;
    inicioRealizado = Math.random() > 0.5 ? generateTime() : null; // 50% chance
    cierreRealizado = Math.random() > 0.6 ? generateTime() : null; // 40% chance
    ultimaDescarga = Math.random() > 0.4 ? `${generateCurrentMonthDate(Math.floor(Math.random() * 3))} ${generateTime()}` : null;
    cumplimiento = Math.random() > 0.5 ? 'Cumplido' : 'No cumplido';
    cambioRuta = false; // No route change for neutral
  } else {
    // NEGATIVO: Problems detected (rest of items)
    pasajeros = Math.floor(Math.random() * 40) + 10;
    transmitidos = Math.floor(pasajeros * (Math.random() * 0.3 + 0.4)); // 40-70% (more missing)
    faltante = pasajeros - transmitidos;
    inicioRealizado = Math.random() > 0.3 ? generateTime() : null;
    cierreRealizado = Math.random() > 0.4 ? generateTime() : null;
    ultimaDescarga = Math.random() > 0.3 ? `${generateCurrentMonthDate(Math.floor(Math.random() * 7))} ${generateTime()}` : null;
    cumplimiento = Math.random() > 0.7 ? 'Cumplido' : 'No cumplido'; // More likely to be non-compliant
    cambioRuta = Math.random() > 0.6; // 40% chance of route change
  }
  
  const estado = estadosServicio[Math.floor(Math.random() * estadosServicio.length)];
  
  // Special case for item 10: incomplete times to hide "Cambio Ruta" button
  let finalHoraInicio = horaInicio;
  let finalHoraFinalizacion = horaFinalizacion;
  let finalInicioRealizado = inicioRealizado;
  let finalCierreRealizado = cierreRealizado;
  
  if (index === 9) { // Item 10 (0-based index)
    // Make times incomplete to hide the "Cambio Ruta" button
    finalHoraInicio = generateTime();
    finalHoraFinalizacion = ''; // Missing programmed end time
    finalInicioRealizado = generateTime(); 
    finalCierreRealizado = null; // Missing executed end time
  }

  return {
    id: `inf-${index + 1}`,
    noInforme: `INF-2024-${String(index + 1).padStart(4, '0')}`,
    noSemana: getWeekNumber(fechaServicioDate),
    fechaServicio: generateCurrentMonthDate(Math.floor(Math.random() * 30)),
    idServicio: `SRV-${String(Math.floor(Math.random() * 9999) + 1000)}`,
    transportista: transportistas[Math.floor(Math.random() * transportistas.length)],
    empresaCliente: empresaCliente,
    tipoRuta: tiposRuta[Math.floor(Math.random() * tiposRuta.length)],
    turno: turnos[Math.floor(Math.random() * turnos.length)],
    ramal: ramales[Math.floor(Math.random() * ramales.length)],
    tipoUnidad: tiposUnidad[Math.floor(Math.random() * tiposUnidad.length)],
    placa: generatePlate(),
    sentido: sentidos[Math.floor(Math.random() * sentidos.length)],
    ocupacion,
    porcentajeOcupacion,
    horaInicio: finalHoraInicio,
    horaFinalizacion: finalHoraFinalizacion,
    inicioRealizado: finalInicioRealizado,
    cierreRealizado: finalCierreRealizado,
    ultimaDescarga,
    pasajeros,
    transmitidos,
    faltante,
    estado,
    cumplimiento,
    tarifaPasajero,
    tarifaServicio,
    tarifaServicioTransportista,
    programado: Math.random() > 0.2,
    cambioRuta,
    estadoRevision: estadosRevision[Math.floor(Math.random() * estadosRevision.length)],
  };
});

// Helper functions for filters
export const getUniqueTransportistas = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.transportista))).sort();
};

export const getUniqueEmpresasCliente = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.empresaCliente))).sort();
};

export const getUniqueTiposRuta = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.tipoRuta))).sort();
};

export const getUniqueTurnos = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.turno))).sort();
};

export const getUniqueRamales = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.ramal))).sort();
};

export const getUniqueTiposUnidad = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.tipoUnidad))).sort();
};

export const getUniquePlacas = (): string[] => {
  return Array.from(new Set(mockInformesCumplimiento.map(informe => informe.placa))).sort();
};