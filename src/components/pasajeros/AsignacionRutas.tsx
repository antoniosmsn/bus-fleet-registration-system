
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, GripVertical } from 'lucide-react';

interface Ruta {
  id: string;
  nombre: string;
  ramal: string;
  empresaTransporte: string;
  tipoRuta: string;
}

// Mock data para las rutas disponibles
const rutasDisponibles: Ruta[] = [
  { id: '1', nombre: 'Ruta San José - Cartago', ramal: 'Ramal 101', empresaTransporte: 'Transportes Unidos', tipoRuta: 'Privada' },
  { id: '2', nombre: 'Ruta Alajuela - Heredia', ramal: 'Ramal 102', empresaTransporte: 'Buses del Norte', tipoRuta: 'Parque' },
  { id: '3', nombre: 'Ruta Puntarenas - Liberia', ramal: 'Ramal 103', empresaTransporte: 'Costa Verde', tipoRuta: 'Especial' },
  { id: '4', nombre: 'Ruta Limón - Guápiles', ramal: 'Ramal 104', empresaTransporte: 'Caribeños SA', tipoRuta: 'Privada' },
  { id: '5', nombre: 'Ruta Escazú - Santa Ana', ramal: 'Ramal 105', empresaTransporte: 'Oeste Express', tipoRuta: 'Parque' },
];

interface AsignacionRutasProps {
  rutasAsignadas: string[];
  onChange: (rutas: string[]) => void;
}

const AsignacionRutas: React.FC<AsignacionRutasProps> = ({ rutasAsignadas, onChange }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'disponibles' | 'asignadas' | null>(null);

  const rutasDisponiblesFiltered = rutasDisponibles.filter(ruta => !rutasAsignadas.includes(ruta.id));
  const rutasAsignadasData = rutasDisponibles.filter(ruta => rutasAsignadas.includes(ruta.id));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, rutaId: string, from: 'disponibles' | 'asignadas') => {
    setDraggedItem(rutaId);
    setDraggedFrom(from);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'disponibles' | 'asignadas') => {
    e.preventDefault();
    
    if (draggedItem && draggedFrom && draggedFrom !== target) {
      if (target === 'asignadas') {
        // Mover de disponibles a asignadas
        onChange([...rutasAsignadas, draggedItem]);
      } else {
        // Mover de asignadas a disponibles
        onChange(rutasAsignadas.filter(id => id !== draggedItem));
      }
    }
    
    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const moverRuta = (rutaId: string, to: 'disponibles' | 'asignadas') => {
    if (to === 'asignadas') {
      onChange([...rutasAsignadas, rutaId]);
    } else {
      onChange(rutasAsignadas.filter(id => id !== rutaId));
    }
  };

  const RutaItem = ({ ruta, from }: { ruta: Ruta; from: 'disponibles' | 'asignadas' }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, ruta.id, from)}
      className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-move transition-colors flex items-center gap-3"
    >
      <GripVertical className="h-4 w-4 text-gray-400" />
      <div className="flex-1">
        <div className="font-medium text-sm">{ruta.nombre}</div>
        <div className="text-xs text-gray-500">
          {ruta.ramal} • {ruta.empresaTransporte} • {ruta.tipoRuta}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Rutas Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutas Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="space-y-2 min-h-[300px] p-2 border-2 border-dashed border-gray-200 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'disponibles')}
          >
            {rutasDisponiblesFiltered.length > 0 ? (
              rutasDisponiblesFiltered.map(ruta => (
                <RutaItem key={ruta.id} ruta={ruta} from="disponibles" />
              ))
            ) : (
              <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                No hay rutas disponibles
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botones de Control */}
      <div className="flex flex-col justify-center items-center space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={rutasAsignadasData.length === 0}
          onClick={() => {
            if (rutasAsignadasData.length > 0) {
              moverRuta(rutasAsignadasData[0].id, 'disponibles');
            }
          }}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quitar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={rutasDisponiblesFiltered.length === 0}
          onClick={() => {
            if (rutasDisponiblesFiltered.length > 0) {
              moverRuta(rutasDisponiblesFiltered[0].id, 'asignadas');
            }
          }}
          className="w-full"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Asignar
        </Button>
      </div>

      {/* Rutas Asignadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutas Asignadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="space-y-2 min-h-[300px] p-2 border-2 border-dashed border-gray-200 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'asignadas')}
          >
            {rutasAsignadasData.length > 0 ? (
              rutasAsignadasData.map(ruta => (
                <RutaItem key={ruta.id} ruta={ruta} from="asignadas" />
              ))
            ) : (
              <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                Arrastra rutas aquí para asignarlas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsignacionRutas;
