import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SondeoRutaMap } from "@/components/sondeos-rutas/SondeoRutaMap";
import { ArrowLeft, Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { PuntoTrazado, PreguntaSondeo, OpcionPregunta, TipoTrazado } from "@/types/sondeo-ruta";
import { mockTurnos } from "@/data/mockTurnos";
import { mockRutasDisponibles } from "@/data/mockRutasDisponibles";
import { Checkbox } from "@/components/ui/checkbox";

const NuevoSondeoRuta = () => {
  const navigate = useNavigate();
  
  // Form state
  const [tituloEs, setTituloEs] = useState('');
  const [tituloEn, setTituloEn] = useState('');
  const [mensajeEs, setMensajeEs] = useState('');
  const [mensajeEn, setMensajeEn] = useState('');
  const [tipoTrazado, setTipoTrazado] = useState<TipoTrazado>('dibujado');
  const [rutaExistenteId, setRutaExistenteId] = useState('');
  const [puntosTrazado, setPuntosTrazado] = useState<PuntoTrazado[]>([]);
  const [turnosSeleccionados, setTurnosSeleccionados] = useState<string[]>([]);
  const [radioKm, setRadioKm] = useState<number>(5);
  
  // Pregunta obligatoria por defecto
  const [preguntas, setPreguntas] = useState<PreguntaSondeo[]>([
    {
      id: 'p_default',
      textoEs: '¿Está interesado en usar esta nueva ruta?',
      textoEn: 'Are you interested in using this new route?',
      obligatoria: true,
      orden: 1,
      opciones: [
        { id: 'o_default_1', textoEs: 'Sí', textoEn: 'Yes', orden: 1 },
        { id: 'o_default_2', textoEs: 'No', textoEn: 'No', orden: 2 }
      ]
    }
  ]);

  const handleAgregarPregunta = () => {
    if (preguntas.length >= 10) {
      toast.error('Máximo 10 preguntas permitidas');
      return;
    }

    const nuevaPregunta: PreguntaSondeo = {
      id: `p_${Date.now()}`,
      textoEs: '',
      textoEn: '',
      obligatoria: false,
      orden: preguntas.length + 1,
      opciones: [
        { id: `o_${Date.now()}_1`, textoEs: '', textoEn: '', orden: 1 },
        { id: `o_${Date.now()}_2`, textoEs: '', textoEn: '', orden: 2 }
      ]
    };

    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const handleEliminarPregunta = (preguntaId: string) => {
    // No permitir eliminar la pregunta obligatoria
    const pregunta = preguntas.find(p => p.id === preguntaId);
    if (pregunta?.obligatoria) {
      toast.error('No se puede eliminar la pregunta obligatoria');
      return;
    }

    const nuevasPreguntas = preguntas.filter(p => p.id !== preguntaId);
    // Reordenar
    const preguntasReordenadas = nuevasPreguntas.map((p, i) => ({ ...p, orden: i + 1 }));
    setPreguntas(preguntasReordenadas);
  };

  const handleActualizarPregunta = (preguntaId: string, campo: string, valor: any) => {
    setPreguntas(preguntas.map(p => 
      p.id === preguntaId ? { ...p, [campo]: valor } : p
    ));
  };

  const handleAgregarOpcion = (preguntaId: string) => {
    setPreguntas(preguntas.map(p => {
      if (p.id === preguntaId) {
        if (p.opciones.length >= 8) {
          toast.error('Máximo 8 opciones por pregunta');
          return p;
        }
        const nuevaOpcion: OpcionPregunta = {
          id: `o_${Date.now()}`,
          textoEs: '',
          textoEn: '',
          orden: p.opciones.length + 1
        };
        return { ...p, opciones: [...p.opciones, nuevaOpcion] };
      }
      return p;
    }));
  };

  const handleEliminarOpcion = (preguntaId: string, opcionId: string) => {
    setPreguntas(preguntas.map(p => {
      if (p.id === preguntaId) {
        if (p.opciones.length <= 2) {
          toast.error('Mínimo 2 opciones por pregunta');
          return p;
        }
        const nuevasOpciones = p.opciones.filter(o => o.id !== opcionId);
        const opcionesReordenadas = nuevasOpciones.map((o, i) => ({ ...o, orden: i + 1 }));
        return { ...p, opciones: opcionesReordenadas };
      }
      return p;
    }));
  };

  const handleActualizarOpcion = (preguntaId: string, opcionId: string, campo: 'textoEs' | 'textoEn', valor: string) => {
    setPreguntas(preguntas.map(p => {
      if (p.id === preguntaId) {
        return {
          ...p,
          opciones: p.opciones.map(o => 
            o.id === opcionId ? { ...o, [campo]: valor } : o
          )
        };
      }
      return p;
    }));
  };

  const handleToggleTurno = (turnoId: string) => {
    setTurnosSeleccionados(prev => 
      prev.includes(turnoId) 
        ? prev.filter(id => id !== turnoId)
        : [...prev, turnoId]
    );
  };

  const validarFormulario = (): boolean => {
    if (!tituloEs.trim() || !tituloEn.trim()) {
      toast.error('El título en español e inglés es obligatorio');
      return false;
    }
    if (tituloEs.length > 120 || tituloEn.length > 120) {
      toast.error('El título no puede exceder 120 caracteres');
      return false;
    }
    if (!mensajeEs.trim() || !mensajeEn.trim()) {
      toast.error('El mensaje en español e inglés es obligatorio');
      return false;
    }
    if (mensajeEs.length > 1000 || mensajeEn.length > 1000) {
      toast.error('El mensaje no puede exceder 1000 caracteres');
      return false;
    }
    if (tipoTrazado === 'dibujado' && puntosTrazado.length < 2) {
      toast.error('Debe dibujar al menos 2 puntos en el mapa');
      return false;
    }
    if (tipoTrazado === 'ruta-existente' && !rutaExistenteId) {
      toast.error('Debe seleccionar una ruta existente');
      return false;
    }
    if (turnosSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un turno');
      return false;
    }
    if (radioKm < 1 || radioKm > 30) {
      toast.error('El radio debe estar entre 1 y 30 km');
      return false;
    }

    // Validar preguntas
    for (const pregunta of preguntas) {
      if (!pregunta.textoEs.trim() || !pregunta.textoEn.trim()) {
        toast.error('Todas las preguntas deben tener texto en español e inglés');
        return false;
      }
      if (pregunta.textoEs.length > 200 || pregunta.textoEn.length > 200) {
        toast.error('El texto de las preguntas no puede exceder 200 caracteres');
        return false;
      }
      if (pregunta.opciones.length < 2) {
        toast.error('Cada pregunta debe tener al menos 2 opciones');
        return false;
      }
      for (const opcion of pregunta.opciones) {
        if (!opcion.textoEs.trim() || !opcion.textoEn.trim()) {
          toast.error('Todas las opciones deben tener texto en español e inglés');
          return false;
        }
        if (opcion.textoEs.length > 80 || opcion.textoEn.length > 80) {
          toast.error('El texto de las opciones no puede exceder 80 caracteres');
          return false;
        }
      }
    }

    return true;
  };

  const handlePublicar = () => {
    if (!validarFormulario()) {
      return;
    }

    // Simular guardado y publicación
    toast.success('Sondeo publicado y notificaciones en proceso de envío.');
    
    // TODO: Aquí iría la llamada al backend
    console.log({
      tituloEs,
      tituloEn,
      mensajeEs,
      mensajeEn,
      tipoTrazado,
      rutaExistenteId,
      puntosTrazado,
      preguntas,
      turnosSeleccionados,
      radioKm
    });

    navigate('/sondeos-rutas');
  };

  // Cargar puntos de ruta existente si se selecciona
  const handleSeleccionarRutaExistente = (rutaId: string) => {
    setRutaExistenteId(rutaId);
    
    // Buscar la ruta seleccionada en el mock
    const rutaSeleccionada = mockRutasDisponibles.find(r => r.id === rutaId);
    
    if (rutaSeleccionada && rutaSeleccionada.puntos) {
      // Cargar los puntos de la ruta seleccionada
      setPuntosTrazado(rutaSeleccionada.puntos);
    } else {
      // Si no tiene puntos definidos, usar puntos de ejemplo
      setPuntosTrazado([
        { lat: 9.9200, lng: -84.1000, orden: 1 },
        { lat: 9.9250, lng: -84.0950, orden: 2 },
        { lat: 9.9300, lng: -84.0900, orden: 3 },
        { lat: 9.9350, lng: -84.0850, orden: 4 },
      ]);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sondeos-rutas')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nuevo Sondeo de Ruta</h1>
            <p className="text-muted-foreground mt-1">
              Crear encuesta para evaluar interés en nueva ruta
            </p>
          </div>
        </div>

        <form className="space-y-6">
          {/* Sección: Trazado */}
          <Card>
            <CardHeader>
              <CardTitle>1. Trazado de la Ruta</CardTitle>
              <CardDescription>
                Dibuje el recorrido en el mapa o seleccione una ruta existente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Trazado *</Label>
                <Select value={tipoTrazado} onValueChange={(value) => setTipoTrazado(value as TipoTrazado)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dibujado">Dibujar recorrido</SelectItem>
                    <SelectItem value="ruta-existente">Seleccionar ruta existente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoTrazado === 'ruta-existente' && (
                <div className="space-y-2">
                  <Label htmlFor="rutaExistente">Ruta Existente * (filtrable por nombre/código)</Label>
                  <Select value={rutaExistenteId} onValueChange={handleSeleccionarRutaExistente}>
                    <SelectTrigger id="rutaExistente">
                      <SelectValue placeholder="Seleccionar ruta..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {mockRutasDisponibles.map((ruta) => (
                        <SelectItem key={ruta.id} value={ruta.id}>
                          {ruta.nombre} ({ruta.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Al seleccionar la ruta, se mostrará su recorrido en el mapa en modo solo lectura
                  </p>
                </div>
              )}

              <SondeoRutaMap
                puntos={puntosTrazado}
                onPuntosChange={setPuntosTrazado}
                isDrawingEnabled={tipoTrazado === 'dibujado'}
                soloLectura={tipoTrazado === 'ruta-existente'}
              />
            </CardContent>
          </Card>

          {/* Sección: Datos del Sondeo */}
          <Card>
            <CardHeader>
              <CardTitle>2. Datos del Sondeo</CardTitle>
              <CardDescription>
                Información general de la encuesta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tituloEs">Título (Español) *</Label>
                  <Input
                    id="tituloEs"
                    placeholder="Ej: Ruta San José - Cartago Express"
                    value={tituloEs}
                    onChange={(e) => setTituloEs(e.target.value)}
                    maxLength={120}
                  />
                  <p className="text-xs text-muted-foreground">
                    {tituloEs.length}/120 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tituloEn">Título (inglés) *</Label>
                  <Input
                    id="tituloEn"
                    placeholder="Ex: San José - Cartago Express Route"
                    value={tituloEn}
                    onChange={(e) => setTituloEn(e.target.value)}
                    maxLength={120}
                  />
                  <p className="text-xs text-muted-foreground">
                    {tituloEn.length}/120 characters
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mensajeEs">Mensaje (Español) *</Label>
                  <Textarea
                    id="mensajeEs"
                    placeholder="Descripción del sondeo que verán los pasajeros..."
                    value={mensajeEs}
                    onChange={(e) => setMensajeEs(e.target.value)}
                    maxLength={1000}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {mensajeEs.length}/1000 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensajeEn">Mensaje (inglés) *</Label>
                  <Textarea
                    id="mensajeEn"
                    placeholder="Survey description that passengers will see..."
                    value={mensajeEn}
                    onChange={(e) => setMensajeEn(e.target.value)}
                    maxLength={1000}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {mensajeEn.length}/1000 characters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Preguntas */}
          <Card>
            <CardHeader>
              <CardTitle>3. Preguntas del Sondeo</CardTitle>
              <CardDescription>
                Configure las preguntas de la encuesta (máximo 10)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {preguntas.map((pregunta, pIndex) => (
                <div key={pregunta.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Pregunta {pIndex + 1}</Label>
                        {pregunta.obligatoria && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Obligatoria
                          </span>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Pregunta (Español)</Label>
                          <Input
                            placeholder="Texto de la pregunta..."
                            value={pregunta.textoEs}
                            onChange={(e) => handleActualizarPregunta(pregunta.id, 'textoEs', e.target.value)}
                            maxLength={200}
                            disabled={pregunta.obligatoria && pIndex === 0}
                          />
                          <p className="text-xs text-muted-foreground">
                            {pregunta.textoEs.length}/200 caracteres
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Pregunta (inglés)</Label>
                          <Input
                            placeholder="Question text..."
                            value={pregunta.textoEn}
                            onChange={(e) => handleActualizarPregunta(pregunta.id, 'textoEn', e.target.value)}
                            maxLength={200}
                            disabled={pregunta.obligatoria && pIndex === 0}
                          />
                          <p className="text-xs text-muted-foreground">
                            {pregunta.textoEn.length}/200 characters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Opciones</Label>
                        {pregunta.opciones.map((opcion, oIndex) => (
                          <div key={opcion.id} className="grid md:grid-cols-2 gap-2">
                            <Input
                              placeholder={`Opción ${oIndex + 1} (Español)`}
                              value={opcion.textoEs}
                              onChange={(e) => handleActualizarOpcion(pregunta.id, opcion.id, 'textoEs', e.target.value)}
                              maxLength={80}
                            />
                            <div className="flex gap-2">
                              <Input
                                placeholder={`Option ${oIndex + 1} (inglés)`}
                                value={opcion.textoEn}
                                onChange={(e) => handleActualizarOpcion(pregunta.id, opcion.id, 'textoEn', e.target.value)}
                                maxLength={80}
                              />
                              {pregunta.opciones.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEliminarOpcion(pregunta.id, opcion.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {pregunta.opciones.length < 8 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAgregarOpcion(pregunta.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Opción
                          </Button>
                        )}
                      </div>
                    </div>

                    {!pregunta.obligatoria && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEliminarPregunta(pregunta.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {preguntas.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAgregarPregunta}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Pregunta
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Sección: Segmentación */}
          <Card>
            <CardHeader>
              <CardTitle>4. Segmentación</CardTitle>
              <CardDescription>
                Defina el público objetivo del sondeo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Turnos Objetivo *</Label>
                <div className="space-y-2">
                  {mockTurnos.map((turno) => (
                    <div key={turno.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`turno-${turno.id}`}
                        checked={turnosSeleccionados.includes(turno.id)}
                        onCheckedChange={() => handleToggleTurno(turno.id)}
                      />
                      <Label htmlFor={`turno-${turno.id}`} className="font-normal cursor-pointer">
                        {turno.nombre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="radioKm">Radio de Alcance (km) *</Label>
                <Input
                  id="radioKm"
                  type="number"
                  min={1}
                  max={30}
                  value={radioKm}
                  onChange={(e) => setRadioKm(parseInt(e.target.value) || 5)}
                />
                <p className="text-xs text-muted-foreground">
                  Distancia máxima desde el trazado para considerar pasajeros elegibles (1-30 km)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/sondeos-rutas')}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handlePublicar}>
              <Send className="h-4 w-4 mr-2" />
              Publicar Sondeo
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevoSondeoRuta;
