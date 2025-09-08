import { useState } from 'react';
import { Banco, BancoFilter, BancoForm } from '@/types/banco';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit2, Plus } from 'lucide-react';

interface BancosTableProps {
  bancos: Banco[];
  filtros: BancoFilter;
  loading?: boolean;
  onToggleEstado: (banco: Banco) => void;
  onSave: (data: BancoForm, banco?: Banco) => void;
  onAdd: () => void;
}

export function BancosTable({ 
  bancos, 
  filtros, 
  loading = false,
  onToggleEstado,
  onSave,
  onAdd
}: BancosTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [errors, setErrors] = useState<string>('');

  const highlightText = (text: string, search?: string) => {
    if (!search || search.length < 2) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const validateName = (name: string): string => {
    if (!name.trim()) return 'El nombre es requerido';
    if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  };

  const handleEdit = (banco: Banco) => {
    setEditingId(banco.id);
    setEditValue(banco.nombre);
    setErrors('');
  };

  const handleSave = (banco?: Banco) => {
    const error = validateName(editValue);
    if (error) {
      setErrors(error);
      return;
    }

    onSave({ nombre: editValue.trim() }, banco);
    setEditingId(null);
    setAddingNew(false);
    setEditValue('');
    setErrors('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setAddingNew(false);
    setEditValue('');
    setErrors('');
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setEditValue('');
    setErrors('');
    onAdd();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bancos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron bancos</h3>
        <p className="text-muted-foreground">
          No hay bancos que coincidan con los criterios de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
            <Button
              onClick={handleAddNew}
              size="sm"
              className="flex items-center gap-1"
              disabled={addingNew || editingId !== null}
            >
              <Plus className="h-3 w-3" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Add new row */}
        {addingNew && (
          <div className="flex items-center justify-between py-4 border-b border-border bg-muted/20">
            <div className="flex-1 pr-4">
              <Input
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  setErrors('');
                }}
                placeholder="Nombre del banco"
                className={errors ? 'border-destructive' : ''}
                autoFocus
              />
              {errors && (
                <p className="text-xs text-destructive mt-1">{errors}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSave()}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-0">
          {bancos.map((banco, index) => (
            <div 
              key={banco.id} 
              className={`flex items-center justify-between py-4 hover:bg-muted/50 transition-colors ${
                index < bancos.length - 1 || addingNew ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex-1 pr-4">
                {editingId === banco.id ? (
                  <div>
                    <Input
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        setErrors('');
                      }}
                      className={errors ? 'border-destructive' : ''}
                      autoFocus
                    />
                    {errors && (
                      <p className="text-xs text-destructive mt-1">{errors}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <span className="text-foreground font-medium">
                      {highlightText(banco.nombre, filtros.nombre)}
                    </span>
                    <Button
                      onClick={() => handleEdit(banco)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={editingId !== null || addingNew}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {editingId === banco.id ? (
                  <>
                    <Button
                      onClick={() => handleSave(banco)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge 
                      variant={banco.activo ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {banco.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Switch
                      checked={banco.activo}
                      onCheckedChange={() => onToggleEstado(banco)}
                      disabled={editingId !== null || addingNew}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}