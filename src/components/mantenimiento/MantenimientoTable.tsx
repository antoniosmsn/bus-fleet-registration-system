import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText, ArrowUpDown, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MantenimientoRecord, MantenimientoFilter } from '@/types/mantenimiento';
import { exportMantenimientoToPDF, exportMantenimientoToExcel } from '@/services/exportService';
import { toast } from '@/hooks/use-toast';

interface MantenimientoTableProps {
  mantenimientos: MantenimientoRecord[];
  filtros: MantenimientoFilter;
  loading?: boolean;
}

type SortField = 'fechaMantenimiento' | 'placa' | 'categoria' | 'transportista';
type SortDirection = 'asc' | 'desc';

export function MantenimientoTable({ 
  mantenimientos, 
  filtros,
  loading = false 
}: MantenimientoTableProps) {
  const [sortField, setSortField] = useState<SortField>('fechaMantenimiento');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const navigate = useNavigate();

  const handleEdit = (mantenimiento: MantenimientoRecord) => {
    navigate(`/mantenimiento/editar/${mantenimiento.id}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMantenimientos = [...mantenimientos].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortField) {
      case 'fechaMantenimiento':
        aValue = a.fechaMantenimiento;
        bValue = b.fechaMantenimiento;
        break;
      case 'placa':
        aValue = a.placa;
        bValue = b.placa;
        break;
      case 'categoria':
        aValue = a.categoria.nombre;
        bValue = b.categoria.nombre;
        break;
      case 'transportista':
        aValue = a.transportista.nombre;
        bValue = b.transportista.nombre;
        break;
      default:
        aValue = a.fechaMantenimiento;
        bValue = b.fechaMantenimiento;
    }

    const comparison = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleExportPDF = async () => {
    try {
      await exportMantenimientoToPDF(sortedMantenimientos, filtros);
      toast({
        title: "Exportación exitosa",
        description: "El reporte PDF se ha generado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: "No se pudo generar el reporte PDF",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportMantenimientoToExcel(sortedMantenimientos, filtros);
      toast({
        title: "Exportación exitosa",
        description: "El reporte Excel se ha generado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: "No se pudo generar el reporte Excel",
        variant: "destructive",
      });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-2 h-4 w-4" /> : 
      <ChevronDown className="ml-2 h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Cargando mantenimientos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div></div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
            disabled={mantenimientos.length === 0}
          >
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="flex items-center gap-2"
            disabled={mantenimientos.length === 0}
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {mantenimientos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No se encontraron mantenimientos para los criterios seleccionados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('fechaMantenimiento')}
                  >
                    <div className="flex items-center">
                      Fecha del Mantenimiento
                      <SortIcon field="fechaMantenimiento" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('placa')}
                  >
                    <div className="flex items-center">
                      Placa
                      <SortIcon field="placa" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('categoria')}
                  >
                    <div className="flex items-center">
                      Categoría
                      <SortIcon field="categoria" />
                    </div>
                  </TableHead>
                  <TableHead>Detalle del Mantenimiento</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('transportista')}
                  >
                    <div className="flex items-center">
                      Transportista
                      <SortIcon field="transportista" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMantenimientos.map((mantenimiento) => (
                  <TableRow key={mantenimiento.id}>
                    <TableCell className="font-medium">
                      {format(new Date(mantenimiento.fechaMantenimiento), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {mantenimiento.placa}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {mantenimiento.categoria.nombre}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {mantenimiento.detalle}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <div className="font-medium">{mantenimiento.transportista.codigo}</div>
                        <div className="text-muted-foreground">{mantenimiento.transportista.nombre}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(mantenimiento)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}