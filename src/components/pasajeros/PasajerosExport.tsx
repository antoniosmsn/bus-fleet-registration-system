
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { Pasajero } from '@/types/pasajero';
import { exportPasajerosToPDF, exportPasajerosToExcel } from '@/services/exportService';

interface PasajerosExportProps {
  pasajeros: Pasajero[];
}

const PasajerosExport: React.FC<PasajerosExportProps> = ({ pasajeros }) => {
  const handleExportPDF = async () => {
    await exportPasajerosToPDF(pasajeros);
  };

  const handleExportExcel = async () => {
    await exportPasajerosToExcel(pasajeros);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Excel
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default PasajerosExport;
