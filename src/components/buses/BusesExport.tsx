
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bus } from "@/types/bus";
import { exportBusesToExcel, exportBusesToPDF } from "@/services/exportService";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusesExportProps {
  buses: Bus[];
}

const BusesExport: React.FC<BusesExportProps> = ({ buses }) => {
  const { toast } = useToast();

  const handleExport = async (type: 'PDF' | 'Excel') => {
    try {
      if (buses.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay autobuses para exportar."
        });
        return;
      }

      if (type === 'PDF') {
        await exportBusesToPDF(buses);
      } else {
        await exportBusesToExcel(buses);
      }

      toast({
        title: "Éxito",
        description: `Los autobuses han sido exportados a ${type} correctamente.`
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo exportar a ${type}. Por favor, intente nuevamente.`
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('Excel')}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </Button>
      <Button
        variant="outline" 
        size="sm"
        onClick={() => handleExport('PDF')}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" /> PDF
      </Button>
    </div>
  );
};

export default BusesExport;
