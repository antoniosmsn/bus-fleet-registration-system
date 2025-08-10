import React, { useMemo, useState } from 'react';
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

  // Componente del contenido del panel de filtros
  const FilterPanelContent = () => (
    <div className="space-y-4">
      {/* Modo */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Modo de consulta</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={modo==='servicios'?'default':'outline'} 
            onClick={()=>setModo('servicios')}
            className={cn(isMobile ? "h-10" : "h-8")}
          >
            Por servicios
          </Button>
          <Button 
            variant={modo==='rango'?'default':'outline'} 
            onClick={()=>setModo('rango')}
            className={cn(isMobile ? "h-10" : "h-8")}
          >
            Por rango
          </Button>
        </div>
      </div>

      {/* Fechas */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Rango de fechas</Label>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Fecha/Hora inicio</Label>
            <Input 
              id="fecha-inicio"
              name="fecha-inicio"
              type="datetime-local" 
              value={desde} 
              onChange={(e)=>setDesde(e.target.value)}
              className={cn(isMobile ? "h-10" : "h-8")}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Fecha/Hora fin</Label>
            <Input 
              id="fecha-fin"
              name="fecha-fin"
              type="datetime-local" 
              value={hasta} 
              onChange={(e)=>setHasta(e.target.value)}
              className={cn(isMobile ? "h-10" : "h-8")}
            />
          </div>
        </div>
      </div>

      {/* Número servicio solo en servicios */}
      {modo==='servicios' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Número de servicio</Label>
          <Input 
            id="numero-servicio"
            name="numero-servicio"
            type="text" 
            inputMode="numeric" 
            placeholder="ID exacto" 
            value={numeroServicio} 
            onChange={(e)=>setNumeroServicio(e.target.value)}
            className={cn(isMobile ? "h-10" : "h-8")}
          />
        </div>
      )}

      {/* Vehículo */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Vehículo</Label>
        <MultiSelect
          options={vehiculosOptions}
          value={vehiculos}
          onValueChange={setVehiculos}
          placeholder="Seleccionar vehículos"
          searchPlaceholder="Buscar vehículo..."
        />
      </div>

      {/* Empresa transporte */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Empresa de transporte</Label>
        <MultiSelect
          options={empresasTransporteOptions}
          value={empresasTransporte}
          onValueChange={setEmpresasTransporte}
          placeholder="Seleccionar empresas"
          searchPlaceholder="Buscar empresa..."
        />
      </div>

      {/* Empresa cliente */}
      {(!tiposSeleccionados.includes('Parque') || tiposSeleccionados.includes('todos')) && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Empresa cliente</Label>
          <MultiSelect
            options={empresasClienteOptions}
            value={empresasCliente}
            onValueChange={setEmpresasCliente}
            placeholder="Seleccionar clientes"
            searchPlaceholder="Buscar cliente..."
          />
        </div>
      )}

      {/* Tipo ruta */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Tipo de ruta</Label>
        <MultiSelect
          options={tiposRutaOptions}
          value={tiposSeleccionados}
          onValueChange={setTiposSeleccionados}
          placeholder="Seleccionar tipos"
          searchPlaceholder="Buscar tipo..."
        />
      </div>

      <div className="pt-2">
        <Button 
          onClick={handleBuscar} 
          className={cn("w-full", isMobile ? "h-10" : "h-9")}
        >
          Buscar
        </Button>
      </div>
    </div>
  );

  // Componente del contenido del panel de información/resultados
  const InfoPanelContent = () => (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-4")}>
      <div className={cn(isMobile ? "pb-4" : "pb-2")}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-base")}>Resultados</h3>
          {!isMobile && (
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
          )}
        </div>

        <div className={cn("flex items-center gap-2 text-muted-foreground mb-3", isMobile ? "text-sm" : "text-xs")}>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            {modo === 'servicios' ? `Servicios: ${resultServicios.length}` : `Buses: ${resultRango.length}`}
          </div>
        </div>
        
        {/* Input de búsqueda local */}
        <div>
          <Input
            placeholder="Buscar en resultados..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            className={cn(isMobile ? "h-10 text-sm" : "h-8 text-xs")}
          />
          {busquedaLocal && (
            <p className="text-xs text-muted-foreground mt-1">
              Filtrando resultados...
            </p>
          )}
        </div>
      </div>
      
      <div className={cn(isMobile ? "flex-1 overflow-hidden" : "")}>
        <ScrollArea className={cn(isMobile ? "h-full" : "h-[calc(100vh-350px)]")}>
          <div className="space-y-2 pr-4">
            {/* Listado por modo */}
            {modo==='servicios' ? (
              <div className="space-y-4">
                {gruposServicios.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {busquedaLocal 
                      ? "No se encontraron servicios con ese criterio de búsqueda." 
                      : "No hay recorridos para los filtros seleccionados."
                    }
                  </p>
                ) : gruposServicios.map(([grupo, items]) => (
                  <div key={grupo} className="border rounded">
                    <div className="px-3 py-2 font-medium bg-accent/30">{grupo}</div>
                    <div className="divide-y">
                      {items.map(it => (
                        <div key={it.id} className="p-3 text-xs flex flex-col gap-1">
                          <div className="flex justify-between">
                            <div className="font-medium">Id Servicio: {it.id}</div>
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
                            <Button size="sm" onClick={()=> abrirMapaServicio(it.id,'recorrido')}>
                              <Eye className="h-4 w-4 mr-2"/>Ver recorrido
                            </Button>
                            <Button size="sm" variant="secondary" onClick={()=> abrirMapaServicio(it.id,'paradas')}>
                              Paradas
                            </Button>
                            <Button size="sm" variant="secondary" onClick={()=> abrirMapaServicio(it.id,'lecturas')}>
                              Lecturas QR
                            </Button>
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
                    <div key={it.busId} className="p-3 border rounded text-xs">
                      <div className="font-medium">{it.identificador} — {it.placa}</div>
                      <div className="text-muted-foreground">{it.empresaTransporte}</div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" onClick={()=> abrirMapaRango(it.busId,'recorrido')}>
                          <Eye className="h-4 w-4 mr-2"/>Ver recorrido
                        </Button>
                        <Button size="sm" variant="secondary" onClick={()=> abrirMapaRango(it.busId,'paradas')}>
                          Paradas
                        </Button>
                        <Button size="sm" variant="secondary" onClick={()=> abrirMapaRango(it.busId,'lecturas')}>
                          Lecturas QR
                        </Button>
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

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex bg-background relative">
        {/* Desktop Panels */}
        {!isMobile && showInfoPanel && !showFilterPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r">
            <CardContent className="p-4 flex-1">
              <MultiPurposeSidebarContent />
            </CardContent>
          </Card>
        )}

        {!isMobile && showFilterPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r max-h-screen">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-medium text-sm">Filtros de Búsqueda</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <FilterPanelContent />
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
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
                  <FilterPanelContent />
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default RecorridosPrevios;
