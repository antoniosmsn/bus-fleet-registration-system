import { PlantillaMatriz, SeccionPlantilla, CampoPlantilla } from '@/types/plantilla-matriz';
import { RespuestaSeccion, RespuestaCampo } from '@/types/inspeccion-autobus';
import { CampoInspeccionComponent } from './CampoInspeccionComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface PlantillaRendererProps {
  plantilla: PlantillaMatriz;
  onRespuestasChange: (respuestas: RespuestaSeccion[], calificacionFinal: number, completed: boolean) => void;
}

// Función para filtrar campos de firma (canvas que contengan "firma" en la etiqueta)
const filtrarCamposFirma = (campos: CampoPlantilla[]): CampoPlantilla[] => {
  return campos.filter(campo => 
    !(campo.tipo === 'canvas' && campo.etiqueta.toLowerCase().includes('firma'))
  );
};

// Función para filtrar secciones y sus campos
const filtrarPlantilla = (plantilla: PlantillaMatriz): PlantillaMatriz => {
  return {
    ...plantilla,
    secciones: plantilla.secciones.map(seccion => ({
      ...seccion,
      campos: filtrarCamposFirma(seccion.campos)
    })).filter(seccion => seccion.campos.length > 0) // Remover secciones sin campos
  };
};

export function PlantillaRenderer({ plantilla, onRespuestasChange }: PlantillaRendererProps) {
  const [respuestasSecciones, setRespuestasSecciones] = useState<RespuestaSeccion[]>([]);
  
  // Filtrar la plantilla para remover campos de firma
  const plantillaFiltrada = filtrarPlantilla(plantilla);

  // Inicializar respuestas cuando cambie la plantilla
  useEffect(() => {
    const inicializarRespuestas = () => {
      const respuestasIniciales: RespuestaSeccion[] = plantillaFiltrada.secciones.map((seccion) => ({
        seccionId: seccion.id,
        respuestas: seccion.campos.map((campo) => ({
          campoId: campo.id,
          valor: campo.valorDefecto || (campo.tipo === 'checkbox' ? false : ''),
        })),
        puntuacionSeccion: 0,
      }));
      
      setRespuestasSecciones(respuestasIniciales);
    };

    inicializarRespuestas();
  }, [plantillaFiltrada]);

  // Calcular puntuaciones y verificar completitud
  const handleCampoChange = (seccionId: string, campoId: string, valor: string | boolean | Date) => {
    setRespuestasSecciones(prevRespuestas => {
      const nuevasRespuestas = prevRespuestas.map(respuestaSeccion => {
        if (respuestaSeccion.seccionId === seccionId) {
          const nuevasRespuestasCampos = respuestaSeccion.respuestas.map(respuestaCampo => {
            if (respuestaCampo.campoId === campoId) {
              return { ...respuestaCampo, valor };
            }
            return respuestaCampo;
          });

          // Encontrar la sección actual para calcular puntuación
          const seccionActual = plantillaFiltrada.secciones.find(s => s.id === seccionId);
          if (!seccionActual) return respuestaSeccion;

          // Calcular puntuación de la sección
          let puntuacionSeccion = 0;
          nuevasRespuestasCampos.forEach(respuestaCampo => {
            const campo = seccionActual.campos.find(c => c.id === respuestaCampo.campoId);
            if (!campo) return;

            let puntuacionCampo = 0;
            const valor = respuestaCampo.valor;

            // Lógica de puntuación basada en el tipo de campo
            switch (campo.tipo) {
              case 'checkbox':
                puntuacionCampo = valor === true ? campo.peso : 0;
                break;
              case 'select':
              case 'radio':
                puntuacionCampo = valor !== '' ? campo.peso : 0;
                break;
              case 'texto':
              case 'fecha':
              case 'canvas':
                puntuacionCampo = valor !== '' ? campo.peso : 0;
                break;
            }

            puntuacionSeccion += puntuacionCampo;
          });

          return {
            ...respuestaSeccion,
            respuestas: nuevasRespuestasCampos,
            puntuacionSeccion
          };
        }
        return respuestaSeccion;
      });

      // Calcular puntuación final y verificar completitud
      const calificacionFinal = nuevasRespuestas.reduce((total, seccion) => total + seccion.puntuacionSeccion, 0);
      
      // Verificar si todos los campos requeridos están completados
      let todosCompletados = true;
      
      for (const seccion of plantillaFiltrada.secciones) {
        const respuestaSeccion = nuevasRespuestas.find(r => r.seccionId === seccion.id);
        if (!respuestaSeccion) {
          todosCompletados = false;
          break;
        }

        for (const campo of seccion.campos) {
          if (campo.requerido) {
            const respuestaCampo = respuestaSeccion.respuestas.find(r => r.campoId === campo.id);
            if (!respuestaCampo || respuestaCampo.valor === '' || respuestaCampo.valor === false) {
              todosCompletados = false;
              break;
            }
          }
        }

        if (!todosCompletados) break;
      }

      // Notificar cambios al componente padre
      onRespuestasChange(nuevasRespuestas, calificacionFinal, todosCompletados);

      return nuevasRespuestas;
    });
  };

  // Función auxiliar para calcular progreso de una sección
  const calcularProgresoSeccion = (seccion: SeccionPlantilla, respuestas: RespuestaCampo[]): number => {
    const camposRequeridos = seccion.campos.filter(campo => campo.requerido);
    if (camposRequeridos.length === 0) return 100;

    let completados = 0;
    camposRequeridos.forEach(campo => {
      const respuesta = respuestas.find(r => r.campoId === campo.id);
      if (respuesta && respuesta.valor !== '' && respuesta.valor !== false) {
        completados++;
      }
    });

    return Math.round((completados / camposRequeridos.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {plantillaFiltrada.secciones.map((seccion) => {
          const respuestaSeccion = respuestasSecciones.find(r => r.seccionId === seccion.id);
          const progreso = respuestaSeccion ? calcularProgresoSeccion(seccion, respuestaSeccion.respuestas) : 0;

          return (
            <Card key={seccion.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{seccion.nombre}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Peso: {seccion.peso}%
                    </span>
                    <span className="text-sm font-medium">
                      Score: {respuestaSeccion?.puntuacionSeccion || 0}/{seccion.peso}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso de campos requeridos</span>
                    <span>{progreso}%</span>
                  </div>
                  <Progress value={progreso} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {seccion.campos.map((campo) => {
                    const respuestaCampo = respuestaSeccion?.respuestas.find(r => r.campoId === campo.id);
                    const valor = respuestaCampo?.valor;

                    return (
                      <CampoInspeccionComponent
                        key={campo.id}
                        campo={campo}
                        valor={valor}
                        onChange={(valor) => handleCampoChange(seccion.id, campo.id, valor)}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}