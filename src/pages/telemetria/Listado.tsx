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
import { TelemetriaRecord, TelemetriaFiltros, TipoRegistro } from '@/types/telemetria';
import { generarTelemetria, filtrarTelemetria } from '@/data/mockTelemetria';
import { mockEmpresasTransporte, mockRamalesDetallados, mockEmpresasCliente } from '@/data/mockRastreoData';
import { cn } from '@/lib/utils';
import { exportTelemetriaToExcel, exportTelemetriaToPDF } from '@/services/exportService';
import { Checkbox } from '@/components/ui/checkbox';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const TelemetriaListado: React.FC = () => {
  useEffect(() => {
    document.title = 'Listado de telemetría | SistemaTransporte';
  }, []);
  
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

  // UI State
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setViewMode(window.innerWidth < 768 ? 'list' : 'split');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const dataConPermisos = baseData;
  const datos = useMemo(() => filtrarTelemetria(dataConPermisos, filtros), [dataConPermisos, filtros]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalPages = Math.max(1, Math.ceil(datos.length / pageSize));
  const pageData = useMemo(() => datos.slice((page - 1) * pageSize, page * pageSize), [datos, page, pageSize]);
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filtros), pageSize]);
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

  // Componente para las cards móviles
  const TelemetriaCard: React.FC<{ record: TelemetriaRecord }> = ({ record }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selected.has(recKey(record))} 
              onCheckedChange={c => toggleOne(recKey(record), c)}
            />
            <div className={cn("px-2 py-1 rounded text-xs font-medium", tipoIconCfg[record.tipoRegistro].cls)}>
              {tipoIconCfg[record.tipoRegistro].label}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(record.fechaHoraUtc).toLocaleString()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Placa:</span> {record.placa}</div>
          <div><span className="font-medium">ID:</span> {record.busId}</div>
          <div><span className="font-medium">Velocidad:</span> {record.velocidadKmH} km/h</div>
          <div><span className="font-medium">Pasajeros:</span> {record.pasajeros}</div>
          <div><span className="font-medium">Conductor:</span> {record.conductorNombre}</div>
          <div><span className="font-medium">Ruta:</span> {record.ruta || 'N/A'}</div>
        </div>
        
        {record.lat && record.lng && record.lat !== 0 && record.lng !== 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 p-0 h-auto text-primary"
            onClick={() => window.open(`https://www.google.com/maps/place/${record.lat},${record.lng}`, '_blank')}
          >
            Ver en mapa →
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Telemetría</h1>
          <span className="text-sm text-muted-foreground">({datos.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {!isMobile && (
            <div className="flex rounded-lg border p-1">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
              <Button 
                variant={viewMode === 'split' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('split')}
              >
                Dividido
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('map')}
              >
                Mapa
              </Button>
            </div>
          )}
          
          {isMobile && viewMode === 'list' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode('map')}
            >
              Mapa
            </Button>
          )}
          
          {isMobile && viewMode === 'map' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              Lista
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => exportTelemetriaToPDF(datos)}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportTelemetriaToExcel(datos)}>
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className={cn(
          "border-b bg-muted/50 transition-all duration-200 z-30",
          isMobile ? "fixed inset-x-0 top-16 bg-background border shadow-lg max-h-96 overflow-y-auto" : ""
        )}>
          <div className="p-4">
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
                </div>
              </TabsContent>

              <TabsContent value="vehiculo" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                </div>
              </TabsContent>

              <TabsContent value="conductor" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </TabsContent>

              <TabsContent value="empresas" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
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
                  </div>
                  <div>
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
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 overflow-hidden",
        showFilters && isMobile ? "pt-96" : ""
      )}>
        {viewMode === 'list' && (
          <div className="h-full overflow-auto">
            {isMobile ? (
              // Mobile Cards View
              <div className="p-4">
                {pageData.map((record, idx) => (
                  <TelemetriaCard key={idx} record={record} />
                ))}
                
                {/* Pagination */}
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                        .map(p => (
                          <PaginationItem key={p}>
                            <PaginationLink onClick={() => setPage(p)} isActive={p === page}>
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ) : (
              // Desktop Table View
              <div className="p-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-auto max-h-[calc(100vh-300px)]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background">
                          <TableRow>
                            <TableHead className="w-8">
                              <Checkbox checked={allOnPage} onCheckedChange={toggleAllOnPage} />
                            </TableHead>
                            <TableHead>Fecha y hora</TableHead>
                            <TableHead>Placa</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Velocidad</TableHead>
                            <TableHead>Pasajeros</TableHead>
                            <TableHead>Conductor</TableHead>
                            <TableHead>Ruta</TableHead>
                            <TableHead>Ubicación</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageData.map((r, idx) => (
                            <TableRow key={idx} className={selected.has(recKey(r)) ? 'bg-muted/50' : ''}>
                              <TableCell>
                                <Checkbox 
                                  checked={selected.has(recKey(r))} 
                                  onCheckedChange={c => toggleOne(recKey(r), c)} 
                                />
                              </TableCell>
                              <TableCell className="text-xs">
                                {new Date(r.fechaHoraUtc).toLocaleString()}
                              </TableCell>
                              <TableCell>{r.placa}</TableCell>
                              <TableCell>{r.busId}</TableCell>
                              <TableCell>
                                <div className={cn("px-2 py-1 rounded text-xs font-medium w-fit", tipoIconCfg[r.tipoRegistro].cls)}>
                                  {tipoIconCfg[r.tipoRegistro].label}
                                </div>
                              </TableCell>
                              <TableCell>{r.velocidadKmH} km/h</TableCell>
                              <TableCell>{r.pasajeros}</TableCell>
                              <TableCell>{r.conductorNombre}</TableCell>
                              <TableCell>{r.ruta || 'N/A'}</TableCell>
                              <TableCell>
                                {r.lat && r.lng && r.lat !== 0 && r.lng !== 0 ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-0 h-auto text-primary"
                                    onClick={() => window.open(`https://www.google.com/maps/place/${r.lat},${r.lng}`, '_blank')}
                                  >
                                    Ver mapa
                                  </Button>
                                ) : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Mostrando {Math.min(pageSize, datos.length - (page - 1) * pageSize)} de {datos.length}
                        </div>
                        
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                              .map(p => (
                                <PaginationItem key={p}>
                                  <PaginationLink onClick={() => setPage(p)} isActive={p === page}>
                                    {p}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                            <PaginationItem>
                              <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                        
                        <Select value={pageSize.toString()} onValueChange={v => setPageSize(parseInt(v))}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pageSizeOptions.map(size => (
                              <SelectItem key={size} value={size.toString()}>
                                {size} por página
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {viewMode === 'map' && (
          <div className="h-full">
            <div className="h-full border-l">
              <MapContainer 
                center={[9.7489, -83.7534]} 
                zoom={8} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  attribution="&copy; OpenStreetMap contributors" 
                />
                
                {selectedForMap.length > 0 && (
                  <FitBounds points={selectedForMap.map(r => ({ lat: r.lat!, lng: r.lng! }))} />
                )}
                
                {selectedForMap.map((r, idx) => (
                  <Marker 
                    key={idx} 
                    position={[r.lat!, r.lng!]} 
                    icon={buildDivIcon(r.tipoRegistro)}
                  >
                    <Popup>
                      <div className="space-y-1 text-sm">
                        <div><strong>Fecha:</strong> {new Date(r.fechaHoraUtc).toLocaleString()}</div>
                        <div><strong>Tipo:</strong> {r.tipoRegistro}</div>
                        <div><strong>Placa:</strong> {r.placa} (ID: {r.busId})</div>
                        <div><strong>Velocidad:</strong> {r.velocidadKmH} km/h</div>
                        <div><strong>Conductor:</strong> {r.conductorNombre}</div>
                        {r.ruta && <div><strong>Ruta:</strong> {r.ruta}</div>}
                        {r.parada && <div><strong>Parada:</strong> {r.parada}</div>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {selectedForMap.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Selecciona registros para ver en el mapa</p>
                    <Button variant="outline" onClick={() => setViewMode('list')}>
                      Ir a la lista
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'split' && !isMobile && (
          <div className="h-full flex">
            {/* Lista lado izquierdo */}
            <div className="w-1/2 h-full overflow-auto border-r">
              <div className="p-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-auto max-h-[calc(100vh-300px)]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background">
                          <TableRow>
                            <TableHead className="w-8">
                              <Checkbox checked={allOnPage} onCheckedChange={toggleAllOnPage} />
                            </TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Placa</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Conductor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageData.map((r, idx) => (
                            <TableRow key={idx} className={selected.has(recKey(r)) ? 'bg-muted/50' : ''}>
                              <TableCell>
                                <Checkbox 
                                  checked={selected.has(recKey(r))} 
                                  onCheckedChange={c => toggleOne(recKey(r), c)} 
                                />
                              </TableCell>
                              <TableCell className="text-xs">
                                {new Date(r.fechaHoraUtc).toLocaleString()}
                              </TableCell>
                              <TableCell>{r.placa}</TableCell>
                              <TableCell>
                                <div className={cn("px-2 py-1 rounded text-xs font-medium w-fit", tipoIconCfg[r.tipoRegistro].cls)}>
                                  {tipoIconCfg[r.tipoRegistro].label}
                                </div>
                              </TableCell>
                              <TableCell>{r.conductorNombre}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                            .map(p => (
                              <PaginationItem key={p}>
                                <PaginationLink onClick={() => setPage(p)} isActive={p === page}>
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                          <PaginationItem>
                            <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mapa lado derecho */}
            <div className="w-1/2 h-full relative">
              <MapContainer 
                center={[9.7489, -83.7534]} 
                zoom={8} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  attribution="&copy; OpenStreetMap contributors" 
                />
                
                {selectedForMap.length > 0 && (
                  <FitBounds points={selectedForMap.map(r => ({ lat: r.lat!, lng: r.lng! }))} />
                )}
                
                {selectedForMap.map((r, idx) => (
                  <Marker 
                    key={idx} 
                    position={[r.lat!, r.lng!]} 
                    icon={buildDivIcon(r.tipoRegistro)}
                  >
                    <Popup>
                      <div className="space-y-1 text-sm">
                        <div><strong>Fecha:</strong> {new Date(r.fechaHoraUtc).toLocaleString()}</div>
                        <div><strong>Tipo:</strong> {r.tipoRegistro}</div>
                        <div><strong>Placa:</strong> {r.placa} (ID: {r.busId})</div>
                        <div><strong>Velocidad:</strong> {r.velocidadKmH} km/h</div>
                        <div><strong>Conductor:</strong> {r.conductorNombre}</div>
                        {r.ruta && <div><strong>Ruta:</strong> {r.ruta}</div>}
                        {r.parada && <div><strong>Parada:</strong> {r.parada}</div>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {selectedForMap.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <p className="text-muted-foreground">Selecciona registros para ver en el mapa</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetriaListado;