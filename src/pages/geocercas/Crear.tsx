
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleClearVertices = () => {
    setVertices([]);
  };

  const handleClearForm = () => {
    setNombre('');
    setVertices([]);
    setSelectedGeocerca(null);
    setIsDrawing(true);
  };

  const handleRegister = () => {
    // Validate form
    if (!nombre.trim()) {
      toast.error('El nombre de la geocerca es obligatorio');
      return;
    }

    if (vertices.length < 3) {
      toast.error('La geocerca debe tener al menos 3 vértices');
      return;
    }

    // Check for duplicate name
    if (geocercasExistentes.some(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
      toast.error('Ya existe una geocerca con este nombre en esta zona franca');
      return;
    }

    // In a real app, you would send this data to your backend API
    console.log('Registrando geocerca:', {
      nombre,
      vertices
    });

    toast.success('Geocerca registrada correctamente');
    
    // Navigate back to the index page after successful registration
    // In a real app, you might want to wait for the API response before navigating
    navigate('/geocercas');
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Crear Geocerca</h1>
            <p className="text-gray-500">Defina los límites de la geocerca en el mapa</p>
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
                  geocercas={geocercasExistentes}
                  selectedGeocercaId={selectedGeocerca}
                  onSelect={handleGeocercaSelect}
                />
              </div>

              <div className="space-y-2">
                <Label>Vértices ({vertices.length})</Label>
                <div className="text-sm rounded-md bg-gray-50 p-2 max-h-48 overflow-y-auto">
                  {vertices.length === 0 ? (
                    <p className="text-gray-500 text-center p-2">No hay vértices definidos</p>
                  ) : (
                    <ul className="space-y-1">
                      {vertices.map((vertex, index) => (
                        <li key={index} className="text-xs font-mono">
                          Punto {index + 1}: {vertex.lat.toFixed(6)}, {vertex.lng.toFixed(6)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

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
                  Limpiar vértices
                </Button>
              </div>

              <div className="pt-4 border-t flex justify-between space-x-2">
                <Button variant="outline" onClick={handleClearForm}>
                  Limpiar
                </Button>
                <div className="space-x-2">
                  <Link to="/geocercas">
                    <Button variant="secondary">
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </Link>
                  <Button onClick={handleRegister}>
                    <Save className="mr-2 h-4 w-4" />
                    Registrar
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
                existingGeocercas={geocercasExistentes}
                selectedGeocercaId={selectedGeocerca}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearGeocerca;
