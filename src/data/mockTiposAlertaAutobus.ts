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
    fechaCreacion: generarFechaDinamica(15, 2),
    fechaModificacion: generarFechaDinamica(3, 8)
  },
  {
    id: 2,
    nombre: "Trayecto bloqueado",
    activo: true,
    fechaCreacion: generarFechaDinamica(12, 5),
    fechaModificacion: generarFechaDinamica(1, 3)
  },
  {
    id: 3,
    nombre: "Pinchazo de llanta",
    activo: true,
    fechaCreacion: generarFechaDinamica(8, 12),
  },
  {
    id: 4,
    nombre: "Falla eléctrica",
    activo: false,
    fechaCreacion: generarFechaDinamica(20, 7),
    fechaModificacion: generarFechaDinamica(5, 2)
  },
  {
    id: 5,
    nombre: "Problema de combustible",
    activo: true,
    fechaCreacion: generarFechaDinamica(6, 15),
  },
  {
    id: 6,
    nombre: "Avería del aire acondicionado",
    activo: true,
    fechaCreacion: generarFechaDinamica(4, 9),
    fechaModificacion: generarFechaDinamica(0, 18)
  },
  {
    id: 7,
    nombre: "Problema con puertas",
    activo: false,
    fechaCreacion: generarFechaDinamica(25, 14),
    fechaModificacion: generarFechaDinamica(10, 6)
  },
  {
    id: 8,
    nombre: "Falla en sistema de comunicación",
    activo: true,
    fechaCreacion: generarFechaDinamica(2, 4),
  },
  {
    id: 9,
    nombre: "Sobrecalentamiento del motor",
    activo: true,
    fechaCreacion: generarFechaDinamica(18, 11),
    fechaModificacion: generarFechaDinamica(7, 20)
  },
  {
    id: 10,
    nombre: "Problema de dirección",
    activo: false,
    fechaCreacion: generarFechaDinamica(30, 8),
    fechaModificacion: generarFechaDinamica(15, 3)
  },
  {
    id: 11,
    nombre: "Falla del sistema de frenos",
    activo: true,
    fechaCreacion: generarFechaDinamica(1, 6),
  },
  {
    id: 12,
    nombre: "Problema con transmisión",
    activo: true,
    fechaCreacion: generarFechaDinamica(9, 13),
    fechaModificacion: generarFechaDinamica(2, 1)
  },
  {
    id: 13,
    nombre: "Filtros obstruidos",
    activo: false,
    fechaCreacion: generarFechaDinamica(14, 18),
    fechaModificacion: generarFechaDinamica(6, 12)
  },
  {
    id: 14,
    nombre: "Problema con bomba de combustible",
    activo: true,
    fechaCreacion: generarFechaDinamica(0, 8),
  },
  {
    id: 15,
    nombre: "Sistema de suspensión averiado",
    activo: true,
    fechaCreacion: generarFechaDinamica(22, 4),
    fechaModificacion: generarFechaDinamica(8, 15)
  }
];