import { useState } from 'react';
import { GripVertical, Trash2, MoreVertical, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CampoBuilder } from '@/types/plantilla-matriz';

interface GoogleFormsFieldProps {
  campo: CampoBuilder;
  dragHandleProps?: any;
  onUpdate: (updates: Partial<CampoBuilder>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

const tipoLabels = {
  texto: 'Respuesta corta',
  checkbox: 'Casillas de verificación', 
  select: 'Lista desplegable',
  radio: 'Opción múltiple',
  fecha: 'Fecha',
  canvas: 'Dibujo'
};

export function GoogleFormsField({
  campo,
  dragHandleProps,
  onUpdate,
  onDelete,
  onDuplicate
}: GoogleFormsFieldProps) {
  const [focused, setFocused] = useState(false);

  const handleAddOption = () => {
    const opciones = campo.opciones || [];
    onUpdate({
      opciones: [...opciones, `Opción ${opciones.length + 1}`]
    });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const opciones = [...(campo.opciones || [])];
    opciones[index] = value;
    onUpdate({ opciones });
  };

  const handleDeleteOption = (index: number) => {
    const opciones = (campo.opciones || []).filter((_, i) => i !== index);
    onUpdate({ opciones });
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
          </Select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {(campo.opciones || ['Opción 1']).map((opcion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />
                <span className="text-sm">{opcion}</span>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(campo.opciones || ['Opción 1']).map((opcion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-muted-foreground/40 rounded-sm" />
                <span className="text-sm">{opcion}</span>
              </div>
            ))}
          </div>
        );
      
      case 'fecha':
        return (
          <Input
            type="date"
            className="w-48"
            disabled
          />
        );
      
      case 'canvas':
        return (
          <div className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Área de dibujo</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 ${
        focused ? 'border-primary shadow-md' : 'border-border hover:border-muted-foreground/50'
      }`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with question input */}
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
              
              {/* Field preview */}
              <div className="mt-4">
                {renderFieldPreview()}
              </div>
              
              {/* Options editor for select/radio/checkbox */}
              {(campo.tipo === 'select' || campo.tipo === 'radio' || campo.tipo === 'checkbox') && focused && (
                <div className="space-y-2 mt-4">
                  {(campo.opciones || []).map((opcion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${
                        campo.tipo === 'radio' ? 'rounded-full' : 'rounded-sm'
                      } border-2 border-muted-foreground/40`} />
                      <Input
                        value={opcion}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="border-0 border-b border-muted-foreground/30 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                      />
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
            
            <div className="flex items-center gap-1">
              <Select
                value={campo.tipo}
                onValueChange={(value) => onUpdate({ tipo: value as any })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="texto">Respuesta corta</SelectItem>
                  <SelectItem value="select">Lista desplegable</SelectItem>
                  <SelectItem value="radio">Opción múltiple</SelectItem>
                  <SelectItem value="checkbox">Casillas de verificación</SelectItem>
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="canvas">Dibujo</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Footer with required toggle and weight */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={campo.requerido}
                  onCheckedChange={(checked) => onUpdate({ requerido: checked })}
                />
                <Label className="text-sm">Obligatoria</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-muted-foreground">Peso:</Label>
                <Input
                  type="number"
                  value={campo.peso}
                  onChange={(e) => onUpdate({ peso: parseInt(e.target.value) || 0 })}
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}