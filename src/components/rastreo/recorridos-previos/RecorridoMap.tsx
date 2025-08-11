import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, Circle, useMap } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Layers, RotateCcw, MapPinned, PanelLeftOpen } from 'lucide-react';
import { RecorridoMapData, StopInfo, QRReading } from '@/types/recorridos-previos';
import RecorridoMapExport from './RecorridoMapExport';

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function createArrowIcon(course: number, speed: number, showSpeed: boolean) {
  return divIcon({
    html: `
      <div style="position: relative; display:flex; align-items:center; justify-content:center;">
        <div style="transform: rotate(${course}deg);">
          <svg width="22" height="22" viewBox="0 0 24 24" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
            <path d="M12 2 L20 12 L15 12 L15 20 L9 20 L9 12 L4 12 Z" fill="#007AFF" stroke="#fff" stroke-width="0.5"/>
          </svg>
        </div>
        ${showSpeed ? `<div style="position:absolute; top:22px; background:rgba(0,0,0,0.6); color:white; font-size:10px; padding:1px 3px; border-radius:3px;">${speed} km/h</div>`: ''}
      </div>
    `,
    className: 'arrow-icon',
    iconSize: [36,36],
    iconAnchor: [18,18]
  });
}

function FitBoundsOnPoints({ points }: { points: {lat:number; lng:number}[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [24,24] });
  }, [map, JSON.stringify(points)]);
  return null;
}

export type InitialFocus = 'recorrido' | 'paradas' | 'lecturas';

interface RecorridoMapProps {
  data: RecorridoMapData | null;
  modo: 'servicios' | 'rango';
  initialFocus: InitialFocus;
  radioParadaMts?: number; // default 30
  onRequestShowPanel: () => void;
  isPanelVisible?: boolean;
}

