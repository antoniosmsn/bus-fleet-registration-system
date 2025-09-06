import { useState } from 'react';
import { GripVertical, Trash2, Edit3, Type, Square, ChevronDown, Circle, Calendar, Pen, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampoBuilder } from '@/types/plantilla-matriz';
import { CanvasImageUpload } from './CanvasImageUpload';

interface CampoEditorProps {
  campo: CampoBuilder;
  dragHandleProps?: any;
  onUpdate: (updates: Partial<CampoBuilder>) => void;
  onDelete: () => void;
}

const iconMap = {
  texto: Type,
  checkbox: Square,
  select: ChevronDown,
  radio: Circle,
  fecha: Calendar,
  canvas: Pen,
};

const tipoLabels = {
  texto: 'Texto',
  checkbox: 'Checkbox',
  select: 'Lista desplegable',
  radio: 'Radio buttons',
  fecha: 'Fecha',
  canvas: 'Canvas'
};

export function CampoEditor({
  campo,
  dragHandleProps,
  onUpdate,
  onDelete
}: CampoEditorProps) {
  const [editando, setEditando] = useState(false);
  const [tempData, setTempData] = useState({
    etiqueta: campo.etiqueta,
    peso: campo.peso.toString(),
    requerido: campo.requerido,
    opciones: campo.opciones || []
  });

  const IconComponent = iconMap[campo.tipo];

  const handleSave = () => {
    const peso = parseInt(tempData.peso) || 0;
    onUpdate({
      etiqueta: tempData.etiqueta.trim() || 'Campo sin título',
      peso: peso,
      requerido: tempData.requerido,
      opciones: (campo.tipo === 'select' || campo.tipo === 'radio') ? tempData.opciones : undefined
    });
    setEditando(false);
  };

  const handleCancel = () => {
    setTempData({
      etiqueta: campo.etiqueta,
      peso: campo.peso.toString(),
      requerido: campo.requerido,
      opciones: campo.opciones || []
    });
    setEditando(false);
  };

  const handleAddOpcion = () => {
    setTempData({
      ...tempData,
      opciones: [...tempData.opciones, `Opción ${tempData.opciones.length + 1}`]
    });
  };

  const handleUpdateOpcion = (index: number, valor: string) => {
    const nuevasOpciones = [...tempData.opciones];
    nuevasOpciones[index] = valor;
    setTempData({ ...tempData, opciones: nuevasOpciones });
  };

  const handleDeleteOpcion = (index: number) => {
    const nuevasOpciones = tempData.opciones.filter((_, i) => i !== index);
    setTempData({ ...tempData, opciones: nuevasOpciones });
  };

  const handleImageUpload = (imageBase64: string) => {
    onUpdate({ imagenBase: imageBase64 });
  };

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div {...dragHandleProps} className="cursor-move p-1 mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
            <Badge variant="outline" className="text-xs">
              {tipoLabels[campo.tipo]}
            </Badge>
          </div>

          <div className="flex-1">
            {editando ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-xs">Etiqueta del campo *</Label>
                    <Input
                      value={tempData.etiqueta}
                      onChange={(e) => setTempData({ ...tempData, etiqueta: e.target.value })}
                      className="h-8"
                      maxLength={200}
                      placeholder="Ingrese la etiqueta del campo..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Peso (%) *</Label>
                    <Input
                      type="number"
                      value={tempData.peso}
                      onChange={(e) => setTempData({ ...tempData, peso: e.target.value })}
                      className="h-8"
                      min="1"
                      max="100"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tempData.requerido}
                    onCheckedChange={(checked) => setTempData({ ...tempData, requerido: checked })}
                  />
                  <Label className="text-sm">Campo requerido</Label>
                </div>

                {/* Opciones para select y radio */}
                {(campo.tipo === 'select' || campo.tipo === 'radio') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Opciones</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddOpcion}
                        className="h-6 px-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {tempData.opciones.map((opcion, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={opcion}
                            onChange={(e) => handleUpdateOpcion(index, e.target.value)}
                            className="h-7 text-xs"
                            placeholder={`Opción ${index + 1}`}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteOpcion(index)}
                            className="h-7 w-7 p-0 text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Canvas con opción de imagen */}
                {campo.tipo === 'canvas' && (
                  <div className="space-y-2">
                    <Label className="text-xs">Imagen base (opcional)</Label>
                    <CanvasImageUpload
                      currentImage={campo.imagenBase}
                      onImageUpload={handleImageUpload}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{campo.etiqueta}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {campo.peso}%
                    </Badge>
                    {campo.requerido && (
                      <Badge variant="secondary" className="text-xs">
                        Requerido
                      </Badge>
                    )}
                  </div>
                </div>
                
                {(campo.opciones && campo.opciones.length > 0) && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Opciones: {campo.opciones.join(', ')}
                    </p>
                  </div>
                )}

                {campo.imagenBase && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      ✓ Imagen base configurada
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!editando && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditando(true)}
                className="h-7 w-7 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}