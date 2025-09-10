import { useState } from 'react';
import { AlertTriangle, CheckCircle, Download, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DetalleConciliacionSinpe, ResumenCargue } from '@/types/recarga-sinpe';
import { useToast } from '@/hooks/use-toast';

interface Props {
  detalles: DetalleConciliacionSinpe[];
  nombreArchivo: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (detalles: DetalleConciliacionSinpe[]) => Promise<ResumenCargue>;
}

export default function ModalCargarCreditos({ detalles, nombreArchivo, isOpen, onClose, onConfirmar }: Props) {
  const [cargando, setCargando] = useState(false);
  const [resumen, setResumen] = useState<ResumenCargue | null>(null);
  const { toast } = useToast();

  // Simular duplicados (algunos registros ya existentes)
  const duplicados = detalles.filter(d => d.cedula === '118520147'); // Simular que Ana María ya tiene cargue
  const procesables = detalles.filter(d => d.cedula !== '118520147');

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(monto);
  };

  const handleConfirmar = async () => {
    setCargando(true);
    try {
      const resultado = await onConfirmar(procesables);
      setResumen(resultado);
      
      toast({
        title: "Créditos cargados exitosamente",
        description: `Se procesaron ${resultado.procesadas} registros por un total de ${formatearMonto(resultado.montoTotalAcreditado)}`,
      });
    } catch (error) {
      toast({
        title: "Error al cargar créditos",
        description: "Ocurrió un error durante el proceso de cargue",
        variant: "destructive"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleCerrar = () => {
    setResumen(null);
    onClose();
  };

  const montoTotal = detalles.reduce((sum, d) => sum + d.monto, 0);
  const montoProcesable = procesables.reduce((sum, d) => sum + d.monto, 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleCerrar}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {resumen ? 'Resultado del Cargue' : 'Confirmar Cargue de Créditos'}
          </DialogTitle>
        </DialogHeader>

        {!resumen ? (
          <div className="space-y-4">
            {/* Información del archivo */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Información del Archivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Archivo:</span>
                  <span className="font-medium">{nombreArchivo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registros conciliados:</span>
                  <span className="font-medium">{detalles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto total:</span>
                  <span className="font-medium">{formatearMonto(montoTotal)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de procesamiento */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{procesables.length}</div>
                      <div className="text-sm text-muted-foreground">A procesar</div>
                      <div className="text-sm font-medium">{formatearMonto(montoProcesable)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{duplicados.length}</div>
                      <div className="text-sm text-muted-foreground">Duplicados</div>
                      <div className="text-sm font-medium">
                        {formatearMonto(duplicados.reduce((sum, d) => sum + d.monto, 0))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas de duplicados */}
            {duplicados.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Se detectaron {duplicados.length} registros duplicados que serán excluidos automáticamente. 
                  El proceso es idempotente y no afectará créditos ya aplicados.
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Descargar CSV de duplicados
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertDescription>
                <strong>Importante:</strong> Esta operación acreditará {formatearMonto(montoProcesable)} 
                en créditos prepago a {procesables.length} pasajeros. El proceso es irreversible.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600">¡Cargue Completado Exitosamente!</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{resumen.procesadas}</div>
                  <div className="text-sm text-muted-foreground">Registros procesados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatearMonto(resumen.montoTotalAcreditado)}
                  </div>
                  <div className="text-sm text-muted-foreground">Monto acreditado</div>
                </CardContent>
              </Card>
            </div>

            {resumen.duplicadas > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Se excluyeron {resumen.duplicadas} filas duplicadas del procesamiento.
                </AlertDescription>
              </Alert>
            )}

            {resumen.conError > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {resumen.conError} registros presentaron errores durante el procesamiento.
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Descargar CSV de errores
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {!resumen ? (
            <>
              <Button variant="outline" onClick={handleCerrar}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmar} 
                disabled={cargando || procesables.length === 0}
                className="gap-2"
              >
                {cargando ? 'Procesando...' : 'Confirmar cargue'}
              </Button>
            </>
          ) : (
            <Button onClick={handleCerrar}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}