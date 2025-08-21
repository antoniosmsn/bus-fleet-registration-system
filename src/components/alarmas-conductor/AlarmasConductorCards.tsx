import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Bus, 
  Route,
  Building2,
  MapPin,
  Shield,
  DoorOpen,
  Phone,
  Battery,
  Navigation2,
  ShieldAlert
} from 'lucide-react';
import { AlarmaRecord, TipoAlarma } from '@/types/alarma-conductor';

interface AlarmasConductorCardsProps {
  alarmas: AlarmaRecord[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const AlarmasConductorCards: React.FC<AlarmasConductorCardsProps> = ({
  alarmas,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  onClearAll
}) => {
  const getIconForTipo = (tipo: TipoAlarma) => {
    switch (tipo) {
      case 'Exceso de velocidad':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Salida de geocerca':
        return <Navigation2 className="h-4 w-4 text-orange-600" />;
      case 'Entrada no autorizada':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'Parada prolongada':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Desvío de ruta':
        return <Route className="h-4 w-4 text-orange-600" />;
      case 'Conductor no autorizado':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'Puerta abierta en movimiento':
        return <DoorOpen className="h-4 w-4 text-orange-600" />;
      case 'Pánico activado':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Falla de comunicación':
        return <Phone className="h-4 w-4 text-gray-600" />;
      case 'Batería baja':
        return <Battery className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeVariant = (tipo: TipoAlarma) => {
    switch (tipo) {
      case 'Exceso de velocidad':
      case 'Entrada no autorizada':
      case 'Conductor no autorizado':
      case 'Pánico activado':
        return 'destructive';
      case 'Salida de geocerca':
      case 'Desvío de ruta':
      case 'Puerta abierta en movimiento':
        return 'default';
      case 'Parada prolongada':
      case 'Batería baja':
        return 'secondary';
      case 'Falla de comunicación':
        return 'outline';
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

  const generateAlarmaId = (alarma: AlarmaRecord, index: number) => {
    return `${alarma.busId}-${alarma.fechaHoraGeneracion}-${index}`;
  };

  if (alarmas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No hay alarmas de conductor
        </h3>
        <p className="text-sm text-muted-foreground">
          Ajusta los filtros para encontrar alarmas.
        </p>
      </div>
    );
  };

  const allSelected = alarmas.length > 0 && alarmas.every((_, index) => 
    selectedIds.has(generateAlarmaId(alarmas[index], index))
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
              ? `${selectedIds.size} de ${alarmas.length} seleccionadas`
              : `${alarmas.length} alarmas`
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
        {alarmas.map((alarma, index) => {
          const alarmaId = generateAlarmaId(alarma, index);
          const isSelected = selectedIds.has(alarmaId);
          
          return (
            <Card 
              key={alarmaId}
              className={`transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      onSelectionChange(alarmaId, checked as boolean)
                    }
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {/* Header de la alarma */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIconForTipo(alarma.tipoAlarma)}
                        <Badge variant={getBadgeVariant(alarma.tipoAlarma)}>
                          {alarma.tipoAlarma}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatearFecha(alarma.fechaHoraGeneracion)}
                      </span>
                    </div>

                    {/* Motivo de la alarma */}
                    <div className="mb-3">
                      <p className="text-sm text-foreground font-medium mb-1">Motivo:</p>
                      <p className="text-sm text-muted-foreground">{alarma.motivo}</p>
                    </div>

                    {/* Información principal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Bus className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{alarma.placa}</span>
                        <span className="text-muted-foreground">ID: {alarma.busId}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{alarma.conductorNombre}</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-medium">{alarma.conductorCodigo}</span>
                      </div>
                    </div>

                    {/* Información secundaria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {alarma.ruta && (
                        <div className="flex items-center gap-1">
                          <Route className="h-3 w-3" />
                          <span>Ruta: {alarma.ruta}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{alarma.empresaTransporte}</span>
                      </div>

                      {alarma.empresaCliente && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>Cliente: {alarma.empresaCliente}</span>
                        </div>
                      )}

                      {alarma.lat !== null && alarma.lng !== null && alarma.lat !== 0 && alarma.lng !== 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alarma.lat.toFixed(6)}, {alarma.lng.toFixed(6)}</span>
                        </div>
                      )}
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

export default AlarmasConductorCards;