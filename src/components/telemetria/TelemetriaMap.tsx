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
  const markersLayer = useRef<L.LayerGroup>(new L.LayerGroup());

  // Crear iconos personalizados para cada tipo de registro
  const createCustomIcon = (tipo: TipoRegistro) => {
    const iconConfig = {
      'Entrada a ruta': { color: '#22c55e', icon: '→' },
      'Salida de ruta': { color: '#ef4444', icon: '←' },
      'Paso por parada': { color: '#3b82f6', icon: '●' },
      'Exceso de velocidad': { color: '#f59e0b', icon: '!' },
      'Grabación por tiempo': { color: '#8b5cf6', icon: '⏱' },
      'Grabación por curso': { color: '#6366f1', icon: '📍' }
    };

    const config = iconConfig[tipo] || { color: '#6b7280', icon: '●' };
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${config.color};
          width: 20px;
          height: 20px;
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
      className: 'telemetria-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
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

  // Actualizar marcadores cuando cambien los registros
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores existentes
    markersLayer.current.clearLayers();

    // Filtrar registros con coordenadas válidas
    const registrosValidos = registros.filter(r => 
      r.lat !== null && 
      r.lng !== null && 
      r.lat !== 0 && 
      r.lng !== 0 &&
      Math.abs(r.lat) <= 90 && 
      Math.abs(r.lng) <= 180
    );

    console.log('Registros recibidos:', registros.length);
    console.log('Registros válidos:', registrosValidos.length);

    if (registrosValidos.length === 0) {
      console.log('No hay registros válidos para mostrar en el mapa');
      return;
    }

    // Crear marcadores
    registrosValidos.forEach((registro, index) => {
      const marker = L.marker([registro.lat!, registro.lng!], {
        icon: createCustomIcon(registro.tipoRegistro)
      });

      // Crear popup con información
      const popupContent = `
        <div class="p-3 min-w-[250px]">
          <div class="font-bold text-sm mb-2 text-center" style="color: #1f2937;">
            ${registro.tipoRegistro}
          </div>
          <div class="space-y-1 text-xs">
            <div><strong>Autobús:</strong> ${registro.placa} (ID: ${registro.busId})</div>
            <div><strong>Conductor:</strong> ${registro.conductorNombre}</div>
            <div><strong>Código:</strong> ${registro.conductorCodigo}</div>
            <div><strong>Fecha:</strong> ${new Date(registro.fechaHoraUtc).toLocaleString('es-CR')}</div>
            <div><strong>Velocidad:</strong> ${registro.velocidadKmH} km/h</div>
            <div><strong>Pasajeros:</strong> ${registro.pasajeros} (${registro.espaciosDisponibles} disponibles)</div>
            ${registro.ruta ? `<div><strong>Ruta:</strong> ${registro.ruta} ${registro.sentido ? `(${registro.sentido})` : ''}</div>` : ''}
            ${registro.parada ? `<div><strong>Parada:</strong> ${registro.parada}</div>` : ''}
            ${registro.geocerca ? `<div><strong>Geocerca:</strong> ${registro.geocerca}</div>` : ''}
            <div><strong>Empresa:</strong> ${registro.empresaTransporte}</div>
            ${registro.empresaCliente ? `<div><strong>Cliente:</strong> ${registro.empresaCliente}</div>` : ''}
            <div><strong>Coordenadas:</strong> ${registro.lat!.toFixed(6)}, ${registro.lng!.toFixed(6)}</div>
            <div><strong>Dirección:</strong> ${registro.direccion}°</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'telemetria-popup'
      });

      markersLayer.current.addLayer(marker);
    });

    // Ajustar vista del mapa para mostrar todos los marcadores
    if (registrosValidos.length > 0) {
      const bounds = L.latLngBounds(registrosValidos.map(r => [r.lat!, r.lng!]));
      map.current.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 15 
      });
    }

    console.log('Marcadores agregados:', registrosValidos.length);
  }, [registros]);

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
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-[200px]">
        <div className="text-xs font-semibold mb-2">Tipos de Registro</div>
        <div className="space-y-1">
          {[
            { tipo: 'Entrada a ruta' as TipoRegistro, color: '#22c55e', icon: '→' },
            { tipo: 'Salida de ruta' as TipoRegistro, color: '#ef4444', icon: '←' },
            { tipo: 'Paso por parada' as TipoRegistro, color: '#3b82f6', icon: '●' },
            { tipo: 'Exceso de velocidad' as TipoRegistro, color: '#f59e0b', icon: '!' },
            { tipo: 'Grabación por tiempo' as TipoRegistro, color: '#8b5cf6', icon: '⏱' },
            { tipo: 'Grabación por curso' as TipoRegistro, color: '#6366f1', icon: '📍' }
          ].map(({ tipo, color, icon }) => (
            <div key={tipo} className="flex items-center gap-2 text-xs">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color, fontSize: '8px' }}
              >
                {icon}
              </div>
              <span className="truncate">{tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estado vacío */}
      {registros.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center p-6">
            <div className="text-muted-foreground text-sm mb-2">
              Selecciona registros de telemetría para verlos en el mapa
            </div>
            <div className="text-xs text-muted-foreground">
              Los marcadores aparecerán aquí cuando selecciones elementos de la lista
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      {registros.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 rounded px-2 py-1 text-xs text-muted-foreground z-[1000]">
          {registros.length} registro{registros.length !== 1 ? 's' : ''} seleccionado{registros.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TelemetriaMap;