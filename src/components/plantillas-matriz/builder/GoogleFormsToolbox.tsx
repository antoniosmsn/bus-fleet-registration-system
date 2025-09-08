import { Type, ChevronDown, Circle, Square, Calendar, Pen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface GoogleFormsToolboxProps {
  onAddField: (tipo: string, seccionId?: string) => void;
  seccionActiva: string | null;
  secciones: any[];
}

const fieldTypes = [
  { id: 'texto', name: 'Texto', icon: Type, description: 'Una línea de texto' },
  { id: 'select', name: 'Lista desplegable', icon: ChevronDown, description: 'Menú desplegable' },
  { id: 'radio', name: 'Opción múltiple', icon: Circle, description: 'Seleccionar una opción' },
  { id: 'checkbox', name: 'Casillas de verificación', icon: Square, description: 'Seleccionar varias opciones' },
  { id: 'fecha', name: 'Fecha', icon: Calendar, description: 'Selector de fecha' },
  { id: 'canvas', name: 'Dibujo', icon: Pen, description: 'Área de dibujo libre' }
];

export function GoogleFormsToolbox({ onAddField, seccionActiva, secciones }: GoogleFormsToolboxProps) {
  const seccionActivaNombre = secciones.find(s => s.id === seccionActiva)?.nombre || 'Ninguna';
  
  return (
    <div className="h-full bg-background border-r border-border">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-base">Tipos de pregunta</h3>
        <p className="text-xs text-muted-foreground">
          Haz clic para agregar a sección activa
        </p>
        {secciones.length > 0 && (
          <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
            <span className="font-medium">Sección activa:</span> {seccionActivaNombre}
          </div>
        )}
      </div>
      
      <Droppable droppableId="toolbox" isDropDisabled={true}>
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="p-3 space-y-2 h-full overflow-auto"
          >
            {fieldTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Draggable 
                  key={type.id}
                  draggableId={`toolbox-${type.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-all border-2 hover:border-primary/30 ${
                        snapshot.isDragging ? 'shadow-lg scale-105 rotate-2 z-50 cursor-grabbing' : ''
                      }`}
                      onClick={() => !snapshot.isDragging && onAddField(type.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-primary/10">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs truncate">{type.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{type.description}</p>
                          </div>
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            
            <Separator className="my-4" />
            
            <div className="text-center text-xs text-muted-foreground">
              <p>💡 Configura el peso y propiedades</p>
              <p>de cada campo después de agregarlo</p>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}