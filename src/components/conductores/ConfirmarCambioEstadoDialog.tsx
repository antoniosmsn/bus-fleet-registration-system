
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
import { Button } from "@/components/ui/button";

interface ConfirmarCambioEstadoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreConductor: string;
  nuevoEstado: 'Activo' | 'Inactivo';
}

const ConfirmarCambioEstadoDialog: React.FC<ConfirmarCambioEstadoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  nombreConductor,
  nuevoEstado
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea cambiar el estado del conductor {nombreConductor} a {nuevoEstado.toLowerCase()}?
            {nuevoEstado === 'Inactivo' && (
              <p className="mt-2 text-destructive">
                ADVERTENCIA: El conductor no podrá iniciar sesión ni ser considerado para asignaciones operativas.
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
