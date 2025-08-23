import { BitacoraCambioRuta, PasajeroAfectado } from '@/types/bitacora-cambio-ruta';

// Helper function to get dynamic dates
const getRandomDateInRange = (daysBack: number, daysForward: number = 0) => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * (daysBack + daysForward + 1)) - daysBack;
  const date = new Date(today);
  date.setDate(today.getDate() + randomDays);
  return date.toISOString().split('T')[0];
};

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getSpecificDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Mock data for rutas
const mockRutas = [
  { id: '1', nombre: 'Ruta Aeropuerto - Centro' },
  { id: '2', nombre: 'Ruta Norte Industrial' },
  { id: '3', nombre: 'Ruta Sur Comercial' },
  { id: '4', nombre: 'Ruta Este Residencial' },
  { id: '5', nombre: 'Ruta Oeste Universitaria' },
  { id: '6', nombre: 'Ruta Zona Franca Principal' },
  { id: '7', nombre: 'Ruta Zona Franca Secundaria' },
];

// Mock data for usuarios
const mockUsuarios = [
  { id: '1', nombreCompleto: 'Ana García Rodríguez', username: 'agarcia' },
  { id: '2', nombreCompleto: 'Carlos Mendoza López', username: 'cmendoza' },
  { id: '3', nombreCompleto: 'María Fernández Castro', username: 'mfernandez' },
  { id: '4', nombreCompleto: 'José Luis Herrera', username: 'jherrera' },
  { id: '5', nombreCompleto: 'Carmen Soto Jiménez', username: 'csoto' },
];

// Mock data for empresas
const mockEmpresas = [
  { id: '1', nombre: 'Transportes El Coyol S.A.' },
  { id: '2', nombre: 'Autobuses Unidos Ltda.' },
  { id: '3', nombre: 'Servicios Rápidos Express' },
  { id: '4', nombre: 'Transporte Seguro Nacional' },
];

// Mock data for autobuses
const mockAutobuses = [
  { id: '1', numero: 'BUS-001', placa: 'TAX-1234' },
  { id: '2', numero: 'BUS-002', placa: 'TAX-5678' },
  { id: '3', numero: 'BUS-003', placa: 'TAX-9012' },
  { id: '4', numero: 'BUS-004', placa: 'TAX-3456' },
  { id: '5', numero: 'BUS-005', placa: 'TAX-7890' },
];

const tiposPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Vale de Combustible'];
const empresasClientes = ['Zona Franca El Coyol', 'Parque Industrial Norte', 'Centro Comercial Sur', 'Universidad Nacional'];
const motivos = [
  'Solicitud del cliente por cambio de horario',
  'Optimización de rutas por tráfico',
  'Mantenimiento de vía principal',
  'Evento especial en zona franca'
];

export const mockBitacoraCambiosRutas: BitacoraCambioRuta[] = Array.from({ length: 50 }, (_, index) => {
  const rutaOriginal = mockRutas[Math.floor(Math.random() * mockRutas.length)];
  let rutaFinal = mockRutas[Math.floor(Math.random() * mockRutas.length)];
  // Ensure different routes
  while (rutaFinal.id === rutaOriginal.id) {
    rutaFinal = mockRutas[Math.floor(Math.random() * mockRutas.length)];
  }
  
  const usuario = mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)];
  const empresa = mockEmpresas[Math.floor(Math.random() * mockEmpresas.length)];
  const autobus = mockAutobuses[Math.floor(Math.random() * mockAutobuses.length)];
  const estado: 'Aceptada' | 'Rechazada' = Math.random() > 0.3 ? 'Aceptada' : 'Rechazada';
  const cantidadPasajeros = Math.floor(Math.random() * 25);
  const montoOriginal = Math.floor(Math.random() * 50000) + 10000;
  const montoFinal = Math.floor(Math.random() * 50000) + 10000;
  
  // Para los primeros 15 registros, usar fechas del día actual para que siempre aparezcan datos
  let fechaCambio, fechaServicio;
  if (index < 15) {
    fechaCambio = getTodayDate();
    fechaServicio = index < 8 ? getTodayDate() : getSpecificDate(Math.floor(Math.random() * 5) + 1);
  } else {
    // Para el resto, usar fechas aleatorias para filtros
    fechaCambio = getRandomDateInRange(30, 5);
    fechaServicio = getRandomDateInRange(15, 10);
  }
  
  return {
    id: `BCR-${(index + 1).toString().padStart(3, '0')}`,
    rutaOriginal,
    rutaFinal,
    numeroServicioOriginal: `SRV-${Math.floor(Math.random() * 9000) + 1000}`,
    numeroServicioFinal: `SRV-${Math.floor(Math.random() * 9000) + 1000}`,
    usuario,
    fechaCambio,
    fechaServicio,
    cantidadPasajerosAfectados: cantidadPasajeros,
    montoOriginal,
    montoFinal,
    estado,
    motivoRechazo: estado === 'Rechazada' ? motivos[Math.floor(Math.random() * motivos.length)] : undefined,
    empresaTransporte: empresa,
    autobus,
  };
});

export const mockPasajerosAfectados: Record<string, PasajeroAfectado[]> = {};

// Generate passengers for entries that have affected passengers
mockBitacoraCambiosRutas.forEach(bitacora => {
  if (bitacora.cantidadPasajerosAfectados > 0) {
    mockPasajerosAfectados[bitacora.id] = Array.from({ length: bitacora.cantidadPasajerosAfectados }, (_, index) => ({
      id: `${bitacora.id}-P${index + 1}`,
      nombre: `Pasajero ${index + 1} ${['García', 'López', 'Rodríguez', 'Martínez', 'Hernández'][index % 5]}`,
      cedula: `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      tipoPago: tiposPago[Math.floor(Math.random() * tiposPago.length)],
      fechaServicio: bitacora.fechaServicio,
      horaServicio: getRandomTime(),
      empresaTransporte: bitacora.empresaTransporte.nombre,
      empresaCliente: empresasClientes[Math.floor(Math.random() * empresasClientes.length)],
      autobus: `${bitacora.autobus.numero} (${bitacora.autobus.placa})`,
      montoOriginal: Math.floor(Math.random() * 5000) + 1000,
      montoFinal: Math.floor(Math.random() * 5000) + 1000,
    }));
  }
});