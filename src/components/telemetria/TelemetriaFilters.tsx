import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Filter, Download, FileText, X } from 'lucide-react';
import { TelemetriaFiltros, TipoRegistro } from '@/types/telemetria';

interface TelemetriaFiltersProps {
  filtros: TelemetriaFiltros;
  onFiltrosChange: (filtros: TelemetriaFiltros) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const TelemetriaFilters: React.FC<TelemetriaFiltersProps> = ({
  filtros,
  onFiltrosChange,
  onExportPDF,
  onExportExcel,
  isOpen,
  onToggle
}) => {
  const tiposRegistro: TipoRegistro[] = [
    'Entrada a ruta',
    'Salida de ruta', 
    'Paso por parada',
    'Exceso de velocidad',
    'Grabación por tiempo',
    'Grabación por curso'
  ];

  const empresasTransporte = [
    'Transportes Unidos',
    'Rápido Express',
    'Buses del Norte',
    'Trans Costa Rica'
  ];

  const empresasCliente = [
    'Intel Costa Rica',
    'Procter & Gamble',
    'Amazon',
    'Microsoft'
  ];

  const rutas = [
    'Ruta 1 - Centro-Norte',
    'Ruta 2 - Este-Oeste',
    'Ruta 3 - Sur-Centro',
    'Ruta 4 - Express'
  ];

  const handleTipoRegistroChange = (tipo: TipoRegistro, checked: boolean) => {
    const nuevos = checked
      ? [...filtros.tiposRegistro, tipo]
      : filtros.tiposRegistro.filter(t => t !== tipo);
    
    onFiltrosChange({ ...filtros, tiposRegistro: nuevos });
  };

  const handleEmpresaTransporteChange = (empresa: string, checked: boolean) => {
    const nuevas = checked
      ? [...filtros.empresasTransporte, empresa]
      : filtros.empresasTransporte.filter(e => e !== empresa);
    
    onFiltrosChange({ ...filtros, empresasTransporte: nuevas });
  };

  const handleEmpresaClienteChange = (empresa: string, checked: boolean) => {
    const nuevas = checked
      ? [...filtros.empresasCliente, empresa]
      : filtros.empresasCliente.filter(e => e !== empresa);
    
    onFiltrosChange({ ...filtros, empresasCliente: nuevas });
  };

  const limpiarFiltros = () => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);

    onFiltrosChange({
      desdeUtc: inicioHoy.toISOString(),
      hastaUtc: finHoy.toISOString(),
      tiposRegistro: [],
      ruta: '',
      placa: '',
      busId: '',
      conductorCodigo: '',
      conductorNombre: '',
      empresasTransporte: [],
      empresasCliente: []
    });
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.tiposRegistro.length > 0) count++;
    if (filtros.ruta) count++;
    if (filtros.placa) count++;
    if (filtros.busId) count++;
    if (filtros.conductorCodigo) count++;
    if (filtros.conductorNombre) count++;
    if (filtros.empresasTransporte.length > 0) count++;
    if (filtros.empresasCliente.length > 0) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtros</span>
              {filtrosActivos > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filtrosActivos}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportPDF();
                }}
              >
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportExcel();
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {/* Rango de fechas */}
              <div className="space-y-2">
                <Label>Fecha desde</Label>
                <Input
                  type="datetime-local"
                  value={filtros.desdeUtc ? new Date(filtros.desdeUtc).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                    onFiltrosChange({ ...filtros, desdeUtc: date });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Fecha hasta</Label>
                <Input
                  type="datetime-local"
                  value={filtros.hastaUtc ? new Date(filtros.hastaUtc).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                    onFiltrosChange({ ...filtros, hastaUtc: date });
                  }}
                />
              </div>

              {/* Ruta */}
              <div className="space-y-2">
                <Label>Ruta</Label>
                <Select
                  value={filtros.ruta}
                  onValueChange={(value) => onFiltrosChange({ ...filtros, ruta: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las rutas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las rutas</SelectItem>
                    {rutas.map(ruta => (
                      <SelectItem key={ruta} value={ruta}>{ruta}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Placa */}
              <div className="space-y-2">
                <Label>Placa</Label>
                <Input
                  placeholder="Buscar por placa"
                  value={filtros.placa}
                  onChange={(e) => onFiltrosChange({ ...filtros, placa: e.target.value })}
                />
              </div>

              {/* ID Autobús */}
              <div className="space-y-2">
                <Label>ID Autobús</Label>
                <Input
                  placeholder="ID exacto"
                  value={filtros.busId}
                  onChange={(e) => onFiltrosChange({ ...filtros, busId: e.target.value })}
                />
              </div>

              {/* Conductor */}
              <div className="space-y-2">
                <Label>Código Conductor</Label>
                <Input
                  placeholder="Código exacto"
                  value={filtros.conductorCodigo}
                  onChange={(e) => onFiltrosChange({ ...filtros, conductorCodigo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Nombre Conductor</Label>
                <Input
                  placeholder="Buscar por nombre"
                  value={filtros.conductorNombre}
                  onChange={(e) => onFiltrosChange({ ...filtros, conductorNombre: e.target.value })}
                />
              </div>
            </div>

            {/* Filtros de selección múltiple */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Tipos de registro */}
              <div className="space-y-2">
                <Label>Tipos de Registro</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tiposRegistro.map(tipo => (
                    <div key={tipo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tipo-${tipo}`}
                        checked={filtros.tiposRegistro.includes(tipo)}
                        onCheckedChange={(checked) => handleTipoRegistroChange(tipo, checked as boolean)}
                      />
                      <Label htmlFor={`tipo-${tipo}`} className="text-sm">{tipo}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empresas de transporte */}
              <div className="space-y-2">
                <Label>Empresas de Transporte</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {empresasTransporte.map(empresa => (
                    <div key={empresa} className="flex items-center space-x-2">
                      <Checkbox
                        id={`transport-${empresa}`}
                        checked={filtros.empresasTransporte.includes(empresa)}
                        onCheckedChange={(checked) => handleEmpresaTransporteChange(empresa, checked as boolean)}
                      />
                      <Label htmlFor={`transport-${empresa}`} className="text-sm">{empresa}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empresas cliente */}
              <div className="space-y-2">
                <Label>Empresas Cliente</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {empresasCliente.map(empresa => (
                    <div key={empresa} className="flex items-center space-x-2">
                      <Checkbox
                        id={`client-${empresa}`}
                        checked={filtros.empresasCliente.includes(empresa)}
                        onCheckedChange={(checked) => handleEmpresaClienteChange(empresa, checked as boolean)}
                      />
                      <Label htmlFor={`client-${empresa}`} className="text-sm">{empresa}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón limpiar */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TelemetriaFilters;