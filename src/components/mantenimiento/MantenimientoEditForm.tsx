import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { mockCategoriasMantenimiento } from '@/data/mockMantenimientos';
import { mockTransportistas } from '@/data/mockTransportistas';
import { MantenimientoRecord } from '@/types/mantenimiento';
import { toast } from '@/hooks/use-toast';

// Mock de autobuses por transportista
const mockAutobuses = [
  { id: 1, placa: 'BUS-001', transportistaId: '1' },
  { id: 2, placa: 'BUS-002', transportistaId: '2' },
  { id: 3, placa: 'BUS-003', transportistaId: '1' },
  { id: 4, placa: 'BUS-004', transportistaId: '3' },
  { id: 5, placa: 'BUS-005', transportistaId: '4' },
  { id: 6, placa: 'BUS-006', transportistaId: '2' },
  { id: 7, placa: 'BUS-007', transportistaId: '5' },
  { id: 8, placa: 'BUS-008', transportistaId: '6' },
  { id: 9, placa: 'BUS-009', transportistaId: '1' },
  { id: 10, placa: 'BUS-010', transportistaId: '7' },
];

const formSchema = z.object({
  fechaMantenimiento: z.date({
    required_error: "La fecha de mantenimiento es obligatoria",
  }).refine((date) => date <= new Date(), {
    message: "La fecha no puede ser futura",
  }),
  transportistaId: z.string().min(1, "Debe seleccionar un transportista"),
  placaId: z.string().min(1, "Debe seleccionar un autobús"),
  categoriaId: z.string().min(1, "Debe seleccionar una categoría"),
  detalle: z.string()
    .min(10, "El detalle debe tener al menos 10 caracteres")
    .max(500, "El detalle no puede exceder 500 caracteres")
    .refine((value) => {
      // Validar que no contenga HTML/scripts
      const htmlRegex = /<[^>]*>/g;
      return !htmlRegex.test(value);
    }, {
      message: "El detalle no puede contener etiquetas HTML",
    }),
});

type FormData = z.infer<typeof formSchema>;

interface MantenimientoEditFormProps {
  mantenimiento: MantenimientoRecord;
  onSubmit: (data: FormData & { placa: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function MantenimientoEditForm({
  mantenimiento,
  onSubmit,
  onCancel,
  isSubmitting
}: MantenimientoEditFormProps) {
  // Simulación de permisos del usuario
  const [isTransportistaUser] = useState(false); // En implementación real, obtener del contexto
  const [userTransportistaId] = useState<string | undefined>(mantenimiento.transportista.id);

  const [openTransportista, setOpenTransportista] = useState(false);
  const [openPlaca, setOpenPlaca] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [placaBusqueda, setPlacaBusqueda] = useState('');

  // Encontrar los IDs correspondientes basándose en los datos del mantenimiento
  const currentBus = mockAutobuses.find(bus => bus.placa === mantenimiento.placa);
  const currentTransportistaId = mantenimiento.transportista.id;
  const currentCategoriaId = mantenimiento.categoria.id;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaMantenimiento: parseISO(mantenimiento.fechaMantenimiento),
      transportistaId: currentTransportistaId,
      placaId: currentBus?.id.toString() || '',
      categoriaId: currentCategoriaId,
      detalle: mantenimiento.detalle,
    },
  });

  const watchTransportista = form.watch('transportistaId');

  // Filtrar transportistas según permisos
  const availableTransportistas = isTransportistaUser 
    ? mockTransportistas.filter(t => t.id === userTransportistaId)
    : mockTransportistas;

  // Filtrar autobuses por transportista seleccionado
  const availableAutobuses = mockAutobuses.filter(bus => 
    bus.transportistaId === watchTransportista
  );

  // Filtrar autobuses por búsqueda (mínimo 2 caracteres)
  const filteredAutobuses = placaBusqueda.length >= 2 
    ? availableAutobuses.filter(bus => 
        bus.placa.toLowerCase().includes(placaBusqueda.toLowerCase())
      )
    : availableAutobuses;

  // Filtrar categorías activas, pero permitir mostrar la actual aunque esté inactiva
  const availableCategorias = mockCategoriasMantenimiento.filter(cat => 
    cat.activo || cat.id === currentCategoriaId
  );

  // Validar si la categoría actual está inactiva
  const currentCategoria = mockCategoriasMantenimiento.find(cat => cat.id === currentCategoriaId);
  const isCategoriaInactiva = currentCategoria && !currentCategoria.activo;

  // Resetear placa cuando cambie el transportista
  useEffect(() => {
    if (watchTransportista !== currentTransportistaId) {
      form.setValue('placaId', '');
      setPlacaBusqueda('');
    }
  }, [watchTransportista, form, currentTransportistaId]);

