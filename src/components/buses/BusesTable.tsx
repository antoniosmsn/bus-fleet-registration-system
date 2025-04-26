
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
import { Bus } from '@/types/bus';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, XCircle, Edit, Bus as BusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isDateCloseToExpiration } from '@/lib/dateUtils';
import { Link, useNavigate } from 'react-router-dom';

interface BusesTableProps {
  buses: Bus[];
  expirationMonths: number | null;
  onChangeStatus: (id: number) => void;
  onApprove: (id: number) => void;
}

const BusesTable: React.FC<BusesTableProps> = ({ 
  buses, 
  expirationMonths,
  onChangeStatus,
  onApprove
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const isExpiringSoon = (dateString: string | null) => {
    if (!dateString || !expirationMonths) return false;
    return isDateCloseToExpiration(new Date(dateString), expirationMonths);
  };

  const handleEdit = (id: number) => {
    navigate(`/buses/edit/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>ID Autobús</TableHead>
            <TableHead>Serial lectora</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Venc. Dekra</TableHead>
            <TableHead>Venc. Póliza</TableHead>
            <TableHead>Venc. CTP</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Aprobación</TableHead>
            <TableHead>F. Aprobación</TableHead>
            <TableHead>U. Aprobación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={16} className="text-center py-6 text-muted-foreground">
                No hay autobuses que coincidan con los criterios de búsqueda
              </TableCell>
            </TableRow>
          ) : (
            buses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell className="font-medium">{bus.plate}</TableCell>
                <TableCell>{bus.busId || 'N/A'}</TableCell>
                <TableCell>{bus.readerSerial || 'N/A'}</TableCell>
                <TableCell>{bus.company}</TableCell>
                <TableCell>{bus.brand}</TableCell>
                <TableCell>{bus.year}</TableCell>
                <TableCell>{bus.capacity || 'N/A'}</TableCell>
                <TableCell className={isExpiringSoon(bus.dekraExpirationDate) ? 'text-red-600 font-medium' : ''}>
                  {formatDate(bus.dekraExpirationDate)}
                </TableCell>
                <TableCell className={isExpiringSoon(bus.insuranceExpirationDate) ? 'text-red-600 font-medium' : ''}>
                  {formatDate(bus.insuranceExpirationDate)}
                </TableCell>
                <TableCell className={isExpiringSoon(bus.ctpExpirationDate) ? 'text-red-600 font-medium' : ''}>
                  {formatDate(bus.ctpExpirationDate)}
                </TableCell>
                <TableCell>{bus.type}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bus.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    bus.approved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bus.approved ? 'Aprobado' : 'Sin aprobación'}
                  </span>
                </TableCell>
                <TableCell>{bus.approvalDate ? formatDate(bus.approvalDate) : 'N/A'}</TableCell>
                <TableCell>{bus.approvalUser || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Acciones</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log('Ver detalles', bus.id)}>
                        <BusIcon className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(bus.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeStatus(bus.id)}>
                        {bus.status === 'active' ? 
                          <><XCircle className="mr-2 h-4 w-4" /><span>Desactivar</span></> : 
                          <><CheckCircle className="mr-2 h-4 w-4" /><span>Activar</span></>
                        }
                      </DropdownMenuItem>
                      {!bus.approved && (
                        <DropdownMenuItem onClick={() => onApprove(bus.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Aprobar</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusesTable;
