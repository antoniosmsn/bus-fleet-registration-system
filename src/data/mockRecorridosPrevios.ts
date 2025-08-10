import { RecorridoServicioListItem, RecorridoRangoListItem, RecorridoMapData, TelemetriaPoint, StopInfo, QRCluster, QRReading, ModoConsulta } from '@/types/recorridos-previos';
import { mockEmpresasTransporte } from '@/data/mockEmpresasTransporte';
import { mockEmpresas } from '@/data/mockEmpresas';

// Coordenadas clave
export const COYOL_ZF = { lat: 10.0199, lng: -84.2419 }; // Zona Franca El Coyol (aprox)
const SAN_JOSE = { lat: 9.9281, lng: -84.0907 }; // Catedral
const ALAJUELA = { lat: 10.0163, lng: -84.2116 }; // Parque Central
const CARTAGO = { lat: 9.8644, lng: -83.9194 }; // Basílica

export type TipoRuta = 'Parque' | 'Privada' | 'Especial';

interface BusInfo {
  busId: string;
  placa: string;
  identificador: string;
  empresaTransporte: string;
}

interface ServicioMock {
  item: RecorridoServicioListItem;
  telemetria: TelemetriaPoint[];
  stops: StopInfo[];
  qrReadings: QRReading[];
  qrClusters: QRCluster[];
}

