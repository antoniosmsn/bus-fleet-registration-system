import { useState } from 'react';
import { Draggable, Droppable, DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Type, Square, ChevronDown, Circle, Calendar, Pen, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockToolboxElementos } from '@/data/mockToolboxElementos';
import { CampoBuilder } from '@/types/plantilla-matriz';

interface ToolboxPanelProps {
  onAddCampo: (seccionId: string, campo: CampoBuilder) => void;
}

const iconMap = {
  Type,
  Square,
  ChevronDown,
  Circle,
  Calendar,
  Pen,
};

export function ToolboxPanel({ onAddCampo }: ToolboxPanelProps) {
  const [selectedSeccionId, setSelectedSeccionId] = useState<string>('');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !selectedSeccionId) return;

    const elementoId = result.draggableId;
    const elemento = mockToolboxElementos.find(e => e.id === elementoId);
    
    if (!elemento) return;

    const nuevoCampo: CampoBuilder = {
      id: '',
      tipo: elemento.tipo,
      etiqueta: `${elemento.nombre} sin título`,
      requerido: true,
      peso: 5,
      orden: 0,
      opciones: elemento.tipo === 'select' || elemento.tipo === 'radio' 
        ? ['Opción 1', 'Opción 2'] 
        : undefined
    };

    onAddCampo(selectedSeccionId, nuevoCampo);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Caja de Herramientas</h2>
        <p className="text-sm text-muted-foreground">
          Arrastra elementos a las secciones
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Información */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Cómo usar:</p>
                <p className="text-blue-700 mt-1">
                  Selecciona una sección destino y arrastra los elementos desde aquí
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Elementos del Toolbox */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Tipos de Campo
          </h3>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="toolbox" isDropDisabled={true}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
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
                            className={`cursor-move transition-all hover:shadow-md ${
                              snapshot.isDragging 
                                ? 'shadow-lg rotate-2 scale-105 bg-primary/10' 
                                : 'hover:bg-accent/50'
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {IconComponent && (
                                    <IconComponent className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {elemento.nombre}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {elemento.descripcion}
                                  </p>
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

        <Separator />

        {/* Atajos de teclado */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Atajos de Teclado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Guardar</span>
              <Badge variant="outline" className="text-xs">Ctrl + S</Badge>
            </div>
            <div className="flex justify-between">
              <span>Deshacer</span>
              <Badge variant="outline" className="text-xs">Ctrl + Z</Badge>
            </div>
            <div className="flex justify-between">
              <span>Vista previa</span>
              <Badge variant="outline" className="text-xs">Ctrl + P</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}