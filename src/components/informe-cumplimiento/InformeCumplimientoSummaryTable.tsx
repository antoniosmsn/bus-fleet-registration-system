import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';

interface InformeCumplimientoSummaryTableProps {
  informes: InformeCumplimiento[];
  onEmpresaClick: (empresa: string) => void;
  selectedEmpresa?: string;
}

interface SummaryData {
  empresaCliente: string;
  numeroPasajeros: number;
  cantidadServicios: number;
}

export default function InformeCumplimientoSummaryTable({ informes, onEmpresaClick, selectedEmpresa }: InformeCumplimientoSummaryTableProps) {
  // Aggregate data by empresa cliente
  const summaryData = React.useMemo(() => {
    const dataMap = new Map<string, SummaryData>();

    informes.forEach(informe => {
      const key = informe.empresaCliente;
      
      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        existing.numeroPasajeros += informe.pasajeros;
        existing.cantidadServicios += 1;
      } else {
        dataMap.set(key, {
          empresaCliente: informe.empresaCliente,
          numeroPasajeros: informe.pasajeros,
          cantidadServicios: 1
        });
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => 
      a.empresaCliente.localeCompare(b.empresaCliente)
    );
  }, [informes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen por Empresa Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa Cliente</TableHead>
              <TableHead className="text-right">Número de Pasajeros</TableHead>
              <TableHead className="text-right">Cantidad de Servicios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((row, index) => (
              <TableRow 
                key={index}
                className={`cursor-pointer hover:bg-muted/50 ${selectedEmpresa === row.empresaCliente ? 'bg-muted' : ''}`}
                onClick={() => onEmpresaClick(row.empresaCliente)}
              >
                <TableCell className="font-medium text-primary hover:text-primary/80">
                  {row.empresaCliente}
                </TableCell>
                <TableCell className="text-right">{row.numeroPasajeros.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.cantidadServicios}</TableCell>
              </TableRow>
            ))}
            {summaryData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}