import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Save, ArrowLeft, Eye, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlantillaBuilder as PlantillaBuilderType, SeccionBuilder, CampoBuilder } from '@/types/plantilla-matriz';
import { GoogleFormsToolboxV2 } from './GoogleFormsToolboxV2';
import { GoogleFormsSectionV2 } from './GoogleFormsSectionV2';
import { toast } from '@/hooks/use-toast';

interface GoogleFormsBuilderV2Props {
  plantilla?: PlantillaBuilderType;
  onSave: (plantilla: PlantillaBuilderType) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function GoogleFormsBuilderV2({ 
  plantilla, 
  onSave, 
  onCancel, 
  loading = false 
}: GoogleFormsBuilderV2Props) {
  const [builderData, setBuilderData] = useState<PlantillaBuilderType>({
    id: plantilla?.id || '',
    nombre: plantilla?.nombre || '', // Empty by default, user must fill
    descripcion: plantilla?.descripcion || '',
    secciones: plantilla?.secciones || []
  });

  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const [showToolbox, setShowToolbox] = useState(false);

  // Calcular peso total
  const pesoTotal = builderData.secciones.reduce((total, seccion) => total + (seccion.peso || 0), 0);

  // Check if weights are being correctly calculated in real time
  const hasValidWeights = builderData.secciones.every(seccion => 
    seccion.peso !== undefined && seccion.peso !== null
  );

  const handleAddSeccion = () => {
    const nuevaSeccion: SeccionBuilder = {
      id: `seccion-${Date.now()}`,
      nombre: '', // Empty by default, user must fill
      peso: undefined, // User must set the weight
      campos: [],
      orden: builderData.secciones.length,
      expanded: true
    };

    setBuilderData({
      ...builderData,
      secciones: [...builderData.secciones, nuevaSeccion]
    });

    setSeccionActiva(nuevaSeccion.id);
  };

  const handleDeleteSeccion = (seccionId: string) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.filter(s => s.id !== seccionId)
    });
    
    if (seccionActiva === seccionId) {
      setSeccionActiva(null);
      setShowToolbox(false);
    }
  };

  const handleUpdateSeccion = (seccionId: string, updates: Partial<SeccionBuilder>) => {
    setBuilderData({
      ...builderData,
      secciones: builderData.secciones.map(s => 
        s.id === seccionId ? { ...s, ...updates } : s
      )
    });
  };

  const handleSeccionClick = (seccionId: string) => {
    setSeccionActiva(seccionId);
    setShowToolbox(true);
  };

  const handleAddField = (tipo: string) => {
    if (!seccionActiva) {
      toast({
        title: "Error",
        description: "Selecciona una sección primero",
        variant: "destructive"
      });
      return;
    }

    const targetSection = builderData.secciones.find(s => s.id === seccionActiva);
    if (!targetSection) return;

    const fieldNames: Record<string, string> = {
      texto: 'Texto',
      select: 'Lista desplegable', 
      radio: 'Opción múltiple',
      checkbox: 'Casillas de verificación',
      fecha: 'Fecha',
      canvas: 'Dibujo'
    };

    const nuevoCampo: CampoBuilder = {
      id: `campo-${Date.now()}`,
      tipo: tipo as any,
      etiqueta: 'Pregunta sin título',
      requerido: false,
      peso: (tipo === 'checkbox' || tipo === 'radio') ? 0 : undefined, // Only checkbox/radio have weights
      orden: targetSection.campos.length,
      opcionesConPeso: (tipo === 'select' || tipo === 'radio' || tipo === 'checkbox') 
        ? [{
          id: `opcion-${Date.now()}`,
          texto: 'Opción 1',
          peso: undefined
        }] 
        : undefined
    };

    setBuilderData(prevData => ({
      ...prevData,
      secciones: prevData.secciones.map(s => 
        s.id === seccionActiva 
          ? { ...s, campos: [...s.campos, nuevoCampo] }
          : s
      )
    }));

    toast({
      title: "Campo agregado",
      description: `Se agregó un campo ${fieldNames[tipo] || 'Campo'}.`
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
    const { destination, source, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'SECTION') {
      // Reorder sections
      const newSecciones = Array.from(builderData.secciones);
      const [reorderedSection] = newSecciones.splice(source.index, 1);
      newSecciones.splice(destination.index, 0, reorderedSection);

      // Update orden for all sections
      const updatedSecciones = newSecciones.map((seccion, index) => ({
        ...seccion,
        orden: index
      }));

      setBuilderData({
        ...builderData,
        secciones: updatedSecciones
      });
    } else if (type === 'FIELD') {
      // Handle field reordering within sections or between sections
      const sourceSeccionId = source.droppableId;
      const destSeccionId = destination.droppableId;

      if (sourceSeccionId === destSeccionId) {
        // Reorder within same section
        const seccion = builderData.secciones.find(s => s.id === sourceSeccionId);
        if (!seccion) return;

        const newCampos = Array.from(seccion.campos);
        const [reorderedField] = newCampos.splice(source.index, 1);
        newCampos.splice(destination.index, 0, reorderedField);

        // Update orden for all fields in this section
        const updatedCampos = newCampos.map((campo, index) => ({
          ...campo,
          orden: index
        }));

        setBuilderData({
          ...builderData,
          secciones: builderData.secciones.map(s =>
            s.id === sourceSeccionId
              ? { ...s, campos: updatedCampos }
              : s
          )
        });
      } else {
        // Move field between sections
        const sourceSeccion = builderData.secciones.find(s => s.id === sourceSeccionId);
        const destSeccion = builderData.secciones.find(s => s.id === destSeccionId);
        
        if (!sourceSeccion || !destSeccion) return;

        const sourceCampos = Array.from(sourceSeccion.campos);
        const destCampos = Array.from(destSeccion.campos);
        const [movedField] = sourceCampos.splice(source.index, 1);
        destCampos.splice(destination.index, 0, movedField);

        // Update orden for both sections
        const updatedSourceCampos = sourceCampos.map((campo, index) => ({
          ...campo,
          orden: index
        }));

        const updatedDestCampos = destCampos.map((campo, index) => ({
          ...campo,
          orden: index
        }));

        setBuilderData({
          ...builderData,
          secciones: builderData.secciones.map(s => {
            if (s.id === sourceSeccionId) {
              return { ...s, campos: updatedSourceCampos };
            } else if (s.id === destSeccionId) {
              return { ...s, campos: updatedDestCampos };
            }
            return s;
          })
        });
      }
    }
  };

  const handleSave = () => {
    if (!builderData.nombre.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre de la plantilla es obligatorio",
        variant: "destructive"
      });
      return;
    }

    // Ensure sections have at least one field (except sections with 0 weight)
    for (const seccion of builderData.secciones) {
      if (seccion.peso > 0 && seccion.campos.length === 0) {
        toast({
          title: "Error de validación",
          description: `La sección "${seccion.nombre}" con peso ${seccion.peso}% debe tener al menos un campo`,
          variant: "destructive"
        });
        return;
      }
    }

    // Check if any section has empty name or undefined weight
    const seccionSinNombre = builderData.secciones.find(s => !s.nombre.trim());
    if (seccionSinNombre) {
      toast({
        title: "Error de validación",
        description: "Todas las secciones deben tener un nombre",
        variant: "destructive"
      });
      return;
    }

    const seccionSinPeso = builderData.secciones.find(s => s.peso === undefined || s.peso === null);
    if (seccionSinPeso) {
      toast({
        title: "Error de validación",
        description: "Todas las secciones deben tener un peso asignado (puede ser 0%)",
        variant: "destructive"
      });
      return;
    }

    // Validate that sections with weight > 0 have at least one field with weight
    for (const seccion of builderData.secciones) {
      if (seccion.peso > 0) {
        const camposConPeso = seccion.campos.filter(campo => 
          (campo.tipo === 'checkbox' || campo.tipo === 'radio') && campo.peso > 0
        );
        
        if (camposConPeso.length === 0) {
          const tieneCheckboxRadio = seccion.campos.some(campo => 
            campo.tipo === 'checkbox' || campo.tipo === 'radio'
          );
          
          if (tieneCheckboxRadio) {
            toast({
              title: "Error de validación",
              description: `La sección "${seccion.nombre}" tiene peso pero sus campos checkbox/radio no tienen peso asignado`,
              variant: "destructive"
            });
            return;
          }
        }
      }
    }

    // Check each section's field weights sum to section weight
    for (const seccion of builderData.secciones) {
      if (seccion.peso > 0) {
        const camposConPeso = seccion.campos.filter(campo => 
          (campo.tipo === 'checkbox' || campo.tipo === 'radio') && campo.peso > 0
        );
        
        const pesoTotalCampos = camposConPeso.reduce((total, campo) => total + (campo.peso || 0), 0);
        
        if (Math.abs(pesoTotalCampos - seccion.peso) > 0.1) { // Allow small floating point differences
          toast({
            title: "Error de validación",
            description: `En la sección "${seccion.nombre}", la suma de pesos de campos (${pesoTotalCampos}%) debe ser igual al peso de la sección (${seccion.peso}%)`,
            variant: "destructive"
          });
          return;
        }
      }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                  <Input
                    value={builderData.nombre}
                    onChange={(e) => setBuilderData({ ...builderData, nombre: e.target.value })}
                    className={`text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 ${
                      !builderData.nombre.trim() ? 'text-destructive' : ''
                    }`}
                    placeholder="Nombre del formulario (requerido)"
                  />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={pesoTotal === 100 ? "default" : "destructive"}>
                Peso: {pesoTotal.toFixed(1)}%
              </Badge>
              {!hasValidWeights && (
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  Pesos incompletos
                </Badge>
              )}
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">{/* Increased max width */}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {/* Form Header */}
            <Card className="border-t-8 border-t-primary">
              <CardHeader className="p-8">
                <div className="space-y-4">
                  <Input
                    value={builderData.nombre}
                    onChange={(e) => setBuilderData({ ...builderData, nombre: e.target.value })}
                    className={`text-3xl font-normal border-none p-0 h-auto focus-visible:ring-0 ${
                      !builderData.nombre.trim() ? 'text-destructive' : ''
                    }`}
                    placeholder="Nombre del formulario (requerido)"
                  />
                </div>
              </CardHeader>
            </Card>

            {/* Sections */}
            <Droppable droppableId="sections" type="SECTION">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {builderData.secciones
                    .sort((a, b) => a.orden - b.orden)
                    .map((seccion, index) => (
                    <Draggable key={seccion.id} draggableId={seccion.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'opacity-75' : ''}
                        >
                          <GoogleFormsSectionV2
                            seccion={seccion}
                            index={index}
                            totalSecciones={builderData.secciones.length}
                            isActive={seccionActiva === seccion.id}
                            showToolbox={showToolbox && seccionActiva === seccion.id}
                            onUpdate={(updates) => handleUpdateSeccion(seccion.id, updates)}
                            onDelete={() => handleDeleteSeccion(seccion.id)}
                            onUpdateCampo={(campoId, updates) => handleUpdateCampo(seccion.id, campoId, updates)}
                            onDeleteCampo={(campoId) => handleDeleteCampo(seccion.id, campoId)}
                            onClick={() => handleSeccionClick(seccion.id)}
                            onAddField={handleAddField}
                            onCloseToolbox={() => setShowToolbox(false)}
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

            {/* Add Section Button */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleAddSeccion}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Sección
              </Button>
            </div>

            {/* Empty State */}
            {builderData.secciones.length === 0 && (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="text-6xl">📝</div>
                  <h3 className="text-lg font-medium">¡Comienza tu formulario!</h3>
                  <p className="text-muted-foreground">
                    Agrega tu primera sección para empezar a crear preguntas.
                  </p>
                  <Button onClick={handleAddSeccion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Sección
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}