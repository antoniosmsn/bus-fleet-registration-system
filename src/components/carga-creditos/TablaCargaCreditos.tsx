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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CargueCredito, DetalleCargueCredito } from '@/types/carga-creditos';
import { Eye, X } from 'lucide-react';
import { getDetallesCargue } from '@/data/mockCargaCreditos';

interface TablaCargaCreditosProps {
  cargues: CargueCredito[];
  onVerDetalle: (cargue: CargueCredito) => void;
}

interface DetalleSeleccionado {
  cargue: CargueCredito;
  detalles: DetalleCargueCredito[];
}

const TablaCargaCreditos: React.FC<TablaCargaCreditosProps> = ({ cargues, onVerDetalle }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadgeColor = (estado: string) => {
    return estado === 'Procesado' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cargues procesados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ScrollArea className="w-full">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Fecha de carga</TableHead>
                  <TableHead className="w-64">Nombre del archivo</TableHead>
                  <TableHead className="w-48">Nombre usuario</TableHead>
                  <TableHead className="w-32">Estado</TableHead>
                  <TableHead className="w-24 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No hay cargues que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  cargues.map((cargue) => (
                    <TableRow key={cargue.id}>
                      <TableCell className="font-medium">
                        {formatDateTime(cargue.fechaCargue)}
                      </TableCell>
                      <TableCell>{cargue.nombreArchivo}</TableCell>
                      <TableCell>{cargue.nombreUsuario}</TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadgeColor(cargue.estado)}>
                          {cargue.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {cargue.estado !== 'Procesado con error' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onVerDetalle(cargue)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablaCargaCreditos;