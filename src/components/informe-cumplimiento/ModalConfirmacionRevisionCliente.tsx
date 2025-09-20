import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalConfirmacionRevisionClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  empresaName: string;
  tipoRuta?: string;
}

export default function ModalConfirmacionRevisionCliente({
  isOpen,
  onClose,
  onConfirm,
  empresaName,
  tipoRuta,
}: ModalConfirmacionRevisionClienteProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Aprobación</DialogTitle>
          <DialogDescription>
            {tipoRuta ? (
              <>
                ¿Está seguro que desea aprobar todos los servicios de tipo{' '}
                <strong>{tipoRuta}</strong> de{' '}
                <strong>{empresaName}</strong>?
              </>
            ) : (
              <>
                ¿Está seguro que desea aprobar todos los informes de{' '}
                <strong>{empresaName}</strong>?
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}