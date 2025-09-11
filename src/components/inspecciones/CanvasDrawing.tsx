import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pen, Trash2 } from 'lucide-react';
import busFrontalImage from '@/assets/bus-frontal-inspeccion.jpg';

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
  height = 300 
}: CanvasDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [backgroundImage] = useState<string>(initialImage || busFrontalImage);

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

    // Load background image
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = backgroundImage;
    }
  }, [width, height, backgroundImage]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const pos = getEventPos(e);
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode) return;

    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const pos = getEventPos(e);
    context.lineTo(pos.x, pos.y);
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

  const clearDrawings = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw background image
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

  return (
    <Card className="p-4 space-y-4">
      {/* Controles */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={isDrawingMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsDrawingMode(!isDrawingMode)}
        >
          <Pen className="mr-2 h-4 w-4" />
          {isDrawingMode ? 'Dibujo ON' : 'Dibujo OFF'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearDrawings}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar
        </Button>
      </div>

      {/* Canvas siempre visible */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`w-full ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Instrucciones */}
      <div className="text-xs text-muted-foreground">
        {isDrawingMode ? (
          <p>🖊️ <strong>Modo dibujo activado.</strong> Marque las áreas de inspección directamente sobre la imagen.</p>
        ) : (
          <p>👆 <strong>Active el modo dibujo</strong> para marcar sobre la imagen del bus.</p>
        )}
      </div>
    </Card>
  );
}