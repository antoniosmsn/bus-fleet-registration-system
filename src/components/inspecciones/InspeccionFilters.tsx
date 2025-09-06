import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { InspeccionFilter } from '@/types/inspeccion-autobus';
import { Transportista } from '@/data/mockTransportistas';

interface InspeccionFiltersProps {
  filtros: InspeccionFilter;
  onFiltrosChange: (filtros: InspeccionFilter) => void;
  onBuscar: () => void;
  transportistas: Transportista[];
  loading?: boolean;
}

export function InspeccionFilters({
  filtros,
  onFiltrosChange,
  onBuscar,
  transportistas,
  loading = false
}: InspeccionFiltersProps) {
  const [activeTab, setActiveTab] = useState("general");

  // Establecer valores por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!filtros.fechaInicio && !filtros.fechaFin) {
      onFiltrosChange({
        ...filtros,
        fechaInicio: today,
        fechaFin: today,
        horaInicio: '00:00',
        horaFin: '23:59'
      });
    }
  }, []);

  const handleInputChange = (field: keyof InspeccionFilter, value: string | number | undefined) => {
    const newValue = value === '' ? undefined : value;
    onFiltrosChange({ ...filtros, [field]: newValue });
  };

  const clearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    onFiltrosChange({
      fechaInicio: today,
      fechaFin: today,
      horaInicio: '00:00',
      horaFin: '23:59'
    });
    setActiveTab("general");
  };

  // Opciones para combobox
  const transportistaOptions = transportistas.map(t => ({
    value: t.id,
    label: t.nombre
  }));

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filtros de búsqueda</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="matriz">Información Matriz</TabsTrigger>
              <TabsTrigger value="fechas">Fechas y Horas</TabsTrigger>
            </TabsList>
            
            {/* Información General */}
            <TabsContent value="general" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresa transportista</Label>
                  <Combobox
                    options={transportistaOptions}
                    value={filtros.transportista || ''}
                    onValueChange={(value) => handleInputChange('transportista', value)}
                    placeholder="Seleccionar empresa transportista"
                    searchPlaceholder="Buscar empresa..."
                    emptyText="No se encontraron empresas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    placeholder="Nombre del usuario responsable"
                    value={filtros.responsable || ''}
                    onChange={(e) => handleInputChange('responsable', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    placeholder="Ej: CRC-1001"
                    value={filtros.placa || ''}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Información Matriz */}
            <TabsContent value="matriz" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consecutivo">Identificador de matriz</Label>
                  <Input
                    id="consecutivo"
                    type="number"
                    placeholder="Número consecutivo"
                    value={filtros.consecutivo || ''}
                    onChange={(e) => handleInputChange('consecutivo', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreMatriz">Nombre de matriz</Label>
                  <Input
                    id="nombreMatriz"
                    placeholder="Nombre de la matriz"
                    value={filtros.nombreMatriz || ''}
                    onChange={(e) => handleInputChange('nombreMatriz', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Fechas y Horas */}
            <TabsContent value="fechas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={filtros.fechaInicio || ''}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={filtros.horaInicio || ''}
                    onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={filtros.fechaFin || ''}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora fin</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={filtros.horaFin || ''}
                    onChange={(e) => handleInputChange('horaFin', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={clearFilters} disabled={loading} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Limpiar filtros</span>
        </Button>
        <Button onClick={onBuscar} disabled={loading} className="flex items-center gap-1">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar</span>
        </Button>
      </CardFooter>
    </Card>
  );
}