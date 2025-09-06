import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Trash2, Edit3, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PlantillaBuilder as PlantillaBuilderType, SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';
import { ToolboxPanel } from './ToolboxPanel';
import { SeccionEditor } from './SeccionEditor';
import { CampoEditor } from './CampoEditor';
import { toast } from '@/hooks/use-toast';

interface PlantillaBuilderProps {
  plantilla?: PlantillaBuilderType;
  onSave: (plantilla: PlantillaBuilderType) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function PlantillaBuilder({ 
  plantilla, 
  onSave, 
  onCancel, 
  loading = false 
}: PlantillaBuilderProps) {
  const [builderData, setBuilderData] = useState<PlantillaBuilderType>({
    id: plantilla?.id || '',
    nombre: plantilla?.nombre || '',
    descripcion: plantilla?.descripcion || '',
    secciones: plantilla?.secciones || []
  });

  const [editandoSeccion, setEditandoSeccion] = useState<string | null>(null);
  const [editandoCampo, setEditandoCampo] = useState<{ seccionId: string; campoId: string } | null>(null);

  // Calcular peso total
  const pesoTotal = builderData.secciones.reduce((total, seccion) => total + seccion.peso, 0);

  const handleAddSeccion = () => {
    const nuevaSeccion: SeccionBuilder = {
      id: `seccion-${Date.now()}`,
      nombre: `Nueva Sección ${builderData.secciones.length + 1}`,
      peso: 0,
      campos: [],
      orden: builderData.secciones.length,
      expanded: true
    };

    setBuilderData({
      ...builderData,
      secciones: [...builderData.secciones, nuevaSeccion]
    });
  };

  const handleDeleteSeccion = (seccionId: string) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.filter(s => s.id !== seccionId)
    });
  };

  const handleUpdateSeccion = (seccionId: string, updates: Partial<SeccionBuilder>) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId ? { ...s, ...updates } : s
      )
    });
  };

  const handleAddCampoToSeccion = (seccionId: string, campo: CampoBuilder) => {
    const nuevoCampo: CampoBuilder = {
      id: `campo-${Date.now()}`,
      ...campo,
      orden: 0
    };

    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId 
          ? { ...s, campos: [...s.campos, nuevoCampo] }
          : s
      )
    });
  };

  const handleUpdateCampo = (seccionId: string, campoId: string, updates: Partial<CampoBuilder>) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId 
          ? {
              ...s,
              campos: s.campos.map(c => 
                c.id === campoId ? { ...c, ...updates } : c
              )
            }
          : s
      )
    });
  };

  const handleDeleteCampo = (seccionId: string, campoId: string) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId 
          ? { ...s, campos: s.campos.filter(c => c.id !== campoId) }
          : s
      )
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Arrastrar elementos del toolbox a secciones
    if (source.droppableId === 'toolbox' && destination.droppableId.startsWith('seccion-')) {
      const elementoId = result.draggableId;
      const seccionId = destination.droppableId.replace('seccion-', '');
      
      // Crear nuevo campo basado en el elemento arrastrado
      const nuevoCampo: CampoBuilder = {
        id: `campo-${Date.now()}`,
        tipo: elementoId as any,
        etiqueta: `Nuevo ${elementoId}`,
        requerido: true,
        peso: 5,
        orden: destination.index,
        opciones: (elementoId === 'select' || elementoId === 'radio') 
          ? ['Opción 1', 'Opción 2'] 
          : undefined
      };

      handleAddCampoToSeccion(seccionId, nuevoCampo);
      
      toast({
        title: "Campo agregado",
        description: `Se agregó un campo de tipo ${elementoId} a la sección.`
      });
      return;
    }

    // Reordenar campos dentro de una sección
    if (source.droppableId.startsWith('seccion-') && destination.droppableId.startsWith('seccion-')) {
      const seccionId = source.droppableId.replace('seccion-', '');
      
      if (source.droppableId === destination.droppableId) {
        // Reordenar dentro de la misma sección
        const seccion = builderData.secciones.find(s => s.id === seccionId);
        if (!seccion) return;

        const newCampos = Array.from(seccion.campos);
        const [reorderedItem] = newCampos.splice(source.index, 1);
        newCampos.splice(destination.index, 0, reorderedItem);

        const camposConOrden = newCampos.map((campo, index) => ({
          ...campo,
          orden: index
        }));

        handleUpdateSeccion(seccionId, { campos: camposConOrden });
      }
      return;
    }

    // Reordenar secciones
    if (type === 'SECCION') {
      const newSecciones = Array.from(builderData.secciones);
      const [reorderedItem] = newSecciones.splice(source.index, 1);
      newSecciones.splice(destination.index, 0, reorderedItem);

      setBuilderData({
        ...builderData,
        secciones: newSecciones.map((s, index) => ({ ...s, orden: index }))
      });
    }
  };

  const handleSave = () => {
    // Validaciones
    if (!builderData.nombre.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre de la plantilla es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (builderData.secciones.length === 0) {
      toast({
        title: "Error de validación", 
        description: "Debe agregar al menos una sección",
        variant: "destructive"
      });
      return;
    }

    if (pesoTotal !== 100) {
      toast({
        title: "Error de validación",
        description: `El peso total debe ser 100%. Actualmente es ${pesoTotal}%`,
        variant: "destructive"
      });
      return;
    }

    onSave(builderData);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Toolbox Panel - Estilo SurveyJS */}
      <div className="w-80 border-r bg-muted/30">
        <ToolboxPanel />
      </div>

      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Arrastra elementos del panel lateral a las secciones
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={pesoTotal === 100 ? "default" : "destructive"}>
                Peso Total: {pesoTotal}%
              </Badge>
              <Button onClick={handleSave} disabled={loading || pesoTotal !== 100}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>

        {/* Builder Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Plantilla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la plantilla *</Label>
                    <Input
                      value={builderData.nombre}
                      onChange={(e) => setBuilderData({ ...builderData, nombre: e.target.value })}
                      placeholder="Ingrese el nombre..."
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción (opcional)</Label>
                    <Input
                      value={builderData.descripcion}
                      onChange={(e) => setBuilderData({ ...builderData, descripcion: e.target.value })}
                      placeholder="Descripción breve..."
                      maxLength={200}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secciones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Secciones de la Plantilla</h2>
                <Button onClick={handleAddSeccion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Sección
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="secciones" type="SECCION">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {builderData.secciones.map((seccion, index) => (
                        <Draggable 
                          key={seccion.id} 
                          draggableId={seccion.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transform transition-transform ${
                                snapshot.isDragging ? 'rotate-1 scale-105' : ''
                              }`}
                            >
                              <SeccionEditor
                                seccion={seccion}
                                dragHandleProps={provided.dragHandleProps}
                                onUpdate={(updates) => handleUpdateSeccion(seccion.id, updates)}
                                onDelete={() => handleDeleteSeccion(seccion.id)}
                                onAddCampo={(campo) => handleAddCampoToSeccion(seccion.id, campo)}
                                onUpdateCampo={(campoId, updates) => handleUpdateCampo(seccion.id, campoId, updates)}
                                onDeleteCampo={(campoId) => handleDeleteCampo(seccion.id, campoId)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {builderData.secciones.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <p>No hay secciones creadas</p>
                      <p className="text-sm">Haz clic en "Agregar Sección" para comenzar</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}