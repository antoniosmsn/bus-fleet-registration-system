
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
}

const GeocercasTable: React.FC<GeocercasTableProps> = ({ 
  geocercas, 
  loading,
  onSelectGeocerca 
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

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Vértices</TableHead>
            <TableHead>Estado</TableHead>
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
              <TableCell>{geocerca.vertices.length} puntos</TableCell>
              <TableCell>
                {geocerca.active ? (
                  <Badge variant="default" className="bg-green-500">Activo</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">Inactivo</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GeocercasTable;