  const handleSubmit = (data: FormData) => {
    const selectedBus = mockAutobuses.find(bus => bus.id.toString() === data.placaId);
    if (!selectedBus) {
      toast({
        title: "Error",
        description: "Debe seleccionar un autobús válido",
        variant: "destructive",
      });
      return;
    }

    // Verificar que la categoría sea activa si se cambió
    if (data.categoriaId !== currentCategoriaId) {
      const selectedCategoria = mockCategoriasMantenimiento.find(cat => cat.id === data.categoriaId);
      if (!selectedCategoria?.activo) {
        toast({
          title: "Error",
          description: "Debe seleccionar una categoría activa",
          variant: "destructive",
        });
        return;
      }
    }

    onSubmit({
      ...data,
      placa: selectedBus.placa
    });
  };

  const handleReset = () => {
    form.reset({
      fechaMantenimiento: parseISO(mantenimiento.fechaMantenimiento),
      transportistaId: currentTransportistaId,
      placaId: currentBus?.id.toString() || '',
      categoriaId: currentCategoriaId,
      detalle: mantenimiento.detalle,
    });
    setPlacaBusqueda('');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha de Mantenimiento */}
          <FormField
            control={form.control}
            name="fechaMantenimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Mantenimiento *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transportista */}
          <FormField
            control={form.control}
            name="transportistaId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Transportista *</FormLabel>
                <Popover open={openTransportista} onOpenChange={setOpenTransportista}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTransportista}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isTransportistaUser} // Los usuarios de transportista no pueden cambiar
                      >
                        {field.value
                          ? availableTransportistas.find(t => t.id === field.value)?.nombre
                          : "Seleccionar transportista"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar transportista..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron transportistas.</CommandEmpty>
                        <CommandGroup>
                          {availableTransportistas.map((transportista) => (
                            <CommandItem
                              key={transportista.id}
                              value={transportista.nombre}
                              onSelect={() => {
                                form.setValue("transportistaId", transportista.id);
                                setOpenTransportista(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{transportista.nombre}</span>
                                <span className="text-sm text-muted-foreground">
                                  Código: {transportista.codigo}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Placa */}
          <FormField
            control={form.control}
            name="placaId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Placa del Autobús *</FormLabel>
                <Popover open={openPlaca} onOpenChange={setOpenPlaca}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPlaca}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!watchTransportista}
                      >
                        {field.value && watchTransportista
                          ? mockAutobuses.find(bus => bus.id.toString() === field.value)?.placa
                          : !watchTransportista 
                            ? "Seleccione primero un transportista"
                            : "Seleccionar placa"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar por placa..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron autobuses</CommandEmpty>
                        <CommandGroup>
                          {availableAutobuses.map((bus) => (
                            <CommandItem
                              key={bus.id}
                              value={bus.placa}
                              onSelect={() => {
                                form.setValue("placaId", bus.id.toString());
                                setOpenPlaca(false);
                              }}
                            >
                              {bus.placa}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoría */}
          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Categoría de Mantenimiento *</FormLabel>
                <Popover open={openCategoria} onOpenChange={setOpenCategoria}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCategoria}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? availableCategorias.find(cat => cat.id === field.value)?.nombre
                          : "Seleccionar categoría"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar categoría..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                        <CommandGroup>
                          {availableCategorias.map((categoria) => (
                            <CommandItem
                              key={categoria.id}
                              value={categoria.nombre}
                              onSelect={() => {
                                form.setValue("categoriaId", categoria.id);
                                setOpenCategoria(false);
                              }}
                              disabled={!categoria.activo && categoria.id !== currentCategoriaId}
                            >
                              <div className="flex flex-col">
                                <span className={cn(
                                  "font-medium",
                                  !categoria.activo && categoria.id !== currentCategoriaId && "text-muted-foreground"
                                )}>
                                  {categoria.nombre}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Código: {categoria.codigo}
                                  {!categoria.activo && categoria.id === currentCategoriaId && " (Inactiva - actual)"}
                                  {!categoria.activo && categoria.id !== currentCategoriaId && " (Inactiva)"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {isCategoriaInactiva && field.value === currentCategoriaId && (
                  <p className="text-sm text-amber-600">
                    Categoría actual inactiva. Seleccione una categoría activa para guardar cambios.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Detalle */}
        <FormField
          control={form.control}
          name="detalle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalle del Mantenimiento *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa los detalles del mantenimiento realizado..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <span className={cn(
                  "text-sm",
                  field.value?.length > 450 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {field.value?.length || 0}/500
                </span>
              </div>
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="sm:w-auto"
          >
            Cancelar
          </Button>
          
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:w-auto sm:ml-auto"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Actualizando...
              </>
            ) : (
              'Actualizar Mantenimiento'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}