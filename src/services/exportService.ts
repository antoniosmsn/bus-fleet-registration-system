import { Conductor } from "@/types/conductor";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Bus } from "@/types/bus";
import { Pasajero } from "@/types/pasajero";
import { TelemetriaRecord } from "@/types/telemetria";
import { AlarmaRecord } from "@/types/alarma";
import { BitacoraUsuario } from "@/types/bitacora-usuario";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

// Bitácoras de Usuario
export const exportBitacorasUsuarioToPDF = async (bitacoras: BitacoraUsuario[]) => {
  const timestamp = format(new Date(), "yyyyMMdd_HHmm", { locale: es });
  const fileName = `Bitacoras_Usuario_${timestamp}.pdf`;

  // Crear documento PDF en orientación horizontal para más columnas
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });

  // Encabezado corporativo siguiendo el formato de los archivos compartidos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Sistema RideCode', 40, 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Impreso: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es })}`, 40, 58);

  // Título del reporte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Bitácoras de acciones de usuario', 40, 85);

  // Columnas y filas
  const columns = [
    { header: 'Fecha y Hora', dataKey: 'fechaHora' },
    { header: 'Usuario', dataKey: 'usuario' },
    { header: 'Nombre Completo', dataKey: 'nombreCompleto' },
    { header: 'Perfil', dataKey: 'perfil' },
    { header: 'Zona Franca', dataKey: 'zonaFranca' },
    { header: 'Acción', dataKey: 'accion' },
    { header: 'Tipo de Acción', dataKey: 'tipoAccion' },
    { header: 'Resultado', dataKey: 'resultado' },
  ];

  const rows = bitacoras.map((b) => ({
    fechaHora: format(new Date(b.fechaHora), 'dd/MM/yyyy HH:mm:ss', { locale: es }),
    usuario: b.usuario,
    nombreCompleto: b.nombreCompleto,
    perfil: b.perfil,
    zonaFranca: b.zonaFranca,
    accion: b.accion,
    tipoAccion: b.tipoAccion,
    resultado: b.resultado,
  }));

  // Tabla con el mismo estilo que los reportes corporativos
  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => (r as any)[c.dataKey])),
    startY: 110,
    styles: { 
      fontSize: 8, 
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.5
    },
    headStyles: { 
      fillColor: [245, 245, 245], 
      textColor: 20, 
      halign: 'left',
      fontStyle: 'bold'
    },
    theme: 'grid',
    willDrawPage: (data) => {
      // Pie de página con número de página
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : (pageSize as any).getHeight();
      doc.setFontSize(9);
      doc.text(
        `Página ${data.pageNumber}`,
        pageSize.width - 80,
        pageHeight - 20
      );
    },
    columnStyles: {
      0: { cellWidth: 95 }, // fecha
      1: { cellWidth: 120 }, // usuario
      2: { cellWidth: 150 }, // nombre
      3: { cellWidth: 110 }, // perfil
      4: { cellWidth: 110 }, // zona franca
      5: { cellWidth: 220 }, // acción
      6: { cellWidth: 110 }, // tipo acción
      7: { cellWidth: 90 },  // resultado
    },
  });

  doc.save(fileName);
  logExportAction('PDF', 'bitacoras-usuario');
};

export const exportBitacorasUsuarioToExcel = async (bitacoras: BitacoraUsuario[]) => {
  const timestamp = format(new Date(), "yyyyMMdd_HHmm", { locale: es });
  const fileName = `Bitacoras_Usuario_${timestamp}.csv`;
  
  // Crear contenido CSV siguiendo el formato corporativo
  const fechaActual = format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es });
  
  const csvLines = [
    // Encabezado corporativo
    'SISTEMA RIDECODE,,,,,,,,',
    `${fechaActual},,,,,,,,`,
    'BITACORAS DE ACCIONES DE USUARIO,,,,,,,,',
    ',,,,,,,,', // Línea vacía
    // Headers de la tabla
    'Fecha y Hora,Usuario,Nombre Completo,Perfil,Zona Franca,Acción,Tipo de Acción,Resultado,Descripción',
    // Datos
    ...bitacoras.map(bitacora => [
      `"${format(new Date(bitacora.fechaHora), 'dd/MM/yyyy HH:mm:ss', { locale: es })}"`,
      `"${bitacora.usuario}"`,
      `"${bitacora.nombreCompleto}"`,
      `"${bitacora.perfil}"`,
      `"${bitacora.zonaFranca}"`,
      `"${bitacora.accion.replace(/"/g, '""')}"`,
      `"${bitacora.tipoAccion}"`,
      `"${bitacora.resultado}"`,
      `"${(bitacora.descripcion || '').replace(/"/g, '""')}"`
    ].join(','))
  ];
  
  const csvContent = csvLines.join('\n');
  
  // Crear blob y descargar
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  logExportAction('Excel', 'bitacoras-usuario');
};

// BitacoraSistema export functions
export const exportBitacorasSistemaToPDF = async (bitacoras: any[]) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  
  // Logo and header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Bitácoras del Sistema', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  doc.text(`Total de registros: ${bitacoras.length}`, 20, 37);

  // Table data
  const tableData = bitacoras.map((bitacora) => [
    new Date(bitacora.fechaHora).toLocaleDateString('es-ES') + ' ' + 
    new Date(bitacora.fechaHora).toLocaleTimeString('es-ES'),
    bitacora.application || '-',
    bitacora.logLevel || '-',
    bitacora.user || '-',
    bitacora.message || '-',
    bitacora.errorCode || '-',
    bitacora.apiErrorMessage || '-',
    bitacora.internalErrorMessage || '-'
  ]);

  const tableHeaders = [
    'Fecha y Hora',
    'Aplicación', 
    'Nivel',
    'Usuario',
    'Mensaje',
    'Código Error',
    'Error API',
    'Error Interno'
  ];

  (doc as any).autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 }
    }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`bitacoras-sistema-${new Date().toISOString().split('T')[0]}.pdf`);
  
  logExportAction('PDF', 'bitacoras-sistema');
};

export const exportBitacorasSistemaToExcel = async (bitacoras: any[]) => {
  const headers = [
    'Fecha y Hora',
    'Aplicación',
    'Nivel',
    'Usuario', 
    'Mensaje',
    'Código Error',
    'Error API',
    'Error Interno'
  ];

  const csvData = [
    headers,
    ...bitacoras.map(bitacora => [
      new Date(bitacora.fechaHora).toLocaleDateString('es-ES') + ' ' + 
      new Date(bitacora.fechaHora).toLocaleTimeString('es-ES'),
      bitacora.application || '-',
      bitacora.logLevel || '-',
      bitacora.user || '-',
      bitacora.message || '-',
      bitacora.errorCode || '-',
      bitacora.apiErrorMessage || '-',
      bitacora.internalErrorMessage || '-'
    ])
  ];

  const csvContent = csvData.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bitacoras-sistema-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  logExportAction('Excel', 'bitacoras-sistema');
};

const logExportAction = (tipoArchivo: 'PDF' | 'Excel', tipo: 'conductores' | 'buses' | 'pasajeros' | 'capacidad-cumplida' | 'mantenimiento' | 'carga-creditos' | 'bitacoras-usuario' | 'bitacoras-sistema' = 'conductores') => {
  // Aquí iría la lógica real de logging
  console.log('Registro en bitácora:', {
    usuario: 'Usuario actual', // En implementación real, obtener del contexto de autenticación
    fecha: new Date().toISOString(),
    tipoArchivo,
    tipoEntidad: tipo
  });
};
