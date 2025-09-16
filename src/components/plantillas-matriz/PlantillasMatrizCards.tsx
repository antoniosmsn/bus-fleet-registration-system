import { FileText, MoreHorizontal, Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlantillaMatriz, PlantillaMatrizFilter } from '@/types/plantilla-matriz';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {plantillas.map((plantilla) => (
        <div 
          key={plantilla.id} 
          className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          onClick={() => onEdit(plantilla)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Ícono de PDF */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              </div>
              
              {/* Nombre de la plantilla */}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm text-foreground truncate mb-1">
                  {highlightText(plantilla.nombre, filtros.nombre)}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={plantilla.activa ? "default" : "secondary"} 
                    className="text-xs px-2 py-0.5"
                  >
                    {plantilla.activa ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Menú de 3 puntos */}
            <DropdownMenu>
              <DropdownMenuTrigger 
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Más opciones</span>
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
          
          {/* Información adicional */}
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">ID: {highlightText(plantilla.identificador.toString(), filtros.identificador)}</p>
            <p>Creado: {formatearFecha(plantilla.fechaCreacion)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}