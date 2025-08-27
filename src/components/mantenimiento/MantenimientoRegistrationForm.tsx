
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
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

interface MantenimientoRegistrationFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function MantenimientoRegistrationForm({
  onSubmit,
  onCancel,
  isSubmitting
}: MantenimientoRegistrationFormProps) {
  // Simulación de permisos del usuario
  const [isTransportistaUser] = useState(false); // En implementación real, obtener del contexto
  const [userTransportistaId] = useState<string | undefined>(undefined);

  const [openTransportista, setOpenTransportista] = useState(false);
  const [openPlaca, setOpenPlaca] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [placaBusqueda, setPlacaBusqueda] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaMantenimiento: undefined,
      transportistaId: isTransportistaUser ? userTransportistaId : '',
      placaId: '',
      categoriaId: '',
      detalle: '',
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
  const filteredAutobuses = availableAutobuses.filter(bus => {
    if (placaBusqueda.length < 2) return true;
    return bus.placa.toLowerCase().includes(placaBusqueda.toLowerCase());
  });

  // Solo categorías activas
  const activeCategories = mockCategoriasMantenimiento.filter(cat => cat.activo);

  const handleSubmit = (data: FormData) => {
    // Verificar duplicados (simulación)
    const isDuplicate = false; // En implementación real, verificar en BD
    
    if (isDuplicate) {
      toast({
        title: "Registro duplicado",
        description: "Ya existe un mantenimiento con los mismos datos",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data);
  };

  const handleReset = () => {
    form.reset();
    setPlacaBusqueda('');
  };

  useEffect(() => {
    // Limpiar placa cuando cambia transportista
    if (watchTransportista) {
      form.setValue('placaId', '');
    }
  }, [watchTransportista, form]);

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
                        variant="outline"
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
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isTransportistaUser}
                      >
                        {field.value
                          ? availableTransportistas.find(t => t.id === field.value)?.nombre
                          : "Seleccionar transportista"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ zIndex: 999999 }}>
                    <Command>
                      <CommandInput placeholder="Buscar transportista..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron transportistas.</CommandEmpty>
                        <CommandGroup>
                          {availableTransportistas.map((transportista) => (
                            <CommandItem
                              key={transportista.id}
                              value={transportista.id}
                              onSelect={() => {
                                field.onChange(transportista.id);
                                setOpenTransportista(false);
                              }}
                            >
                              {transportista.nombre}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placa del Autobús */}
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
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!watchTransportista}
                      >
                        {field.value
                          ? availableAutobuses.find(a => a.id.toString() === field.value)?.placa
                          : watchTransportista 
                            ? "Seleccionar autobús"
                            : "Primero seleccione transportista"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ zIndex: 999999 }}>
                    <Command>
                      <CommandInput 
                        placeholder="Buscar por placa (min. 2 caracteres)..."
                        value={placaBusqueda}
                        onValueChange={setPlacaBusqueda}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {placaBusqueda.length < 2 
                            ? "Escriba al menos 2 caracteres para buscar"
                            : "No se encontraron autobuses"}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredAutobuses.map((autobus) => (
                            <CommandItem
                              key={autobus.id}
                              value={autobus.id.toString()}
                              onSelect={() => {
                                field.onChange(autobus.id.toString());
                                setOpenPlaca(false);
                                setPlacaBusqueda('');
                              }}
                            >
                              {autobus.placa}
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
                <FormLabel>Categoría *</FormLabel>
                <Popover open={openCategoria} onOpenChange={setOpenCategoria}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? activeCategories.find(c => c.id === field.value)?.nombre
                          : "Seleccionar categoría"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ zIndex: 999999 }}>
                    <Command>
                      <CommandInput placeholder="Buscar categoría..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                        <CommandGroup>
                          {activeCategories.map((categoria) => (
                            <CommandItem
                              key={categoria.id}
                              value={categoria.id}
                              onSelect={() => {
                                field.onChange(categoria.id);
                                setOpenCategoria(false);
                              }}
                            >
                              {categoria.nombre}
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
        </div>

        {/* Detalle del Mantenimiento */}
        <FormField
          control={form.control}
          name="detalle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalle del Mantenimiento *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describa detalladamente el mantenimiento realizado..."
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
              </FormControl>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Mínimo 10 caracteres, máximo 500</span>
                <span>{field.value?.length || 0}/500</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? "Guardando..." : "Guardar Mantenimiento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
