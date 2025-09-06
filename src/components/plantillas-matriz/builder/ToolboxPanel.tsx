import { Type, Square, ChevronDown, Circle, Calendar, Pen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockToolboxElementos } from '@/data/mockToolboxElementos';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const iconMap = {
  Type,
  Square,
  ChevronDown,
  Circle,
  Calendar,
  Pen,
};

export function ToolboxPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Elementos de Formulario</h2>
        <p className="text-sm text-muted-foreground">
          Arrastra los elementos a las secciones
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Tipos de Campo Disponibles
          </h3>

          <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="toolbox" isDropDisabled={true}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {mockToolboxElementos.map((elemento, index) => {
                    const IconComponent = iconMap[elemento.icono as keyof typeof iconMap];
                    
                    return (
                      <Draggable
                        key={elemento.id}
                        draggableId={elemento.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-move transition-all duration-200 hover:shadow-lg border-2 ${
                              snapshot.isDragging 
                                ? 'shadow-2xl rotate-3 scale-110 bg-primary/10 border-primary z-50' 
                                : 'hover:bg-accent/50 border-transparent hover:border-primary/20'
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
                                  {IconComponent && (
                                    <IconComponent className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate text-foreground">
                                    {elemento.nombre}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {elemento.descripcion}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <Badge variant="outline" className="text-xs px-2 py-1">
                                    Arrastrar
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Separator className="my-6" />

        {/* Instrucciones */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900 text-sm">💡 Cómo usar:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Arrastra cualquier elemento a una sección</li>
                <li>• Los campos se agregan automáticamente</li>
                <li>• Configura pesos y propiedades después</li>
                <li>• Los pesos deben sumar exactamente 100%</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de campo disponibles */}
        <Card className="mt-4 bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3">Tipos de Campo:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Type className="h-3 w-3" />
                <span>Texto</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronDown className="h-3 w-3" />
                <span>Lista</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" />
                <span>Checkbox</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-3 w-3" />
                <span>Radio</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Fecha</span>
              </div>
              <div className="flex items-center gap-2">
                <Pen className="h-3 w-3" />
                <span>Canvas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}