import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Users, Calendar, User } from "lucide-react";
import { mockSondeosRutas } from "@/data/mockSondeosRutas";
import { mockTurnos } from "@/data/mockTurnos";
import { format } from "date-fns";
import { SondeoRutaMap } from "@/components/sondeos-rutas/SondeoRutaMap";

const DetalleSondeo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const sondeo = mockSondeosRutas.find(s => s.id === id);

  // TODO: Obtener idioma del usuario (por ahora español)
  const userLanguage = 'es';

  if (!sondeo) {
    return (
      <Layout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => navigate('/sondeos-rutas')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Sondeo no encontrado</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const titulo = userLanguage === 'es' ? sondeo.tituloEs : sondeo.tituloEn;
  const mensaje = userLanguage === 'es' ? sondeo.mensajeEs : sondeo.mensajeEn;

  const getTurnoNombre = (turnoId: string) => {
    return mockTurnos.find(t => t.id === turnoId)?.nombre || turnoId;
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'publicado':
        return 'default';
      case 'borrador':
        return 'secondary';
      case 'finalizado':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/sondeos-rutas')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <Badge variant={getEstadoBadgeVariant(sondeo.estado)}>
            {sondeo.estado.charAt(0).toUpperCase() + sondeo.estado.slice(1)}
          </Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{titulo}</h1>
          <p className="text-muted-foreground mt-1">
            Detalle completo del sondeo de ruta
          </p>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Fecha de Publicación</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(sondeo.fechaPublicacion), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Creado por</p>
                  <p className="text-sm text-muted-foreground">{sondeo.usuarioCreacion}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pasajeros Elegibles</p>
                  <p className="text-sm text-muted-foreground">{sondeo.pasajerosElegibles}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Radio de Búsqueda</p>
                  <p className="text-sm text-muted-foreground">{sondeo.radioKm} km</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-1">Turnos Objetivo</p>
              <div className="flex flex-wrap gap-2">
                {sondeo.turnosObjetivo.map(turnoId => (
                  <Badge key={turnoId} variant="secondary">
                    {getTurnoNombre(turnoId)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Tipo de Trazado</p>
              <p className="text-sm text-muted-foreground">
                {sondeo.tipoTrazado === 'dibujado' ? 'Dibujado manualmente' : `Basado en ruta existente: ${sondeo.rutaExistenteNombre}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contenido Bilingüe */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Sondeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">Español</h3>
                <div>
                  <p className="text-sm font-medium mb-1">Título</p>
                  <p className="text-base">{sondeo.tituloEs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Mensaje</p>
                  <p className="text-base">{sondeo.mensajeEs}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">English</h3>
                <div>
                  <p className="text-sm font-medium mb-1">Title</p>
                  <p className="text-base">{sondeo.tituloEn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Message</p>
                  <p className="text-base">{sondeo.mensajeEn}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preguntas */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas del Sondeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sondeo.preguntas.map((pregunta, index) => (
              <div key={pregunta.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-lg">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="font-medium">{pregunta.textoEs}</p>
                        {pregunta.obligatoria && (
                          <Badge variant="outline" className="mt-1">Obligatoria</Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 space-y-1">
                      {pregunta.opciones.map((opcion, oIndex) => (
                        <div key={opcion.id} className="flex items-center gap-2">
                          <span className="text-muted-foreground">{String.fromCharCode(97 + oIndex)})</span>
                          <span className="text-sm">{opcion.textoEs}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-lg">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="font-medium">{pregunta.textoEn}</p>
                        {pregunta.obligatoria && (
                          <Badge variant="outline" className="mt-1">Required</Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 space-y-1">
                      {pregunta.opciones.map((opcion, oIndex) => (
                        <div key={opcion.id} className="flex items-center gap-2">
                          <span className="text-muted-foreground">{String.fromCharCode(97 + oIndex)})</span>
                          <span className="text-sm">{opcion.textoEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < sondeo.preguntas.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mapa del Trazado */}
        <Card>
          <CardHeader>
            <CardTitle>Trazado de la Ruta</CardTitle>
          </CardHeader>
          <CardContent>
            <SondeoRutaMap 
              puntos={sondeo.trazado} 
              onPuntosChange={() => {}} 
              isDrawingEnabled={false}
              soloLectura={true}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalleSondeo;
