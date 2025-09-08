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
import { PlantillaMatriz } from '@/types/plantilla-matriz';

interface ConfirmarCambioEstadoDialogProps {
  plantilla: PlantillaMatriz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmarCambioEstadoDialog({
  plantilla,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmarCambioEstadoDialogProps) {
  if (!plantilla) return null;

  const accion = plantilla.activa ? 'desactivar' : 'activar';
  const estado = plantilla.activa ? 'inactiva' : 'activa';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmar {accion} plantilla
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas {accion} la plantilla 
            <strong> "{plantilla.nombre}"</strong> (ID: {plantilla.identificador})?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={plantilla.activa ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {plantilla.activa ? 'Desactivar' : 'Activar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}