
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Ruta {
  id: string;
  nombre: string;
  ramal: string;
  empresaTransporte: string;
  tipoRuta: string;
  provincia: string;
  canton: string;
}

// Mock data para las rutas disponibles
const rutasDisponibles: Ruta[] = [
  { id: '1', nombre: 'Ruta San José - Cartago', ramal: 'Ramal 101', empresaTransporte: 'Transportes Unidos', tipoRuta: 'Privada', provincia: 'San José', canton: 'San José' },
  { id: '2', nombre: 'Ruta Alajuela - Heredia', ramal: 'Ramal 102', empresaTransporte: 'Buses del Norte', tipoRuta: 'Parque', provincia: 'Alajuela', canton: 'Alajuela' },
  { id: '3', nombre: 'Ruta Puntarenas - Liberia', ramal: 'Ramal 103', empresaTransporte: 'Costa Verde', tipoRuta: 'Especial', provincia: 'Puntarenas', canton: 'Puntarenas' },
  { id: '4', nombre: 'Ruta Limón - Guápiles', ramal: 'Ramal 104', empresaTransporte: 'Caribeños SA', tipoRuta: 'Privada', provincia: 'Limón', canton: 'Limón' },
  { id: '5', nombre: 'Ruta Escazú - Santa Ana', ramal: 'Ramal 105', empresaTransporte: 'Oeste Express', tipoRuta: 'Parque', provincia: 'San José', canton: 'Escazú' },
  { id: '6', nombre: 'Ruta Cartago Centro', ramal: 'Ramal 106', empresaTransporte: 'Transportes Unidos', tipoRuta: 'Privada', provincia: 'Cartago', canton: 'Cartago' },
  { id: '7', nombre: 'Ruta Heredia - Barva', ramal: 'Ramal 107', empresaTransporte: 'Buses del Norte', tipoRuta: 'Parque', provincia: 'Heredia', canton: 'Heredia' },
  { id: '8', nombre: 'Ruta Guanacaste Express', ramal: 'Ramal 108', empresaTransporte: 'Costa Verde', tipoRuta: 'Especial', provincia: 'Guanacaste', canton: 'Liberia' },
];

interface AsignacionRutasProps {
  rutasAsignadas: string[];
  onChange: (rutas: string[]) => void;
}

const AsignacionRutas: React.FC<AsignacionRutasProps> = ({ rutasAsignadas, onChange }) => {
  const [filtros, setFiltros] = useState({
    provincia: '',
    canton: '',
    ramal: ''
  });

  // Obtener opciones únicas para los filtros
  const provincias = useMemo(() => {
    const uniqueProvincias = [...new Set(rutasDisponibles.map(ruta => ruta.provincia))];
    return uniqueProvincias.sort();
  }, []);

  const cantones = useMemo(() => {
    if (!filtros.provincia) return [];
    const uniqueCantones = [...new Set(
      rutasDisponibles
        .filter(ruta => ruta.provincia === filtros.provincia)
        .map(ruta => ruta.canton)
    )];
    return uniqueCantones.sort();
  }, [filtros.provincia]);

  const ramales = useMemo(() => {
    const uniqueRamales = [...new Set(rutasDisponibles.map(ruta => ruta.ramal))];
    return uniqueRamales.sort();
  }, []);

  // Filtrar rutas según los filtros aplicados
  const rutasFiltradas = useMemo(() => {
    return rutasDisponibles.filter(ruta => {
      const cumpleProvincia = !filtros.provincia || ruta.provincia === filtros.provincia;
      const cumpleCanton = !filtros.canton || ruta.canton === filtros.canton;
      const cumpleRamal = !filtros.ramal || ruta.ramal === filtros.ramal;
      
      return cumpleProvincia && cumpleCanton && cumpleRamal;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      // Limpiar cantón si cambia la provincia
      ...(campo === 'provincia' && { canton: '' })
    }));
  };

  const handleRutaToggle = (rutaId: string, checked: boolean) => {
    if (checked) {
      onChange([...rutasAsignadas, rutaId]);
    } else {
      onChange(rutasAsignadas.filter(id => id !== rutaId));
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      provincia: '',
      canton: '',
      ramal: ''
    });
  };

  const rutasAsignadasData = rutasDisponibles.filter(ruta => rutasAsignadas.includes(ruta.id));

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="provincia">Provincia</Label>
              <Select
                value={filtros.provincia}
                onValueChange={(valor) => handleFiltroChange('provincia', valor)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las provincias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las provincias</SelectItem>
                  {provincias.map(provincia => (
                    <SelectItem key={provincia} value={provincia}>{provincia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="canton">Cantón</Label>
              <Select
                value={filtros.canton}
                onValueChange={(valor) => handleFiltroChange('canton', valor)}
                disabled={!filtros.provincia}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los cantones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los cantones</SelectItem>
                  {cantones.map(canton => (
                    <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ramal">Ramal</Label>
              <Select
                value={filtros.ramal}
                onValueChange={(valor) => handleFiltroChange('ramal', valor)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los ramales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los ramales</SelectItem>
                  {ramales.map(ramal => (
                    <SelectItem key={ramal} value={ramal}>{ramal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={limpiarFiltros}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de rutas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rutas Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Rutas Disponibles ({rutasFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rutasFiltradas.length > 0 ? (
                rutasFiltradas.map(ruta => (
                  <div
                    key={ruta.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`ruta-${ruta.id}`}
                      checked={rutasAsignadas.includes(ruta.id)}
                      onCheckedChange={(checked) => handleRutaToggle(ruta.id, checked as boolean)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`ruta-${ruta.id}`}
                        className="block font-medium text-sm cursor-pointer"
                      >
                        {ruta.nombre}
                      </label>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>{ruta.ramal} • {ruta.empresaTransporte}</div>
                        <div>{ruta.provincia}, {ruta.canton} • {ruta.tipoRuta}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron rutas con los filtros aplicados
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rutas Asignadas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Rutas Asignadas ({rutasAsignadas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rutasAsignadasData.length > 0 ? (
                rutasAsignadasData.map(ruta => (
                  <div
                    key={ruta.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200"
                  >
                    <Checkbox
                      id={`asignada-${ruta.id}`}
                      checked={true}
                      onCheckedChange={() => handleRutaToggle(ruta.id, false)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`asignada-${ruta.id}`}
                        className="block font-medium text-sm cursor-pointer"
                      >
                        {ruta.nombre}
                      </label>
                      <div className="text-xs text-gray-600 mt-1">
                        <div>{ruta.ramal} • {ruta.empresaTransporte}</div>
                        <div>{ruta.provincia}, {ruta.canton} • {ruta.tipoRuta}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay rutas asignadas
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AsignacionRutas;
