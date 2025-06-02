
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Provincia</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paradas.map((parada) => (
            <TableRow key={parada.id}>
              <TableCell className="font-mono text-sm">
                {parada.codigo}
              </TableCell>
              <TableCell className="font-medium">
                {parada.nombre}
              </TableCell>
              <TableCell>{parada.pais}</TableCell>
              <TableCell>{parada.provincia}</TableCell>
              <TableCell>
                <Badge
                  variant={parada.estado === 'Activo' ? 'default' : 'secondary'}
                >
                  {parada.estado}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParadasTable;
