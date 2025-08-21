import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TelemetriaRecord, TipoRegistro } from '@/types/telemetria';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TelemetriaMapProps {
  registros: TelemetriaRecord[];
  className?: string;
}

const TelemetriaMap: React.FC<TelemetriaMapProps> = ({ registros, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());

  // Definir iconos para cada tipo de registro
  const createIcon = (tipo: TipoRegistro) => {
    const colors = {
      'Entrada a ruta': '#22c55e',        // green
      'Salida de ruta': '#ef4444',        // red
      'Paso por parada': '#3b82f6',       // blue
      'Exceso de velocidad': '#f59e0b',   // orange
      'Grabación por tiempo': '#8b5cf6',  // purple
      'Grabación por curso': '#6366f1'    // indigo
    };

    const color = colors[tipo] || '#6b7280';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        "></div>
      `,
      className: 'custom-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Inicializar el mapa centrado en Costa Rica con todas las interacciones habilitadas
    map.current = L.map(mapContainer.current, {
      center: [9.748917, -83.753428],
      zoom: 10,
      zoomControl: false, // Disabled default zoom control to avoid duplicates
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      boxZoom: true,
      keyboard: true,
      zoomSnap: 1,
      zoomDelta: 1
    });

    // Agregar tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 3
    }).addTo(map.current);

    // Agregar controles de navegación en posición personalizada
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Agregar control de escala
    L.control.scale({
      position: 'bottomright'
    }).addTo(map.current);

    // Agregar el layer group para los marcadores
    markersRef.current.addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambien los registros
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores existentes
    markersRef.current.clearLayers();

    // Filtrar registros con coordenadas válidas
    const registrosConCoordenadas = registros.filter(r => r.lat && r.lng);

    if (registrosConCoordenadas.length === 0) return;

    // Agregar marcadores
    registrosConCoordenadas.forEach((registro, index) => {
      if (!registro.lat || !registro.lng) return;

      const marker = L.marker([registro.lat, registro.lng], {
        icon: createIcon(registro.tipoRegistro)
      });

      // Crear popup con información del registro
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="font-semibold text-sm mb-2">${registro.tipoRegistro}</div>
          <div class="space-y-1 text-xs">
            <div><strong>Autobús:</strong> ${registro.placa} (ID: ${registro.busId})</div>
            <div><strong>Conductor:</strong> ${registro.conductorNombre} (${registro.conductorCodigo})</div>
            <div><strong>Fecha:</strong> ${new Date(registro.fechaHoraUtc).toLocaleString('es-CR')}</div>
            <div><strong>Velocidad:</strong> ${registro.velocidadKmH} km/h</div>
            <div><strong>Pasajeros:</strong> ${registro.pasajeros} (${registro.espaciosDisponibles} disponibles)</div>
            ${registro.ruta ? `<div><strong>Ruta:</strong> ${registro.ruta}</div>` : ''}
            ${registro.parada ? `<div><strong>Parada:</strong> ${registro.parada}</div>` : ''}
            ${registro.geocerca ? `<div><strong>Geocerca:</strong> ${registro.geocerca}</div>` : ''}
            <div><strong>Empresa:</strong> ${registro.empresaTransporte}</div>
            ${registro.empresaCliente ? `<div><strong>Cliente:</strong> ${registro.empresaCliente}</div>` : ''}
            <div><strong>Coordenadas:</strong> ${registro.lat.toFixed(6)}, ${registro.lng.toFixed(6)}</div>
            <div><strong>Dirección:</strong> ${registro.direccion}°</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.addLayer(marker);
    });

    // Ajustar vista del mapa para mostrar todos los marcadores
    if (registrosConCoordenadas.length > 0) {
      const group = new L.FeatureGroup(Object.values(markersRef.current.getLayers()));
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        map.current.fitBounds(bounds.pad(0.1), { maxZoom: 15 });
      }
    }
  }, [registros]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg" 
        style={{ 
          minHeight: '400px',
          cursor: 'grab'
        }} 
      />
      
      {/* Leyenda */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-[180px]">
        <div className="text-xs font-semibold mb-2">Tipos de Registro</div>
        <div className="space-y-1">
          {[
            { tipo: 'Entrada a ruta' as TipoRegistro, color: '#22c55e' },
            { tipo: 'Salida de ruta' as TipoRegistro, color: '#ef4444' },
            { tipo: 'Paso por parada' as TipoRegistro, color: '#3b82f6' },
            { tipo: 'Exceso de velocidad' as TipoRegistro, color: '#f59e0b' },
            { tipo: 'Grabación por tiempo' as TipoRegistro, color: '#8b5cf6' },
            { tipo: 'Grabación por curso' as TipoRegistro, color: '#6366f1' }
          ].map(({ tipo, color }) => (
            <div key={tipo} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span>{tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {registros.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              Selecciona registros para verlos en el mapa
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetriaMap;