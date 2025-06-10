import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AsignacionRuta } from '@/types/asignacion-ruta';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface AsignacionesTableProps {
  asignaciones: AsignacionRuta[];
  onChangeStatus: (id: number) => void;
}

const AsignacionesTable: React.FC<AsignacionesTableProps> = ({ 
  asignaciones, 
  onChangeStatus
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(amount);
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'privada': return 'bg-blue-100 text-blue-800';
      case 'parque': return 'bg-green-100 text-green-800';
      case 'especial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoUnidadBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'autobus': return 'bg-indigo-100 text-indigo-800';
      case 'buseta': return 'bg-orange-100 text-orange-800';
      case 'microbus': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/asignaciones/edit/${id}`);
  };

  return (
    <div className="rounded-md border">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table className="min-w-[1800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Ramal</TableHead>
              <TableHead className="w-32">Tipo de Ruta</TableHead>
              <TableHead className="w-64">Empresa Cliente</TableHead>
              <TableHead className="w-64">Empresa Transporte</TableHead>
              <TableHead className="w-32">Tipo de Unidad</TableHead>
              <TableHead className="w-80">Ubicación</TableHead>
              <TableHead className="w-56">Sector/Ramal</TableHead>
              <TableHead className="w-32">Tarifa Pasajero</TableHead>
              <TableHead className="w-32">Tarifa Servicio</TableHead>
              <TableHead className="w-32">Fecha Vigencia</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-48">Fecha Creación</TableHead>
              <TableHead className="w-40">Usuario Creación</TableHead>
              <TableHead className="w-48">Fecha Modificación</TableHead>
              <TableHead className="w-40">Usuario Modificación</TableHead>
              <TableHead className="w-32">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-6 text-muted-foreground">
                  No hay asignaciones de rutas que coincidan con los criterios de búsqueda
                </TableCell>
              </TableRow>
            ) : (
              asignaciones.map((asignacion) => (
                <TableRow key={asignacion.id}>
                  <TableCell className="font-medium w-32">{asignacion.ramal}</TableCell>
                  <TableCell className="w-32">
                    <Badge className={getTipoBadgeColor(asignacion.tipoRuta)}>
                      {asignacion.tipoRuta === 'privada' ? 'Privada' : 
                       asignacion.tipoRuta === 'parque' ? 'Parque' : 'Especial'}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-64">{asignacion.empresaCliente}</TableCell>
                  <TableCell className="w-64">{asignacion.empresaTransporte}</TableCell>
                  <TableCell className="w-32">
                    <Badge className={getTipoUnidadBadgeColor(asignacion.tipoUnidad)}>
                      {asignacion.tipoUnidad === 'autobus' ? 'Autobús' :
                       asignacion.tipoUnidad === 'buseta' ? 'Buseta' : 'Microbús'}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-80">
                    <div className="text-sm whitespace-nowrap">
                      {asignacion.pais}, {asignacion.provincia}, {asignacion.canton}, {asignacion.distrito}
                    </div>
                  </TableCell>
                  <TableCell className="w-56">
                    <div className="text-sm whitespace-nowrap">
                      {asignacion.sector}, {asignacion.ramal}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium w-32">
                    {formatCurrency(asignacion.tarifaVigentePasajero)}
                  </TableCell>
                  <TableCell className="font-medium w-32">
                    {formatCurrency(asignacion.tarifaVigenteServicio)}
                  </TableCell>
                  <TableCell className="w-32">{formatDateOnly(asignacion.fechaInicioVigencia)}</TableCell>
                  <TableCell className="w-32">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={asignacion.estado === 'activo'}
                        onCheckedChange={() => onChangeStatus(asignacion.id)}
                      />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        asignacion.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {asignacion.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-48 whitespace-nowrap">{formatDate(asignacion.fechaCreacion)}</TableCell>
                  <TableCell className="w-40">{asignacion.usuarioCreacion}</TableCell>
                  <TableCell className="w-48 whitespace-nowrap">{formatDate(asignacion.fechaModificacion)}</TableCell>
                  <TableCell className="w-40">{asignacion.usuarioModificacion || 'N/A'}</TableCell>
                  <TableCell className="w-32">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(asignacion.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AsignacionesTable;
