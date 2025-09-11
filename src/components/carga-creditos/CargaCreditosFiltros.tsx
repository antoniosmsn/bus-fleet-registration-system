import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, FileText, Download } from 'lucide-react';
import { FiltrosCargueCredito } from '@/types/carga-creditos';

interface CargaCreditosFiltrosProps {
  onFilter: (filters: FiltrosCargueCredito) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

const CargaCreditosFiltros: React.FC<CargaCreditosFiltrosProps> = ({ 
  onFilter, 
  onExportPDF, 
  onExportExcel 
}) => {
  const [filtros, setFiltros] = useState<FiltrosCargueCredito>({});

  const handleInputChange = (field: keyof FiltrosCargueCredito, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleSelectChange = (field: keyof FiltrosCargueCredito, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value === 'todos' ? undefined : value
    }));
  };

  const aplicarFiltros = () => {
    onFilter(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros({});
    onFilter({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs defaultValue="fechas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fechas">Fechas</TabsTrigger>
            <TabsTrigger value="datos-generales">Datos generales</TabsTrigger>
          </TabsList>

          <TabsContent value="fechas" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fechaInicio" className="text-xs">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filtros.fechaInicio || ''}
                  onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="horaInicio" className="text-xs">Hora Inicio</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={filtros.horaInicio || ''}
                  onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fechaFin" className="text-xs">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filtros.fechaFin || ''}
                  onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="horaFin" className="text-xs">Hora Fin</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={filtros.horaFin || ''}
                  onChange={(e) => handleInputChange('horaFin', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datos-generales" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nombreArchivo" className="text-xs">Nombre del archivo</Label>
                <Input
                  id="nombreArchivo"
                  placeholder="Buscar archivo..."
                  value={filtros.nombreArchivo || ''}
                  onChange={(e) => handleInputChange('nombreArchivo', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nombreUsuario" className="text-xs">Nombre usuario</Label>
                <Input
                  id="nombreUsuario"
                  placeholder="Buscar usuario..."
                  value={filtros.nombreUsuario || ''}
                  onChange={(e) => handleInputChange('nombreUsuario', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="estado" className="text-xs">Estado</Label>
                <Select onValueChange={(value) => handleSelectChange('estado', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Procesado">Procesado</SelectItem>
                    <SelectItem value="Procesado con error">Procesado con Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={aplicarFiltros} className="flex items-center gap-2 h-8 px-3 text-sm">
            <Search className="h-3 w-3" />
            Buscar
          </Button>
          <Button variant="outline" onClick={limpiarFiltros} className="flex items-center gap-2 h-8 px-3 text-sm">
            <X className="h-3 w-3" />
            Limpiar Filtros
          </Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={onExportPDF} className="flex items-center gap-2 h-8 px-3 text-sm">
              <FileText className="h-3 w-3" />
              PDF
            </Button>
            <Button variant="outline" onClick={onExportExcel} className="flex items-center gap-2 h-8 px-3 text-sm">
              <Download className="h-3 w-3" />
              Excel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CargaCreditosFiltros;