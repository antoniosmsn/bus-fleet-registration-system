import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { mockServicios } from '@/data/mockServicios';
import { useToast } from '@/hooks/use-toast';
import ConfirmarCambioEstadoDialog from './ConfirmarCambioEstadoDialog';

interface ServiciosTableProps {
  filters: {
    empresaCliente: string;
    transportista: string;
    tipoUnidad: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFin: string;
    ramal: string;
    tipoRuta: string;
    sentido: string;
    turno: string;
    estado: string;
  };
}

const ServiciosTable = ({ filters }: ServiciosTableProps) => {
  const { toast } = useToast();
  const [servicioToToggle, setServicioToToggle] = useState<{
    id: string;
    numeroServicio: string;
    nuevoEstado: 'Activo' | 'Inactivo';
  } | null>(null);

  // Helper functions to map IDs to names
  const getTurnoNombre = (turnoId: string) => {
    const turnos: Record<string, string> = {
      '1': 'Turno A',
      '2': 'Turno B', 
      '3': 'Turno C'
    };
    return turnos[turnoId] || turnoId;
  };

  const getTransportistaNombre = (transportistaId: string) => {
    const transportistas: Record<string, string> = {
      '1': 'Transportes San José S.A.',
      '2': 'Autobuses del Valle',
      '3': 'Empresa de Transporte Central',
      '4': 'Transportes Unidos',
      '5': 'Buses Express Costa Rica'
    };
    return transportistas[transportistaId] || transportistaId;
  };

  const getEmpresaClienteNombre = (empresaId: string) => {
    const empresas: Record<string, string> = {
      '1': 'Intel Corporation',
      '2': 'Microsoft Costa Rica',
      '3': 'Amazon Development Center',
      '4': 'Parque Industrial S.A.'
    };
    return empresas[empresaId] || '-';
  };

  const getRamalNombre = (ramalId: string) => {
    const ramales: Record<string, string> = {
      '1': 'San José - Cartago',
      '2': 'Heredia - Alajuela', 
      '3': 'Zona Franca Intel',
      '4': 'Campus Tecnológico',
      '5': 'Parque Industrial'
    };
    return ramales[ramalId] || ramalId;
  };

  const getTipoUnidadNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'autobus': 'Autobús',
      'buseta': 'Buseta',
      'microbus': 'Microbús'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoRutaNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publica': 'Pública',
      'privada': 'Privada',
      'especial': 'Especial',
      'parque': 'Parque'
    };
    return tipos[tipo] || tipo;
  };

  const formatearFecha = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Formatear días
  const formatearDias = (diasSemana: string[]) => {
    const diasAbrev = diasSemana.map(dia => {
      const map: Record<string, string> = {
        'lunes': 'L', 'martes': 'M', 'miercoles': 'X', 'jueves': 'J', 
        'viernes': 'V', 'sabado': 'S', 'domingo': 'D'
      };
      return map[dia];
    }).join(',');
    return diasAbrev;
  };

  // Formatear moneda
  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  // Aplicar filtros a los datos del mock
  const serviciosFiltrados = mockServicios.filter(servicio => {
    // Filtro por empresa cliente
    if (filters.empresaCliente && filters.empresaCliente !== '' && servicio.empresaCliente !== filters.empresaCliente) {
      return false;
    }
    
    // Filtro por transportista
    if (filters.transportista && filters.transportista !== '' && servicio.transportista !== filters.transportista) {
      return false;
    }
    
    // Filtro por tipo de unidad
    if (filters.tipoUnidad && filters.tipoUnidad !== 'todos' && servicio.tipoUnidad !== filters.tipoUnidad) {
      return false;
    }
    
    // Filtro por ramal
    if (filters.ramal && filters.ramal !== '' && servicio.ramal !== filters.ramal) {
      return false;
    }
    
    // Filtro por tipo de ruta
    if (filters.tipoRuta && filters.tipoRuta !== 'todos' && servicio.tipoRuta !== filters.tipoRuta) {
      return false;
    }
    
    // Filtro por sentido
    if (filters.sentido && filters.sentido !== 'todos' && servicio.sentido !== filters.sentido) {
      return false;
    }
    
    // Filtro por turno
    if (filters.turno && filters.turno !== '' && servicio.turno !== filters.turno) {
      return false;
    }
    
    // Filtro por estado
    if (filters.estado && filters.estado !== 'todos' && servicio.estado !== filters.estado) {
      return false;
    }
    
    // Filtro por horario (rango)
    if (filters.horarioInicio && servicio.horario < filters.horarioInicio) {
      return false;
    }
    if (filters.horarioFin && servicio.horario > filters.horarioFin) {
      return false;
    }
    
    // Filtro por días de la semana (al menos uno en común)
    if (filters.diasSemana && filters.diasSemana.length > 0) {
      const hasCommonDay = servicio.diasSemana.some(dia => filters.diasSemana.includes(dia));
      if (!hasCommonDay) {
        return false;
      }
    }
    
    return true;
  });

  // Manejar cambio de estado
  const handleToggleEstado = (servicio: any) => {
    const nuevoEstado = servicio.estado === 'Activo' ? 'Inactivo' : 'Activo';
    setServicioToToggle({
      id: servicio.id,
      numeroServicio: servicio.numeroServicio,
      nuevoEstado
    });
  };

  const handleConfirmToggle = () => {
    if (!servicioToToggle) return;

    // Aquí se haría la llamada al API para cambiar el estado
    // Por ahora simulamos el cambio
    
    // Simular registro en bitácora
    const usuario = 'admin@sistema.com'; // En producción esto vendría del contexto del usuario
    const fechaActual = new Date().toISOString();
    console.log('Registro en bitácora:', {
      accion: 'cambio_estado_servicio',
      servicio_id: servicioToToggle.id,
      numero_servicio: servicioToToggle.numeroServicio,
      estado_anterior: servicioToToggle.nuevoEstado === 'Activo' ? 'Inactivo' : 'Activo',
      estado_nuevo: servicioToToggle.nuevoEstado,
      usuario: usuario,
      fecha: fechaActual
    });

    toast({
      title: "Estado actualizado",
      description: `El servicio ${servicioToToggle.numeroServicio} ha sido cambiado a ${servicioToToggle.nuevoEstado.toLowerCase()}.`,
    });

    setServicioToToggle(null);
    
    // En producción aquí se actualizaría el estado local o se refrescaría la tabla
  };

  // Procesar datos filtrados para mostrar en la tabla
  const servicios = serviciosFiltrados.map(servicio => ({
    id: servicio.id,
    numeroServicio: servicio.numeroServicio,
    turno: getTurnoNombre(servicio.turno),
    transportista: getTransportistaNombre(servicio.transportista),
    empresaCliente: getEmpresaClienteNombre(servicio.empresaCliente),
    tipoUnidad: getTipoUnidadNombre(servicio.tipoUnidad),
    ramal: getRamalNombre(servicio.ramal),
    tipoRuta: getTipoRutaNombre(servicio.tipoRuta),
    horario: servicio.horario,
    dias: formatearDias(servicio.diasSemana),
    sentido: servicio.sentido === 'ingreso' ? 'Ingreso' : 'Salida',
    tarifaPasajero: servicio.tarifaPasajero,
    tarifaServicio: servicio.tarifaServicio,
    estado: servicio.estado === 'activo' ? 'Activo' : 'Inactivo',
    fechaCreacion: formatearFecha(servicio.fechaCreacion),
    fechaModificacion: servicio.fechaModificacion ? formatearFecha(servicio.fechaModificacion) : '-',
    usuarioCreacion: servicio.usuarioCreacion,
    usuarioModificacion: servicio.usuarioModificacion || '-'
  }));

  if (servicios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No se encontraron servicios con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Servicio</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Transportista</TableHead>
              <TableHead>Empresa Cliente</TableHead>
              <TableHead>Tipo Unidad</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Tipo Ruta</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Sentido</TableHead>
              <TableHead>Tarifa Pasajero</TableHead>
              <TableHead>Tarifa Servicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Fecha Modificación</TableHead>
              <TableHead>Usuario Creación</TableHead>
              <TableHead>Usuario Modificación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell className="font-medium">
                  {servicio.numeroServicio}
                </TableCell>
                <TableCell>
                  {servicio.turno}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {servicio.transportista}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {servicio.empresaCliente}
                </TableCell>
                <TableCell>
                  {servicio.tipoUnidad}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {servicio.ramal}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {servicio.tipoRuta}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {servicio.horario}
                </TableCell>
                <TableCell>
                  <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'outline'}>
                    {servicio.sentido}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatearMoneda(servicio.tarifaPasajero)}
                </TableCell>
                <TableCell className="text-right">
                  {formatearMoneda(servicio.tarifaServicio)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={servicio.estado === 'Activo'} 
                      onCheckedChange={() => handleToggleEstado(servicio)}
                    />
                    <span className={servicio.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}>
                      {servicio.estado}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {servicio.fechaCreacion}
                </TableCell>
                <TableCell className="text-sm">
                  {servicio.fechaModificacion}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-sm">
                  {servicio.usuarioCreacion}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-sm">
                  {servicio.usuarioModificacion}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/servicios/edit/${servicio.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {servicioToToggle && (
        <ConfirmarCambioEstadoDialog
          isOpen={true}
          onClose={() => setServicioToToggle(null)}
          onConfirm={handleConfirmToggle}
          numeroServicio={servicioToToggle.numeroServicio}
          nuevoEstado={servicioToToggle.nuevoEstado}
        />
      )}
    </div>
  );
};

export default ServiciosTable;