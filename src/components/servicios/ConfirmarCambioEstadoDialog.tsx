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
} from "@/components/ui/alert-dialog";

interface ConfirmarCambioEstadoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  numeroServicio: string;
  nuevoEstado: 'Activo' | 'Inactivo';
}

const ConfirmarCambioEstadoDialog: React.FC<ConfirmarCambioEstadoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  numeroServicio,
  nuevoEstado
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea cambiar el estado del servicio {numeroServicio} a {nuevoEstado.toLowerCase()}?
            {nuevoEstado === 'Inactivo' && (
              <p className="mt-2 text-destructive">
                ADVERTENCIA: El servicio no estará disponible para asignaciones operativas.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmarCambioEstadoDialog;