import { useState } from 'react';
import { GripVertical, Trash2, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';
import { GoogleFormsField } from './GoogleFormsField';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface GoogleFormsSectionProps {
  seccion: SeccionBuilder;
  sectionIndex: number;
  totalSections: number;
  dragHandleProps?: any;
  onUpdate: (updates: Partial<SeccionBuilder>) => void;
  onDelete: () => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onDuplicateCampo: (campoId: string) => void;
}

export function GoogleFormsSection({
  seccion,
  sectionIndex,
  totalSections,
  dragHandleProps,
  onUpdate,
  onDelete,
  onUpdateCampo,
  onDeleteCampo,
  onDuplicateCampo
}: GoogleFormsSectionProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [tempTitle, setTempTitle] = useState(seccion.nombre);
  const [tempWeight, setTempWeight] = useState(seccion.peso.toString());

  const pesoTotalCampos = seccion.campos.reduce((total, campo) => total + campo.peso, 0);

  const handleSaveTitle = () => {
    onUpdate({ nombre: tempTitle.trim() || 'Sección sin título' });
    setEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTempTitle(seccion.nombre);
    setEditingTitle(false);
  };

  const handleSaveWeight = () => {
    const peso = parseInt(tempWeight) || 0;
    onUpdate({ peso: peso });
    setEditingWeight(false);
  };

  const handleCancelWeight = () => {
    setTempWeight(seccion.peso.toString());
    setEditingWeight(false);
  };

  return (
    <div className="space-y-1">
      {/* Section Header - Google Forms style */}
      <div className="bg-primary text-primary-foreground rounded-t-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div {...dragHandleProps} className="cursor-move p-1">
              <GripVertical className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">
              Sección {sectionIndex + 1} de {totalSections}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {editingWeight ? (
              <div className="flex items-center gap-1">
                <span className="text-xs">Peso:</span>
                <Input
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  className={`w-16 h-6 text-xs ${
                    !tempWeight || parseInt(tempWeight) === 0 
                      ? 'border-destructive focus-visible:ring-destructive text-destructive' 
                      : ''
                  }`}
                  type="number"
                  min="1"
                  max="100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveWeight();
                    if (e.key === 'Escape') handleCancelWeight();
                  }}
                />
                <span className="text-xs">%</span>
                <Button size="sm" onClick={handleSaveWeight} className="h-6 px-2 text-xs">
                  ✓
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelWeight} className="h-6 px-2 text-xs">
                  ✕
                </Button>
              </div>
            ) : (
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => setEditingWeight(true)}
              >
                Peso: {seccion.peso}% ({pesoTotalCampos}%)
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-6 w-6 p-0 text-primary-foreground hover:text-destructive hover:bg-background/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-6">
          {/* Section Title */}
          <div className="mb-6">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Título de sección"
                  className="text-2xl font-normal border-0 border-b-2 border-primary/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                  maxLength={100}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') handleCancelTitle();
                  }}
                />
                <Button size="sm" onClick={handleSaveTitle}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelTitle}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 
                  className="text-2xl font-normal text-foreground cursor-pointer hover:text-primary transition-colors flex-1"
                  onClick={() => setEditingTitle(true)}
                >
                  {seccion.nombre}
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            )}
            
          </div>

          {/* Fields */}
          <Droppable droppableId={`seccion-${seccion.id}`} type="CAMPO">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 transition-all duration-200 ${
                  snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-4' : ''
                }`}
              >
                {seccion.campos.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="space-y-2">
                      <p className="text-lg">📝</p>
                      <p className="font-medium">Agrega tu primera pregunta</p>
                      <p className="text-sm">Selecciona un tipo de pregunta del panel lateral</p>
                    </div>
                  </div>
                ) : (
                  seccion.campos.map((campo, index) => (
                    <Draggable key={campo.id} draggableId={campo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-transform duration-200 ${
                            snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
                          }`}
                        >
                          <GoogleFormsField
                            campo={campo}
                            dragHandleProps={provided.dragHandleProps}
                            onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                            onDelete={() => onDeleteCampo(campo.id)}
                            onDuplicate={() => onDuplicateCampo(campo.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </div>
  );
}