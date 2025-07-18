import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockTransportistas } from "@/data/mockTransportistas";

export interface BitacorasLectorasFilterData {
  fechaInicio: Date;
  fechaFin: Date;
  aplicarFiltroDescarga: boolean;
  fechaInicioDescarga: Date;
  fechaFinDescarga: Date;
  usuario: string;
  modulo: string;
  descripcion: string;
  serial: string;
  placaAutobus: string;
  idAutobus: string;
  empresaTransporte: string;
  datos: string;
  esHardware: string;
  mostrarContenidoCompleto: boolean;
}

interface BitacorasLectorasFilterProps {
  onFilter: (data: BitacorasLectorasFilterData) => void;
  isLoading?: boolean;
}

const modulosOptions = [
  { value: "todos", label: "Todos" },
  { value: "Dispositivo", label: "Dispositivo" },
  { value: "Sesión", label: "Sesión" },
  { value: "Configuración", label: "Configuración" },
  { value: "Sincronización", label: "Sincronización" },
  { value: "Ui", label: "Ui" },
  { value: "Mqtt", label: "Mqtt" },
  { value: "Servicio", label: "Servicio" },
  { value: "Escaneo", label: "Escaneo" },
  { value: "Licencia", label: "Licencia" }
];

const esHardwareOptions = [
  { value: "todos", label: "Todos" },
  { value: "si", label: "Sí" },
  { value: "no", label: "No" }
];

const transportistasOptions = [
  { value: "todos", label: "Todos" },
  ...mockTransportistas.map(t => ({
    value: t.id.toString(),
    label: t.nombre
  }))
];

export function BitacorasLectorasFilter({ onFilter, isLoading }: BitacorasLectorasFilterProps) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  const [fechaInicio, setFechaInicio] = useState<Date>(todayStart);
  const [fechaFin, setFechaFin] = useState<Date>(todayEnd);
  const [aplicarFiltroDescarga, setAplicarFiltroDescarga] = useState(false);
  const [fechaInicioDescarga, setFechaInicioDescarga] = useState<Date>(todayStart);
  const [fechaFinDescarga, setFechaFinDescarga] = useState<Date>(todayEnd);
  const [usuario, setUsuario] = useState("");
  const [modulo, setModulo] = useState("todos");
  const [descripcion, setDescripcion] = useState("");
  const [serial, setSerial] = useState("");
  const [placaAutobus, setPlacaAutobus] = useState("");
  const [idAutobus, setIdAutobus] = useState("");
  const [empresaTransporte, setEmpresaTransporte] = useState("todos");
  const [datos, setDatos] = useState("");
  const [esHardware, setEsHardware] = useState("todos");
  const [mostrarContenidoCompleto, setMostrarContenidoCompleto] = useState(false);

  const handleSubmit = () => {
    onFilter({
      fechaInicio,
      fechaFin,
      aplicarFiltroDescarga,
      fechaInicioDescarga,
      fechaFinDescarga,
      usuario,
      modulo,
      descripcion,
      serial,
      placaAutobus,
      idAutobus,
      empresaTransporte,
      datos,
      esHardware,
      mostrarContenidoCompleto
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fechas" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fechas">Fechas</TabsTrigger>
            <TabsTrigger value="identificacion">Identificación</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value="fechas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fechaInicio"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={(date) => date && setFechaInicio(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fechaFin"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaFin && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? format(fechaFin, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={(date) => date && setFechaFin(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aplicarFiltroDescarga"
                  checked={aplicarFiltroDescarga}
                  onCheckedChange={(checked) => setAplicarFiltroDescarga(checked as boolean)}
                />
                <Label htmlFor="aplicarFiltroDescarga">Aplicar filtro por fecha de descarga</Label>
              </div>

              {aplicarFiltroDescarga && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicioDescarga">Fecha inicio descarga</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="fechaInicioDescarga"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fechaInicioDescarga && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaInicioDescarga ? format(fechaInicioDescarga, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fechaInicioDescarga}
                          onSelect={(date) => date && setFechaInicioDescarga(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaFinDescarga">Fecha fin descarga</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="fechaFinDescarga"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fechaFinDescarga && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaFinDescarga ? format(fechaFinDescarga, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fechaFinDescarga}
                          onSelect={(date) => date && setFechaFinDescarga(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="identificacion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  placeholder="Búsqueda parcial..."
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value.slice(0, 200))}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial">Serial</Label>
                <Input
                  id="serial"
                  placeholder="Búsqueda parcial..."
                  value={serial}
                  onChange={(e) => setSerial(e.target.value.slice(0, 200))}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placaAutobus">Autobús (placa)</Label>
                <Input
                  id="placaAutobus"
                  placeholder="Búsqueda parcial..."
                  value={placaAutobus}
                  onChange={(e) => setPlacaAutobus(e.target.value.slice(0, 200))}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idAutobus">Id del autobús</Label>
                <Input
                  id="idAutobus"
                  type="number"
                  placeholder="Coincidencia exacta..."
                  value={idAutobus}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 9999999999)) {
                      setIdAutobus(value);
                    }
                  }}
                  max={9999999999}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="empresas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modulo">Módulo</Label>
                <Combobox
                  options={modulosOptions}
                  value={modulo}
                  onValueChange={setModulo}
                  placeholder="Seleccionar módulo..."
                  searchPlaceholder="Buscar módulo..."
                  emptyText="No se encontraron módulos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresaTransporte">Empresa de transporte</Label>
                <Combobox
                  options={transportistasOptions}
                  value={empresaTransporte}
                  onValueChange={setEmpresaTransporte}
                  placeholder="Seleccionar empresa..."
                  searchPlaceholder="Buscar empresa..."
                  emptyText="No se encontraron empresas"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contenido" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Búsqueda parcial..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value.slice(0, 500))}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datos">Datos</Label>
                <Input
                  id="datos"
                  placeholder="Búsqueda parcial..."
                  value={datos}
                  onChange={(e) => setDatos(e.target.value.slice(0, 500))}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="esHardware">Es hardware</Label>
                <Combobox
                  options={esHardwareOptions}
                  value={esHardware}
                  onValueChange={setEsHardware}
                  placeholder="Seleccionar..."
                  searchPlaceholder="Buscar..."
                  emptyText="No se encontraron opciones"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mostrarContenidoCompleto"
                  checked={mostrarContenidoCompleto}
                  onCheckedChange={(checked) => setMostrarContenidoCompleto(checked as boolean)}
                />
                <Label htmlFor="mostrarContenidoCompleto">Mostrar contenido completo de campo Datos</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading} className="min-w-[120px]">
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}