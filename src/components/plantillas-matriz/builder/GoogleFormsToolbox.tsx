import { Type, ChevronDown, Circle, Square, Calendar, Pen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GoogleFormsToolboxProps {
  onAddField: (tipo: string) => void;
}

const fieldTypes = [
  { id: 'texto', name: 'Respuesta corta', icon: Type, description: 'Una línea de texto' },
  { id: 'select', name: 'Lista desplegable', icon: ChevronDown, description: 'Menú desplegable' },
  { id: 'radio', name: 'Opción múltiple', icon: Circle, description: 'Seleccionar una opción' },
  { id: 'checkbox', name: 'Casillas de verificación', icon: Square, description: 'Seleccionar varias opciones' },
  { id: 'fecha', name: 'Fecha', icon: Calendar, description: 'Selector de fecha' },
  { id: 'canvas', name: 'Dibujo', icon: Pen, description: 'Área de dibujo libre' }
];

export function GoogleFormsToolbox({ onAddField }: GoogleFormsToolboxProps) {
  return (
    <div className="w-80 bg-background border-r border-border h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Tipos de pregunta</h3>
        <p className="text-sm text-muted-foreground">
          Haz clic para agregar una pregunta
        </p>
      </div>
      
      <div className="p-4 space-y-3 h-full overflow-auto">
        {fieldTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card 
              key={type.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/30"
              onClick={() => onAddField(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{type.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{type.description}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        <Separator className="my-6" />
        
        <div className="text-center text-xs text-muted-foreground">
          <p>💡 Configura el peso y propiedades</p>
          <p>de cada campo después de agregarlo</p>
        </div>
      </div>
    </div>
  );
}