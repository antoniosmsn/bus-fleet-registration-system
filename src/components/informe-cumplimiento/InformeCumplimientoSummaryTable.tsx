import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';

interface InformeCumplimientoSummaryTableProps {
  informes: InformeCumplimiento[];
  onEmpresaClick: (empresa: string) => void;
  selectedEmpresa?: string;
  onRevisionCliente: (empresa: string) => void;
  onTipoRutaFilter: (empresa: string, tipoRuta: string) => void;
  selectedTipoRuta?: string;
}

interface SummaryData {
  empresaTransporte: string;
  serviciosParque: number;
  serviciosPrivados: number;
  serviciosEspeciales: number;
}

export default function InformeCumplimientoSummaryTable({ informes, onEmpresaClick, selectedEmpresa, onRevisionCliente, onTipoRutaFilter, selectedTipoRuta }: InformeCumplimientoSummaryTableProps) {
  // Aggregate data by empresa de transporte
  const summaryData = React.useMemo(() => {
    const dataMap = new Map<string, SummaryData>();

    informes.forEach(informe => {
      const key = informe.transportista;
      
      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        // Generate random values for the services
        existing.serviciosParque += Math.floor(Math.random() * 500000) + 100000;
        existing.serviciosPrivados += Math.floor(Math.random() * 300000) + 50000;
        existing.serviciosEspeciales += Math.floor(Math.random() * 200000) + 25000;
      } else {
        dataMap.set(key, {
          empresaTransporte: informe.transportista,
          serviciosParque: Math.floor(Math.random() * 500000) + 100000,
          serviciosPrivados: Math.floor(Math.random() * 300000) + 50000,
          serviciosEspeciales: Math.floor(Math.random() * 200000) + 25000
        });
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => 
      a.empresaTransporte.localeCompare(b.empresaTransporte)
    );
  }, [informes]);

  // Format currency in colones
  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen por Empresa de Transporte</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa de Transporte</TableHead>
              <TableHead className="text-right">Servicios Parque</TableHead>
              <TableHead className="text-right">Servicios Privados</TableHead>
              <TableHead className="text-right">Servicios Especiales</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((row, index) => (
              <TableRow 
                key={index}
                className={`hover:bg-muted/50 ${selectedEmpresa === row.empresaTransporte ? 'bg-muted' : ''}`}
              >
                <TableCell 
                  className="font-medium text-primary hover:text-primary/80 cursor-pointer"
                  onClick={() => onEmpresaClick(row.empresaTransporte)}
                >
                  {row.empresaTransporte}
                </TableCell>
                <TableCell 
                  className="text-right text-primary hover:text-primary/80 cursor-pointer underline-offset-4 hover:underline"
                  onClick={() => onTipoRutaFilter(row.empresaTransporte, 'parque')}
                >
                  {formatCurrency(row.serviciosParque)}
                </TableCell>
                <TableCell 
                  className="text-right text-primary hover:text-primary/80 cursor-pointer underline-offset-4 hover:underline"
                  onClick={() => onTipoRutaFilter(row.empresaTransporte, 'privada')}
                >
                  {formatCurrency(row.serviciosPrivados)}
                </TableCell>
                <TableCell 
                  className="text-right text-primary hover:text-primary/80 cursor-pointer underline-offset-4 hover:underline"
                  onClick={() => onTipoRutaFilter(row.empresaTransporte, 'especial')}
                >
                  {formatCurrency(row.serviciosEspeciales)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={() => onRevisionCliente(row.empresaTransporte)}
                  >
                    Rev. Cliente
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {summaryData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
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