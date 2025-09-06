import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface CanvasImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageBase64: string) => void;
}

export function CanvasImageUpload({ currentImage, onImageUpload }: CanvasImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
      toast({
        title: "Éxito",
        description: "Imagen cargada correctamente"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {currentImage ? (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img
                  src={currentImage}
                  alt="Imagen base"
                  className="w-16 h-16 object-cover rounded border"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Imagen base configurada</p>
                <p className="text-xs text-muted-foreground">
                  Esta imagen aparecerá como fondo en el canvas
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemoveImage}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/20 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-muted rounded-full">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm font-medium">Subir imagen base</p>
              <p className="text-xs text-muted-foreground mt-1">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG hasta 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!currentImage && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-xs"
        >
          <Upload className="h-3 w-3 mr-2" />
          Seleccionar archivo
        </Button>
      )}
    </div>
  );
}