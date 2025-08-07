import React from 'react';
import { Button } from "@/components/ui/button";
import { AutobusCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportCapacidadCumplidaProps {
  autobuses: AutobusCapacidadCumplida[];
}

const ExportCapacidadCumplida: React.FC<ExportCapacidadCumplidaProps> = ({ autobuses }) => {
  const { toast } = useToast();

  const handleExport = async (type: 'PDF' | 'Excel') => {
    try {
      if (autobuses.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay datos para exportar."
        });
        return;
      }

      // Simular exportación - aquí se implementaría la lógica real
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Éxito",
        description: `Los datos han sido exportados a ${type} correctamente.`
      });

      // Aquí se registraría en bitácora el acceso y generación del archivo
      console.log(`Exportación ${type} generada para ${autobuses.length} registros`);
      
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
        <FileSpreadsheet className="h-4 w-4" /> 
        Exportar Excel
      </Button>
      <Button
        variant="outline" 
        size="sm"
        onClick={() => handleExport('PDF')}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" /> 
        Exportar PDF
      </Button>
    </div>
  );
};

export default ExportCapacidadCumplida;