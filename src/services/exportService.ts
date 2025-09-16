import { Conductor } from "@/types/conductor";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Bus } from "@/types/bus";
import { Pasajero } from "@/types/pasajero";
import { TelemetriaRecord } from "@/types/telemetria";
import { AlarmaRecord } from "@/types/alarma";
export const exportConductoresToPDF = async (conductores: Conductor[]) => {
  // Aquí iría la lógica real de exportación a PDF
  // Por ahora simulamos la exportación
  console.log('Exportando a PDF:', formatConductoresForExport(conductores));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Conductores_${timestamp}.pdf`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los conductores filtrados.`);
  
  // Log para auditoría
  logExportAction('PDF');
};

export const exportConductoresToExcel = async (conductores: Conductor[]) => {
  // Aquí iría la lógica real de exportación a Excel
  // Por ahora simulamos la exportación
  console.log('Exportando a Excel:', formatConductoresForExport(conductores));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Conductores_${timestamp}.xlsx`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los conductores filtrados.`);
  
  // Log para auditoría
  logExportAction('Excel');
};

const formatConductoresForExport = (conductores: Conductor[]) => {
  return conductores.map(conductor => ({
    empresaTransporte: conductor.empresaTransporte,
    codigo: conductor.codigo,
    numeroCedula: conductor.numeroCedula,
    nombreCompleto: `${conductor.nombre} ${conductor.apellidos}`,
    fechaNacimiento: new Date(conductor.fechaNacimiento).toLocaleDateString(),
    telefono: conductor.telefono,
    correoElectronico: conductor.correoElectronico || 'No especificado',
    fechaVencimientoCedula: new Date(conductor.fechaVencimientoCedula).toLocaleDateString(),
    fechaVencimientoLicencia: new Date(conductor.fechaVencimientoLicencia).toLocaleDateString(),
    estado: conductor.estado
  }));
};

// Nueva función para exportar autobuses a PDF
export const exportBusesToPDF = async (buses: Bus[]) => {
  // Aquí iría la lógica real de exportación a PDF
  // Por ahora simulamos la exportación
  console.log('Exportando buses a PDF:', formatBusesForExport(buses));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Autobuses_${timestamp}.pdf`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los autobuses filtrados.`);
  
  // Log para auditoría
  logExportAction('PDF', 'buses');
};

// Nueva función para exportar autobuses a Excel
export const exportBusesToExcel = async (buses: Bus[]) => {
  // Aquí iría la lógica real de exportación a Excel
  // Por ahora simulamos la exportación
  console.log('Exportando buses a Excel:', formatBusesForExport(buses));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Autobuses_${timestamp}.xlsx`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los autobuses filtrados.`);
  
  // Log para auditoría
  logExportAction('Excel', 'buses');
};

const formatBusesForExport = (buses: Bus[]) => {
  return buses.map(bus => ({
    placa: bus.plate,
    idAutobus: bus.busId || 'N/A',
    serialLectora: bus.readerSerial || 'N/A',
    empresa: bus.company,
    marca: bus.brand,
    año: bus.year,
    capacidad: bus.capacity || 'N/A',
    vencimientoDekra: bus.dekraExpirationDate ? new Date(bus.dekraExpirationDate).toLocaleDateString() : 'No especificado',
    vencimientoPoliza: bus.insuranceExpirationDate ? new Date(bus.insuranceExpirationDate).toLocaleDateString() : 'No especificado',
    vencimientoCTP: bus.ctpExpirationDate ? new Date(bus.ctpExpirationDate).toLocaleDateString() : 'No especificado',
    tipoUnidad: bus.type,
    estado: bus.status === 'active' ? 'Activo' : 'Inactivo',
    aprobacion: bus.approved ? 'Aprobado' : 'Sin aprobación',
    fechaAprobacion: bus.approvalDate ? new Date(bus.approvalDate).toLocaleDateString() : 'N/A',
    usuarioAprobacion: bus.approvalUser || 'N/A'
  }));
};

// Nueva función para exportar pasajeros a PDF
export const exportPasajerosToPDF = async (pasajeros: Pasajero[]) => {
  // Aquí iría la lógica real de exportación a PDF
  // Por ahora simulamos la exportación
  console.log('Exportando pasajeros a PDF:', formatPasajerosForExport(pasajeros));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Pasajeros_${timestamp}.pdf`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los pasajeros filtrados.`);
  
  // Log para auditoría
  logExportAction('PDF', 'pasajeros');
};

