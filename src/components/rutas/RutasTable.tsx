
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Ruta {
  id: number;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  ramal: string;
  tipo: 'privada' | 'parque' | 'especial';
  estado: 'active' | 'inactive';
  paradas: number;
  geocercas: number;
}

interface RutasTableProps {
  rutas: Ruta[];
  onChangeStatus: (id: number, newStatus: 'active' | 'inactive') => void;
}

const RutasTable: React.FC<RutasTableProps> = ({ rutas, onChangeStatus }) => {
  // Helper function to get badge color based on tipo
  const getTipoBadgeColor = (tipo: Ruta['tipo']) => {
    switch (tipo) {
      case 'privada': return 'bg-blue-100 text-blue-800';
      case 'parque': return 'bg-green-100 text-green-800';
      case 'especial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Ubicación</TableHead>
            <TableHead>Sector / Ramal</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Paradas</TableHead>
            <TableHead className="text-center">Geocercas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rutas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron rutas registradas.
              </TableCell>
            </TableRow>
          ) : (
            rutas.map((ruta) => (
              <TableRow key={ruta.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{ruta.pais}</span>
                    <span className="text-sm text-muted-foreground">
                      {ruta.provincia}, {ruta.canton}, {ruta.distrito}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{ruta.sector}</span>
                    <span className="text-sm text-muted-foreground">{ruta.ramal}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getTipoBadgeColor(ruta.tipo)}`}>
                    {ruta.tipo === 'privada' ? 'Privada' : 
                     ruta.tipo === 'parque' ? 'Parque' : 'Especial'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" /> {ruta.paradas}
                  </span>
                </TableCell>
                <TableCell className="text-center">{ruta.geocercas}</TableCell>
                <TableCell>
                  <Switch 
                    checked={ruta.estado === 'active'} 
                    onCheckedChange={(checked) => 
                      onChangeStatus(ruta.id, checked ? 'active' : 'inactive')
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/rutas/edit/${ruta.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RutasTable;
