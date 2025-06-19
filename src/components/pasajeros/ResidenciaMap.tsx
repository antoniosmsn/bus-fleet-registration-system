
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ResidenciaMapProps {
  position?: [number, number];
  onPositionChange: (position: [number, number]) => void;
}

// Component to handle map clicks
const MapClickHandler = ({ onPositionChange }: { onPositionChange: (position: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onPositionChange([lat, lng]);
    },
  });
  return null;
};

const ResidenciaMap: React.FC<ResidenciaMapProps> = ({ position, onPositionChange }) => {
  const defaultCenter: [number, number] = [9.7489, -83.7534]; // Costa Rica center
  const mapCenter = position || defaultCenter;

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={position ? 15 : 8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPositionChange={onPositionChange} />
        {position && (
          <Marker position={position} />
        )}
      </MapContainer>
      <p className="text-sm text-gray-500 mt-2">
        Haga clic en el mapa para seleccionar la ubicación de la residencia
      </p>
    </div>
  );
};

export default ResidenciaMap;
