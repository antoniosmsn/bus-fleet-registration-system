
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  estado: string;
  lat: number;
  lng: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface ParadaMapProps {
  paradasExistentes: Parada[];
  selectedLocation: Location | null;
  onLocationChange: (location: Location | null) => void;
  isDraggingEnabled?: boolean;
  onParadaLocationChange?: (parada: Parada, newLocation: Location) => void;
  onParadaSelect?: (parada: Parada) => void;
}

// Fix for Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Iconos personalizados para diferentes estados
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const inactiveIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para manejar los eventos del mapa
const LocationSelector = ({ 
  onLocationChange 
}: { 
  onLocationChange: (location: Location) => void 
}) => {
  useMapEvents({
    click: (e) => {
      onLocationChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });
  
  return null;
};

// Distancia mínima entre paradas en metros (para visualizar círculo en mapa)
const DISTANCIA_MINIMA = 25;

const ParadaMap: React.FC<ParadaMapProps> = ({ 
  paradasExistentes, 
  selectedLocation,
  onLocationChange,
  isDraggingEnabled = false,
  onParadaLocationChange,
  onParadaSelect
}) => {
  const center: [number, number] = [9.9338, -84.0795]; // San José, Costa Rica

  // Handle marker drag end
  const handleMarkerDragEnd = (event: L.DragEndEvent) => {
    const marker = event.target;
    const position = marker.getLatLng();
    onLocationChange({
      lat: position.lat,
      lng: position.lng
    });
  };

  // Handle parada marker drag end
  const handleParadaMarkerDragEnd = (parada: Parada, event: L.DragEndEvent) => {
    if (onParadaLocationChange) {
      const marker = event.target;
      const position = marker.getLatLng();
      onParadaLocationChange(parada, {
        lat: position.lat,
        lng: position.lng
      });
    }
  };

  // New handler for parada selection from the map
  const handleParadaClick = (parada: Parada) => {
    if (onParadaSelect) {
      onParadaSelect(parada);
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <LocationSelector onLocationChange={onLocationChange} />
      
      {/* Paradas existentes */}
      {paradasExistentes.map((parada) => (
        <React.Fragment key={parada.id || parada.codigo}>
          <Marker
            position={[parada.lat, parada.lng]}
            icon={parada.estado === 'Activo' ? activeIcon : inactiveIcon}
            draggable={!!onParadaLocationChange}
            eventHandlers={{
              dragend: (e) => handleParadaMarkerDragEnd(parada, e),
              click: () => handleParadaClick(parada)
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{parada.codigo}</p>
                <p>{parada.nombre}</p>
                <p className="text-xs mt-1">
                  {parada.estado}
                </p>
                {onParadaLocationChange && (
                  <p className="text-xs mt-1 italic text-blue-500">
                    Arrastra este pin para editar la ubicación
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
          
          {/* Círculo de distancia mínima */}
          <Circle 
            center={[parada.lat, parada.lng]} 
            radius={DISTANCIA_MINIMA} 
            pathOptions={{
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.1
            }} 
          />
        </React.Fragment>
      ))}
      
      {/* Ubicación seleccionada */}
      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={selectedLocationIcon}
          draggable={isDraggingEnabled}
          eventHandlers={{
            dragend: handleMarkerDragEnd
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">Nueva parada</p>
              <p className="text-xs mt-1">
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
              {isDraggingEnabled && (
                <p className="text-xs mt-1 italic text-blue-500">
                  Arrastra este pin para ajustar la ubicación
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default ParadaMap;
