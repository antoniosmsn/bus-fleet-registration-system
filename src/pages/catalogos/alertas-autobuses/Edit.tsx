import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TipoAlertaAutobus, TipoAlertaAutobusForm } from "@/types/alerta-autobus";
import { mockTiposAlertaAutobus } from "@/data/mockTiposAlertaAutobus";
import { registrarEdicionTipoAlerta, registrarActivacionTipoAlerta } from "@/services/bitacoraService";

interface ErroresFormulario {
  nombre?: string;
}

export default function EditarTipoAlertaAutobus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tipoOriginal, setTipoOriginal] = useState<TipoAlertaAutobus | null>(null);
  const [formulario, setFormulario] = useState<TipoAlertaAutobusForm & { activo: boolean }>({
    nombre: "",
    activo: true
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});

  useEffect(() => {
    const tipoEncontrado = mockTiposAlertaAutobus.find(tipo => tipo.id === parseInt(id || ""));
    
    if (tipoEncontrado) {
      setTipoOriginal(tipoEncontrado);
      setFormulario({
        nombre: tipoEncontrado.nombre,
        activo: tipoEncontrado.activo
      });
    } else {
      toast({
        title: "Error",
        description: "No se encontró el tipo de alerta especificado",
        variant: "destructive"
      });
      navigate('/catalogos/alertas-autobuses');
    }
  }, [id, navigate, toast]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};

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
      // Verificar unicidad (excluir el registro actual)
      const nombreNormalizado = formulario.nombre.trim().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      const existeNombre = mockTiposAlertaAutobus.some(tipo => 
        tipo.id !== parseInt(id || "") &&
        tipo.nombre.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") === nombreNormalizado
      );

      if (existeNombre) {
        nuevosErrores.nombre = "Ya existe un tipo de alerta con este nombre";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const actualizarTipoAlerta = () => {
    if (!validarFormulario() || !tipoOriginal) {
      return;
    }

    // Simular actualización
    const tipoActualizado = {
      ...tipoOriginal,
      nombre: formulario.nombre.trim(),
      activo: formulario.activo,
      fechaModificacion: new Date().toISOString()
    };

    console.log("Actualizando tipo de alerta:", tipoActualizado);
    registrarEdicionTipoAlerta(tipoActualizado);

    // Si cambió el estado, registrar también el cambio de estado
    if (tipoOriginal.activo !== formulario.activo) {
      registrarActivacionTipoAlerta(tipoActualizado, formulario.activo);
    }

    toast({
      title: "Éxito",
      description: "Tipo de alerta actualizado exitosamente",
      variant: "default"
    });

    navigate('/catalogos/alertas-autobuses');
  };

  if (!tipoOriginal) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/catalogos/alertas-autobuses')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalogos/alertas-autobuses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Tipo de Alerta de Autobus</h1>
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

          <div className="flex items-center space-x-2">
            <Switch
              checked={formulario.activo}
              onCheckedChange={(checked) => setFormulario(prev => ({ ...prev, activo: checked }))}
            />
            <Label>Activo</Label>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Button onClick={actualizarTipoAlerta}>
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