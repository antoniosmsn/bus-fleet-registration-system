import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutobusCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bus, Users } from "lucide-react";

interface TablaCapacidadCumplidaProps {
  autobuses: AutobusCapacidadCumplida[];
}

const TablaCapacidadCumplida: React.FC<TablaCapacidadCumplidaProps> = ({ autobuses }) => {
  const formatearFechaHora = (fechaHora: string) => {
    try {
      return format(new Date(fechaHora), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return fechaHora;
    }
  };

  if (autobuses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Bus className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No se encontraron autobuses con capacidad cumplida que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa de Transporte</TableHead>
                <TableHead>ID Autobús</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Ruta Asignada</TableHead>
                <TableHead>Conductor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autobuses.map((autobus) => (
                <TableRow key={autobus.id}>
                  <TableCell className="font-medium">
                    {autobus.empresaTransporte}
                  </TableCell>
                  <TableCell>{autobus.idAutobus}</TableCell>
                  <TableCell>{autobus.placa}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <Users className="h-3 w-3" />
                      {autobus.capacidad}
                    </span>
                  </TableCell>
                  <TableCell>{formatearFechaHora(autobus.fechaHoraCumplimiento)}</TableCell>
                  <TableCell>{autobus.rutaAsignada}</TableCell>
                  <TableCell>{autobus.conductorAsignado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablaCapacidadCumplida;