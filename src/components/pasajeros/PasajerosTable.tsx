
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pasajero } from '@/types/pasajero';
import { Edit, Eye, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PasajerosPagination from './PasajerosPagination';
import ConfirmarCambioEstadoDialog from './ConfirmarCambioEstadoDialog';

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
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    pasajeroId: number;
    pasajeroNombre: string;
    estadoActual: 'activo' | 'inactivo';
  }>({
    open: false,
    pasajeroId: 0,
    pasajeroNombre: '',
    estadoActual: 'activo'
  });

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(amount);
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

  const handleSwitchClick = (pasajero: Pasajero) => {
    const nombreCompleto = `${pasajero.nombres} ${pasajero.primerApellido} ${pasajero.segundoApellido}`;
    const estadoActual = pasajero.estado === 'activo' ? 'activo' : 'inactivo';
    
    setDialogState({
      open: true,
      pasajeroId: pasajero.id,
      pasajeroNombre: nombreCompleto,
      estadoActual
    });
  };

  const handleConfirmarCambio = () => {
    onChangeStatus(dialogState.pasajeroId);
    setDialogState(prev => ({ ...prev, open: false }));
  };

  const handleSolicitudTraslado = (id: number) => {
    console.log('Solicitud de traslado para pasajero:', id);
    // Aquí se implementaría la lógica para la solicitud de traslado
  };

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <ScrollArea className="w-full">
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
                  <TableHead className="w-48">Acciones</TableHead>
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
                        <Switch
                          checked={pasajero.estado === 'activo'}
                          onCheckedChange={() => handleSwitchClick(pasajero)}
                        />
                      </TableCell>
                      <TableCell className="w-32">
                        <Badge className={pasajero.solicitudRuta ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {pasajero.solicitudRuta ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-48">
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
                            onClick={() => handleSolicitudTraslado(pasajero.id)}
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                            <span className="ml-1 text-xs">Enviar solicitud de traslado</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PasajerosPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      <ConfirmarCambioEstadoDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
        pasajeroNombre={dialogState.pasajeroNombre}
        estadoActual={dialogState.estadoActual}
        onConfirmar={handleConfirmarCambio}
      />
    </>
  );
};

export default PasajerosTable;
