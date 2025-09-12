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