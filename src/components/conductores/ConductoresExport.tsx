
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
    <div className="flex items-center justify-between mb-4">
      <div></div> {/* Spacer to push export buttons to the right */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToExcel(conductores)}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4" /> Excel
        </Button>
        <Button
          variant="outline" 
          size="sm"
          onClick={() => exportToPDF(conductores)}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4" /> PDF
        </Button>
      </div>
    </div>
  );
};

export default ConductoresExport;
