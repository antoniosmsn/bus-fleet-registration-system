
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ParadasMap from '@/components/paradas/ParadasMap';
import { ChevronLeft, MapPin, Save } from 'lucide-react';

interface Parada {
  id?: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  lat: number;
  lng: number;
  active: boolean;
}

interface Location {
  lat: number;
  lng: number;
}

// Mock data para paradas existentes - en una app real, esto vendría de una API
const paradasExistentes: Parada[] = [
  {
    id: '1',
    codigo: 'PARA-001',
    nombre: 'Terminal Central',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'El Carmen',
    sector: 'Centro',
    lat: 9.932,
    lng: -84.079,
    active: true
  },
  {
    id: '2',
    codigo: 'PARA-002',
    nombre: 'Parada Norte',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Uruca',
    sector: 'Industrial',
    lat: 9.945,
    lng: -84.085,
    active: true
  }
];

// Datos de catálogos - en una app real, esto vendría de una API
const paises = ['Costa Rica'];
const provincias = {
  'Costa Rica': ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón']
};
const cantones = {
  'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora']
};
const distritos = {
  'San José': ['El Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco de Dos Ríos']
};
const sectores = {
  'El Carmen': ['Centro', 'Norte', 'Este', 'Oeste', 'Sur']
};

// Distancia mínima entre paradas en metros
const DISTANCIA_MINIMA = 25;

const RegisterParada = () => {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('Costa Rica');
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');
  const [sector, setSector] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [active, setActive] = useState(true);
  
  // Resetear selecciones dependientes cuando cambia un valor superior
  useEffect(() => {
    setProvincia('');
    setCanton('');
    setDistrito('');
    setSector('');
  }, [pais]);

  useEffect(() => {
    setCanton('');
    setDistrito('');
    setSector('');
  }, [provincia]);

  useEffect(() => {
    setDistrito('');
    setSector('');
  }, [canton]);

  useEffect(() => {
    setSector('');
  }, [distrito]);

  const handleLocationChange = (newLocation: Location | null) => {
    setLocation(newLocation);
  };

  // Validar distancia mínima entre paradas
  const validarDistanciaMinima = (lat: number, lng: number): boolean => {
    for (const parada of paradasExistentes) {
      // Calcular distancia en línea recta (fórmula de Haversine)
      const R = 6371e3; // Radio de la Tierra en metros
      const φ1 = (parada.lat * Math.PI) / 180;
      const φ2 = (lat * Math.PI) / 180;
      const Δφ = ((lat - parada.lat) * Math.PI) / 180;
      const Δλ = ((lng - parada.lng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance < DISTANCIA_MINIMA) {
        return false;
      }
    }
    return true;
  };

  const handleRegister = () => {
    // Validar formulario
    if (!codigo.trim()) {
      toast.error('El código de parada es obligatorio');
      return;
    }

    if (!nombre.trim()) {
      toast.error('El nombre de la parada es obligatorio');
      return;
    }

    if (!location) {
      toast.error('Debe seleccionar la ubicación de la parada en el mapa');
      return;
    }

    if (!provincia || !canton || !distrito) {
      toast.error('Debe completar la información geográfica (provincia, cantón, distrito)');
      return;
    }

    // Validar código único
    if (paradasExistentes.some(p => p.codigo.toLowerCase() === codigo.toLowerCase())) {
      toast.error('Ya existe una parada con este código');
      return;
    }

    // Validar distancia mínima
    if (!validarDistanciaMinima(location.lat, location.lng)) {
      toast.error(`La parada debe estar al menos a ${DISTANCIA_MINIMA} metros de otras paradas existentes`);
      return;
    }

    // En una app real, enviaríamos estos datos a la API
    console.log('Registrando parada:', {
      codigo,
      nombre,
      pais,
      provincia,
      canton,
      distrito,
      sector,
      lat: location.lat,
      lng: location.lng,
      active
    });

    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario registró una nueva parada:', codigo);

    toast.success('Punto de parada registrado correctamente');
    
    // Navegar de vuelta a la página de índice después del registro exitoso
    navigate('/paradas');
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Registrar Punto de Parada</h1>
            <p className="text-gray-500">Defina la ubicación del punto de parada en el mapa</p>
          </div>
          <Link to="/paradas">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Paradas
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="required-field">Código de parada</Label>
                <Input 
                  id="codigo" 
                  value={codigo} 
                  onChange={(e) => setCodigo(e.target.value)} 
                  placeholder="Ingrese el código único"
                  maxLength={20} 
                  required
                />
                <p className="text-xs text-gray-500">Alfanumérico, hasta 20 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre" className="required-field">Nombre</Label>
                <Input 
                  id="nombre" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Ingrese el nombre de la parada"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pais" className="required-field">País</Label>
                  <Select value={pais} onValueChange={setPais}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un país" />
                    </SelectTrigger>
                    <SelectContent>
                      {paises.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia" className="required-field">Provincia</Label>
                  <Select value={provincia} onValueChange={setProvincia} disabled={!pais}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {pais && provincias[pais]?.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canton" className="required-field">Cantón</Label>
                  <Select value={canton} onValueChange={setCanton} disabled={!provincia}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      {provincia && cantones[provincia]?.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distrito" className="required-field">Distrito</Label>
                  <Select value={distrito} onValueChange={setDistrito} disabled={!canton}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {canton && distritos[canton]?.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select value={sector} onValueChange={setSector} disabled={!distrito}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un sector (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {distrito && sectores[distrito]?.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ubicación (lat, lng)</Label>
                <div className="text-sm font-mono bg-gray-50 p-2 rounded-md">
                  {location ? (
                    <p>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                  ) : (
                    <p className="text-gray-500">Seleccione ubicación en el mapa</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Haga clic en el mapa para seleccionar la ubicación
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={active} 
                  onCheckedChange={setActive}
                />
                <Label htmlFor="active">Parada activa</Label>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Link to="/paradas">
                    <Button variant="secondary">
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
              <ParadasMap 
                paradas={paradasExistentes.map(p => ({
                  ...p,
                  estado: p.active ? 'Activo' : 'Inactivo'
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterParada;
