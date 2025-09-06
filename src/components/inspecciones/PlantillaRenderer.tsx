import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CampoInspeccionComponent } from './CampoInspeccionComponent';
import { PlantillaInspeccion, SeccionInspeccion, RespuestaSeccion, RespuestaCampo } from '@/types/inspeccion-autobus';

interface PlantillaRendererProps {
  plantilla: PlantillaInspeccion;
  onRespuestasChange: (respuestas: RespuestaSeccion[], calificacionFinal: number, completed: boolean) => void;
}

export function PlantillaRenderer({ plantilla, onRespuestasChange }: PlantillaRendererProps) {
  const [respuestasSecciones, setRespuestasSecciones] = useState<RespuestaSeccion[]>([]);

  useEffect(() => {
    // Inicializar respuestas vacías para todas las secciones
    const respuestasIniciales: RespuestaSeccion[] = plantilla.secciones.map(seccion => ({
      seccionId: seccion.id,
      respuestas: [],
      puntuacionSeccion: 0
    }));
    setRespuestasSecciones(respuestasIniciales);
  }, [plantilla]);

  const handleCampoChange = (seccionId: string, campoId: string, valor: string | boolean | Date) => {
    setRespuestasSecciones(prev => {
      const nuevasRespuestas = prev.map(seccionResp => {
        if (seccionResp.seccionId === seccionId) {
          const nuevasRespuestasCampos = [...seccionResp.respuestas];
          const indiceExistente = nuevasRespuestasCampos.findIndex(r => r.campoId === campoId);
          
          // Calcular puntuación del campo
          const seccion = plantilla.secciones.find(s => s.id === seccionId);
          const campo = seccion?.campos.find(c => c.id === campoId);
          let puntuacion = 0;
          
          if (campo) {
            if (campo.tipo === 'checkbox') {
              puntuacion = valor === true ? campo.peso : 0;
            } else if (campo.tipo === 'select' || campo.tipo === 'radio') {
              // Puntuación basada en la opción seleccionada
              const opciones = campo.opciones || [];
              const indiceOpcion = opciones.indexOf(valor as string);
              if (indiceOpcion !== -1) {
                // Puntuación proporcional: primera opción = peso completo, última = peso mínimo
                puntuacion = Math.round(campo.peso * (opciones.length - indiceOpcion) / opciones.length);
              }
            } else if (campo.tipo === 'texto' || campo.tipo === 'fecha' || campo.tipo === 'canvas') {
              // Para campos de texto, fecha y canvas, dar puntuación completa si hay valor
              puntuacion = valor && valor.toString().trim() !== '' ? campo.peso : 0;
            }
          }
          
          const nuevaRespuesta: RespuestaCampo = {
            campoId,
            valor,
            puntuacion
          };

          if (indiceExistente >= 0) {
            nuevasRespuestasCampos[indiceExistente] = nuevaRespuesta;
          } else {
            nuevasRespuestasCampos.push(nuevaRespuesta);
          }

          // Calcular puntuación de la sección
          const puntuacionSeccion = nuevasRespuestasCampos.reduce((sum, resp) => sum + (resp.puntuacion || 0), 0);

          return {
            ...seccionResp,
            respuestas: nuevasRespuestasCampos,
            puntuacionSeccion
          };
        }
        return seccionResp;
      });

      // Calcular calificación final
      const puntuacionTotal = nuevasRespuestas.reduce((sum, seccion) => sum + seccion.puntuacionSeccion, 0);
      const calificacionFinal = Math.round((puntuacionTotal / plantilla.pesoTotal) * 100);

      // Verificar si está completo
      let todosLosRequeridosCompletos = true;
      for (const seccion of plantilla.secciones) {
        const respuestaSeccion = nuevasRespuestas.find(r => r.seccionId === seccion.id);
        if (respuestaSeccion) {
          for (const campo of seccion.campos) {
            if (campo.requerido) {
              const respuestaCampo = respuestaSeccion.respuestas.find(r => r.campoId === campo.id);
              if (!respuestaCampo || respuestaCampo.valor === '' || respuestaCampo.valor === null || respuestaCampo.valor === undefined) {
                todosLosRequeridosCompletos = false;
                break;
              }
            }
          }
        } else {
          todosLosRequeridosCompletos = false;
          break;
        }
      }

      // Notificar cambios al componente padre
      onRespuestasChange(nuevasRespuestas, calificacionFinal, todosLosRequeridosCompletos);

      return nuevasRespuestas;
    });
  };

  const calcularProgresoSeccion = (seccion: SeccionInspeccion): number => {
    const respuestaSeccion = respuestasSecciones.find(r => r.seccionId === seccion.id);
    if (!respuestaSeccion) return 0;

    const camposRequeridos = seccion.campos.filter(c => c.requerido);
    const camposCompletados = camposRequeridos.filter(campo => {
      const respuesta = respuestaSeccion.respuestas.find(r => r.campoId === campo.id);
      return respuesta && respuesta.valor !== '' && respuesta.valor !== null && respuesta.valor !== undefined;
    });

    return camposRequeridos.length > 0 ? (camposCompletados.length / camposRequeridos.length) * 100 : 100;
  };

  return (
    <div className="space-y-6">

      {plantilla.secciones.map((seccion, index) => {
        const progreso = calcularProgresoSeccion(seccion);
        const respuestaSeccion = respuestasSecciones.find(r => r.seccionId === seccion.id);
        
        return (
          <Card key={seccion.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {index + 1}. {seccion.nombre}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Peso: {seccion.peso} pts
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progreso de la sección</span>
                  <span>{Math.round(progreso)}%</span>
                </div>
                <Progress value={progreso} className="h-2" />
                {respuestaSeccion && (
                  <div className="text-sm text-muted-foreground">
                    Puntuación obtenida: {respuestaSeccion.puntuacionSeccion} / {seccion.peso}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {seccion.campos.map(campo => (
                <CampoInspeccionComponent
                  key={campo.id}
                  campo={campo}
                  valor={respuestasSecciones
                    .find(r => r.seccionId === seccion.id)
                    ?.respuestas.find(r => r.campoId === campo.id)?.valor}
                  onChange={(valor) => handleCampoChange(seccion.id, campo.id, valor)}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}