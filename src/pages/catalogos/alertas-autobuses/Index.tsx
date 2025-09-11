import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { mockTiposAlertaAutobus } from "@/data/mockTiposAlertaAutobus";
import { TipoAlertaAutobus, AlertaAutobusFiltros } from "@/types/alerta-autobus";
import { Plus, Search, Edit, ChevronLeft, ChevronRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registrarTipoAlerta, registrarEdicionTipoAlerta, registrarActivacionTipoAlerta } from "@/services/bitacoraService";

const ITEMS_POR_PAGINA = 10;

export default function AlertasAutobusesIndex() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados
  const [tiposAlerta, setTiposAlerta] = useState<TipoAlertaAutobus[]>(mockTiposAlertaAutobus);
  const [filtros, setFiltros] = useState<AlertaAutobusFiltros>({
    nombre: "",
    alertType: "",
    estado: "todos"
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState<AlertaAutobusFiltros>({
    nombre: "",
    alertType: "",
    estado: "todos"
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoAlertaAutobus | null>(null);
  const [mostrarDialogoCambioEstado, setMostrarDialogoCambioEstado] = useState(false);

  // Datos filtrados
  const tiposFiltrados = useMemo(() => {
    return tiposAlerta
      .filter(tipo => {
        const cumpleNombre = tipo.nombre.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(filtrosAplicados.nombre.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""));
        
        const cumpleAlertType = tipo.alertType.toLowerCase()
          .includes(filtrosAplicados.alertType.toLowerCase());
        
        const cumpleEstado = filtrosAplicados.estado === "todos" || 
          (filtrosAplicados.estado === "activos" && tipo.activo) ||
          (filtrosAplicados.estado === "inactivos" && !tipo.activo);

        return cumpleNombre && cumpleAlertType && cumpleEstado;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [tiposAlerta, filtrosAplicados]);

  // Datos paginados
  const tiposPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return tiposFiltrados.slice(inicio, fin);
  }, [tiposFiltrados, paginaActual, itemsPorPagina]);

  const totalPaginas = Math.ceil(tiposFiltrados.length / itemsPorPagina);

  // Manejadores
  const aplicarFiltros = () => {
    setFiltrosAplicados({...filtros});
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = { nombre: "", alertType: "", estado: "todos" as const };
    setFiltros(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
    setPaginaActual(1);
  };

  const manejarCambioEstado = (tipo: TipoAlertaAutobus) => {
    setTipoSeleccionado(tipo);
    setMostrarDialogoCambioEstado(true);
  };

  const confirmarCambioEstado = () => {
    if (!tipoSeleccionado) return;

    const nuevoEstado = !tipoSeleccionado.activo;
    const tiposActualizados = tiposAlerta.map(tipo =>
      tipo.id === tipoSeleccionado.id
        ? { ...tipo, activo: nuevoEstado, fechaModificacion: new Date().toISOString() }
        : tipo
    );

    setTiposAlerta(tiposActualizados);
    registrarActivacionTipoAlerta(tipoSeleccionado, nuevoEstado);

    toast({
      title: "Estado actualizado",
      description: `El tipo de alerta ha sido ${nuevoEstado ? 'activado' : 'inactivado'} exitosamente.`,
      variant: "default"
    });

    setMostrarDialogoCambioEstado(false);
    setTipoSeleccionado(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/configuracion">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Alertas de Autobuses</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los tipos de alerta utilizados para eventos relacionados con autobuses
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={() => navigate('/catalogos/alertas-autobuses/register')}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo de Alerta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por Alert Type..."
                value={filtros.alertType}
                onChange={(e) => setFiltros(prev => ({ ...prev, alertType: e.target.value }))}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Tipos de Alerta de Autobuses ({tiposFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                 <tr className="border-b">
                   <th className="text-left p-4 font-semibold">Tipo de Alerta</th>
                   <th className="text-left p-4 font-semibold">Alert Type</th>
                   <th className="text-left p-4 font-semibold">Estado</th>
                   <th className="text-left p-4 font-semibold">Motivos</th>
                   <th className="text-right p-4 font-semibold">Acciones</th>
                 </tr>
              </thead>
              <tbody>
                {tiposPaginados.map((tipo) => (
                   <tr key={tipo.id} className="border-b hover:bg-muted/50">
                     <td className="p-4 font-medium">{tipo.nombre}</td>
                     <td className="p-4 text-muted-foreground">{tipo.alertType}</td>
                     <td className="p-4">
                       <Badge variant={tipo.activo ? "default" : "secondary"}>
                         {tipo.activo ? "Activo" : "Inactivo"}
                       </Badge>
                     </td>
                     <td className="p-4">
                       <span className="text-sm text-muted-foreground">
                         {tipo.motivos.length} motivo{tipo.motivos.length !== 1 ? 's' : ''}
                       </span>
                     </td>
                     <td className="p-4">
                       <div className="flex items-center justify-end space-x-2">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => navigate(`/catalogos/alertas-autobuses/edit/${tipo.id}`)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Switch
                           checked={tipo.activo}
                           onCheckedChange={() => manejarCambioEstado(tipo)}
                         />
                       </div>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
            {tiposPaginados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron tipos de alerta</p>
              </div>
            )}
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

      {/* Diálogo de confirmación */}
      <AlertDialog open={mostrarDialogoCambioEstado} onOpenChange={setMostrarDialogoCambioEstado}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              {tipoSeleccionado?.activo
                ? "¿Confirmas inactivar el tipo de alerta?"
                : "¿Confirmas activar el tipo de alerta?"
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarCambioEstado}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}