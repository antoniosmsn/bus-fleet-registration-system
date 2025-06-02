
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton?: string;
  distrito?: string;
  sector?: string;
  estado: string;
  lat: number;
  lng: number;
}

interface ParadasMapProps {
  paradas: Parada[];
}

// Custom icons for active and inactive stops
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

const ParadasMap: React.FC<ParadasMapProps> = ({ paradas }) => {
  // Center the map on Costa Rica
  const center: [number, number] = [9.9333, -84.0833];

  return (
    <div className="bg-white rounded-md shadow p-2 h-full">
      <div className="mb-2 text-sm text-gray-600 flex items-center justify-between">
        <span className="font-medium">Mapa de Paradas</span>
        <span className="text-xs">Haz clic en el mapa para agregar o arrastrar pins para editarlos</span>
      </div>
      <div className="h-[calc(100%-2rem)]">
        <MapContainer 
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {paradas.map((parada) => (
            <Marker
              key={parada.id}
              position={[parada.lat, parada.lng]}
              icon={parada.estado === 'Activo' ? activeIcon : inactiveIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-base mb-1">{parada.nombre}</div>
                  <div className="space-y-1">
                    <div><span className="font-medium">Código:</span> {parada.codigo}</div>
                    <div><span className="font-medium">Provincia:</span> {parada.provincia}</div>
                    {parada.canton && (
                      <div><span className="font-medium">Cantón:</span> {parada.canton}</div>
                    )}
                    {parada.distrito && (
                      <div><span className="font-medium">Distrito:</span> {parada.distrito}</div>
                    )}
                    {parada.sector && (
                      <div><span className="font-medium">Sector:</span> {parada.sector}</div>
                    )}
                    <div>
                      <span className="font-medium">Estado:</span>{' '}
                      <span className={parada.estado === 'Activo' ? 'text-green-600' : 'text-gray-500'}>
                        {parada.estado}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ParadasMap;
