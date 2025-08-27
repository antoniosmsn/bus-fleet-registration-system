import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { mockTiposAlertaPasajero } from '@/data/mockTiposAlertaPasajero';
import { TipoAlertaPasajero, AlertaPasajeroFiltros } from '@/types/alerta-pasajero';
import { registrarAcceso } from '@/services/bitacoraService';
import { useToast } from '@/hooks/use-toast';

export default function ListadoTiposAlertaPasajero() {
  const [tipos, setTipos] = useState<TipoAlertaPasajero[]>(mockTiposAlertaPasajero);
  const [filtros, setFiltros] = useState<AlertaPasajeroFiltros>({
    nombre: '',
    estado: 'todos'
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState<AlertaPasajeroFiltros>({
    nombre: '',
    estado: 'todos'
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [tipoParaCambioEstado, setTipoParaCambioEstado] = useState<TipoAlertaPasajero | null>(null);
  const [accionEstado, setAccionEstado] = useState<'activar' | 'inactivar'>('activar');
  const { toast } = useToast();

  useEffect(() => {
    registrarAcceso('CATALOGOS_ALERTAS_PASAJEROS');
  }, []);

  const tiposFiltrados = useMemo(() => {
    return tipos.filter(tipo => {
      const cumpleNombre = tipo.nombre.toLowerCase().includes(filtrosAplicados.nombre.toLowerCase());
      const cumpleEstado = filtrosAplicados.estado === 'todos' || 
        (filtrosAplicados.estado === 'activos' && tipo.activo) ||
        (filtrosAplicados.estado === 'inactivos' && !tipo.activo);
      
      return cumpleNombre && cumpleEstado;
    });
  }, [tipos, filtrosAplicados]);

  const tiposPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return tiposFiltrados.slice(inicio, inicio + itemsPorPagina);
  }, [tiposFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(tiposFiltrados.length / itemsPorPagina);

  // Reset página actual cuando cambian los filtros aplicados o tamaño de página
  useEffect(() => {
    setPaginaActual(1);
  }, [filtrosAplicados, itemsPorPagina]);

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtros);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = { nombre: '', estado: 'todos' as const };
    setFiltros(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
    setPaginaActual(1);
  };

  const manejarCambioEstado = (tipo: TipoAlertaPasajero, nuevoEstado: boolean) => {
    setTipoParaCambioEstado(tipo);
    setAccionEstado(nuevoEstado ? 'activar' : 'inactivar');
  };

  const confirmarCambioEstado = () => {
    if (!tipoParaCambioEstado) return;

    const nuevosEstado = accionEstado === 'activar';
    setTipos(prev => prev.map(tipo => 
      tipo.id === tipoParaCambioEstado.id 
        ? { ...tipo, activo: nuevosEstado, fechaModificacion: new Date().toISOString() }
        : tipo
    ));

    toast({
      title: "Estado actualizado",
      description: `Tipo de alerta ${accionEstado === 'activar' ? 'activado' : 'inactivado'} exitosamente`
    });

    setTipoParaCambioEstado(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to="/configuracion">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Catálogos de alertas de pasajeros</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4">
            <Button asChild>
              <Link to="/catalogos/alertas-pasajeros/registrar">
                <Plus className="h-4 w-4" />
                Nuevo tipo de alerta
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por tipo de alerta..."
                value={filtros.nombre}
                onChange={(e) => setFiltros(prev => ({ ...prev, nombre: e.target.value }))}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
              />
            </div>
            <Select 
              value={filtros.estado} 
              onValueChange={(value: 'todos' | 'activos' | 'inactivos') => 
                setFiltros(prev => ({ ...prev, estado: value }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activos">Activos</SelectItem>
                <SelectItem value="inactivos">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={aplicarFiltros}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
            <Button variant="outline" onClick={limpiarFiltros}>
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </Button>
          </div>

          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Tipo de alerta</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Motivos</th>
                    <th className="text-center p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPaginados.length > 0 ? (
                    tiposPaginados.map((tipo) => (
                      <tr key={tipo.id} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{tipo.nombre}</td>
                        <td className="p-4">
                          <Badge variant={tipo.activo ? "default" : "secondary"}>
                            {tipo.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {tipo.motivos.length} motivo{tipo.motivos.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/catalogos/alertas-pasajeros/editar/${tipo.id}`}>
                                <Edit className="h-4 w-4" />
                                Editar
                              </Link>
                            </Button>
                            <Switch
                              checked={tipo.activo}
                              onCheckedChange={(checked) => manejarCambioEstado(tipo, checked)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No se encontraron tipos de alerta
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Registros por página:</span>
              <Select
                value={itemsPorPagina.toString()}
                onValueChange={(value) => {
                  setItemsPorPagina(parseInt(value));
                  setPaginaActual(1);
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder={itemsPorPagina} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, tiposFiltrados.length)} de {tiposFiltrados.length} tipos de alerta
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    className={paginaActual <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {(() => {
                  const getPageNumbers = () => {
                    const pageNumbers = [];
                    const maxVisiblePages = 5;
                    
                    if (totalPaginas <= maxVisiblePages) {
                      for (let i = 1; i <= totalPaginas; i++) {
                        pageNumbers.push(i);
                      }
                    } else {
                      let startPage = Math.max(1, paginaActual - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPaginas, startPage + maxVisiblePages - 1);
                      
                      if (endPage === totalPaginas) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(i);
                      }
                    }
                    
                    return pageNumbers;
                  };

                  return getPageNumbers().map((pagina) => (
                    <PaginationItem key={pagina}>
                      <PaginationLink
                        onClick={() => setPaginaActual(pagina)}
                        isActive={pagina === paginaActual}
                        className="cursor-pointer"
                      >
                        {pagina}
                      </PaginationLink>
                    </PaginationItem>
                  ));
                })()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                    className={paginaActual >= totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!tipoParaCambioEstado} onOpenChange={() => setTipoParaCambioEstado(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Confirmas {accionEstado} el tipo de alerta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accionEstado === 'inactivar' 
                ? 'Al inactivar este tipo de alerta, no aparecerá como opción en los formularios.'
                : 'Al activar este tipo de alerta, volverá a estar disponible en los formularios.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarCambioEstado}>
              {accionEstado === 'activar' ? 'Activar' : 'Inactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}