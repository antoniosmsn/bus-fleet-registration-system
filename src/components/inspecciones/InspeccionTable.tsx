import { Eye, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { InspeccionAutobus } from '@/types/inspeccion-autobus';
import { toast } from '@/hooks/use-toast';

interface InspeccionTableProps {
  inspecciones: InspeccionAutobus[];
  loading?: boolean;
}

export function InspeccionTable({ inspecciones, loading = false }: InspeccionTableProps) {
  const handleVerPDF = (inspeccion: InspeccionAutobus) => {
    if (inspeccion.pdfUrl) {
      // Simular apertura de PDF
      toast({
        title: "Abriendo PDF",
        description: `Visualizando inspección ${inspeccion.consecutivo}`,
      });
    } else {
      toast({
        title: "PDF no disponible",
        description: "El PDF de esta inspección no está disponible",
        variant: "destructive"
      });
    }
  };

  const handleDescargarPDF = (inspeccion: InspeccionAutobus) => {
    if (inspeccion.pdfUrl) {
      // Simular descarga de PDF
      toast({
        title: "Descargando PDF",
        description: `Descargando inspección ${inspeccion.consecutivo}`,
      });
    } else {
      toast({
        title: "PDF no disponible",
        description: "El PDF de esta inspección no está disponible",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <Badge variant="default">Completada</Badge>;
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };


  if (loading) {
    return (
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead>Placa</TableHead>
                 <TableHead>Fecha de inspección</TableHead>
                 <TableHead>Responsable</TableHead>
                 <TableHead>Identificador de matriz</TableHead>
                 <TableHead>Nombre matriz</TableHead>
                 <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                   <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                   <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (inspecciones.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No se encontraron resultados con los filtros aplicados.</h3>
        <p className="mt-2 text-muted-foreground">
          Ajuste los filtros de búsqueda para obtener resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Fecha de inspección</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Identificador de matriz</TableHead>
                <TableHead>Nombre matriz</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {inspecciones.map((inspeccion) => (
              <TableRow key={inspeccion.id}>
                <TableCell className="font-mono font-medium">
                  {inspeccion.placa}
                </TableCell>
                <TableCell>
                  {formatDateTime(inspeccion.fechaCreacion)}
                </TableCell>
                <TableCell>
                  {inspeccion.usuarioCreacion}
                </TableCell>
                 <TableCell className="font-medium">
                   {inspeccion.consecutivo}
                 </TableCell>
                 <TableCell>
                   {inspeccion.plantilla.nombre}
                 </TableCell>
                 <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerPDF(inspeccion)}
                      disabled={!inspeccion.pdfUrl}
                      title="Visualizar PDF"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDescargarPDF(inspeccion)}
                      disabled={!inspeccion.pdfUrl}
                      title="Descargar PDF"
                    >
                      <Download className="h-4 w-4" />
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
}