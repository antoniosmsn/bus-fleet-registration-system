
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

interface BusStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  busPlate: string;
  newStatus: 'active' | 'inactive';
  validationErrors?: string[];
}

const BusStatusDialog: React.FC<BusStatusDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  busPlate,
  newStatus,
  validationErrors = []
}) => {
  const hasErrors = validationErrors.length > 0;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
          <AlertDialogDescription>
            {hasErrors ? (
              <div className="space-y-2">
                <p className="text-destructive font-medium">
                  No es posible activar el autobús {busPlate} por los siguientes motivos:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-destructive">{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>
                ¿Está seguro que desea {newStatus === 'active' ? 'activar' : 'inactivar'} el autobús {busPlate}?
                {newStatus === 'inactive' && (
                  <span className="block mt-2 text-destructive">
                    ADVERTENCIA: El autobús no podrá ser utilizado para operaciones y los conductores no podrán iniciar sesión.
                  </span>
                )}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          {!hasErrors && (
            <AlertDialogAction onClick={onConfirm}>
              Confirmar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BusStatusDialog;
