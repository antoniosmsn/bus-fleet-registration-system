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
            <Label htmlFor="horaInicio">Hora Inicio</Label>
            <div className="flex gap-2">
              <Select
                value={filtros.horaInicio ? filtros.horaInicio.split(':')[0] : ""}
                onValueChange={(hora) => {
                  const minutos = filtros.horaInicio ? filtros.horaInicio.split(':')[1] || '00' : '00';
                  handleInputChange('horaInicio', `${hora}:${minutos}`);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="self-center">:</span>
              <Select
                value={filtros.horaInicio ? filtros.horaInicio.split(':')[1] || '00' : ""}
                onValueChange={(minutos) => {
                  const hora = filtros.horaInicio ? filtros.horaInicio.split(':')[0] || '00' : '00';
                  handleInputChange('horaInicio', `${hora}:${minutos}`);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaFin">Hora Fin</Label>
            <div className="flex gap-2">
              <Select
                value={filtros.horaFin ? filtros.horaFin.split(':')[0] : ""}
                onValueChange={(hora) => {
                  const minutos = filtros.horaFin ? filtros.horaFin.split(':')[1] || '00' : '00';
                  handleInputChange('horaFin', `${hora}:${minutos}`);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="self-center">:</span>
              <Select
                value={filtros.horaFin ? filtros.horaFin.split(':')[1] || '00' : ""}
                onValueChange={(minutos) => {
                  const hora = filtros.horaFin ? filtros.horaFin.split(':')[0] || '00' : '00';
                  handleInputChange('horaFin', `${hora}:${minutos}`);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Label htmlFor="conductor">Nombres y Apellidos del Conductor</Label>
            <Input
              id="conductor"
              placeholder="Buscar por nombres y apellidos"
              value={filtros.conductor || ""}
              onChange={(e) => handleInputChange('conductor', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigoConductor">Código del Conductor</Label>
            <Input
              id="codigoConductor"
              placeholder="Buscar por código"
              value={filtros.codigoConductor || ""}
              onChange={(e) => handleInputChange('codigoConductor', e.target.value)}
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