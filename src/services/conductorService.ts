
import { Conductor, ConductorFilterParams, SortParams } from "@/types/conductor";

// Datos de ejemplo para simular la API
const conductoresMock: Conductor[] = [
  {
    id: 1,
    empresaTransporte: "Transportes del Norte",
    codigo: "CN001",
    numeroCedula: "102340567",
    nombre: "Juan",
    apellidos: "Pérez Rodríguez",
    fechaNacimiento: "1985-05-15",
    telefono: "8801-2345",
    fechaVencimientoCedula: "2026-05-15",
    fechaVencimientoLicencia: "2025-10-20",
    estado: "Activo"
  },
  {
    id: 2,
    empresaTransporte: "Transportes del Norte",
    codigo: "CN002",
    numeroCedula: "203450678",
    nombre: "María",
    apellidos: "González López",
    fechaNacimiento: "1988-12-03",
    telefono: "6023-4567",
    fechaVencimientoCedula: "2025-06-10",
    fechaVencimientoLicencia: "2025-05-03",
    estado: "Activo"
  },
  {
    id: 3,
    empresaTransporte: "Transportes del Sur",
    codigo: "CS001",
    numeroCedula: "304560789",
    nombre: "Carlos",
    apellidos: "Ramírez Solano",
    fechaNacimiento: "1976-08-22",
    telefono: "8765-4321",
    fechaVencimientoCedula: "2027-08-22",
    fechaVencimientoLicencia: "2025-03-15",
    estado: "Inactivo"
  },
  {
    id: 4,
    empresaTransporte: "Transportes del Este",
    codigo: "CE001",
    numeroCedula: "405670891",
    nombre: "Ana",
    apellidos: "Vega Mora",
    fechaNacimiento: "1990-04-10",
    telefono: "7012-3456",
    fechaVencimientoCedula: "2025-04-30",
    fechaVencimientoLicencia: "2026-07-10",
    estado: "Activo"
  },
  {
    id: 5,
    empresaTransporte: "Transportes del Oeste",
    codigo: "CO001",
    numeroCedula: "506781923",
    nombre: "Roberto",
    apellidos: "Mendoza Castro",
    fechaNacimiento: "1982-11-05",
    telefono: "6098-7654",
    fechaVencimientoCedula: "2024-05-25", // Próximo a vencer
    fechaVencimientoLicencia: "2024-06-15", // Próximo a vencer
    estado: "Activo"
  }
];

export const empresasTransporte = ["Todas", "Transportes del Norte", "Transportes del Sur", "Transportes del Este", "Transportes del Oeste"];

export const getConductores = async (
  page = 1,
  pageSize = 10,
  filters: ConductorFilterParams = {},
  sort: SortParams = { column: null, direction: null }
) => {
  // Simular un retraso de la API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredConductores = [...conductoresMock];

  // Aplicar filtros
  if (filters.empresaTransporte && filters.empresaTransporte !== 'Todas') {
    filteredConductores = filteredConductores.filter(c => 
      c.empresaTransporte === filters.empresaTransporte
    );
  }

  if (filters.nombreApellidos) {
    const searchTerm = filters.nombreApellidos.toLowerCase();
    filteredConductores = filteredConductores.filter(c => 
      `${c.nombre} ${c.apellidos}`.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.cedula) {
    filteredConductores = filteredConductores.filter(c => 
      c.numeroCedula.includes(filters.cedula!)
    );
  }

  if (filters.codigo) {
    filteredConductores = filteredConductores.filter(c => 
      c.codigo.toLowerCase().includes(filters.codigo!.toLowerCase())
    );
  }

  if (filters.estado && filters.estado !== 'Todos') {
    filteredConductores = filteredConductores.filter(c => c.estado === filters.estado);
  }

  if (filters.vencimientoEnMeses) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + filters.vencimientoEnMeses);
    
    filteredConductores = filteredConductores.filter(c => {
      const vencimientoCedula = new Date(c.fechaVencimientoCedula);
      const vencimientoLicencia = new Date(c.fechaVencimientoLicencia);
      
      return (vencimientoCedula <= futureDate && vencimientoCedula >= today) || 
             (vencimientoLicencia <= futureDate && vencimientoLicencia >= today);
    });
  }

  // Aplicar ordenamiento si está especificado
  if (sort.column && sort.direction) {
    filteredConductores.sort((a, b) => {
      const columnA = String(a[sort.column!]);
      const columnB = String(b[sort.column!]);
      
      if (sort.direction === 'asc') {
        return columnA.localeCompare(columnB);
      } else {
        return columnB.localeCompare(columnA);
      }
    });
  }

  // Aplicar paginación
  const totalItems = filteredConductores.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedConductores = filteredConductores.slice(startIndex, startIndex + pageSize);

  return {
    conductores: paginatedConductores,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages
    }
  };
};

// Función para verificar si un documento está próximo a vencer
export const isDocumentoProximoAVencer = (fechaVencimiento: string, meses: number = 3): boolean => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setMonth(today.getMonth() + meses);
  const vencimiento = new Date(fechaVencimiento);
  
  return vencimiento <= futureDate && vencimiento >= today;
};

// Función para exportar a Excel (simulada)
export const exportToExcel = (conductores: Conductor[]) => {
  console.log('Exportando a Excel:', conductores);
  alert('La exportación a Excel ha sido simulada. En implementación real, se generaría y descargaría un archivo Excel.');
};

// Función para exportar a PDF (simulada)
export const exportToPDF = (conductores: Conductor[]) => {
  console.log('Exportando a PDF:', conductores);
  alert('La exportación a PDF ha sido simulada. En implementación real, se generaría y descargaría un archivo PDF.');
};
