import { DetallePasajeroMovimiento, SentidoServicio } from '../types/servicio-empresa-transporte';

const nombres = [
  'María González', 'Carlos Rodríguez', 'Ana Herrera', 'Luis Mora', 'Carmen Vargas',
  'José Jiménez', 'Patricia Solano', 'Roberto Castro', 'Isabel Rojas', 'Fernando Quesada',
  'Silvia Montero', 'Diego Araya', 'Lucía Campos', 'Andrés Villalobos', 'Sofía Ramírez'
];

const tiposPago = ['Efectivo', 'Tarjeta', 'Monedero Electrónico', 'Transferencia'];
const tiposPlanilla = ['Mensual', 'Quincenal', 'Semanal', 'Por Horas'];

// Generate cedula in Costa Rican format (1-XXXX-XXXX)
const generateCedula = (): string => {
  const num1 = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const num2 = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `1-${num1}-${num2}`;
};

// Generate employee number
const generateEmployeeNumber = (): string => {
  return `EMP-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`;
};

// Generate current day transactions
const generateCurrentDateTime = (): { fecha: string, hora: string } => {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-CR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  // Random time during business hours
  const hour = Math.floor(Math.random() * 12) + 6; // 6-17 hours
  const minute = Math.floor(Math.random() * 60);
  const hora = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  return { fecha, hora };
};

// Generate coordinates for Costa Rica (rough boundaries)
const generateCostaRicaCoordinates = (): { latitud: number, longitud: number } => {
  const latitud = 8.0 + Math.random() * 3.5; // 8.0 to 11.5
  const longitud = -85.5 + Math.random() * 2.0; // -85.5 to -83.5
  return { 
    latitud: parseFloat(latitud.toFixed(6)), 
    longitud: parseFloat(longitud.toFixed(6))
  };
};

const paradas = [
  'Terminal Central', 'Parada Hospital', 'Universidad Nacional', 'Centro Comercial',
  'Estadio Nacional', 'Mercado Central', 'Iglesia Central', 'Escuela República',
  'Clínica CCSS', 'Banco Nacional', 'Municipalidad', 'Correos de Costa Rica'
];

// Generate 5-15 passenger movements per service
export const generateDetallePasajerosForService = (servicioId: string, servicioData: any): DetallePasajeroMovimiento[] => {
  const numPasajeros = Math.floor(Math.random() * 11) + 5; // 5-15 passengers
  
  return Array.from({ length: numPasajeros }, (_, index) => {
    const dateTime = generateCurrentDateTime();
    const coordinates = generateCostaRicaCoordinates();
    const monto = Math.random() * 800 + 200; // 200-1000 colones
    const subsidio = Math.random() * 200; // 0-200 colones subsidy
    
    return {
      id: `mov-${servicioId}-${index + 1}`,
      servicioId,
      nombrePasajero: nombres[Math.floor(Math.random() * nombres.length)],
      cedula: generateCedula(),
      tipoPago: tiposPago[Math.floor(Math.random() * tiposPago.length)],
      fechaTransaccion: dateTime.fecha,
      horaTransaccion: dateTime.hora,
      empresaTransporte: servicioData.transportista,
      placaAutobus: servicioData.placaAutobus,
      sector: servicioData.sector,
      ramal: servicioData.ramal,
      monto: Math.round(monto),
      empresaCliente: servicioData.cliente,
      subsidio: Math.round(subsidio),
      viajeAdicional: Math.random() < 0.2, // 20% chance of additional trip
      numeroEmpleado: generateEmployeeNumber(),
      tipoPlanilla: tiposPlanilla[Math.floor(Math.random() * tiposPlanilla.length)],
      sentido: servicioData.sentido as SentidoServicio,
      parada: paradas[Math.floor(Math.random() * paradas.length)],
      latitud: coordinates.latitud,
      longitud: coordinates.longitud,
    };
  });
};

// Pre-generate some mock data
export const mockDetallePasajerosMovimientos: DetallePasajeroMovimiento[] = [];

// This will be populated when getDetallePasajerosForService is called
export const getDetallePasajerosForService = (servicioId: string, servicioData: any): DetallePasajeroMovimiento[] => {
  // Check if we already have data for this service
  const existingData = mockDetallePasajerosMovimientos.filter(mov => mov.servicioId === servicioId);
  
  if (existingData.length > 0) {
    return existingData;
  }
  
  // Generate new data
  const newData = generateDetallePasajerosForService(servicioId, servicioData);
  mockDetallePasajerosMovimientos.push(...newData);
  
  return newData;
};