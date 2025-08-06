import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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
  Focus
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
import { toast } from '@/hooks/use-toast';

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
      <div style="transform: rotate(${curso}deg); display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
          <path d="M12 2 L20 12 L15 12 L15 20 L9 20 L9 12 L4 12 Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
        </svg>
        <div style="
          position: absolute; 
          top: 26px; 
          left: 50%; 
          transform: translateX(-50%);
          background: ${bgColor};
          border: 1px solid ${color};
          border-radius: 3px;
          padding: 1px 3px;
          font-size: 9px;
          font-weight: bold;
          color: ${color};
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        ">${identificador}</div>
      </div>
    `,
    className: 'custom-bus-marker',
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
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [pausedMessage, setPausedMessage] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState(false);
  
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
  }, [isTracking, updateBusData]);

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

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex bg-background">
        {/* Panel de Información */}
        {showInfoPanel && !showFilterPanel && (
          <Card className="w-80 lg:w-96 flex flex-col border-r">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Autobuses en Tiempo Real</CardTitle>
                <div className="flex gap-2">
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
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  En línea: {autobusesEnRastreo.filter(b => b.estado === 'en_linea').length}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  Fuera línea: {autobusesEnRastreo.filter(b => b.estado === 'fuera_linea').length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2 p-4">
                  {autobusesEnRastreo.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay autobuses disponibles con los filtros seleccionados.
                    </p>
                  ) : (
                    autobusesEnRastreo.map((bus) => (
                      <Card 
                        key={bus.id} 
                        className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                          selectedBus === bus.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleBusClick(bus.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm">
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
                            <Badge variant={bus.estado === 'en_linea' ? 'default' : 'secondary'}>
                              {bus.estado === 'en_linea' ? 'En línea' : 'Fuera línea'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(bus.ultimaTransmision)}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {bus.ocupacionActual} - {bus.capacidadTotal}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3 w-3" />
                            {bus.velocidad} km/h
                          </div>
                          
                          <div className="text-xs">{bus.conductor}</div>
                          
                          {bus.ramal && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {bus.tipoServicio} - {bus.ramal}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Panel de Filtros */}
        {showFilterPanel && (
          <Card className="w-80 lg:w-96 flex flex-col border-r">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtros</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-4">
                {/* Placa/Identificador */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Placa o Identificador</Label>
                  <Input
                    placeholder="Buscar por placa o identificador..."
                    value={filtros.placaIdentificador}
                    onChange={(e) => setFiltros(prev => ({ ...prev, placaIdentificador: e.target.value }))}
                  />
                </div>

                {/* Empresa de Transporte */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Empresa de Transporte</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
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
                      <Label htmlFor="todos-transporte" className="text-sm">Todos</Label>
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
                        <Label htmlFor={`transporte-${empresa.id}`} className="text-sm">{empresa.nombre}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tipo de Servicio */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo de Servicio</Label>
                  <div className="space-y-2">
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
                        <Label htmlFor={`tipo-${tipo}`} className="text-sm capitalize">{tipo}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Lista de Autobuses Filtrados */}
                {autobusesFiltrados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Autobuses Encontrados</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
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
                        <Label htmlFor="todos-autobuses" className="text-sm">Todos ({autobusesFiltrados.length})</Label>
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
                          <Label htmlFor={`bus-${bus.id}`} className="text-sm">{bus.identificador} - {bus.placa}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Botones de Acción */}
              <div className="space-y-2">
                <Button onClick={handleBuscar} className="w-full" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAplicarFiltro} 
                    className="flex-1"
                    disabled={isTracking || autobusesFiltrados.length === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Aplicar Filtro
                  </Button>
                  
                  <Button 
                    onClick={handleDetener} 
                    variant="destructive"
                    className="flex-1"
                    disabled={!isTracking}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Detener
                  </Button>
                </div>
                
                <Button onClick={handleLimpiarFiltros} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mapa */}
        <div className="flex-1 relative">
          {pausedMessage && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md text-sm">
              El rastreo está detenido. Para continuar, retire el cursor del autobús.
            </div>
          )}
          
          {!showInfoPanel && !showFilterPanel && (
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
            center={[9.9326, -84.0775]} // San José, Costa Rica
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
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
                    mouseOverRef.current = true;
                    setIsTracking(false);
                    setPausedMessage(true);
                  },
                  mouseout: () => {
                    if (selectedBus !== bus.id) {
                      mouseOverRef.current = false;
                      setIsTracking(true);
                      setPausedMessage(false);
                    }
                  }
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
};

export default TiempoReal;