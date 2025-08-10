import React, { useMemo, useState } from 'react';
import FilterPanelContent from '@/components/rastreo/FilterPanel';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Eye, EyeOff, Filter, MapPinned, Search, PanelLeftClose, PanelLeftOpen, X, Info, Target, User, Settings, RotateCcw } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { FilterPanelCard } from '@/components/rastreo/FilterPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

const tiposRuta = ['Parque','Privada','Especial'] as const;

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
  const [showFilterPanel, setShowFilterPanel] = useState(true); // Mostrar filtros por defecto
  const [showInfoPanel, setShowInfoPanel] = useState(false); // Ocultar info panel inicialmente
  const [initialFocus, setInitialFocus] = useState<'recorrido'|'paradas'|'lecturas'>('recorrido');
  
  // Estado para el panel multi-uso
  const [sidebarContent, setSidebarContent] = useState<'resultados' | 'paradas' | 'lecturas' | 'controles'>('resultados');
  const [layerData, setLayerData] = useState<{[key: string]: any}>({});

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
    { value: 'Parque', label: 'Parque' },
    { value: 'Privada', label: 'Privada' },
    { value: 'Especial', label: 'Especial' }
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

    // Después de la búsqueda, mostrar los resultados y ocultar los filtros
    setShowFilterPanel(false);
    setShowInfoPanel(true);
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
    if (isMobile) {
      setShowFilterPanel(false);
      setShowInfoPanel(false);
    }
  };
  
  const abrirMapaRango = (busId: string, focus: 'recorrido'|'paradas'|'lecturas') => {
    const data = getMapDataForRango(busId, toIsoUtcFromLocalInput(desde), toIsoUtcFromLocalInput(hasta));
    setMapData(data);
    setInitialFocus(focus);
    if (isMobile) {
      setShowFilterPanel(false);
      setShowInfoPanel(false);
    }
  };

  // Handler para los datos de las capas del mapa
  const handleLayerDataChange = (layerType: 'paradas' | 'lecturas' | 'controles', data: any) => {
    setLayerData(prev => ({ ...prev, [layerType]: data }));
  };

  // Componente para el contenido de paradas en el sidebar
  const ParadasSidebarContent = () => {
    const data = layerData.paradas;
    if (!data) return <div className="text-sm text-muted-foreground">No hay datos de paradas disponibles.</div>;

    const { allStops, selectedStops, setSelectedStops, showRadios, setShowRadios, mapRef } = data;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Paradas ({allStops?.length || 0})</h4>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={showRadios ? 'default' : 'outline'} 
              onClick={() => setShowRadios(!showRadios)}
              className="h-7 px-2"
            >
              Radios
            </Button>
          </div>
        </div>
        
        {modo === 'rango' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedStops(allStops?.map(s => s.id) || [])}
              className="h-7 px-2"
            >
              Todas
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedStops([])}
              className="h-7 px-2"
            >
              Ninguna
            </Button>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-2 pr-2">
            {!allStops || allStops.length === 0 ? (
              <p className="text-xs text-muted-foreground">No hay paradas registradas.</p>
            ) : (
              allStops.map((st: any) => {
                const selected = selectedStops?.includes(st.id);
                return (
                  <div key={st.id} className="flex items-center justify-between text-xs border rounded p-2">
                    <div className="flex-1">
                      <div className="font-medium">{st.codigo} — {st.nombre}</div>
                      {st.visitada && st.llegadaUtc && (
                        <div className="text-muted-foreground">
                          Llegada: {new Date(st.llegadaUtc).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          if (mapRef?.current) {
                            mapRef.current.setView([st.lat, st.lng], 17, { animate: true });
                          }
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {modo === 'rango' && (
                        <input 
                          id={`parada-checkbox-${st.id}`}
                          name={`parada-checkbox-${st.id}`}
                          type="checkbox" 
                          checked={selected} 
                          onChange={() => {
                            setSelectedStops((prev: string[]) => 
                              selected ? prev.filter(id => id !== st.id) : [...prev, st.id]
                            );
                          }} 
                          className="h-3 w-3"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Componente para el contenido de lecturas QR en el sidebar
  const LecturasSidebarContent = () => {
    const data = layerData.lecturas;
    if (!data) return <div className="text-sm text-muted-foreground">No hay datos de lecturas disponibles.</div>;

    const { qrClusters, qrReadings, agruparLecturas, setAgruparLecturas, qrSearch, setQrSearch, filteredQRList, mapRef } = data;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Lecturas QR</h4>
          <div className="flex items-center gap-2">
            <label className="text-xs">Agrupar</label>
            <input 
              id="agrupar-lecturas"
              name="agrupar-lecturas"
              type="checkbox" 
              checked={agruparLecturas} 
              onChange={(e) => setAgruparLecturas(e.target.checked)}
              className="h-3 w-3"
            />
          </div>
        </div>

        {!agruparLecturas && (
          <Input 
            placeholder="Filtrar por cédula..." 
            value={qrSearch} 
            onChange={(e) => setQrSearch(e.target.value)}
            className="h-8 text-xs"
          />
        )}

        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-2 pr-2">
            {agruparLecturas ? (
              !qrClusters || qrClusters.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hay lecturas QR agrupadas.</p>
              ) : (
                qrClusters.map((cluster: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs border rounded p-2">
                    <div className="flex-1">
                      <div className="font-medium">Grupo {idx + 1}</div>
                      <div className="text-muted-foreground">{cluster.count} lecturas</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        if (mapRef?.current) {
                          mapRef.current.setView([cluster.lat, cluster.lng], 17, { animate: true });
                        }
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )
            ) : (
              !filteredQRList || filteredQRList.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hay lecturas QR individuales.</p>
              ) : (
                filteredQRList.map((qr: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs border rounded p-2">
                    <div className="flex-1">
                      <div className="font-medium">{qr.cedula}</div>
                      <div className="text-muted-foreground">
                        {new Date(qr.timestampUtc).toLocaleString()}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        if (mapRef?.current) {
                          mapRef.current.setView([qr.lat, qr.lng], 17, { animate: true });
                        }
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Componente para el contenido de controles en el sidebar
  const ControlesSidebarContent = () => {
    const data = layerData.controles;
    if (!data) return <div className="text-sm text-muted-foreground">No hay datos de controles disponibles.</div>;

    const { speedThreshold, setSpeedThreshold, points, modo, data: mapData } = data;
    
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Controles del Mapa</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1">Umbral velocidad (km/h)</label>
              <Input 
                type="number" 
                min={0} 
                max={150} 
                value={speedThreshold} 
                onChange={(e) => setSpeedThreshold(Math.max(0, Math.min(150, Number(e.target.value) || 0)))}
                className="h-8 text-xs"
              />
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div>Total puntos: {points?.length || 0}</div>
              {modo === 'servicios' && mapData && (
                <>
                  <div>Paradas: {mapData.stops?.length || 0}</div>
                  <div>Lecturas QR: {mapData.qrReadings?.length || 0}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Panel lateral multi-uso
  const MultiPurposeSidebarContent = () => {
    // Mostrar resultados por defecto cuando no hay mapa cargado
    if (sidebarContent === 'resultados' || !mapData) {
      return <InfoPanelContent />;
    }

    return (
      <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-4")}>
        <div className={cn(isMobile ? "pb-4" : "pb-2")}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-base")}>
                {sidebarContent === 'paradas' && 'Paradas'}
                {sidebarContent === 'lecturas' && 'Lecturas QR'}
                {sidebarContent === 'controles' && 'Controles'}
              </h3>
            </div>
            {!isMobile && (
              <div className="flex gap-1">
                <Button 
                  variant={!mapData ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    setSidebarContent('resultados');
                    setShowInfoPanel(true);
                  }}
                  className="h-7 px-2"
                >
                  <Info className="h-3 w-3" />
                </Button>
                {mapData && (
                  <>
                    <Button 
                      variant={sidebarContent === 'paradas' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSidebarContent('paradas')}
                      className="h-7 px-2"
                    >
                      <Target className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant={sidebarContent === 'lecturas' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSidebarContent('lecturas')}
                      className="h-7 px-2"
                    >
                      <User className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant={sidebarContent === 'controles' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSidebarContent('controles')}
                      className="h-7 px-2"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowInfoPanel(false);
                    setShowFilterPanel(true);
                  }}
                  className="h-7 px-2"
                >
                  <Filter className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInfoPanel(false)}
                  className="h-7 px-2"
                >
                  <EyeOff className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(isMobile ? "flex-1 overflow-hidden" : "")}>
          <div className={cn(isMobile ? "h-full" : "h-[calc(100vh-350px)]")}>
            {sidebarContent === 'paradas' && <ParadasSidebarContent />}
            {sidebarContent === 'lecturas' && <LecturasSidebarContent />}
            {sidebarContent === 'controles' && <ControlesSidebarContent />}
          </div>
        </div>
      </div>
    );
  };


  // Componente del contenido del panel de información/resultados
  const InfoPanelContent = () => {
    const totalServicios = resultServicios.length;
    const totalBuses = resultRango.length;
    const serviciosConCliente = resultServicios.filter(s => s.empresaCliente).length;
    
    return (
    <div className="flex flex-col h-full">
      {/* Header fijo */}
      <div className="pb-4 flex-shrink-0">
        {/* Header mejorado */}
        <div className="mb-4">
          <h3 className={cn("font-semibold text-foreground mb-2", isMobile ? "text-lg" : "text-base")}>
            Recorridos Previos
          </h3>
          
          {/* Estadísticas en línea */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">
                {modo === 'servicios' ? `Servicios: ${totalServicios}` : `Buses: ${totalBuses}`}
              </span>
            </div>
            {modo === 'servicios' && serviciosConCliente > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Con cliente: {serviciosConCliente}</span>
              </div>
            )}
          </div>

          {/* Controles del header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowInfoPanel(false);
                    setShowFilterPanel(true);
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInfoPanel(false)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Input de búsqueda mejorado */}
        <div className="mb-4">
          <Input
            placeholder="Buscar en lista actual..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            className="text-sm"
          />
          {busquedaLocal && (
            <p className="text-xs text-muted-foreground mt-1">
              Filtrando resultados...
            </p>
          )}
        </div>
      </div>
      
      {/* Área de scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-3">
            {/* Listado por modo */}
            {modo==='servicios' ? (
              <div className="space-y-3">
                {gruposServicios.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {busquedaLocal 
                      ? "No se encontraron servicios con ese criterio de búsqueda." 
                      : "No hay recorridos para los filtros seleccionados."
                    }
                  </p>
                ) : gruposServicios.map(([grupo, items]) => (
                  <div key={grupo} className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                      {grupo}
                    </div>
                    <div className="space-y-1">
                      {items.map(it => (
                        <div 
                          key={it.id} 
                          className="p-3 bg-card border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                          onClick={() => abrirMapaServicio(it.id, 'recorrido')}
                        >
                          {/* Header con ID y estado */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {it.id}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className={cn(
                                "px-2 py-1 rounded-md text-xs font-medium",
                                it.tipoRuta === 'Privada' && "bg-blue-500 text-white",
                                it.tipoRuta === 'Especial' && "bg-green-500 text-white", 
                                it.tipoRuta === 'Parque' && "bg-orange-500 text-white"
                              )}>
                                {it.tipoRuta}
                              </span>
                            </div>
                          </div>

                          {/* Información principal en línea */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{it.conductorCodigo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{it.ruta}</span>
                            </div>
                          </div>

                          {/* Timestamp */}
                          <div className="text-xs text-muted-foreground mb-2">
                            {new Date(it.inicioUtc).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}, {new Date(it.inicioUtc).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })} - {new Date(it.finUtc).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>

                          {/* Conductor nombre */}
                          <div className="text-sm font-medium text-foreground mb-1">
                            {it.conductorNombre || `Conductor ${it.conductorCodigo}`}
                          </div>

                          {/* Ruta con iconos como en la imagen */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="px-1 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {it.tipoRuta.toLowerCase()}
                            </span>
                            <span>-</span>
                            <span>{it.empresaTransporte}</span>
                            {it.empresaCliente && (
                              <>
                                <span>-</span>
                                <span className="text-primary font-medium">{it.empresaCliente}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {listaRangoFiltrada.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {busquedaLocal 
                      ? "No se encontraron buses con ese criterio de búsqueda." 
                      : "No hay recorridos para los filtros seleccionados."
                    }
                  </p>
                ) : (
                  listaRangoFiltrada.map(it => (
                    <div 
                      key={it.busId} 
                      className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                      onClick={() => abrirMapaRango(it.busId, 'recorrido')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {it.identificador} — {it.placa}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">{it.empresaTransporte}</div>
                      
                      {/* Indicador visual */}
                      <div className="flex items-center justify-center pt-2 border-t border-border/50">
                        <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          <Eye className="h-3 w-3 mr-1" />
                          Hacer clic para ver recorrido
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
    );
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex bg-background relative">
        {/* Desktop Panels */}
        {!isMobile && showInfoPanel && !showFilterPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r overflow-hidden">
            <CardContent className="p-4 flex-1 overflow-hidden">
              <MultiPurposeSidebarContent />
            </CardContent>
          </Card>
        )}

        {!isMobile && showFilterPanel && (
          <FilterPanelCard 
            isMobile={isMobile}
            modo={modo}
            setModo={setModo}
            desde={desde}
            setDesde={setDesde}
            hasta={hasta}
            setHasta={setHasta}
            numeroServicio={numeroServicio}
            setNumeroServicio={setNumeroServicio}
            vehiculos={vehiculos}
            setVehiculos={setVehiculos}
            vehiculosOptions={vehiculosOptions}
            empresasTransporte={empresasTransporte}
            setEmpresasTransporte={setEmpresasTransporte}
            empresasTransporteOptions={empresasTransporteOptions}
            empresasCliente={empresasCliente}
            setEmpresasCliente={setEmpresasCliente}
            empresasClienteOptions={empresasClienteOptions}
            tiposSeleccionados={tiposSeleccionados}
            setTiposSeleccionados={setTiposSeleccionados}
            tiposRutaOptions={tiposRutaOptions}
            handleBuscar={handleBuscar}
          />
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="default" size="lg" className="h-12 w-12 p-0">
                  <Info className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[75vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Resultados</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden px-4 pb-4">
                  <InfoPanelContent />
                </div>
              </DrawerContent>
            </Drawer>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="lg" className="h-12 w-12 p-0">
                  <Filter className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Filtros de Búsqueda</DrawerTitle>
                </DrawerHeader>
                 <div className="flex-1 overflow-hidden px-4 pb-4">
                   <FilterPanelContent 
                     isMobile={isMobile}
                     modo={modo}
                     setModo={setModo}
                     desde={desde}
                     setDesde={setDesde}
                     hasta={hasta}
                     setHasta={setHasta}
                     numeroServicio={numeroServicio}
                     setNumeroServicio={setNumeroServicio}
                     vehiculos={vehiculos}
                     setVehiculos={setVehiculos}
                     vehiculosOptions={vehiculosOptions}
                     empresasTransporte={empresasTransporte}
                     setEmpresasTransporte={setEmpresasTransporte}
                     empresasTransporteOptions={empresasTransporteOptions}
                     empresasCliente={empresasCliente}
                     setEmpresasCliente={setEmpresasCliente}
                     empresasClienteOptions={empresasClienteOptions}
                     tiposSeleccionados={tiposSeleccionados}
                     setTiposSeleccionados={setTiposSeleccionados}
                     tiposRutaOptions={tiposRutaOptions}
                     handleBuscar={handleBuscar}
                   />
                 </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}

        {/* Mapa */}
        <div className="flex-1 relative">
          {!isMobile && !showInfoPanel && !showFilterPanel && (
            <Button
              className="absolute top-4 left-4 z-[1000]"
              variant="outline"
              size="sm"
              onClick={() => setShowInfoPanel(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Mostrar Panel
            </Button>
          )}
          
          <RecorridoMap 
            data={mapData}
            modo={modo}
            initialFocus={initialFocus}
            onRequestShowPanel={() => setShowInfoPanel(true)}
            onLayerDataChange={handleLayerDataChange}
            showInfoPanel={showInfoPanel}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RecorridosPrevios;
