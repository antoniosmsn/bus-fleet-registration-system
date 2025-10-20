import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileDown } from "lucide-react";
import { mockSondeosRutas } from "@/data/mockSondeosRutas";
import { mockRespuestasSondeos } from "@/data/mockRespuestasSondeos";
import { format } from "date-fns";
import { ResultadoConsolidado } from "@/types/sondeo-ruta";
import { toast } from "sonner";

const ResultadosSondeo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const sondeo = mockSondeosRutas.find(s => s.id === id);
  const respuestas = mockRespuestasSondeos.filter(r => r.sondeoId === id);

  // TODO: Obtener idioma del usuario
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

  // Calcular resultados consolidados
  const resultados: ResultadoConsolidado[] = sondeo.preguntas.map(pregunta => {
    const respuestasPregunta = respuestas.filter(r => r.questionId === pregunta.id);
    const totalRespuestas = respuestasPregunta.length;

    const opciones = pregunta.opciones.map(opcion => {
      const cantidad = respuestasPregunta.filter(r => r.optionId === opcion.id).length;
      const porcentaje = totalRespuestas > 0 ? (cantidad / totalRespuestas) * 100 : 0;

      return {
        optionId: opcion.id,
        textoEs: opcion.textoEs,
        textoEn: opcion.textoEn,
        cantidad,
        porcentaje: Math.round(porcentaje * 100) / 100
      };
    });

    return {
      questionId: pregunta.id,
      questionTextoEs: pregunta.textoEs,
      questionTextoEn: pregunta.textoEn,
      opciones,
      totalRespuestas
    };
  });

  const titulo = userLanguage === 'es' ? sondeo.tituloEs : sondeo.tituloEn;

  const handleExportPDF = () => {
    toast.info("Exportando a PDF...");
    // TODO: Implementar exportación a PDF
  };

  const handleExportExcel = () => {
    toast.info("Exportando a Excel...");
    // TODO: Implementar exportación a Excel
  };

  const totalRespuestasGlobal = respuestas.length;
  const tasaRespuesta = sondeo.pasajerosElegibles > 0 
    ? ((totalRespuestasGlobal / sondeo.pasajerosElegibles) * 100).toFixed(2)
    : '0.00';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/sondeos-rutas')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Resultados del Sondeo</h1>
          <p className="text-muted-foreground mt-1">{titulo}</p>
        </div>

        {/* Resumen General */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID del Sondeo</p>
                <p className="text-2xl font-bold">{sondeo.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Publicación</p>
                <p className="text-lg font-semibold">
                  {format(new Date(sondeo.fechaPublicacion), 'dd/MM/yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuario</p>
                <p className="text-lg font-semibold">{sondeo.usuarioCreacion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pasajeros Elegibles</p>
                <p className="text-2xl font-bold">{sondeo.pasajerosElegibles}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Respuestas</p>
                  <p className="text-2xl font-bold">{totalRespuestasGlobal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de Respuesta</p>
                  <p className="text-2xl font-bold">{tasaRespuesta}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados por Pregunta */}
        {resultados.map((resultado, index) => {
          const textoPreguntas = userLanguage === 'es' 
            ? resultado.questionTextoEs 
            : resultado.questionTextoEn;

          return (
            <Card key={resultado.questionId}>
              <CardHeader>
                <CardTitle>
                  Pregunta {index + 1}: {textoPreguntas}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total de respuestas: {resultado.totalRespuestas}
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opción</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-center">Porcentaje</TableHead>
                        <TableHead>Gráfico</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultado.opciones.map((opcion) => {
                        const textoOpcion = userLanguage === 'es' 
                          ? opcion.textoEs 
                          : opcion.textoEn;

                        return (
                          <TableRow key={opcion.optionId}>
                            <TableCell className="font-medium">{textoOpcion}</TableCell>
                            <TableCell className="text-center font-semibold">
                              {opcion.cantidad}
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {opcion.porcentaje.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
                                  <div 
                                    className="bg-primary h-full transition-all"
                                    style={{ width: `${opcion.porcentaje}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default ResultadosSondeo;
