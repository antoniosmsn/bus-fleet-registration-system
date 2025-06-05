
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface GeocercasFilterProps {
  onFilterChange: (filters: { nombre: string }) => void;
}

const GeocercasFilter: React.FC<GeocercasFilterProps> = ({ onFilterChange }) => {
  const [nombreFilter, setNombreFilter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ nombre: nombreFilter });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-1">
            Nombre de Geocerca
          </label>
          <Input
            id="nombre"
            placeholder="Buscar por nombre"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
          />
        </div>
        <div className="flex items-end md:col-span-1">
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GeocercasFilter;
