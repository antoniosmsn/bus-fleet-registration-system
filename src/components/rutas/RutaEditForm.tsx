
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Map } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RutaMap } from './RutaMap';

// Define los tipos de ruta disponibles
const tiposRuta = [
  { value: 'privada', label: 'Privada' },
  { value: 'parque', label: 'Parque' },
  { value: 'especial', label: 'Especial' },
];

// Mock data para paradas
const paradasDisponibles = [
  { id: '1', nombre: 'Parada Principal', lat: 9.932, lng: -84.079 },
  { id: '2', nombre: 'Terminal Norte', lat: 9.938, lng: -84.083 },
  { id: '3', nombre: 'Sector A', lat: 9.935, lng: -84.076 },
  { id: '4', nombre: 'Sector B', lat: 9.931, lng: -84.071 },
  { id: '5', nombre: 'Terminal Sur', lat: 9.928, lng: -84.080 },
];

// Mock data para geocercas
const geocercasDisponibles = [
  {
    id: '1',
    nombre: 'LLANO ARRIBA',
    vertices: [
      { lat: 9.935, lng: -84.105 },
      { lat: 9.932, lng: -84.100 },
      { lat: 9.930, lng: -84.103 },
    ],
    active: true
  },
  {
    id: '2',
    nombre: 'LLANO DE CONE',
    vertices: [
      { lat: 9.940, lng: -84.110 },
      { lat: 9.943, lng: -84.115 },
      { lat: 9.945, lng: -84.112 },
      { lat: 9.942, lng: -84.108 },
    ],
    active: true
  },
  {
    id: '3',
    nombre: 'PARQUE LOGÍSTICO NORTE',
    vertices: [
      { lat: 9.948, lng: -84.098 },
      { lat: 9.952, lng: -84.102 },
      { lat: 9.950, lng: -84.105 },
    ],
    active: true
  },
];

// Países
const paises = [
  { value: 'CR', label: 'Costa Rica' },
  { value: 'PA', label: 'Panamá' },
  { value: 'NI', label: 'Nicaragua' },
];

// Provincias de Costa Rica (mock)
const provinciasCR = [
  { value: 'SJ', label: 'San José' },
  { value: 'AL', label: 'Alajuela' },
  { value: 'CA', label: 'Cartago' },
  { value: 'HE', label: 'Heredia' },
];

// Cantones de San José (mock)
const cantonesSJ = [
  { value: 'SJ', label: 'San José' },
  { value: 'ES', label: 'Escazú' },
  { value: 'DE', label: 'Desamparados' },
  { value: 'GO', label: 'Goicoechea' },
];

// Distritos de San José (mock)
const distritosSJ = [
  { value: 'CA', label: 'Carmen' },
  { value: 'ME', label: 'Merced' },
  { value: 'HO', label: 'Hospital' },
  { value: 'CT', label: 'Catedral' },
];

// Sectores (mock)
const sectores = [
  { value: 'ZF', label: 'Zona Franca' },
  { value: 'PC', label: 'Parque Comercial' },
  { value: 'ZI', label: 'Zona Industrial' },
];

// Ramales (mock)
const ramales = [
  { value: 'R1', label: 'Ramal 1' },
  { value: 'R2', label: 'Ramal 2' },
  { value: 'R3', label: 'Ramal 3' },
];

// Define el esquema de validación para el formulario
const formSchema = z.object({
  pais: z.string({ required_error: 'El país es obligatorio' }),
  provincia: z.string({ required_error: 'La provincia es obligatoria' }),
  canton: z.string({ required_error: 'El cantón es obligatorio' }),
  distrito: z.string({ required_error: 'El distrito es obligatorio' }),
  sector: z.string({ required_error: 'El sector es obligatorio' }),
  ramal: z.string({ required_error: 'El ramal es obligatorio' }),
  tipoRuta: z.string({ required_error: 'El tipo de ruta es obligatorio' }),
  paradas: z.array(z.string()).min(2, 'Debe seleccionar al menos 2 paradas'),
  geocercas: z.array(z.string()).min(1, 'Debe seleccionar al menos una geocerca')
});

type FormValues = z.infer<typeof formSchema>;

interface RutaEditFormProps {
  rutaData: any;
}