// Utilidades
function toIsoUtc(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function bearing(from: {lat: number; lng: number}, to: {lat: number; lng: number}) {
  const y = Math.sin((to.lng - from.lng) * Math.PI/180) * Math.cos(to.lat * Math.PI/180);
  const x = Math.cos(from.lat * Math.PI/180) * Math.sin(to.lat * Math.PI/180) - Math.sin(from.lat * Math.PI/180) * Math.cos(to.lat * Math.PI/180) * Math.cos((to.lng - from.lng) * Math.PI/180);
  const brng = Math.atan2(y, x) * 180/Math.PI;
  return (brng + 360) % 360;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function generatePolyline(start: {lat:number; lng:number}, end: {lat:number; lng:number}, points: number): {lat:number; lng:number}[] {
  const arr: {lat:number; lng:number}[] = [];
  for (let i = 0; i < points; i++) {
    const t = i/(points-1);
    const lat = lerp(start.lat, end.lat, t) + (Math.random()-0.5)*0.01; // leve variación
    const lng = lerp(start.lng, end.lng, t) + (Math.random()-0.5)*0.01;
    arr.push({ lat, lng });
  }
  return arr;
}

function createStopsAlongPath(poly: {lat:number; lng:number}[], count: number, prefix: string): StopInfo[] {
  const step = Math.max(1, Math.floor(poly.length / count));
  const stops: StopInfo[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.min(poly.length - 1, i * step);
    const id = `${prefix}-${(i+1).toString().padStart(2,'0')}`;
    stops.push({
      id,
      codigo: id,
      nombre: `Parada ${i+1}`,
      lat: poly[idx].lat,
      lng: poly[idx].lng,
    });
  }
  return stops;
}

function clusterReadings(readings: QRReading[], clusterCount = 6): QRCluster[] {
  // Simple agrupación por buckets consecutivos (mock)
  const size = Math.ceil(readings.length / clusterCount);
  const clusters: QRCluster[] = [];
  for (let i = 0; i < clusterCount; i++) {
    const group = readings.slice(i*size, (i+1)*size);
    if (group.length === 0) continue;
    const lat = group.reduce((s,r)=>s+r.lat,0)/group.length;
    const lng = group.reduce((s,r)=>s+r.lng,0)/group.length;
    clusters.push({ lat, lng, count: group.length });
  }
  return clusters;
}

// Catálogos
const empresasTransporte = mockEmpresasTransporte.map(e => e.nombre);
const empresasCliente = mockEmpresas.map(e => e.nombre);
const tiposRuta: TipoRuta[] = ['Parque','Privada','Especial'];

// Buses
const buses: BusInfo[] = Array.from({ length: 200 }).map((_, idx) => {
  const num = (idx + 1).toString().padStart(3, '0');
  return {
    busId: `BUS-${num}`,
    placa: `ABC${num}`,
    identificador: `ID${num}`,
    empresaTransporte: randomChoice(empresasTransporte),
  };
});

// Rutas base
const rutasBase = [
  { nombre:"SJ-Coyol", inicio: SAN_JOSE, fin: COYOL_ZF, provincia: 'San José' },
  { nombre:"Alajuela-Coyol", inicio: ALAJUELA, fin: COYOL_ZF, provincia: 'Alajuela' },
  { nombre:"Coyol-Cartago", inicio: COYOL_ZF, fin: CARTAGO, provincia: 'Cartago' },
];

const serviciosStore = new Map<string, ServicioMock>();

// Generación de 10 servicios por bus
(function generateServiciosPorBus(){
  const now = new Date();
  for (const bus of buses) {
    for (let s = 0; s < 10; s++) {
      const ruta = randomChoice(rutasBase);
      // Asegurar que inician o terminan en Coyol
      const startAtCoyol = Math.random() < 0.5;
      const start = startAtCoyol ? COYOL_ZF : ruta.inicio;
      const end = startAtCoyol ? ruta.fin : COYOL_ZF;
      const poly = generatePolyline(start, end, randomInt(80, 140));
      const inicio = new Date(now.getTime() - randomInt(1, 7) * 24 * 3600 * 1000 - randomInt(0, 23) * 3600 * 1000 - randomInt(0, 59) * 60 * 1000);
      const durMin = randomInt(40, 120);
      const fin = new Date(inicio.getTime() + durMin * 60 * 1000);

      const telemetria: TelemetriaPoint[] = poly.map((p, i) => {
        const t = new Date(inicio.getTime() + (i / (poly.length - 1)) * (fin.getTime() - inicio.getTime()));
        const brng = i < poly.length - 1 ? bearing(p, poly[i+1]) : bearing(poly[i-1], p);
        return {
          lat: p.lat,
          lng: p.lng,
          speedKmH: randomInt(20, 100),
          course: brng,
          timestampUtc: toIsoUtc(t),
        };
      });

      const stops = createStopsAlongPath(poly, 10, `${ruta.nombre}-${bus.busId}`);
      // Marcar algunas visitadas con llegada
      for (const st of stops) {
        if (Math.random() < 0.7) {
          const tp = telemetria[randomInt(0, telemetria.length - 1)];
          st.visitada = true;
          st.llegadaUtc = tp.timestampUtc;
        }
      }

      // Lecturas QR ~30 con paradaNombre
      const qrReadings: QRReading[] = Array.from({ length: 30 + randomInt(0, 30) }).map(() => {
        const tp = telemetria[randomInt(0, telemetria.length - 1)];
        const cedula = String(randomInt(100000000, 999999999));
        const paradaNombre = randomChoice(stops).nombre;
        return { cedula, lat: tp.lat + (Math.random()-0.5)*0.0008, lng: tp.lng + (Math.random()-0.5)*0.0008, timestampUtc: tp.timestampUtc, paradaNombre };
      });
      const qrClusters = clusterReadings(qrReadings);

      const tipoRuta = randomChoice(tiposRuta);
      const empCliente = tipoRuta === 'Parque' ? null : randomChoice(empresasCliente);
      const conductorCodigo = `C${randomInt(1000, 9999)}`;
      const conductorNombre = `Conductor ${randomInt(1, 300)}`;

      const id = `${bus.busId}-${inicio.getTime()}`;
      const item: RecorridoServicioListItem = {
        id,
        busId: bus.busId,
        identificador: bus.identificador,
        placa: bus.placa,
        conductorCodigo,
        conductorNombre,
        ruta: ruta.nombre,
        tipoRuta: tipoRuta,
        empresaCliente: empCliente,
        empresaTransporte: bus.empresaTransporte,
        inicioUtc: toIsoUtc(inicio),
        finUtc: toIsoUtc(fin),
      };

      serviciosStore.set(id, { item, telemetria, stops, qrReadings, qrClusters });
    }
  }
})();

export interface FiltrosBase {
  modo: ModoConsulta;
  desdeUtc: string; // ISO UTC
  hastaUtc: string; // ISO UTC
  numeroServicio?: string; // exacto, solo modo servicios
  vehiculos?: string[]; // identificador-placa o busId
  empresasTransporte?: string[]; // incluye 'todos'
  empresasCliente?: string[];
  tiposRuta?: TipoRuta[]; // incluye 'todos'
}

export function queryServicios(f: FiltrosBase): RecorridoServicioListItem[] {
  const desde = new Date(f.desdeUtc);
  const hasta = new Date(f.hastaUtc);
  let items = Array.from(serviciosStore.values()).map(v => v.item);

  // Por servicios: inicio dentro del rango (sin importar fin)
  items = items.filter(it => {
    const inicio = new Date(it.inicioUtc);
    return inicio >= desde && inicio <= hasta;
  });

  if (f.numeroServicio) {
    items = items.filter(it => it.id.endsWith(f.numeroServicio as string) || it.id === f.numeroServicio);
  }

  if (f.vehiculos && f.vehiculos.length && !f.vehiculos.includes('todos')) {
    const needle = new Set(f.vehiculos);
    items = items.filter(it => needle.has(it.busId) || needle.has(it.identificador) || needle.has(it.placa));
  }

  if (f.empresasTransporte && !f.empresasTransporte.includes('todos')) {
    const set = new Set(f.empresasTransporte);
    items = items.filter(it => set.has(it.empresaTransporte));
  }

  if (f.empresasCliente && !f.empresasCliente.includes('todos')) {
    const set = new Set(f.empresasCliente);
    items = items.filter(it => it.empresaCliente && set.has(it.empresaCliente));
  }

  if (f.tiposRuta && !f.tiposRuta.includes('todos' as any)) {
    const set = new Set(f.tiposRuta as TipoRuta[]);
    items = items.filter(it => set.has(it.tipoRuta));
  }

  // Agrupar por bus y ordenar inicio asc
  items.sort((a,b) => a.identificador.localeCompare(b.identificador) || new Date(a.inicioUtc).getTime() - new Date(b.inicioUtc).getTime());
  return items;
}

export function getMapDataForServicio(id: string): RecorridoMapData | null {
  const svc = serviciosStore.get(id);
  if (!svc) return null;
  return {
    modo: 'servicios',
    telemetria: svc.telemetria,
    stops: svc.stops,
    qrClusters: svc.qrClusters,
    qrReadings: svc.qrReadings,
  };
}

export function queryRango(f: FiltrosBase): RecorridoRangoListItem[] {
  const desde = new Date(f.desdeUtc);
  const hasta = new Date(f.hastaUtc);

  // Filtrar servicios que intersectan el rango y luego consolidar por bus
  const items = Array.from(serviciosStore.values()).map(v => v.item);
  const intersect = items.filter(it => {
    const ini = new Date(it.inicioUtc);
    const fin = new Date(it.finUtc);
    return fin >= desde && ini <= hasta; // intersección
  });

  let filtered = intersect;

  if (f.vehiculos && f.vehiculos.length && !f.vehiculos.includes('todos')) {
    const needle = new Set(f.vehiculos);
    filtered = filtered.filter(it => needle.has(it.busId) || needle.has(it.identificador) || needle.has(it.placa));
  }
  if (f.empresasTransporte && !f.empresasTransporte.includes('todos')) {
    const set = new Set(f.empresasTransporte);
    filtered = filtered.filter(it => set.has(it.empresaTransporte));
  }
  if (f.empresasCliente && !f.empresasCliente.includes('todos')) {
    const set = new Set(f.empresasCliente);
    filtered = filtered.filter(it => it.empresaCliente && set.has(it.empresaCliente));
  }
  if (f.tiposRuta && !f.tiposRuta.includes('todos' as any)) {
    const set = new Set(f.tiposRuta as TipoRuta[]);
    filtered = filtered.filter(it => set.has(it.tipoRuta));
  }

  const byBus = new Map<string, RecorridoRangoListItem>();
  for (const it of filtered) {
    const key = it.busId;
    if (!byBus.has(key)) {
      byBus.set(key, {
        busId: it.busId,
        identificador: it.identificador,
        placa: it.placa,
        empresaTransporte: it.empresaTransporte,
        inicioFiltroUtc: f.desdeUtc,
        finFiltroUtc: f.hastaUtc,
      });
    }
  }

  const result = Array.from(byBus.values());
  result.sort((a,b) => a.identificador.localeCompare(b.identificador));
  return result;
}

export function getMapDataForRango(busId: string, desdeUtc: string, hastaUtc: string): RecorridoMapData | null {
  const desde = new Date(desdeUtc);
  const hasta = new Date(hastaUtc);
  // Unir telemetrías de servicios del bus dentro del rango
  const servicios = Array.from(serviciosStore.values()).filter(v => v.item.busId === busId);
  const points: TelemetriaPoint[] = [];
  for (const s of servicios) {
    const ini = new Date(s.item.inicioUtc);
    const fin = new Date(s.item.finUtc);
    if (fin >= desde && ini <= hasta) {
      points.push(...s.telemetria.filter(p => {
        const t = new Date(p.timestampUtc);
        return t >= desde && t <= hasta;
      }));
    }
  }
  points.sort((a,b) => new Date(a.timestampUtc).getTime() - new Date(b.timestampUtc).getTime());

  if (points.length === 0) return {
    modo: 'rango',
    telemetria: [],
    stops: [],
    qrClusters: [],
    qrReadings: [],
  };

  // Paradas en modo rango: todas las paradas potenciales en zona (mock: tomar 12 puntos espaciados)
  const step = Math.max(1, Math.floor(points.length / 12));
  const stops: StopInfo[] = points.filter((_,i) => i % step === 0).slice(0,12).map((p, idx) => ({
    id: `RANGO-${busId}-${idx+1}`,
    codigo: `RG-${idx+1}`,
    nombre: `Parada Rango ${idx+1}`,
    lat: p.lat,
    lng: p.lng,
  }));

  // Lecturas QR individuales aleatorias en el rango con paradaNombre
  const qrReadings: QRReading[] = Array.from({ length: 40 }).map((_,i) => {
    const tp = points[randomInt(0, points.length-1)];
    const cedula = String(randomInt(100000000, 999999999));
    const paradaNombre = randomChoice(stops).nombre;
    return { cedula, lat: tp.lat + (Math.random()-0.5)*0.0008, lng: tp.lng + (Math.random()-0.5)*0.0008, timestampUtc: tp.timestampUtc, paradaNombre };
  });
  const qrClusters = clusterReadings(qrReadings);

  return {
    modo: 'rango',
    telemetria: points,
    stops,
    qrClusters,
    qrReadings,
  };
}
