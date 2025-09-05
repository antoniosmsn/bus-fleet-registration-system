import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTiposAlertaAutobus } from "@/data/mockTiposAlertaAutobus";
import { TipoAlertaAutobus, AlertaAutobusFiltros } from "@/types/alerta-autobus";
import { Plus, Search, Edit, ChevronLeft, ChevronRight } from "lucide-react";
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
    estado: "todos"
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState<AlertaAutobusFiltros>({
    nombre: "",
    estado: "todos"
  });
  const [paginaActual, setPaginaActual] = useState(1);
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
        
        const cumpleEstado = filtrosAplicados.estado === "todos" || 
          (filtrosAplicados.estado === "activos" && tipo.activo) ||
          (filtrosAplicados.estado === "inactivos" && !tipo.activo);

        return cumpleNombre && cumpleEstado;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [tiposAlerta, filtrosAplicados]);

  // Datos paginados
  const tiposPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    return tiposFiltrados.slice(inicio, fin);
  }, [tiposFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(tiposFiltrados.length / ITEMS_POR_PAGINA);

  // Manejadores
  const aplicarFiltros = () => {
    setFiltrosAplicados({...filtros});
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = { nombre: "", estado: "todos" as const };
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Alertas de Autobuses</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los tipos de alerta utilizados para eventos relacionados con autobuses
          </p>
        </div>
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por tipo de alerta..."
                  value={filtros.nombre}
                  onChange={(e) => setFiltros(prev => ({ ...prev, nombre: e.target.value }))}
                  className="flex-1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={filtros.estado}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activos">Activos</SelectItem>
                    <SelectItem value="inactivos">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={aplicarFiltros}>
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </div>
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
                  <th className="text-left p-4 font-semibold">Estado</th>
                  <th className="text-right p-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiposPaginados.map((tipo) => (
                  <tr key={tipo.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{tipo.nombre}</td>
                    <td className="p-4">
                      <Badge variant={tipo.activo ? "default" : "secondary"}>
                        {tipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
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

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {((paginaActual - 1) * ITEMS_POR_PAGINA) + 1} - {Math.min(paginaActual * ITEMS_POR_PAGINA, tiposFiltrados.length)} de {tiposFiltrados.length} registros
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                    <Button
                      key={pagina}
                      variant={paginaActual === pagina ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaginaActual(pagina)}
                      className="w-8 h-8 p-0"
                    >
                      {pagina}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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