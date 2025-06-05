
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { FiltrosProgramacion } from '@/types/programacion-parametros';

interface FiltrosProgramacionProps {
  filtros: FiltrosProgramacion;
  setFiltros: (filtros: FiltrosProgramacion) => void;
  onBuscar: () => void;
}

const FiltrosProgramacionComponent: React.FC<FiltrosProgramacionProps> = ({
  filtros,
  setFiltros,
  onBuscar
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="empresaTransporte">Empresa de transporte</Label>
            <Input
              id="empresaTransporte"
              placeholder="Buscar por empresa"
              value={filtros.empresaTransporte}
              onChange={(e) => setFiltros({ ...filtros, empresaTransporte: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placa">Placa</Label>
            <Input
              id="placa"
              placeholder="Buscar por placa"
              value={filtros.placa}
              onChange={(e) => setFiltros({ ...filtros, placa: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identificador">Identificador</Label>
            <Input
              id="identificador"
              placeholder="Buscar por identificador"
              value={filtros.identificador}
              onChange={(e) => setFiltros({ ...filtros, identificador: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onBuscar}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltrosProgramacionComponent;
