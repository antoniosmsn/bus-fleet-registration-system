import { useState } from 'react';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GoogleFormsFieldV2 } from './GoogleFormsFieldV2';
import { SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';

interface GoogleFormsSectionV2Props {
  seccion: SeccionBuilder;
  index: number;
  totalSecciones: number;
  isActive: boolean;
  onUpdate: (updates: Partial<SeccionBuilder>) => void;
  onDelete: () => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onClick: () => void;
}

export function GoogleFormsSectionV2({
  seccion,
  index,
  totalSecciones,
  isActive,
  onUpdate,
  onDelete,
  onUpdateCampo,
  onDeleteCampo,
  onClick
}: GoogleFormsSectionV2Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [tempTitle, setTempTitle] = useState(seccion.nombre);
  const [tempWeight, setTempWeight] = useState(seccion.peso.toString());

  const handleSaveTitle = () => {
    onUpdate({ nombre: tempTitle });
    setIsEditingTitle(false);
  };

  const handleSaveWeight = () => {
    const weight = parseInt(tempWeight);
    if (!isNaN(weight) && weight >= 0 && weight <= 100) {
      onUpdate({ peso: weight });
    } else {
      setTempWeight(seccion.peso.toString());
    }
    setIsEditingWeight(false);
  };

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer ${
        isActive ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Section Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Badge 
              variant="secondary" 
              className="bg-primary text-primary-foreground font-medium px-3 py-1"
            >
              Sección {index + 1} de {totalSecciones}
            </Badge>
            {isActive && (
              <Badge variant="outline" className="text-xs">
                Activa
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {isEditingWeight ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    onBlur={handleSaveWeight}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveWeight()}
                    className="w-16 h-6 text-xs"
                    type="number"
                    min="0"
                    max="100"
                    autoFocus
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              ) : (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingWeight(true);
                  }}
                >
                  {seccion.peso}%
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Section Title */}
        <div className="mt-4">
          {isEditingTitle ? (
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              className="text-xl font-medium border-none p-0 h-auto focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h3 
              className="text-xl font-medium cursor-text hover:bg-muted/50 p-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {seccion.nombre}
            </h3>
          )}
        </div>
      </CardHeader>

      {/* Section Content */}
      <CardContent className="space-y-4">
        {seccion.campos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">❓</div>
            <p>Haz clic en el botón + del panel derecho para agregar preguntas</p>
          </div>
        ) : (
          seccion.campos
            .sort((a, b) => a.orden - b.orden)
            .map((campo) => (
              <GoogleFormsFieldV2
                key={campo.id}
                campo={campo}
                onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                onDelete={() => onDeleteCampo(campo.id)}
              />
            ))
        )}
      </CardContent>
    </Card>
  );
}