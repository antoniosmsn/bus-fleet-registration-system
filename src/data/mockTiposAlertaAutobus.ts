import { TipoAlertaAutobus } from "@/types/alerta-autobus";

// Helper function to generate dynamic dates around today
const generarFechaDinamica = (diasAtras: number = 0, horasAtras: number = 0): string => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  fecha.setHours(fecha.getHours() - horasAtras);
  return fecha.toISOString();
};

export const mockTiposAlertaAutobus: TipoAlertaAutobus[] = [
  {
    id: 1,
    nombre: "Falla mecánica",
    alertType: "Mechanical Failure",
    activo: true,
    motivos: [
      {
        id: 1,
        nombre: "Problema con el motor",
        nombreIngles: "Engine problem",
        activo: true,
        fechaCreacion: generarFechaDinamica(15, 2)
      },
      {
        id: 2,
        nombre: "Falla en la transmisión",
        nombreIngles: "Transmission failure",
        activo: true,
        fechaCreacion: generarFechaDinamica(15, 2)
      }
    ],
    fechaCreacion: generarFechaDinamica(15, 2),
    fechaModificacion: generarFechaDinamica(3, 8)
  },
  {
    id: 2,
    nombre: "Trayecto bloqueado",
    alertType: "Route Blocked",
    activo: true,
    motivos: [
      {
        id: 3,
        nombre: "Accidente de tránsito",
        nombreIngles: "Traffic accident",
        activo: true,
        fechaCreacion: generarFechaDinamica(12, 5)
      },
      {
        id: 4,
        nombre: "Obra en construcción",
        nombreIngles: "Construction work",
        activo: true,
        fechaCreacion: generarFechaDinamica(12, 5)
      }
    ],
    fechaCreacion: generarFechaDinamica(12, 5),
    fechaModificacion: generarFechaDinamica(1, 3)
  },
  {
    id: 3,
    nombre: "Pinchazo de llanta",
    alertType: "Flat Tire",
    activo: true,
    motivos: [
      {
        id: 5,
        nombre: "Llanta delantera pinchada",
        nombreIngles: "Front tire punctured",
        activo: true,
        fechaCreacion: generarFechaDinamica(8, 12)
      },
      {
        id: 6,
        nombre: "Llanta trasera pinchada",
        nombreIngles: "Rear tire punctured",
        activo: true,
        fechaCreacion: generarFechaDinamica(8, 12)
      }
    ],
    fechaCreacion: generarFechaDinamica(8, 12),
  },
  {
    id: 4,
    nombre: "Falla eléctrica",
    alertType: "Electrical Failure",
    activo: false,
    motivos: [
      {
        id: 7,
        nombre: "Problema con batería",
        nombreIngles: "Battery problem",
        activo: false,
        fechaCreacion: generarFechaDinamica(20, 7)
      },
      {
        id: 8,
        nombre: "Cortocircuito",
        nombreIngles: "Short circuit",
        activo: true,
        fechaCreacion: generarFechaDinamica(20, 7)
      }
    ],
    fechaCreacion: generarFechaDinamica(20, 7),
    fechaModificacion: generarFechaDinamica(5, 2)
  },
  {
    id: 5,
    nombre: "Problema de combustible",
    alertType: "Fuel Issue",
    activo: true,
    motivos: [
      {
        id: 9,
        nombre: "Tanque vacío",
        nombreIngles: "Empty tank",
        activo: true,
        fechaCreacion: generarFechaDinamica(6, 15)
      },
      {
        id: 10,
        nombre: "Fuga de combustible",
        nombreIngles: "Fuel leak",
        activo: true,
        fechaCreacion: generarFechaDinamica(6, 15)
      }
    ],
    fechaCreacion: generarFechaDinamica(6, 15),
  }
];