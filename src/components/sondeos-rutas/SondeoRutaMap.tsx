import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Undo, Trash2 } from 'lucide-react';
import { PuntoTrazado } from '@/types/sondeo-ruta';

// Fix Leaflet icon issue
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SondeoRutaMapProps {
  puntos: PuntoTrazado[];
  onPuntosChange: (puntos: PuntoTrazado[]) => void;
  isDrawingEnabled: boolean;
  soloLectura?: boolean;
}

const createNumberedIcon = (numero: number, isEditable: boolean) => {
  return divIcon({
    html: `<div style="background-color: ${isEditable ? '#ef4444' : '#22c55e'}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${numero}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const MapClickHandler = ({ 
  onAgregarPunto, 
  isEnabled 
}: { 
  onAgregarPunto: (lat: number, lng: number) => void;
  isEnabled: boolean;
}) => {
  useMapEvents({
    click: (e) => {
      if (isEnabled) {
        onAgregarPunto(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const SondeoRutaMap = ({ 
  puntos, 
  onPuntosChange, 
  isDrawingEnabled,
  soloLectura = false
}: SondeoRutaMapProps) => {
  const [center] = useState<LatLngExpression>([9.9281, -84.0907]); // Costa Rica center

  const handleAgregarPunto = (lat: number, lng: number) => {
    if (soloLectura) return;
    const nuevoPunto: PuntoTrazado = {
      lat,
      lng,
      orden: puntos.length + 1
    };
    onPuntosChange([...puntos, nuevoPunto]);
  };

  const handleDeshacer = () => {
    if (puntos.length > 0 && !soloLectura) {
      onPuntosChange(puntos.slice(0, -1));
    }
  };

  const handleLimpiar = () => {
    if (!soloLectura) {
      onPuntosChange([]);
    }
  };

  const handleEliminarPunto = (index: number) => {
    if (soloLectura) return;
    const nuevosPuntos = puntos.filter((_, i) => i !== index);
    // Reordenar
    const puntosReordenados = nuevosPuntos.map((p, i) => ({ ...p, orden: i + 1 }));
    onPuntosChange(puntosReordenados);
  };

  const polylinePositions: LatLngExpression[] = puntos.map(p => [p.lat, p.lng]);

  return (
    <div className="space-y-4">
      {!soloLectura && isDrawingEnabled && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeshacer}
            disabled={puntos.length === 0}
          >
            <Undo className="h-4 w-4 mr-2" />
            Deshacer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLimpiar}
            disabled={puntos.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <div className="text-sm text-muted-foreground flex items-center ml-4">
            Puntos marcados: {puntos.length}
            {puntos.length < 2 && puntos.length > 0 && (
              <span className="text-destructive ml-2">(Mínimo 2 puntos requeridos)</span>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden" style={{ height: '500px' }}>
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%', cursor: isDrawingEnabled && !soloLectura ? 'crosshair' : 'grab' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!soloLectura && isDrawingEnabled && (
            <MapClickHandler 
              onAgregarPunto={handleAgregarPunto}
              isEnabled={isDrawingEnabled}
            />
          )}

          {puntos.length > 1 && (
            <Polyline
              positions={polylinePositions}
              color={isDrawingEnabled && !soloLectura ? "#ef4444" : "#22c55e"}
              weight={4}
              opacity={0.7}
            />
          )}

          {puntos.map((punto, index) => (
            <Marker
              key={index}
              position={[punto.lat, punto.lng]}
              icon={createNumberedIcon(punto.orden, isDrawingEnabled && !soloLectura)}
              eventHandlers={{
                click: () => {
                  if (isDrawingEnabled && !soloLectura) {
                    handleEliminarPunto(index);
                  }
                }
              }}
            />
          ))}
        </MapContainer>
      </div>

      {isDrawingEnabled && !soloLectura && puntos.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Haz clic en un marcador para eliminarlo del trazado.
        </p>
      )}
    </div>
  );
};
