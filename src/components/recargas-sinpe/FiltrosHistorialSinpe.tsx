import { useState } from 'react';
import { Calendar, Search, User, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { FiltrosHistorial } from '@/types/recarga-sinpe';
import { mockUsuarios } from '@/data/mockRecargasSinpe';

interface Props {
  filtros: FiltrosHistorial;
  onFiltrosChange: (filtros: FiltrosHistorial) => void;
  onLimpiar: () => void;
}

export default function FiltrosHistorialSinpe({ filtros, onFiltrosChange, onLimpiar }: Props) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFechaInicioChange = (fecha: Date | undefined) => {
    onFiltrosChange({ ...filtros, fechaInicio: fecha });
  };

  const handleFechaFinChange = (fecha: Date | undefined) => {
    onFiltrosChange({ ...filtros, fechaFin: fecha });
  };

  const handleUsuarioChange = (usuario: string) => {
    onFiltrosChange({ ...filtros, usuario: usuario === 'todos' ? undefined : usuario });
  };

  const handleNombreArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, nombreArchivo: e.target.value || undefined });
  };

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros de Búsqueda</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
        </Button>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha Inicio */}
          <div className="space-y-2">
            <Label>Fecha Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filtros.fechaInicio ? 
                    format(filtros.fechaInicio, 'dd/MM/yyyy', { locale: es }) : 
                    'Seleccionar fecha'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filtros.fechaInicio}
                  onSelect={handleFechaInicioChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fecha Fin */}
          <div className="space-y-2">
            <Label>Fecha Fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filtros.fechaFin ? 
                    format(filtros.fechaFin, 'dd/MM/yyyy', { locale: es }) : 
                    'Seleccionar fecha'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filtros.fechaFin}
                  onSelect={handleFechaFinChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Usuario */}
          <div className="space-y-2">
            <Label>Usuario</Label>
            <Select value={filtros.usuario || 'todos'} onValueChange={handleUsuarioChange}>
              <SelectTrigger>
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los usuarios</SelectItem>
                {mockUsuarios.map((usuario) => (
                  <SelectItem key={usuario} value={usuario}>
                    {usuario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre de Archivo */}
          <div className="space-y-2">
            <Label>Nombre de Archivo</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={filtros.nombreArchivo || ''}
                onChange={handleNombreArchivoChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      )}

      {mostrarFiltros && (
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onLimpiar} size="sm">
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}