import React, { useEffect, useMemo, useState } from 'react';
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
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlarmaFiltros, AlarmaRecord, TipoAlarma } from '@/types/alarma';
import { generarAlarmas, filtrarAlarmas } from '@/data/mockAlarmas';
import { mockEmpresasCliente, mockEmpresasTransporte, mockRamalesDetallados } from '@/data/mockRastreoData';
import { Checkbox } from '@/components/ui/checkbox';
import { exportAlarmasToExcel, exportAlarmasToPDF } from '@/services/exportService';

const startOfToday = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); };
const endOfToday = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); };
const toIsoUtc = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
const tiposAlarma: TipoAlarma[] = ['Exceso de velocidad','Detención prolongada','Entrada a geocerca','Salida de geocerca','Botón de pánico','Desvío de ruta'];

const recKey = (r: AlarmaRecord) => [r.fechaHoraUtc, r.placa, r.busId, r.tipoAlarma, r.lat ?? 'n', r.lng ?? 'n'].join('|');
const tipoIconCfg: Record<TipoAlarma, { label: string; cls: string; }> = {
  'Exceso de velocidad': { label: 'Velocidad', cls: 'bg-destructive text-destructive-foreground' },
  'Detención prolongada': { label: 'Detención', cls: 'bg-secondary text-secondary-foreground' },
  'Entrada a geocerca': { label: 'Ent. geocerca', cls: 'bg-accent text-accent-foreground' },
  'Salida de geocerca': { label: 'Sal. geocerca', cls: 'bg-muted text-foreground' },
  'Botón de pánico': { label: 'Pánico', cls: 'bg-ring text-primary-foreground' },
  'Desvío de ruta': { label: 'Desvío', cls: 'bg-primary text-primary-foreground' },
};
const buildDivIcon = (tipo: TipoAlarma) => {
  const cfg = tipoIconCfg[tipo];
  return L.divIcon({ className: '', html: `<div class="rounded px-2 py-1 text-[10px] font-medium shadow ${cfg.cls}">${cfg.label}</div>`, iconSize: [0,0], iconAnchor: [0,0] });
};

const FitBounds: React.FC<{ points: Array<{lat:number; lng:number;}>; }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return; if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [map, JSON.stringify(points)]);
  return null;
};

