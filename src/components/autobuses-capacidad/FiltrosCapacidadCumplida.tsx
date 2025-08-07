import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FiltrosCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { mockTransportistas } from "@/data/mockTransportistas";
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
      [field]: value === 'all' ? undefined : (value || undefined)
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
            <Select
              value={filtros.empresaTransporte || "all"}
              onValueChange={(value) => handleInputChange('empresaTransporte', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las empresas</SelectItem>
                {mockTransportistas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.nombre}>
                    {empresa.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idAutobus">ID del Autobús</Label>
            <Input
              id="idAutobus"
              placeholder="Buscar por ID"
              value={filtros.idAutobus || ""}
              onChange={(e) => handleInputChange('idAutobus', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placa">Placa</Label>
            <Input
              id="placa"
              placeholder="Buscar por placa"
              value={filtros.placa || ""}
              onChange={(e) => handleInputChange('placa', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={filtros.fechaInicio || ""}
              onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <Input
              id="fechaFin"
              type="date"
              value={filtros.fechaFin || ""}
              onChange={(e) => handleInputChange('fechaFin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruta">Ruta</Label>
            <Input
              id="ruta"
              placeholder="Buscar por ruta"
              value={filtros.ruta || ""}
              onChange={(e) => handleInputChange('ruta', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conductor">Conductor</Label>
            <Input
              id="conductor"
              placeholder="Buscar por conductor"
              value={filtros.conductor || ""}
              onChange={(e) => handleInputChange('conductor', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={onLimpiarFiltros}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltrosCapacidadCumplida;