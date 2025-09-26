import React from 'react';
import { Button } from "@/components/ui/button";
import { BitacoraSistema, BitacoraSistemaFilter } from "@/types/bitacora-sistema";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportBitacorasSistemaToPDF, exportBitacorasSistemaToExcel } from "@/services/exportService";

interface BitacorasSistemaExportProps {
  bitacoras: BitacoraSistema[];
  filtros: BitacoraSistemaFilter;
}

const BitacorasSistemaExport: React.FC<BitacorasSistemaExportProps> = ({ 
  bitacoras, 
  filtros 
}) => {
  const { toast } = useToast();

  const exportToPDF = async () => {
    try {
      if (bitacoras.length === 0) {
        toast({
          variant: "destructive",
          title: "Sin datos",
          description: "No hay registros para exportar."
        });
        return;
      }

      await exportBitacorasSistemaToPDF(bitacoras);

      toast({
        title: "Éxito",
        description: "Las bitácoras del sistema han sido exportadas a PDF correctamente."
      });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo exportar a PDF. Por favor, intente nuevamente."
      });
    }
  };

  const exportToExcel = async () => {
    try {
      if (bitacoras.length === 0) {
        toast({
          variant: "destructive",
          title: "Sin datos",
          description: "No hay registros para exportar."
        });
        return;
      }

      await exportBitacorasSistemaToExcel(bitacoras);

      toast({
        title: "Éxito",
        description: "Las bitácoras del sistema han sido exportadas a Excel correctamente."
      });
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo exportar a Excel. Por favor, intente nuevamente."
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-2"
        disabled={bitacoras.length === 0}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-2"
        disabled={bitacoras.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
    </div>
  );
};

export default BitacorasSistemaExport;