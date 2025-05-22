
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import GeocercaSelector from '@/components/geocercas/GeocercaSelector';
import GeocercaMap from '@/components/geocercas/GeocercaMap';
import { MapPin, Save, X, Trash2 } from 'lucide-react';

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
    nombre: 'PARQUE LOGÍSTICO NORTE',
    vertices: [
      { lat: 9.948, lng: -84.098 },
      { lat: 9.952, lng: -84.102 },
      { lat: 9.950, lng: -84.105 },
    ],
    active: true
  },
  {
    id: '4',
    nombre: 'SECTOR ADMINISTRATIVO',
    vertices: [
      { lat: 9.938, lng: -84.095 },
      { lat: 9.940, lng: -84.092 },
      { lat: 9.936, lng: -84.090 },
    ],
    active: false
  },
];

const EditarGeocerca = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [selectedGeocerca, setSelectedGeocerca] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [geocercaActual, setGeocercaActual] = useState<Geocerca | null>(null);
  const [originalNombre, setOriginalNombre] = useState('');
  
  // Fetch geocerca data based on ID
  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    
    setTimeout(() => {
      const geocerca = geocercasExistentes.find(g => g.id === id);
      
      if (geocerca) {
        setGeocercaActual(geocerca);
        setNombre(geocerca.nombre);
        setOriginalNombre(geocerca.nombre);
        setVertices([...geocerca.vertices]); // Create a copy of vertices
        setLoading(false);
      } else {
        toast.error('No se encontró la geocerca solicitada');
        navigate('/geocercas');
      }
    }, 500); // Simulate loading delay
  }, [id, navigate]);

  // Filter out current geocerca from the list of existing ones
  const otherGeocercas = geocercasExistentes.filter(g => g.id !== id);

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

  const handleClearVertices = () => {
    if (geocercaActual) {
      setVertices([...geocercaActual.vertices]); // Reset to original vertices
      toast.info('Se han restaurado los vértices originales');
    }
  };

  const handleCancel = () => {
    navigate('/geocercas');
  };

  const handleUpdate = () => {
    // Validate form
    if (!nombre.trim()) {
      toast.error('El nombre de la geocerca es obligatorio');
      return;
    }

    if (vertices.length < 3) {
      toast.error('La geocerca debe tener al menos 3 vértices');
      return;
    }

    // Check for duplicate name, but exclude current geocerca
    if (nombre !== originalNombre && 
        otherGeocercas.some(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
      toast.error('Ya existe una geocerca con este nombre en esta zona franca');
      return;
    }

    // In a real app, you would send this data to your backend API
    console.log('Actualizando geocerca:', {
      id,
      nombre,
      vertices
    });

    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario actualizó geocerca', id);

    toast.success('Geocerca actualizada correctamente');
    
    // Navigate back to the index page after successful update
    navigate('/geocercas');
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Editar Geocerca</h1>
              <p className="text-gray-500">Cargando información...</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Editar Geocerca</h1>
            <p className="text-gray-500">Modifique los límites de la geocerca en el mapa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="required-field">Nombre</Label>
                <Input 
                  id="nombre" 
                  value={nombre} 
                  onChange={handleNombreChange} 
                  placeholder="Ingrese el nombre de la geocerca"
                  maxLength={100} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Geocercas cercanas</Label>
                <GeocercaSelector 
                  geocercas={otherGeocercas}
                  selectedGeocercaId={selectedGeocerca}
                  onSelect={handleGeocercaSelect}
                />
              </div>

              {/* Removed vertices section */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Dibujar en el mapa</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleToggleDrawing} 
                    className={isDrawing ? "bg-green-100" : ""}
                  >
                    {isDrawing ? "Activado" : "Desactivado"}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearVertices}
                  className="w-full"
                >
                  Restaurar vértices originales
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleClearVertices}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Restaurar
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>
                    <Save className="mr-2 h-4 w-4" />
                    Actualizar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow p-2 h-[600px]">
              <GeocercaMap 
                vertices={vertices}
                onVerticesChange={handleVerticesChange}
                isDrawingEnabled={isDrawing}
                existingGeocercas={otherGeocercas}
                selectedGeocercaId={selectedGeocerca}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarGeocerca;
