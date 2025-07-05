import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw } from 'lucide-react';

interface ServiciosFiltrosProps {
  filtros: {
    empresaCliente: string;
    transportista: string;
    tipoUnidad: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFin: string;
    ramal: string;
    tipoRuta: string;
    sentido: string;
    turno: string;
    estado: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

const ServiciosFilter: React.FC<ServiciosFiltrosProps> = ({ filtros, onFiltrosChange }) => {
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

  const diasSemana = [
    { id: 'lunes', label: 'Lunes' },
    { id: 'martes', label: 'Martes' },
    { id: 'miercoles', label: 'Miércoles' },
    { id: 'jueves', label: 'Jueves' },
    { id: 'viernes', label: 'Viernes' },
    { id: 'sabado', label: 'Sábado' },
    { id: 'domingo', label: 'Domingo' }
  ];

  const limpiarFiltros = () => {
    onFiltrosChange({
      empresaCliente: '',
      transportista: '',
      tipoUnidad: '',
      diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      horarioInicio: '00:00',
      horarioFin: '23:59',
      ramal: '',
      tipoRuta: '',
      sentido: '',
      turno: '',
      estado: ''
    });
  };

  const handleDiaChange = (diaId: string, checked: boolean) => {
    const nuevasDias = checked 
      ? [...filtros.diasSemana, diaId]
      : filtros.diasSemana.filter(d => d !== diaId);
    
    onFiltrosChange({ ...filtros, diasSemana: nuevasDias });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtros de Búsqueda</CardTitle>
        <Button variant="outline" onClick={limpiarFiltros} size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos-servicio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="datos-servicio">Datos del Servicio</TabsTrigger>
            <TabsTrigger value="transporte-rutas">Transporte y Rutas</TabsTrigger>
            <TabsTrigger value="empresa-cliente">Empresa Cliente</TabsTrigger>
          </TabsList>

          {/* Tab: Datos del Servicio */}
          <TabsContent value="datos-servicio" className="space-y-4">
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

              {/* Sentido */}
              <div className="space-y-2">
                <Label>Sentido</Label>
                <Select
                  value={filtros.sentido}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, sentido: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sentido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={filtros.estado}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Días de la Semana */}
            <div className="space-y-2">
              <Label>Días de la Semana</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {diasSemana.map((dia) => (
                  <div key={dia.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={dia.id}
                      checked={filtros.diasSemana.includes(dia.id)}
                      onCheckedChange={(checked) => handleDiaChange(dia.id, !!checked)}
                    />
                    <Label htmlFor={dia.id} className="text-sm">
                      {dia.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Transporte y Rutas */}
          <TabsContent value="transporte-rutas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="autobus">Autobús</SelectItem>
                    <SelectItem value="buseta">Buseta</SelectItem>
                    <SelectItem value="microbus">Microbús</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ramal */}
              <div className="space-y-2">
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

              {/* Tipo de Ruta */}
              <div className="space-y-2">
                <Label>Tipo de Ruta</Label>
                <Select
                  value={filtros.tipoRuta}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, tipoRuta: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="publica">Pública</SelectItem>
                    <SelectItem value="privada">Privada</SelectItem>
                    <SelectItem value="especial">Especial</SelectItem>
                    <SelectItem value="parque">Parque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Empresa Cliente */}
          <TabsContent value="empresa-cliente" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ServiciosFilter;