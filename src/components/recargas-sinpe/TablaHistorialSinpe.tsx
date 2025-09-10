import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, CheckCircle, AlertTriangle, XCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistorialArchivoSinpe, DetalleConciliacionSinpe } from '@/types/recarga-sinpe';

interface Props {
  archivos: HistorialArchivoSinpe[];
  onVerResultado: (archivo: HistorialArchivoSinpe) => void;
  archivoSeleccionado: HistorialArchivoSinpe | null;
  detalles: DetalleConciliacionSinpe[];
  onCargarCreditos: (detallesConciliados: DetalleConciliacionSinpe[]) => void;
  onConciliar: (detalle: DetalleConciliacionSinpe) => void;
}

export default function TablaHistorialSinpe({ 
  archivos, 
  onVerResultado, 
  archivoSeleccionado, 
  detalles, 
  onCargarCreditos, 
  onConciliar 
}: Props) {
  const getEstadoBadge = (estado: HistorialArchivoSinpe['estadoConciliacion']) => {
    switch (estado) {
      case 'Éxito':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Éxito
        </Badge>;
      case 'Parcial':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Parcial
        </Badge>;
      case 'Con errores':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Con errores
        </Badge>;
    }
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(monto);
  };

  const detallesConciliados = detalles.filter(d => d.conciliado && !d.estadoCargue);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Historial de Archivos SINPE</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre de Archivo</TableHead>
                <TableHead>Estado de Conciliación</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Monto Total</TableHead>
                <TableHead>Monto Conciliado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron archivos que coincidan con los filtros
                  </TableCell>
                </TableRow>
              ) : (
                archivos.map((archivo) => (
                  <TableRow 
                    key={archivo.id} 
                    className={`hover:bg-muted/50 ${
                      archivoSeleccionado?.id === archivo.id ? 'bg-muted/50' : ''
                    }`}
                  >
                    <TableCell>
                      {format(archivo.fecha, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell className="font-medium">{archivo.usuario}</TableCell>
                    <TableCell>{archivo.nombreArchivo}</TableCell>
                    <TableCell>{getEstadoBadge(archivo.estadoConciliacion)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{archivo.totalRegistros} total</div>
                        <div className="text-muted-foreground">
                          {archivo.registrosConciliados} conciliados
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatearMonto(archivo.montoTotal)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatearMonto(archivo.montoConciliado)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={archivoSeleccionado?.id === archivo.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => onVerResultado(archivo)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver resultado
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tabla de detalles */}
      {archivoSeleccionado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detalle del Resultado - {archivoSeleccionado.nombreArchivo}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Procesado por {archivoSeleccionado.usuario} el {format(archivoSeleccionado.fecha, 'dd/MM/yyyy HH:mm', { locale: es })}
                </p>
              </div>
              {detallesConciliados.length > 0 && (
                <Button 
                  onClick={() => onCargarCreditos(detallesConciliados)}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Cargar créditos ({detallesConciliados.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Línea</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay detalles para mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    detalles.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.linea}</TableCell>
                        <TableCell className="font-mono">{detalle.cedula}</TableCell>
                        <TableCell className="font-medium">{detalle.nombre}</TableCell>
                        <TableCell className="font-medium">{formatearMonto(detalle.monto)}</TableCell>
                        <TableCell>
                          {detalle.conciliado ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conciliado
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              No conciliado
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!detalle.conciliado && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onConciliar(detalle)}
                              className="gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Conciliar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Resumen */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total registros:</span> {detalles.length}
                </div>
                <div>
                  <span className="font-medium text-green-600">Conciliados:</span> {detalles.filter(d => d.conciliado).length}
                </div>
                <div>
                  <span className="font-medium text-red-600">No conciliados:</span> {detalles.filter(d => !d.conciliado).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}