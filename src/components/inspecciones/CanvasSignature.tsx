import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Save } from 'lucide-react';

interface CanvasSignatureProps {
  onSignatureChange: (signature: string) => void;
  initialSignature?: string;
}

export function CanvasSignature({ onSignatureChange, initialSignature }: CanvasSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Set drawing properties
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = initialSignature;
      setIsEmpty(false);
    } else {
      // Clear canvas
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setIsEmpty(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

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
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onSignatureChange('');
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const dataURL = canvas.toDataURL();
    onSignatureChange(dataURL);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded cursor-crosshair w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
          <Button type="button" size="sm" onClick={saveSignature} disabled={isEmpty}>
            <Save className="mr-2 h-4 w-4" />
            Guardar firma
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Dibuje su firma en el área superior usando el mouse o pantalla táctil
        </p>
      </div>
    </Card>
  );
}