import { useState } from 'react';
import { Trash2, Settings, Plus, X, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampoBuilder } from '@/types/plantilla-matriz';

interface GoogleFormsFieldV2Props {
  campo: CampoBuilder;
  onUpdate: (updates: Partial<CampoBuilder>) => void;
  onDelete: () => void;
}

export function GoogleFormsFieldV2({ campo, onUpdate, onDelete }: GoogleFormsFieldV2Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddOption = () => {
    const newOptions = [...(campo.opciones || []), `Opción ${(campo.opciones?.length || 0) + 1}`];
    onUpdate({ opciones: newOptions });
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (!campo.opciones) return;
    const newOptions = [...campo.opciones];
    newOptions[index] = value;
    onUpdate({ opciones: newOptions });
  };

  const handleDeleteOption = (index: number) => {
    if (!campo.opciones) return;
    const newOptions = campo.opciones.filter((_, i) => i !== index);
    onUpdate({ opciones: newOptions });
  };

  const renderFieldPreview = () => {
    switch (campo.tipo) {
      case 'texto':
        return (
          <div className="mt-4">
            <Input placeholder="Respuesta corta" disabled className="max-w-md" />
          </div>
        );
      case 'select':
        return (
          <div className="mt-4">
            <Select disabled>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
            </Select>
          </div>
        );
      case 'radio':
        return (
          <div className="mt-4 space-y-2">
            {campo.opciones?.map((opcion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={opcion}
                      onChange={(e) => handleUpdateOption(index, e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span>{opcion}</span>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar opción
              </Button>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-4 space-y-2">
            {campo.opciones?.map((opcion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-muted-foreground" />
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={opcion}
                      onChange={(e) => handleUpdateOption(index, e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span>{opcion}</span>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar opción
              </Button>
            )}
          </div>
        );
      case 'fecha':
        return (
          <div className="mt-4">
            <Input type="date" disabled className="max-w-md" />
          </div>
        );
      case 'canvas':
        return (
          <div className="mt-4">
            <div className="w-full h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/20">
              <span className="text-muted-foreground">Área de dibujo</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {campo.tipo}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {campo.peso}%
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(!isEditing);
                setShowSettings(false);
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Field Label */}
        <div className="mb-4">
          {isEditing ? (
            <Input
              value={campo.etiqueta}
              onChange={(e) => onUpdate({ etiqueta: e.target.value })}
              className="text-base font-medium border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Pregunta sin título"
            />
          ) : (
            <h4 
              className="text-base font-medium cursor-text hover:bg-muted/50 p-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              {campo.etiqueta}
            </h4>
          )}
        </div>

        {/* Field Preview */}
        {renderFieldPreview()}

        {/* Settings Panel */}
        {isEditing && (
          <div className="mt-6 pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Requerido</span>
              <Switch
                checked={campo.requerido}
                onCheckedChange={(checked) => onUpdate({ requerido: checked })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Peso:</span>
              <Input
                type="number"
                value={campo.peso}
                onChange={(e) => onUpdate({ peso: parseInt(e.target.value) || 0 })}
                className="w-20"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}