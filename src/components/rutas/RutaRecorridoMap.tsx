import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PuntoRecorrido {
  lat: number;
  lng: number;
  orden: number;
}

interface Parada {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

interface RutaRecorridoMapProps {
  paradas: Parada[];
  puntosRecorrido: PuntoRecorrido[];
  onAgregarPunto: (lat: number, lng: number) => void;
  onLimpiarRecorrido: () => void;
  onDeshacerUltimo: () => void;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{ onAgregarPunto: (lat: number, lng: number) => void }> = ({ onAgregarPunto }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onAgregarPunto(lat, lng);
    },
  });
  return null;
};

// Crear icono personalizado para puntos del recorrido
const createNumberedIcon = (numero: number) => {
  return L.divIcon({
    className: 'custom-numbered-icon',
    html: `<div style="
      background-color: #ef4444;
      border: 2px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${numero}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const RutaRecorridoMap: React.FC<RutaRecorridoMapProps> = ({
  paradas,
  puntosRecorrido,
  onAgregarPunto,
  onLimpiarRecorrido,
  onDeshacerUltimo
}) => {
  // Centro del mapa en Costa Rica
  const center: [number, number] = [9.7489, -83.7534];

  // Calcular bounds para ajustar el mapa
  const getBounds = () => {
    const allPoints = [
      ...paradas.map(p => [p.lat, p.lng] as [number, number]),
      ...puntosRecorrido.map(p => [p.lat, p.lng] as [number, number])
    ];
    
    if (allPoints.length === 0) return undefined;
    
    return allPoints;
  };

  const bounds = getBounds();

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={8}
        bounds={bounds}
        className="h-full w-full cursor-crosshair"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Componente para manejar clicks en el mapa */}
        <MapClickHandler onAgregarPunto={onAgregarPunto} />
        
        {/* Marcadores de paradas (sin conectar) */}
        {paradas.map((parada) => (
          <Marker
            key={parada.id}
            position={[parada.lat, parada.lng]}
          >
            <Popup>
              <div className="text-sm">
                <strong>{parada.nombre}</strong>
                <br />
                <span className="text-gray-600">Parada de ruta</span>
                <br />
                <small>Lat: {parada.lat.toFixed(6)}, Lng: {parada.lng.toFixed(6)}</small>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Marcadores de puntos del recorrido */}
        {puntosRecorrido.map((punto) => (
          <Marker
            key={`punto-${punto.orden}`}
            position={[punto.lat, punto.lng]}
            icon={createNumberedIcon(punto.orden)}
          >
            <Popup>
              <div className="text-sm">
                <strong>Punto {punto.orden}</strong>
                <br />
                <span className="text-gray-600">Punto del recorrido</span>
                <br />
                <small>Lat: {punto.lat.toFixed(6)}, Lng: {punto.lng.toFixed(6)}</small>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Polilínea roja conectando los puntos del recorrido */}
        {puntosRecorrido.length > 1 && (
          <Polyline
            positions={puntosRecorrido.map(p => [p.lat, p.lng] as [number, number])}
            color="#ef4444"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RutaRecorridoMap;