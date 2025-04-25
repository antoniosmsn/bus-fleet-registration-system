import { Conductor, ConductorFilterParams, SortParams } from "@/types/conductor";
import { ConductorEditFormValues, PasswordChangeValues } from "@/types/conductor-form";

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
    estado: "Activo",
    imagenCedula: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    imagenLicencia: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
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
    fechaVencimientoCedula: "2024-05-25",
    fechaVencimientoLicencia: "2024-06-15",
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
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredConductores = [...conductoresMock];

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

export const isDocumentoProximoAVencer = (fechaVencimiento: string, meses: number = 3): boolean => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setMonth(today.getMonth() + meses);
  const vencimiento = new Date(fechaVencimiento);
  
  return vencimiento <= futureDate && vencimiento >= today;
};

export const exportToExcel = (conductores: Conductor[]) => {
  console.log('Exportando a Excel:', conductores);
  alert('La exportación a Excel ha sido simulada. En implementación real, se generaría y descargaría un archivo Excel.');
};

export const exportToPDF = (conductores: Conductor[]) => {
  console.log('Exportando a PDF:', conductores);
  alert('La exportación a PDF ha sido simulada. En implementación real, se generaría y descargaría un archivo PDF.');
};

export const updateConductor = async (id: number, data: Partial<ConductorEditFormValues>) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const existingConductor = conductoresMock.find(c => 
    c.empresaTransporte === data.empresaTransporte && 
    c.numeroCedula === data.numeroCedula && 
    c.id !== id
  );

  if (existingConductor) {
    return {
      success: false,
      message: "Ya existe un conductor con este número de cédula en la empresa seleccionada."
    };
  }

  const conductorIndex = conductoresMock.findIndex(c => c.id === id);
  if (conductorIndex >= 0) {
    const updatedConductor = {
      ...conductoresMock[conductorIndex],
      empresaTransporte: data.empresaTransporte || conductoresMock[conductorIndex].empresaTransporte,
      numeroCedula: data.numeroCedula || conductoresMock[conductorIndex].numeroCedula,
      nombre: data.nombre || conductoresMock[conductorIndex].nombre,
      apellidos: data.primerApellido ? 
        `${data.primerApellido} ${data.segundoApellido || ''}`.trim() : 
        conductoresMock[conductorIndex].apellidos,
      fechaNacimiento: data.fechaNacimiento ? 
        data.fechaNacimiento instanceof Date ? 
          data.fechaNacimiento.toISOString().split('T')[0] : 
          data.fechaNacimiento : 
        conductoresMock[conductorIndex].fechaNacimiento,
      telefono: data.telefono || conductoresMock[conductorIndex].telefono,
      fechaVencimientoCedula: data.fechaVencimientoCedula ? 
        data.fechaVencimientoCedula instanceof Date ? 
          data.fechaVencimientoCedula.toISOString().split('T')[0] : 
          data.fechaVencimientoCedula : 
        conductoresMock[conductorIndex].fechaVencimientoCedula,
      fechaVencimientoLicencia: data.fechaVencimientoLicencia ? 
        data.fechaVencimientoLicencia instanceof Date ? 
          data.fechaVencimientoLicencia.toISOString().split('T')[0] : 
          data.fechaVencimientoLicencia : 
        conductoresMock[conductorIndex].fechaVencimientoLicencia,
      estado: data.estado || conductoresMock[conductorIndex].estado,
    };
    
    conductoresMock[conductorIndex] = updatedConductor;
  }

  return {
    success: true,
    message: "Conductor actualizado correctamente"
  };
};

export const changePassword = async (conductorId: number, data: {
  newPassword: string;
  currentPassword?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (data.currentPassword) {
    const validCurrentPassword = true; // This would be a real validation in a real app
    
    if (!validCurrentPassword) {
      return {
        success: false,
        message: "La contraseña actual es incorrecta"
      };
    }
  }

  return {
    success: true,
    message: "Contraseña actualizada correctamente"
  };
};
