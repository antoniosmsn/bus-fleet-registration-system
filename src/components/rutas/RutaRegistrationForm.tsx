import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, ChevronUp, ChevronDown, Plus, Trash2, Search, Eye } from 'lucide-react';
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
  { id: '1', codigo: 'PARA-001', nombre: 'Parada Principal', lat: 9.932, lng: -84.079 },
  { id: '2', codigo: 'PARA-002', nombre: 'Terminal Norte', lat: 9.938, lng: -84.083 },
  { id: '3', codigo: 'PARA-003', nombre: 'Sector A', lat: 9.935, lng: -84.076 },
  { id: '4', codigo: 'PARA-004', nombre: 'Sector B', lat: 9.931, lng: -84.071 },
  { id: '5', codigo: 'PARA-005', nombre: 'Terminal Sur', lat: 9.928, lng: -84.080 },
  { id: '6', codigo: 'PARA-006', nombre: 'Centro Comercial', lat: 9.925, lng: -84.085 },
  { id: '7', codigo: 'PARA-007', nombre: 'Universidad', lat: 9.940, lng: -84.070 },
];

// Mock data para geocercas
const geocercasDisponibles = [
  {
    id: '1',
    codigo: 'GEO-001',
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
    codigo: 'GEO-002',
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
    codigo: 'GEO-003',
    nombre: 'PARQUE LOGÍSTICO NORTE',
    vertices: [
      { lat: 9.948, lng: -84.098 },
      { lat: 9.952, lng: -84.102 },
      { lat: 9.950, lng: -84.105 },
    ],
    active: true
  },
  {
    id: '4',
    codigo: 'GEO-004',
    nombre: 'ZONA INDUSTRIAL',
    vertices: [
      { lat: 9.920, lng: -84.095 },
      { lat: 9.925, lng: -84.090 },
      { lat: 9.922, lng: -84.087 },
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
  sector: z.string()
    .min(1, 'El sector es obligatorio')
    .max(100, 'El sector no puede exceder 100 caracteres'),
  ramal: z.string()
    .min(1, 'El ramal es obligatorio')
    .max(100, 'El ramal no puede exceder 100 caracteres'),
  tipoRuta: z.string({ required_error: 'El tipo de ruta es obligatorio' }),
});

type FormValues = z.infer<typeof formSchema>;

const RutaRegistrationForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [paradasAsignadas, setParadasAsignadas] = useState<any[]>([]);
  const [geocercasAsignadas, setGeocercasAsignadas] = useState<any[]>([]);
  const [busquedaParadas, setBusquedaParadas] = useState('');
  const [busquedaGeocercas, setBusquedaGeocercas] = useState('');

  // Inicializar el formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pais: '',
      provincia: '',
      canton: '',
      distrito: '',
      sector: '',
      ramal: '',
      tipoRuta: '',
    }
  });

  // Filtrar paradas disponibles
  const paradasFiltradas = paradasDisponibles.filter(parada => 
    !paradasAsignadas.find(p => p.id === parada.id) &&
    (parada.nombre.toLowerCase().includes(busquedaParadas.toLowerCase()) ||
     parada.codigo.toLowerCase().includes(busquedaParadas.toLowerCase()))
  );

  // Filtrar geocercas disponibles
  const geocercasFiltradas = geocercasDisponibles.filter(geocerca => 
    !geocercasAsignadas.find(g => g.id === geocerca.id) &&
    (geocerca.nombre.toLowerCase().includes(busquedaGeocercas.toLowerCase()) ||
     geocerca.codigo.toLowerCase().includes(busquedaGeocercas.toLowerCase()))
  );

  // Funciones para manejar paradas
  const agregarParada = (parada: any) => {
    setParadasAsignadas(prev => [...prev, parada]);
  };

  const eliminarParada = (paradaId: string) => {
    setParadasAsignadas(prev => prev.filter(p => p.id !== paradaId));
  };

  const subirParada = (index: number) => {
    if (index > 0) {
      setParadasAsignadas(prev => {
        const newList = [...prev];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        return newList;
      });
    }
  };

  const bajarParada = (index: number) => {
    if (index < paradasAsignadas.length - 1) {
      setParadasAsignadas(prev => {
        const newList = [...prev];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        return newList;
      });
    }
  };

  // Funciones para manejar geocercas
  const agregarGeocerca = (geocerca: any) => {
    setGeocercasAsignadas(prev => [...prev, geocerca]);
  };

  const eliminarGeocerca = (geocercaId: string) => {
    setGeocercasAsignadas(prev => prev.filter(g => g.id !== geocercaId));
  };

  const subirGeocerca = (index: number) => {
    if (index > 0) {
      setGeocercasAsignadas(prev => {
        const newList = [...prev];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        return newList;
      });
    }
  };

  const bajarGeocerca = (index: number) => {
    if (index < geocercasAsignadas.length - 1) {
      setGeocercasAsignadas(prev => {
        const newList = [...prev];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        return newList;
      });
    }
  };

  const verGeocerca = (geocerca: any) => {
    // Abrir en Google Maps (placeholder)
    console.log('Visualizar geocerca en Google Maps:', geocerca);
    toast.info(`Visualizando geocerca: ${geocerca.nombre}`);
  };

  // Manejar el envío del formulario
  const onSubmit = (data: FormValues) => {
    // Validar que todos los campos estén completos
    if (!data.pais || !data.provincia || !data.canton || !data.distrito || 
        !data.sector || !data.ramal || !data.tipoRuta) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Validar al menos 2 paradas y 2 geocercas
    if (paradasAsignadas.length < 2) {
      toast.error('Debe agregar al menos 2 paradas');
      return;
    }

    if (geocercasAsignadas.length < 2) {
      toast.error('Debe agregar al menos 2 geocercas');
      return;
    }

    // Construir la ruta con todos los datos
    const nuevaRuta = {
      ...data,
      paradas: paradasAsignadas,
      paradaInicial: paradasAsignadas[0],
      paradaFinal: paradasAsignadas[paradasAsignadas.length - 1],
      geocercas: geocercasAsignadas,
      fechaRegistro: new Date().toISOString(),
    };

    // En una aplicación real, aquí se enviaría a la API
    console.log('Nueva ruta a registrar:', nuevaRuta);
    
    // Registrar en bitácora de auditoría
    const auditLog = {
      accion: 'Registro de ruta',
      usuario: 'Usuario actual', // En una app real, obtener del contexto
      fecha: new Date().toISOString(),
      datosIngresados: {
        ubicacion: `${data.pais}/${data.provincia}/${data.canton}/${data.distrito}`,
        sector: data.sector,
        ramal: data.ramal,
        tipoRuta: data.tipoRuta
      },
      nombresParadas: paradasAsignadas.map(p => p.nombre),
      nombresGeocercas: geocercasAsignadas.map(g => g.nombre)
    };
    
    console.log('Registro en bitácora de auditoría:', auditLog);

    // Mostrar mensaje de éxito
    toast.success('Ruta registrada correctamente');
    
    // Navegar de regreso al listado
    navigate('/rutas');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="paradas">Paradas</TabsTrigger>
            <TabsTrigger value="geocercas">Geocercas</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Ingrese los datos generales de la ruta</CardDescription>
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
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el sector"
                            maxLength={100}
                            {...field}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el ramal"
                            maxLength={100}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Tercera fila: Tipo de Ruta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/rutas')}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('paradas')}
                >
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="paradas">
            <Card>
              <CardHeader>
                <CardTitle>Asignación de Paradas</CardTitle>
                <CardDescription>Seleccione y ordene las paradas de la ruta (mínimo 2)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Paradas Lists */}
                  <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Paradas Asignadas (Izquierda) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Paradas Asignadas ({paradasAsignadas.length})</h3>
                      <div className="border rounded-lg p-4 min-h-[400px]">
                        {paradasAsignadas.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No hay paradas asignadas
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {paradasAsignadas.map((parada, index) => (
                              <div
                                key={parada.id}
                                className="flex items-center justify-between p-3 bg-muted rounded-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{parada.nombre}</p>
                                    <p className="text-sm text-muted-foreground">{parada.codigo}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => subirParada(index)}
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => bajarParada(index)}
                                    disabled={index === paradasAsignadas.length - 1}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => eliminarParada(parada.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Paradas Disponibles (Derecha) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Paradas Disponibles</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Buscar paradas..."
                          value={busquedaParadas}
                          onChange={(e) => setBusquedaParadas(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="border rounded-lg p-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                        <div className="space-y-2">
                          {paradasFiltradas.map((parada) => (
                            <div
                              key={parada.id}
                              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{parada.nombre}</p>
                                <p className="text-sm text-muted-foreground">{parada.codigo}</p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => agregarParada(parada)}
                                className="h-8"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                              </Button>
                            </div>
                          ))}
                          {paradasFiltradas.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              No se encontraron paradas disponibles
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Mapa de Ruta</h3>
                    <div className="border rounded-lg h-[500px]">
                      <RutaMap 
                        paradas={paradasAsignadas}
                        geocercas={geocercasAsignadas}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab('general')}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('geocercas')}
                >
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="geocercas">
            <Card>
              <CardHeader>
                <CardTitle>Asignación de Geocercas</CardTitle>
                <CardDescription>Seleccione las geocercas para la ruta (mínimo 2)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Geocercas Lists */}
                  <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Geocercas Asignadas (Izquierda) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Geocercas Asignadas ({geocercasAsignadas.length})</h3>
                      <div className="border rounded-lg p-4 min-h-[400px]">
                        {geocercasAsignadas.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No hay geocercas asignadas
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {geocercasAsignadas.map((geocerca, index) => (
                              <div
                                key={geocerca.id}
                                className="flex items-center justify-between p-3 bg-muted rounded-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{geocerca.nombre}</p>
                                    <p className="text-sm text-muted-foreground">{geocerca.codigo}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => verGeocerca(geocerca)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => subirGeocerca(index)}
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => bajarGeocerca(index)}
                                    disabled={index === geocercasAsignadas.length - 1}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => eliminarGeocerca(geocerca.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Geocercas Disponibles (Derecha) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Geocercas Disponibles</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Buscar geocercas..."
                          value={busquedaGeocercas}
                          onChange={(e) => setBusquedaGeocercas(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="border rounded-lg p-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                        <div className="space-y-2">
                          {geocercasFiltradas.map((geocerca) => (
                            <div
                              key={geocerca.id}
                              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{geocerca.nombre}</p>
                                <p className="text-sm text-muted-foreground">{geocerca.codigo}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => verGeocerca(geocerca)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => agregarGeocerca(geocerca)}
                                  className="h-8"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Agregar
                                </Button>
                              </div>
                            </div>
                          ))}
                          {geocercasFiltradas.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              No se encontraron geocercas disponibles
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Mapa de Ruta</h3>
                    <div className="border rounded-lg h-[500px]">
                      <RutaMap 
                        paradas={paradasAsignadas}
                        geocercas={geocercasAsignadas}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab('paradas')}
                >
                  Anterior
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default RutaRegistrationForm;
