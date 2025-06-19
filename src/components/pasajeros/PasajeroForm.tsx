import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MultiSelectZonasFrancas from './MultiSelectZonasFrancas';
import ResidenciaMap from './ResidenciaMap';

const pasajeroSchema = z.object({
  empresaCliente: z.string().min(1, 'La empresa cliente es requerida'),
  cedula: z.string().min(1, 'La cédula es requerida'),
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  primerApellido: z.string().min(1, 'El primer apellido es requerido'),
  segundoApellido: z.string().min(1, 'El segundo apellido es requerido'),
  correoElectronico: z.string().email('Debe ser un correo válido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  tipoPago: z.enum(['prepago', 'postpago']),
  empresaSubcontratista: z.string().optional(),
  tipoContrato: z.enum(['directo', 'indirecto']),
  planilla: z.enum(['bisemanal', 'contratista', 'mensual', 'quincenal', 'semanal']),
  limiteViajesSemana: z.union([z.literal(10), z.literal(12), z.literal(14), z.literal('sin_limite')]),
  limiteDiario: z.union([z.literal(2), z.literal('sin_limite')]),
  tipoSubsidio: z.enum(['por_monto', 'porcentual']),
  subsidioPorcentual: z.number().min(0).max(100),
  subsidioMonto: z.number().min(0),
  numeroEmpleadoInterno: z.string().optional(),
  badgeInterno: z.string().optional(),
  tagResidencia: z.string().optional(),
  zonasFrancas: z.array(z.string()).optional()
});

type PasajeroFormData = z.infer<typeof pasajeroSchema>;

const PasajeroForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('personal');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<PasajeroFormData>({
    resolver: zodResolver(pasajeroSchema),
    defaultValues: {
      tipoPago: 'postpago',
      tipoContrato: 'directo',
      planilla: 'mensual',
      limiteViajesSemana: 12,
      limiteDiario: 2,
      tipoSubsidio: 'porcentual',
      subsidioPorcentual: 0,
      subsidioMonto: 0,
      zonasFrancas: []
    }
  });

  const tipoSubsidio = watch('tipoSubsidio');

  const handleContinue = async (nextTab: string, fieldsToValidate: (keyof PasajeroFormData)[]) => {
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentTab(nextTab);
    }
  };

  const handleResidenciaPositionChange = (position: [number, number]) => {
    const locationString = `${position[0]},${position[1]}`;
    setValue('tagResidencia', locationString);
  };

  const getResidenciaPosition = (): [number, number] | undefined => {
    const tagResidencia = watch('tagResidencia');
    if (tagResidencia && tagResidencia.includes(',')) {
      const [lat, lng] = tagResidencia.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    return undefined;
  };

  const onSubmit = async (data: PasajeroFormData) => {
    try {
      console.log('Datos del formulario:', data);
      
      // Aquí se implementaría la lógica para guardar el pasajero
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      
      toast({
        title: "Pasajero creado",
        description: "El pasajero ha sido registrado exitosamente.",
      });
      
      navigate('/pasajeros');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al registrar el pasajero.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="pago">Pago y Contrato</TabsTrigger>
          <TabsTrigger value="subsidio">Subsidio</TabsTrigger>
          <TabsTrigger value="residencia">Residencia</TabsTrigger>
          <TabsTrigger value="adicional">Información Adicional</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div>
                <Label htmlFor="empresaCliente">Empresa Cliente *</Label>
                <Input
                  id="empresaCliente"
                  {...register('empresaCliente')}
                  placeholder="Ingrese la empresa cliente"
                />
                {errors.empresaCliente && (
                  <p className="text-sm text-red-500 mt-1">{errors.empresaCliente.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cedula">Número de Cédula o Dimex *</Label>
                <Input
                  id="cedula"
                  {...register('cedula')}
                  placeholder="Ingrese la cédula o Dimex"
                />
                {errors.cedula && (
                  <p className="text-sm text-red-500 mt-1">{errors.cedula.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  {...register('nombres')}
                  placeholder="Ingrese los nombres"
                />
                {errors.nombres && (
                  <p className="text-sm text-red-500 mt-1">{errors.nombres.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="primerApellido">Primer Apellido *</Label>
                <Input
                  id="primerApellido"
                  {...register('primerApellido')}
                  placeholder="Ingrese el primer apellido"
                />
                {errors.primerApellido && (
                  <p className="text-sm text-red-500 mt-1">{errors.primerApellido.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="segundoApellido">Segundo Apellido *</Label>
                <Input
                  id="segundoApellido"
                  {...register('segundoApellido')}
                  placeholder="Ingrese el segundo apellido"
                />
                {errors.segundoApellido && (
                  <p className="text-sm text-red-500 mt-1">{errors.segundoApellido.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="correoElectronico">Correo Electrónico *</Label>
                <Input
                  id="correoElectronico"
                  type="email"
                  {...register('correoElectronico')}
                  placeholder="ejemplo@correo.com"
                />
                {errors.correoElectronico && (
                  <p className="text-sm text-red-500 mt-1">{errors.correoElectronico.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="8888-8888"
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefono.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button 
              type="button" 
              onClick={() => handleContinue('pago', ['empresaCliente', 'cedula', 'nombres', 'primerApellido', 'segundoApellido', 'correoElectronico', 'telefono'])}
            >
              Continuar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="pago" className="mt-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>Tipo de Pago *</Label>
                <RadioGroup
                  value={watch('tipoPago')}
                  onValueChange={(value) => setValue('tipoPago', value as 'prepago' | 'postpago')}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prepago" id="prepago" />
                    <Label htmlFor="prepago">Prepago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="postpago" id="postpago" />
                    <Label htmlFor="postpago">Postpago</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empresaSubcontratista">Empresa Subcontratista</Label>
                  <Input
                    id="empresaSubcontratista"
                    {...register('empresaSubcontratista')}
                    placeholder="Ingrese la empresa subcontratista"
                  />
                </div>

                <div>
                  <Label>Tipo de Contrato *</Label>
                  <Select
                    value={watch('tipoContrato')}
                    onValueChange={(value) => setValue('tipoContrato', value as 'directo' | 'indirecto')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directo">Directo</SelectItem>
                      <SelectItem value="indirecto">Indirecto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Planilla *</Label>
                  <Select
                    value={watch('planilla')}
                    onValueChange={(value) => setValue('planilla', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bisemanal">Bisemanal</SelectItem>
                      <SelectItem value="contratista">Contratista</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Límite de Viajes por Semana *</Label>
                  <Select
                    value={watch('limiteViajesSemana')?.toString()}
                    onValueChange={(value) => setValue('limiteViajesSemana', value === 'sin_limite' ? 'sin_limite' : parseInt(value) as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="sin_limite">Sin límite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Límite Diario *</Label>
                  <Select
                    value={watch('limiteDiario')?.toString()}
                    onValueChange={(value) => setValue('limiteDiario', value === 'sin_limite' ? 'sin_limite' : parseInt(value) as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 viajes diarios</SelectItem>
                      <SelectItem value="sin_limite">Sin límite diario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => setCurrentTab('personal')}>
              Anterior
            </Button>
            <Button 
              type="button" 
              onClick={() => handleContinue('subsidio', ['tipoPago', 'tipoContrato', 'planilla', 'limiteViajesSemana', 'limiteDiario'])}
            >
              Continuar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="subsidio" className="mt-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>Tipo de Subsidio *</Label>
                <RadioGroup
                  value={watch('tipoSubsidio')}
                  onValueChange={(value) => setValue('tipoSubsidio', value as 'por_monto' | 'porcentual')}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="porcentual" id="porcentual" />
                    <Label htmlFor="porcentual">Porcentual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="por_monto" id="por_monto" />
                    <Label htmlFor="por_monto">Por Monto</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subsidioPorcentual">
                    Subsidio Porcentual {tipoSubsidio === 'porcentual' && '*'}
                  </Label>
                  <Input
                    id="subsidioPorcentual"
                    type="number"
                    min="0"
                    max="100"
                    {...register('subsidioPorcentual', { valueAsNumber: true })}
                    disabled={tipoSubsidio !== 'porcentual'}
                    placeholder="0-100"
                  />
                  {errors.subsidioPorcentual && (
                    <p className="text-sm text-red-500 mt-1">{errors.subsidioPorcentual.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subsidioMonto">
                    Subsidio por Monto {tipoSubsidio === 'por_monto' && '*'}
                  </Label>
                  <Input
                    id="subsidioMonto"
                    type="number"
                    min="0"
                    {...register('subsidioMonto', { valueAsNumber: true })}
                    disabled={tipoSubsidio !== 'por_monto'}
                    placeholder="0.00"
                  />
                  {errors.subsidioMonto && (
                    <p className="text-sm text-red-500 mt-1">{errors.subsidioMonto.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => setCurrentTab('pago')}>
              Anterior
            </Button>
            <Button 
              type="button" 
              onClick={() => handleContinue('adicional', ['tipoSubsidio', 'subsidioPorcentual', 'subsidioMonto'])}
            >
              Continuar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="residencia" className="mt-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>Ubicación de Residencia</Label>
                <ResidenciaMap
                  position={getResidenciaPosition()}
                  onPositionChange={handleResidenciaPositionChange}
                />
                {watch('tagResidencia') && (
                  <p className="text-sm text-gray-600 mt-2">
                    Coordenadas: {watch('tagResidencia')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => setCurrentTab('subsidio')}>
              Anterior
            </Button>
            <Button 
              type="button" 
              onClick={() => handleContinue('adicional', [])}
            >
              Continuar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="adicional" className="mt-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numeroEmpleadoInterno">Número de Empleado Interno</Label>
                  <Input
                    id="numeroEmpleadoInterno"
                    {...register('numeroEmpleadoInterno')}
                    placeholder="Ingrese el número de empleado"
                  />
                </div>

                <div>
                  <Label htmlFor="badgeInterno">Badge Interno</Label>
                  <Input
                    id="badgeInterno"
                    {...register('badgeInterno')}
                    placeholder="Ingrese el badge interno"
                  />
                </div>
              </div>

              <div>
                <Label>Zonas Francas</Label>
                <MultiSelectZonasFrancas
                  value={watch('zonasFrancas') || []}
                  onChange={(value) => setValue('zonasFrancas', value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => setCurrentTab('residencia')}>
              Anterior
            </Button>
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/pasajeros')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Pasajero'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default PasajeroForm;
