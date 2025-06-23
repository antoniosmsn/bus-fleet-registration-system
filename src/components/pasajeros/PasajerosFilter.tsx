import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X } from 'lucide-react';
import { PasajeroFilter } from '@/types/pasajero';

interface PasajerosFilterProps {
  onFilter: (filters: PasajeroFilter) => void;
}

const PasajerosFilter: React.FC<PasajerosFilterProps> = ({ onFilter }) => {
  const [filtros, setFiltros] = useState<PasajeroFilter>({});

  const handleInputChange = (field: keyof PasajeroFilter, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleSelectChange = (field: keyof PasajeroFilter, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value === 'todos' ? undefined : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFiltros(prev => ({
      ...prev,
      solicitudRuta: checked ? true : null
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
        <Tabs defaultValue="datos-pasajero" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datos-pasajero">Datos Pasajero</TabsTrigger>
            <TabsTrigger value="datos-empresa">Datos de Empresa</TabsTrigger>
            <TabsTrigger value="datos-estado">Datos de Estado</TabsTrigger>
          </TabsList>

          <TabsContent value="datos-pasajero" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cedula" className="text-xs">Cédula</Label>
                <Input
                  id="cedula"
                  placeholder="Cédula..."
                  value={filtros.cedula || ''}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nombres" className="text-xs">Nombres</Label>
                <Input
                  id="nombres"
                  placeholder="Nombres..."
                  value={filtros.nombres || ''}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="primerApellido" className="text-xs">Primer Apellido</Label>
                <Input
                  id="primerApellido"
                  placeholder="Primer apellido..."
                  value={filtros.primerApellido || ''}
                  onChange={(e) => handleInputChange('primerApellido', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="segundoApellido" className="text-xs">Segundo Apellido</Label>
                <Input
                  id="segundoApellido"
                  placeholder="Segundo apellido..."
                  value={filtros.segundoApellido || ''}
                  onChange={(e) => handleInputChange('segundoApellido', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="correo" className="text-xs">Correo</Label>
                <Input
                  id="correo"
                  placeholder="Correo..."
                  value={filtros.correo || ''}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datos-empresa" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="empresaCliente" className="text-xs">Empresa Cliente</Label>
                <Input
                  id="empresaCliente"
                  placeholder="Empresa..."
                  value={filtros.empresaCliente || ''}
                  onChange={(e) => handleInputChange('empresaCliente', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tipoPago" className="text-xs">Tipo de Pago</Label>
                <Select onValueChange={(value) => handleSelectChange('tipoPago', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="prepago">Prepago</SelectItem>
                    <SelectItem value="postpago">Postpago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="badgeInterno" className="text-xs">Badge Interno</Label>
                <Input
                  id="badgeInterno"
                  placeholder="Badge..."
                  value={filtros.badgeInterno || ''}
                  onChange={(e) => handleInputChange('badgeInterno', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="numeroEmpleado" className="text-xs">Número de Empleado</Label>
                <Input
                  id="numeroEmpleado"
                  placeholder="No. empleado..."
                  value={filtros.numeroEmpleado || ''}
                  onChange={(e) => handleInputChange('numeroEmpleado', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datos-estado" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="estado" className="text-xs">Estado del Pasajero</Label>
                <Select onValueChange={(value) => handleSelectChange('estado', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="cambio_password">Cambio Password</SelectItem>
                    <SelectItem value="dado_de_baja">Dado de Baja</SelectItem>
                    <SelectItem value="solicitud_traslado">En Solicitud de Traslado</SelectItem>
                    <SelectItem value="traslado_rechazado">Solicitud Traslado Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Solicitud de Ruta</Label>
                <div className="flex items-center space-x-2 h-8">
                  <Checkbox
                    id="solicitudRuta"
                    checked={filtros.solicitudRuta === true}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="solicitudRuta" className="text-xs font-normal">
                    Con solicitud de ruta
                  </Label>
                </div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PasajerosFilter;
