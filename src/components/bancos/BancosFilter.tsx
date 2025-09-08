import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BancoFilter } from '@/types/banco';

interface BancosFilterProps {
  filtros: BancoFilter;
  onFiltrosChange: (filtros: BancoFilter) => void;
  loading?: boolean;
}

export function BancosFilter({ 
  filtros, 
  onFiltrosChange, 
  loading = false 
}: BancosFilterProps) {
  const [localFiltros, setLocalFiltros] = useState<BancoFilter>(filtros);

  const handleSearch = () => {
    onFiltrosChange(localFiltros);
  };

  const handleClear = () => {
    const newFiltros: BancoFilter = {};
    setLocalFiltros(newFiltros);
    onFiltrosChange(newFiltros);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
            Nombre
          </label>
          <Input
            id="nombre"
            placeholder="Buscar por nombre"
            value={localFiltros.nombre || ''}
            onChange={(e) => setLocalFiltros({ ...localFiltros, nombre: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}