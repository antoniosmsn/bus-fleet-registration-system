import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter, FileDown, Trash2 } from "lucide-react";
import { FiltrosServicioEmpresa, EstadoSolicitudCambio, SentidoServicio } from "@/types/servicio-empresa-transporte";
import { mockEmpresas } from "@/data/mockEmpresas";
import { mockTransportistas } from "@/data/mockTransportistas";
import { mockRamales } from "@/data/mockRamales";

interface ServiciosEmpresaFiltersProps {
  filtros: FiltrosServicioEmpresa;
  onFiltrosChange: (filtros: FiltrosServicioEmpresa) => void;
  onAplicarFiltros: () => void;
  onLimpiarFiltros: () => void;
  onExportarPDF: () => void;
  onExportarExcel: () => void;
  totalRegistros: number;
}

const estadosSolicitud: EstadoSolicitudCambio[] = ['Pendiente', 'Aprobado', 'Rechazado'];
const sentidos: SentidoServicio[] = ['Ingreso', 'Salida'];
const tiposRuta = ['Urbano', 'Interurbano', 'Regional', 'Especial'];
const sectores = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste', 'Metropolitano'];

export default function ServiciosEmpresaFilters({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  onLimpiarFiltros,
  onExportarPDF,
  onExportarExcel,
  totalRegistros
}: ServiciosEmpresaFiltersProps) {

  const updateFiltro = (key: keyof FiltrosServicioEmpresa, value: any) => {
    onFiltrosChange({ ...filtros, [key]: value });
  };

  const addToArrayFilter = (key: keyof FiltrosServicioEmpresa, value: string) => {
    const currentArray = filtros[key] as string[];
    if (!currentArray.includes(value)) {
      updateFiltro(key, [...currentArray, value]);
    }
  };

  const removeFromArrayFilter = (key: keyof FiltrosServicioEmpresa, value: string) => {
    const currentArray = filtros[key] as string[];
    updateFiltro(key, currentArray.filter(item => item !== value));
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.empresaCliente.length > 0) count++;
    if (filtros.empresaTransporte.length > 0) count++;
    if (filtros.fechaInicio) count++;
    if (filtros.fechaFin) count++;
    if (filtros.horaInicio) count++;
    if (filtros.horaFin) count++;
    if (filtros.estadoSolicitudCambio.length > 0) count++;
    if (filtros.tipoRuta.length > 0) count++;
    if (filtros.sector.length > 0) count++;
    if (filtros.ramal.length > 0) count++;
    if (filtros.sentido.length > 0) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filtros de Búsqueda</h3>
            {filtrosActivos > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filtrosActivos} activo{filtrosActivos !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExportarPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onExportarExcel}>
              <FileDown className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basicos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basicos">Básicos</TabsTrigger>
            <TabsTrigger value="fechas">Fechas y Horarios</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
          </TabsList>

          <TabsContent value="basicos" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Empresa Cliente</Label>
                <Select onValueChange={(value) => addToArrayFilter('empresaCliente', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmpresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.nombre}>
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.empresaCliente.map((empresa) => (
                    <Badge key={empresa} variant="outline" className="text-xs">
                      {empresa}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('empresaCliente', empresa)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Empresa de Transporte</Label>
                <Select onValueChange={(value) => addToArrayFilter('empresaTransporte', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar transportista" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTransportistas.map((transportista) => (
                      <SelectItem key={transportista.id} value={transportista.nombre}>
                        {transportista.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.empresaTransporte.map((transportista) => (
                    <Badge key={transportista} variant="outline" className="text-xs">
                      {transportista}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('empresaTransporte', transportista)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado de Solicitud de Cambio</Label>
                <Select onValueChange={(value) => addToArrayFilter('estadoSolicitudCambio', value as EstadoSolicitudCambio)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sin solicitud">Sin solicitud</SelectItem>
                    {estadosSolicitud.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.estadoSolicitudCambio.map((estado) => (
                    <Badge key={estado} variant="outline" className="text-xs">
                      {estado}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('estadoSolicitudCambio', estado)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fechas" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora Inicio</Label>
                <Input
                  type="time"
                  value={filtros.horaInicio}
                  onChange={(e) => updateFiltro('horaInicio', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora Fin</Label>
                <Input
                  type="time"
                  value={filtros.horaFin}
                  onChange={(e) => updateFiltro('horaFin', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="servicios" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Ruta</Label>
                <Select onValueChange={(value) => addToArrayFilter('tipoRuta', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRuta.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.tipoRuta.map((tipo) => (
                    <Badge key={tipo} variant="outline" className="text-xs">
                      {tipo}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('tipoRuta', tipo)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sector</Label>
                <Select onValueChange={(value) => addToArrayFilter('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectores.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.sector.map((sector) => (
                    <Badge key={sector} variant="outline" className="text-xs">
                      {sector}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('sector', sector)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ramal</Label>
                <Select onValueChange={(value) => addToArrayFilter('ramal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ramal" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRamales.map((ramal) => (
                      <SelectItem key={ramal.id} value={ramal.nombre}>
                        {ramal.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.ramal.map((ramal) => (
                    <Badge key={ramal} variant="outline" className="text-xs">
                      {ramal}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('ramal', ramal)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sentido</Label>
                <Select onValueChange={(value) => addToArrayFilter('sentido', value as SentidoServicio)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sentido" />
                  </SelectTrigger>
                  <SelectContent>
                    {sentidos.map((sentido) => (
                      <SelectItem key={sentido} value={sentido}>
                        {sentido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1">
                  {filtros.sentido.map((sentido) => (
                    <Badge key={sentido} variant="outline" className="text-xs">
                      {sentido}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('sentido', sentido)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {totalRegistros} registro{totalRegistros !== 1 ? 's' : ''} encontrado{totalRegistros !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onLimpiarFiltros} disabled={filtrosActivos === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button onClick={onAplicarFiltros}>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}