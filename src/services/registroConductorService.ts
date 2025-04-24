
import { Conductor } from "@/types/conductor";
import { ConductorFormValues, ConductorRegistrationApiResponse } from "@/types/conductor-form";
import { empresasTransporte } from "./conductorService";

// Simulación del listado de conductores para validar cédulas duplicadas
let conductoresMock: Conductor[] = [
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
    empresaTransporte: "Transportes del Sur",
    codigo: "CS001",
    numeroCedula: "304560789",
    nombre: "Carlos",
    apellidos: "Ramírez Solano",
    fechaNacimiento: "1976-08-22",
    telefono: "8765-4321",
    fechaVencimientoCedula: "2027-08-22",
    fechaVencimientoLicencia: "2025-03-15",
    estado: "Activo"
  },
];

export const getEmpresas = (): string[] => {
  // Filtrar "Todas" del array para que solo muestre empresas reales
  return empresasTransporte.filter(empresa => empresa !== "Todas");
};

// Función para validar si la cédula ya existe en la empresa
export const validarCedulaUnica = (cedula: string, empresa: string): boolean => {
  const existe = conductoresMock.some(
    conductor => conductor.numeroCedula === cedula && conductor.empresaTransporte === empresa
  );
  return !existe;
};

// Función para generar código único de 4 dígitos
const generarCodigoConductor = (empresa: string): string => {
  const prefijo = empresa.substring(0, 1).toUpperCase(); // Primera letra de la empresa
  
  // Obtener códigos existentes para esa empresa
  const codigosExistentes = conductoresMock
    .filter(c => c.empresaTransporte === empresa)
    .map(c => c.codigo);

  // Generar nuevo código único
  let nuevoNumero = 1;
  let codigoGenerado = `${prefijo}${nuevoNumero.toString().padStart(3, '0')}`;
  
  while (codigosExistentes.includes(codigoGenerado)) {
    nuevoNumero++;
    codigoGenerado = `${prefijo}${nuevoNumero.toString().padStart(3, '0')}`;
  }
  
  return codigoGenerado;
};

// Función principal para registrar conductor
export const registrarConductor = async (data: ConductorFormValues): Promise<ConductorRegistrationApiResponse> => {
  // Simular demora en el API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validar cédula única
  if (!validarCedulaUnica(data.numeroCedula, data.empresaTransporte)) {
    return {
      success: false,
      message: "Ya existe un conductor con esta cédula en la empresa seleccionada."
    };
  }
  
  // Generar código único
  const codigo = generarCodigoConductor(data.empresaTransporte);
  
  // Simulación de almacenamiento
  const nuevoId = conductoresMock.length + 1;
  
  // Registro en la bitácora (simulado)
  console.log(`Bitácora: Nuevo conductor registrado - ID: ${nuevoId}, Código: ${codigo}`);
  
  return {
    success: true,
    message: "Conductor registrado correctamente",
    data: {
      id: nuevoId,
      codigo: codigo
    }
  };
};
