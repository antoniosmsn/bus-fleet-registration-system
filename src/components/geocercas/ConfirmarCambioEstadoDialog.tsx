
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

interface ConfirmarCambioEstadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geocercaNombre: string;
  estadoActual: boolean;
  onConfirmar: () => void;
}

const ConfirmarCambioEstadoDialog: React.FC<ConfirmarCambioEstadoDialogProps> = ({
  open,
  onOpenChange,
  geocercaNombre,
  estadoActual,
  onConfirmar
}) => {
  const accion = estadoActual ? 'inactivar' : 'activar';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea {accion} la geocerca "{geocercaNombre}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmarCambioEstadoDialog;
