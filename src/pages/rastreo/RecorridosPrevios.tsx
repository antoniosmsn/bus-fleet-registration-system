import React, { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Filter, MapPinned, Search } from 'lucide-react';
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
  const [modo, setModo] = useState<ModoConsulta>('servicios');
  const [desde, setDesde] = useState<string>(toLocalInputValue(startOfToday()));
  const [hasta, setHasta] = useState<string>(toLocalInputValue(endOfToday()));
  const [numeroServicio, setNumeroServicio] = useState<string>('');

  const [empresasTransporte, setEmpresasTransporte] = useState<string[]>(['todos']);
  const [empresasCliente, setEmpresasCliente] = useState<string[]>(['todos']);
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>(['todos']);
  const [vehiculoTexto, setVehiculoTexto] = useState<string>(''); // opcional (identificador/placa/busId)

  const [busquedaLocal, setBusquedaLocal] = useState('');

  const [resultServicios, setResultServicios] = useState<RecorridoServicioListItem[]>([]);
  const [resultRango, setResultRango] = useState<RecorridoRangoListItem[]>([]);

  const [mapData, setMapData] = useState<RecorridoMapData | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [initialFocus, setInitialFocus] = useState<'recorrido'|'paradas'|'lecturas'>('recorrido');

  const empresasTransporteOptions = useMemo(() => ['todos', ...mockEmpresasTransporte.map(e=>e.nombre)], []);
  const empresasClienteOptions = useMemo(() => ['todos', ...mockEmpresas.map(e=>e.nombre)], []);

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
      if (diffH > 24) {
        toast({ title: 'El rango máximo permitido es de 24 horas.', description: 'Ajusta las fechas para no exceder 24 h.' });
        return;
      }
    }

    const filtrosBase = {
      modo,
      desdeUtc: desdeIso,
      hastaUtc: hastaIso,
      numeroServicio: modo === 'servicios' && numeroServicio ? numeroServicio : undefined,
      vehiculos: vehiculoTexto ? [vehiculoTexto] : undefined,
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
    setShowPanel(false);
  };
  const abrirMapaRango = (busId: string, focus: 'recorrido'|'paradas'|'lecturas') => {
    const data = getMapDataForRango(busId, toIsoUtcFromLocalInput(desde), toIsoUtcFromLocalInput(hasta));
    setMapData(data);
    setInitialFocus(focus);
    setShowPanel(false);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Recorridos Previos</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Panel lateral */}
          <div className={`${showPanel ? 'block' : 'hidden lg:block'} lg:col-span-5 space-y-4`}>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center"><Filter className="h-4 w-4 mr-2"/>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Modo */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={modo==='servicios'?'default':'outline'} onClick={()=>setModo('servicios')}>Por servicios</Button>
                  <Button variant={modo==='rango'?'default':'outline'} onClick={()=>setModo('rango')}>Por rango</Button>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

                {/* Vehículo (texto opcional) */}
                <div>
                  <label className="text-xs block mb-1">Vehículo (identificador/placa)</label>
                  <Input value={vehiculoTexto} onChange={(e)=>setVehiculoTexto(e.target.value)} placeholder="Ej: ID023 o ABC023" />
                </div>

                {/* Empresa transporte */}
                <div>
                  <label className="text-xs block mb-1">Empresa de transporte</label>
                  <Select onValueChange={(v)=> setEmpresasTransporte(v==='todos'? ['todos']: [v])}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      {empresasTransporteOptions.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Empresa cliente */}
                <div>
                  <label className="text-xs block mb-1">Empresa cliente</label>
                  <Select onValueChange={(v)=> setEmpresasCliente(v==='todos'? ['todos']: [v])}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      {empresasClienteOptions.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo ruta */}
                <div>
                  <label className="text-xs block mb-1">Tipo de ruta</label>
                  <Select onValueChange={(v)=> setTiposSeleccionados(v==='todos'? ['todos']: [v])}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">todos</SelectItem>
                      {tiposRuta.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                      {gruposServicios.length === 0 ? (
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
                      {listaRangoFiltrada.length === 0 ? (
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
          <div className="lg:col-span-7 min-h-[60vh]">
            {!mapData ? (
              <Card className="h-full">
                <CardContent className="h-full flex items-center justify-center text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Selecciona un recorrido para visualizar en el mapa.</p>
                    {!showPanel && (
                      <Button size="sm" variant="outline" onClick={()=> setShowPanel(true)}><Eye className="h-4 w-4 mr-2"/>Mostrar panel</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <RecorridoMap 
                data={mapData}
                modo={mapData.modo}
                initialFocus={initialFocus}
                onRequestShowPanel={()=> setShowPanel(true)}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecorridosPrevios;
