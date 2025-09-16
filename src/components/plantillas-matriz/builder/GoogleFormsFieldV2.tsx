import { useState } from 'react';
import { Trash2, Settings, Plus, X, GripVertical, MoreVertical, Copy } from 'lucide-react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
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
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function GoogleFormsFieldV2({ campo, onUpdate, onDelete, onDuplicate, dragHandleProps }: GoogleFormsFieldV2Props) {
  const handleAddOption = () => {
    const opcionesConPeso = campo.opcionesConPeso || [];
    const newOption = {
      id: `opcion-${Date.now()}`,
      texto: `Opción ${opcionesConPeso.length + 1}`,
      peso: undefined,
      seleccionada: campo.tipo === 'checkbox' ? false : undefined // Solo para checkboxes
    };
    
    const updatedOptions = [...opcionesConPeso, newOption];
    onUpdate({ opcionesConPeso: updatedOptions });
  };

  // Distribución automática para radio buttons (progresión aritmética decreciente)
  const calculateRadioWeights = () => {
    const opciones = campo.opcionesConPeso || [];
    if (opciones.length === 0) return;
    
    const updatedOptions = opciones.map((opcion, index) => {
      if (opciones.length === 1) {
        return { ...opcion, peso: 100 };
      } else if (opciones.length === 2) {
        return { ...opcion, peso: index === 0 ? 100 : 0 };
      } else {
        // Progresión aritmética: 100% para primero, 0% para último, distribución equitativa intermedia
        const step = 100 / (opciones.length - 1);
        const peso = Math.round(100 - (step * index));
        return { ...opcion, peso: peso };
      }
    });
    
    onUpdate({ opcionesConPeso: updatedOptions });
  };

  // Distribución automática para checkboxes (100% repartido entre todas las opciones)
  const calculateCheckboxWeights = () => {
    const opciones = campo.opcionesConPeso || [];
    
    if (opciones.length === 0) return;
    
    const pesoIndividual = Math.round((100 / opciones.length) * 10) / 10; // Redondear a 1 decimal
    
    const updatedOptions = opciones.map(opcion => ({
      ...opcion,
      peso: pesoIndividual
    }));
    
    onUpdate({ opcionesConPeso: updatedOptions });
  };

  // Calcular la suma total de pesos para checkboxes
  const getTotalCheckboxWeight = () => {
    if (campo.tipo !== 'checkbox') return 0;
    return (campo.opcionesConPeso || []).reduce((sum, opcion) => {
      return sum + (opcion.peso || 0);
    }, 0);
  };

  const handleUpdateOption = (index: number, updates: { texto?: string; peso?: number; seleccionada?: boolean }) => {
    const opcionesConPeso = [...(campo.opcionesConPeso || [])];
    opcionesConPeso[index] = { ...opcionesConPeso[index], ...updates };
    
    // No calcular automáticamente el peso del campo, solo actualizar las opciones
    onUpdate({ opcionesConPeso });
  };

  const handleDeleteOption = (index: number) => {
    const opcionesConPeso = (campo.opcionesConPeso || []).filter((_, i) => i !== index);
    
    // Solo actualizar las opciones, no calcular automáticamente el peso del campo
    onUpdate({ opcionesConPeso });
  };

  const handleTypeChange = (newType: string) => {
    const updates: Partial<CampoBuilder> = { tipo: newType as any };
    
    // Add default options for select/radio/checkbox types
    if ((newType === 'select' || newType === 'radio' || newType === 'checkbox') && !campo.opcionesConPeso) {
      updates.opcionesConPeso = [{
        id: `opcion-${Date.now()}`,
        texto: 'Opción 1',
        peso: undefined,
        seleccionada: newType === 'checkbox' ? false : undefined // Solo para checkboxes
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
            <div {...dragHandleProps} className="cursor-move p-1 mt-2">
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
                  {/* Botón para calcular pesos automáticamente */}
                  {(campo.tipo === 'radio' || campo.tipo === 'checkbox') && (
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={campo.tipo === 'radio' ? calculateRadioWeights : calculateCheckboxWeights}
                        className="text-xs"
                      >
                        📊 Calcular pesos {campo.tipo === 'radio' ? '(100% → 0%)' : '(equitativo)'}
                      </Button>
                      {campo.tipo === 'checkbox' && (
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getTotalCheckboxWeight() > 100 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            Total: {getTotalCheckboxWeight().toFixed(1)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
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
                          value={opcion.peso !== undefined ? opcion.peso : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              handleUpdateOption(index, { peso: undefined });
                            } else {
                              const newWeight = parseFloat(value);
                              if (newWeight >= 0 && newWeight <= 100) {
                                handleUpdateOption(index, { peso: newWeight });
                              }
                            }
                          }}
                          placeholder="Peso"
                          className={`w-16 h-7 text-xs ${
                            opcion.peso === undefined || opcion.peso < 0 || opcion.peso > 100
                              ? 'border-destructive focus-visible:ring-destructive text-destructive' 
                              : ''
                          }`}
                          min="0"
                          max="100"
                          step="0.1"
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
              
              {/* Only show weight input for checkbox and radio fields and their options */}
              {(campo.tipo === 'checkbox' || campo.tipo === 'radio') && (
                <div className="flex items-center space-x-2">
                  <Label className="text-sm text-muted-foreground">Peso campo:</Label>
                  <Input
                    type="number"
                    value={campo.peso || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        onUpdate({ peso: undefined });
                      } else {
                        const newWeight = parseFloat(value);
                        if (newWeight >= 1 && newWeight <= 100) {
                          onUpdate({ peso: newWeight });
                        }
                      }
                    }}
                    placeholder="1-100"
                    className={`w-16 h-7 text-xs ${
                      campo.peso === undefined || campo.peso < 1 || campo.peso > 100
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