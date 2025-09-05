import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TipoAlertaAutobusForm } from "@/types/alerta-autobus";
import { mockTiposAlertaAutobus } from "@/data/mockTiposAlertaAutobus";
import { registrarTipoAlerta } from "@/services/bitacoraService";

interface ErroresFormulario {
  nombre?: string;
}

export default function RegistrarTipoAlertaAutobus() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formulario, setFormulario] = useState<TipoAlertaAutobusForm>({
    nombre: ""
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});

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

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarTipoAlerta = () => {
    if (!validarFormulario()) {
      return;
    }

    // Simular guardado
    const nuevoTipo = {
      ...formulario,
      nombre: formulario.nombre.trim()
    };

    console.log("Guardando tipo de alerta:", nuevoTipo);
    registrarTipoAlerta(nuevoTipo);

    toast({
      title: "Éxito",
      description: "Tipo de alerta registrado exitosamente",
      variant: "default"
    });

    // Limpiar formulario
    setFormulario({ nombre: "" });
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