export const RecorridoMap: React.FC<RecorridoMapProps> = ({ data, modo, initialFocus, radioParadaMts = 30, onRequestShowPanel, isPanelVisible }) => {
  const points = data?.telemetria ?? [];
  const [speedThreshold, setSpeedThreshold] = useState<number>(90);
  const [showRecorrido, setShowRecorrido] = useState(true);
  const [showParadas, setShowParadas] = useState(true);
  const [showLecturas, setShowLecturas] = useState(true);
  const [showRadios, setShowRadios] = useState(false);
  const [agruparLecturas, setAgruparLecturas] = useState(true);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [qrSearch, setQrSearch] = useState('');
  const [activeTab, setActiveTab] = useState<InitialFocus>(initialFocus);

  const mapRef = useRef<L.Map | null>(null);
  const center: [number, number] = [9.9333, -84.0833];

  const allStops = data?.stops ?? [];

  useEffect(() => {
    // Estado inicial por modo
    if (modo === 'servicios') {
      setSelectedStops(allStops.map(s => s.id));
    } else {
      // En modo rango: ninguna parada seleccionada inicialmente
      setSelectedStops([]);
    }
    setActiveTab(initialFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo, data?.stops?.length, initialFocus]);

  const pathPositions = useMemo(() => points.map(p => [p.lat, p.lng] as [number, number]), [points]);

  

  const handleResetView = () => {
    if (!mapRef.current || points.length === 0) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    mapRef.current.fitBounds(bounds, { padding: [24,24] });
  };

  const selectedStopsObjects: StopInfo[] = useMemo(() => {
    const set = new Set(selectedStops);
    return allStops.filter(s => set.has(s.id));
  }, [selectedStops, allStops]);

  const filteredQRList: QRReading[] = useMemo(() => {
    if (!data) return [];
    if (agruparLecturas) return [];
    if (!qrSearch) return data.qrReadings;
    const q = qrSearch.toLowerCase();
    return data.qrReadings.filter(r => r.cedula.toLowerCase().includes(q));
  }, [agruparLecturas, data, qrSearch]);

  const startPoint = modo === 'servicios' && points.length > 0 ? points[0] : null;
  const endPoint = modo === 'servicios' && points.length > 1 ? points[points.length-1] : null;
  
  const SetMapRef: React.FC = () => {
    const m = useMap();
    useEffect(() => {
      mapRef.current = m;
    }, [m]);
    return null;
  };
  
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        dragging={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        touchZoom={true}
        style={{ width: '100%', height: 'calc(100vh - 120px)' }}
      >
        <SetMapRef />
        <FitBoundsOnPoints points={points} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recorrido principal */}
        {showRecorrido && pathPositions.length > 1 && (
          <Polyline positions={pathPositions} pathOptions={{ color: '#007AFF', weight: 4, opacity: 0.8 }} />
        )}

        {/* Puntos con flecha y velocidad sobre umbral */}
        {showRecorrido && points.map((p, idx) => (
          <Marker
            key={`tp-${idx}`}
            position={[p.lat, p.lng]}
            icon={createArrowIcon(p.course, p.speedKmH, p.speedKmH >= speedThreshold)}
          />
        ))}

        {/* Inicio / Fin para modo servicios */}
        {modo === 'servicios' && startPoint && (
          <Marker 
            position={[startPoint.lat, startPoint.lng]} 
            icon={L.divIcon({
              html: `<div style="background-color: #16A34A; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              className: 'custom-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Tooltip direction="top" offset={[0,-10]} opacity={1} permanent>
              Inicio del servicio — {new Date(startPoint.timestampUtc).toLocaleString()}
            </Tooltip>
          </Marker>
        )}
        {modo === 'servicios' && endPoint && (
          <Marker 
            position={[endPoint.lat, endPoint.lng]} 
            icon={L.divIcon({
              html: `<div style="background-color: #DC2626; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              className: 'custom-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Tooltip direction="top" offset={[0,-10]} opacity={1} permanent>
              Fin del servicio — {new Date(endPoint.timestampUtc).toLocaleString()}
            </Tooltip>
          </Marker>
        )}

        {/* Paradas */}
        {showParadas && selectedStopsObjects.map(st => (
          <Marker 
            key={st.id} 
            position={[st.lat, st.lng]}
            icon={L.divIcon({
              html: `
                <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid hsl(var(--primary)); box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
                  <div style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); width:6px; height:6px; border-radius:50%; background: hsl(var(--primary));"></div>
                </div>
              `,
              className: 'stop-bullseye',
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })}
          >
            {st.visitada ? (
              <Tooltip permanent direction="top" offset={[0,-14]} opacity={1} className="stop-tooltip">
                <div className="stop-info">
                  <div className="stop-code">{st.codigo}</div>
                  <div className="stop-name">{st.nombre}</div>
                </div>
              </Tooltip>
            ) : null}
          </Marker>
        ))}


        {/* Radios de paradas */}
        {showParadas && showRadios && selectedStopsObjects.map(st => (
          <Circle 
            key={`rad-${st.id}`} 
            center={[st.lat, st.lng]} 
            radius={radioParadaMts} 
            pathOptions={{ 
              color: '#6b7280', 
              weight: 1, 
              opacity: 0.6, 
              fillOpacity: 0.1,
              fill: true 
            }} 
          />
        ))}

        {/* Lecturas QR */}
        {showLecturas && agruparLecturas && data?.qrClusters.map((c, i) => (
          <Marker 
            key={`qrc-${i}`} 
            position={[c.lat, c.lng]}
            icon={L.divIcon({
              html: `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">👥</div>`,
              className: 'qr-cluster-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })}
          >
            <Tooltip permanent direction="top" offset={[0,-10]} opacity={1}>
              <div className="text-xs">QR x{c.count}</div>
            </Tooltip>
          </Marker>
        ))}
        {showLecturas && !agruparLecturas && filteredQRList.map((qr, i) => (
          <Marker 
            key={`qr-${i}`} 
            position={[qr.lat, qr.lng]}
            icon={L.divIcon({
              html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">👤</div>`,
              className: 'qr-individual-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Tooltip>
              <div className="text-xs">{qr.cedula} — {new Date(qr.timestampUtc).toLocaleString('es-CR', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Controles flotantes */}
      <div className="absolute top-3 left-3 flex gap-2 z-[400]">
        {!isPanelVisible && (
          <Button size="icon" variant="secondary" onClick={onRequestShowPanel} aria-label="Mostrar panel">
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={handleResetView}>
          <RotateCcw className="h-4 w-4 mr-2" /> Restablecer vista
        </Button>
      </div>

      <div className="absolute top-3 right-3 z-[400] w-80 max-w-[90vw]">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center">
              <Layers className="h-4 w-4 mr-2" /> Capas y controles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant={showRecorrido? 'default':'outline'} onClick={()=>setShowRecorrido(v=>!v)}>
                {showRecorrido ? <Eye className="h-4 w-4 mr-2"/>: <EyeOff className="h-4 w-4 mr-2"/>}
                Recorrido
              </Button>
              <Button size="sm" variant={showParadas? 'default':'outline'} onClick={()=>setShowParadas(v=>!v)}>
                {showParadas ? <Eye className="h-4 w-4 mr-2"/>: <EyeOff className="h-4 w-4 mr-2"/>}
                Paradas
              </Button>
              <Button size="sm" variant={showLecturas? 'default':'outline'} onClick={()=>setShowLecturas(v=>!v)}>
                {showLecturas ? <Eye className="h-4 w-4 mr-2"/>: <EyeOff className="h-4 w-4 mr-2"/>}
                Lecturas QR
              </Button>
              <Button size="sm" variant={showRadios? 'default':'outline'} onClick={()=>setShowRadios(v=>!v)}>
                {showRadios ? <Eye className="h-4 w-4 mr-2"/>: <EyeOff className="h-4 w-4 mr-2"/>}
                Radios paradas
              </Button>
            </div>

            <div>
              <label className="text-xs block mb-1">Umbral de exceso de velocidad (km/h)</label>
              <Input type="number" min={0} max={150} value={speedThreshold} onChange={(e)=> setSpeedThreshold(Math.max(0, Math.min(150, Number(e.target.value)||0)))} />
            </div>

            <RecorridoMapExport data={data} modo={modo} />

            <Tabs value={activeTab} onValueChange={(v)=> setActiveTab(v as InitialFocus)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="recorrido">Recorrido</TabsTrigger>
                <TabsTrigger value="paradas">Paradas</TabsTrigger>
                <TabsTrigger value="lecturas">Lecturas</TabsTrigger>
              </TabsList>
              <TabsContent value="recorrido" className="pt-2">
                <p className="text-xs text-muted-foreground">Total puntos: {points.length}</p>
              </TabsContent>
              <TabsContent value="paradas" className="pt-2">
                {modo === 'rango' && (
                  <div className="flex gap-2 mb-2">
                    <Button size="sm" variant="outline" onClick={()=> setSelectedStops(allStops.map(s=>s.id))}>Seleccionar todas</Button>
                    <Button size="sm" variant="outline" onClick={()=> setSelectedStops([])}>Limpiar</Button>
                  </div>
                )}
                <ScrollArea className="h-48 pr-2">
                  {allStops.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No hay paradas registradas en este recorrido.</p>
                  ) : (
                    <div className="space-y-2">
                      {allStops.map(st => {
                        const selected = selectedStops.includes(st.id);
                        return (
                          <div key={st.id} className="flex items-center justify-between text-xs border rounded p-2">
                            <div>
                              <div className="font-medium">{st.codigo} — {st.nombre}</div>
                              {st.visitada && <div className="text-muted-foreground">Llegada: {st.llegadaUtc ? new Date(st.llegadaUtc).toLocaleString('es-CR', {
                                year: 'numeric',
                                month: '2-digit', 
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              }) : '-'}</div>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost" onClick={() => {
                                if (mapRef.current) {
                                  mapRef.current.setView([st.lat, st.lng], 17, { animate: true });
                                }
                              }}>
                                <MapPinned className="h-4 w-4" />
                              </Button>
                              <input type="checkbox" checked={selected} onChange={() => {
                                setSelectedStops(prev => selected ? prev.filter(id=>id!==st.id) : [...prev, st.id]);
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="lecturas" className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs">Agrupar lecturas</span>
                  <input type="checkbox" checked={agruparLecturas} onChange={(e)=> setAgruparLecturas(e.target.checked)} />
                </div>
                {!agruparLecturas && (
                  <div className="mb-2">
                    <Input placeholder="Filtrar por cédula" value={qrSearch} onChange={(e)=> setQrSearch(e.target.value)} />
                  </div>
                )}
                <ScrollArea className="h-48 pr-2">
                  {showLecturas && agruparLecturas && (data?.qrClusters?.length ?? 0) === 0 && (
                    <p className="text-xs text-muted-foreground">No hay lecturas QR para el recorrido.</p>
                  )}
                  {!agruparLecturas && filteredQRList.length === 0 && qrSearch && (
                    <p className="text-xs text-muted-foreground">No hay resultados.</p>
                  )}
                  {!agruparLecturas && filteredQRList.length === 0 && !qrSearch && (
                    <p className="text-xs text-muted-foreground">No hay lecturas QR para el recorrido.</p>
                  )}
                  {!agruparLecturas && filteredQRList.length > 0 && (
                    <div className="space-y-2">
                      {filteredQRList.map((qr, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs border rounded p-2">
                          <div>
                            <div className="font-medium">{qr.cedula}</div>
                            <div className="text-muted-foreground">{new Date(qr.timestampUtc).toLocaleString('es-CR', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}</div>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => mapRef.current?.setView([qr.lat, qr.lng], 17, { animate: true })}>
                            <MapPinned className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
