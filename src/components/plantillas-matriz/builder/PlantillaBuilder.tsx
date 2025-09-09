import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Save, ArrowLeft, Eye } from 'lucide-react';
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

  // Estado para sección activa
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);

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

    // Activar la nueva sección automáticamente
    setSeccionActiva(nuevaSeccion.id);
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

  const handleAddField = (tipo: string, seccionId?: string) => {
    // Usar la sección especificada, la activa, o la primera disponible
    let targetSeccionId = seccionId || seccionActiva;
    
    if (!targetSeccionId && builderData.secciones.length > 0) {
      targetSeccionId = builderData.secciones[0].id;
      setSeccionActiva(targetSeccionId);
    }
    
    const targetSection = builderData.secciones.find(s => s.id === targetSeccionId);
    if (!targetSection) {
      toast({
        title: "Error",
        description: "Debe crear al menos una sección primero",
        variant: "destructive"
      });
      return;
    }

    const fieldNames: Record<string, string> = {
      texto: 'Texto',
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
      orden: targetSection.campos.length,
      opciones: (tipo === 'select' || tipo === 'radio' || tipo === 'checkbox') 
        ? ['Opción 1', 'Opción 2'] 
        : undefined
    };

    setBuilderData(prevData => ({
      ...prevData,
      secciones: prevData.secciones.map(s => 
        s.id === targetSeccionId 
          ? { ...s, campos: [...s.campos, nuevoCampo] }
          : s
      )
    }));

    toast({
      title: "Campo agregado",
      description: `Se agregó un campo ${fieldNames[tipo] || 'Campo'} a ${targetSection.nombre}.`
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

    const { source, destination, type, draggableId } = result;

    console.log('Drag end:', { source, destination, type, draggableId });

    // Manejar drag desde toolbox hacia sección
    if (source.droppableId === 'toolbox' && destination.droppableId.includes('seccion-')) {
      const tipoElemento = draggableId.replace('toolbox-', '');
      const seccionDestino = destination.droppableId.replace('seccion-', '');
      
      console.log('Drag from toolbox to section:', { tipoElemento, seccionDestino });
      
      const fieldNames: Record<string, string> = {
        texto: 'Texto',
        select: 'Lista desplegable', 
        radio: 'Opción múltiple',
        checkbox: 'Casillas de verificación',
        fecha: 'Fecha',
        canvas: 'Dibujo'
      };

      // Crear campo en la posición específica donde se soltó
      const nuevoCampo: CampoBuilder = {
        id: `campo-${Date.now()}`,
        tipo: tipoElemento as any,
        etiqueta: 'Pregunta sin título',
        requerido: false,
        peso: 5,
        orden: destination.index,
        opciones: (tipoElemento === 'select' || tipoElemento === 'radio' || tipoElemento === 'checkbox') 
          ? ['Opción 1', 'Opción 2'] 
          : undefined
      };

      // Insertar el campo en la posición correcta
      setBuilderData(prevData => ({
        ...prevData,
        secciones: prevData.secciones.map(s => {
          if (s.id === seccionDestino) {
            const nuevosCampos = [...s.campos];
            nuevosCampos.splice(destination.index, 0, nuevoCampo);
            // Reordenar los campos
            return {
              ...s, 
              campos: nuevosCampos.map((campo, index) => ({
                ...campo,
                orden: index
              }))
            };
          }
          return s;
        })
      }));

      toast({
        title: "Campo agregado",
        description: `Se agregó un campo ${fieldNames[tipoElemento] || 'Campo'}. Recuerda configurar su peso.`
      });
      return;
    }

    // Reordenar campos dentro de una sección o entre secciones
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
      } else {
        // Mover campo entre secciones diferentes
        const sourceSeccion = builderData.secciones.find(s => s.id === sourceSeccionId);
        const destSeccion = builderData.secciones.find(s => s.id === destSeccionId);
        
        if (!sourceSeccion || !destSeccion) return;

        const [movedCampo] = sourceSeccion.campos.splice(source.index, 1);
        destSeccion.campos.splice(destination.index, 0, movedCampo);

        setBuilderData({
          ...builderData,
          secciones: builderData.secciones.map(s => {
            if (s.id === sourceSeccionId) {
              return {
                ...s,
                campos: s.campos.map((campo, index) => ({ ...campo, orden: index }))
              };
            }
            if (s.id === destSeccionId) {
              return {
                ...s,
                campos: s.campos.map((campo, index) => ({ ...campo, orden: index }))
              };
            }
            return s;
          })
        });
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

  const handlePreview = () => {
    // Crear el HTML para la vista previa
    const previewHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vista Previa - ${builderData.nombre || 'Plantilla'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; }
        </style>
      </head>
      <body class="bg-gray-50 min-h-screen p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm border-t-8 border-blue-600 p-8">
            <h1 class="text-3xl font-normal text-gray-900 mb-4">
              ${builderData.nombre || 'Formulario sin título'}
            </h1>
            ${builderData.descripcion ? `<p class="text-base text-gray-600">${builderData.descripcion}</p>` : ''}
          </div>

          <!-- Secciones -->
          ${builderData.secciones.map(seccion => `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-blue-600">${seccion.nombre}</h2>
              </div>
              <div class="p-6 space-y-6">
                ${seccion.campos
                  .sort((a, b) => a.orden - b.orden)
                  .map(campo => {
                    const required = campo.requerido ? '<span class="text-red-500">*</span>' : '';
                    
                    switch (campo.tipo) {
                      case 'texto':
                        return `
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribe tu respuesta">
                          </div>
                        `;
                      case 'select':
                        return `
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>Selecciona una opción</option>
                              ${campo.opciones?.map(opcion => `<option value="${opcion}">${opcion}</option>`).join('') || ''}
                            </select>
                          </div>
                        `;
                      case 'radio':
                        return `
                          <div class="space-y-3">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <div class="space-y-2">
                              ${campo.opciones?.map((opcion, index) => `
                                <div class="flex items-center">
                                  <input type="radio" name="${campo.id}" value="${opcion}" class="mr-2">
                                  <label class="text-sm text-gray-700">${opcion}</label>
                                </div>
                              `).join('') || ''}
                            </div>
                          </div>
                        `;
                      case 'checkbox':
                        return `
                          <div class="space-y-3">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <div class="space-y-2">
                              ${campo.opciones?.map((opcion, index) => `
                                <div class="flex items-center">
                                  <input type="checkbox" value="${opcion}" class="mr-2">
                                  <label class="text-sm text-gray-700">${opcion}</label>
                                </div>
                              `).join('') || ''}
                            </div>
                          </div>
                        `;
                      case 'fecha':
                        return `
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          </div>
                        `;
                      case 'canvas':
                        return `
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                              ${campo.etiqueta} ${required}
                            </label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                              <div class="text-gray-500">
                                <div class="text-4xl mb-2">✏️</div>
                                <p>Área de dibujo</p>
                              </div>
                            </div>
                          </div>
                        `;
                      default:
                        return '';
                    }
                  }).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Footer -->
          <div class="text-center py-8">
            <p class="text-sm text-gray-500">
              Vista previa de la plantilla - Los datos no se guardan
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Abrir en nueva ventana
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(previewHTML);
      newWindow.document.close();
    }
  };


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-muted/20">
        {/* Google Forms Style Toolbox */}
        <GoogleFormsToolbox 
          onAddField={handleAddField}
          seccionActiva={seccionActiva}
          secciones={builderData.secciones}
        />

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
                                onAddField={(tipo) => handleAddField(tipo, seccion.id)}
                                esActiva={seccionActiva === seccion.id}
                                onSeleccionar={() => setSeccionActiva(seccion.id)}
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