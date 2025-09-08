import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Upload, Download, Pen } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CanvasDrawingProps {
  initialImage?: string;
  onCanvasChange?: (canvas: string) => void;
  width?: number;
  height?: number;
}

export function CanvasDrawing({ 
  initialImage, 
  onCanvasChange, 
  width = 400, 
  height = 200 
}: CanvasDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(initialImage || null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Set drawing properties
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';

    // Clear canvas and set white background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Load background image if provided
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = backgroundImage;
    }
  }, [width, height, backgroundImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBackgroundImage(result);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    // Save canvas state
    const canvas = canvasRef.current;
    if (canvas && onCanvasChange) {
      const dataURL = canvas.toDataURL();
      onCanvasChange(dataURL);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw background image if exists
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = backgroundImage;
    }

    if (onCanvasChange) {
      onCanvasChange('');
    }
  };

  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    
    // Redraw canvas without background
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={isDrawingMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsDrawingMode(!isDrawingMode)}
        >
          <Pen className="mr-2 h-4 w-4" />
          {isDrawingMode ? 'Modo dibujo ON' : 'Activar dibujo'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Cargar imagen
        </Button>

        {backgroundImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeBackgroundImage}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Quitar imagen
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearCanvas}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar todo
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={downloadCanvas}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>

      <div className="border border-gray-300 rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`w-full ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {isDrawingMode 
          ? 'Modo dibujo activado. Haz clic y arrastra para dibujar sobre el canvas.'
          : 'Activa el modo dibujo para poder dibujar. Puedes cargar una imagen de fondo primero.'}
      </p>
    </Card>
  );
}