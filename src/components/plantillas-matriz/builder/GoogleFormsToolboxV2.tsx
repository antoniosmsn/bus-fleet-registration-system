import { Plus, Type, List, Circle, Square, Calendar, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GoogleFormsToolboxV2Props {
  onAddField: (tipo: string) => void;
  onClose: () => void;
}

const fieldTypes = [
  { id: 'texto', name: 'Texto', icon: Type, description: 'Respuesta corta' },
  { id: 'select', name: 'Desplegable', icon: List, description: 'Lista de opciones' },
  { id: 'radio', name: 'Opción múltiple', icon: Circle, description: 'Una sola respuesta' },
  { id: 'checkbox', name: 'Casillas', icon: Square, description: 'Múltiples respuestas' },
  { id: 'fecha', name: 'Fecha', icon: Calendar, description: 'Selector de fecha' },
  { id: 'canvas', name: 'Dibujo', icon: Palette, description: 'Área de dibujo' }
];

export function GoogleFormsToolboxV2({ onAddField, onClose }: GoogleFormsToolboxV2Props) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <Card className="w-16 shadow-lg border-2">
        <div className="p-2 space-y-2">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full h-12 p-0 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Add Field Button */}
          <div className="border-b pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddField('texto')}
              className="w-full h-12 p-0 hover:bg-primary hover:text-primary-foreground"
              title="Agregar pregunta"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          {/* Field Types */}
          {fieldTypes.map((field) => {
            const Icon = field.icon;
            return (
              <Button
                key={field.id}
                variant="ghost"
                size="sm"
                onClick={() => onAddField(field.id)}
                className="w-full h-12 p-0 hover:bg-muted"
                title={`${field.name} - ${field.description}`}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}