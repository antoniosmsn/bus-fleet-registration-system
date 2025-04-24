
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, error }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo no debe exceder los 2MB");
        return;
      }
      
      // Validar formato
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert("Solo se permiten archivos JPG o PNG");
        return;
      }
      
      // Crear URL de preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium">{label}</span>
        {preview ? (
          <div className="relative">
            <img 
              src={preview}
              alt={`${label} preview`}
              className="max-w-full h-auto max-h-48 rounded-md border border-gray-300"
            />
            <Button 
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-primary",
            error ? "border-destructive" : "border-gray-300"
          )}>
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600 text-center">
              Haga clic para subir o arrastrar y soltar<br />
              JPG, PNG (máx. 2MB)
            </span>
            <Input 
              type="file" 
              accept=".jpg,.jpeg,.png" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
