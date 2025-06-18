
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
import { Badge } from '@/components/ui/badge';
import { Pasajero } from '@/types/pasajero';
import { Edit, Eye, UserX, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PasajerosPagination from './PasajerosPagination';

interface PasajerosTableProps {
  pasajeros: Pasajero[];
  onChangeStatus: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PasajerosTable: React.FC<PasajerosTableProps> = ({ 
  pasajeros, 
  onChangeStatus,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(amount);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'cambio_password': return 'bg-yellow-100 text-yellow-800';
      case 'dado_de_baja': return 'bg-gray-100 text-gray-800';
      case 'solicitud_traslado': return 'bg-blue-100 text-blue-800';
      case 'traslado_rechazado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'cambio_password': return 'Cambio Password';
      case 'dado_de_baja': return 'Dado de Baja';
      case 'solicitud_traslado': return 'Solicitud Traslado';
      case 'traslado_rechazado': return 'Traslado Rechazado';
      default: return estado;
    }
  };

  const getTipoPagoBadgeColor = (tipo: string) => {
    return tipo === 'prepago' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const handleEdit = (id: number) => {
    navigate(`/pasajeros/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/pasajeros/view/${id}`);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <Table className="min-w-[1600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Cédula</TableHead>
              <TableHead className="w-48">Nombres</TableHead>
              <TableHead className="w-48">Apellidos</TableHead>
              <TableHead className="w-32">Tipo de Pago</TableHead>
              <TableHead className="w-64">Correo</TableHead>
              <TableHead className="w-32">Badge Interno</TableHead>
              <TableHead className="w-32"># Empleado</TableHead>
              <TableHead className="w-32">Subsidio %</TableHead>
              <TableHead className="w-32">Subsidio Monto</TableHead>
              <TableHead className="w-32">Saldo Prepago</TableHead>
              <TableHead className="w-32">Saldo Postpago</TableHead>
              <TableHead className="w-64">Empresa</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-32">Solicitud Ruta</TableHead>
              <TableHead className="w-40">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pasajeros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-6 text-muted-foreground">
                  No hay pasajeros que coincidan con los criterios de búsqueda
                </TableCell>
              </TableRow>
            ) : (
              pasajeros.map((pasajero) => (
                <TableRow key={pasajero.id}>
                  <TableCell className="font-medium w-32">{pasajero.cedula}</TableCell>
                  <TableCell className="w-48">{pasajero.nombres}</TableCell>
                  <TableCell className="w-48">
                    {pasajero.primerApellido} {pasajero.segundoApellido}
                  </TableCell>
                  <TableCell className="w-32">
                    <Badge className={getTipoPagoBadgeColor(pasajero.tipoPago)}>
                      {pasajero.tipoPago === 'prepago' ? 'Prepago' : 'Postpago'}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-64">{pasajero.correoElectronico}</TableCell>
                  <TableCell className="w-32">{pasajero.badgeInterno || 'N/A'}</TableCell>
                  <TableCell className="w-32">{pasajero.numeroEmpleadoInterno || 'N/A'}</TableCell>
                  <TableCell className="w-32">{pasajero.subsidioPorcentual}%</TableCell>
                  <TableCell className="w-32">{formatCurrency(pasajero.subsidioMonto)}</TableCell>
                  <TableCell className="w-32">{formatCurrency(pasajero.saldoPrepago)}</TableCell>
                  <TableCell className="w-32">{formatCurrency(pasajero.saldoPostpago)}</TableCell>
                  <TableCell className="w-64">{pasajero.empresaCliente}</TableCell>
                  <TableCell className="w-32">
                    <Badge className={getEstadoBadgeColor(pasajero.estado)}>
                      {getEstadoText(pasajero.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-32">
                    <Badge className={pasajero.solicitudRuta ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {pasajero.solicitudRuta ? 'Sí' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-40">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleView(pasajero.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(pasajero.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onChangeStatus(pasajero.id)}
                      >
                        {pasajero.estado === 'activo' ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PasajerosPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PasajerosTable;
