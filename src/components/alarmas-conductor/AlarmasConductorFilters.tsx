import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, FileText, Download, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { AlarmasFiltros, TipoAlarma } from '@/types/alarma-conductor';
import { mockEmpresasCliente, mockEmpresasTransporte, mockRamalesDetallados } from '@/data/mockRastreoData';

interface AlarmasConductorFiltersProps {
  filtros: AlarmasFiltros;
  filtrosAplicados: AlarmasFiltros;
  onFiltrosChange: (filtros: AlarmasFiltros) => void;
  onAplicarFiltros: (filtros: AlarmasFiltros) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const tiposAlarmaOptions: TipoAlarma[] = [
  'Exceso de velocidad',
  'Salida de geocerca', 
  'Entrada no autorizada',
  'Parada prolongada',
  'Desvío de ruta',
  'Conductor no autorizado',
  'Puerta abierta en movimiento',
  'Pánico activado',
  'Falla de comunicación',
  'Batería baja'
];

const AlarmasConductorFilters: React.FC<AlarmasConductorFiltersProps> = ({
  filtros,
  filtrosAplicados,
  onFiltrosChange,
  onAplicarFiltros,
  onExportPDF,
  onExportExcel,
  isOpen,
  onToggle
}) => {
  const empresasTransporteOptions = mockEmpresasTransporte.map(e => ({
    label: e.nombre,
    value: e.nombre
  }));

  const empresasClienteOptions = mockEmpresasCliente.map(e => ({
    label: e.nombre,
    value: e.nombre
  }));

  const rutasOptions = [
    { label: 'Todas las rutas', value: '' },
    ...mockRamalesDetallados
      .filter(r => r.ubicacion.includes('San José') || r.ubicacion.includes('Alajuela'))
      .map(r => ({ label: r.nombre, value: r.nombre }))
  ];

  const handleInputChange = (field: keyof AlarmasFiltros, value: any) => {
    onFiltrosChange({
      ...filtros,
      [field]: value
    });
  };

  const handleTipoAlarmaChange = (tipo: TipoAlarma, checked: boolean) => {
    const nuevos = checked 
      ? [...filtros.tiposAlarma, tipo]
      : filtros.tiposAlarma.filter(t => t !== tipo);
    
    handleInputChange('tiposAlarma', nuevos);
  };

  const limpiarFiltros = () => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);
    
    const filtrosVacios: AlarmasFiltros = {
      desdeUtc: inicioHoy.toISOString(),
      hastaUtc: finHoy.toISOString(),
      tiposAlarma: [],
      conductor: '',
      conductorCodigo: '',
      placa: '',
      busId: '',
      ruta: '',
      empresasTransporte: [],
      empresasCliente: []
    };
    
    onFiltrosChange(filtrosVacios);
  };

  const formatearFecha = (isoString: string) => {
    const fecha = new Date(isoString);
    return fecha.toISOString().slice(0, 16);
  };

  const hayCambiosPendientes = JSON.stringify(filtros) !== JSON.stringify(filtrosAplicados);

  const contadorFiltrosActivos = () => {
    let count = 0;
    if (filtrosAplicados.tiposAlarma.length > 0) count++;
    if (filtrosAplicados.conductor) count++;
    if (filtrosAplicados.conductorCodigo) count++;
    if (filtrosAplicados.placa) count++;
    if (filtrosAplicados.busId) count++;
    if (filtrosAplicados.ruta) count++;
    if (filtrosAplicados.empresasTransporte.length > 0) count++;
    if (filtrosAplicados.empresasCliente.length > 0) count++;
    return count;
  };

  const filtrosActivos = contadorFiltrosActivos();

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Collapsible open={isOpen} onOpenChange={onToggle}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Filtros de Búsqueda
                {filtrosActivos > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filtrosActivos}
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          <Button
            onClick={() => onAplicarFiltros(filtros)}
            className={`flex items-center gap-2 ${
              hayCambiosPendientes 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground'
            }`}
            disabled={!hayCambiosPendientes}
          >
            <Search className="h-4 w-4" />
            {hayCambiosPendientes ? 'Buscar' : 'Filtros aplicados'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={onExportPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={onExportExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleContent className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Filtros de fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaDesde">Desde</Label>
                  <Input
                    id="fechaDesde"
                    type="datetime-local"
                    value={formatearFecha(filtros.desdeUtc)}
                    onChange={(e) => {
                      const fecha = new Date(e.target.value);
                      handleInputChange('desdeUtc', fecha.toISOString());
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaHasta">Hasta</Label>
                  <Input
                    id="fechaHasta"
                    type="datetime-local"
                    value={formatearFecha(filtros.hastaUtc)}
                    onChange={(e) => {
                      const fecha = new Date(e.target.value);
                      handleInputChange('hastaUtc', fecha.toISOString());
                    }}
                  />
                </div>
              </div>

              {/* Tipos de alarma */}
              <div className="space-y-2">
                <Label>Tipos de Alarma</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {tiposAlarmaOptions.map((tipo) => (
                    <div key={tipo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tipo-${tipo}`}
                        checked={filtros.tiposAlarma.includes(tipo)}
                        onCheckedChange={(checked) => handleTipoAlarmaChange(tipo, checked as boolean)}
                      />
                      <Label htmlFor={`tipo-${tipo}`} className="text-sm cursor-pointer">
                        {tipo}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtros de búsqueda */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conductor">Conductor</Label>
                  <Input
                    id="conductor"
                    placeholder="Nombre del conductor..."
                    value={filtros.conductor}
                    onChange={(e) => handleInputChange('conductor', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conductorCodigo">Código Conductor</Label>
                  <Input
                    id="conductorCodigo"
                    placeholder="Código exacto..."
                    value={filtros.conductorCodigo}
                    onChange={(e) => handleInputChange('conductorCodigo', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    placeholder="Placa del vehículo..."
                    value={filtros.placa}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="busId">ID Autobús</Label>
                  <Input
                    id="busId"
                    placeholder="ID exacto..."
                    value={filtros.busId}
                    onChange={(e) => handleInputChange('busId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ruta</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filtros.ruta}
                    onChange={(e) => handleInputChange('ruta', e.target.value)}
                  >
                    {rutasOptions.map((ruta) => (
                      <option key={ruta.value} value={ruta.value}>
                        {ruta.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresas de Transporte</Label>
                  <MultiSelect
                    options={empresasTransporteOptions}
                    value={filtros.empresasTransporte}
                    onValueChange={(values) => handleInputChange('empresasTransporte', values)}
                    placeholder="Seleccionar empresas..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Empresas Cliente</Label>
                  <MultiSelect
                    options={empresasClienteOptions}
                    value={filtros.empresasCliente}
                    onValueChange={(values) => handleInputChange('empresasCliente', values)}
                    placeholder="Seleccionar empresas cliente..."
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={limpiarFiltros}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpiar Filtros
                </Button>

                <Button
                  onClick={() => onAplicarFiltros(filtros)}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Aplicar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AlarmasConductorFilters;