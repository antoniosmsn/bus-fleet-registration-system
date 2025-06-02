
import React from 'react';
import { Button } from '@/components/ui/button';

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton?: string;
  distrito?: string;
  sector?: string;
  estado: string;
  lat: number;
  lng: number;
}

interface ParadasExportProps {
  paradas: Parada[];
}

const ParadasExport: React.FC<ParadasExportProps> = ({ paradas }) => {
  const handleExportExcel = () => {
    console.log('Exportando a Excel:', paradas);
    // In a real app, this would generate and download an Excel file
  };

  const handleExportPDF = () => {
    console.log('Exportando a PDF:', paradas);
    // In a real app, this would generate and download a PDF file
  };

  const handleViewReport = () => {
    console.log('Ver reporte:', paradas);
    // In a real app, this would open a detailed report view
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportExcel}>
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleViewReport}>
        Ver Reporte
      </Button>
    </div>
  );
};

export default ParadasExport;
