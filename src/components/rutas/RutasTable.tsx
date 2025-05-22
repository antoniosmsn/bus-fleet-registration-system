
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export type Ruta = {
  id: number;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  ramal: string;
  tipo: 'privada' | 'parque' | 'especial';
  estado: 'active' | 'inactive';
  paradas: number; // Cantidad de paradas asignadas
  geocercas: number; // Cantidad de geocercas asignadas
};

interface RutasTableProps {
  rutas: Ruta[];
  onChangeStatus: (id: number, newStatus: 'active' | 'inactive') => void;
}

const RutasTable: React.FC<RutasTableProps> = ({ 
  rutas, 
  onChangeStatus 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEdit = (id: number) => {
    navigate(`/rutas/edit/${id}`);
  };

  const handleToggleStatus = (ruta: Ruta) => {
    const newStatus = ruta.estado === 'active' ? 'inactive' : 'active';
    onChangeStatus(ruta.id, newStatus);
    
    toast({
      title: `Ruta ${newStatus === 'active' ? 'activada' : 'desactivada'}`,
      description: `La ruta ha sido ${newStatus === 'active' ? 'activada' : 'desactivada'} exitosamente.`,
      variant: newStatus === 'active' ? 'default' : 'destructive',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>País</TableHead>
            <TableHead>Provincia</TableHead>
            <TableHead>Cantón</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Ramal</TableHead>
            <TableHead>Tipo de Ruta</TableHead>
            <TableHead>Paradas</TableHead>
            <TableHead>Geocercas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rutas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                No se encontraron rutas registradas.
              </TableCell>
            </TableRow>
          ) : (
            rutas.map((ruta) => (
              <TableRow key={ruta.id}>
                <TableCell className="font-medium">{ruta.pais}</TableCell>
                <TableCell>{ruta.provincia}</TableCell>
                <TableCell>{ruta.canton}</TableCell>
                <TableCell>{ruta.distrito}</TableCell>
                <TableCell>{ruta.sector}</TableCell>
                <TableCell>{ruta.ramal}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    ruta.tipo === 'privada' 
                      ? 'bg-purple-100 text-purple-800' 
                      : ruta.tipo === 'parque' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ruta.tipo.charAt(0).toUpperCase() + ruta.tipo.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{ruta.paradas}</TableCell>
                <TableCell>{ruta.geocercas}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={ruta.estado === 'active'}
                      onCheckedChange={() => handleToggleStatus(ruta)}
                    />
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ruta.estado === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ruta.estado === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(ruta.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
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
