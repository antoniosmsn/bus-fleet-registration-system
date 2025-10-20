import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { SondeoRuta } from "@/types/sondeo-ruta";
import { format } from "date-fns";
import { mockTurnos } from "@/data/mockTurnos";

interface SondeosRutasTableProps {
  sondeos: SondeoRuta[];
  onView: (sondeo: SondeoRuta) => void;
  onEdit: (sondeo: SondeoRuta) => void;
}

export const SondeosRutasTable = ({ sondeos, onView, onEdit }: SondeosRutasTableProps) => {
  const getEstadoBadgeVariant = (estado: SondeoRuta['estado']) => {
    switch (estado) {
      case 'publicado':
        return 'default';
      case 'borrador':
        return 'secondary';
      case 'finalizado':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTurnoNombre = (turnoId: string) => {
    return mockTurnos.find(t => t.id === turnoId)?.nombre || turnoId;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Tipo Trazado</TableHead>
            <TableHead>Turnos</TableHead>
            <TableHead>Radio (km)</TableHead>
            <TableHead>Pasajeros Elegibles</TableHead>
            <TableHead>Fecha Publicación</TableHead>
            <TableHead>Creado Por</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sondeos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No se encontraron sondeos
              </TableCell>
            </TableRow>
          ) : (
            sondeos.map((sondeo) => (
              <TableRow key={sondeo.id}>
                <TableCell className="font-medium">{sondeo.tituloEs}</TableCell>
                <TableCell>
                  <Badge variant={getEstadoBadgeVariant(sondeo.estado)}>
                    {sondeo.estado.charAt(0).toUpperCase() + sondeo.estado.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sondeo.tipoTrazado === 'dibujado' ? 'Dibujado' : 'Ruta Existente'}
                </TableCell>
                <TableCell>
                  {sondeo.turnosObjetivo.map(id => getTurnoNombre(id)).join(', ')}
                </TableCell>
                <TableCell className="text-center">{sondeo.radioKm}</TableCell>
                <TableCell className="text-center">{sondeo.pasajerosElegibles}</TableCell>
                <TableCell>
                  {format(new Date(sondeo.fechaPublicacion), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>{sondeo.usuarioCreacion}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(sondeo)}
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {sondeo.estado === 'borrador' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(sondeo)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
