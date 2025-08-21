import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlarmaRecord, TipoAlarma } from '@/types/alarma-conductor';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AlarmasConductorMapProps {
  alarmas: AlarmaRecord[];
  className?: string;
}

const AlarmasConductorMap: React.FC<AlarmasConductorMapProps> = ({ alarmas, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup>(new L.LayerGroup());

  // Crear iconos personalizados para cada tipo de alarma
  const createCustomIcon = (tipo: TipoAlarma) => {
    const iconConfig = {
      'Exceso de velocidad': { color: '#ef4444', icon: '⚡' },
      'Salida de geocerca': { color: '#f97316', icon: '🚪' },
      'Entrada no autorizada': { color: '#dc2626', icon: '🚫' },
      'Parada prolongada': { color: '#eab308', icon: '⏰' },
      'Desvío de ruta': { color: '#f97316', icon: '↪️' },
      'Conductor no autorizado': { color: '#dc2626', icon: '👤' },
      'Puerta abierta en movimiento': { color: '#f97316', icon: '🚪' },
      'Pánico activado': { color: '#dc2626', icon: '🆘' },
      'Falla de comunicación': { color: '#6b7280', icon: '📶' },
      'Batería baja': { color: '#eab308', icon: '🔋' }
    };

    const config = iconConfig[tipo] || { color: '#6b7280', icon: '⚠️' };
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${config.color};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">${config.icon}</div>
      `,
      className: 'alarma-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -11]
    });
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [9.748917, -83.753428], // Costa Rica
      zoom: 10,
      zoomControl: false,
      attributionControl: true
    });

    // Agregar capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map.current);

    // Agregar controles
    L.control.zoom({ position: 'topright' }).addTo(map.current);
    L.control.scale({ position: 'bottomright' }).addTo(map.current);

    // Agregar layer de marcadores
    markersLayer.current.addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambien las alarmas
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores existentes
    markersLayer.current.clearLayers();

    // Filtrar alarmas con coordenadas válidas
    const alarmasValidas = alarmas.filter(a => 
      a.lat !== null && 
      a.lng !== null && 
      a.lat !== 0 && 
      a.lng !== 0 &&
      Math.abs(a.lat) <= 90 && 
      Math.abs(a.lng) <= 180
    );

    console.log('Alarmas recibidas:', alarmas.length);
    console.log('Alarmas válidas:', alarmasValidas.length);

    if (alarmasValidas.length === 0) {
      console.log('No hay alarmas válidas para mostrar en el mapa');
      return;
    }

    // Crear marcadores
    alarmasValidas.forEach((alarma, index) => {
      const marker = L.marker([alarma.lat!, alarma.lng!], {
        icon: createCustomIcon(alarma.tipoAlarma)
      });

      // Crear popup con información
      const popupContent = `
        <div class="p-3 min-w-[280px]">
          <div class="font-bold text-sm mb-2 text-center text-red-600">
            🚨 ${alarma.tipoAlarma}
          </div>
          <div class="space-y-1 text-xs">
            <div class="mb-2 p-2 bg-gray-100 rounded">
              <strong>Motivo:</strong> ${alarma.motivo}
            </div>
            <div><strong>Fecha:</strong> ${new Date(alarma.fechaHoraGeneracion).toLocaleString('es-CR')}</div>
            <div><strong>Conductor:</strong> ${alarma.conductorNombre}</div>
            <div><strong>Código:</strong> ${alarma.conductorCodigo}</div>
            <div><strong>Autobús:</strong> ${alarma.placa} (ID: ${alarma.busId})</div>
            ${alarma.ruta ? `<div><strong>Ruta:</strong> ${alarma.ruta}</div>` : ''}
            <div><strong>Empresa:</strong> ${alarma.empresaTransporte}</div>
            ${alarma.empresaCliente ? `<div><strong>Cliente:</strong> ${alarma.empresaCliente}</div>` : ''}
            <div><strong>Ubicación:</strong> ${alarma.lat!.toFixed(6)}, ${alarma.lng!.toFixed(6)}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'alarma-popup'
      });

      markersLayer.current.addLayer(marker);
    });

    // Ajustar vista del mapa para mostrar todas las alarmas
    if (alarmasValidas.length > 0) {
      const bounds = L.latLngBounds(alarmasValidas.map(a => [a.lat!, a.lng!]));
      map.current.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 15 
      });
    }

    console.log('Marcadores de alarma agregados:', alarmasValidas.length);
  }, [alarmas]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg" 
        style={{ 
          minHeight: '400px'
        }} 
      />
      
      {/* Leyenda */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-[220px]">
        <div className="text-xs font-semibold mb-2">Tipos de Alarma</div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {[
            { tipo: 'Exceso de velocidad' as TipoAlarma, color: '#ef4444', icon: '⚡' },
            { tipo: 'Salida de geocerca' as TipoAlarma, color: '#f97316', icon: '🚪' },
            { tipo: 'Entrada no autorizada' as TipoAlarma, color: '#dc2626', icon: '🚫' },
            { tipo: 'Parada prolongada' as TipoAlarma, color: '#eab308', icon: '⏰' },
            { tipo: 'Desvío de ruta' as TipoAlarma, color: '#f97316', icon: '↪️' },
            { tipo: 'Conductor no autorizado' as TipoAlarma, color: '#dc2626', icon: '👤' },
            { tipo: 'Puerta abierta en movimiento' as TipoAlarma, color: '#f97316', icon: '🚪' },
            { tipo: 'Pánico activado' as TipoAlarma, color: '#dc2626', icon: '🆘' },
            { tipo: 'Falla de comunicación' as TipoAlarma, color: '#6b7280', icon: '📶' },
            { tipo: 'Batería baja' as TipoAlarma, color: '#eab308', icon: '🔋' }
          ].map(({ tipo, color, icon }) => (
            <div key={tipo} className="flex items-center gap-2 text-xs">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: color, fontSize: '8px' }}
              >
                {icon}
              </div>
              <span className="truncate" title={tipo}>{tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estado vacío */}
      {alarmas.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center p-6">
            <div className="text-muted-foreground text-sm mb-2">
              Selecciona alarmas para verlas en el mapa
            </div>
            <div className="text-xs text-muted-foreground">
              Los marcadores aparecerán aquí cuando selecciones elementos de la lista
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      {alarmas.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 rounded px-2 py-1 text-xs text-muted-foreground z-[1000]">
          {alarmas.length} alarma{alarmas.length !== 1 ? 's' : ''} seleccionada{alarmas.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default AlarmasConductorMap;