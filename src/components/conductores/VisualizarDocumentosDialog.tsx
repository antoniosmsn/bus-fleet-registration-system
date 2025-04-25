
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VisualizarDocumentosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conductor: {
    nombre: string;
    apellidos: string;
    imagenCedula?: string;
    imagenLicencia?: string;
  } | null;
}

const VisualizarDocumentosDialog: React.FC<VisualizarDocumentosDialogProps> = ({
  isOpen,
  onClose,
  conductor
}) => {
  if (!conductor) return null;

  const noImageMessage = (documentoTipo: string) => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No hay imagen registrada para {documentoTipo}.
      </AlertDescription>
    </Alert>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Documentos de {conductor.nombre} {conductor.apellidos}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cedula" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cedula">Cédula</TabsTrigger>
            <TabsTrigger value="licencia">Licencia</TabsTrigger>
          </TabsList>

          <TabsContent value="cedula" className="mt-4">
            {conductor.imagenCedula ? (
              <div className="relative aspect-[4/3] w-full max-h-[300px] overflow-hidden rounded-lg">
                <img
                  src={conductor.imagenCedula}
                  alt="Cédula del conductor"
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              noImageMessage("la cédula")
            )}
          </TabsContent>

          <TabsContent value="licencia" className="mt-4">
            {conductor.imagenLicencia ? (
              <div className="relative aspect-[4/3] w-full max-h-[300px] overflow-hidden rounded-lg">
                <img
                  src={conductor.imagenLicencia}
                  alt="Licencia del conductor"
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              noImageMessage("la licencia")
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarDocumentosDialog;

