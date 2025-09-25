import React from 'react';
import { Button } from "@/components/ui/button";
import { BitacoraUsuario, BitacoraUsuarioFilter } from "@/types/bitacora-usuario";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BitacorasUsuariosExportProps {
  bitacoras: BitacoraUsuario[];
  filtros: BitacoraUsuarioFilter;
}

const BitacorasUsuariosExport: React.FC<BitacorasUsuariosExportProps> = ({ 
  bitacoras, 
  filtros 
}) => {
  const { toast } = useToast();

  const formatearFiltrosParaReporte = (filtros: BitacoraUsuarioFilter) => {
    const filtrosTexto = [];
    
    if (filtros.fechaInicio) {
      const fecha = new Date(filtros.fechaInicio).toLocaleDateString('es-ES');
      filtrosTexto.push(`Fecha inicio: ${fecha}`);
    }
    
    if (filtros.fechaFin) {
      const fecha = new Date(filtros.fechaFin).toLocaleDateString('es-ES');
      filtrosTexto.push(`Fecha fin: ${fecha}`);
    }
    
    if (filtros.usuario) {
      filtrosTexto.push(`Usuario: ${filtros.usuario}`);
    }
    
    if (filtros.tipoAccion && filtros.tipoAccion !== 'todos') {
      filtrosTexto.push(`Tipo de acción: ${filtros.tipoAccion}`);
    }
    
    if (filtros.resultado && filtros.resultado !== 'todos') {
      filtrosTexto.push(`Resultado: ${filtros.resultado}`);
    }
    
    if (filtros.textoDescripcion) {
      filtrosTexto.push(`Descripción contiene: ${filtros.textoDescripcion}`);
    }
    
    return filtrosTexto.join(' | ');
  };

  const exportToPDF = async () => {
    try {
      if (bitacoras.length === 0) {
        toast({
          variant: "destructive",
          title: "Sin datos",
          description: "No hay registros para exportar."
        });
        return;
      }

      // Simular generación de PDF
      const filtrosAplicados = formatearFiltrosParaReporte(filtros);
      const fechaGeneracion = new Date().toLocaleDateString('es-ES');
      
      // Crear contenido del PDF simulado
      const contenidoPDF = `
SISTEMA DE GESTIÓN DE TRANSPORTE
BITÁCORAS DE ACCIONES DE USUARIO
Fecha de generación: ${fechaGeneracion}

FILTROS APLICADOS:
${filtrosAplicados || 'Ningún filtro aplicado'}

REGISTROS (${bitacoras.length} total):
${bitacoras.map((bitacora, index) => `
${index + 1}. ${new Date(bitacora.fechaHora).toLocaleString('es-ES')} | ${bitacora.usuario} | ${bitacora.nombreCompleto} | ${bitacora.tipoAccion} | ${bitacora.resultado}
   Acción: ${bitacora.accion}
   ${bitacora.descripcion ? `Descripción: ${bitacora.descripcion}` : ''}
`).join('')}
      `;

      // Simular descarga
      const blob = new Blob([contenidoPDF], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bitacoras_Usuario_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Las bitácoras han sido exportadas a PDF correctamente."
      });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo exportar a PDF. Por favor, intente nuevamente."
      });
    }
  };

  const exportToExcel = async () => {
    try {
      if (bitacoras.length === 0) {
        toast({
          variant: "destructive",
          title: "Sin datos",
          description: "No hay registros para exportar."
        });
        return;
      }

      // Simular generación de Excel
      const headers = [
        'Fecha y Hora',
        'Usuario',
        'Nombre Completo',
        'Perfil',
        'Zona Franca',
        'Acción',
        'Tipo de Acción',
        'Resultado',
        'Descripción'
      ];

      const csvContent = [
        headers.join(','),
        ...bitacoras.map(bitacora => [
          new Date(bitacora.fechaHora).toLocaleString('es-ES'),
          bitacora.usuario,
          bitacora.nombreCompleto,
          bitacora.perfil,
          bitacora.zonaFranca,
          `"${bitacora.accion}"`,
          bitacora.tipoAccion,
          bitacora.resultado,
          `"${bitacora.descripcion || ''}"`
        ].join(','))
      ].join('\n');

      // Simular descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bitacoras_Usuario_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Las bitácoras han sido exportadas a Excel correctamente."
      });
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo exportar a Excel. Por favor, intente nuevamente."
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-2"
        disabled={bitacoras.length === 0}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-2"
        disabled={bitacoras.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
    </div>
  );
};

export default BitacorasUsuariosExport;