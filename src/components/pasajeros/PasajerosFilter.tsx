
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos-pasajero" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datos-pasajero">Datos Pasajero</TabsTrigger>
            <TabsTrigger value="datos-empresa">Datos de Empresa</TabsTrigger>
            <TabsTrigger value="datos-estado">Datos de Estado</TabsTrigger>
          </TabsList>

          <TabsContent value="datos-pasajero" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  placeholder="Número de cédula..."
                  value={filtros.cedula || ''}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input
                  id="nombres"
                  placeholder="Nombres del pasajero..."
                  value={filtros.nombres || ''}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primerApellido">Primer Apellido</Label>
                <Input
                  id="primerApellido"
                  placeholder="Primer apellido..."
                  value={filtros.primerApellido || ''}
                  onChange={(e) => handleInputChange('primerApellido', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                <Input
                  id="segundoApellido"
                  placeholder="Segundo apellido..."
                  value={filtros.segundoApellido || ''}
                  onChange={(e) => handleInputChange('segundoApellido', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  placeholder="Correo electrónico..."
                  value={filtros.correo || ''}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datos-empresa" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresaCliente">Empresa Cliente</Label>
                <Input
                  id="empresaCliente"
                  placeholder="Buscar empresa..."
                  value={filtros.empresaCliente || ''}
                  onChange={(e) => handleInputChange('empresaCliente', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoPago">Tipo de Pago</Label>
                <Select onValueChange={(value) => handleSelectChange('tipoPago', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="prepago">Prepago</SelectItem>
                    <SelectItem value="postpago">Postpago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeInterno">Badge Interno</Label>
                <Input
                  id="badgeInterno"
                  placeholder="Badge interno..."
                  value={filtros.badgeInterno || ''}
                  onChange={(e) => handleInputChange('badgeInterno', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroEmpleado">Número de Empleado</Label>
                <Input
                  id="numeroEmpleado"
                  placeholder="Número de empleado..."
                  value={filtros.numeroEmpleado || ''}
                  onChange={(e) => handleInputChange('numeroEmpleado', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datos-estado" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado del Pasajero</Label>
                <Select onValueChange={(value) => handleSelectChange('estado', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado..." />
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

              <div className="space-y-2">
                <Label>Solicitud de Ruta</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="solicitudRuta"
                    checked={filtros.solicitudRuta === true}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="solicitudRuta" className="text-sm font-normal">
                    Con solicitud de ruta
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={aplicarFiltros} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline" onClick={limpiarFiltros} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasajerosFilter;