// Nueva función para exportar pasajeros a Excel
export const exportPasajerosToExcel = async (pasajeros: Pasajero[]) => {
  // Aquí iría la lógica real de exportación a Excel
  // Por ahora simulamos la exportación
  console.log('Exportando pasajeros a Excel:', formatPasajerosForExport(pasajeros));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Pasajeros_${timestamp}.xlsx`;
  
  // Simular la descarga
  alert(`Se generaría el archivo ${fileName} con los pasajeros filtrados.`);
  
  // Log para auditoría
  logExportAction('Excel', 'pasajeros');
};

const formatPasajerosForExport = (pasajeros: Pasajero[]) => {
  return pasajeros.map(pasajero => ({
    cedula: pasajero.cedula,
    nombreCompleto: `${pasajero.nombres} ${pasajero.primerApellido} ${pasajero.segundoApellido}`,
    correoElectronico: pasajero.correoElectronico,
    telefono: pasajero.telefono,
    empresaCliente: pasajero.empresaCliente,
    tipoPago: pasajero.tipoPago === 'prepago' ? 'Prepago' : 'Postpago',
    numeroEmpleadoInterno: pasajero.numeroEmpleadoInterno || 'N/A',
    badgeInterno: pasajero.badgeInterno || 'N/A',
    subsidioPorcentual: `${pasajero.subsidioPorcentual}%`,
    subsidioMonto: pasajero.subsidioMonto,
    saldoPrepago: pasajero.saldoPrepago || 0,
    saldoPostpago: pasajero.saldoPostpago || 0,
    estado: pasajero.estado,
    solicitudRuta: pasajero.solicitudRuta ? 'Sí' : 'No',
    fechaCreacion: new Date(pasajero.fechaCreacion).toLocaleDateString()
  }));
};

// Exportación de Capacidad Cumplida
export const exportCapacidadCumplidaToPDF = async (autobuses: any[]): Promise<void> => {
  logExportAction('PDF', 'capacidad-cumplida');
  alert(`Exportando ${autobuses.length} registros de capacidad cumplida a PDF...`);
};

export const exportCapacidadCumplidaToExcel = async (autobuses: any[]): Promise<void> => {
  logExportAction('Excel', 'capacidad-cumplida');
  alert(`Exportando ${autobuses.length} registros de capacidad cumplida a Excel...`);
};

// Exportación de Telemetría
export const exportTelemetriaToPDF = async (registros: TelemetriaRecord[]): Promise<void> => {
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  logExportAction('PDF', 'buses');
  alert(`Exportando ${registros.length} lecturas de telemetría a PDF (${timestamp})...`);
};

export const exportTelemetriaToExcel = async (registros: TelemetriaRecord[]): Promise<void> => {
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  logExportAction('Excel', 'buses');
  alert(`Exportando ${registros.length} lecturas de telemetría a Excel (${timestamp})...`);
};

// Exportación de Alarmas
export const exportAlarmasToPDF = async (alarmas: AlarmaRecord[]): Promise<void> => {
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  logExportAction('PDF', 'buses');
  alert(`Exportando ${alarmas.length} alarmas generadas a PDF (${timestamp})...`);
};

export const exportAlarmasToExcel = async (alarmas: AlarmaRecord[]): Promise<void> => {
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  logExportAction('Excel', 'buses');
  alert(`Exportando ${alarmas.length} alarmas generadas a Excel (${timestamp})...`);
};

// Mantenimiento export functionality
export const exportMantenimientoToPDF = async (mantenimientos: any[], filtros?: any) => {
  console.log('Exportando mantenimientos a PDF...', { count: mantenimientos.length, filtros });
  
  // Simular generación del PDF
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const formattedData = formatMantenimientoForExport(mantenimientos);
  console.log('PDF de mantenimientos generado:', formattedData.slice(0, 2));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Mantenimientos_${timestamp}.pdf`;
  alert(`Se generaría el archivo ${fileName} con ${mantenimientos.length} registros de mantenimiento.`);
  
  logExportAction('PDF', 'mantenimiento');
}

export const exportMantenimientoToExcel = async (mantenimientos: any[], filtros?: any) => {
  console.log('Exportando mantenimientos a Excel...', { count: mantenimientos.length, filtros });
  
  // Simular generación del Excel
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const formattedData = formatMantenimientoForExport(mantenimientos);
  console.log('Excel de mantenimientos generado:', formattedData.slice(0, 2));
  
  const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: es });
  const fileName = `Mantenimientos_${timestamp}.xlsx`;
  alert(`Se generaría el archivo ${fileName} con ${mantenimientos.length} registros de mantenimiento.`);
  
  logExportAction('Excel', 'mantenimiento');
}

const formatMantenimientoForExport = (mantenimientos: any[]) => {
  return mantenimientos.map(m => ({
    'Fecha del Mantenimiento': new Date(m.fechaMantenimiento).toLocaleDateString('es-ES'),
    'Placa': m.placa,
    'Categoría': m.categoria.nombre,
    'Detalle del Mantenimiento': m.detalle,
    'Transportista': `${m.transportista.codigo} - ${m.transportista.nombre}`,
    'Costo': m.costo ? `₡${m.costo.toLocaleString()}` : 'N/A',
    'Proveedor': m.proveedor || 'N/A',
    'Kilometraje': m.kilometraje ? `${m.kilometraje.toLocaleString()} km` : 'N/A'
  }));
}

// Exportaciones para Carga de Créditos
export const exportCargaCreditosToPDF = (cargues: any[]) => {
  console.log('Exportando cargues de créditos a PDF', cargues);
  logExportAction('PDF', 'carga-creditos');
};

export const exportCargaCreditosToExcel = (cargues: any[]) => {
  console.log('Exportando cargues de créditos a Excel', cargues);
  logExportAction('Excel', 'carga-creditos');
};

const logExportAction = (tipoArchivo: 'PDF' | 'Excel', tipo: 'conductores' | 'buses' | 'pasajeros' | 'capacidad-cumplida' | 'mantenimiento' | 'carga-creditos' = 'conductores') => {
  // Aquí iría la lógica real de logging
  console.log('Registro en bitácora:', {
    usuario: 'Usuario actual', // En implementación real, obtener del contexto de autenticación
    fecha: new Date().toISOString(),
    tipoArchivo,
    tipoEntidad: tipo
  });
};
