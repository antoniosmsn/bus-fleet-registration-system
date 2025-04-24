
import { HaciendaApiResponse } from "@/types/conductor-form";

// Simulación de API de Hacienda
export const consultarCedulaHacienda = async (cedula: string): Promise<HaciendaApiResponse> => {
  // Simular demora en la API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Verificar si es una cédula con datos existentes (para simulación)
  if (cedula === "123456789") {
    return {
      success: true,
      data: {
        nombre: "Juan Carlos",
        primerApellido: "Rodríguez",
        segundoApellido: "Méndez"
      }
    };
  } else if (cedula === "987654321") {
    return {
      success: true,
      data: {
        nombre: "María Elena",
        primerApellido: "Sánchez",
        segundoApellido: "López"
      }
    };
  }
  
  // Caso donde no se encuentran datos
  return {
    success: false,
    message: "No se encontraron datos asociados al número de cédula ingresado."
  };
};
