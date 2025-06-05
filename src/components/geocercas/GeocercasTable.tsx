
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapPin, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

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

interface GeocercasTableProps {
  geocercas: Geocerca[];
  loading: boolean;
  onSelectGeocerca?: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
  onEditGeocerca?: (id: string) => void;
}

const GeocercasTable: React.FC<GeocercasTableProps> = ({ 
  geocercas, 
  loading,
  onSelectGeocerca,
  onToggleActive,
  onEditGeocerca
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-md shadow p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (geocercas.length === 0) {
    return (
      <div className="bg-white rounded-md shadow p-6">
        <div className="text-center p-8 text-gray-500">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold">No se encontraron geocercas registradas</h3>
          <p className="mt-1">No hay geocercas que coincidan con los criterios de búsqueda.</p>
        </div>
      </div>
    );
  }

  const handleToggleChange = (id: string, newActive: boolean) => {
    if (onToggleActive) {
      onToggleActive(id, newActive);
      // En una app real, aquí se registraría en la bitácora de auditoría
      console.log('Audit: Usuario cambió estado de geocerca', id, newActive ? 'activo' : 'inactivo');
    }
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evita que se active onSelectGeocerca
    if (onEditGeocerca) {
      onEditGeocerca(id);
      // En una app real, aquí se registraría en la bitácora de auditoría
      console.log('Audit: Usuario seleccionó editar geocerca', id);
    }
  };

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {geocercas.map((geocerca) => (
            <TableRow 
              key={geocerca.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectGeocerca && onSelectGeocerca(geocerca.id)}
            >
              <TableCell className="font-medium">{geocerca.nombre}</TableCell>
              <TableCell>
                <Switch
                  checked={geocerca.active}
                  onCheckedChange={(checked) => handleToggleChange(geocerca.id, checked)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={geocerca.active ? "Desactivar geocerca" : "Activar geocerca"}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => handleEditClick(e, geocerca.id)}
                  aria-label="Editar geocerca"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GeocercasTable;
