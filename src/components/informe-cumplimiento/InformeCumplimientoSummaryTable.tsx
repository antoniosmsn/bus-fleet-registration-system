import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';
import ModalConfirmacionRevisionCliente from './ModalConfirmacionRevisionCliente';

interface InformeCumplimientoSummaryTableProps {
  informes: InformeCumplimiento[];
  onEmpresaClick: (empresa: string) => void;
  selectedEmpresa?: string;
  onRevisionCliente: (empresa: string) => void;
  onTipoRutaFilter: (empresa: string, tipoRuta: string) => void;
  selectedTipoRuta?: string;
  onRevisionPorTipo: (empresa: string, tipoRuta: string) => void;
}

interface SummaryData {
  empresaTransporte: string;
  serviciosParque: number;
  serviciosPrivados: number;
  serviciosEspeciales: number;
  total: number;
}

export default function InformeCumplimientoSummaryTable({ informes, onEmpresaClick, selectedEmpresa, onRevisionCliente, onTipoRutaFilter, selectedTipoRuta, onRevisionPorTipo }: InformeCumplimientoSummaryTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmpresaForRevision, setSelectedEmpresaForRevision] = useState<string>('');
  const [selectedTipoForRevision, setSelectedTipoForRevision] = useState<string>('');
  // Aggregate data by empresa de transporte
  const summaryData = React.useMemo(() => {
    const dataMap = new Map<string, SummaryData>();

    informes.forEach(informe => {
      const key = informe.transportista;
      
      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        // Add values based on actual route type
        if (informe.tipoRuta === 'parque') {
          existing.serviciosParque += Math.floor(Math.random() * 500000) + 100000;
        } else if (informe.tipoRuta === 'privada') {
          existing.serviciosPrivados += Math.floor(Math.random() * 300000) + 50000;
        } else if (informe.tipoRuta === 'especial') {
          existing.serviciosEspeciales += Math.floor(Math.random() * 200000) + 25000;
        }
        // Recalculate total
        existing.total = existing.serviciosParque + existing.serviciosPrivados + existing.serviciosEspeciales;
      } else {
        // Initialize with 0 for all service types
        const newData: SummaryData = {
          empresaTransporte: informe.transportista,
          serviciosParque: 0,
          serviciosPrivados: 0,
          serviciosEspeciales: 0,
          total: 0
        };
        
        // Add value only for the actual route type of this service
        if (informe.tipoRuta === 'parque') {
          newData.serviciosParque = Math.floor(Math.random() * 500000) + 100000;
        } else if (informe.tipoRuta === 'privada') {
          newData.serviciosPrivados = Math.floor(Math.random() * 300000) + 50000;
        } else if (informe.tipoRuta === 'especial') {
          newData.serviciosEspeciales = Math.floor(Math.random() * 200000) + 25000;
        }
        
        // Calculate total
        newData.total = newData.serviciosParque + newData.serviciosPrivados + newData.serviciosEspeciales;
        
        dataMap.set(key, newData);
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => 
      a.empresaTransporte.localeCompare(b.empresaTransporte)
    );
  }, [informes]);

  // Calculate column totals
  const columnTotals = React.useMemo(() => {
    return summaryData.reduce((totals, row) => ({
      serviciosParque: totals.serviciosParque + row.serviciosParque,
      serviciosPrivados: totals.serviciosPrivados + row.serviciosPrivados,
      serviciosEspeciales: totals.serviciosEspeciales + row.serviciosEspeciales,
      total: totals.total + row.total
    }), {
      serviciosParque: 0,
      serviciosPrivados: 0,
      serviciosEspeciales: 0,
      total: 0
    });
  }, [summaryData]);

  // Format currency in colones
  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR')}`;
  };

  const handleRevisionClick = (empresa: string, tipoRuta?: string) => {
    setSelectedEmpresaForRevision(empresa);
    setSelectedTipoForRevision(tipoRuta || '');
    setModalOpen(true);
  };

  const handleConfirmRevision = () => {
    if (selectedTipoForRevision) {
      onRevisionPorTipo(selectedEmpresaForRevision, selectedTipoForRevision);
    } else {
      onRevisionCliente(selectedEmpresaForRevision);
    }
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
              <TableHead className="text-right">Total</TableHead>
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
                  <div className="flex items-center justify-end gap-2">
                    <span>{formatCurrency(row.serviciosParque)}</span>
                    {row.serviciosParque > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-1 py-0 h-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevisionClick(row.empresaTransporte, 'parque');
                        }}
                      >
                        Aprobar
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell 
                  className="text-right text-primary hover:text-primary/80 cursor-pointer underline-offset-4 hover:underline"
                  onClick={() => onTipoRutaFilter(row.empresaTransporte, 'privada')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span>{formatCurrency(row.serviciosPrivados)}</span>
                    {row.serviciosPrivados > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-1 py-0 h-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevisionClick(row.empresaTransporte, 'privada');
                        }}
                      >
                        Aprobar
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell 
                  className="text-right text-primary hover:text-primary/80 cursor-pointer underline-offset-4 hover:underline"
                  onClick={() => onTipoRutaFilter(row.empresaTransporte, 'especial')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span>{formatCurrency(row.serviciosEspeciales)}</span>
                    {row.serviciosEspeciales > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-1 py-0 h-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevisionClick(row.empresaTransporte, 'especial');
                        }}
                      >
                        Aprobar
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(row.total)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={() => handleRevisionClick(row.empresaTransporte)}
                  >
                    Aprobar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {summaryData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium">TOTALES</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(columnTotals.serviciosParque)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(columnTotals.serviciosPrivados)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(columnTotals.serviciosEspeciales)}
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(columnTotals.total)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      
      <ModalConfirmacionRevisionCliente
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRevision}
        empresaName={selectedEmpresaForRevision}
        tipoRuta={selectedTipoForRevision}
      />
    </Card>
  );
}