import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Clock, 
  User, 
  Bus, 
  Gauge, 
  Users, 
  Building2, 
  Navigation,
  AlertTriangle,
  Route,
  PlayCircle,
  StopCircle
} from 'lucide-react';
import { TelemetriaRecord, TipoRegistro } from '@/types/telemetria';

interface TelemetriaCardsProps {
  registros: TelemetriaRecord[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const TelemetriaCards: React.FC<TelemetriaCardsProps> = ({
  registros,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  onClearAll
}) => {
  const getIconForTipo = (tipo: TipoRegistro) => {
    switch (tipo) {
      case 'Entrada a ruta':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'Salida de ruta':
        return <StopCircle className="h-4 w-4 text-red-600" />;
      case 'Paso por parada':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      case 'Exceso de velocidad':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Grabación por tiempo':
        return <Clock className="h-4 w-4 text-purple-600" />;
      case 'Grabación por curso':
        return <Route className="h-4 w-4 text-indigo-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeVariant = (tipo: TipoRegistro) => {
    switch (tipo) {
      case 'Entrada a ruta':
        return 'default';
      case 'Salida de ruta':
        return 'destructive';
      case 'Paso por parada':
        return 'default';
      case 'Exceso de velocidad':
        return 'destructive';
      case 'Grabación por tiempo':
        return 'secondary';
      case 'Grabación por curso':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatearFecha = (fechaUtc: string) => {
    const fecha = new Date(fechaUtc);
    return fecha.toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generateRecordId = (record: TelemetriaRecord, index: number) => {
    return `${record.busId}-${record.fechaHoraUtc}-${index}`;
  };

  if (registros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No hay registros de telemetría
        </h3>
        <p className="text-sm text-muted-foreground">
          Ajusta los filtros para encontrar registros.
        </p>
      </div>
    );
  }

  const allSelected = registros.length > 0 && registros.every((_, index) => 
    selectedIds.has(generateRecordId(registros[index], index))
  );

  return (
    <div className="space-y-3">
      {/* Header de selección */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onClearAll();
              }
            }}
          />
          <span className="text-sm font-medium">
            {selectedIds.size > 0 
              ? `${selectedIds.size} de ${registros.length} seleccionados`
              : `${registros.length} registros`
            }
          </span>
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar selección
          </button>
        )}
      </div>

      {/* Lista de cards */}
      <div className="grid gap-3">
        {registros.map((registro, index) => {
          const recordId = generateRecordId(registro, index);
          const isSelected = selectedIds.has(recordId);
          
          return (
            <Card 
              key={recordId}
              className={`transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      onSelectionChange(recordId, checked as boolean)
                    }
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {/* Header del registro */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIconForTipo(registro.tipoRegistro)}
                        <Badge variant={getBadgeVariant(registro.tipoRegistro)}>
                          {registro.tipoRegistro}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatearFecha(registro.fechaHoraUtc)}
                      </span>
                    </div>

                    {/* Información principal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Bus className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{registro.placa}</span>
                        <span className="text-muted-foreground">ID: {registro.busId}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{registro.conductorNombre}</span>
                        <span className="text-muted-foreground">({registro.conductorCodigo})</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <Gauge className="h-3 w-3 text-muted-foreground" />
                        <span>{registro.velocidadKmH} km/h</span>
                      </div>
                    </div>

                    {/* Información secundaria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {registro.ruta && (
                        <div className="flex items-center gap-1">
                          <Route className="h-3 w-3" />
                          <span>{registro.ruta}</span>
                          {registro.sentido && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              {registro.sentido}
                            </Badge>
                          )}
                        </div>
                      )}

                      {registro.parada && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{registro.parada}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{registro.pasajeros} pasajeros</span>
                        <span>({registro.espaciosDisponibles} disponibles)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{registro.empresaTransporte}</span>
                      </div>

                      {registro.empresaCliente && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>Cliente: {registro.empresaCliente}</span>
                        </div>
                      )}

                      {registro.geocerca && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          <span>Geocerca: {registro.geocerca}</span>
                        </div>
                      )}

                      {registro.lat && registro.lng && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{registro.lat.toFixed(6)}, {registro.lng.toFixed(6)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        <span>Dirección: {registro.direccion}°</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TelemetriaCards;