import { useState } from 'react';
import { Search, RotateCcw, Calendar, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FiltrosSolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { mockEmpresasTransporte } from '@/data/mockEmpresasTransporte';

interface SolicitudesAprobacionFiltersProps {
  filtros: FiltrosSolicitudAprobacion;
  onFiltrosChange: (filtros: FiltrosSolicitudAprobacion) => void;
  onLimpiarFiltros: () => void;
  onAplicarFiltros: () => void;
}

export function SolicitudesAprobacionFilters({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
  onAplicarFiltros
}: SolicitudesAprobacionFiltersProps) {
  const handleFiltroChange = (campo: keyof FiltrosSolicitudAprobacion, valor: string) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAplicarFiltros();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="basicos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basicos">Básicos</TabsTrigger>
            <TabsTrigger value="fechas">
              <Calendar className="h-4 w-4 mr-2" />
              Fechas
            </TabsTrigger>
            <TabsTrigger value="autobuses">
              <Bus className="h-4 w-4 mr-2" />
              Autobuses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basicos" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroServicio">Número de Servicio</Label>
                <Input
                  id="numeroServicio"
                  placeholder="Ej: SRV-001-2025-01-01"
                  value={filtros.numeroServicio}
                  onChange={(e) => handleFiltroChange('numeroServicio', e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
                <Select 
                  value={filtros.empresaTransporte} 
                  onValueChange={(value) => handleFiltroChange('empresaTransporte', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las empresas</SelectItem>
                    {mockEmpresasTransporte.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.nombre}>
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fechas" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="autobuses" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placaAutobus">Placa Autobús</Label>
                <Input
                  id="placaAutobus"
                  placeholder="Ej: BUS-001 (coincidencia parcial)"
                  value={filtros.placaAutobus}
                  onChange={(e) => handleFiltroChange('placaAutobus', e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idAutobus">ID Autobús</Label>
                <Input
                  id="idAutobus"
                  placeholder="Ej: 123 (coincidencia exacta)"
                  value={filtros.idAutobus}
                  onChange={(e) => handleFiltroChange('idAutobus', e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={onAplicarFiltros}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" onClick={onLimpiarFiltros}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}