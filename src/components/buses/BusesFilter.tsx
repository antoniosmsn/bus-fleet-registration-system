
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface BusFilterValues {
  plate: string;
  busId: string;
  readerSerial: string;
  company: string;
  brand: string;
  year: string;
  capacity: string;
  vencimientoDekraStart: string;
  vencimientoDekraEnd: string;
  vencimientoPolizaStart: string;
  vencimientoPolizaEnd: string;
  vencimientoCTPStart: string;
  vencimientoCTPEnd: string;
  type: string;
  status: string;
  approval: string;
  expirationMonths: string;
}

interface BusesFilterProps {
  onFilter: (filters: BusFilterValues) => void;
}

const BusesFilter: React.FC<BusesFilterProps> = ({ onFilter }) => {
  const initialFilters: BusFilterValues = {
    plate: '',
    busId: '',
    readerSerial: '',
    company: '',
    brand: '',
    year: '',
    capacity: '',
    vencimientoDekraStart: '',
    vencimientoDekraEnd: '',
    vencimientoPolizaStart: '',
    vencimientoPolizaEnd: '',
    vencimientoCTPStart: '',
    vencimientoCTPEnd: '',
    type: '',
    status: '',
    approval: '',
    expirationMonths: '',
  };

  const [filters, setFilters] = useState<BusFilterValues>(initialFilters);
  // Set isExpanded to true by default to show filters on page load
  const [isExpanded, setIsExpanded] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filtros de búsqueda</CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleExpanded}>
            {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                name="plate"
                placeholder="Buscar por placa"
                value={filters.plate}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busId">ID Autobús</Label>
              <Input
                id="busId"
                name="busId"
                placeholder="ID del autobús"
                value={filters.busId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readerSerial">Serial Lectora</Label>
              <Input
                id="readerSerial"
                name="readerSerial"
                placeholder="Serial de lectora"
                value={filters.readerSerial}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa de Transporte</Label>
              <Input
                id="company"
                name="company"
                placeholder="Nombre de empresa"
                value={filters.company}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="Marca del autobús"
                value={filters.brand}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                name="year"
                placeholder="Año del autobús"
                value={filters.year}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad</Label>
              <Input
                id="capacity"
                name="capacity"
                placeholder="Capacidad de pasajeros"
                value={filters.capacity}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Unidad</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="autobus">Autobús</SelectItem>
                  <SelectItem value="buseta">Buseta</SelectItem>
                  <SelectItem value="microbus">Microbús</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval">Aprobación</Label>
              <Select 
                value={filters.approval} 
                onValueChange={(value) => handleSelectChange('approval', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="not_approved">Sin aprobación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationMonths">Vencimientos próximos (meses)</Label>
              <Select 
                value={filters.expirationMonths} 
                onValueChange={(value) => handleSelectChange('expirationMonths', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">1 mes</SelectItem>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Vencimiento Dekra</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="vencimientoDekraStart">Desde</Label>
                  <Input
                    id="vencimientoDekraStart"
                    name="vencimientoDekraStart"
                    type="date"
                    value={filters.vencimientoDekraStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vencimientoDekraEnd">Hasta</Label>
                  <Input
                    id="vencimientoDekraEnd"
                    name="vencimientoDekraEnd"
                    type="date"
                    value={filters.vencimientoDekraEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Vencimiento Póliza</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="vencimientoPolizaStart">Desde</Label>
                  <Input
                    id="vencimientoPolizaStart"
                    name="vencimientoPolizaStart"
                    type="date"
                    value={filters.vencimientoPolizaStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vencimientoPolizaEnd">Hasta</Label>
                  <Input
                    id="vencimientoPolizaEnd"
                    name="vencimientoPolizaEnd"
                    type="date"
                    value={filters.vencimientoPolizaEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Vencimiento CTP</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="vencimientoCTPStart">Desde</Label>
                  <Input
                    id="vencimientoCTPStart"
                    name="vencimientoCTPStart"
                    type="date"
                    value={filters.vencimientoCTPStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vencimientoCTPEnd">Hasta</Label>
                  <Input
                    id="vencimientoCTPEnd"
                    name="vencimientoCTPEnd"
                    type="date"
                    value={filters.vencimientoCTPEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={handleResetFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
        <Button onClick={handleApplyFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Aplicar filtros
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusesFilter;
