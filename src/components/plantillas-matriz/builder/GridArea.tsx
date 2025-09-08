import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CampoBuilder } from '@/types/plantilla-matriz';
import { GoogleFormsField } from './GoogleFormsField';

interface GridAreaProps {
  areaId: string;
  areaName: string;
  campos: CampoBuilder[];
  onAddField: (tipoElemento: string) => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onDuplicateCampo: (campoId: string) => void;
  className?: string;
  isDragDisabled?: boolean;
}

export function GridArea({
  areaId,
  areaName,
  campos,
  onAddField,
  onUpdateCampo,
  onDeleteCampo,
  onDuplicateCampo,
  className = '',
  isDragDisabled = false
}: GridAreaProps) {
  return (
    <div className={`min-h-[120px] ${className}`}>
      <div className="mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {areaName}
        </span>
      </div>
      
      <Droppable droppableId={`grid-area-${areaId}`} type="FIELD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[80px] rounded-lg border-2 border-dashed transition-all ${
              snapshot.isDraggingOver
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-muted-foreground/25 bg-muted/20'
            } ${campos.length === 0 ? 'flex items-center justify-center' : 'p-3 space-y-2'}`}
          >
            {campos.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-muted-foreground text-sm mb-2">
                  Arrastra elementos aquí
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddField('texto')}
                  className="h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar Texto
                </Button>
              </div>
            ) : (
              campos.map((campo, index) => (
                <Draggable
                  key={campo.id}
                  draggableId={`field-${campo.id}`}
                  index={index}
                  isDragDisabled={isDragDisabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <Card className="relative group">
                        <div
                          {...provided.dragHandleProps}
                          className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="pl-8">
                          <GoogleFormsField
                            campo={campo}
                            onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                            onDelete={() => onDeleteCampo(campo.id)}
                            onDuplicate={() => onDuplicateCampo(campo.id)}
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}