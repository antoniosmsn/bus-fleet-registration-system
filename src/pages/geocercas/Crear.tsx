
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GeocercaSelector from '@/components/geocercas/GeocercaSelector';
import GeocercaMap from '@/components/geocercas/GeocercaMap';
import { MapPin, Save, X, Trash2, RotateCcw } from 'lucide-react';

interface Vertex {
  lat: number;
  lng: number;
}

interface Geocerca {
  id: string;
  nombre: string;
  vertices: Vertex[];
  active: boolean;
}

// Mock data - in real app, this would come from an API
const geocercasExistentes: Geocerca[] = [
  {
    id: '1',
    nombre: 'LLANO ARRIBA',
    vertices: [
      { lat: 9.935, lng: -84.105 },
      { lat: 9.932, lng: -84.100 },
      { lat: 9.930, lng: -84.103 },
    ],
    active: true
  },
  {
    id: '2',
    nombre: 'LLANO DE CONE',
    vertices: [
      { lat: 9.940, lng: -84.110 },
      { lat: 9.943, lng: -84.115 },
      { lat: 9.945, lng: -84.112 },
      { lat: 9.942, lng: -84.108 },
    ],
    active: true
  },
];

const CrearGeocerca = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [selectedGeocerca, setSelectedGeocerca] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleVerticesChange = (newVertices: Vertex[]) => {
    setVertices(newVertices);
  };

  const handleGeocercaSelect = (geocercaId: string | null) => {
    setSelectedGeocerca(geocercaId);
  };

  const handleToggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const handleLimpiarGeocerca = () => {
    setVertices([]);
    toast.info('Puntos de geocerca eliminados');
  };

  const handleLimpiarFormulario = () => {
    setNombre('');
    setVertices([]);
    setSelectedGeocerca(null);
    setIsDrawing(true);
    toast.info('Formulario reiniciado');
  };

  const handleCancelar = () => {
    navigate('/geocercas');
  };

  const handleGuardar = () => {
    // Validate form
    if (!nombre.trim()) {
      toast.error('El nombre de la geocerca es obligatorio');
      return;
    }

    if (vertices.length < 3) {
      toast.error('La geocerca debe tener al menos 3 vértices para formar un polígono válido');
      return;
    }

    // Check for duplicate name
    if (geocercasExistentes.some(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
      toast.error('El nombre de la geocerca ya está registrado');
      return;
    }

    // In a real app, you would send this data to your backend API
    console.log('Registrando geocerca:', {
      nombre,
      vertices,
      usuario: 'Usuario actual', // This would come from auth context
      fechaHora: new Date().toISOString()
    });

    toast.success('Geocerca registrada exitosamente');
    
    // Navigate back to the index page after successful registration
    navigate('/geocercas');
  };

  // Check if save button should be enabled
  const isSaveEnabled = nombre.trim().length > 0 && vertices.length >= 3;

  return (
    <Layout>
      <div className="w-full max-w-full mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registro de nuevas geocercas</h1>
          <p className="text-gray-600 mt-1">Complete el formulario para registrar una nueva geocerca.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section - 75% width */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mapa Interactivo</CardTitle>
                <p className="text-sm text-gray-600">
                  Haga clic en el mapa para definir los vértices del polígono
                </p>
              </CardHeader>
              <CardContent className="p-2 h-[calc(100%-80px)]">
                <div className="h-full rounded-lg overflow-hidden">
                  <GeocercaMap 
                    vertices={vertices}
                    onVerticesChange={handleVerticesChange}
                    isDrawingEnabled={isDrawing}
                    existingGeocercas={geocercasExistentes}
                    selectedGeocercaId={selectedGeocerca}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Form Section - 25% width */}
          <div className="lg:col-span-1">
            <div className="h-full flex flex-col space-y-4">
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Información de la Geocerca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Nombre de la geocerca
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="nombre" 
                      value={nombre} 
                      onChange={handleNombreChange} 
                      placeholder="Ingrese el nombre de la geocerca"
                      maxLength={100} 
                      required
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Máximo 100 caracteres. Debe ser único en el sistema.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Geocercas cercanas de referencia
                    </Label>
                    <GeocercaSelector 
                      geocercas={geocercasExistentes}
                      selectedGeocercaId={selectedGeocerca}
                      onSelect={handleGeocercaSelect}
                    />
                    <p className="text-xs text-gray-500">
                      Seleccione una geocerca existente para usarla como referencia visual.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Herramientas de dibujo
                    </Label>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant={isDrawing ? "default" : "outline"} 
                        size="sm"
                        onClick={handleToggleDrawing} 
                        className="w-full"
                      >
                        {isDrawing ? "Dibujo Activado" : "Activar Dibujo"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLimpiarGeocerca}
                        className="w-full"
                        disabled={vertices.length === 0}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Limpiar geocerca
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Haga clic en el mapa para agregar puntos. Se necesitan al menos 3 puntos.
                    </p>
                  </div>

                  {vertices.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Puntos seleccionados: {vertices.length}
                      </Label>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {vertices.length < 3 
                          ? `Faltan ${3 - vertices.length} puntos para formar un polígono válido`
                          : "Polígono válido formado"
                        }
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleLimpiarFormulario}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpiar
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleCancelar}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleGuardar}
                      disabled={!isSaveEnabled}
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </div>
                  {!isSaveEnabled && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Complete el nombre y seleccione al menos 3 puntos para habilitar el guardado
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearGeocerca;
