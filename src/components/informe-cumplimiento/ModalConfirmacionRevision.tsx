import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { InformeCumplimiento, EstadoRevision } from '@/types/informe-cumplimiento';

interface ModalConfirmacionRevisionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  informe: InformeCumplimiento | null;
  tipoRevision: 'transportista' | 'administracion' | 'cliente';
  onConfirmar: () => void;
}

export default function ModalConfirmacionRevision({
  open,
  onOpenChange,
  informe,
  tipoRevision,
  onConfirmar
}: ModalConfirmacionRevisionProps) {
  
  const getTipoRevisionTexto = () => {
    switch (tipoRevision) {
      case 'transportista':
        return 'Transportista';
      case 'administracion':
        return 'Administración';
      case 'cliente':
        return 'Cliente';
      default:
        return '';
    }
  };

  const handleConfirmar = () => {
    onConfirmar();
    onOpenChange(false);
  };

  if (!informe) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Revisión</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>¿Está seguro de confirmar la revisión?</p>
            <div className="mt-4 p-3 bg-muted rounded-md space-y-1">
              <div><strong>Informe:</strong> {informe.noInforme}</div>
              <div><strong>Servicio:</strong> {informe.idServicio}</div>
              <div><strong>Tipo de Revisión:</strong> {getTipoRevisionTexto()}</div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmar}>
            Sí, Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}