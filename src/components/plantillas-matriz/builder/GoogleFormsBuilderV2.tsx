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
    nombre: plantilla?.nombre || 'Formulario sin título',
    descripcion: plantilla?.descripcion || '',
    secciones: plantilla?.secciones || []
  });

  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const [showToolbox, setShowToolbox] = useState(false);

  // Calcular peso total
  const pesoTotal = builderData.secciones.reduce((total, seccion) => total + seccion.peso, 0);

  const handleAddSeccion = () => {
    const nuevaSeccion: SeccionBuilder = {
      id: `seccion-${Date.now()}`,
      nombre: `Sección ${builderData.secciones.length + 1}`,
      peso: 20,
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
      peso: 5,
      orden: targetSection.campos.length,
      opciones: (tipo === 'select' || tipo === 'radio' || tipo === 'checkbox') 
        ? ['Opción 1'] 
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

  const handleSave = () => {
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
                  className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="Formulario sin título"
                />
                <Input
                  value={builderData.descripcion}
                  onChange={(e) => setBuilderData({ ...builderData, descripcion: e.target.value })}
                  className="text-sm text-muted-foreground border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="Descripción del formulario"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Peso: {pesoTotal}%
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={loading}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
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

        <DragDropContext onDragEnd={() => {}}>
          <div className="space-y-6">
            {/* Form Header */}
            <Card className="border-t-8 border-t-primary">
              <CardHeader className="p-8">
                <div className="space-y-4">
                  <Input
                    value={builderData.nombre}
                    onChange={(e) => setBuilderData({ ...builderData, nombre: e.target.value })}
                    className="text-3xl font-normal border-none p-0 h-auto focus-visible:ring-0"
                    placeholder="Formulario sin título"
                  />
                  <Input
                    value={builderData.descripcion}
                    onChange={(e) => setBuilderData({ ...builderData, descripcion: e.target.value })}
                    className="text-base text-muted-foreground border-none p-0 h-auto focus-visible:ring-0"
                    placeholder="Descripción del formulario"
                  />
                </div>
              </CardHeader>
            </Card>

            {/* Sections */}
            {builderData.secciones.map((seccion, index) => (
              <GoogleFormsSectionV2
                key={seccion.id}
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
              />
            ))}

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