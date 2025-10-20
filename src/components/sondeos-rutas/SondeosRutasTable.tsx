import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, BarChart3 } from "lucide-react";
import { SondeoRuta } from "@/types/sondeo-ruta";
import { format } from "date-fns";
import { mockTurnos } from "@/data/mockTurnos";

interface SondeosRutasTableProps {
  sondeos: SondeoRuta[];
  onViewEncuesta: (sondeo: SondeoRuta) => void;
  onViewResultados: (sondeo: SondeoRuta) => void;
}

export const SondeosRutasTable = ({ sondeos, onViewEncuesta, onViewResultados }: SondeosRutasTableProps) => {
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // TODO: Obtener idioma del usuario (por ahora se usa español por defecto)
  const userLanguage = 'es';

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Fecha Publicación</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead className="text-center">Destinatarios</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sondeos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No se encontraron resultados para los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              sondeos.map((sondeo) => {
                const titulo = userLanguage === 'es' ? sondeo.tituloEs : sondeo.tituloEn;
                const mensaje = userLanguage === 'es' ? sondeo.mensajeEs : sondeo.mensajeEn;
                const mensajeTruncado = truncateText(mensaje, 100);
                
                return (
                  <TableRow key={sondeo.id}>
                    <TableCell className="font-mono text-sm">{sondeo.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(sondeo.fechaPublicacion), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{sondeo.usuarioCreacion}</TableCell>
                    <TableCell className="font-medium">{titulo}</TableCell>
                    <TableCell className="max-w-md">
                      {mensaje.length > 100 ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{mensajeTruncado}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{mensaje}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span>{mensaje}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {sondeo.pasajerosElegibles}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewEncuesta(sondeo)}
                          title="Ver encuesta"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver encuesta
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewResultados(sondeo)}
                          title="Ver resultados"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Ver resultados
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};
