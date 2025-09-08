import { FileText, MoreHorizontal, Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlantillaMatriz, PlantillaMatrizFilter } from '@/types/plantilla-matriz';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlantillasMatrizCardsProps {
  plantillas: PlantillaMatriz[];
  filtros: PlantillaMatrizFilter;
  loading?: boolean;
  onEdit: (plantilla: PlantillaMatriz) => void;
  onToggleEstado: (plantilla: PlantillaMatriz) => void;
}

export function PlantillasMatrizCards({ 
  plantillas, 
  filtros, 
  loading = false,
  onEdit,
  onToggleEstado
}: PlantillasMatrizCardsProps) {
  
  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const highlightText = (text: string, search?: string) => {
    if (!search || search.length < 2) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="h-48">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plantillas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No se encontraron plantillas</h3>
        <p className="text-muted-foreground">
          No hay plantillas que coincidan con los criterios de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {plantillas.map((plantilla) => (
        <Card 
          key={plantilla.id} 
          className="group hover:shadow-md transition-all duration-200 cursor-pointer h-48 flex flex-col"
          onClick={() => onEdit(plantilla)}
        >
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge 
                    variant={plantilla.activa ? "default" : "secondary"} 
                    className="text-xs mb-1"
                  >
                    {plantilla.activa ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {highlightText(plantilla.identificador.toString(), filtros.identificador)}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger 
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(plantilla);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEstado(plantilla);
                    }}
                    className="flex items-center gap-2"
                  >
                    {plantilla.activa ? (
                      <>
                        <PowerOff className="h-3 w-3" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3" />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {highlightText(plantilla.nombre, filtros.nombre)}
              </h4>
              {plantilla.descripcion && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {plantilla.descripcion}
                </p>
              )}
            </div>
            
            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Creado: {formatearFecha(plantilla.fechaCreacion)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}