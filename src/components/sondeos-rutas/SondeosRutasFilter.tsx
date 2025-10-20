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
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Primera fila: Filtros de texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tituloEs">Título (Español)</Label>
              <Input
                id="tituloEs"
                placeholder="Buscar por título en español..."
                value={filters.tituloEs || ''}
                onChange={(e) => onFilterChange({ ...filters, tituloEs: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tituloEn">Título (inglés)</Label>
              <Input
                id="tituloEn"
                placeholder="Search by English title..."
                value={filters.tituloEn || ''}
                onChange={(e) => onFilterChange({ ...filters, tituloEn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuarioCreacion">Usuario Creador</Label>
              <Input
                id="usuarioCreacion"
                placeholder="Buscar por usuario..."
                value={filters.usuarioCreacion || ''}
                onChange={(e) => onFilterChange({ ...filters, usuarioCreacion: e.target.value })}
              />
            </div>
          </div>

          {/* Segunda fila: Mensajes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mensajeEs">Mensaje (Español)</Label>
              <Input
                id="mensajeEs"
                placeholder="Buscar por mensaje en español..."
                value={filters.mensajeEs || ''}
                onChange={(e) => onFilterChange({ ...filters, mensajeEs: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensajeEn">Mensaje (inglés)</Label>
              <Input
                id="mensajeEn"
                placeholder="Search by English message..."
                value={filters.mensajeEn || ''}
                onChange={(e) => onFilterChange({ ...filters, mensajeEn: e.target.value })}
              />
            </div>
          </div>

          {/* Tercera fila: Selectores y fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={filters.estado || 'publicado'}
                onValueChange={(value) => onFilterChange({ ...filters, estado: value as any })}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select
                value={filters.turnos?.[0] || 'todos'}
                onValueChange={(value) => onFilterChange({ ...filters, turnos: value === 'todos' ? [] : [value] })}
              >
                <SelectTrigger id="turno">
                  <SelectValue placeholder="Todos los turnos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los turnos</SelectItem>
                  {mockTurnos.map((turno) => (
                    <SelectItem key={turno.id} value={turno.id}>
                      {turno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaPublicacionStart">Fecha Inicio</Label>
              <Input
                id="fechaPublicacionStart"
                type="date"
                value={filters.fechaPublicacionStart || today}
                onChange={(e) => onFilterChange({ ...filters, fechaPublicacionStart: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaPublicacionEnd">Fecha Fin</Label>
              <Input
                id="fechaPublicacionEnd"
                type="date"
                value={filters.fechaPublicacionEnd || today}
                onChange={(e) => onFilterChange({ ...filters, fechaPublicacionEnd: e.target.value })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
