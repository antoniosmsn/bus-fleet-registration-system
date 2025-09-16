import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileCheck, UserCheck, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useToast } from '@/hooks/use-toast';
import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';
import { mockSolicitudesDevolucionSaldo } from '@/data/mockSolicitudesDevolucionSaldo';

interface SolicitudPago {
  id?: string;
  tipoPago: string;
  fechaElaboracion: Date;
  fechaValor: Date;
  nombrePasajero: string;
  detalle: string;
  centroCosto: string;
  cuentaContable: string;
  monto: number;
  numeroDocumento: string;
  estado: 'borrador' | 'en_revision' | 'autorizado_df';
  realizadoPor: string;
  revisadoPor?: string;
  autorizadoPor?: string;
  fechaRealizacion: Date;
  fechaRevision?: Date;
  fechaAutorizacion?: Date;
}

export default function SolicitudPago() {
  const { numeroDevolucion } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [solicitud, setSolicitud] = useState<SolicitudDevolucionSaldo | null>(null);
  const [fechaElaboracion, setFechaElaboracion] = useState<Date>(new Date());
  const [fechaValor, setFechaValor] = useState<Date>(new Date());

  const [solicitudPago, setSolicitudPago] = useState<SolicitudPago>({
    tipoPago: 'transferencia',
    fechaElaboracion: new Date(),
    fechaValor: new Date(),
    nombrePasajero: '',
    detalle: '',
    centroCosto: 'Trans-01',
    cuentaContable: '602030201',
    monto: 0,
    numeroDocumento: '',
    estado: 'borrador',
    realizadoPor: 'Usuario Actual', // En producción sería el usuario autenticado
    fechaRealizacion: new Date()
  });

  // Cargar datos de la solicitud de devolución
  useEffect(() => {
    if (numeroDevolucion) {
      const solicitudEncontrada = mockSolicitudesDevolucionSaldo.find(
        s => s.numeroDevolucion === numeroDevolucion
      );
      
      if (solicitudEncontrada) {
        setSolicitud(solicitudEncontrada);
        setSolicitudPago(prev => ({
          ...prev,
          nombrePasajero: solicitudEncontrada.nombrePasajero,
          detalle: `Devolución de saldo pasajero: ${solicitudEncontrada.nombrePasajero}, cédula: ${solicitudEncontrada.cedulaPasajero}`,
          monto: solicitudEncontrada.monto
        }));
      }
    }
  }, [numeroDevolucion]);

  const handleInputChange = (field: keyof SolicitudPago, value: any) => {
    setSolicitudPago(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalizar = () => {
    // Validar campos obligatorios
    if (!solicitudPago.detalle || !solicitudPago.centroCosto || !solicitudPago.cuentaContable || !solicitudPago.monto) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Cambiar estado a en revisión
    setSolicitudPago(prev => ({ ...prev, estado: 'en_revision' }));

    toast({
      title: "Solicitud enviada",
      description: "La solicitud ha sido enviada para revisión. Se han enviado notificaciones por correo.",
    });

    // Aquí se implementaría la lógica para enviar notificaciones por correo
    console.log('Enviando notificaciones por correo para revisión');
  };

  const handleRevisar = () => {
    setSolicitudPago(prev => ({ 
      ...prev, 
      estado: 'en_revision',
      revisadoPor: 'Usuario Revisor',
      fechaRevision: new Date()
    }));

    toast({
      title: "Solicitud revisada",
      description: "La solicitud ha sido marcada como revisada y enviada para autorización.",
    });

    // Enviar notificación al director financiero
    console.log('Enviando notificación al Director Financiero');
  };

  const handleAutorizar = () => {
    setSolicitudPago(prev => ({ 
      ...prev, 
      estado: 'autorizado_df',
      autorizadoPor: 'Director Financiero',
      fechaAutorizacion: new Date()
    }));

    toast({
      title: "Solicitud autorizada",
      description: "La solicitud ha sido autorizada por el Director Financiero.",
    });
  };

  const handleGenerarExcel = () => {
    toast({
      title: "Generando Excel",
      description: "Se está generando el documento Excel con la solicitud de pago.",
    });
    // Aquí se implementaría la lógica para generar el Excel
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const getEstadoBadge = () => {
    switch (solicitudPago.estado) {
      case 'borrador':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'en_revision':
        return <Badge variant="default">En Revisión</Badge>;
      case 'autorizado_df':
        return <Badge variant="outline">Autorizado DF</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  if (!solicitud) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/servicios/saldo')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Solicitud de Pago</h1>
              <p className="text-muted-foreground">Solicitud no encontrada</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/servicios/saldo')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Solicitud de Pago - {solicitud.numeroDevolucion}</h1>
              <p className="text-muted-foreground">Gestión de solicitud de pago</p>
            </div>
          </div>
          {getEstadoBadge()}
        </div>

        <div className="space-y-6">
          {/* Encabezado del Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tipoPago">Tipo de pago *</Label>
                  <Select 
                    value={solicitudPago.tipoPago} 
                    onValueChange={(value) => handleInputChange('tipoPago', value)}
                    disabled={solicitudPago.estado !== 'borrador'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha de elaboración *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                        disabled={solicitudPago.estado !== 'borrador'}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(fechaElaboracion, 'dd/MM/yyyy', { locale: es })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={fechaElaboracion}
                        onSelect={(date) => {
                          if (date) {
                            setFechaElaboracion(date);
                            handleInputChange('fechaElaboracion', date);
                          }
                        }}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Fecha valor *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                        disabled={solicitudPago.estado !== 'borrador'}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(fechaValor, 'dd/MM/yyyy', { locale: es })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={fechaValor}
                        onSelect={(date) => {
                          if (date) {
                            setFechaValor(date);
                            handleInputChange('fechaValor', date);
                          }
                        }}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="nombrePasajero">Girado a *</Label>
                <Input
                  id="nombrePasajero"
                  value={solicitudPago.nombrePasajero}
                  onChange={(e) => handleInputChange('nombrePasajero', e.target.value)}
                  placeholder="Nombre del pasajero"
                  maxLength={120}
                  disabled={solicitudPago.estado !== 'borrador'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sección de Detalles de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="detalle">Detalle (concepto) *</Label>
                <Textarea
                  id="detalle"
                  value={solicitudPago.detalle}
                  onChange={(e) => handleInputChange('detalle', e.target.value)}
                  placeholder="Concepto del pago"
                  maxLength={200}
                  rows={3}
                  disabled={solicitudPago.estado !== 'borrador'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centroCosto">Centro de costo *</Label>
                  <Input
                    id="centroCosto"
                    value={solicitudPago.centroCosto}
                    onChange={(e) => handleInputChange('centroCosto', e.target.value)}
                    placeholder="Centro de costo"
                    maxLength={50}
                    disabled={solicitudPago.estado !== 'borrador'}
                  />
                </div>

                <div>
                  <Label htmlFor="cuentaContable">Cuenta contable *</Label>
                  <Input
                    id="cuentaContable"
                    value={solicitudPago.cuentaContable}
                    onChange={(e) => handleInputChange('cuentaContable', e.target.value)}
                    placeholder="Cuenta contable"
                    maxLength={50}
                    disabled={solicitudPago.estado !== 'borrador'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monto">Monto *</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={solicitudPago.monto}
                    onChange={(e) => handleInputChange('monto', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    disabled={solicitudPago.estado !== 'borrador'}
                  />
                </div>

                <div>
                  <Label htmlFor="numeroDocumento">Número de documento</Label>
                  <Input
                    id="numeroDocumento"
                    value={solicitudPago.numeroDocumento}
                    onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                    placeholder="Número de documento"
                    disabled={solicitudPago.estado !== 'borrador'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Totales */}
          <Card>
            <CardHeader>
              <CardTitle>Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Total a pagar: {formatMonto(solicitudPago.monto)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Autorizaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Autorizaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Realizado por</Label>
                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">{solicitudPago.realizadoPor}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(solicitudPago.fechaRealizacion, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Revisado por</Label>
                  {solicitudPago.revisadoPor ? (
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium">{solicitudPago.revisadoPor}</div>
                      {solicitudPago.fechaRevision && (
                        <div className="text-sm text-muted-foreground">
                          {format(solicitudPago.fechaRevision, 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleRevisar}
                      disabled={solicitudPago.estado !== 'en_revision'}
                      className="w-full"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Revisar
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Autorizado por Director Financiero</Label>
                  {solicitudPago.autorizadoPor ? (
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium">{solicitudPago.autorizadoPor}</div>
                      {solicitudPago.fechaAutorizacion && (
                        <div className="text-sm text-muted-foreground">
                          {format(solicitudPago.fechaAutorizacion, 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleAutorizar}
                      disabled={!solicitudPago.revisadoPor || solicitudPago.estado === 'borrador'}
                      className="w-full"
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      Autorizar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Botones de acción */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleGenerarExcel}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Generar Excel
            </Button>

            <div className="space-x-2">
              {solicitudPago.estado === 'borrador' && (
                <Button onClick={handleFinalizar}>
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}