const RutaEditForm: React.FC<RutaEditFormProps> = ({ rutaData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [paradasSeleccionadas, setParadasSeleccionadas] = useState<string[]>([]);
  const [geocercasSeleccionadas, setGeocercasSeleccionadas] = useState<string[]>([]);
  const [paradasOrdenadas, setParadasOrdenadas] = useState<any[]>([]);

  // Inicializar el formulario con los datos de la ruta
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pais: rutaData.pais === 'Costa Rica' ? 'CR' : '',
      provincia: 'SJ',
      canton: 'SJ',
      distrito: 'CA',
      sector: 'ZF',
      ramal: 'R1',
      tipoRuta: rutaData.tipoRuta || 'privada',
      paradas: [],
      geocercas: []
    }
  });

  // Cargar paradas y geocercas seleccionadas inicialmente
  useEffect(() => {
    if (rutaData.paradas && rutaData.paradas.length > 0) {
      const paradasIds = rutaData.paradas.map((p: any) => p.id);
      setParadasSeleccionadas(paradasIds);
      setParadasOrdenadas(rutaData.paradas);
    }

    if (rutaData.geocercas && rutaData.geocercas.length > 0) {
      const geocercasIds = rutaData.geocercas.map((g: any) => g.id);
      setGeocercasSeleccionadas(geocercasIds);
    }
  }, [rutaData]);

  // Actualizar paradas ordenadas cuando cambie la selección
  useEffect(() => {
    const paradas = paradasSeleccionadas.map(id => 
      paradasDisponibles.find(parada => parada.id === id)
    ).filter(Boolean);
    setParadasOrdenadas(paradas as any[]);
  }, [paradasSeleccionadas]);

  // Actualizar el formulario cuando cambian las selecciones
  useEffect(() => {
    form.setValue('paradas', paradasSeleccionadas);
  }, [paradasSeleccionadas, form]);

  useEffect(() => {
    form.setValue('geocercas', geocercasSeleccionadas);
  }, [geocercasSeleccionadas, form]);

  // Manejar el envío del formulario
  const onSubmit = (data: FormValues) => {
    if (paradasSeleccionadas.length < 2) {
      toast.error('Debe seleccionar al menos 2 paradas');
      return;
    }

    if (geocercasSeleccionadas.length < 1) {
      toast.error('Debe seleccionar al menos una geocerca');
      return;
    }

    // Construir la ruta con todos los datos actualizados
    const rutaActualizada = {
      id: rutaData.id,
      ...data,
      estado: rutaData.estado, // Mantener el estado actual de la ruta
      paradas: paradasOrdenadas,
      paradaInicial: paradasOrdenadas[0],
      paradaFinal: paradasOrdenadas[paradasOrdenadas.length - 1],
      geocercas: geocercasSeleccionadas.map(id => 
        geocercasDisponibles.find(geo => geo.id === id)
      ),
    };

    // En una aplicación real, aquí se enviaría a la API
    console.log('Ruta actualizada:', rutaActualizada);
    
    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario actualizó la ruta con ID:', rutaData.id);

    toast.success('Ruta actualizada correctamente');
    navigate('/rutas');
  };

  // Manejar selección de paradas
  const handleParadaToggle = (paradaId: string) => {
    setParadasSeleccionadas(prev => {
      const isSelected = prev.includes(paradaId);
      if (isSelected) {
        return prev.filter(id => id !== paradaId);
      } else {
        return [...prev, paradaId];
      }
    });
  };

  // Manejar selección de geocercas
  const handleGeocercaToggle = (geocercaId: string) => {
    setGeocercasSeleccionadas(prev => {
      const isSelected = prev.includes(geocercaId);
      if (isSelected) {
        return prev.filter(id => id !== geocercaId);
      } else {
        return [...prev, geocercaId];
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="mapa">Paradas</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Edite los datos generales de la ruta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primera fila: País, Provincia, Cantón */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="pais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">País</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paises.map((pais) => (
                              <SelectItem key={pais.value} value={pais.value}>
                                {pais.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Provincia</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinciasCR.map((provincia) => (
                              <SelectItem key={provincia.value} value={provincia.value}>
                                {provincia.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="canton"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Cantón</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cantón" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cantonesSJ.map((canton) => (
                              <SelectItem key={canton.value} value={canton.value}>
                                {canton.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Segunda fila: Distrito, Sector, Ramal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="distrito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Distrito</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar distrito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {distritosSJ.map((distrito) => (
                              <SelectItem key={distrito.value} value={distrito.value}>
                                {distrito.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Sector</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar sector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectores.map((sector) => (
                              <SelectItem key={sector.value} value={sector.value}>
                                {sector.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ramal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Ramal</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar ramal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ramales.map((ramal) => (
                              <SelectItem key={ramal.value} value={ramal.value}>
                                {ramal.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Tercera fila: Tipo de Ruta */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="tipoRuta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Tipo de Ruta</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo de ruta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposRuta.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/rutas')}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('mapa')}
                >
                  Continuar <Map className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="mapa">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Paradas</CardTitle>
                    <CardDescription>Editar las paradas asignadas a la ruta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Paradas Disponibles</h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {paradasDisponibles.map((parada) => (
                          <div
                            key={parada.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              paradasSeleccionadas.includes(parada.id) ? 'bg-primary/10' : 'hover:bg-muted'
                            }`}
                            onClick={() => handleParadaToggle(parada.id)}
                          >
                            <div className={`w-4 h-4 mr-2 rounded-full ${
                              paradasSeleccionadas.includes(parada.id) ? 'bg-primary' : 'border border-gray-400'
                            }`} />
                            <span>{parada.nombre}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="text-sm font-medium pt-4">Paradas Seleccionadas (Orden)</h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {paradasOrdenadas.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No hay paradas seleccionadas</p>
                        ) : (
                          paradasOrdenadas.map((parada, index) => (
                            <div
                              key={parada.id}
                              className="flex items-center justify-between p-2 rounded-md bg-muted"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                  {index + 1}
                                </div>
                                <span>{parada.nombre}</span>
                              </div>
                              {index === 0 && <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">Inicial</span>}
                              {index === paradasOrdenadas.length - 1 && <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Final</span>}
                            </div>
                          ))
                        )}
                      </div>
                      
                      <h3 className="text-sm font-medium pt-4">Geocercas</h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {geocercasDisponibles.map((geocerca) => (
                          <div
                            key={geocerca.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              geocercasSeleccionadas.includes(geocerca.id) ? 'bg-primary/10' : 'hover:bg-muted'
                            }`}
                            onClick={() => handleGeocercaToggle(geocerca.id)}
                          >
                            <div className={`w-4 h-4 mr-2 rounded-full ${
                              geocercasSeleccionadas.includes(geocerca.id) ? 'bg-primary' : 'border border-gray-400'
                            }`} />
                            <span>{geocerca.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setActiveTab('general')}
                    >
                      Anterior
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Mapa de Ruta</CardTitle>
                    <CardDescription>Visualización de paradas y geocercas</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[500px]">
                    <RutaMap 
                      paradas={paradasOrdenadas}
                      geocercas={geocercasDisponibles.filter(geo => 
                        geocercasSeleccionadas.includes(geo.id)
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default RutaEditForm;
