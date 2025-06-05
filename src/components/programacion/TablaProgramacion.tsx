
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AutobusProgramacion } from '@/types/programacion-parametros';

interface TablaProgramacionProps {
  autobuses: AutobusProgramacion[];
  autobusesSeleccionados: number[];
  onSeleccionarAutobus: (id: number) => void;
  onSeleccionarTodos: () => void;
  onDeseleccionarTodos: () => void;
}

const TablaProgramacion: React.FC<TablaProgramacionProps> = ({
  autobuses,
  autobusesSeleccionados,
  onSeleccionarAutobus,
  onSeleccionarTodos,
  onDeseleccionarTodos
}) => {
  const getEstadoBadge = (valor: number) => {
    if (valor === 1) {
      return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 w-20 justify-center">PENDIENTE</Badge>;
    }
    return <Badge variant="default" className="bg-green-500 hover:bg-green-600 w-20 justify-center">ENVIADO</Badge>;
  };

  const todosSeleccionados = autobuses.length > 0 && autobusesSeleccionados.length === autobuses.length;
  const algunosSeleccionados = autobusesSeleccionados.length > 0 && autobusesSeleccionados.length < autobuses.length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={onSeleccionarTodos}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              SELECCIONAR TODOS
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={onDeseleccionarTodos}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              DESELECCIONAR TODOS
            </button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={todosSeleccionados || algunosSeleccionados}
                      onCheckedChange={todosSeleccionados ? onDeseleccionarTodos : onSeleccionarTodos}
                    />
                  </TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Identificador del autobús</TableHead>
                  <TableHead>Empresa de transporte</TableHead>
                  <TableHead>Conductores</TableHead>
                  <TableHead>Geocercas</TableHead>
                  <TableHead>Paradas</TableHead>
                  <TableHead>Rutas</TableHead>
                  <TableHead>Parámetros</TableHead>
                  <TableHead>Tarifas</TableHead>
                  <TableHead>Usuarios de soporte</TableHead>
                  <TableHead>Logcat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autobuses.map((autobus) => (
                  <TableRow key={autobus.id}>
                    <TableCell>
                      <Checkbox
                        checked={autobusesSeleccionados.includes(autobus.id)}
                        onCheckedChange={() => onSeleccionarAutobus(autobus.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{autobus.placa}</TableCell>
                    <TableCell>{autobus.identificador}</TableCell>
                    <TableCell>{autobus.empresaTransporte}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.conductores)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.geocercas)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.paradas)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.rutas)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.parametros)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.tarifas)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.usuariosSoporte)}</TableCell>
                    <TableCell>{getEstadoBadge(autobus.logcat)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablaProgramacion;
