import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TipoAlertaPasajeroForm, MotivoAlertaForm } from '@/types/alerta-pasajero';
import { useToast } from '@/hooks/use-toast';

export default function RegistrarTipoAlertaPasajero() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formulario, setFormulario] = useState<TipoAlertaPasajeroForm>({
    nombre: '',
    alertType: '',
    motivos: [{ nombre: '', nombreIngles: '', activo: true, esNuevo: true }]
  });
  const [errores, setErrores] = useState<{[key: string]: string}>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: {[key: string]: string} = {};

    // Validar nombre del tipo
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del tipo de alerta es obligatorio';
    } else if (formulario.nombre.length < 3 || formulario.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre debe tener entre 3 y 100 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\/]+$/.test(formulario.nombre)) {
      nuevosErrores.nombre = 'Solo se permiten letras, números, espacios, guiones y barras';
    }

    // Validar Alert Type
    if (!formulario.alertType.trim()) {
      nuevosErrores.alertType = 'El Alert Type es requerido';
    } else if (formulario.alertType.length < 3 || formulario.alertType.length > 100) {
      nuevosErrores.alertType = 'El Alert Type debe tener entre 3 y 100 caracteres';
    }

    // Validar que hay al menos un motivo
    if (formulario.motivos.length === 0 || formulario.motivos.every(m => !m.nombre.trim())) {
      nuevosErrores.motivos = 'Debe existir al menos un motivo';
    }

    // Validar cada motivo
    const motivosValidos = formulario.motivos.filter(m => m.nombre.trim());
    const nombresMotivos = motivosValidos.map(m => m.nombre.toLowerCase().trim());
    const nombresInglesMotivos = motivosValidos.map(m => m.nombreIngles.toLowerCase().trim());
    
    formulario.motivos.forEach((motivo, index) => {
      if (motivo.nombre.trim()) {
        if (motivo.nombre.length < 3 || motivo.nombre.length > 300) {
          nuevosErrores[`motivo_${index}`] = 'El nombre debe tener entre 3 y 300 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\/]+$/.test(motivo.nombre)) {
          nuevosErrores[`motivo_${index}`] = 'Solo se permiten letras, números, espacios, guiones y barras';
        }
        
        // Verificar duplicados
        const motivoNormalizado = motivo.nombre.toLowerCase().trim();
        if (nombresMotivos.filter(n => n === motivoNormalizado).length > 1) {
          nuevosErrores[`motivo_${index}`] = 'No se permiten motivos duplicados';
        }
      }
      
      if (motivo.nombreIngles.trim()) {
        if (motivo.nombreIngles.length < 3 || motivo.nombreIngles.length > 300) {
          nuevosErrores[`motivoIngles_${index}`] = 'El nombre en inglés debe tener entre 3 y 300 caracteres';
        }
        
        // Verificar duplicados en inglés
        const motivoInglesNormalizado = motivo.nombreIngles.toLowerCase().trim();
        if (nombresInglesMotivos.filter(n => n === motivoInglesNormalizado).length > 1) {
          nuevosErrores[`motivoIngles_${index}`] = 'No se permiten motivos en inglés duplicados';
        }
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarMotivo = () => {
    setFormulario(prev => ({
      ...prev,
      motivos: [...prev.motivos, { nombre: '', nombreIngles: '', activo: true, esNuevo: true }]
    }));
  };

  const eliminarMotivo = (index: number) => {
    setFormulario(prev => ({
      ...prev,
      motivos: prev.motivos.filter((_, i) => i !== index)
    }));
    
    // Limpiar errores del motivo eliminado
    const nuevosErrores = { ...errores };
    delete nuevosErrores[`motivo_${index}`];
    setErrores(nuevosErrores);
  };

  const actualizarMotivo = (index: number, campo: keyof MotivoAlertaForm, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      motivos: prev.motivos.map((motivo, i) => 
        i === index ? { ...motivo, [campo]: valor } : motivo
      )
    }));
  };

  const guardarTipoAlerta = () => {
    if (!validarFormulario()) return;

    // Filtrar motivos vacíos
    const motivosValidos = formulario.motivos.filter(m => m.nombre.trim());
    
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardando tipo de alerta:', {
      ...formulario,
      motivos: motivosValidos
    });

    toast({
      title: "Tipo de alerta registrado exitosamente",
      description: "El tipo de alerta y sus motivos han sido guardados correctamente"
    });

    // Limpiar formulario
    setFormulario({
      nombre: '',
      alertType: '',
      motivos: [{ nombre: '', nombreIngles: '', activo: true, esNuevo: true }]
    });
    setErrores({});
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to="/catalogos/alertas-pasajeros">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Registrar tipo de alerta</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Información del tipo de alerta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del tipo de alerta *</Label>
            <Input
              id="nombre"
              value={formulario.nombre}
              onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Forma de conducir"
              className={errores.nombre ? 'border-destructive' : ''}
            />
            {errores.nombre && (
              <p className="text-sm text-destructive">{errores.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertType">Alert Type *</Label>
            <Input
              id="alertType"
              value={formulario.alertType}
              onChange={(e) => setFormulario(prev => ({ ...prev, alertType: e.target.value }))}
              placeholder="Ej: Driving Behavior"
              className={errores.alertType ? 'border-destructive' : ''}
            />
            {errores.alertType && (
              <p className="text-sm text-destructive">{errores.alertType}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Motivos asociados *</Label>
              <Button type="button" variant="outline" onClick={agregarMotivo}>
                <Plus className="h-4 w-4" />
                Agregar motivo
              </Button>
            </div>

            {errores.motivos && (
              <p className="text-sm text-destructive">{errores.motivos}</p>
            )}

            <div className="space-y-3">
              {formulario.motivos.map((motivo, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <Label>Motivo en español *</Label>
                        <Textarea
                          value={motivo.nombre}
                          onChange={(e) => actualizarMotivo(index, 'nombre', e.target.value)}
                          placeholder="Ej: Conduce muy rápido"
                          className={`min-h-[60px] ${errores[`motivo_${index}`] ? 'border-destructive' : ''}`}
                        />
                        {errores[`motivo_${index}`] && (
                          <p className="text-sm text-destructive">{errores[`motivo_${index}`]}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label>Motivo en inglés *</Label>
                        <Textarea
                          value={motivo.nombreIngles}
                          onChange={(e) => actualizarMotivo(index, 'nombreIngles', e.target.value)}
                          placeholder="Ex: Drives too fast"
                          className={`min-h-[60px] ${errores[`motivoIngles_${index}`] ? 'border-destructive' : ''}`}
                        />
                        {errores[`motivoIngles_${index}`] && (
                          <p className="text-sm text-destructive">{errores[`motivoIngles_${index}`]}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => eliminarMotivo(index)}
                      disabled={formulario.motivos.length === 1}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={guardarTipoAlerta}>
              Guardar tipo de alerta
            </Button>
            <Button variant="outline" asChild>
              <Link to="/catalogos/alertas-pasajeros">
                Cancelar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}