const DateRangePicker: React.FC<{ value: { from: Date; to: Date; }; onChange: (v:{from:Date;to:Date;})=>void; }> = ({ value, onChange }) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  return (
    <div className="grid grid-cols-2 gap-2">
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(value.from, 'Pp', { locale: es })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-50 p-0 bg-popover">
          <Calendar mode="single" selected={value.from} onSelect={d => d && onChange({ from: d, to: value.to })} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(value.to, 'Pp', { locale: es })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-50 p-0 bg-popover">
          <Calendar mode="single" selected={value.to} onSelect={d => d && onChange({ from: value.from, to: d })} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const AlarmasListado: React.FC = () => {
  useEffect(() => { document.title = 'Listado de alarmas generadas | SistemaTransporte'; }, []);

  const [dateRange, setDateRange] = useState({ from: startOfToday(), to: endOfToday() });
  const [filtros, setFiltros] = useState<AlarmaFiltros>({
    desdeUtc: toIsoUtc(startOfToday()), hastaUtc: toIsoUtc(endOfToday()),
    tiposAlarma: [], conductorNombre: '', conductorCodigo: '', placa: '', busId: '', ruta: '', empresasTransporte: [], empresasCliente: []
  });
  useEffect(() => {
    setFiltros(f => ({ ...f, desdeUtc: toIsoUtc(dateRange.from), hastaUtc: toIsoUtc(dateRange.to) }));
  }, [dateRange.from.getTime(), dateRange.to.getTime()]);

  const baseData = useMemo(() => generarAlarmas({ desdeUtc: filtros.desdeUtc, hastaUtc: filtros.hastaUtc }, 360), [filtros.desdeUtc, filtros.hastaUtc]);
  const datos = useMemo(() => filtrarAlarmas(baseData, filtros), [baseData, filtros]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalPages = Math.max(1, Math.ceil(datos.length / pageSize));
  const pageData = useMemo(() => datos.slice((page - 1) * pageSize, page * pageSize), [datos, page, pageSize]);
  useEffect(() => { setPage(1); }, [JSON.stringify(filtros), pageSize]);

  const rutas = useMemo(() => Array.from(new Set(mockRamalesDetallados.map(r => r.nombre))), []);
  const empresasTrans = useMemo(() => mockEmpresasTransporte.map(e => e.nombre), []);
  const empresasCli = useMemo(() => mockEmpresasCliente.map(e => e.nombre), []);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allOnPage = useMemo(() => pageData.length > 0 && pageData.every(r => selected.has(recKey(r))), [pageData, selected]);
  const selectedForMap = useMemo(() => datos.filter(r => selected.has(recKey(r)) && !!r.lat && !!r.lng && r.lat !== 0 && r.lng !== 0), [datos, selected]);
  const toggleOne = (key: string, checked: boolean | string) => { setSelected(prev => { const n = new Set(prev); if (checked) n.add(key); else n.delete(key); return n; }); };
  const toggleAllOnPage = (checked: boolean | string) => { setSelected(prev => { const n = new Set(prev); pageData.forEach(r => { const k = recKey(r); if (checked) n.add(k); else n.delete(k); }); return n; }); };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listado de alarmas generadas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportAlarmasToPDF(datos)}><Download className="mr-2 h-4 w-4" /> PDF</Button>
          <Button variant="outline" onClick={() => exportAlarmasToExcel(datos)}><Download className="mr-2 h-4 w-4" /> Excel</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tabs defaultValue="fechas" className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="fechas">Fechas</TabsTrigger>
              <TabsTrigger value="servicio">Servicio</TabsTrigger>
              <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
              <TabsTrigger value="conductor">Conductor</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
            </TabsList>

            <TabsContent value="fechas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Rango de fecha y hora</label>
                  <DateRangePicker value={dateRange} onChange={setDateRange} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servicio" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Tipo de alarma</label>
                  <MultiSelect
                    options={[{ value: 'todos', label: 'Todos' }, ...tiposAlarma.map(t => ({ value: t, label: t }))]}
                    value={filtros.tiposAlarma.length ? filtros.tiposAlarma : ['todos']}
                    onValueChange={(vals) => {
                      setFiltros({
                        ...filtros,
                        tiposAlarma: vals.includes('todos') ? [] : (vals as TipoAlarma[]),
                      });
                    }}
                    placeholder="Todos"
                    searchPlaceholder="Buscar tipo..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ruta</label>
                  <Select value={filtros.ruta || '__ALL__'} onValueChange={v => setFiltros({ ...filtros, ruta: v === '__ALL__' ? '' : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="__ALL__">Todos</SelectItem>
                      {rutas.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vehiculo" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Placa</label>
                  <Input value={filtros.placa} onChange={e => setFiltros({ ...filtros, placa: e.target.value })} placeholder="Buscar..." />
                </div>
                <div>
                  <label className="block text-sm mb-1">ID autobús</label>
                  <Input value={filtros.busId} onChange={e => setFiltros({ ...filtros, busId: e.target.value })} placeholder="Exacto" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conductor" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Código de conductor</label>
                  <Input value={filtros.conductorCodigo} onChange={e => setFiltros({ ...filtros, conductorCodigo: e.target.value })} placeholder="Exacto" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nombre de conductor</label>
                  <Input value={filtros.conductorNombre} onChange={e => setFiltros({ ...filtros, conductorNombre: e.target.value })} placeholder="Parcial" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="empresas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Empresas de transporte</label>
                  <MultiSelect
                    options={[{ value: 'todos', label: 'Todas' }, ...empresasTrans.map(e => ({ value: e, label: e }))]}
                    value={filtros.empresasTransporte.length ? filtros.empresasTransporte : ['todos']}
                    onValueChange={(vals) => setFiltros({ ...filtros, empresasTransporte: vals.includes('todos') ? [] : (vals as string[]) })}
                    placeholder="Todas"
                    searchPlaceholder="Buscar empresa..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Empresas cliente</label>
                  <MultiSelect
                    options={[{ value: 'todos', label: 'Todas' }, ...empresasCli.map(e => ({ value: e, label: e }))]}
                    value={filtros.empresasCliente.length ? filtros.empresasCliente : ['todos']}
                    onValueChange={(vals) => setFiltros({ ...filtros, empresasCliente: vals.includes('todos') ? [] : (vals as string[]) })}
                    placeholder="Todas"
                    searchPlaceholder="Buscar empresa..."
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resultado tabla */}
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
                <TableHead>Tipo de alarma</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Cód. Conductor</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>ID autobús</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Emp. transporte</TableHead>
                <TableHead>Emp. cliente</TableHead>
                <TableHead>Lat,Lng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Checkbox checked={selected.has(recKey(r))} onCheckedChange={c => toggleOne(recKey(r), c)} aria-label="Seleccionar" />
                  </TableCell>
                  <TableCell>{new Date(r.fechaHoraUtc).toLocaleString()}</TableCell>
                  <TableCell>{r.tipoAlarma}</TableCell>
                  <TableCell>{r.motivo}</TableCell>
                  <TableCell>{r.conductorNombre}</TableCell>
                  <TableCell>{r.conductorCodigo}</TableCell>
                  <TableCell>{r.placa}</TableCell>
                  <TableCell>{r.busId}</TableCell>
                  <TableCell>{r.ruta || ''}</TableCell>
                  <TableCell>{r.empresaTransporte}</TableCell>
                  <TableCell>{r.empresaCliente || ''}</TableCell>
                  <TableCell>
                    {r.lat && r.lng && r.lat !== 0 && r.lng !== 0 ? (
                      <a className="text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${r.lat},${r.lng}`}>{`${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}`}</a>
                    ) : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>HU_134_SGT_FRONT_BACK_Listado_y_filtrado_Alarmas_Generadas</TableCaption>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                  const p = i + 1; return (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Mapa */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de alarmas seleccionadas ({selectedForMap.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedForMap.length === 0 ? (
            <p className="text-sm text-muted-foreground">Selecciona una o más alarmas para visualizarlas en el mapa.</p>
          ) : (
            <div className="h-[480px] w-full rounded-md overflow-hidden">
              <MapContainer center={[9.9326, -84.0775]} zoom={12} className="h-full w-full">
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds points={selectedForMap.map(r => ({ lat: r.lat as number, lng: r.lng as number }))} />
                {selectedForMap.map(r => (
                  <Marker key={recKey(r)} position={[r.lat as number, r.lng as number]} icon={buildDivIcon(r.tipoAlarma)}>
                    <Popup>
                      <div className="space-y-1">
                        <div className="text-xs font-medium">{r.tipoAlarma}</div>
                        <div className="text-xs">{new Date(r.fechaHoraUtc).toLocaleString()}</div>
                        <div className="text-xs">Motivo: {r.motivo}</div>
                        <div className="text-xs">Placa: {r.placa} • Bus ID: {r.busId}</div>
                        {r.ruta && <div className="text-xs">Ruta: {r.ruta}</div>}
                        <div className="text-xs">Conductor: {r.conductorNombre} ({r.conductorCodigo})</div>
                        <div className="text-xs">Transporte: {r.empresaTransporte}</div>
                        {r.empresaCliente && <div className="text-xs">Cliente: {r.empresaCliente}</div>}
                        {r.lat && r.lng && r.lat !== 0 && r.lng !== 0 && (
                          <a className="text-xs text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${r.lat},${r.lng}`}>
                            Ver en Google Maps
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlarmasListado;
