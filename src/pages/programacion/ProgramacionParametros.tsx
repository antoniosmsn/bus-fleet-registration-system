import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Layout from '@/components/layout/Layout';
import FiltrosProgramacionComponent from '@/components/programacion/FiltrosProgramacion';
import TablaProgramacion from '@/components/programacion/TablaProgramacion';
import SeleccionTiposDatos from '@/components/programacion/SeleccionTiposDatos';
import { AutobusProgramacion, FiltrosProgramacion, TiposDatos } from '@/types/programacion-parametros';
import { Send, X } from 'lucide-react';

const ProgramacionParametros = () => {
  const { toast } = useToast();
  
  const [filtros, setFiltros] = useState<FiltrosProgramacion>({
    empresaTransporte: '',
    placa: '',
    identificador: ''
  });

  const [autobusesSeleccionados, setAutobusesSeleccionados] = useState<number[]>([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState<TiposDatos>({
    conductores: false,
    geocercas: false,
    paradas: false,
    rutas: false,
    parametros: false,
    tarifas: false,
    usuariosSoporte: false,
    logcat: false
  });

  // Datos de ejemplo - en producción vendrían de la API
  const [autobuses] = useState<AutobusProgramacion[]>([
    {
      id: 1,
      placa: 'ABC-123',
      identificador: '001',
      empresaTransporte: 'Transportes A',
      conductores: 1,
      geocercas: 0,
      paradas: 1,
      rutas: 0,
      parametros: 1,
      tarifas: 0,
      usuariosSoporte: 1,
      logcat: 0
    },
    {
      id: 2,
      placa: 'DEF-456',
      identificador: '002',
      empresaTransporte: 'Transportes B',
      conductores: 0,
      geocercas: 1,
      paradas: 0,
      rutas: 1,
      parametros: 0,
      tarifas: 1,
      usuariosSoporte: 0,
      logcat: 1
    },
    {
      id: 3,
      placa: 'GHI-789',
      identificador: '003',
      empresaTransporte: 'Transportes A',
      conductores: 1,
      geocercas: 1,
      paradas: 1,
      rutas: 1,
      parametros: 1,
      tarifas: 1,
      usuariosSoporte: 1,
      logcat: 1
    }
  ]);

  const onBuscar = () => {
    console.log('Buscando con filtros:', filtros);
    // Aquí se haría la llamada a la API con los filtros
  };

  const onSeleccionarAutobus = (id: number) => {
    setAutobusesSeleccionados(prev => 
      prev.includes(id) 
        ? prev.filter(autoId => autoId !== id)
        : [...prev, id]
    );
  };

  const onSeleccionarTodos = () => {
    setAutobusesSeleccionados(autobuses.map(a => a.id));
  };

  const onDeseleccionarTodos = () => {
    setAutobusesSeleccionados([]);
  };

  const onCambiarTipo = (tipo: keyof TiposDatos) => {
    setTiposSeleccionados(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };

  const validarSelecciones = () => {
    if (autobusesSeleccionados.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un autobús.",
        variant: "destructive",
      });
      return false;
    }

    const tiposSeleccionadosArray = Object.values(tiposSeleccionados);
    if (!tiposSeleccionadosArray.some(Boolean)) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un tipo de parámetro.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const onEnviar = () => {
    if (!validarSelecciones()) return;

    console.log('Enviando parámetros para autobuses:', autobusesSeleccionados);
    console.log('Tipos seleccionados:', tiposSeleccionados);
    
    toast({
      title: "Éxito",
      description: "Los parámetros han sido programados para envío exitosamente.",
    });

    // Limpiar selecciones
    setAutobusesSeleccionados([]);
    setTiposSeleccionados({
      conductores: false,
      geocercas: false,
      paradas: false,
      rutas: false,
      parametros: false,
      tarifas: false,
      usuariosSoporte: false,
      logcat: false
    });
  };

  const onNoEnviar = () => {
    if (!validarSelecciones()) return;

    console.log('Desprogramando parámetros para autobuses:', autobusesSeleccionados);
    console.log('Tipos seleccionados:', tiposSeleccionados);
    
    toast({
      title: "Éxito",
      description: "Los parámetros han sido desprogramados exitosamente.",
    });

    // Limpiar selecciones
    setAutobusesSeleccionados([]);
    setTiposSeleccionados({
      conductores: false,
      geocercas: false,
      paradas: false,
      rutas: false,
      parametros: false,
      tarifas: false,
      usuariosSoporte: false,
      logcat: false
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Programación de Parámetros hacia Lectoras
          </h1>
        </div>

        <FiltrosProgramacionComponent
          filtros={filtros}
          setFiltros={setFiltros}
          onBuscar={onBuscar}
        />

        <TablaProgramacion
          autobuses={autobuses}
          autobusesSeleccionados={autobusesSeleccionados}
          onSeleccionarAutobus={onSeleccionarAutobus}
          onSeleccionarTodos={onSeleccionarTodos}
          onDeseleccionarTodos={onDeseleccionarTodos}
        />

        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-700">
            1 - 10 de {autobuses.length}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <SeleccionTiposDatos
          tiposSeleccionados={tiposSeleccionados}
          onCambiarTipo={onCambiarTipo}
        />

        <div className="flex gap-4 justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                NO ENVIAR
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desea cambiar el estado a NO ENVIAR?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={onNoEnviar}>Sí</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                ENVIAR
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desea cambiar el estado a ENVIAR?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={onEnviar}>Sí</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  );
};

export default ProgramacionParametros;
