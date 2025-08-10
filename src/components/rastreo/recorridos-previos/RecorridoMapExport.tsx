import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { RecorridoMapData } from '@/types/recorridos-previos';
import { useToast } from '@/hooks/use-toast';

interface RecorridoMapExportProps {
  data: RecorridoMapData | null;
  modo: 'servicios' | 'rango';
}

const RecorridoMapExport: React.FC<RecorridoMapExportProps> = ({ data, modo }) => {
  const { toast } = useToast();

  const handleExport = async (type: 'PDF' | 'Excel') => {
    try {
      if (!data || data.telemetria.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay datos de recorrido para exportar."
        });
        return;
      }

      // Simulate export functionality
      console.log(`Exportando recorrido a ${type}:`, {
        modo,
        puntosTelemetria: data.telemetria.length,
        paradas: data.stops.length,
        lecturasQR: data.qrReadings.length
      });

      toast({
        title: "Éxito",
        description: `El recorrido ha sido exportado a ${type} correctamente.`
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

export default RecorridoMapExport;