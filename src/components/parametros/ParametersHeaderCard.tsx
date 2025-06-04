
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Loader2 } from 'lucide-react';

interface Bus {
  id: number;
  placa: string;
}

interface ParametersHeaderCardProps {
  autobusSeleccionado: Bus | null;
  parametrosLeidosDesdeDispositivo: boolean;
  leyendoParametros: boolean;
  onAbrirModalSeleccion: () => void;
  onLeerParametrosEnLinea: () => void;
}

const ParametersHeaderCard: React.FC<ParametersHeaderCardProps> = ({
  autobusSeleccionado,
  parametrosLeidosDesdeDispositivo,
  leyendoParametros,
  onAbrirModalSeleccion,
  onLeerParametrosEnLinea
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Parámetros de Lectora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 mb-2">
              {autobusSeleccionado 
                ? `Autobús seleccionado: ${autobusSeleccionado.id}-${autobusSeleccionado.placa}`
                : 'Ningún autobús seleccionado'
              }
            </p>
            {parametrosLeidosDesdeDispositivo && (
              <p className="text-green-600 font-medium">
                Parámetros leídos desde la lectora del autobús
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onAbrirModalSeleccion}>
              Seleccionar autobús
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={!autobusSeleccionado || leyendoParametros}
                >
                  {leyendoParametros ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Leyendo...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Leer parámetros en línea
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar lectura de parámetros</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Desea leer los parámetros de la boletera del autobús seleccionado?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={onLeerParametrosEnLinea}>
                    Sí
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametersHeaderCard;
