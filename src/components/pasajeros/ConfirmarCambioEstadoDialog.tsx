
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
  pasajeroNombre: string;
  estadoActual: 'activo' | 'inactivo';
  onConfirmar: () => void;
}

const ConfirmarCambioEstadoDialog: React.FC<ConfirmarCambioEstadoDialogProps> = ({
  open,
  onOpenChange,
  pasajeroNombre,
  estadoActual,
  onConfirmar
}) => {
  const accion = estadoActual === 'activo' ? 'inactivar' : 'activar';
  const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea {accion} al pasajero "{pasajeroNombre}"?
            {nuevoEstado === 'inactivo' && (
              <p className="mt-2 text-destructive">
                ADVERTENCIA: El pasajero no podrá acceder al sistema ni utilizar los servicios de transporte.
              </p>
            )}
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
