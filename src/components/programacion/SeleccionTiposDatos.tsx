
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TiposDatos } from '@/types/programacion-parametros';

interface SeleccionTiposDatosProps {
  tiposSeleccionados: TiposDatos;
  onCambiarTipo: (tipo: keyof TiposDatos) => void;
}

const SeleccionTiposDatos: React.FC<SeleccionTiposDatosProps> = ({
  tiposSeleccionados,
  onCambiarTipo
}) => {
  const tipos = [
    { key: 'conductores', label: 'Conductores' },
    { key: 'geocercas', label: 'Geocercas' },
    { key: 'paradas', label: 'Paradas' },
    { key: 'rutas', label: 'Rutas' },
    { key: 'parametros', label: 'Parámetros' },
    { key: 'tarifas', label: 'Tarifas' },
    { key: 'usuariosSoporte', label: 'Usuarios de soporte' },
    { key: 'logcat', label: 'Logcat' },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar tipos de datos a programar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tipos.map((tipo) => (
            <div key={tipo.key} className="flex items-center space-x-2">
              <Checkbox
                id={tipo.key}
                checked={tiposSeleccionados[tipo.key]}
                onCheckedChange={() => onCambiarTipo(tipo.key)}
              />
              <Label htmlFor={tipo.key} className="text-sm">
                {tipo.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeleccionTiposDatos;
