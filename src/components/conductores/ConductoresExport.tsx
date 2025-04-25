
import React from 'react';
import { Button } from "@/components/ui/button";
import { Conductor } from "@/types/conductor";
import { exportConductoresToExcel, exportConductoresToPDF } from "@/services/exportService";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConductoresExportProps {
  conductores: Conductor[];
}

const ConductoresExport: React.FC<ConductoresExportProps> = ({ conductores }) => {
  const { toast } = useToast();

  const handleExport = async (type: 'PDF' | 'Excel') => {
    try {
      if (conductores.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay conductores para exportar."
        });
        return;
      }

      if (type === 'PDF') {
        await exportConductoresToPDF(conductores);
      } else {
        await exportConductoresToExcel(conductores);
      }

      toast({
        title: "Éxito",
        description: `Los conductores han sido exportados a ${type} correctamente.`
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

export default ConductoresExport;
