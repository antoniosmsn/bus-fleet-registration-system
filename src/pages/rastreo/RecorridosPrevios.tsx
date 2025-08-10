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
import { Eye, EyeOff, Filter, MapPinned, Search, PanelLeftClose, PanelLeftOpen, X, Info } from 'lucide-react';
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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(!isMobile);
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

  // Componente del contenido del panel de filtros
  const FilterPanelContent = () => (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-4")}>
      <div className={cn(isMobile ? "pb-4" : "pb-2")}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-base")}>Filtros de Búsqueda</h3>
          {!isMobile && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowFilterPanel(false);
                  setShowInfoPanel(true);
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilterPanel(false)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={cn(isMobile ? "flex-1 overflow-hidden" : "")}>
        <ScrollArea className={cn(isMobile ? "h-full" : "h-[calc(100vh-250px)]")}>
          <div className={cn("space-y-4 pr-4", !isMobile && "text-sm")}>
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
                    type="datetime-local" 
                    value={desde} 
                    onChange={(e)=>setDesde(e.target.value)}
                    className={cn(isMobile ? "h-10" : "h-8")}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha/Hora fin</Label>
                  <Input 
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
        </ScrollArea>
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
              <InfoPanelContent />
            </CardContent>
          </Card>
        )}

        {!isMobile && showFilterPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r">
            <CardContent className="p-4 flex-1">
              <FilterPanelContent />
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default RecorridosPrevios;
