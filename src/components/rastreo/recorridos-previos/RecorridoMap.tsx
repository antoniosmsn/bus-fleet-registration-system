import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, Circle, useMap } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Layers, RotateCcw, MapPinned, Target, User } from 'lucide-react';
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

// Crear icono para las paradas (igual que en TiempoReal)
function createStopIcon(codigo: string, nombre: string) {
  return divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <!-- Icono de target/placemark igual que en TiempoReal -->
        <div style="position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
            <circle cx="12" cy="12" r="10" fill="#059669" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="12" r="6" fill="#fff"/>
            <circle cx="12" cy="12" r="3" fill="#059669"/>
          </svg>
        </div>
        
        <!-- Etiqueta con código y nombre igual que en TiempoReal -->
        <div style="
          position: absolute; 
          top: 24px; 
          left: 50%; 
          transform: translateX(-50%);
          background: #f0fdf4;
          border: 1px solid #059669;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 10px;
          font-weight: bold;
          color: #059669;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
          max-width: 120px;
          text-align: center;
        ">
          <div style="font-weight: bold;">${codigo}</div>
          <div style="font-size: 8px; font-weight: normal; margin-top: 1px;">${nombre}</div>
        </div>
      </div>
    `,
    className: 'custom-stop-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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
}

export const RecorridoMap: React.FC<RecorridoMapProps> = ({ data, modo, initialFocus, radioParadaMts = 30, onRequestShowPanel }) => {
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
  const [clickedMarker, setClickedMarker] = useState<string | null>(null);

  const allStops = data?.stops ?? [];

  useEffect(() => {
    // Estado inicial por modo
    if (modo === 'servicios') {
      setSelectedStops(allStops.map(s => s.id));
    } else {
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

        {/* Inicio / Fin para modo servicios con iconos tipo target */}
        {modo === 'servicios' && startPoint && (
          <Marker 
            position={[startPoint.lat, startPoint.lng]} 
            icon={L.divIcon({
              html: `
                <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
              `,
              className: 'target-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
            eventHandlers={{
              click: () => setClickedMarker('start')
            }}
          >
            {clickedMarker === 'start' && (
              <Tooltip direction="top" offset={[0,-10]} opacity={1} permanent>
                Inicio del servicio — {new Date(startPoint.timestampUtc).toLocaleString()}
              </Tooltip>
            )}
          </Marker>
        )}
        {modo === 'servicios' && endPoint && (
          <Marker 
            position={[endPoint.lat, endPoint.lng]} 
            icon={L.divIcon({
              html: `
                <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
              `,
              className: 'target-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
            eventHandlers={{
              click: () => setClickedMarker('end')
            }}
          >
            {clickedMarker === 'end' && (
              <Tooltip direction="top" offset={[0,-10]} opacity={1} permanent>
                Fin del servicio — {new Date(endPoint.timestampUtc).toLocaleString()}
              </Tooltip>
            )}
          </Marker>
        )}

        {/* Paradas con el mismo estilo que TiempoReal */}
        {showParadas && selectedStopsObjects.map(st => (
          <Marker 
            key={st.id} 
            position={[st.lat, st.lng]}
            icon={createStopIcon(st.codigo, st.nombre)}
          >
            {st.visitada && (
              <Tooltip>
                <div className="text-xs">
                  <div className="font-semibold">{st.codigo} — {st.nombre}</div>
                  <div>Llegada: {st.llegadaUtc ? new Date(st.llegadaUtc).toLocaleString() : '-'}</div>
                </div>
              </Tooltip>
            )}
          </Marker>
        ))}

        {/* Radios de paradas */}
        {showParadas && showRadios && selectedStopsObjects.map(st => (
          <Circle key={`rad-${st.id}`} center={[st.lat, st.lng]} radius={radioParadaMts} pathOptions={{ color: '#6b7280', weight: 1, opacity: 0.6 }} />
        ))}

        {/* Lecturas QR con iconos de persona */}
        {showLecturas && agruparLecturas && data?.qrClusters.map((c, i) => (
          <Marker 
            key={`qrc-${i}`} 
            position={[c.lat, c.lng]}
            icon={L.divIcon({
              html: `
                <div style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: rgba(59, 130, 246, 0.8); border-radius: 50%; border: 2px solid white;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.65 13.65 12 12 12S9 10.65 9 9V7L3 7V9C3 11.76 5.24 14 8 14H16C18.76 14 21 11.76 21 9ZM12 13C14.21 13 16 14.79 16 17V20H8V17C8 14.79 9.79 13 12 13Z"/>
                  </svg>
                  <div style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${c.count}</div>
                </div>
              `,
              className: 'qr-cluster-marker',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
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
              html: `
                <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: rgba(34, 197, 94, 0.8); border-radius: 50%; border: 2px solid white;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.65 13.65 12 12 12S9 10.65 9 9V7L3 7V9C3 11.76 5.24 14 8 14H16C18.76 14 21 11.76 21 9ZM12 13C14.21 13 16 14.79 16 17V20H8V17C8 14.79 9.79 13 12 13Z"/>
                  </svg>
                </div>
              `,
              className: 'qr-reading-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
            eventHandlers={{
              click: () => setClickedMarker(`qr-${i}`)
            }}
          >
            {clickedMarker === `qr-${i}` && (
              <Tooltip>
                <div className="text-xs">{qr.cedula} — {new Date(qr.timestampUtc).toLocaleString()}</div>
              </Tooltip>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Controles flotantes */}
      <div className="absolute top-3 left-3 flex gap-2 z-[400]">
        <Button size="sm" variant="secondary" onClick={onRequestShowPanel}>
          <Eye className="h-4 w-4 mr-2" /> Mostrar panel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleResetView}>
          <RotateCcw className="h-4 w-4 mr-2" /> Restablecer vista
        </Button>
      </div>

      {/* Sección de capas sobre el mapa */}
      <div className="absolute top-3 right-3 z-[400] w-80 max-w-[90vw]">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center">
              <Layers className="h-4 w-4 mr-2" /> Capas
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
          </CardContent>
        </Card>
      </div>

      {/* Controles y detalles */}
      <div className="absolute bottom-3 right-3 z-[400] w-80 max-w-[90vw]">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Controles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                              {st.visitada && <div className="text-muted-foreground">Llegada: {st.llegadaUtc ? new Date(st.llegadaUtc).toLocaleString() : '-'}</div>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost" onClick={() => {
                                if (mapRef.current) {
                                  mapRef.current.setView([st.lat, st.lng], 17, { animate: true });
                                }
                              }}>
                                <Eye className="h-4 w-4" />
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
                  {!agruparLecturas && filteredQRList.length === 0 && (
                    <p className="text-xs text-muted-foreground">No hay lecturas QR para el recorrido.</p>
                  )}
                  {!agruparLecturas && filteredQRList.length > 0 && (
                    <div className="space-y-2">
                      {filteredQRList.map((qr, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs border rounded p-2">
                          <div>
                            <div className="font-medium">{qr.cedula}</div>
                            <div className="text-muted-foreground">{new Date(qr.timestampUtc).toLocaleString()}</div>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => mapRef.current?.setView([qr.lat, qr.lng], 17, { animate: true })}>
                            <Eye className="h-4 w-4" />
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
