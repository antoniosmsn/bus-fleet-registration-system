import { useState } from 'react';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { Droppable, Draggable, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GoogleFormsFieldV2 } from './GoogleFormsFieldV2';
import { GoogleFormsToolboxV2 } from './GoogleFormsToolboxV2';
import { SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';

interface GoogleFormsSectionV2Props {
  seccion: SeccionBuilder;
  index: number;
  totalSecciones: number;
  isActive: boolean;
  showToolbox: boolean;
  onUpdate: (updates: Partial<SeccionBuilder>) => void;
  onDelete: () => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onClick: () => void;
  onAddField: (tipo: string) => void;
  onCloseToolbox: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function GoogleFormsSectionV2({
  seccion,
  index,
  totalSecciones,
  isActive,
  showToolbox,
  onUpdate,
  onDelete,
  onUpdateCampo,
  onDeleteCampo,
  onClick,
  onAddField,
  onCloseToolbox,
  dragHandleProps
}: GoogleFormsSectionV2Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [tempTitle, setTempTitle] = useState(seccion.nombre);
  const [tempWeight, setTempWeight] = useState(seccion.peso?.toString() || '');

  const handleSaveTitle = () => {
    onUpdate({ nombre: tempTitle });
    setIsEditingTitle(false);
  };

  const handleSaveWeight = () => {
    const weight = parseFloat(tempWeight);
    if (!isNaN(weight) && weight >= 0 && weight <= 100) {
      onUpdate({ peso: weight });
      // Redistribute field weights proportionally if section weight > 0
      if (weight > 0) {
        redistributeFieldWeights(weight);
      }
      setIsEditingWeight(false);
    } else if (tempWeight === '' || weight === 0) {
      onUpdate({ peso: 0 });
      setIsEditingWeight(false);
    }
  };

  const redistributeFieldWeights = (sectionWeight: number) => {
    const checkboxRadioFields = seccion.campos.filter(campo => 
      campo.tipo === 'checkbox' || campo.tipo === 'radio'
    );
    
    if (checkboxRadioFields.length > 0 && sectionWeight > 0) {
      const weightPerField = Math.floor(sectionWeight / checkboxRadioFields.length);
      const remainder = sectionWeight % checkboxRadioFields.length;
      
      checkboxRadioFields.forEach((campo, index) => {
        const fieldWeight = weightPerField + (index < remainder ? 1 : 0);
        onUpdateCampo(campo.id, { peso: fieldWeight });
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Card 
        className={`flex-1 transition-all duration-200 cursor-pointer ${
          isActive ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
        }`}
        onClick={onClick}
      >
      {/* Section Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div {...dragHandleProps} className="cursor-move">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {isEditingWeight ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    onBlur={handleSaveWeight}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveWeight();
                      }
                    }}
                  className={`w-16 h-6 text-xs ${
                    tempWeight === '' || (!tempWeight && parseFloat(tempWeight) !== 0)
                      ? 'border-destructive focus-visible:ring-destructive text-destructive' 
                      : ''
                  }`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Peso"
                    autoFocus
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              ) : (
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer ${
                    !seccion.peso && seccion.peso !== 0 
                      ? 'border-destructive text-destructive' 
                      : seccion.peso === 0 
                        ? 'border-amber-500 text-amber-600' 
                        : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempWeight(seccion.peso?.toString() || '');
                    setIsEditingWeight(true);
                  }}
                >
                  {seccion.peso !== undefined ? `${seccion.peso}%` : 'Sin peso'}
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
              className={`text-xl font-medium cursor-text hover:bg-muted/50 p-1 rounded ${
                !seccion.nombre.trim() ? 'text-destructive' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {seccion.nombre || 'Título de sección requerido'}
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
          <Droppable droppableId={seccion.id} type="FIELD">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg p-2' : ''}`}
              >
                {seccion.campos
                  .sort((a, b) => a.orden - b.orden)
                  .map((campo, index) => (
                    <Draggable key={campo.id} draggableId={campo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'opacity-75' : ''}
                        >
                          <GoogleFormsFieldV2
                            campo={campo}
                            onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                            onDelete={() => onDeleteCampo(campo.id)}
                            onDuplicate={() => {
                              // Create a duplicate of the field
                              const duplicatedCampo = {
                                ...campo,
                                id: `campo-${Date.now()}`,
                                etiqueta: `${campo.etiqueta} (copia)`,
                                orden: campo.orden + 1
                              };
                              // This would need to be handled at the parent level
                              // For now, just show a toast
                              console.log('Duplicate field:', duplicatedCampo);
                            }}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </CardContent>
    </Card>

    {/* Toolbox attached to active section */}
    {showToolbox && (
      <div className="w-20 flex-shrink-0">
        <GoogleFormsToolboxV2
          onAddField={onAddField}
          onClose={onCloseToolbox}
        />
      </div>
    )}
  </div>
  );
}