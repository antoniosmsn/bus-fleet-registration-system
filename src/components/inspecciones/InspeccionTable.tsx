import { Eye, Download, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { InspeccionAutobus } from '@/types/inspeccion-autobus';
import { formatShortDate } from '@/lib/dateUtils';
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

  const handleReenviarCorreo = (inspeccion: InspeccionAutobus) => {
    toast({
      title: "Reenviando correo",
      description: `Enviando inspección ${inspeccion.consecutivo} por correo`,
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

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion >= 90) return 'text-green-600 font-semibold';
    if (calificacion >= 80) return 'text-blue-600 font-semibold';
    if (calificacion >= 70) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consecutivo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Plantilla</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
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
        <h3 className="mt-4 text-lg font-semibold">No se encontraron inspecciones</h3>
        <p className="mt-2 text-muted-foreground">
          No hay inspecciones que coincidan con los filtros seleccionados.
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
              <TableHead>Consecutivo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Plantilla</TableHead>
              <TableHead>Kilómetros</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspecciones.map((inspeccion) => (
              <TableRow key={inspeccion.id}>
                <TableCell className="font-medium">
                  {inspeccion.consecutivo}
                </TableCell>
                <TableCell>
                  {formatShortDate(inspeccion.fechaInspeccion)}
                </TableCell>
                <TableCell className="font-mono">
                  {inspeccion.placa}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {inspeccion.conductor.nombre} {inspeccion.conductor.apellidos}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Código: {inspeccion.conductor.codigo}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-48 truncate" title={inspeccion.plantilla.nombre}>
                    {inspeccion.plantilla.nombre}
                  </div>
                </TableCell>
                <TableCell>
                  {inspeccion.kilometros.toLocaleString()} km
                </TableCell>
                <TableCell>
                  <span className={getCalificacionColor(inspeccion.calificacionFinal)}>
                    {inspeccion.calificacionFinal}%
                  </span>
                </TableCell>
                <TableCell>
                  {getEstadoBadge(inspeccion.estado)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerPDF(inspeccion)}
                      disabled={!inspeccion.pdfUrl}
                      title="Ver PDF"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReenviarCorreo(inspeccion)}
                      title="Reenviar por correo"
                    >
                      <Mail className="h-4 w-4" />
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