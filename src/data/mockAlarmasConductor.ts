import { mockEmpresasCliente, mockEmpresasTransporte, mockRamalesDetallados } from './mockRastreoData';
import { AlarmaRecord, AlarmasFiltros, TipoAlarma } from '@/types/alarma-conductor';

const tiposAlarmaOrden: TipoAlarma[] = [
  'Exceso de velocidad',
  'Salida de geocerca',
  'Entrada no autorizada',
  'Parada prolongada',
  'Desvío de ruta',
  'Conductor no autorizado',
  'Puerta abierta en movimiento',
  'Pánico activado',
  'Falla de comunicación',
  'Batería baja'
];

const motivosAlarma = {
  'Exceso de velocidad': [
    'Velocidad detectada: 95 km/h en zona de 60 km/h',
    'Velocidad detectada: 110 km/h en zona de 80 km/h',
    'Velocidad detectada: 75 km/h en zona de 40 km/h'
  ],
  'Salida de geocerca': [
    'Vehículo salió del área autorizada sin permiso',
    'Salida detectada fuera del horario programado',
    'Abandono de geocerca durante servicio activo'
  ],
  'Entrada no autorizada': [
    'Acceso a zona restringida detectado',
    'Entrada fuera del horario permitido',
    'Ingreso sin autorización previa'
  ],
  'Parada prolongada': [
    'Vehículo detenido por más de 15 minutos',
    'Parada extendida sin justificación en ruta',
    'Tiempo de espera excedido en terminal'
  ],
  'Desvío de ruta': [
    'Ruta alterada sin autorización',
    'Desviación significativa detectada',
    'Abandono de itinerario programado'
  ],
  'Conductor no autorizado': [
    'Código de conductor no coincide',
    'Conductor no asignado a este vehículo',
    'Identificación de conductor inválida'
  ],
  'Puerta abierta en movimiento': [
    'Puerta delantera abierta durante marcha',
    'Puerta trasera no cerrada correctamente',
    'Sistema de seguridad de puertas comprometido'
  ],
  'Pánico activado': [
    'Botón de pánico presionado por conductor',
    'Señal de emergencia activada',
    'Alerta de seguridad generada manualmente'
  ],
  'Falla de comunicación': [
    'Pérdida de señal GPS por más de 5 minutos',
    'Fallo en comunicación con central',
    'Interrupción en transmisión de datos'
  ],
  'Batería baja': [
    'Nivel de batería crítico detectado',
    'Sistema de respaldo activado',
    'Alerta de mantenimiento requerido'
  ]
};

// Coordenadas base para dispersión (solo Alajuela y San José)
const seeds = [
  { lat: 10.0162, lng: -84.2117 }, // Alajuela Centro
  { lat: 9.998, lng: -84.204 },   // Aeropuerto
  { lat: 10.0167, lng: -84.1833 }, // Coyol
  { lat: 9.9326, lng: -84.0775 }, // San José Centro
  { lat: 9.9281, lng: -84.0907 }, // La Sabana
  { lat: 9.917, lng: -84.139 },   // Escazú
  { lat: 9.9356, lng: -84.1384 }, // Santa Ana
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[], idx: number) {
  return arr[idx % arr.length];
}

function jitterCoord(base: { lat: number; lng: number }, radius = 0.01) {
  return {
    lat: base.lat + randomBetween(-radius, radius),
    lng: base.lng + randomBetween(-radius, radius),
  };
}

function toIsoUtc(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

export function generarAlarmas(filtrosRango: { desdeUtc: string; hastaUtc: string }, cantidad = 150): AlarmaRecord[] {
  const desde = new Date(filtrosRango.desdeUtc);
  const hasta = new Date(filtrosRango.hastaUtc);
  const totalMs = Math.max(1, hasta.getTime() - desde.getTime());

  const rutas = mockRamalesDetallados.filter(r => r.ubicacion.includes('San José') || r.ubicacion.includes('Alajuela'));
  const alarmas: AlarmaRecord[] = [];

  for (let i = 0; i < cantidad; i++) {
    const tipoAlarma = pick(tiposAlarmaOrden, i);
    const empresaT = pick(mockEmpresasTransporte, i);
    const busId = 1000 + (i % 200);
    const placa = `${empresaT.codigo}${(100 + (i % 900)).toString()}`;

    // Ruta y empresa cliente según tipo de ruta
    const rutaSel = pick(rutas, i);
    const esParque = rutaSel.tipoRuta === 'parque';
    const empresaCliente = esParque ? null : rutaSel.empresaCliente || pick(mockEmpresasCliente, i).nombre;

    // Motivo según tipo de alarma
    const motivosDisponibles = motivosAlarma[tipoAlarma];
    const motivo = pick(motivosDisponibles, i);

    // Coordenadas
    let lat: number | null = null;
    let lng: number | null = null;

    if (i % 10 === 0) {
      // Algunos registros con 0 para validar regla de enlace vacío
      lat = 0; lng = 0;
    } else {
      const seed = pick(seeds, i);
      const jitter = jitterCoord(seed, 0.015);
      lat = jitter.lat; lng = jitter.lng;
    }

    // Fecha aleatoria dentro del rango
    const fechaMs = desde.getTime() + Math.floor(randomBetween(0, totalMs));
    const fechaHoraGeneracion = toIsoUtc(new Date(fechaMs));

    alarmas.push({
      fechaHoraGeneracion,
      tipoAlarma,
      motivo,
      conductorNombre: ['Juan Pérez Rodríguez','María González Jiménez','Carlos Rodríguez Morales','Ana López Vargas','Luis Morales Castro','Carmen Jiménez Solano'][i % 6],
      conductorCodigo: (10000 + (i % 9000)).toString(),
      placa,
      busId,
      ruta: esParque ? null : rutaSel.nombre,
      empresaTransporte: empresaT.nombre,
      empresaCliente,
      lat,
      lng,
    });
  }

  // Ordenar por fecha descendente
  alarmas.sort((a, b) => new Date(b.fechaHoraGeneracion).getTime() - new Date(a.fechaHoraGeneracion).getTime());
  return alarmas;
}

export function filtrarAlarmas(data: AlarmaRecord[], f: AlarmasFiltros): AlarmaRecord[] {
  return data.filter(r => {
    const t = new Date(r.fechaHoraGeneracion).getTime();
    const desde = new Date(f.desdeUtc).getTime();
    const hasta = new Date(f.hastaUtc).getTime();
    if (t < desde || t > hasta) return false;

    if (f.tiposAlarma.length && !f.tiposAlarma.includes(r.tipoAlarma)) return false;
    if (f.conductor && !r.conductorNombre.toLowerCase().includes(f.conductor.toLowerCase())) return false;
    if (f.conductorCodigo && r.conductorCodigo !== f.conductorCodigo) return false;
    if (f.placa && !r.placa.toLowerCase().includes(f.placa.toLowerCase())) return false;
    if (f.busId && r.busId.toString() !== f.busId) return false;
    if (f.ruta && (r.ruta || '') !== f.ruta) return false;
    if (f.empresasTransporte.length && !f.empresasTransporte.includes(r.empresaTransporte)) return false;
    if (f.empresasCliente.length && (r.empresaCliente ? !f.empresasCliente.includes(r.empresaCliente) : true)) return false;

    return true;
  });
}