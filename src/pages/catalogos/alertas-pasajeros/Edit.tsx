import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { TipoAlertaPasajeroForm, MotivoAlertaForm, TipoAlertaPasajero } from '@/types/alerta-pasajero';
import { mockTiposAlertaPasajero } from '@/data/mockTiposAlertaPasajero';
import { useToast } from '@/hooks/use-toast';

export default function EditarTipoAlertaPasajero() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tipoOriginal, setTipoOriginal] = useState<TipoAlertaPasajero | null>(null);
  const [formulario, setFormulario] = useState<TipoAlertaPasajeroForm>({
    nombre: '',
    motivos: []
  });
  const [errores, setErrores] = useState<{[key: string]: string}>({});
  const [motivosEliminados, setMotivosEliminados] = useState<number[]>([]);

  useEffect(() => {
    const tipoEncontrado = mockTiposAlertaPasajero.find(t => t.id === parseInt(id || ''));
    if (tipoEncontrado) {
      setTipoOriginal(tipoEncontrado);
      setFormulario({
        nombre: tipoEncontrado.nombre,
        motivos: tipoEncontrado.motivos.map(m => ({
          id: m.id,
          nombre: m.nombre,
          activo: m.activo,
          esNuevo: false
        }))
      });
    } else {
      navigate('/catalogos/alertas-pasajeros');
    }
  }, [id, navigate]);

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

    // Validar que hay al menos un motivo activo
    const motivosActivos = formulario.motivos.filter(m => m.activo && m.nombre.trim());
    if (motivosActivos.length === 0) {
      nuevosErrores.motivos = 'Debe existir al menos un motivo activo';
    }

    // Validar cada motivo
    const motivosValidos = formulario.motivos.filter(m => m.nombre.trim());
    const nombresMotivos = motivosValidos.map(m => m.nombre.toLowerCase().trim());
    
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
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarMotivo = () => {
    setFormulario(prev => ({
      ...prev,
      motivos: [...prev.motivos, { nombre: '', activo: true, esNuevo: true }]
    }));
  };

  const eliminarMotivo = (index: number) => {
    const motivo = formulario.motivos[index];
    
    // Si es un motivo existente (con ID), marcarlo para eliminación lógica
    if (motivo.id && !motivo.esNuevo) {
      setMotivosEliminados(prev => [...prev, motivo.id!]);
      // Inactivar en lugar de eliminar físicamente
      setFormulario(prev => ({
        ...prev,
        motivos: prev.motivos.map((m, i) => 
          i === index ? { ...m, activo: false } : m
        )
      }));
    } else {
      // Si es un motivo nuevo, eliminarlo físicamente
      setFormulario(prev => ({
        ...prev,
        motivos: prev.motivos.filter((_, i) => i !== index)
      }));
    }
    
    // Limpiar errores del motivo
    const nuevosErrores = { ...errores };
    delete nuevosErrores[`motivo_${index}`];
    setErrores(nuevosErrores);
  };

  const actualizarMotivo = (index: number, campo: keyof MotivoAlertaForm, valor: any) => {
    setFormulario(prev => ({
      ...prev,
      motivos: prev.motivos.map((motivo, i) => 
        i === index ? { ...motivo, [campo]: valor } : motivo
      )
    }));
  };

  const actualizarTipoAlerta = () => {
    if (!validarFormulario()) return;

    // Aquí iría la lógica para actualizar en el backend
    console.log('Actualizando tipo de alerta:', {
      ...formulario,
      motivosEliminados
    });

    toast({
      title: "Tipo de alerta actualizado exitosamente",
      description: "Los cambios han sido guardados correctamente"
    });

    navigate('/catalogos/alertas-pasajeros');
  };

  const puedeEliminarMotivo = (motivo: MotivoAlertaForm, index: number): boolean => {
    // Permitir eliminar si es nuevo o si no tiene uso histórico (mock: siempre permitir)
    return true;
  };

  if (!tipoOriginal) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link to="/catalogos/alertas-pasajeros">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Editar tipo de alerta</h1>
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
                <div key={motivo.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {motivo.esNuevo && (
                        <Badge variant="outline" className="text-xs">Nuevo</Badge>
                      )}
                      <Label>Estado activo</Label>
                      <Switch
                        checked={motivo.activo}
                        onCheckedChange={(checked) => actualizarMotivo(index, 'activo', checked)}
                      />
                    </div>
                    {puedeEliminarMotivo(motivo, index) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => eliminarMotivo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Textarea
                      value={motivo.nombre}
                      onChange={(e) => actualizarMotivo(index, 'nombre', e.target.value)}
                      placeholder="Ej: Conduce muy rápido"
                      className={`min-h-[60px] ${errores[`motivo_${index}`] ? 'border-destructive' : ''}`}
                      disabled={!motivo.activo}
                    />
                    {errores[`motivo_${index}`] && (
                      <p className="text-sm text-destructive">{errores[`motivo_${index}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={actualizarTipoAlerta}>
              Actualizar tipo de alerta
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