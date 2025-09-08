import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiltrosSolicitudDevolucion } from '@/types/solicitud-devolucion-saldo';

interface SolicitudesDevolucionSaldoFiltersProps {
  onFilter: (filters: FiltrosSolicitudDevolucion) => void;
}

export default function SolicitudesDevolucionSaldoFilters({ onFilter }: SolicitudesDevolucionSaldoFiltersProps) {
  const [filters, setFilters] = useState<FiltrosSolicitudDevolucion>({
    estadoDevolucion: 'todos',
    numeroDevolucion: '',
    cedulaPasajero: '',
    nombrePasajero: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();

  const handleInputChange = (field: keyof FiltrosSolicitudDevolucion, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', date: Date | undefined) => {
    if (field === 'fechaInicio') {
      setFechaInicio(date);
      setFilters(prev => ({ 
        ...prev, 
        fechaInicio: date ? format(date, 'yyyy-MM-dd') : '' 
      }));
    } else {
      setFechaFin(date);
      setFilters(prev => ({ 
        ...prev, 
        fechaFin: date ? format(date, 'yyyy-MM-dd') : '' 
      }));
    }
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      estadoDevolucion: 'todos',
      numeroDevolucion: '',
      cedulaPasajero: '',
      nombrePasajero: '',
      fechaInicio: '',
      fechaFin: ''
    };
    setFilters(resetFilters);
    setFechaInicio(undefined);
    setFechaFin(undefined);
    onFilter(resetFilters);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <Tabs defaultValue="datos-devolucion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datos-devolucion">Datos de devolución</TabsTrigger>
            <TabsTrigger value="datos-pasajero">Datos pasajero</TabsTrigger>
            <TabsTrigger value="fechas">Fechas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datos-devolucion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Estado de la devolución</label>
                <Select value={filters.estadoDevolucion} onValueChange={(value) => handleInputChange('estadoDevolucion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendiente_aprobacion">Pendiente aprobación</SelectItem>
                    <SelectItem value="aprobada">Aprobada</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                    <SelectItem value="procesada">Procesada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Número de devolución</label>
                <Input
                  placeholder="Ingrese número de devolución"
                  value={filters.numeroDevolucion}
                  onChange={(e) => handleInputChange('numeroDevolucion', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="datos-pasajero" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Cédula pasajero</label>
                <Input
                  placeholder="Ingrese cédula del pasajero"
                  value={filters.cedulaPasajero}
                  onChange={(e) => handleInputChange('cedulaPasajero', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre pasajero</label>
                <Input
                  placeholder="Ingrese nombre del pasajero"
                  value={filters.nombrePasajero}
                  onChange={(e) => handleInputChange('nombrePasajero', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fechas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? format(fechaInicio, 'PPP', { locale: es }) : 'Seleccione fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={(date) => handleDateChange('fechaInicio', date)}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? format(fechaFin, 'PPP', { locale: es }) : 'Seleccione fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={(date) => handleDateChange('fechaFin', date)}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleReset}>
            Limpiar
          </Button>
          <Button onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}