
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';

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

interface GeocercaMapProps {
  vertices: Vertex[];
  onVerticesChange: (vertices: Vertex[]) => void;
  isDrawingEnabled: boolean;
  existingGeocercas: Geocerca[];
  selectedGeocercaId: string | null;
}

// Fix for Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom drawing component
const DrawingTool = ({ 
  vertices, 
  onVerticesChange, 
  isDrawingEnabled 
}: { 
  vertices: Vertex[], 
  onVerticesChange: (vertices: Vertex[]) => void,
  isDrawingEnabled: boolean
}) => {
  useMapEvents({
    click: (e) => {
      if (!isDrawingEnabled) return;
      
      const newVertex = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      
      onVerticesChange([...vertices, newVertex]);
    }
  });
  
  return null;
};

const GeocercaMap: React.FC<GeocercaMapProps> = ({ 
  vertices, 
  onVerticesChange, 
  isDrawingEnabled, 
  existingGeocercas, 
  selectedGeocercaId 
}) => {
  const polygonRef = useRef<L.Polygon | null>(null);
  const [center, setCenter] = useState<[number, number]>([9.9338, -84.0795]); // San José, Costa Rica

  // Helper function to get random color for polygons
  const getRandomColor = (id: string) => {
    const colors = ['#3388ff', '#ff3333', '#33ff33', '#ff33ff', '#ffff33', '#33ffff'];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  // Helper to handle vertex removal
  const handleVertexRemoval = (index: number) => {
    const updatedVertices = [...vertices];
    updatedVertices.splice(index, 1);
    onVerticesChange(updatedVertices);
  };

  // Fit map to polygon bounds when vertices change
  useEffect(() => {
    if (vertices.length >= 3 && polygonRef.current) {
      const bounds = polygonRef.current.getBounds();
      // polygonRef.current._map?.fitBounds(bounds);
    }
  }, [vertices]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <DrawingTool 
        vertices={vertices} 
        onVerticesChange={onVerticesChange} 
        isDrawingEnabled={isDrawingEnabled} 
      />
      
      {/* Current drawing polygon */}
      {vertices.length >= 3 && (
        <Polygon
          ref={polygonRef}
          positions={vertices}
          pathOptions={{ 
            color: 'blue', 
            weight: 2, 
            fillOpacity: 0.2
          }}
        />
      )}
      
      {/* Show markers for current vertices */}
      {vertices.map((vertex, index) => (
        <Marker
          key={`vertex-${index}`}
          position={[vertex.lat, vertex.lng]}
          eventHandlers={{
            click: () => {
              if (isDrawingEnabled) {
                handleVertexRemoval(index);
              }
            }
          }}
        />
      ))}
      
      {/* Show existing geocercas */}
      {existingGeocercas.map((geocerca) => {
        const isSelected = geocerca.id === selectedGeocercaId;
        return (
          geocerca.vertices.length >= 3 && (
            <Polygon
              key={geocerca.id}
              positions={geocerca.vertices}
              pathOptions={{ 
                color: getRandomColor(geocerca.id),
                weight: isSelected ? 3 : 1.5,
                fillOpacity: isSelected ? 0.3 : 0.1,
                dashArray: isSelected ? undefined : '5, 5'
              }}
            />
          )
        );
      })}
    </MapContainer>
  );
};

export default GeocercaMap;
