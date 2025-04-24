import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Conductor, SortParams } from "@/types/conductor";
import { isDocumentoProximoAVencer } from "@/services/conductorService";
import { ChevronUp, ChevronDown, Edit, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ConductoresTableProps {
  conductores: Conductor[];
  sortParams: SortParams;
  onSort: (column: keyof Conductor) => void;
  onEdit: (conductor: Conductor) => void;
  onViewDocuments: (conductor: Conductor) => void;
  onToggleStatus: (conductor: Conductor) => void;
  canChangeCompany: boolean;
}

const ConductoresTable: React.FC<ConductoresTableProps> = ({
  conductores,
  sortParams,
  onSort,
  onEdit,
  onViewDocuments,
  onToggleStatus
}) => {
  const navigate = useNavigate();

  const renderSortIcon = (column: keyof Conductor) => {
    if (sortParams.column !== column) {
      return null;
    }
    return sortParams.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const handleSort = (column: keyof Conductor) => {
    onSort(column);
  };

  const handleEdit = (conductor: Conductor) => {
    navigate(`/conductores/edit/${conductor.id}`);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('empresaTransporte')}
            >
              Empresa de Transporte
              {renderSortIcon('empresaTransporte')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('codigo')}
            >
              Código
              {renderSortIcon('codigo')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('numeroCedula')}
            >
              Cédula/DIMEX
              {renderSortIcon('numeroCedula')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('nombre')}
            >
              Nombre Completo
              {renderSortIcon('nombre')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('fechaNacimiento')}
            >
              Fecha Nacimiento
              {renderSortIcon('fechaNacimiento')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('telefono')}
            >
              Teléfono
              {renderSortIcon('telefono')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('fechaVencimientoCedula')}
            >
              Venc. Cédula
              {renderSortIcon('fechaVencimientoCedula')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('fechaVencimientoLicencia')}
            >
              Venc. Licencia
              {renderSortIcon('fechaVencimientoLicencia')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('estado')}
            >
              Estado
              {renderSortIcon('estado')}
            </TableHead>
            <TableHead>Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                No hay conductores que coincidan con los criterios de búsqueda.
              </TableCell>
            </TableRow>
          ) : (
            conductores.map((conductor) => (
              <TableRow key={conductor.id}>
                <TableCell>{conductor.empresaTransporte}</TableCell>
                <TableCell>{conductor.codigo}</TableCell>
                <TableCell>{conductor.numeroCedula}</TableCell>
                <TableCell>{`${conductor.nombre} ${conductor.apellidos}`}</TableCell>
                <TableCell>{new Date(conductor.fechaNacimiento).toLocaleDateString()}</TableCell>
                <TableCell>{conductor.telefono}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {new Date(conductor.fechaVencimientoCedula).toLocaleDateString()}
                    {isDocumentoProximoAVencer(conductor.fechaVencimientoCedula) && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Por vencer
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {new Date(conductor.fechaVencimientoLicencia).toLocaleDateString()}
                    {isDocumentoProximoAVencer(conductor.fechaVencimientoLicencia) && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Por vencer
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={conductor.estado === 'Activo' ? 'default' : 'secondary'}
                  >
                    {conductor.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(conductor)}
                      className="p-1 h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDocuments(conductor)}
                      className="p-1 h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={conductor.estado === 'Activo' ? 'destructive' : 'default'} 
                      size="sm" 
                      onClick={() => onToggleStatus(conductor)}
                      className="p-1 h-8 w-8"
                    >
                      {conductor.estado === 'Activo' ? 
                        <X className="h-4 w-4" /> : 
                        <Check className="h-4 w-4" />
                      }
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

export default ConductoresTable;
