import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { TelemetriaRecord, TelemetriaFiltros, TipoRegistro, RolSimulado } from '@/types/telemetria';
import { generarTelemetria, filtrarTelemetria } from '@/data/mockTelemetria';
import { mockEmpresasTransporte, mockRamalesDetallados, mockEmpresasCliente } from '@/data/mockRastreoData';
import { cn } from '@/lib/utils';
import { exportTelemetriaToExcel, exportTelemetriaToPDF } from '@/services/exportService';
import { Checkbox } from '@/components/ui/checkbox';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MultiSelect } from '@/components/ui/multi-select';

// Helpers
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};
const endOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
};
const toIsoUtc = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
const tiposRegistro: TipoRegistro[] = ['Entrada a ruta', 'Salida de ruta', 'Paso por parada', 'Exceso de velocidad', 'Grabación por tiempo', 'Grabación por curso'];
const pageSizeOptions = [10, 25, 50];

// Selección y mapa
const recKey = (r: TelemetriaRecord) => [r.fechaHoraUtc, r.placa, r.busId, r.tipoRegistro, r.lat ?? 'n', r.lng ?? 'n'].join('|');
const tipoIconCfg: Record<TipoRegistro, {
  label: string;
  cls: string;
}> = {
  'Entrada a ruta': {
    label: 'Entrada',
    cls: 'bg-primary text-primary-foreground'
  },
  'Salida de ruta': {
    label: 'Salida',
    cls: 'bg-secondary text-secondary-foreground'
  },
  'Paso por parada': {
    label: 'Parada',
    cls: 'bg-accent text-accent-foreground'
  },
  'Exceso de velocidad': {
    label: 'Velocidad',
    cls: 'bg-destructive text-destructive-foreground'
  },
  'Grabación por tiempo': {
    label: 'Tiempo',
    cls: 'bg-muted text-foreground'
  },
  'Grabación por curso': {
    label: 'Curso',
    cls: 'bg-ring text-primary-foreground'
  }
};
const buildDivIcon = (tipo: TipoRegistro) => {
  const cfg = tipoIconCfg[tipo];
  return L.divIcon({
    className: '',
    html: `<div class="rounded px-2 py-1 text-[10px] font-medium shadow ${cfg.cls}">${cfg.label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};
const FitBounds: React.FC<{
  points: Array<{
    lat: number;
    lng: number;
  }>;
}> = ({
  points
}) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [map, JSON.stringify(points)]);
  return null;
};
const DateRangePicker: React.FC<{
  value: {
    from: Date;
    to: Date;
  };
  onChange: (v: {
    from: Date;
    to: Date;
  }) => void;
}> = ({
  value,
  onChange
}) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  return <div className="grid grid-cols-2 gap-2">
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(value.from, 'Pp', {
            locale: es
          })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-50 p-0 bg-popover">
          <Calendar mode="single" selected={value.from} onSelect={d => d && onChange({
          from: d,
          to: value.to
        })} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(value.to, 'Pp', {
            locale: es
          })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-50 p-0 bg-popover">
          <Calendar mode="single" selected={value.to} onSelect={d => d && onChange({
          from: value.from,
          to: d
        })} initialFocus />
        </PopoverContent>
      </Popover>
    </div>;
};
const RolSelector: React.FC<{
  rol: RolSimulado;
  onChange: (r: RolSimulado) => void;
}> = ({
  rol,
  onChange
}) => <Select value={rol} onValueChange={v => onChange(v as RolSimulado)}>
    <SelectTrigger>
      <SelectValue placeholder="Rol" />
    </SelectTrigger>
    <SelectContent className="z-50 bg-popover">
      <SelectItem value="Administrador">Administrador</SelectItem>
      <SelectItem value="Empresa de transporte">Empresa de transporte</SelectItem>
      <SelectItem value="Empresa cliente">Empresa cliente</SelectItem>
    </SelectContent>
  </Select>;
const TelemetriaListado: React.FC = () => {
  useEffect(() => {
    document.title = 'Listado de telemetría | SistemaTransporte';
  }, []);
  const [rol, setRol] = useState<RolSimulado>('Administrador');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfToday(),
    to: endOfToday()
  });
  const [filtros, setFiltros] = useState<TelemetriaFiltros>({
    desdeUtc: toIsoUtc(startOfToday()),
    hastaUtc: toIsoUtc(endOfToday()),
    tiposRegistro: [],
    ruta: '',
    placa: '',
    busId: '',
    conductorCodigo: '',
    conductorNombre: '',
    empresasTransporte: [],
    empresasCliente: []
  });
  useEffect(() => {
    setFiltros(f => ({
      ...f,
      desdeUtc: toIsoUtc(dateRange.from),
      hastaUtc: toIsoUtc(dateRange.to)
    }));
  }, [dateRange.from.getTime(), dateRange.to.getTime()]);
  const baseData = useMemo(() => generarTelemetria({
    desdeUtc: filtros.desdeUtc,
    hastaUtc: filtros.hastaUtc
  }, 360), [filtros.desdeUtc, filtros.hastaUtc]);

  // Aplicar permisos simulados
  const dataConPermisos = useMemo(() => {
    if (rol === 'Administrador') return baseData;
    if (rol === 'Empresa de transporte') {
      const permitted = new Set(filtros.empresasTransporte.length ? filtros.empresasTransporte : [mockEmpresasTransporte[0].nombre]);
      return baseData.filter(r => permitted.has(r.empresaTransporte));
    }
    // Empresa cliente
    const permitted = new Set(filtros.empresasCliente.length ? filtros.empresasCliente : [mockEmpresasCliente[0].nombre]);
    return baseData.filter(r => !r.ruta || r.ruta === '' || r.ruta?.toLowerCase().includes('parque') || r.empresaCliente && permitted.has(r.empresaCliente));
  }, [baseData, rol, filtros.empresasTransporte, filtros.empresasCliente]);
  const datos = useMemo(() => filtrarTelemetria(dataConPermisos, filtros), [dataConPermisos, filtros]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalPages = Math.max(1, Math.ceil(datos.length / pageSize));
  const pageData = useMemo(() => datos.slice((page - 1) * pageSize, page * pageSize), [datos, page, pageSize]);
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filtros), rol, pageSize]);
  const rutas = useMemo(() => Array.from(new Set(mockRamalesDetallados.map(r => r.nombre))), []);
  const empresasTrans = useMemo(() => mockEmpresasTransporte.map(e => e.nombre), []);
  const empresasCli = useMemo(() => mockEmpresasCliente.map(e => e.nombre), []);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allOnPage = useMemo(() => pageData.length > 0 && pageData.every(r => selected.has(recKey(r))), [pageData, selected]);
  const selectedForMap = useMemo(() => datos.filter(r => selected.has(recKey(r)) && !!r.lat && !!r.lng && r.lat !== 0 && r.lng !== 0), [datos, selected]);
  const toggleOne = (key: string, checked: boolean | string) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (checked) n.add(key);else n.delete(key);
      return n;
    });
  };
  const toggleAllOnPage = (checked: boolean | string) => {
    setSelected(prev => {
      const n = new Set(prev);
      pageData.forEach(r => {
        const k = recKey(r);
        if (checked) n.add(k);else n.delete(k);
      });
      return n;
    });
  };
  return <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listado de telemetría</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportTelemetriaToPDF(datos)}><Download className="mr-2 h-4 w-4" /> PDF</Button>
          <Button variant="outline" onClick={() => exportTelemetriaToExcel(datos)}><Download className="mr-2 h-4 w-4" /> Excel</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm mb-1">Rol (simulado)</label>
              <RolSelector rol={rol} onChange={setRol} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Rango de fecha y hora</label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo de registro</label>
              <MultiSelect
                options={[{ value: 'todos', label: 'Todos' }, ...tiposRegistro.map(t => ({ value: t, label: t }))]}
                value={filtros.tiposRegistro.length ? filtros.tiposRegistro : ['todos']}
                onValueChange={(vals) => {
                  setFiltros({
                    ...filtros,
                    tiposRegistro: vals.includes('todos') ? [] : (vals as TipoRegistro[]),
                  });
                }}
                placeholder="Todos"
                searchPlaceholder="Buscar tipo..."
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm mb-1">Ruta</label>
              <Select value={filtros.ruta || '__ALL__'} onValueChange={v => setFiltros({
              ...filtros,
              ruta: v === '__ALL__' ? '' : v
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="__ALL__">Todos</SelectItem>
                  {rutas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Placa</label>
              <Input value={filtros.placa} onChange={e => setFiltros({
              ...filtros,
              placa: e.target.value
            })} placeholder="Buscar..." />
            </div>
            <div>
              <label className="block text-sm mb-1">ID autobús</label>
              <Input value={filtros.busId} onChange={e => setFiltros({
              ...filtros,
              busId: e.target.value
            })} placeholder="Exacto" />
            </div>
            <div>
              <label className="block text-sm mb-1">Código de conductor</label>
              <Input value={filtros.conductorCodigo} onChange={e => setFiltros({
              ...filtros,
              conductorCodigo: e.target.value
            })} placeholder="Exacto" />
            </div>
            <div>
              <label className="block text-sm mb-1">Nombre de conductor</label>
              <Input value={filtros.conductorNombre} onChange={e => setFiltros({
              ...filtros,
              conductorNombre: e.target.value
            })} placeholder="Parcial" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(rol === 'Administrador' || rol === 'Empresa de transporte') && <div>
                <label className="block text-sm mb-1">Empresa de transporte</label>
                <Select value={filtros.empresasTransporte[0] || '__ALL__'} onValueChange={v => setFiltros({
              ...filtros,
              empresasTransporte: v && v !== '__ALL__' ? [v] : []
            })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="__ALL__">Todas</SelectItem>
                    {empresasTrans.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>}
            {(rol === 'Administrador' || rol === 'Empresa cliente') && <div>
                <label className="block text-sm mb-1">Empresa cliente</label>
                <Select value={filtros.empresasCliente[0] || '__ALL__'} onValueChange={v => setFiltros({
              ...filtros,
              empresasCliente: v && v !== '__ALL__' ? [v] : []
            })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="__ALL__">Todas</SelectItem>
                    {empresasCli.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>}
            
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados ({datos.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox checked={allOnPage} onCheckedChange={toggleAllOnPage} aria-label="Seleccionar página" />
                </TableHead>
                <TableHead>Fecha y hora</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>ID autobús</TableHead>
                <TableHead>Tipo de registro</TableHead>
                <TableHead>Parada</TableHead>
                <TableHead>Velocidad (km/h)</TableHead>
                <TableHead>Pasajeros</TableHead>
                <TableHead>Espacios disp.</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Sentido</TableHead>
                <TableHead>Cód. conductor</TableHead>
                <TableHead>Nombre conductor</TableHead>
                <TableHead>Emp. transporte</TableHead>
                <TableHead>Emp. cliente</TableHead>
                <TableHead>Geocerca</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Lat,Lng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((r, idx) => <TableRow key={idx}>
                  <TableCell>
                    <Checkbox checked={selected.has(recKey(r))} onCheckedChange={c => toggleOne(recKey(r), c)} aria-label="Seleccionar" />
                  </TableCell>
                  <TableCell>{new Date(r.fechaHoraUtc).toLocaleString()}</TableCell>
                  <TableCell>{r.placa}</TableCell>
                  <TableCell>{r.busId}</TableCell>
                  <TableCell>{r.tipoRegistro}</TableCell>
                  <TableCell>{r.parada || ''}</TableCell>
                  <TableCell>{r.velocidadKmH}</TableCell>
                  <TableCell>{r.pasajeros}</TableCell>
                  <TableCell>{r.espaciosDisponibles}</TableCell>
                  <TableCell>{r.ruta || ''}</TableCell>
                  <TableCell>{r.sentido || ''}</TableCell>
                  <TableCell>{r.conductorCodigo}</TableCell>
                  <TableCell>{r.conductorNombre}</TableCell>
                  <TableCell>{r.empresaTransporte}</TableCell>
                  <TableCell>{r.empresaCliente || ''}</TableCell>
                  <TableCell>{r.geocerca || ''}</TableCell>
                  <TableCell>{r.direccion}</TableCell>
                  <TableCell>
                    {r.lat && r.lng && r.lat !== 0 && r.lng !== 0 ? <a className="text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${r.lat},${r.lng}`}>{`${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}`}</a> : ''}
                  </TableCell>
                </TableRow>)}
            </TableBody>
            <TableCaption>HU_115_SGT_FRONT_BACK_Listado_información_telemetria</TableCaption>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                </PaginationItem>
                {Array.from({
                length: totalPages
              }).slice(0, 5).map((_, i) => {
                const p = i + 1;
                return <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>;
              })}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapa de registros seleccionados ({selectedForMap.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedForMap.length === 0 ? <p className="text-sm text-muted-foreground">Selecciona uno o más registros para visualizarlos en el mapa.</p> : <div className="h-[480px] w-full rounded-md overflow-hidden">
              <MapContainer center={[9.9326, -84.0775]} zoom={12} className="h-full w-full">
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds points={selectedForMap.map(r => ({
              lat: r.lat as number,
              lng: r.lng as number
            }))} />
                {selectedForMap.map(r => <Marker key={recKey(r)} position={[r.lat as number, r.lng as number]} icon={buildDivIcon(r.tipoRegistro)}>
                    <Popup>
                      <div className="space-y-1">
                        <div className="text-xs font-medium">{r.tipoRegistro}</div>
                        <div className="text-xs">{new Date(r.fechaHoraUtc).toLocaleString()}</div>
                        <div className="text-xs">Placa: {r.placa} • Bus ID: {r.busId}</div>
                        <div className="text-xs">Velocidad: {r.velocidadKmH} km/h • Dirección: {r.direccion}°</div>
                        {r.parada && <div className="text-xs">Parada: {r.parada}</div>}
                        {r.geocerca && <div className="text-xs">Geocerca: {r.geocerca}</div>}
                        {r.ruta && <div className="text-xs">Ruta: {r.ruta} • {r.sentido || ''}</div>}
                        <div className="text-xs">Conductor: {r.conductorNombre} ({r.conductorCodigo})</div>
                        <div className="text-xs">Transporte: {r.empresaTransporte}</div>
                        {r.empresaCliente && <div className="text-xs">Cliente: {r.empresaCliente}</div>}
                        {r.lat && r.lng && r.lat !== 0 && r.lng !== 0 && <a className="text-xs text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${r.lat},${r.lng}`}>
                            Ver en Google Maps
                          </a>}
                      </div>
                    </Popup>
                  </Marker>)}
              </MapContainer>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default TelemetriaListado;