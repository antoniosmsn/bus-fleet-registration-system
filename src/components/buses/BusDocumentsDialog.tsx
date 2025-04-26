
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { Bus } from '@/types/bus';

interface BusDocumentsDialogProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentLink {
  name: string;
  url: string | null;
  type: 'dekra' | 'insurance' | 'ctp' | 'tax';
}

const BusDocumentsDialog: React.FC<BusDocumentsDialogProps> = ({
  bus,
  isOpen,
  onClose,
}) => {
  if (!bus) return null;

  const documents: DocumentLink[] = [
    { name: 'Dekra', url: bus.dekraDocument || null, type: 'dekra' },
    { name: 'Póliza de Seguro', url: bus.insuranceDocument || null, type: 'insurance' },
    { name: 'Permiso CTP', url: bus.ctpDocument || null, type: 'ctp' },
    { name: 'Marchamo', url: bus.taxDocument || null, type: 'tax' },
  ];

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Documentos del Autobús {bus.plate}</DialogTitle>
          <DialogDescription>
            Visualización de documentos registrados para el autobús
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {documents.map((doc) => (
            <div 
              key={doc.type}
              className="p-4 border rounded-lg space-y-2"
            >
              <h3 className="font-medium text-gray-900">{doc.name}</h3>
              {doc.url ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-500">Documento disponible</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(doc.url!)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">No hay documento registrado para este campo</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default BusDocumentsDialog;
