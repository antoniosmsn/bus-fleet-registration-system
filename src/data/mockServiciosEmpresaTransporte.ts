import { ServicioEmpresaTransporte, EstadoSolicitudCambio, SentidoServicio } from '../types/servicio-empresa-transporte';
import { mockEmpresas } from './mockEmpresas';
import { mockTransportistas } from './mockTransportistas';
import { mockRamales } from './mockRamales';

// Helper to generate dates for current month
const generateCurrentMonthDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('es-CR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

// Helper to generate time
const generateTime = (): string => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper to generate service times
const generateServiceTimes = () => {
  const start = new Date();
  start.setHours(Math.floor(Math.random() * 18) + 5, Math.floor(Math.random() * 60)); // 5-22 hours
  
  const end = new Date(start);
  end.setHours(start.getHours() + Math.floor(Math.random() * 3) + 1); // +1 to +3 hours
  
  return {
    horaSalida: start.toTimeString().slice(0, 5),
    horaLlegada: end.toTimeString().slice(0, 5)
  };
};

// Generate plate numbers in Costa Rican format
const generatePlate = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}-${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
};

const tiposRuta = ['Urbano', 'Interurbano', 'Regional', 'Especial'];
const sectores = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste', 'Metropolitano'];
const sentidos: SentidoServicio[] = ['Ingreso', 'Salida'];
const estadosSolicitud: EstadoSolicitudCambio[] = ['Sin solicitud', 'Pendiente', 'Aprobado', 'Rechazado'];

export const mockServiciosEmpresaTransporte: ServicioEmpresaTransporte[] = Array.from({ length: 35 }, (_, index) => {
  const transportista = mockTransportistas[Math.floor(Math.random() * mockTransportistas.length)];
  const empresa = mockEmpresas[Math.floor(Math.random() * mockEmpresas.length)];
  const ramal = mockRamales[Math.floor(Math.random() * mockRamales.length)];
  const ocupacionMax = Math.floor(Math.random() * 40) + 20; // 20-60 pasajeros max
  const ocupacionActual = Math.floor(Math.random() * ocupacionMax);
  const porcentajeOcupacion = Math.round((ocupacionActual / ocupacionMax) * 100);
  const ingresos = ocupacionActual * (Math.random() * 500 + 200); // 200-700 per passenger
  const exceso = porcentajeOcupacion > 100 ? ocupacionActual - ocupacionMax : 0;
  const serviceTimes = generateServiceTimes();
  
  // Most services today, some from current month
  const daysAgo = index < 20 ? 0 : Math.floor(Math.random() * 25);
  
  return {
    id: `serv-${index + 1}`,
    tipoRuta: tiposRuta[Math.floor(Math.random() * tiposRuta.length)],
    transportista: transportista.nombre,
    sector: sectores[Math.floor(Math.random() * sectores.length)],
    ramal: ramal.nombre,
    fechaServicio: generateCurrentMonthDate(daysAgo),
    horaServicio: generateTime(),
    cliente: empresa.nombre,
    placaAutobus: generatePlate(),
    sentido: sentidos[Math.floor(Math.random() * sentidos.length)],
    horaSalida: serviceTimes.horaSalida,
    horaLlegada: serviceTimes.horaLlegada,
    ocupacion: ocupacionActual,
    porcentajeOcupacion: porcentajeOcupacion,
    ingresos: Math.round(ingresos),
    exceso: exceso,
    estadoSolicitudCambio: estadosSolicitud[Math.floor(Math.random() * estadosSolicitud.length)],
    empresaTransporteId: transportista.id,
    empresaClienteId: empresa.id.toString(),
    ramalId: ramal.id,
  };
});

export const getServicioEmpresaById = (id: string): ServicioEmpresaTransporte | null => {
  return mockServiciosEmpresaTransporte.find(servicio => servicio.id === id) || null;
};