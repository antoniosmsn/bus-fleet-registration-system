
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icon issue - more comprehensive fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Parada {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

interface Vertex {
  lat: number;
  lng: number;
}

interface Geocerca {
  id: string;
  nombre: string;
  vertices: Vertex[];
  active: boolean;
}

interface RutaMapProps {
  paradas: Parada[];
  geocercas: Geocerca[];
}

// Helper function to get random color for polygons
const getRandomColor = (id: string) => {
  const colors = ['#3388ff', '#ff3333', '#33ff33', '#ff33ff', '#ffff33', '#33ffff'];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
};

export const RutaMap: React.FC<RutaMapProps> = ({ paradas, geocercas }) => {
  // Center the map initially on Costa Rica
  const center: [number, number] = [9.9333, -84.0833];
  
  // Get bounds for the map to fit all elements
  const getBounds = () => {
    const points = [
      ...paradas.map(p => [p.lat, p.lng]),
      ...geocercas.flatMap(g => g.vertices.map(v => [v.lat, v.lng]))
    ] as [number, number][];
    
    if (points.length === 0) return null;
    
    try {
      return L.latLngBounds(points);
    } catch (error) {
      console.warn('Error creating bounds:', error);
      return null;
    }
  };

  // Create polyline from stops in order
  const rutaPolyline = paradas.length >= 2 ? 
    paradas.map(p => [p.lat, p.lng] as [number, number]) : 
    [];

  return (
    <MapContainer 
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      bounds={getBounds() || undefined}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render geocercas */}
      {geocercas.map((geocerca) => (
        geocerca.vertices.length >= 3 && (
          <Polygon
            key={geocerca.id}
            positions={geocerca.vertices}
            pathOptions={{ 
              color: getRandomColor(geocerca.id),
              weight: 2,
              fillOpacity: 0.2
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{geocerca.nombre}</strong>
                <p>Estado: {geocerca.active ? 'Activo' : 'Inactivo'}</p>
              </div>
            </Popup>
          </Polygon>
        )
      ))}
      
      {/* Render the route line between stops */}
      {rutaPolyline.length >= 2 && (
        <Polyline 
          positions={rutaPolyline} 
          pathOptions={{ color: 'blue', weight: 3, dashArray: '5, 5' }}
        />
      )}
      
      {/* Render paradas markers - using only default icons to avoid errors */}
      {paradas.map((parada, index) => {
        const isStart = index === 0;
        const isEnd = index === paradas.length - 1;
        
        return (
          <Marker
            key={parada.id}
            position={[parada.lat, parada.lng]}
          >
            <Popup>
              <div className="text-sm">
                <strong>{parada.nombre}</strong>
                <p>
                  {isStart && '🚩 Parada Inicial'}
                  {isEnd && '🏁 Parada Final'}
                  {!isStart && !isEnd && `Parada #${index + 1}`}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
