import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  {
    id: '3',
    nombre: 'ZONA INDUSTRIAL',
    vertices: [
      { lat: 9.950, lng: -84.120 },
      { lat: 9.955, lng: -84.125 },
      { lat: 9.952, lng: -84.130 },
      { lat: 9.948, lng: -84.122 },
    ],
    active: true
  },
];

const EditarGeocerca = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [selectedGeocercaIds, setSelectedGeocercaIds] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [originalGeocerca, setOriginalGeocerca] = useState<Geocerca | null>(null);
  
  // Mock data load - in real app, this would come from an API
  useEffect(() => {
    if (id) {
      const geocerca = geocercasExistentes.find(g => g.id === id);
      if (geocerca) {
        setOriginalGeocerca(geocerca);
        setNombre(geocerca.nombre);
        setVertices([...geocerca.vertices]);
      } else {
        toast.error('Geocerca no encontrada');
        navigate('/geocercas');
      }
    }
  }, [id, navigate]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleVerticesChange = (newVertices: Vertex[]) => {
    setVertices(newVertices);
  };

  const handleGeocercaSelect = (geocercaIds: string[]) => {
    setSelectedGeocercaIds(geocercaIds);
  };

  const handleToggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const handleLimpiarGeocerca = () => {
    setVertices([]);
    toast.info('Puntos de geocerca eliminados');
  };

  const handleRestaurarVertices = () => {
    if (originalGeocerca) {
      setVertices([...originalGeocerca.vertices]);
      toast.info('Vértices originales restaurados');
    }
  };

  const handleLimpiarFormulario = () => {
    if (originalGeocerca) {
      setNombre(originalGeocerca.nombre);
      setVertices([...originalGeocerca.vertices]);
      setSelectedGeocercaIds([]);
      setIsDrawing(false);
      toast.info('Formulario reiniciado');
    }
  };

  const handleCancelar = () => {
    navigate('/geocercas');
  };

  const handleGuardarCambios = () => {
    // Validate form
    if (!nombre.trim()) {
      toast.error('El nombre de la geocerca es obligatorio');
      return;
    }

    if (vertices.length < 3) {
      toast.error('La geocerca debe tener al menos 3 vértices para formar un polígono válido');
      return;
    }

    // Check for duplicate name (excluding current geocerca)
    if (geocercasExistentes.some(g => g.id !== id && g.nombre.toLowerCase() === nombre.toLowerCase())) {
      toast.error('El nombre de la geocerca ya está registrado');
      return;
    }

    // In a real app, you would send this data to your backend API
    console.log('Actualizando geocerca:', {
      id,
      nombreAnterior: originalGeocerca?.nombre,
      nombreNuevo: nombre,
      vertices,
      usuario: 'Usuario actual', // This would come from auth context
      fechaHora: new Date().toISOString()
    });

    // Mock audit log entry
    console.log('Bitácora de auditoría:', {
      accion: 'Edición de geocerca',
      geocercaId: id,
      nombreAnterior: originalGeocerca?.nombre,
      nombreNuevo: nombre,
      usuario: 'Usuario actual',
      fechaHora: new Date().toISOString(),
      cambiosRealizados: {
        nombre: originalGeocerca?.nombre !== nombre,
        vertices: JSON.stringify(originalGeocerca?.vertices) !== JSON.stringify(vertices)
      }
    });

    toast.success('Geocerca actualizada exitosamente');
    
    // Navigate back to the index page after successful update
    navigate('/geocercas');
  };

  // Check if save button should be enabled
  const isSaveEnabled = nombre.trim().length > 0 && vertices.length >= 3;

  if (!originalGeocerca) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Cargando geocerca...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-full mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar geocerca: {originalGeocerca.nombre}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section - 60% width */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Mapa
                    </Button>
                    <Button 
                      variant={isDrawing ? "default" : "outline"} 
                      size="sm"
                      onClick={handleToggleDrawing} 
                    >
                      Activar Dibujo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLimpiarGeocerca}
                      disabled={vertices.length === 0}
                    >
                      Limpiar geocerca
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 h-[calc(100%-80px)]">
                <div className="h-full rounded-lg overflow-hidden">
                  <GeocercaMap 
                    vertices={vertices}
                    onVerticesChange={handleVerticesChange}
                    isDrawingEnabled={isDrawing}
                    existingGeocercas={geocercasExistentes.filter(g => g.id !== id)}
                    selectedGeocercaIds={selectedGeocercaIds}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Form Section - 40% width */}
          <div className="lg:col-span-2">
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
                      Máximo 100 caracteres. Debe ser único por zona franca.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Geocercas cercanas de referencia
                    </Label>
                    <GeocercaSelector 
                      geocercas={geocercasExistentes.filter(g => g.id !== id)}
                      selectedGeocercaIds={selectedGeocercaIds}
                      onSelect={handleGeocercaSelect}
                    />
                  </div>
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
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurar Original
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
                      onClick={handleGuardarCambios}
                      disabled={!isSaveEnabled}
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarGeocerca;
