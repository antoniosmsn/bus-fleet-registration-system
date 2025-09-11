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
  dibujarActivo: boolean;
  recorridoFinalizado: boolean;
  onEliminarPunto?: (index: number) => void;
}

// Componente para manejar los clicks en el mapa
const MapClickHandler: React.FC<{ 
  onAgregarPunto: (lat: number, lng: number) => void;
  dibujarActivo: boolean;
  recorridoFinalizado: boolean;
}> = ({ onAgregarPunto, dibujarActivo, recorridoFinalizado }) => {
  useMapEvents({
    click: (e) => {
      // Cuando el botón Dibujar está en ON se pueden marcar puntos
      if (dibujarActivo && !recorridoFinalizado) {
        const { lat, lng } = e.latlng;
        onAgregarPunto(lat, lng);
      }
    },
  });
  return null;
};

// Crear icono personalizado para puntos del recorrido
const createNumberedIcon = (numero: number, finalizado: boolean = false) => {
  const backgroundColor = finalizado ? '#22c55e' : '#ef4444'; // Verde si finalizado, rojo si no
  return L.divIcon({
    className: 'custom-numbered-icon',
    html: `<div style="
      background-color: ${backgroundColor};
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
  onDeshacerUltimo,
  dibujarActivo,
  recorridoFinalizado,
  onEliminarPunto
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
    <div className="h-[350px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={8}
        bounds={bounds}
        className={`h-full w-full ${(dibujarActivo && !recorridoFinalizado) ? 'cursor-crosshair' : 'cursor-default'}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Componente para manejar clicks en el mapa */}
        <MapClickHandler onAgregarPunto={onAgregarPunto} dibujarActivo={dibujarActivo} recorridoFinalizado={recorridoFinalizado} />
        
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
        
        {/* Marcadores de puntos del recorrido - Solo mostrar durante edición */}
        {puntosRecorrido.map((punto, index) => (
          !recorridoFinalizado && (
            <Marker
              key={`punto-${punto.orden}-${index}`}
              position={[punto.lat, punto.lng]}
              icon={createNumberedIcon(punto.orden, recorridoFinalizado)}
            >
              <Popup>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Punto {punto.orden}</strong>
                    <br />
                    <span className="text-gray-600">
                      Punto del recorrido
                    </span>
                    <br />
                    <small>Lat: {punto.lat.toFixed(6)}, Lng: {punto.lng.toFixed(6)}</small>
                  </div>
                  {onEliminarPunto && (
                    <button
                      onClick={() => onEliminarPunto(index)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      Eliminar Punto
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        {/* Polilínea conectando los puntos del recorrido */}
        {puntosRecorrido.length > 1 && (
          <Polyline
            positions={puntosRecorrido.map(p => [p.lat, p.lng] as [number, number])}
            color={recorridoFinalizado ? "#22c55e" : "#ef4444"}
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RutaRecorridoMap;