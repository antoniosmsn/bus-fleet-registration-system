import { useState, useMemo } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import FiltrosHistorialSinpe from '@/components/recargas-sinpe/FiltrosHistorialSinpe';
import TablaHistorialSinpe from '@/components/recargas-sinpe/TablaHistorialSinpe';
import ModalDetalleResultado from '@/components/recargas-sinpe/ModalDetalleResultado';
import ModalCargarCreditos from '@/components/recargas-sinpe/ModalCargarCreditos';
import { Input } from '@/components/ui/input';
import { 
  mockHistorialSinpe, 
  mockDetalleConciliacion,
  mockUsuarios 
} from '@/data/mockRecargasSinpe';
import { 
  HistorialArchivoSinpe, 
  DetalleConciliacionSinpe, 
  FiltrosHistorial,
  ResumenCargue 
} from '@/types/recarga-sinpe';

export default function RecargasSinpeIndex() {
  const [historial, setHistorial] = useState<HistorialArchivoSinpe[]>(mockHistorialSinpe);
  const [detalles, setDetalles] = useState(mockDetalleConciliacion);
  const [filtros, setFiltros] = useState<FiltrosHistorial>({});
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<HistorialArchivoSinpe | null>(null);
  const [mostrarCargarCreditos, setMostrarCargarCreditos] = useState(false);
  const [detallesParaCargar, setDetallesParaCargar] = useState<DetalleConciliacionSinpe[]>([]);

  // Filtrar historial
  const historialFiltrado = useMemo(() => {
    return historial.filter(archivo => {
      const coincideFechaInicio = !filtros.fechaInicio || archivo.fecha >= filtros.fechaInicio;
      const coincideFechaFin = !filtros.fechaFin || archivo.fecha <= filtros.fechaFin;
      const coincideUsuario = !filtros.usuario || archivo.usuario === filtros.usuario;
      const coincideNombreArchivo = !filtros.nombreArchivo || 
        archivo.nombreArchivo.toLowerCase().includes(filtros.nombreArchivo.toLowerCase());

      return coincideFechaInicio && coincideFechaFin && coincideUsuario && coincideNombreArchivo;
    }).sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Ordenar por fecha descendente
  }, [historial, filtros]);

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  const handleVerResultado = (archivo: HistorialArchivoSinpe) => {
    setArchivoSeleccionado(archivo);
  };

  const handleCargarArchivo = () => {
    // Simular selección de archivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        simularCargarArchivo(file);
      }
    };
    input.click();
  };

  const simularCargarArchivo = (file: File) => {
    // Simular procesamiento del archivo
    toast.success('Archivo cargado exitosamente', {
      description: `Procesando ${file.name}...`
    });

    // Simular delay de procesamiento
    setTimeout(() => {
      const nuevoArchivo: HistorialArchivoSinpe = {
        id: Date.now().toString(),
        fecha: new Date(),
        usuario: 'Usuario Actual',
        nombreArchivo: file.name,
        estadoConciliacion: Math.random() > 0.3 ? 'Éxito' : 'Parcial',
        totalRegistros: Math.floor(Math.random() * 100) + 50,
        registrosConciliados: Math.floor(Math.random() * 80) + 40,
        registrosNoConciliados: Math.floor(Math.random() * 20),
        montoTotal: Math.floor(Math.random() * 500000) + 100000,
        montoConciliado: Math.floor(Math.random() * 400000) + 80000
      };

      // Generar detalles mock para el nuevo archivo
      const nuevosDetalles: DetalleConciliacionSinpe[] = Array.from({ length: nuevoArchivo.totalRegistros }, (_, i) => ({
        id: `${nuevoArchivo.id}-${i + 1}`,
        archivoId: nuevoArchivo.id,
        cedula: `${Math.floor(Math.random() * 900000000) + 100000000}`,
        nombre: `Pasajero ${i + 1} ${['González', 'Rodríguez', 'Martínez', 'López', 'Hernández'][Math.floor(Math.random() * 5)]}`,
        monto: Math.floor(Math.random() * 10000) + 1000,
        conciliado: Math.random() > 0.2,
        fechaMovimiento: new Date(),
        referencia: `SINPE${String(i + 1).padStart(3, '0')}`,
        linea: i + 1
      }));

      setHistorial(prev => [nuevoArchivo, ...prev]);
      setDetalles(prev => ({ ...prev, [nuevoArchivo.id]: nuevosDetalles }));
      
      toast.success('Archivo procesado exitosamente', {
        description: `${nuevoArchivo.estadoConciliacion}: ${nuevoArchivo.registrosConciliados} de ${nuevoArchivo.totalRegistros} registros conciliados`
      });
    }, 2000);
  };

  const handleCargarCreditos = (detallesConciliados: DetalleConciliacionSinpe[]) => {
    setDetallesParaCargar(detallesConciliados);
    setMostrarCargarCreditos(true);
  };

  const handleConfirmarCargarCreditos = async (detalles: DetalleConciliacionSinpe[]): Promise<ResumenCargue> => {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular procesamiento
    const procesadas = detalles.length;
    const duplicadas = Math.floor(procesadas * 0.1); // 10% duplicadas
    const conError = Math.floor(procesadas * 0.05); // 5% con error
    const exitosas = procesadas - duplicadas - conError;
    const montoTotalAcreditado = detalles.slice(0, exitosas).reduce((sum, d) => sum + d.monto, 0);

    // Actualizar estado de los detalles
    if (archivoSeleccionado) {
      setDetalles(prev => ({
        ...prev,
        [archivoSeleccionado.id]: prev[archivoSeleccionado.id].map(detalle => 
          detalles.some(d => d.id === detalle.id) ? 
          { ...detalle, estadoCargue: 'Cargado' as const } : 
          detalle
        )
      }));
    }

    const resumen: ResumenCargue = {
      procesadas: exitosas,
      duplicadas,
      conError,
      montoTotalAcreditado
    };

    return resumen;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recargas SINPE</h1>
          <p className="text-muted-foreground">
            Gestión del historial de archivos SINPE y conciliación de recargas
          </p>
        </div>
      </div>

      <FiltrosHistorialSinpe
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimpiar={handleLimpiarFiltros}
      />

      <TablaHistorialSinpe
        archivos={historialFiltrado}
        onVerResultado={handleVerResultado}
        onCargarArchivo={handleCargarArchivo}
        archivoSeleccionado={archivoSeleccionado}
        detalles={archivoSeleccionado ? detalles[archivoSeleccionado.id] || [] : []}
        onCargarCreditos={handleCargarCreditos}
        onConciliar={(detalle) => {
          // Simular conciliación
          if (archivoSeleccionado) {
            setDetalles(prev => ({
              ...prev,
              [archivoSeleccionado.id]: prev[archivoSeleccionado.id].map(d => 
                d.id === detalle.id ? { ...d, conciliado: true } : d
              )
            }));
          }
        }}
      />

      {/* Modal de cargar créditos */}
      <ModalCargarCreditos
        detalles={detallesParaCargar}
        nombreArchivo={archivoSeleccionado?.nombreArchivo || ''}
        isOpen={mostrarCargarCreditos}
        onClose={() => setMostrarCargarCreditos(false)}
        onConfirmar={handleConfirmarCargarCreditos}
      />
    </div>
  );
}