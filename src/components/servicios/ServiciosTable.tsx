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
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockServicios } from '@/data/mockServicios';

interface ServiciosTableProps {
  filters?: any; // Filters can be implemented later
}

const ServiciosTable = ({ filters }: ServiciosTableProps) => {
  // Procesar datos del mock para mostrar en la tabla
  const servicios = mockServicios.map(servicio => {
    // Obtener nombres legibles de los IDs
    const turnoNombre = servicio.turno === '1' ? 'Turno A' : servicio.turno === '2' ? 'Turno B' : 'Turno C';
    const transportistaNombre = servicio.transportista === '1' ? 'Transportes San José S.A.' : 
                               servicio.transportista === '2' ? 'Autobuses del Valle' :
                               servicio.transportista === '3' ? 'Empresa de Transporte Central' :
                               servicio.transportista === '4' ? 'Transportes Unidos' : 'Buses Express Costa Rica';
    const ramalNombre = servicio.ramal === '1' ? 'San José - Cartago' :
                        servicio.ramal === '2' ? 'Heredia - Alajuela' :
                        servicio.ramal === '3' ? 'Zona Franca Intel - Privada - Intel' :
                        servicio.ramal === '4' ? 'Campus Tecnológico - Especial - Universidad Nacional' : 'Parque Industrial - Parque';
    
    // Formatear días
    const diasAbrev = servicio.diasSemana.map(dia => {
      const map: Record<string, string> = {
        'lunes': 'L', 'martes': 'M', 'miercoles': 'X', 'jueves': 'J', 
        'viernes': 'V', 'sabado': 'S', 'domingo': 'D'
      };
      return map[dia];
    }).join(',');

    return {
      id: servicio.id,
      turno: turnoNombre,
      transportista: transportistaNombre,
      ramal: ramalNombre,
      horario: servicio.horario,
      dias: diasAbrev,
      sentido: servicio.sentido === 'ingreso' ? 'Ingreso' : 'Salida',
      unidades: servicio.cantidadUnidades,
      fee: servicio.porcentajeFee,
      estado: servicio.estado === 'activo' ? 'Activo' : 'Inactivo'
    };
  });

  if (servicios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No se encontraron servicios con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turno</TableHead>
              <TableHead>Transportista</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Sentido</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead>Fee %</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell className="font-medium">
                  {servicio.turno}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {servicio.transportista}
                </TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {servicio.ramal}
                </TableCell>
                <TableCell className="font-mono">
                  {servicio.horario}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{servicio.dias}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'outline'}>
                    {servicio.sentido}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {servicio.unidades}
                </TableCell>
                <TableCell className="text-right">
                  {servicio.fee}%
                </TableCell>
                <TableCell>
                  <Badge variant={servicio.estado === 'Activo' ? 'default' : 'destructive'}>
                    {servicio.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link to={`/servicios/edit/${servicio.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServiciosTable;