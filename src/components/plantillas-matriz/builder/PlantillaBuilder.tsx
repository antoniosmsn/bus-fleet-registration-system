import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlantillaBuilder as PlantillaBuilderType, SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';
import { GoogleFormsToolbox } from './GoogleFormsToolbox';
import { GoogleFormsSection } from './GoogleFormsSection';
// Removed WeightInputDialog import - no longer needed
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

  // Removed weightDialog state - fields are created directly with default weight

  // Calcular peso total
  const pesoTotal = builderData.secciones.reduce((total, seccion) => total + seccion.peso, 0);

  const handleAddSeccion = () => {
    const nuevaSeccion: SeccionBuilder = {
      id: `seccion-${Date.now()}`,
      nombre: `Sección sin título`,
      peso: 20, // Default weight
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

  const handleAddField = (tipo: string) => {
    // Find an active section or use the first one
    const activeSection = builderData.secciones[0];
    if (!activeSection) {
      toast({
        title: "Error",
        description: "Debe crear al menos una sección primero",
        variant: "destructive"
      });
      return;
    }

    const fieldNames: Record<string, string> = {
      texto: 'Respuesta corta',
      select: 'Lista desplegable', 
      radio: 'Opción múltiple',
      checkbox: 'Casillas de verificación',
      fecha: 'Fecha',
      canvas: 'Dibujo'
    };

    // Create field directly with default weight of 5
    const nuevoCampo: CampoBuilder = {
      id: `campo-${Date.now()}`,
      tipo: tipo as any,
      etiqueta: 'Pregunta sin título',
      requerido: false,
      peso: 5, // Default weight, user can edit later
      orden: 0,
      opciones: (tipo === 'select' || tipo === 'radio' || tipo === 'checkbox') 
        ? ['Opción 1', 'Opción 2'] 
        : undefined
    };

    setBuilderData(prevData => ({
      ...prevData,
      secciones: prevData.secciones.map(s => 
        s.id === activeSection.id 
          ? { ...s, campos: [...s.campos, nuevoCampo] }
          : s
      )
    }));

    toast({
      title: "Campo agregado",
      description: `Se agregó un campo ${fieldNames[tipo] || 'Campo'}. Recuerda configurar su peso.`
    });
  };

  // Removed handleConfirmWeight - fields are created directly

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

  const handleDuplicateCampo = (seccionId: string, campoId: string) => {
    const seccion = builderData.secciones.find(s => s.id === seccionId);
    const campo = seccion?.campos.find(c => c.id === campoId);
    
    if (!campo) return;

    const duplicatedCampo: CampoBuilder = {
      ...campo,
      id: `campo-${Date.now()}`,
      etiqueta: `${campo.etiqueta} (copia)`,
      orden: campo.orden + 1
    };

    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId 
          ? { ...s, campos: [...s.campos, duplicatedCampo] }
          : s
      )
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Reordenar campos dentro de una sección
    if (source.droppableId.includes('seccion-') && destination.droppableId.includes('seccion-')) {
      const sourceSeccionId = source.droppableId.replace('seccion-', '');
      const destSeccionId = destination.droppableId.replace('seccion-', '');
      
      if (source.droppableId === destination.droppableId) {
        // Reordenar dentro de la misma sección
        const seccion = builderData.secciones.find(s => s.id === sourceSeccionId);
        if (!seccion) return;

        const newCampos = Array.from(seccion.campos);
        const [reorderedItem] = newCampos.splice(source.index, 1);
        newCampos.splice(destination.index, 0, reorderedItem);

        const camposConOrden = newCampos.map((campo, index) => ({
          ...campo,
          orden: index
        }));

        handleUpdateSeccion(sourceSeccionId, { campos: camposConOrden });
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-muted/20">
        {/* Google Forms Style Toolbox */}
        <GoogleFormsToolbox onAddField={handleAddField} />

        {/* Main Builder Area - Google Forms Style */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-primary">
                    {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Agrega preguntas desde el panel lateral
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant={pesoTotal === 100 ? "default" : "destructive"} className="text-sm">
                  Peso Total: {pesoTotal}%
                </Badge>
                <Button onClick={handleSave} disabled={loading || pesoTotal !== 100} className="px-6">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Plantilla
                </Button>
              </div>
            </div>
          </div>

          {/* Builder Content - Google Forms Style */}
          <div className="flex-1 overflow-auto bg-gradient-to-b from-muted/20 to-background">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Form Header - Google Forms Style */}
              <Card className="border-t-8 border-t-primary">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <Input
                      value={builderData.nombre}
                      onChange={(e) => setBuilderData({ ...builderData, nombre: e.target.value })}
                      placeholder="Formulario sin título"
                      className="text-3xl font-normal border-0 border-b-2 border-muted-foreground/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                      maxLength={100}
                    />
                    <Input
                      value={builderData.descripcion}
                      onChange={(e) => setBuilderData({ ...builderData, descripcion: e.target.value })}
                      placeholder="Descripción del formulario"
                      className="text-base border-0 border-b border-muted-foreground/20 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                      maxLength={200}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sections - Google Forms Style */}
              <Droppable droppableId="secciones" type="SECCION">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-6"
                  >
                    {builderData.secciones.length === 0 ? (
                      <Card className="border-dashed border-2 border-muted-foreground/30">
                        <CardContent className="p-12 text-center text-muted-foreground">
                          <div className="space-y-4">
                            <div className="text-6xl">📝</div>
                            <div>
                              <h3 className="text-xl font-medium mb-2">Comienza creando una sección</h3>
                              <p className="text-sm mb-4">Las secciones te ayudan a organizar tu formulario</p>
                              <Button onClick={handleAddSeccion} className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Primera Sección
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      builderData.secciones.map((seccion, index) => (
                        <Draggable 
                          key={seccion.id} 
                          draggableId={seccion.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-transform duration-200 ${
                                snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
                              }`}
                            >
                              <GoogleFormsSection
                                seccion={seccion}
                                sectionIndex={index}
                                totalSections={builderData.secciones.length}
                                dragHandleProps={provided.dragHandleProps}
                                onUpdate={(updates) => handleUpdateSeccion(seccion.id, updates)}
                                onDelete={() => handleDeleteSeccion(seccion.id)}
                                onUpdateCampo={(campoId, updates) => handleUpdateCampo(seccion.id, campoId, updates)}
                                onDeleteCampo={(campoId) => handleDeleteCampo(seccion.id, campoId)}
                                onDuplicateCampo={(campoId) => handleDuplicateCampo(seccion.id, campoId)}
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

              {/* Add Section Button - Google Forms Style */}
              {builderData.secciones.length > 0 && (
                <div className="flex justify-center">
                  <Button onClick={handleAddSeccion} variant="outline" size="lg" className="border-2 border-dashed">
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Sección
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weight dialog removed - fields are editable inline */}
    </DragDropContext>
  );
}