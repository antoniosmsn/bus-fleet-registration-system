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
  const [hasUserImage, setHasUserImage] = useState(false);

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
      setHasUserImage(true);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const loadExampleImage = () => {
    // Simple SVG of a car as example
    const carSvg = `
      <svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="150" fill="#f0f0f0"/>
        <!-- Car body -->
        <rect x="50" y="80" width="200" height="40" rx="10" fill="#3B82F6"/>
        <!-- Car roof -->
        <rect x="80" y="60" width="140" height="30" rx="15" fill="#2563EB"/>
        <!-- Wheels -->
        <circle cx="90" cy="130" r="15" fill="#1F2937"/>
        <circle cx="210" cy="130" r="15" fill="#1F2937"/>
        <!-- Wheel rims -->
        <circle cx="90" cy="130" r="8" fill="#6B7280"/>
        <circle cx="210" cy="130" r="8" fill="#6B7280"/>
        <!-- Windows -->
        <rect x="90" y="65" width="40" height="20" rx="5" fill="#E5E7EB"/>
        <rect x="140" y="65" width="40" height="20" rx="5" fill="#E5E7EB"/>
        <rect x="190" y="65" width="40" height="20" rx="5" fill="#E5E7EB"/>
        <!-- Headlights -->
        <circle cx="45" cy="90" r="8" fill="#FEF3C7"/>
        <circle cx="255" cy="90" r="8" fill="#FEF59E"/>
        <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="white">AUTO</text>
        <text x="150" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">Imagen de ejemplo - Puedes cargar tu propia imagen</text>
      </svg>
    `;
    
    const svgBlob = new Blob([carSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        setBackgroundImage(dataURL);
        setHasUserImage(false);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
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
      {/* Área principal de canvas o zona de carga */}
      {!backgroundImage ? (
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center space-y-4 bg-muted/10">
          <div className="text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Cargar imagen para dibujar</p>
            <p className="text-sm">Sube una imagen o usa la de ejemplo para empezar a dibujar</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Subir mi imagen
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={loadExampleImage}
              className="gap-2"
            >
              <Pen className="h-4 w-4" />
              Usar imagen de ejemplo
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Controles cuando hay imagen */}
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
              {hasUserImage ? 'Cambiar imagen' : 'Cargar otra imagen'}
            </Button>

            {!hasUserImage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadExampleImage}
              >
                <Pen className="mr-2 h-4 w-4" />
                Recargar ejemplo
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearCanvas}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar dibujos
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setBackgroundImage(null);
                setHasUserImage(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Quitar imagen
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

          {/* Canvas */}
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
        </>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Instrucciones */}
      <div className="text-xs text-muted-foreground space-y-1">
        {!backgroundImage ? (
          <>
            <p>💡 <strong>Cómo empezar:</strong> Sube tu propia imagen o usa la de ejemplo</p>
            <p>🖊️ <strong>Para dibujar:</strong> Activa el modo dibujo y haz clic y arrastra</p>
            <p>💾 <strong>Para guardar:</strong> Descarga el resultado cuando termines</p>
          </>
        ) : isDrawingMode ? (
          <p>🖊️ <strong>Modo dibujo activado.</strong> Haz clic y arrastra para dibujar sobre la imagen.</p>
        ) : (
          <p>👆 <strong>Activa el modo dibujo</strong> para poder rayar sobre la imagen cargada.</p>
        )}
      </div>
    </Card>
  );
}