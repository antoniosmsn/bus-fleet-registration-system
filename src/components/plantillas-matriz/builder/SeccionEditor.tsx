import { useState } from 'react';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Edit3, Columns, Columns2, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';
import { CampoEditor } from './CampoEditor';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface SeccionEditorProps {
  seccion: SeccionBuilder;
  dragHandleProps?: any;
  esActiva?: boolean;
  onUpdate: (updates: Partial<SeccionBuilder>) => void;
  onDelete: () => void;
  onAddCampo: (campo: CampoBuilder) => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onSeleccionar: () => void;
}

export function SeccionEditor({
  seccion,
  dragHandleProps,
  esActiva = false,
  onUpdate,
  onDelete,
  onAddCampo,
  onUpdateCampo,
  onDeleteCampo,
  onSeleccionar
}: SeccionEditorProps) {
  const [editando, setEditando] = useState(false);
  const [tempNombre, setTempNombre] = useState(seccion.nombre);
  const [tempPeso, setTempPeso] = useState(seccion.peso.toString());

  const pesoTotalCampos = seccion.campos.reduce((total, campo) => total + campo.peso, 0);

  const handleSaveEdicion = () => {
    const peso = parseInt(tempPeso) || 0;
    onUpdate({ 
      nombre: tempNombre.trim() || 'Sección sin nombre',
      peso: peso
    });
    setEditando(false);
  };

  const handleCancelEdicion = () => {
    setTempNombre(seccion.nombre);
    setTempPeso(seccion.peso.toString());
    setEditando(false);
  };

  const handleDragEndCampos = () => {
    // Esta función ahora está vacía porque el drag se maneja en el componente padre
  };

  return (
    <Card 
      onClick={onSeleccionar}
      className={`relative transition-all duration-200 cursor-pointer border-2 ${
        esActiva 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-transparent hover:border-primary/30'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-move p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1">
            {editando ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-foreground">Nombre de la sección</Label>
                  <Input
                    value={tempNombre}
                    onChange={(e) => setTempNombre(e.target.value)}
                    className="h-8 text-foreground"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label className="text-xs text-foreground">Peso sección</Label>
                  <Input
                    type="number"
                    value={tempPeso}
                    onChange={(e) => setTempPeso(e.target.value)}
                    className="h-8 text-foreground"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Collapsible open={seccion.expanded} onOpenChange={(open) => onUpdate({ expanded: open })}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {seccion.expanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
                
                <div className="flex-1">
                  <h3 className="font-medium">{seccion.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Peso: {seccion.peso}%
                    </Badge>
                    <Badge 
                      variant={pesoTotalCampos === seccion.peso ? "default" : "destructive"}
                      className="text-xs"
                    >
                      Campos: {pesoTotalCampos}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {seccion.campos.length} campo{seccion.campos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!editando && (
              <>
                <div className="flex items-center border rounded p-1 gap-1">
                  <Button
                    size="sm"
                    variant={seccion.columnas === 1 || !seccion.columnas ? "default" : "ghost"}
                    onClick={() => onUpdate({ columnas: 1, camposEnColumnas: undefined })}
                    className="h-6 w-6 p-0"
                  >
                    <Columns className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={seccion.columnas === 2 ? "default" : "ghost"}
                    onClick={() => onUpdate({ columnas: 2, camposEnColumnas: [[], []] })}
                    className="h-6 w-6 p-0"
                  >
                    <Columns2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={seccion.columnas === 3 ? "default" : "ghost"}
                    onClick={() => onUpdate({ columnas: 3, camposEnColumnas: [[], [], []] })}
                    className="h-6 w-6 p-0"
                  >
                    <Columns3 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
            
            {editando ? (
              <>
                <Button size="sm" variant="outline" onClick={handleSaveEdicion}>
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdicion}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditando(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <Collapsible open={seccion.expanded} onOpenChange={(open) => onUpdate({ expanded: open })}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            
            {/* Layout en columnas o simple */}
            {seccion.columnas && seccion.columnas > 1 ? (
              <div className={`grid gap-4 ${
                seccion.columnas === 2 ? 'grid-cols-2' : 
                seccion.columnas === 3 ? 'grid-cols-3' : 'grid-cols-1'
              }`}>
                {Array.from({ length: seccion.columnas }).map((_, colIndex) => (
                  <Droppable 
                    key={`col-${colIndex}`}
                    droppableId={`seccion-${seccion.id}-col-${colIndex}`} 
                    type="CAMPO"
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-32 rounded-lg border-2 border-dashed p-3 transition-all duration-200 ${
                          snapshot.isDraggingOver 
                            ? 'border-primary bg-primary/10 shadow-lg' 
                            : 'border-muted-foreground/30 hover:border-primary/50'
                        }`}
                      >
                        <div className="text-center text-muted-foreground mb-2">
                          <p className="text-xs font-medium">Columna {colIndex + 1}</p>
                        </div>
                        
                        {/* Mostrar campos de esta columna */}
                        <div className="space-y-2">
                          {seccion.campos
                            .filter((_, index) => index % seccion.columnas! === colIndex)
                            .map((campo, index) => (
                              <Draggable key={campo.id} draggableId={campo.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`transition-transform duration-200 ${
                                      snapshot.isDragging ? 'rotate-1 scale-105 z-50' : ''
                                    }`}
                                  >
                                    <CampoEditor
                                      campo={campo}
                                      dragHandleProps={provided.dragHandleProps}
                                      onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                                      onDelete={() => onDeleteCampo(campo.id)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        </div>
                        {provided.placeholder}
                        
                        {/* Indicador visual cuando se arrastra */}
                        {snapshot.isDraggingOver && (
                          <div className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
                        )}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            ) : (
              /* Layout simple sin columnas */
              <Droppable droppableId={`seccion-${seccion.id}`} type="CAMPO">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-24 rounded-lg border-2 border-dashed p-4 transition-all duration-200 ${
                      snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-muted-foreground/30 hover:border-primary/50'
                    }`}
                  >
                    {seccion.campos.length === 0 ? (
                      <div className="text-center text-muted-foreground py-6">
                        <div className="space-y-2">
                          <p className="text-lg">📋</p>
                          <p className="font-medium">Zona de campos</p>
                          <p className="text-sm">Arrastra elementos desde el panel lateral</p>
                          <p className="text-xs text-muted-foreground/70">
                            Los campos aparecerán aquí automáticamente
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {seccion.campos.map((campo, index) => (
                          <Draggable key={campo.id} draggableId={campo.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-transform duration-200 ${
                                  snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
                                }`}
                              >
                                <CampoEditor
                                  campo={campo}
                                  dragHandleProps={provided.dragHandleProps}
                                  onUpdate={(updates) => onUpdateCampo(campo.id, updates)}
                                  onDelete={() => onDeleteCampo(campo.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                    
                    {/* Indicador visual cuando se arrastra */}
                    {snapshot.isDraggingOver && (
                      <div className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
                    )}
                  </div>
                )}
              </Droppable>
            )}

            <div className="flex justify-center mt-3">
              <p className="text-xs text-muted-foreground">
                💡 Usa el panel lateral para agregar elementos
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}