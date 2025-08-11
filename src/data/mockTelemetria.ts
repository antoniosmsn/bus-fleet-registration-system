import { mockEmpresasCliente, mockEmpresasTransporte, mockRamalesDetallados } from './mockRastreoData';
import { mockStops } from './mockStops';
import { TelemetriaFiltros, TelemetriaRecord, TipoRegistro } from '@/types/telemetria';

// Geocercas representativas en Alajuela y San José con coordenadas aproximadas
const geocercas = [
  { nombre: 'ZF Coyol', lat: 10.0167, lng: -84.1833 },
  { nombre: 'Aeropuerto SJO', lat: 9.998, lng: -84.204 },
  { nombre: 'La Sabana', lat: 9.932, lng: -84.101 },
  { nombre: 'San José Centro', lat: 9.9326, lng: -84.0775 },
  { nombre: 'Escazú Centro', lat: 9.917, lng: -84.139 },
  { nombre: 'Santa Ana Centro', lat: 9.9356, lng: -84.1384 },
  { nombre: 'Alajuela Centro', lat: 10.0162, lng: -84.2117 },
  { nombre: 'Belén', lat: 9.9497, lng: -84.1478 },
];

const tiposRegistroOrden: TipoRegistro[] = [
  'Entrada a ruta',
  'Salida de ruta',
  'Paso por parada',
  'Exceso de velocidad',
  'Grabación por tiempo',
  'Grabación por curso',
];

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

export function generarTelemetria(filtrosRango: { desdeUtc: string; hastaUtc: string }, cantidad = 320): TelemetriaRecord[] {
  // Ensurar siempre datos en el rango solicitado generando en ese intervalo
  const desde = new Date(filtrosRango.desdeUtc);
  const hasta = new Date(filtrosRango.hastaUtc);
  const totalMs = Math.max(1, hasta.getTime() - desde.getTime());

  const stopsSJYAlajuela = mockStops.filter(s => s.provincia === 'San José' || s.provincia === 'Alajuela');
  const rutas = mockRamalesDetallados.filter(r => r.ubicacion.includes('San José') || r.ubicacion.includes('Alajuela'));

  const registros: TelemetriaRecord[] = [];

  for (let i = 0; i < cantidad; i++) {
    const tipoRegistro = pick(tiposRegistroOrden, i);

    const empresaT = pick(mockEmpresasTransporte, i);
    const busId = 1000 + (i % 200);
    const placa = `${empresaT.codigo}${(100 + (i % 900)).toString()}`;

    // Capacidad por bus
    const capacidad = [25, 30, 35, 40, 45, 50][i % 6];

    // Ruta y empresa cliente según tipo de ruta
    const rutaSel = pick(rutas, i);
    const esParque = rutaSel.tipoRuta === 'parque';
    const empresaCliente = esParque ? null : rutaSel.empresaCliente || pick(mockEmpresasCliente, i).nombre;

    // Sentido para algunos tipos
    const sentido = (tipoRegistro === 'Entrada a ruta' || tipoRegistro === 'Salida de ruta' || tipoRegistro === 'Paso por parada')
      ? (i % 2 === 0 ? 'Ingreso' : 'Salida')
      : null;

    // En servicio o no
    const enServicio = !(tipoRegistro === 'Grabación por tiempo' || tipoRegistro === 'Grabación por curso') || (i % 3 === 0);

    // Coordenadas y ubicaciones
    let lat: number | null = null;
    let lng: number | null = null;
    let parada: string | null = null;
    let geocerca: string | null = null;

    if (tipoRegistro === 'Paso por parada') {
      const stop = pick(stopsSJYAlajuela, i);
      const jitter = jitterCoord({ lat: stop.lat, lng: stop.lng }, 0.0015);
      lat = jitter.lat; lng = jitter.lng;
      parada = stop.nombre;
    } else if (i % 4 === 0) {
      const geo = pick(geocercas, i);
      const jitter = jitterCoord({ lat: geo.lat, lng: geo.lng }, 0.002);
      lat = jitter.lat; lng = jitter.lng;
      geocerca = geo.nombre;
    } else if (i % 10 === 0) {
      // Algunos registros con 0 para validar regla de enlace vacío
      lat = 0; lng = 0;
    } else {
      const seed = pick(seeds, i);
      const jitter = jitterCoord(seed, 0.01);
      lat = jitter.lat; lng = jitter.lng;
    }

    // Velocidad
    const velocidadKmH = tipoRegistro === 'Exceso de velocidad' ? Math.floor(randomBetween(95, 125)) : Math.floor(randomBetween(0, 85));

    // Pasajeros y espacios
    const pasajeros = enServicio ? Math.floor(randomBetween(0, capacidad + 1)) : 0;
    const espaciosDisponibles = enServicio ? Math.max(0, capacidad - pasajeros) : 0;

    // Fecha aleatoria dentro del rango
    const fechaMs = desde.getTime() + Math.floor(randomBetween(0, totalMs));
    const fechaHoraUtc = toIsoUtc(new Date(fechaMs));

    registros.push({
      fechaHoraUtc,
      placa,
      busId,
      tipoRegistro,
      parada: parada || null,
      velocidadKmH,
      pasajeros,
      espaciosDisponibles,
      ruta: enServicio ? rutaSel.nombre : null,
      sentido: enServicio ? (sentido as any) : null,
      conductorCodigo: (10000 + (i % 9000)).toString(),
      conductorNombre: ['Juan Pérez','María González','Carlos Rodríguez','Ana López','Luis Morales','Carmen Jiménez'][i % 6],
      empresaTransporte: empresaT.nombre,
      empresaCliente: enServicio ? (esParque ? null : empresaCliente) : null,
      geocerca: geocerca || null,
      direccion: Math.floor(randomBetween(0, 360)),
      lat,
      lng,
    });
  }

  // Ordenar por fecha descendente
  registros.sort((a, b) => new Date(b.fechaHoraUtc).getTime() - new Date(a.fechaHoraUtc).getTime());
  return registros;
}

export function filtrarTelemetria(data: TelemetriaRecord[], f: TelemetriaFiltros): TelemetriaRecord[] {
  return data.filter(r => {
    const t = new Date(r.fechaHoraUtc).getTime();
    const desde = new Date(f.desdeUtc).getTime();
    const hasta = new Date(f.hastaUtc).getTime();
    if (t < desde || t > hasta) return false;

    if (f.tiposRegistro.length && !f.tiposRegistro.includes(r.tipoRegistro)) return false;
    if (f.ruta && (r.ruta || '') !== f.ruta) return false;
    if (f.placa && !r.placa.toLowerCase().includes(f.placa.toLowerCase())) return false;
    if (f.busId && r.busId.toString() !== f.busId) return false;
    if (f.conductorCodigo && r.conductorCodigo !== f.conductorCodigo) return false;
    if (f.conductorNombre && !r.conductorNombre.toLowerCase().includes(f.conductorNombre.toLowerCase())) return false;
    if (f.empresasTransporte.length && !f.empresasTransporte.includes(r.empresaTransporte)) return false;
    if (f.empresasCliente.length && (r.empresaCliente ? !f.empresasCliente.includes(r.empresaCliente) : true)) return false;

    return true;
  });
}
