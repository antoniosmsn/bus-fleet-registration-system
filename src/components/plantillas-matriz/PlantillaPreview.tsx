import { PlantillaBuilder } from '@/types/plantilla-matriz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface PlantillaPreviewProps {
  plantilla: PlantillaBuilder;
}

export function PlantillaPreview({ plantilla }: PlantillaPreviewProps) {
  const renderField = (campo: any) => {
    const baseProps = {
      key: campo.id,
      className: "w-full"
    };

    switch (campo.tipo) {
      case 'texto':
        return (
          <div className="space-y-2">
            <Label htmlFor={campo.id}>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <Input 
              id={campo.id}
              placeholder="Escribe tu respuesta"
              {...baseProps}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={campo.id}>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {campo.opciones?.map((opcion: string, index: number) => (
                  <SelectItem key={index} value={opcion}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            <Label>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup>
              {campo.opciones?.map((opcion: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`${campo.id}-${index}`} />
                  <Label htmlFor={`${campo.id}-${index}`}>{opcion}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            <Label>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
              {campo.opciones?.map((opcion: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${campo.id}-${index}`} />
                  <Label htmlFor={`${campo.id}-${index}`}>{opcion}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'fecha':
        return (
          <div className="space-y-2">
            <Label htmlFor={campo.id}>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Seleccionar fecha
            </Button>
          </div>
        );

      case 'canvas':
        return (
          <div className="space-y-2">
            <Label>
              {campo.etiqueta}
              {campo.requerido && <span className="text-destructive">*</span>}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/20">
              <div className="text-muted-foreground">
                <div className="text-4xl mb-2">✏️</div>
                <p>Área de dibujo</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-t-8 border-t-primary">
          <CardContent className="p-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-normal text-foreground">
                {plantilla.nombre || 'Formulario sin título'}
              </h1>
              {plantilla.descripcion && (
                <p className="text-base text-muted-foreground">
                  {plantilla.descripcion}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Secciones */}
        {plantilla.secciones.map((seccion) => (
          <Card key={seccion.id}>
            <CardHeader>
              <CardTitle className="text-xl text-primary">
                {seccion.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {seccion.campos
                .sort((a, b) => a.orden - b.orden)
                .map(renderField)}
            </CardContent>
          </Card>
        ))}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Vista previa de la plantilla - Los datos no se guardan
          </p>
        </div>
      </div>
    </div>
  );
}