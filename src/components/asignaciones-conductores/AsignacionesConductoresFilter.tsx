import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, FileText, Download } from 'lucide-react';

interface AsignacionesConductoresFiltrosProps {
  filtros: {
    empresaCliente: string;
    transportista: string;
    tipoUnidad: string;
    horarioInicio: string;
    horarioFin: string;
    fechaInicio: string;
    fechaFin: string;
    ramal: string;
    turno: string;
    conductor: string;
    codigoConductor: string;
    estadoAsignacion: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

const AsignacionesConductoresFilter: React.FC<AsignacionesConductoresFiltrosProps> = ({ 
  filtros, 
  onFiltrosChange 
}) => {
  // Mock data - replace with actual API calls
  const empresasCliente = [
    { value: '1', label: 'Intel Corporation' },
    { value: '2', label: 'Microsoft Costa Rica' },
    { value: '3', label: 'Amazon Development Center' },
    { value: '4', label: 'Parque Industrial S.A.' }
  ];

  const transportistas = [
    { value: '1', label: 'Transportes San José S.A.' },
    { value: '2', label: 'Autobuses del Valle' },
    { value: '3', label: 'Empresa de Transporte Central' },
    { value: '4', label: 'Transportes Unidos' },
    { value: '5', label: 'Buses Express Costa Rica' }
  ];

  const ramales = [
    { value: '1', label: 'San José - Cartago' },
    { value: '2', label: 'Heredia - Alajuela' },
    { value: '3', label: 'Zona Franca Intel' },
    { value: '4', label: 'Campus Tecnológico' },
    { value: '5', label: 'Parque Industrial' }
  ];

  const turnos = [
    { value: '1', label: 'Turno A' },
    { value: '2', label: 'Turno B' },
    { value: '3', label: 'Turno C' }
  ];

  const aplicarFiltros = () => {
    onFiltrosChange(filtros);
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      empresaCliente: '',
      transportista: '',
      tipoUnidad: '',
      horarioInicio: '00:00',
      horarioFin: '23:59',
      fechaInicio: '2020-01-01',
      fechaFin: '2030-12-31',
      ramal: '',
      turno: '',
      conductor: '',
      codigoConductor: '',
      estadoAsignacion: 'todos'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtros de Búsqueda</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={limpiarFiltros} size="sm" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
          <Button onClick={aplicarFiltros} size="sm" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="servicio-horario" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="servicio-horario">Servicio y Horario</TabsTrigger>
            <TabsTrigger value="empresas-transporte">Empresas y Transporte</TabsTrigger>
            <TabsTrigger value="conductor">Conductor</TabsTrigger>
          </TabsList>

          {/* Tab: Servicio y Horario */}
          <TabsContent value="servicio-horario" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Turno */}
              <div className="space-y-2">
                <Label>Turno</Label>
                <Combobox
                  options={turnos}
                  value={filtros.turno}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, turno: value })}
                  placeholder="Seleccionar turno..."
                  searchPlaceholder="Buscar turno..."
                  emptyText="No se encontraron turnos."
                />
              </div>

              {/* Horario Inicio */}
              <div className="space-y-2">
                <Label>Horario Inicio</Label>
                <Input
                  type="time"
                  value={filtros.horarioInicio}
                  onChange={(e) => onFiltrosChange({ ...filtros, horarioInicio: e.target.value })}
                />
              </div>

              {/* Horario Fin */}
              <div className="space-y-2">
                <Label>Horario Fin</Label>
                <Input
                  type="time"
                  value={filtros.horarioFin}
                  onChange={(e) => onFiltrosChange({ ...filtros, horarioFin: e.target.value })}
                />
              </div>

              {/* Fecha Inicio */}
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value })}
                />
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value })}
                />
              </div>

              {/* Tipo de Unidad */}
              <div className="space-y-2">
                <Label>Tipo de Unidad</Label>
                <Select
                  value={filtros.tipoUnidad}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, tipoUnidad: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="autobus">Autobús</SelectItem>
                    <SelectItem value="buseta">Buseta</SelectItem>
                    <SelectItem value="microbus">Microbús</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Empresas y Transporte */}
          <TabsContent value="empresas-transporte" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Empresa Cliente */}
              <div className="space-y-2">
                <Label>Empresa Cliente</Label>
                <Combobox
                  options={empresasCliente}
                  value={filtros.empresaCliente}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, empresaCliente: value })}
                  placeholder="Seleccionar empresa..."
                  searchPlaceholder="Buscar empresa..."
                  emptyText="No se encontraron empresas."
                />
              </div>

              {/* Transportista */}
              <div className="space-y-2">
                <Label>Transportista</Label>
                <Combobox
                  options={transportistas}
                  value={filtros.transportista}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, transportista: value })}
                  placeholder="Seleccionar transportista..."
                  searchPlaceholder="Buscar transportista..."
                  emptyText="No se encontraron transportistas."
                />
              </div>

              {/* Ramal */}
              <div className="space-y-2 md:col-span-2">
                <Label>Ramal</Label>
                <Combobox
                  options={ramales}
                  value={filtros.ramal}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, ramal: value })}
                  placeholder="Seleccionar ramal..."
                  searchPlaceholder="Buscar ramal..."
                  emptyText="No se encontraron ramales."
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Conductor */}
          <TabsContent value="conductor" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Conductor */}
              <div className="space-y-2">
                <Label>Conductor (nombre o apellidos)</Label>
                <Input
                  placeholder="Buscar por nombre o apellidos..."
                  value={filtros.conductor}
                  onChange={(e) => onFiltrosChange({ ...filtros, conductor: e.target.value })}
                />
              </div>

              {/* Código Conductor */}
              <div className="space-y-2">
                <Label>Código Conductor</Label>
                <Input
                  placeholder="Código exacto..."
                  value={filtros.codigoConductor}
                  onChange={(e) => onFiltrosChange({ ...filtros, codigoConductor: e.target.value })}
                />
              </div>

              {/* Estado de Asignación */}
              <div className="space-y-2">
                <Label>Estado de Asignación</Label>
                <Select
                  value={filtros.estadoAsignacion}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, estadoAsignacion: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="asignado">Conductor asignado</SelectItem>
                    <SelectItem value="sin-asignar">Sin conductor asignado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AsignacionesConductoresFilter;