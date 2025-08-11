import { mockEmpresasCliente, mockEmpresasTransporte, mockRamalesDetallados } from './mockRastreoData';
import { mockStops } from './mockStops';
import { AlarmaFiltros, AlarmaRecord, TipoAlarma } from '@/types/alarma';

const tiposAlarmaOrden: TipoAlarma[] = [
  'Exceso de velocidad',
  'Detención prolongada',
  'Entrada a geocerca',
  'Salida de geocerca',
  'Botón de pánico',
  'Desvío de ruta',
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function pick<T>(arr: T[], idx: number) {
  return arr[idx % arr.length];
}
function jitterCoord(base: { lat: number; lng: number }, radius = 0.01) {
  return { lat: base.lat + randomBetween(-radius, radius), lng: base.lng + randomBetween(-radius, radius) };
}
function toIsoUtc(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

export function generarAlarmas(fRango: { desdeUtc: string; hastaUtc: string }, cantidad = 240): AlarmaRecord[] {
  const desde = new Date(fRango.desdeUtc);
  const hasta = new Date(fRango.hastaUtc);
  const totalMs = Math.max(1, hasta.getTime() - desde.getTime());

  const rutas = mockRamalesDetallados.filter(r => r.ubicacion.includes('San José') || r.ubicacion.includes('Alajuela'));
  const stops = mockStops.filter(s => s.provincia === 'San José' || s.provincia === 'Alajuela');

  const registros: AlarmaRecord[] = [];
  for (let i = 0; i < cantidad; i++) {
    const tipoAlarma = pick(tiposAlarmaOrden, i);
    const empresaT = pick(mockEmpresasTransporte, i);
    const busId = 2000 + (i % 150);
    const placa = `${empresaT.codigo}${(500 + (i % 400)).toString()}`;

    const rutaSel = pick(rutas, i);
    const esParque = rutaSel.tipoRuta === 'parque';
    const empresaCliente = esParque ? null : rutaSel.empresaCliente || pick(mockEmpresasCliente, i).nombre;

    let lat: number | null = null;
    let lng: number | null = null;

    if (tipoAlarma === 'Entrada a geocerca' || tipoAlarma === 'Salida de geocerca') {
      const stop = pick(stops, i);
      const j = jitterCoord({ lat: stop.lat, lng: stop.lng }, 0.004);
      lat = j.lat; lng = j.lng;
    } else if (tipoAlarma === 'Detención prolongada') {
      const stop = pick(stops, i);
      const j = jitterCoord({ lat: stop.lat, lng: stop.lng }, 0.0015);
      lat = j.lat; lng = j.lng;
    } else {
      const base = { lat: 9.9326, lng: -84.0775 };
      const j = jitterCoord(base, 0.02);
      lat = j.lat; lng = j.lng;
    }

    const fechaMs = desde.getTime() + Math.floor(randomBetween(0, totalMs));
    const fechaHoraUtc = toIsoUtc(new Date(fechaMs));

    registros.push({
      fechaHoraUtc,
      tipoAlarma,
      motivo: tipoAlarma === 'Exceso de velocidad' ? 'Velocidad superó el umbral' :
              tipoAlarma === 'Detención prolongada' ? 'Vehículo detenido por más de 10 min' :
              tipoAlarma === 'Botón de pánico' ? 'Botón de pánico activado' :
              tipoAlarma === 'Desvío de ruta' ? 'La unidad se desvió de la ruta asignada' :
              tipoAlarma === 'Entrada a geocerca' ? 'Entrada registrada a geocerca' : 'Salida registrada de geocerca',
      conductorNombre: ['Juan Pérez','María González','Carlos Rodríguez','Ana López','Luis Morales','Carmen Jiménez'][i % 6],
      conductorCodigo: (30000 + (i % 6000)).toString(),
      placa,
      busId,
      ruta: esParque ? null : rutaSel.nombre,
      empresaTransporte: empresaT.nombre,
      empresaCliente: esParque ? null : empresaCliente,
      lat,
      lng,
    });
  }

  registros.sort((a, b) => new Date(b.fechaHoraUtc).getTime() - new Date(a.fechaHoraUtc).getTime());
  return registros;
}

export function filtrarAlarmas(data: AlarmaRecord[], f: AlarmaFiltros): AlarmaRecord[] {
  return data.filter(r => {
    const t = new Date(r.fechaHoraUtc).getTime();
    const desde = new Date(f.desdeUtc).getTime();
    const hasta = new Date(f.hastaUtc).getTime();
    if (t < desde || t > hasta) return false;

    if (f.tiposAlarma.length && !f.tiposAlarma.includes(r.tipoAlarma)) return false;
    if (f.conductorNombre && !r.conductorNombre.toLowerCase().includes(f.conductorNombre.toLowerCase())) return false;
    if (f.conductorCodigo && r.conductorCodigo !== f.conductorCodigo) return false;
    if (f.placa && !r.placa.toLowerCase().includes(f.placa.toLowerCase())) return false;
    if (f.busId && r.busId.toString() !== f.busId) return false;
    if (f.ruta && (r.ruta || '') !== f.ruta) return false;
    if (f.empresasTransporte.length && !f.empresasTransporte.includes(r.empresaTransporte)) return false;
    if (f.empresasCliente.length && (r.empresaCliente ? !f.empresasCliente.includes(r.empresaCliente) : true)) return false;

    return true;
  });
}
