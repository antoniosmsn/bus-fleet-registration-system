import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TipoAlertaAutobusForm } from "@/types/alerta-autobus";
import { mockTiposAlertaAutobus } from "@/data/mockTiposAlertaAutobus";
import { registrarTipoAlerta } from "@/services/bitacoraService";

interface ErroresFormulario {
  nombre?: string;
  alertType?: string;
  motivos?: { [key: number]: string };
  motivosIngles?: { [key: number]: string };
}

export default function RegistrarTipoAlertaAutobus() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formulario, setFormulario] = useState<TipoAlertaAutobusForm>({
    nombre: "",
    alertType: "",
    motivos: [{ nombre: "", nombreIngles: "", activo: true, esNuevo: true }]
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};
    const erroresMotivos: { [key: number]: string } = {};
    const erroresMotivosIngles: { [key: number]: string } = {};

    // Validar nombre
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del tipo de alerta es obligatorio";
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (formulario.nombre.trim().length > 100) {
      nuevosErrores.nombre = "El nombre no puede exceder los 100 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d10-9\s\-\/]+$/.test(formulario.nombre.trim())) {
      nuevosErrores.nombre = "El nombre solo puede contener letras, números, espacios, guiones y barras";
    } else {
      // Verificar unicidad (case-insensitive y sin acentos)
      const nombreNormalizado = formulario.nombre.trim().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      const existeNombre = mockTiposAlertaAutobus.some(tipo => 
        tipo.nombre.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") === nombreNormalizado
      );

      if (existeNombre) {
        nuevosErrores.nombre = "Ya existe un tipo de alerta con este nombre";
      }
    }

    // Validar Alert Type
    if (!formulario.alertType.trim()) {
      nuevosErrores.alertType = "El Alert Type es requerido";
    } else if (formulario.alertType.length < 3 || formulario.alertType.length > 100) {
      nuevosErrores.alertType = "El Alert Type debe tener entre 3 y 100 caracteres";
    }

    // Validar motivos en español
    formulario.motivos.forEach((motivo, index) => {
      if (!motivo.nombre.trim()) {
        erroresMotivos[index] = "El motivo es obligatorio";
      } else if (motivo.nombre.trim().length < 3) {
        erroresMotivos[index] = "El motivo debe tener al menos 3 caracteres";
      } else if (motivo.nombre.trim().length > 200) {
        erroresMotivos[index] = "El motivo no puede exceder los 200 caracteres";
      } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d10-9\s\-\/,.]+$/.test(motivo.nombre.trim())) {
        erroresMotivos[index] = "El motivo contiene caracteres no permitidos";
      }
      
      // Validar motivos en inglés
      if (!motivo.nombreIngles.trim()) {
        erroresMotivosIngles[index] = "El motivo en inglés es obligatorio";
      } else if (motivo.nombreIngles.trim().length < 3) {
        erroresMotivosIngles[index] = "El motivo en inglés debe tener al menos 3 caracteres";
      } else if (motivo.nombreIngles.trim().length > 200) {
        erroresMotivosIngles[index] = "El motivo en inglés no puede exceder los 200 caracteres";
      }
    });

    // Verificar motivos duplicados en español
    const motivosNormalizados = formulario.motivos.map(motivo => 
      motivo.nombre.trim().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );

    motivosNormalizados.forEach((motivoNormalizado, index) => {
      if (motivoNormalizado && motivosNormalizados.indexOf(motivoNormalizado) !== index) {
        erroresMotivos[index] = "Este motivo ya existe en la lista";
      }
    });

    // Verificar motivos duplicados en inglés
    const motivosInglesNormalizados = formulario.motivos.map(motivo => 
      motivo.nombreIngles.trim().toLowerCase()
    );

    motivosInglesNormalizados.forEach((motivoInglesNormalizado, index) => {
      if (motivoInglesNormalizado && motivosInglesNormalizados.indexOf(motivoInglesNormalizado) !== index) {
        erroresMotivosIngles[index] = "Este motivo en inglés ya existe en la lista";
      }
    });

    if (Object.keys(erroresMotivos).length > 0) {
      nuevosErrores.motivos = erroresMotivos;
    }

    if (Object.keys(erroresMotivosIngles).length > 0) {
      nuevosErrores.motivosIngles = erroresMotivosIngles;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarMotivo = () => {
    setFormulario(prev => ({
      ...prev,
      motivos: [...prev.motivos, { nombre: "", nombreIngles: "", activo: true, esNuevo: true }]
    }));
  };

  const eliminarMotivo = (index: number) => {
    setFormulario(prev => ({
      ...prev,
      motivos: prev.motivos.filter((_, i) => i !== index)
    }));
    
    // Limpiar errores del motivo eliminado
    setErrores(prev => {
      const nuevosErrores = { ...prev };
      if (nuevosErrores.motivos) {
        const { [index]: eliminado, ...restantes } = nuevosErrores.motivos;
        if (Object.keys(restantes).length === 0) {
          delete nuevosErrores.motivos;
        } else {
          nuevosErrores.motivos = restantes;
        }
      }
      return nuevosErrores;
    });
  };

  const actualizarMotivo = (index: number, campo: string, valor: any) => {
    setFormulario(prev => ({
      ...prev,
      motivos: prev.motivos.map((motivo, i) =>
        i === index ? { ...motivo, [campo]: valor } : motivo
      )
    }));
  };

  const guardarTipoAlerta = () => {
    if (!validarFormulario()) {
      return;
    }

    // Filtrar motivos vacíos y preparar data
    const motivosValidos = formulario.motivos.filter(motivo => motivo.nombre.trim());
    
    const nuevoTipo = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      motivos: motivosValidos.map(motivo => ({
        ...motivo,
        nombre: motivo.nombre.trim()
      }))
    };

    console.log("Guardando tipo de alerta:", nuevoTipo);
    registrarTipoAlerta(nuevoTipo);

    toast({
      title: "Éxito",
      description: "Tipo de alerta registrado exitosamente",
      variant: "default"
    });

    // Limpiar formulario
    setFormulario({ 
      nombre: "",
      alertType: "",
      motivos: [{ nombre: "", nombreIngles: "", activo: true, esNuevo: true }]
    });
    setErrores({});
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalogos/alertas-autobuses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Registrar Tipo de Alerta de Autobus</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Tipo de Alerta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Tipo de Alerta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              value={formulario.nombre}
              onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ingrese el nombre del tipo de alerta"
              className={errores.nombre ? "border-destructive" : ""}
              maxLength={100}
            />
            {errores.nombre && (
              <p className="text-sm text-destructive">{errores.nombre}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Entre 3 y 100 caracteres. Solo letras, números, espacios, guiones y barras.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertType">
              Tipo de Alerta Ingles <span className="text-destructive">*</span>
            </Label>
            <Input
              id="alertType"
              value={formulario.alertType}
              onChange={(e) => setFormulario(prev => ({ ...prev, alertType: e.target.value }))}
              placeholder="Ej: Driving Behavior"
              className={errores.alertType ? "border-destructive" : ""}
              maxLength={100}
            />
            {errores.alertType && (
              <p className="text-sm text-destructive">{errores.alertType}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Entre 3 y 100 caracteres para el tipo de alerta en inglés.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Motivos de la Alerta <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarMotivo}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar motivo
              </Button>
            </div>
            
            <div className="space-y-3">
              {formulario.motivos.map((motivo, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={motivo.activo}
                        onCheckedChange={(checked) => actualizarMotivo(index, 'activo', checked)}
                      />
                      <Label className="text-sm">
                        {motivo.activo ? 'Activo' : 'Inactivo'}
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarMotivo(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                   <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`motivo-${index}`}>
                        Motivo {index + 1} (Español) <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`motivo-${index}`}
                        value={motivo.nombre}
                        onChange={(e) => actualizarMotivo(index, 'nombre', e.target.value)}
                        placeholder="Ej: Conduce muy rápido"
                        className={errores.motivos?.[index] ? "border-destructive" : ""}
                        maxLength={200}
                        rows={2}
                      />
                      {errores.motivos?.[index] && (
                        <p className="text-sm text-destructive">{errores.motivos[index]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`motivoIngles-${index}`}>
                        Motivo {index + 1} (Inglés) <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`motivoIngles-${index}`}
                        value={motivo.nombreIngles}
                        onChange={(e) => actualizarMotivo(index, 'nombreIngles', e.target.value)}
                        placeholder="Ex: Drives too fast"
                        className={errores.motivosIngles?.[index] ? "border-destructive" : ""}
                        maxLength={200}
                        rows={2}
                      />
                      {errores.motivosIngles?.[index] && (
                        <p className="text-sm text-destructive">{errores.motivosIngles[index]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Entre 3 y 200 caracteres por motivo. Solo letras, números, espacios, guiones, barras, comas y puntos.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Button onClick={guardarTipoAlerta}>
              Guardar Cambios
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/catalogos/alertas-autobuses')}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}