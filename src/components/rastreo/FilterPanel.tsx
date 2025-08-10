import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  isMobile: boolean;
  modo: string;
  setModo: (modo: 'servicios' | 'rango') => void;
  desde: string;
  setDesde: (value: string) => void;
  hasta: string;
  setHasta: (value: string) => void;
  numeroServicio: string;
  setNumeroServicio: (value: string) => void;
  vehiculos: string[];
  setVehiculos: (value: string[]) => void;
  vehiculosOptions: Array<{ label: string; value: string }>;
  empresasTransporte: string[];
  setEmpresasTransporte: (value: string[]) => void;
  empresasTransporteOptions: Array<{ label: string; value: string }>;
  empresasCliente: string[];
  setEmpresasCliente: (value: string[]) => void;
  empresasClienteOptions: Array<{ label: string; value: string }>;
  tiposSeleccionados: string[];
  setTiposSeleccionados: (value: string[]) => void;
  tiposRutaOptions: Array<{ label: string; value: string }>;
  handleBuscar: () => void;
}

const FilterPanelContent: React.FC<FilterPanelProps> = ({
  isMobile,
  modo,
  setModo,
  desde,
  setDesde,
  hasta,
  setHasta,
  numeroServicio,
  setNumeroServicio,
  vehiculos,
  setVehiculos,
  vehiculosOptions,
  empresasTransporte,
  setEmpresasTransporte,
  empresasTransporteOptions,
  empresasCliente,
  setEmpresasCliente,
  empresasClienteOptions,
  tiposSeleccionados,
  setTiposSeleccionados,
  tiposRutaOptions,
  handleBuscar
}) => {
  return (
    <div className="space-y-4">
      {/* Modo */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Modo de consulta</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={modo==='servicios'?'default':'outline'} 
            onClick={()=>setModo('servicios')}
            className={cn(isMobile ? "h-10" : "h-8")}
          >
            Por servicios
          </Button>
          <Button 
            variant={modo==='rango'?'default':'outline'} 
            onClick={()=>setModo('rango')}
            className={cn(isMobile ? "h-10" : "h-8")}
          >
            Por rango
          </Button>
        </div>
      </div>

      {/* Fechas */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Rango de fechas</Label>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Fecha/Hora inicio</Label>
            <Input 
              id="fecha-inicio"
              name="fecha-inicio"
              type="datetime-local" 
              value={desde} 
              onChange={(e)=>setDesde(e.target.value)}
              className={cn(isMobile ? "h-10" : "h-8")}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Fecha/Hora fin</Label>
            <Input 
              id="fecha-fin"
              name="fecha-fin"
              type="datetime-local" 
              value={hasta} 
              onChange={(e)=>setHasta(e.target.value)}
              className={cn(isMobile ? "h-10" : "h-8")}
            />
          </div>
        </div>
      </div>

      {/* Número servicio solo en servicios */}
      {modo==='servicios' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Número de servicio</Label>
          <Input 
            id="numero-servicio"
            name="numero-servicio"
            type="text" 
            inputMode="numeric" 
            placeholder="ID exacto" 
            value={numeroServicio} 
            onChange={(e)=>setNumeroServicio(e.target.value)}
            className={cn(isMobile ? "h-10" : "h-8")}
          />
        </div>
      )}

      {/* Vehículo */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Vehículo</Label>
        <MultiSelect
          options={vehiculosOptions}
          value={vehiculos}
          onValueChange={setVehiculos}
          placeholder="Seleccionar vehículos"
          searchPlaceholder="Buscar vehículo..."
        />
      </div>

      {/* Empresa transporte */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Empresa de transporte</Label>
        <MultiSelect
          options={empresasTransporteOptions}
          value={empresasTransporte}
          onValueChange={setEmpresasTransporte}
          placeholder="Seleccionar empresas"
          searchPlaceholder="Buscar empresa..."
        />
      </div>

      {/* Empresa cliente */}
      {(!tiposSeleccionados.includes('Parque') || tiposSeleccionados.includes('todos')) && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Empresa cliente</Label>
          <MultiSelect
            options={empresasClienteOptions}
            value={empresasCliente}
            onValueChange={setEmpresasCliente}
            placeholder="Seleccionar clientes"
            searchPlaceholder="Buscar cliente..."
          />
        </div>
      )}

      {/* Tipo ruta */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Tipo de ruta</Label>
        <MultiSelect
          options={tiposRutaOptions}
          value={tiposSeleccionados}
          onValueChange={setTiposSeleccionados}
          placeholder="Seleccionar tipos"
          searchPlaceholder="Buscar tipo..."
        />
      </div>

      {/* Botón buscar */}
      <div className="pt-4 pb-2">
        <Button 
          onClick={handleBuscar} 
          className={cn("w-full", isMobile ? "h-10" : "h-9")}
        >
          Buscar
        </Button>
      </div>
    </div>
  );
};

interface FilterPanelCardProps extends FilterPanelProps {}

export const FilterPanelCard: React.FC<FilterPanelCardProps> = (props) => {
  return (
    <Card className="w-64 lg:w-72 h-full border-r">
      <CardContent className="h-full p-0 flex flex-col">
        {/* Header fijo */}
        <div className="flex-none p-4 border-b bg-background">
          <h3 className="font-medium text-sm">Filtros de Búsqueda</h3>
        </div>
        
        {/* Contenido con scroll */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <FilterPanelContent {...props} />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanelContent;