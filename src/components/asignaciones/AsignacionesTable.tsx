
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ramal</TableHead>
            <TableHead>Tipo de Ruta</TableHead>
            <TableHead>Empresa Cliente</TableHead>
            <TableHead>Empresa Transporte</TableHead>
            <TableHead>Tipo de Unidad</TableHead>
            <TableHead className="w-80">Ubicación</TableHead>
            <TableHead>Sector/Ramal</TableHead>
            <TableHead>Tarifa Pasajero</TableHead>
            <TableHead>Tarifa Servicio</TableHead>
            <TableHead>Fecha Vigencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Usuario Creación</TableHead>
            <TableHead>Fecha Modificación</TableHead>
            <TableHead>Usuario Modificación</TableHead>
            <TableHead>Acciones</TableHead>
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
                <TableCell className="font-medium">{asignacion.ramal}</TableCell>
                <TableCell>
                  <Badge className={getTipoBadgeColor(asignacion.tipoRuta)}>
                    {asignacion.tipoRuta === 'privada' ? 'Privada' : 
                     asignacion.tipoRuta === 'parque' ? 'Parque' : 'Especial'}
                  </Badge>
                </TableCell>
                <TableCell>{asignacion.empresaCliente}</TableCell>
                <TableCell>{asignacion.empresaTransporte}</TableCell>
                <TableCell>
                  <Badge className={getTipoUnidadBadgeColor(asignacion.tipoUnidad)}>
                    {asignacion.tipoUnidad === 'autobus' ? 'Autobús' :
                     asignacion.tipoUnidad === 'buseta' ? 'Buseta' : 'Microbús'}
                  </Badge>
                </TableCell>
                <TableCell className="w-80">
                  <div className="text-sm">
                    {asignacion.pais}, {asignacion.provincia}, {asignacion.canton}, {asignacion.distrito}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {asignacion.sector}, {asignacion.ramal}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(asignacion.tarifaVigentePasajero)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(asignacion.tarifaVigenteServicio)}
                </TableCell>
                <TableCell>{formatDateOnly(asignacion.fechaInicioVigencia)}</TableCell>
                <TableCell>
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
                <TableCell>{formatDate(asignacion.fechaCreacion)}</TableCell>
                <TableCell>{asignacion.usuarioCreacion}</TableCell>
                <TableCell>{formatDate(asignacion.fechaModificacion)}</TableCell>
                <TableCell>{asignacion.usuarioModificacion || 'N/A'}</TableCell>
                <TableCell>
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
    </div>
  );
};

export default AsignacionesTable;
