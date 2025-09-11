import { useState } from 'react';
import { Trash2, Settings, Plus, X, GripVertical, MoreVertical, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CampoBuilder } from '@/types/plantilla-matriz';
import { CanvasDrawing } from './CanvasDrawing';

interface GoogleFormsFieldV2Props {
  campo: CampoBuilder;
  onUpdate: (updates: Partial<CampoBuilder>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export function GoogleFormsFieldV2({ campo, onUpdate, onDelete, onDuplicate }: GoogleFormsFieldV2Props) {
  const handleAddOption = () => {
    const opcionesConPeso = campo.opcionesConPeso || [];
    onUpdate({
      opcionesConPeso: [...opcionesConPeso, {
        id: `opcion-${Date.now()}`,
        texto: `Opción ${opcionesConPeso.length + 1}`,
        peso: undefined
      }]
    });
  };

  const handleUpdateOption = (index: number, updates: { texto?: string; peso?: number }) => {
    const opcionesConPeso = [...(campo.opcionesConPeso || [])];
    opcionesConPeso[index] = { ...opcionesConPeso[index], ...updates };
    onUpdate({ opcionesConPeso });
  };

  const handleDeleteOption = (index: number) => {
    const opcionesConPeso = (campo.opcionesConPeso || []).filter((_, i) => i !== index);
    onUpdate({ opcionesConPeso });
  };

  const handleTypeChange = (newType: string) => {
    const updates: Partial<CampoBuilder> = { tipo: newType as any };
    
    // Add default options for select/radio/checkbox types
    if ((newType === 'select' || newType === 'radio' || newType === 'checkbox') && !campo.opcionesConPeso) {
      updates.opcionesConPeso = [{
        id: `opcion-${Date.now()}`,
        texto: 'Opción 1',
        peso: undefined
      }];
    }
    
    // Remove options for other types
    if (newType !== 'select' && newType !== 'radio' && newType !== 'checkbox') {
      updates.opcionesConPeso = undefined;
    }
    
    onUpdate(updates);
  };

  const renderFieldPreview = () => {
    switch (campo.tipo) {
      case 'texto':
        return (
          <Input
            placeholder="Respuesta corta"
            className="border-0 border-b border-muted-foreground/30 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
            disabled
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Elegir" />
            </SelectTrigger>
            <SelectContent>
              {(campo.opcionesConPeso || [{ id: '1', texto: 'Opción 1' }]).map((opcion, index) => (
                <SelectItem key={index} value={`opcion-${index}`}>
                  {opcion.texto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
      case 'checkbox':
        // No preview for radio/checkbox - show option editor directly
        return null;
      case 'fecha':
        return (
          <Input type="date" disabled className="w-48" />
        );
      case 'canvas':
        return (
          <div className="w-full">
            <CanvasDrawing
              initialImage={campo.imagenBase}
              onCanvasChange={(imageData) => onUpdate({ imagenBase: imageData })}
              width={400}
              height={200}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow border-border hover:border-muted-foreground/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with drag handle, question input, and controls */}
          <div className="flex items-start gap-3">
            <div className="cursor-move p-1 mt-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 space-y-3">
              <Input
                value={campo.etiqueta}
                onChange={(e) => onUpdate({ etiqueta: e.target.value })}
                placeholder="Pregunta sin título"
                className="text-base font-medium border-0 border-b-2 border-muted-foreground/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
              
              {/* Field Preview */}
              <div className="mt-4">
                {renderFieldPreview()}
              </div>
              
              {/* Options editor for select/radio/checkbox */}
              {(campo.tipo === 'select' || campo.tipo === 'radio' || campo.tipo === 'checkbox') && (
                <div className="space-y-2 mt-4">
                  {(campo.opcionesConPeso || []).map((opcion, index) => (
                    <div key={opcion.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${
                        campo.tipo === 'radio' ? 'rounded-full' : 'rounded-sm'
                      } border-2 border-muted-foreground/40`} />
                      <Input
                        value={opcion.texto}
                        onChange={(e) => handleUpdateOption(index, { texto: e.target.value })}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1 border-0 border-b border-muted-foreground/30 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                      />
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={opcion.peso || ''}
                          onChange={(e) => handleUpdateOption(index, { peso: parseInt(e.target.value) || undefined })}
                          placeholder="Peso"
                          className={`w-16 h-7 text-xs ${
                            !opcion.peso || opcion.peso === 0 
                              ? 'border-destructive focus-visible:ring-destructive text-destructive' 
                              : ''
                          }`}
                          min="1"
                          max="100"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteOption(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddOption}
                    className="text-primary hover:text-primary/80"
                  >
                    Agregar opción
                  </Button>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Footer with required toggle and weight (only for checkbox/radio) */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={campo.requerido}
                  onCheckedChange={(checked) => onUpdate({ requerido: checked })}
                />
                <Label className="text-sm">Obligatoria</Label>
              </div>
              
              {/* Only show weight input for checkbox and radio fields */}
              {(campo.tipo === 'checkbox' || campo.tipo === 'radio') && (
                <div className="flex items-center space-x-2">
                  <Label className="text-sm text-muted-foreground">Peso:</Label>
                  <Input
                    type="number"
                    value={campo.peso || ''}
                    onChange={(e) => onUpdate({ peso: parseInt(e.target.value) || undefined })}
                    placeholder="Peso"
                    className={`w-16 h-7 text-xs ${
                      !campo.peso || campo.peso === 0 
                        ? 'border-destructive focus-visible:ring-destructive text-destructive' 
                        : ''
                    }`}
                    min="1"
                    max="100"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}