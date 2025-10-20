import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { SondeoRutaFilter } from "@/types/sondeo-ruta";
import { mockTurnos } from "@/data/mockTurnos";

interface SondeosRutasFilterProps {
  filters: SondeoRutaFilter;
  onFilterChange: (filters: SondeoRutaFilter) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const SondeosRutasFilter = ({ filters, onFilterChange, onSearch, onClear }: SondeosRutasFilterProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="fechas">Fechas</TabsTrigger>
          </TabsList>

          {/* Tab General */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="usuarioCreacion">Usuario Creador</Label>
                <Input
                  id="usuarioCreacion"
                  placeholder="Buscar por usuario..."
                  value={filters.usuarioCreacion || ''}
                  onChange={(e) => onFilterChange({ ...filters, usuarioCreacion: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab Contenido */}
          <TabsContent value="contenido" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

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
            </div>
          </TabsContent>

          {/* Tab Fechas */}
          <TabsContent value="fechas" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </TabsContent>
        </Tabs>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-4">
          <Button onClick={onSearch} className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button onClick={onClear} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
