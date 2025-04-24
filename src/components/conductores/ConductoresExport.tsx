
import React from 'react';
import { Button } from "@/components/ui/button";
import { Conductor } from "@/types/conductor";
import { exportToExcel, exportToPDF } from "@/services/conductorService";
import { FileText } from "lucide-react";

interface ConductoresExportProps {
  conductores: Conductor[];
}

const ConductoresExport: React.FC<ConductoresExportProps> = ({ conductores }) => {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button
        variant="outline"
        onClick={() => exportToExcel(conductores)}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" /> Exportar a Excel
      </Button>
      <Button
        variant="outline" 
        onClick={() => exportToPDF(conductores)}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" /> Exportar a PDF
      </Button>
    </div>
  );
};

export default ConductoresExport;
