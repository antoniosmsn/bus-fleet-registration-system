import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CanvasDrawing } from './CanvasDrawing';
import { CampoPlantilla } from '@/types/plantilla-matriz';

interface CampoInspeccionComponentProps {
  campo: CampoPlantilla;
  valor?: string | boolean | Date;
  onChange: (valor: string | boolean | Date) => void;
}

export function CampoInspeccionComponent({ campo, valor, onChange }: CampoInspeccionComponentProps) {

  const renderCampoContent = () => {
    switch (campo.tipo) {
      case 'texto':
        return (
          <Textarea
            placeholder="Ingrese su respuesta..."
            value={valor as string || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={campo.id}
              checked={valor as boolean || false}
              onCheckedChange={(checked) => onChange(Boolean(checked))}
            />
            <Label htmlFor={campo.id} className="text-sm font-normal">
              Marcar si es correcto/cumple
            </Label>
          </div>
        );

      case 'select':
        return (
          <Select 
            value={valor as string || ''} 
            onValueChange={(value) => onChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar opción..." />
            </SelectTrigger>
            <SelectContent>
              {campo.opciones?.map((opcion) => (
                <SelectItem key={opcion} value={opcion}>
                  {opcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup 
            value={valor as string || ''} 
            onValueChange={(value) => onChange(value)}
          >
            {campo.opciones?.map((opcion) => (
              <div key={opcion} className="flex items-center space-x-2">
                <RadioGroupItem value={opcion} id={`${campo.id}-${opcion}`} />
                <Label htmlFor={`${campo.id}-${opcion}`} className="text-sm font-normal">
                  {opcion}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fecha':
        return (
          <Input
            type="date"
            value={valor as string || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'canvas':
        return (
          <CanvasDrawing
            onCanvasChange={(canvas) => onChange(canvas)}
            initialImage={campo.imagenBase || valor as string}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder="Ingrese su respuesta..."
            value={valor as string || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <Card className={`border-l-4 ${campo.requerido ? 'border-l-red-500' : 'border-l-blue-500'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Label className="text-base font-medium leading-6">
              {campo.etiqueta}
              {campo.requerido && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {campo.peso}%
            </span>
          </div>
          
          {renderCampoContent()}
          
          {campo.requerido && (
            <p className="text-xs text-muted-foreground">
              Este campo es obligatorio
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}