import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlantillaMatriz } from '@/types/plantilla-matriz';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface CalificacionDisplayProps {
  calificacionFinal: number;
  pesoTotal: number;
}

export function CalificacionDisplay({ calificacionFinal, pesoTotal }: CalificacionDisplayProps) {
  const porcentaje = pesoTotal > 0 ? Math.round((calificacionFinal / pesoTotal) * 100) : 0;

  const getCalificacionColor = () => {
    if (porcentaje >= 90) return 'text-green-600';
    if (porcentaje >= 80) return 'text-blue-600';
    if (porcentaje >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCalificacionIcon = () => {
    if (porcentaje >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (porcentaje >= 70) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getCalificacionTexto = () => {
    if (porcentaje >= 90) return 'Excelente';
    if (porcentaje >= 80) return 'Bueno';
    if (porcentaje >= 70) return 'Aceptable';
    return 'Requiere atención';
  };

  const getCalificacionBadge = () => {
    if (porcentaje >= 90) return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
    if (porcentaje >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Condicional</Badge>;
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
            {calificacionFinal}/{pesoTotal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Porcentaje:</span>
          <span className={`text-2xl font-bold ${getCalificacionColor()}`}>
            {porcentaje}%
          </span>
        </div>

        <Progress value={porcentaje} className="h-3" />

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
          <p>Peso total de la plantilla: {pesoTotal} puntos</p>
          <p>Puntuación obtenida: {calificacionFinal} puntos</p>
        </div>

        {porcentaje < 70 && (
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