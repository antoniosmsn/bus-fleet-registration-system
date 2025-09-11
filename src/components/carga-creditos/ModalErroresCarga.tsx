import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ErrorValidacion {
  fila: number;
  campo: string;
  cedula?: string;
  descripcion: string;
}

interface ModalErroresCargaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombreArchivo: string;
  errores: ErrorValidacion[];
  onDescargarErrores?: () => void;
}

const ModalErroresCarga: React.FC<ModalErroresCargaProps> = ({
  open,
  onOpenChange,
  nombreArchivo,
  errores,
  onDescargarErrores
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Errores en archivo de carga
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Se encontraron {errores.length} errores en el archivo <strong>{nombreArchivo}</strong>. 
              No se aplicarán cambios hasta que se corrijan todos los errores.
            </AlertDescription>
          </Alert>

          <div className="border rounded-lg">
            <ScrollArea className="max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Fila</TableHead>
                    <TableHead className="w-32">Campo</TableHead>
                    <TableHead className="w-32">Cédula</TableHead>
                    <TableHead>Descripción del error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errores.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{error.fila}</TableCell>
                      <TableCell>{error.campo}</TableCell>
                      <TableCell>{error.cedula || '-'}</TableCell>
                      <TableCell className="text-sm">{error.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p><strong>Instrucciones:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Corrija todos los errores listados en el archivo Excel</li>
              <li>Verifique que las columnas estén en el orden correcto: Fecha de transferencia (dd/mm/yyyy), Número de cédula, Monto</li>
              <li>Los montos deben ser números positivos con máximo 2 decimales</li>
              <li>Las fechas no pueden ser futuras a la fecha actual</li>
              <li>Los pasajeros deben existir y ser de tipo prepago</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {onDescargarErrores && (
            <Button variant="outline" onClick={onDescargarErrores}>
              <Download className="h-4 w-4 mr-2" />
              Descargar archivo de errores
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalErroresCarga;