import { Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlantillaMatriz, PlantillaMatrizFilter } from '@/types/plantilla-matriz';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlantillasMatrizTableProps {
  plantillas: PlantillaMatriz[];
  filtros: PlantillaMatrizFilter;
  loading?: boolean;
  onEdit: (plantilla: PlantillaMatriz) => void;
  onToggleEstado: (plantilla: PlantillaMatriz) => void;
}

export function PlantillasMatrizTable({ 
  plantillas, 
  filtros, 
  loading = false,
  onEdit,
  onToggleEstado
}: PlantillasMatrizTableProps) {
  
  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm', { locale: es });
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
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (plantillas.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No se encontraron plantillas que coincidan con los criterios de búsqueda
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>  
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identificador</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plantillas.map((plantilla) => (
            <TableRow key={plantilla.id}>
              <TableCell className="font-mono">
                {highlightText(plantilla.identificador.toString(), filtros.identificador)}
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="font-medium">
                    {highlightText(plantilla.nombre, filtros.nombre)}
                  </div>
                  {plantilla.descripcion && (
                    <div className="text-sm text-muted-foreground">
                      {plantilla.descripcion}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant={plantilla.activa ? "default" : "secondary"}>
                  {plantilla.activa ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  {formatearFecha(plantilla.fechaCreacion)}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plantilla)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  
                  <Button
                    variant={plantilla.activa ? "destructive" : "default"}
                    size="sm"
                    onClick={() => onToggleEstado(plantilla)}
                    className="flex items-center gap-1"
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
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}