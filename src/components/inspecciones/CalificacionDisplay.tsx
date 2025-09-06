import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlantillaInspeccion } from '@/types/inspeccion-autobus';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface CalificacionDisplayProps {
  calificacion: number;
  plantilla: PlantillaInspeccion;
}

export function CalificacionDisplay({ calificacion, plantilla }: CalificacionDisplayProps) {
  const getCalificacionColor = () => {
    if (calificacion >= 90) return 'text-green-600';
    if (calificacion >= 80) return 'text-blue-600';
    if (calificacion >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCalificacionIcon = () => {
    if (calificacion >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (calificacion >= 70) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getCalificacionTexto = () => {
    if (calificacion >= 90) return 'Excelente';
    if (calificacion >= 80) return 'Bueno';
    if (calificacion >= 70) return 'Aceptable';
    return 'Requiere atención';
  };

  const getCalificacionBadge = () => {
    if (calificacion >= 90) return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
    if (calificacion >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Condicional</Badge>;
    return <Badge className="bg-red-100 text-red-800">No aprobado</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getCalificacionIcon()}
          Calificación Final
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Puntuación obtenida:</span>
          <span className={`text-3xl font-bold ${getCalificacionColor()}`}>
            {calificacion}%
          </span>
        </div>

        <Progress value={calificacion} className="h-3" />

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Clasificación:</span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${getCalificacionColor()}`}>
              {getCalificacionTexto()}
            </span>
            {getCalificacionBadge()}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Peso total de la plantilla: {plantilla.pesoTotal} puntos</p>
          <p>Plantilla utilizada: {plantilla.nombre}</p>
        </div>

        {calificacion < 70 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Atención:</strong> Esta inspección requiere revisión adicional debido a la puntuación obtenida.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}