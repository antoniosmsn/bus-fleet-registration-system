
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

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

interface ParadasTableProps {
  paradas: Parada[];
}

const ParadasTable: React.FC<ParadasTableProps> = ({ paradas }) => {
  const handleToggleEstado = (paradaId: string) => {
    console.log('Toggling estado for parada:', paradaId);
    // In a real app, this would update the parada's estado
  };

  const handleEdit = (paradaId: string) => {
    console.log('Editing parada:', paradaId);
    // In a real app, this would navigate to edit page
  };

  const handleDelete = (paradaId: string) => {
    console.log('Deleting parada:', paradaId);
    // In a real app, this would show confirmation dialog and delete
  };

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Provincia</TableHead>
            <TableHead>Cantón</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paradas.map((parada) => (
            <TableRow key={parada.id}>
              <TableCell className="text-sm">
                {parada.codigo}
              </TableCell>
              <TableCell className="font-medium">
                {parada.nombre}
              </TableCell>
              <TableCell>
                {parada.pais}
              </TableCell>
              <TableCell>
                {parada.provincia}
              </TableCell>
              <TableCell>
                {parada.canton || '-'}
              </TableCell>
              <TableCell>
                {parada.distrito || '-'}
              </TableCell>
              <TableCell>
                {parada.sector || '-'}
              </TableCell>
              <TableCell>
                <Switch
                  checked={parada.estado === 'Activo'}
                  onCheckedChange={() => handleToggleEstado(parada.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(parada.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(parada.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParadasTable;
