
import { Conductor } from "@/types/conductor";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bus } from "@/types/bus";

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

const logExportAction = (tipoArchivo: 'PDF' | 'Excel', tipo: 'conductores' | 'buses' = 'conductores') => {
  // Aquí iría la lógica real de logging
  console.log('Registro en bitácora:', {
    usuario: 'Usuario actual', // En implementación real, obtener del contexto de autenticación
    fecha: new Date().toISOString(),
    tipoArchivo,
    tipoEntidad: tipo
  });
};
