
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import RutaEditForm from '@/components/rutas/RutaEditForm';

const EditRuta = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [rutaData, setRutaData] = useState<any>(null);

  // Fetch ruta data
  useEffect(() => {
    const fetchRuta = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // Mock data for demonstration
        setTimeout(() => {
          // Sample mock data for the route being edited
          const mockRuta = {
            id: Number(id),
            pais: 'Costa Rica',
            provincia: 'San José',
            canton: 'San José',
            distrito: 'El Carmen',
            sector: 'Sector Central',
            ramal: 'Ramal 101',
            tipoRuta: 'privada',
            estado: true, // Keeping this in the data model even though we removed the UI element
            paradas: [
              { id: '1', nombre: 'Parada Principal', lat: 9.932, lng: -84.079 },
              { id: '3', nombre: 'Sector A', lat: 9.935, lng: -84.076 },
              { id: '5', nombre: 'Terminal Sur', lat: 9.928, lng: -84.080 }
            ],
            geocercas: [
              {
                id: '1',
                nombre: 'LLANO ARRIBA',
                vertices: [
                  { lat: 9.935, lng: -84.105 },
                  { lat: 9.932, lng: -84.100 },
                  { lat: 9.930, lng: -84.103 }
                ],
                active: true
              },
              {
                id: '3',
                nombre: 'PARQUE LOGÍSTICO NORTE',
                vertices: [
                  { lat: 9.948, lng: -84.098 },
                  { lat: 9.952, lng: -84.102 },
                  { lat: 9.950, lng: -84.105 }
                ],
                active: true
              }
            ]
          };
          
          setRutaData(mockRuta);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        toast.error('Error al cargar la información de la ruta');
        console.error('Error fetching ruta data:', error);
        setIsLoading(false);
        navigate('/rutas');
      }
    };

    if (id) {
      fetchRuta();
    } else {
      navigate('/rutas');
    }
  }, [id, navigate]);

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Editar Ruta</h1>
            <p className="text-gray-500">Modifique la información de la ruta seleccionada</p>
          </div>
          <Link to="/rutas">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Rutas
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Cargando información de la ruta...</p>
          </div>
        ) : (
          rutaData && <RutaEditForm rutaData={rutaData} />
        )}
      </div>
    </Layout>
  );
};

export default EditRuta;
