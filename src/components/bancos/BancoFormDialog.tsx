import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banco, BancoForm } from '@/types/banco';

interface BancoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banco?: Banco | null;
  onSave: (data: BancoForm) => void;
  loading?: boolean;
}

export function BancoFormDialog({
  open,
  onOpenChange,
  banco,
  onSave,
  loading = false
}: BancoFormDialogProps) {
  const [formData, setFormData] = useState<BancoForm>({
    nombre: ''
  });

  const [errors, setErrors] = useState<Partial<BancoForm>>({});

  useEffect(() => {
    if (banco) {
      setFormData({
        nombre: banco.nombre
      });
    } else {
      setFormData({
        nombre: ''
      });
    }
    setErrors({});
  }, [banco, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BancoForm> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
  };

  const isEditing = !!banco;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar banco' : 'Agregar banco'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica la información del banco' 
                : 'Completa la información para crear un nuevo banco'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre del banco <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ingrese el nombre del banco"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={errors.nombre ? 'border-destructive' : ''}
                disabled={loading}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar banco'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}