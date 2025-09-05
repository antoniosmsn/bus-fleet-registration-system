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
    activo: true,
    motivos: [
      {
        id: 1,
        nombre: "Problema con el motor",
        activo: true,
        fechaCreacion: generarFechaDinamica(15, 2)
      },
      {
        id: 2,
        nombre: "Falla en la transmisión",
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
    activo: true,
    motivos: [
      {
        id: 3,
        nombre: "Accidente de tránsito",
        activo: true,
        fechaCreacion: generarFechaDinamica(12, 5)
      },
      {
        id: 4,
        nombre: "Obra en construcción",
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
    activo: true,
    motivos: [
      {
        id: 5,
        nombre: "Llanta delantera pinchada",
        activo: true,
        fechaCreacion: generarFechaDinamica(8, 12)
      },
      {
        id: 6,
        nombre: "Llanta trasera pinchada",
        activo: true,
        fechaCreacion: generarFechaDinamica(8, 12)
      }
    ],
    fechaCreacion: generarFechaDinamica(8, 12),
  },
  {
    id: 4,
    nombre: "Falla eléctrica",
    activo: false,
    motivos: [
      {
        id: 7,
        nombre: "Problema con batería",
        activo: false,
        fechaCreacion: generarFechaDinamica(20, 7)
      },
      {
        id: 8,
        nombre: "Cortocircuito",
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
    activo: true,
    motivos: [
      {
        id: 9,
        nombre: "Tanque vacío",
        activo: true,
        fechaCreacion: generarFechaDinamica(6, 15)
      },
      {
        id: 10,
        nombre: "Fuga de combustible",
        activo: true,
        fechaCreacion: generarFechaDinamica(6, 15)
      }
    ],
    fechaCreacion: generarFechaDinamica(6, 15),
  }
];