import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WeightInputDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
  elementName: string;
}

export function WeightInputDialog({ open, onClose, onConfirm, elementName }: WeightInputDialogProps) {
  const [weight, setWeight] = useState('5');

  const handleConfirm = () => {
    const weightValue = parseInt(weight) || 5;
    if (weightValue < 1 || weightValue > 100) {
      return;
    }
    onConfirm(weightValue);
    onClose();
    setWeight('5'); // Reset for next time
  };

  const handleCancel = () => {
    onClose();
    setWeight('5'); // Reset for next time
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar peso del campo</DialogTitle>
          <DialogDescription>
            Define el peso porcentual para el campo "{elementName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (%)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="1"
              max="100"
              placeholder="5"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              El peso debe estar entre 1% y 100%
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
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