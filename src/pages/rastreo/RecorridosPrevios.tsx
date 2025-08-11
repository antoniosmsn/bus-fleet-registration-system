import React, { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, EyeOff, Filter, MapPinned, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { RecorridoMap } from '@/components/rastreo/recorridos-previos/RecorridoMap';
import { 
  RecorridoServicioListItem, 
  RecorridoRangoListItem, 
  RecorridoMapData, 
  ModoConsulta 
} from '@/types/recorridos-previos';
import { 
  queryServicios, 
  queryRango, 
  getMapDataForServicio, 
  getMapDataForRango 
} from '@/data/mockRecorridosPrevios';
import { mockEmpresasTransporte } from '@/data/mockEmpresasTransporte';
import { mockEmpresas } from '@/data/mockEmpresas';

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23,59,59,0);
  return d;
}

function toIsoUtcFromLocalInput(v: string) {
  // Interpretar como hora local y convertir a ISO UTC
  const d = new Date(v);
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const tiposRuta = ['parque','privado','especial'] as const;

const RecorridosPrevios: React.FC = () => {
  const isMobile = useIsMobile();
  const [modo, setModo] = useState<ModoConsulta>('servicios');
  const [desde, setDesde] = useState<string>(toLocalInputValue(startOfToday()));
  const [hasta, setHasta] = useState<string>(toLocalInputValue(endOfToday()));
  const [numeroServicio, setNumeroServicio] = useState<string>('');

  const [empresasTransporte, setEmpresasTransporte] = useState<string[]>(['todos']);
  const [empresasCliente, setEmpresasCliente] = useState<string[]>(['todos']);
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>(['todos']);
  const [vehiculos, setVehiculos] = useState<string[]>(['todos']);

  const [busquedaLocal, setBusquedaLocal] = useState('');

  const [resultServicios, setResultServicios] = useState<RecorridoServicioListItem[]>([]);
  const [resultRango, setResultRango] = useState<RecorridoRangoListItem[]>([]);

  const [mapData, setMapData] = useState<RecorridoMapData | null>(null);
  const [showPanel, setShowPanel] = useState(!isMobile);
  const [initialFocus, setInitialFocus] = useState<'recorrido'|'paradas'|'lecturas'>('recorrido');

  const empresasTransporteOptions = useMemo(() => [
    { value: 'todos', label: 'Todos' },
    ...mockEmpresasTransporte.map(e => ({ value: e.nombre, label: e.nombre }))
  ], []);
  
  const empresasClienteOptions = useMemo(() => [
    { value: 'todos', label: 'Todos' },
    ...mockEmpresas.map(e => ({ value: e.nombre, label: e.nombre }))
  ], []);

  const tiposRutaOptions = useMemo(() => [
    { value: 'todos', label: 'Todos' },
    { value: 'parque', label: 'Parque' },
    { value: 'privado', label: 'Privado' },
    { value: 'especial', label: 'Especial' }
  ], []);

  const vehiculosOptions = useMemo(() => {
    const vehiculosUnicos = Array.from(new Set([
      ...resultServicios.map(s => s.identificador),
      ...resultServicios.map(s => s.placa),
      ...resultRango.map(r => r.identificador),
      ...resultRango.map(r => r.placa)
    ]));
    return [
      { value: 'todos', label: 'Todos' },
      ...vehiculosUnicos.map(v => ({ value: v, label: v }))
    ];
  }, [resultServicios, resultRango]);

  const handleBuscar = () => {
    // Validaciones básicas
    const desdeIso = toIsoUtcFromLocalInput(desde);
    const hastaIso = toIsoUtcFromLocalInput(hasta);
    const d1 = new Date(desdeIso);
    const d2 = new Date(hastaIso);
    if (!(d2 > d1)) {
      toast({ title: 'Rango inválido', description: 'Fin debe ser mayor a Inicio.' });
      return;
    }
    if (modo === 'rango') {
      const diffH = (d2.getTime() - d1.getTime()) / 3600000;
      if (diffH > 6) {
        toast({ title: 'El rango máximo permitido es de 6 horas.', description: 'Ajusta las fechas para no exceder 6 h.' });
        return;
      }
    }

    const filtrosBase = {
      modo,
      desdeUtc: desdeIso,
      hastaUtc: hastaIso,
      numeroServicio: modo === 'servicios' && numeroServicio ? numeroServicio : undefined,
      vehiculos: vehiculos.includes('todos') ? undefined : vehiculos,
      empresasTransporte: empresasTransporte.includes('todos') ? undefined : empresasTransporte,
      empresasCliente: empresasCliente.includes('todos') ? undefined : empresasCliente,
      tiposRuta: tiposSeleccionados.includes('todos') ? undefined : tiposSeleccionados as any,
    };

    if (modo === 'servicios') {
      const res = queryServicios(filtrosBase);
      setResultServicios(res);
      setResultRango([]);
      if (res.length === 0) toast({ title: 'Sin datos', description: 'No hay recorridos para los filtros seleccionados.' });
    } else {
      const res = queryRango(filtrosBase);
      setResultRango(res);
      setResultServicios([]);
      if (res.length === 0) toast({ title: 'Sin datos', description: 'No hay recorridos para los filtros seleccionados.' });
    }
  };

  const gruposServicios = useMemo(() => {
    const filtered = resultServicios.filter(it => {
      const q = busquedaLocal.toLowerCase();
      if (!q) return true;
      return (
        it.id.toLowerCase().includes(q) ||
        it.identificador.toLowerCase().includes(q) ||
        it.placa.toLowerCase().includes(q) ||
        it.conductorCodigo.toLowerCase().includes(q) ||
        it.ruta.toLowerCase().includes(q) ||
        it.tipoRuta.toLowerCase().includes(q) ||
        (it.empresaCliente?.toLowerCase().includes(q) ?? false) ||
        it.empresaTransporte.toLowerCase().includes(q)
      );
    });
    const map = new Map<string, RecorridoServicioListItem[]>();
    for (const it of filtered) {
      const key = `${it.identificador} — ${it.placa}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return Array.from(map.entries());
  }, [resultServicios, busquedaLocal]);

  const listaRangoFiltrada = useMemo(() => {
    const q = busquedaLocal.toLowerCase();
    if (!q) return resultRango;
    return resultRango.filter(it =>
      it.identificador.toLowerCase().includes(q) ||
      it.placa.toLowerCase().includes(q) ||
      it.empresaTransporte.toLowerCase().includes(q)
    );
  }, [resultRango, busquedaLocal]);

  const abrirMapaServicio = (id: string, focus: 'recorrido'|'paradas'|'lecturas') => {
    const data = getMapDataForServicio(id);
    setMapData(data);
    setInitialFocus(focus);
    if (isMobile) setShowPanel(false);
  };
  const abrirMapaRango = (busId: string, focus: 'recorrido'|'paradas'|'lecturas') => {
    const data = getMapDataForRango(busId, toIsoUtcFromLocalInput(desde), toIsoUtcFromLocalInput(hasta));
    setMapData(data);
    setInitialFocus(focus);
    if (isMobile) setShowPanel(false);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Recorridos Previos</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Panel lateral */}
          <div className={`${showPanel ? 'block' : 'hidden'} ${isMobile ? 'fixed inset-0 z-50 bg-background' : 'lg:col-span-3 lg:max-w-md'} space-y-4 ${isMobile && showPanel ? 'p-4' : ''}`}>
            {isMobile && showPanel && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtros y resultados</h2>
                <Button size="sm" variant="outline" onClick={() => setShowPanel(false)}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center">
                  <Filter className="h-4 w-4 mr-2"/>Filtros
                  {!isMobile && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-auto" 
                      onClick={() => setShowPanel(false)}
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Modo */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={modo==='servicios'?'default':'outline'} onClick={()=>setModo('servicios')}>Por servicios</Button>
                  <Button variant={modo==='rango'?'default':'outline'} onClick={()=>setModo('rango')}>Por rango</Button>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-xs block mb-1">Fecha/Hora inicio</label>
                    <Input type="datetime-local" value={desde} onChange={(e)=>setDesde(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Fecha/Hora fin</label>
                    <Input type="datetime-local" value={hasta} onChange={(e)=>setHasta(e.target.value)} />
                  </div>
                </div>

                {/* Número servicio solo en servicios */}
                {modo==='servicios' && (
                  <div>
                    <label className="text-xs block mb-1">Número de servicio</label>
                    <Input type="text" inputMode="numeric" placeholder="ID exacto" value={numeroServicio} onChange={(e)=>setNumeroServicio(e.target.value)} />
                  </div>
                )}

                {/* Avanzado */}
                <Accordion type="single" collapsible defaultValue="advanced">
                  <AccordionItem value="advanced">
                    <AccordionTrigger>Filtros avanzados</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      {/* Vehículo */}
                      <div>
                        <label className="text-xs block mb-1">Vehículo</label>
                        <MultiSelect
                          options={vehiculosOptions}
                          value={vehiculos}
                          onValueChange={setVehiculos}
                          placeholder="Seleccionar vehículos"
                          searchPlaceholder="Buscar vehículo..."
                        />
                      </div>

                      {/* Empresa transporte */}
                      <div>
                        <label className="text-xs block mb-1">Empresa de transporte</label>
                        <MultiSelect
                          options={empresasTransporteOptions}
                          value={empresasTransporte}
                          onValueChange={setEmpresasTransporte}
                          placeholder="Seleccionar empresas"
                          searchPlaceholder="Buscar empresa..."
                        />
                      </div>

                      {/* Empresa cliente - solo si no es parque */}
                      {!tiposSeleccionados.includes('parque') || tiposSeleccionados.includes('todos') ? (
                        <div>
                          <label className="text-xs block mb-1">Empresa cliente</label>
                          <MultiSelect
                            options={empresasClienteOptions}
                            value={empresasCliente}
                            onValueChange={setEmpresasCliente}
                            placeholder="Seleccionar clientes"
                            searchPlaceholder="Buscar cliente..."
                          />
                        </div>
                      ) : null}

                      {/* Tipo ruta */}
                      <div>
                        <label className="text-xs block mb-1">Tipo de ruta</label>
                        <MultiSelect
                          options={tiposRutaOptions}
                          value={tiposSeleccionados}
                          onValueChange={setTiposSeleccionados}
                          placeholder="Seleccionar tipos"
                          searchPlaceholder="Buscar tipo..."
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleBuscar}>Buscar</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center"><Search className="h-4 w-4 mr-2"/>Resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Input placeholder="Buscar en resultados..." value={busquedaLocal} onChange={(e)=> setBusquedaLocal(e.target.value)} />
                </div>

                <ScrollArea className="h-[calc(100vh-420px)] pr-2">
                  {/* Listado por modo */}
                  {modo==='servicios' ? (
                    <div className="space-y-4">
                      {gruposServicios.length === 0 && busquedaLocal ? (
                        <p className="text-sm text-muted-foreground">No hay resultados.</p>
                      ) : gruposServicios.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay recorridos para los filtros seleccionados.</p>
                      ) : gruposServicios.map(([grupo, items]) => (
                        <div key={grupo} className="border rounded">
                          <div className="px-3 py-2 font-medium bg-accent/30">{grupo}</div>
                          <div className="divide-y">
                            {items.map(it => (
                              <div key={it.id} className="p-3 text-xs flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <div className="font-medium">Servicio: {it.id}</div>
                                  <div className="text-muted-foreground">{new Date(it.inicioUtc).toLocaleString()}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>Conductor: {it.conductorCodigo}</div>
                                  <div>Ruta: {it.ruta}</div>
                                  <div>Tipo: {it.tipoRuta}</div>
                                  {it.empresaCliente && <div>Cliente: {it.empresaCliente}</div>}
                                  <div>Transporte: {it.empresaTransporte}</div>
                                  <div>Fin: {new Date(it.finUtc).toLocaleString()}</div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <Button size="sm" onClick={()=> abrirMapaServicio(it.id,'recorrido')}><Eye className="h-4 w-4 mr-2"/>Ver recorrido</Button>
                                  <Button size="sm" variant="secondary" onClick={()=> abrirMapaServicio(it.id,'paradas')}>Paradas</Button>
                                  <Button size="sm" variant="secondary" onClick={()=> abrirMapaServicio(it.id,'lecturas')}>Lecturas QR</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {listaRangoFiltrada.length === 0 && busquedaLocal ? (
                        <p className="text-sm text-muted-foreground">No hay resultados.</p>
                      ) : listaRangoFiltrada.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay recorridos para los filtros seleccionados.</p>
                      ) : (
                        listaRangoFiltrada.map(it => (
                          <div key={it.busId} className="p-3 border rounded text-xs">
                            <div className="font-medium">{it.identificador} — {it.placa}</div>
                            <div className="text-muted-foreground">{it.empresaTransporte}</div>
                            <div className="flex gap-2 pt-1">
                              <Button size="sm" onClick={()=> abrirMapaRango(it.busId,'recorrido')}><Eye className="h-4 w-4 mr-2"/>Ver recorrido</Button>
                              <Button size="sm" variant="secondary" onClick={()=> abrirMapaRango(it.busId,'paradas')}>Paradas</Button>
                              <Button size="sm" variant="secondary" onClick={()=> abrirMapaRango(it.busId,'lecturas')}>Lecturas QR</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Panel mapa */}
          <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-9'} min-h-[60vh] relative`}>
            {!showPanel && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="absolute top-4 left-4 z-50" 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setShowPanel(true)}
                      aria-label="Abrir panel de filtros"
                    >
                      <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mostrar filtros</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {!mapData ? (
              <div className="h-full relative">
                <div className="absolute inset-0">
                  <iframe 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-84.35,-10.1,-83.85,9.7&layer=mapnik&marker=10.0199,-84.2419"
                    className="w-full h-full border-0 rounded-lg"
                    title="Mapa de Costa Rica"
                  />
                </div>
              </div>
            ) : (
              <>
                <RecorridoMap 
                  data={mapData}
                  modo={mapData.modo}
                  initialFocus={initialFocus}
                  onRequestShowPanel={() => setShowPanel(true)}
                  isPanelVisible={showPanel}
                />
                {(mapData?.telemetria?.length ?? 0) > 0 && (
                  <Card className="absolute inset-4 bg-background/90 backdrop-blur-sm border-2 border-dashed">
                    <CardContent className="h-full flex items-center justify-center text-center">
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Mapa de Recorridos Previos</p>
                        <p className="text-sm text-muted-foreground">Selecciona un recorrido de la lista lateral para visualizar la ruta, paradas y lecturas QR en el mapa.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecorridosPrevios;
