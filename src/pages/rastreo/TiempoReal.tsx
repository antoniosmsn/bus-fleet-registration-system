import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Filter, 
  MapPin, 
  Users, 
  Clock, 
  Gauge, 
  Play, 
  Square,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Focus,
  Menu,
  Info,
  Target,
  ChevronDown,
  Map
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { 
  mockAutobusesRastreo, 
  mockEmpresasCliente, 
  mockEmpresasTransporte, 
  mockRamalesDetallados,
  AutobusRastreo,
  TELEMETRIA_CONFIG 
} from '@/data/mockRastreoData';
import { mockStops, Stop } from '@/data/mockStops';
import { StopsPanel } from '@/components/rastreo/StopsPanel';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Fix for Leaflet icon issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Filtros {
  placaIdentificador: string;
  empresasTransporte: string[];
  empresasCliente: string[];
  tiposServicio: string[];
  ramales: string[];
  autobusesSeleccionados: string[];
}

const createBusIcon = (identificador: string, estado: 'en_linea' | 'fuera_linea', curso: number) => {
  const color = estado === 'en_linea' ? '#dc2626' : '#6b7280'; // Rojo similar a la imagen para en línea
  const bgColor = estado === 'en_linea' ? '#fef2f2' : '#f3f4f6';
  
  return divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <!-- Flecha que rota según la dirección -->
        <div style="transform: rotate(${curso}deg);">
          <svg width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
            <path d="M12 2 L20 12 L15 12 L15 20 L9 20 L9 12 L4 12 Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
          </svg>
        </div>
        
        <!-- Etiqueta que NO rota, siempre horizontal y legible -->
        <div style="
          position: absolute; 
          top: 28px; 
          left: 50%; 
          transform: translateX(-50%);
          background: ${bgColor};
          border: 1px solid ${color};
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 9px;
          font-weight: bold;
          color: ${color};
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          z-index: 1000;
          min-width: 20px;
          text-align: center;
        ">${identificador}</div>
      </div>
    `,
    className: 'custom-bus-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
};

// Crear icono para las paradas
const createStopIcon = (codigo: string, nombre: string) => {
  return divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <!-- Icono de target/placemark -->
        <div style="position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
            <circle cx="12" cy="12" r="10" fill="#059669" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="12" r="6" fill="#fff"/>
            <circle cx="12" cy="12" r="3" fill="#059669"/>
          </svg>
        </div>
        
        <!-- Etiqueta con código y nombre -->
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
};

// Component to fit map bounds only when filters are applied
const FitBounds = ({ autobuses, shouldFit }: { autobuses: AutobusRastreo[], shouldFit: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (autobuses.length > 0 && shouldFit) {
      const bounds = L.latLngBounds(autobuses.map(bus => [bus.lat, bus.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [autobuses, map, shouldFit]);
  
  return null;
};

// Component to provide map instance
const MapInstanceProvider = ({ onMapReady }: { onMapReady: (map: L.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
};

const TiempoReal = () => {
  const isMobile = useIsMobile();
  
  const [filtros, setFiltros] = useState<Filtros>({
    placaIdentificador: '',
    empresasTransporte: ['todos'],
    empresasCliente: ['todos'],
    tiposServicio: ['todos'],
    ramales: ['todos'],
    autobusesSeleccionados: ['todos']
  });

  const [autobusesFiltrados, setAutobusesFiltrados] = useState<AutobusRastreo[]>([]);
  const [autobusesEnRastreo, setAutobusesEnRastreo] = useState<AutobusRastreo[]>(mockAutobusesRastreo.filter(bus => bus.activo));
  const [showInfoPanel, setShowInfoPanel] = useState(!isMobile);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showStopsPanel, setShowStopsPanel] = useState(false);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [pausedMessage, setPausedMessage] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState(false);
  const [busquedaLocal, setBusquedaLocal] = useState('');
  
  // Stops state
  const [selectedStops, setSelectedStops] = useState<string[]>(mockStops.map(stop => stop.id)); // All stops selected by default
  
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouseOverRef = useRef(false);

  // Simular actualización de datos en tiempo real
  const updateBusData = useCallback(() => {
    if (!isTracking || mouseOverRef.current) return;

    setAutobusesEnRastreo(prev => prev.map(bus => ({
      ...bus,
      lat: bus.lat + (Math.random() - 0.5) * 0.001,
      lng: bus.lng + (Math.random() - 0.5) * 0.001,
      velocidad: bus.estado === 'en_linea' ? Math.floor(Math.random() * 80) + 10 : 0,
      ocupacionActual: bus.estado === 'en_linea' ? Math.floor(Math.random() * bus.capacidadTotal) : 0,
      curso: (bus.curso + Math.floor(Math.random() * 20) - 10 + 360) % 360,
      ultimaTransmision: new Date()
    })));
  }, [isTracking]);

  // Configurar polling
  useEffect(() => {
    if (isTracking) {
      trackingIntervalRef.current = setInterval(updateBusData, TELEMETRIA_CONFIG.INTERVALO_POLLING_SEGUNDOS * 1000);
    } else if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, [isTracking]); // Remove updateBusData dependency to prevent re-creation

  // Búsqueda y filtrado
  const handleBuscar = () => {
    let resultado = mockAutobusesRastreo.filter(bus => bus.activo);

    // Filtro por placa/identificador
    if (filtros.placaIdentificador) {
      resultado = resultado.filter(bus => 
        bus.placa.toLowerCase().includes(filtros.placaIdentificador.toLowerCase()) ||
        bus.identificador.toLowerCase().includes(filtros.placaIdentificador.toLowerCase())
      );
    }

    // Filtro por empresa de transporte
    if (!filtros.empresasTransporte.includes('todos')) {
      resultado = resultado.filter(bus => 
        filtros.empresasTransporte.includes(bus.empresaTransporte)
      );
    }

    // Filtro por empresa cliente
    if (!filtros.empresasCliente.includes('todos')) {
      resultado = resultado.filter(bus => 
        bus.empresaCliente && filtros.empresasCliente.includes(bus.empresaCliente)
      );
    }

    // Filtro por tipo de servicio
    if (!filtros.tiposServicio.includes('todos')) {
      resultado = resultado.filter(bus => 
        filtros.tiposServicio.includes(bus.tipoServicio)
      );
    }

    // Filtro por ramal
    if (!filtros.ramales.includes('todos')) {
      resultado = resultado.filter(bus => 
        bus.ramal && filtros.ramales.includes(bus.ramal)
      );
    }

    setAutobusesFiltrados(resultado);
  };

  const handleAplicarFiltro = () => {
    let autobusesParaRastreo: AutobusRastreo[] = [];

    if (filtros.autobusesSeleccionados.includes('todos')) {
      autobusesParaRastreo = autobusesFiltrados;
    } else {
      autobusesParaRastreo = autobusesFiltrados.filter(bus => 
        filtros.autobusesSeleccionados.includes(bus.id)
      );
    }

    setAutobusesEnRastreo(autobusesParaRastreo);
    setIsTracking(true);
    setShouldFitBounds(true); // Trigger map centering only when applying filter
    setShowFilterPanel(false);
    setShowInfoPanel(true);
    
    // Reset shouldFitBounds after a brief delay
    setTimeout(() => setShouldFitBounds(false), 1000);
    
    toast({
      title: "Filtro aplicado",
      description: `Rastreando ${autobusesParaRastreo.length} autobuses`
    });
  };

  const handleDetener = () => {
    setIsTracking(false);
    toast({
      title: "Rastreo detenido",
      description: "El rastreo en tiempo real ha sido pausado"
    });
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      placaIdentificador: '',
      empresasTransporte: ['todos'],
      empresasCliente: ['todos'],
      tiposServicio: ['todos'],
      ramales: ['todos'],
      autobusesSeleccionados: ['todos']
    });
    setAutobusesFiltrados([]);
  };

  const handleBusClick = (busId: string) => {
    setSelectedBus(busId);
    setIsTracking(false);
    setPausedMessage(true);
    mouseOverRef.current = true;
  };

  const handleMouseLeave = () => {
    setSelectedBus(null);
    setPausedMessage(false);
    mouseOverRef.current = false;
    setIsTracking(true);
  };

  const handleCenterOnBus = (bus: AutobusRastreo) => {
    if (mapInstance) {
      mapInstance.setView([bus.lat, bus.lng], 16, { animate: true });
      toast({
        title: "Autobús centrado",
        description: `Vista centrada en ${bus.identificador} - ${bus.placa}`
      });
    }
  };

  // Manejar el panel de paradas
  const toggleStopsPanel = useCallback(() => {
    setShowStopsPanel(!showStopsPanel);
  }, [showStopsPanel]);

  // Manejar cambio de paradas seleccionadas
  const handleStopsChange = useCallback((stopIds: string[]) => {
    setSelectedStops(stopIds);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Filtrar autobuses para mostrar en el panel basado en la búsqueda local
  const autobusesFiltradosParaMostrar = autobusesEnRastreo.filter(bus => {
    if (!busquedaLocal) return true;
    
    const searchTerm = busquedaLocal.toLowerCase();
    return (
      bus.identificador.toLowerCase().includes(searchTerm) ||
      bus.placa.toLowerCase().includes(searchTerm) ||
      bus.conductor.toLowerCase().includes(searchTerm) ||
      bus.tipoServicio.toLowerCase().includes(searchTerm) ||
      (bus.ramal && bus.ramal.toLowerCase().includes(searchTerm))
    );
  });

  // Componente del contenido del panel de información
  const InfoPanelContent = () => (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-4")}>
        <div className={cn(isMobile ? "pb-4" : "pb-2")}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("font-semibold", isMobile ? "text-lg" : "text-base")}>Autobuses en Tiempo Real</h3>
            {!isMobile && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleStopsPanel}
                >
                  <Map className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowFilterPanel(true);
                    setShowInfoPanel(false);
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
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            En línea: {autobusesFiltradosParaMostrar.filter(b => b.estado === 'en_linea').length}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            Fuera línea: {autobusesFiltradosParaMostrar.filter(b => b.estado === 'fuera_linea').length}
          </div>
        </div>
        
        {/* Input de búsqueda local */}
        <div>
          <Input
            placeholder="Buscar en lista actual..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            className={cn(isMobile ? "h-10 text-sm" : "h-8 text-xs")}
          />
          {busquedaLocal && (
            <p className="text-xs text-muted-foreground mt-1">
              Mostrando {autobusesFiltradosParaMostrar.length} de {autobusesEnRastreo.length} autobuses
            </p>
          )}
        </div>
      </div>
      
      <div className={cn(isMobile ? "flex-1 overflow-hidden" : "")}>
        <ScrollArea className={cn(isMobile ? "h-full" : "h-[calc(100vh-350px)]")}>
          <div className="space-y-2 pr-4">
            {!autobusesFiltradosParaMostrar || autobusesFiltradosParaMostrar.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {busquedaLocal 
                  ? "No se encontraron autobuses con ese criterio de búsqueda." 
                  : "No hay autobuses disponibles con los filtros seleccionados."
                }
              </p>
            ) : (
              autobusesFiltradosParaMostrar.map((bus) => bus ? (
                <Card 
                  key={bus.id} 
                  className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                    selectedBus === bus.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleBusClick(bus.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn("font-medium", isMobile ? "text-sm" : "text-xs")}>
                      {bus.identificador} - {bus.placa}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenterOnBus(bus);
                        }}
                      >
                        <Focus className="h-3 w-3" />
                      </Button>
                      <Badge variant={bus.estado === 'en_linea' ? 'default' : 'secondary'} className="text-xs">
                        {bus.estado === 'en_linea' ? 'En línea' : 'Fuera línea'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {bus.ocupacionActual}/{bus.capacidadTotal}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gauge className="h-3 w-3" />
                        {bus.velocidad} km/h
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(bus.ultimaTransmision)}
                    </div>
                    <div>{bus.conductor}</div>
                    {bus.ramal && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {bus.tipoServicio} - {bus.ramal}
                      </div>
                    )}
                  </div>
                </Card>
              ) : null)
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  // Componente del contenido del panel de filtros - Memoizado para evitar re-renders
  const FilterPanelContent = useMemo(() => (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-3")}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("font-medium text-muted-foreground", isMobile ? "text-sm" : "text-base")}>Filtros</h3>
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowFilterPanel(false);
              setShowInfoPanel(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className={cn(isMobile ? "flex-1 overflow-hidden" : "")}>
        <ScrollArea className={cn(isMobile ? "h-full" : "h-[calc(100vh-250px)]")}>
          <div className={cn("space-y-3 pr-4", !isMobile && "text-sm")}>
            {/* Placa/Identificador */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Placa o Identificador</Label>
              <Input
                placeholder="Buscar por placa o identificador..."
                value={filtros.placaIdentificador}
                onChange={(e) => setFiltros(prev => ({ ...prev, placaIdentificador: e.target.value }))}
                className={cn(isMobile ? "h-10" : "h-8")}
              />
            </div>

            <Separator />

            {/* Empresa de Transporte */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Empresa de Transporte</Label>
              <div className={cn("space-y-1.5 overflow-y-auto", isMobile ? "max-h-32" : "max-h-20")}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="todos-transporte"
                    checked={filtros.empresasTransporte.includes('todos')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, empresasTransporte: ['todos'] }));
                      } else {
                        setFiltros(prev => ({ ...prev, empresasTransporte: [] }));
                      }
                    }}
                  />
                  <Label htmlFor="todos-transporte" className="text-xs">Todos</Label>
                </div>
                {mockEmpresasTransporte.map((empresa) => (
                  <div key={empresa.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`transporte-${empresa.id}`}
                      checked={filtros.empresasTransporte.includes(empresa.nombre)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltros(prev => ({ 
                            ...prev, 
                            empresasTransporte: prev.empresasTransporte.filter(e => e !== 'todos').concat([empresa.nombre])
                          }));
                        } else {
                          setFiltros(prev => ({ 
                            ...prev, 
                            empresasTransporte: prev.empresasTransporte.filter(e => e !== empresa.nombre)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`transporte-${empresa.id}`} className="text-xs">{empresa.nombre}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Empresa Cliente */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Empresa Cliente</Label>
              <div className={cn("space-y-1.5 overflow-y-auto", isMobile ? "max-h-32" : "max-h-20")}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="todos-cliente"
                    checked={filtros.empresasCliente.includes('todos')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, empresasCliente: ['todos'] }));
                      } else {
                        setFiltros(prev => ({ ...prev, empresasCliente: [] }));
                      }
                    }}
                  />
                  <Label htmlFor="todos-cliente" className="text-xs">Todos</Label>
                </div>
                {mockEmpresasCliente.map((empresa) => (
                  <div key={empresa.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cliente-${empresa.id}`}
                      checked={filtros.empresasCliente.includes(empresa.nombre)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltros(prev => ({ 
                            ...prev, 
                            empresasCliente: prev.empresasCliente.filter(e => e !== 'todos').concat([empresa.nombre])
                          }));
                        } else {
                          setFiltros(prev => ({ 
                            ...prev, 
                            empresasCliente: prev.empresasCliente.filter(e => e !== empresa.nombre)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`cliente-${empresa.id}`} className="text-xs">{empresa.nombre}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tipo de Servicio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tipo de Servicio</Label>
              <div className="space-y-1.5">
                {['todos', 'parque', 'privado', 'especial'].map((tipo) => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${tipo}`}
                      checked={filtros.tiposServicio.includes(tipo)}
                      onCheckedChange={(checked) => {
                        if (tipo === 'todos') {
                          if (checked) {
                            setFiltros(prev => ({ ...prev, tiposServicio: ['todos'] }));
                          } else {
                            setFiltros(prev => ({ ...prev, tiposServicio: [] }));
                          }
                        } else {
                          if (checked) {
                            setFiltros(prev => ({ 
                              ...prev, 
                              tiposServicio: prev.tiposServicio.filter(t => t !== 'todos').concat([tipo])
                            }));
                          } else {
                            setFiltros(prev => ({ 
                              ...prev, 
                              tiposServicio: prev.tiposServicio.filter(t => t !== tipo)
                            }));
                          }
                        }
                      }}
                    />
                    <Label htmlFor={`tipo-${tipo}`} className="text-xs capitalize">{tipo}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Ramales */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Ramales</Label>
              <div className={cn("space-y-1.5 overflow-y-auto", isMobile ? "max-h-32" : "max-h-20")}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="todos-ramales"
                    checked={filtros.ramales.includes('todos')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, ramales: ['todos'] }));
                      } else {
                        setFiltros(prev => ({ ...prev, ramales: [] }));
                      }
                    }}
                  />
                  <Label htmlFor="todos-ramales" className="text-xs">Todos</Label>
                </div>
                {mockRamalesDetallados.map((ramal) => (
                  <div key={ramal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ramal-${ramal.id}`}
                      checked={filtros.ramales.includes(ramal.nombre)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltros(prev => ({ 
                            ...prev, 
                            ramales: prev.ramales.filter(r => r !== 'todos').concat([ramal.nombre])
                          }));
                        } else {
                          setFiltros(prev => ({ 
                            ...prev, 
                            ramales: prev.ramales.filter(r => r !== ramal.nombre)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`ramal-${ramal.id}`} className="text-xs">{ramal.nombre}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Lista de Autobuses Filtrados */}
            {autobusesFiltrados.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Autobuses Encontrados</Label>
                <div className={cn("space-y-1.5 overflow-y-auto", isMobile ? "max-h-40" : "max-h-32")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="todos-autobuses"
                      checked={filtros.autobusesSeleccionados.includes('todos')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltros(prev => ({ ...prev, autobusesSeleccionados: ['todos'] }));
                        } else {
                          setFiltros(prev => ({ ...prev, autobusesSeleccionados: [] }));
                        }
                      }}
                    />
                    <Label htmlFor="todos-autobuses" className="text-xs">Todos ({autobusesFiltrados.length})</Label>
                  </div>
                  {autobusesFiltrados.map((bus) => (
                    <div key={bus.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bus-${bus.id}`}
                        checked={filtros.autobusesSeleccionados.includes(bus.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFiltros(prev => ({ 
                              ...prev, 
                              autobusesSeleccionados: prev.autobusesSeleccionados.filter(b => b !== 'todos').concat([bus.id])
                            }));
                          } else {
                            setFiltros(prev => ({ 
                              ...prev, 
                              autobusesSeleccionados: prev.autobusesSeleccionados.filter(b => b !== bus.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`bus-${bus.id}`} className="text-xs">{bus.identificador} - {bus.placa}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Botones de Acción */}
      <div className={cn("pt-2 border-t bg-background", isMobile ? "space-y-1.5" : "space-y-2")}>
        <Button onClick={handleBuscar} className={cn("w-full text-xs", isMobile ? "h-8" : "h-9")} variant="outline">
          <Search className="h-3 w-3 mr-1" />
          Buscar
        </Button>
        
        <div className={cn("flex", isMobile ? "gap-1.5" : "gap-2")}>
          <Button 
            onClick={handleAplicarFiltro} 
            className={cn("flex-1 text-xs", isMobile ? "h-8" : "h-9")}
            disabled={isTracking || autobusesFiltrados.length === 0}
          >
            <Play className="h-3 w-3 mr-1" />
            {isMobile ? "Aplicar" : "Aplicar Filtro"}
          </Button>
          
          <Button 
            onClick={handleDetener} 
            variant="destructive"
            className={cn("flex-1 text-xs", isMobile ? "h-8" : "h-9")}
            disabled={!isTracking}
          >
            <Square className="h-3 w-3 mr-1" />
            Detener
          </Button>
        </div>
        
        <Button onClick={handleLimpiarFiltros} variant="outline" className={cn("w-full text-xs", isMobile ? "h-8" : "h-9")}>
          <RotateCcw className="h-3 w-3 mr-1" />
          {isMobile ? "Limpiar" : "Limpiar Filtros"}
        </Button>
      </div>
    </div>
  ), [filtros, autobusesFiltrados, isMobile]); // Dependencies for memoization

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex bg-background relative">
        {/* Desktop Panels */}
        {!isMobile && showInfoPanel && !showFilterPanel && !showStopsPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r">
            <CardContent className="p-4 flex-1">
              <InfoPanelContent />
            </CardContent>
          </Card>
        )}

        {!isMobile && showStopsPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r">
            <CardContent className="p-4 flex-1">
              <StopsPanel
                stops={mockStops}
                selectedStops={selectedStops}
                onStopsChange={handleStopsChange}
                onClose={() => setShowStopsPanel(false)}
                isMobile={false}
              />
            </CardContent>
          </Card>
        )}

        {!isMobile && showFilterPanel && (
          <Card className="w-64 lg:w-72 flex flex-col border-r">
            <CardContent className="p-4 flex-1">
              {FilterPanelContent}
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
                  <DrawerTitle>Información de Autobuses</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden px-4 pb-4">
                  <InfoPanelContent />
                </div>
              </DrawerContent>
            </Drawer>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="lg" className="h-12 w-12 p-0">
                  <Map className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Paradas</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden px-4 pb-4">
                  <StopsPanel
                    stops={mockStops}
                    selectedStops={selectedStops}
                    onStopsChange={handleStopsChange}
                    onClose={() => setShowStopsPanel(false)}
                    isMobile={true}
                  />
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
                  {FilterPanelContent}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}

        {/* Mapa */}
        <div className="flex-1 relative">
          {pausedMessage && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[999] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md text-sm max-w-[90%] text-center">
              El rastreo está detenido. Para continuar, retire el cursor del autobús.
            </div>
          )}
          
          {!isMobile && !showInfoPanel && !showFilterPanel && !showStopsPanel && (
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

          <MapContainer
            center={[9.9326, -84.0775]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Mostrar paradas seleccionadas en el mapa */}
            {mockStops
              .filter(stop => selectedStops.includes(stop.id))
              .map((stop) => (
                <Marker
                  key={`stop-${stop.id}`}
                  position={[stop.lat, stop.lng]}
                  icon={createStopIcon(stop.codigo, stop.nombre)}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold text-emerald-600">{stop.codigo}</div>
                      <div className="font-medium">{stop.nombre}</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {stop.provincia}, {stop.canton}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Estado: <span className={stop.estado === 'Activo' ? 'text-emerald-600' : 'text-gray-500'}>
                          {stop.estado}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))
            }
            
            <FitBounds autobuses={autobusesEnRastreo} shouldFit={shouldFitBounds} />
            
            <MapInstanceProvider onMapReady={setMapInstance} />
            
            {autobusesEnRastreo.map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={createBusIcon(bus.identificador, bus.estado, bus.curso)}
                eventHandlers={{
                  click: () => handleBusClick(bus.id),
                  mouseover: () => {
                    if (!isMobile) {
                      mouseOverRef.current = true;
                      setIsTracking(false);
                      setPausedMessage(true);
                    }
                  },
                  mouseout: () => {
                    if (!isMobile && selectedBus !== bus.id) {
                      mouseOverRef.current = false;
                      setIsTracking(true);
                      setPausedMessage(false);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="text-sm space-y-1">
                    <div className="font-semibold text-primary">
                      {bus.identificador} - {bus.placa}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="h-3 w-3" />
                      <span>{bus.velocidad} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{bus.ocupacionActual} - {bus.capacidadTotal}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(bus.ultimaTransmision)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bus.conductor}
                    </div>
                    {bus.ramal && (
                      <div className="text-xs text-primary">
                        {bus.tipoServicio} - {bus.ramal}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
};

export default TiempoReal;