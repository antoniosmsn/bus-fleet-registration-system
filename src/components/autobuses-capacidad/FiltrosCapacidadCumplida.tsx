import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FiltrosCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { mockEmpresasTransporte } from "@/data/mockEmpresasTransporte";
import { mockRamales } from "@/data/mockRamales";
import { Search, X } from "lucide-react";
interface FiltrosCapacidadCumplidaProps {
  filtros: FiltrosCapacidadCumplida;
  onFiltrosChange: (filtros: FiltrosCapacidadCumplida) => void;
  onLimpiarFiltros: () => void;
}
const FiltrosCapacidadCumplida: React.FC<FiltrosCapacidadCumplidaProps> = ({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros
}) => {
  const handleInputChange = (field: keyof FiltrosCapacidadCumplida, value: string) => {
    onFiltrosChange({
      ...filtros,
      [field]: value === 'all' ? undefined : value || undefined
    });
  };
  return <Card className="mb-6">
      
      <CardContent>
        <Tabs defaultValue="servicio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="servicio">Servicio</TabsTrigger>
            <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
            <TabsTrigger value="conductor">Conductor</TabsTrigger>
          </TabsList>

          <TabsContent value="servicio" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
                <Select value={filtros.empresaTransporte || "all"} onValueChange={value => handleInputChange('empresaTransporte', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las empresas</SelectItem>
                    {mockEmpresasTransporte.filter(e => e.activa).map(empresa => <SelectItem key={empresa.id} value={empresa.nombre}>
                        {empresa.nombre}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input id="fechaInicio" type="date" value={filtros.fechaInicio || ""} onChange={e => handleInputChange('fechaInicio', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input id="fechaFin" type="date" value={filtros.fechaFin || ""} onChange={e => handleInputChange('fechaFin', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora Inicio</Label>
                <TimePicker id="horaInicio" value={filtros.horaInicio || ""} onValueChange={value => handleInputChange('horaInicio', value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaFin">Hora Fin</Label>
                <TimePicker id="horaFin" value={filtros.horaFin || ""} onValueChange={value => handleInputChange('horaFin', value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruta">Ruta</Label>
                <Select value={filtros.ruta || "all"} onValueChange={value => handleInputChange('ruta', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las rutas</SelectItem>
                    {mockRamales.map(ramal => <SelectItem key={ramal.id} value={ramal.nombre}>
                        {ramal.nombre}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoAtencion">Estado de Atención</Label>
                <Select value={filtros.estadoAtencion || "todos"} onValueChange={value => handleInputChange('estadoAtencion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado de atención" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vehiculo" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idAutobus">ID del Autobús</Label>
                <Input id="idAutobus" placeholder="Buscar por ID" value={filtros.idAutobus || ""} onChange={e => handleInputChange('idAutobus', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" placeholder="Buscar por placa" value={filtros.placa || ""} onChange={e => handleInputChange('placa', e.target.value)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conductor" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conductor">Nombres y Apellidos del Conductor</Label>
                <Input id="conductor" placeholder="Buscar por nombres y apellidos" value={filtros.conductor || ""} onChange={e => handleInputChange('conductor', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoConductor">Código del Conductor</Label>
                <Input id="codigoConductor" placeholder="Buscar por código" value={filtros.codigoConductor || ""} onChange={e => handleInputChange('codigoConductor', e.target.value)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onLimpiarFiltros} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default FiltrosCapacidadCumplida;