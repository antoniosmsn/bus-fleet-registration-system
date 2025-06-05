
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Search } from 'lucide-react';
import { FiltrosProgramacion } from '@/types/programacion-parametros';

interface FiltrosProgramacionProps {
  filtros: FiltrosProgramacion;
  setFiltros: (filtros: FiltrosProgramacion) => void;
  onBuscar: () => void;
}

// Lista de empresas de transporte de ejemplo
const empresasTransporte = [
  { value: 'Transportes A', label: 'Transportes A' },
  { value: 'Transportes B', label: 'Transportes B' },
  { value: 'Transportes C', label: 'Transportes C' },
  { value: 'Transportes D', label: 'Transportes D' },
  { value: 'Transportes E', label: 'Transportes E' },
];

const FiltrosProgramacionComponent: React.FC<FiltrosProgramacionProps> = ({
  filtros,
  setFiltros,
  onBuscar
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="empresaTransporte">Empresa de transporte</Label>
            <Combobox
              options={empresasTransporte}
              value={filtros.empresaTransporte}
              onValueChange={(value) => setFiltros({ ...filtros, empresaTransporte: value })}
              placeholder="Seleccionar empresa"
              searchPlaceholder="Buscar empresa..."
              emptyText="No se encontró la empresa"
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

          <div>
            <Button onClick={onBuscar}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltrosProgramacionComponent;
