import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SondeoRutaFilter } from "@/types/sondeo-ruta";
import { mockTurnos } from "@/data/mockTurnos";

interface SondeosRutasFilterProps {
  filters: SondeoRutaFilter;
  onFilterChange: (filters: SondeoRutaFilter) => void;
}

export const SondeosRutasFilter = ({ filters, onFilterChange }: SondeosRutasFilterProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Buscar por título..."
              value={filters.titulo || ''}
              onChange={(e) => onFilterChange({ ...filters, titulo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filters.estado || 'todos'}
              onValueChange={(value) => onFilterChange({ ...filters, estado: value as any })}
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="turno">Turno</Label>
            <Select
              value={filters.turno || 'todos'}
              onValueChange={(value) => onFilterChange({ ...filters, turno: value === 'todos' ? '' : value })}
            >
              <SelectTrigger id="turno">
                <SelectValue placeholder="Todos los turnos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {mockTurnos.map((turno) => (
                  <SelectItem key={turno.id} value={turno.id}>
                    {turno.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaPublicacionStart">Fecha Publicación Desde</Label>
            <Input
              id="fechaPublicacionStart"
              type="date"
              value={filters.fechaPublicacionStart || ''}
              onChange={(e) => onFilterChange({ ...filters, fechaPublicacionStart: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
