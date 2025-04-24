
import { z } from "zod";

export const conductorFormSchema = z.object({
  empresaTransporte: z.string().nonempty("La empresa de transporte es requerida"),
  numeroCedula: z
    .string()
    .nonempty("El número de cédula es requerido")
    .max(12, "Máximo 12 caracteres"),
  nombre: z
    .string()
    .nonempty("El nombre es requerido")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras permitidas"),
  primerApellido: z
    .string()
    .nonempty("El primer apellido es requerido")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras permitidas"),
  segundoApellido: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "Solo letras permitidas")
    .optional()
    .or(z.literal("")),
  fechaNacimiento: z
    .date({
      required_error: "La fecha de nacimiento es requerida",
    }),
  correoElectronico: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .email("Formato de correo inválido")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .nonempty("El teléfono es requerido")
    .max(20, "Máximo 20 caracteres"),
  fechaVencimientoCedula: z
    .date({
      required_error: "La fecha de vencimiento de cédula es requerida",
    })
    .refine((date) => date >= new Date(), {
      message: "La fecha no puede ser anterior al día de hoy",
    }),
  fechaVencimientoLicencia: z
    .date({
      required_error: "La fecha de vencimiento de licencia es requerida",
    })
    .refine((date) => date >= new Date(), {
      message: "La fecha no puede ser anterior al día de hoy",
    }),
  imagenCedula: z.instanceof(File, { message: "La imagen de cédula es requerida" }),
  imagenLicencia: z.instanceof(File, { message: "La imagen de licencia es requerida" }),
  contrasena: z
    .string()
    .nonempty("La contraseña es requerida")
    .min(4, "Mínimo 4 caracteres")
    .max(12, "Máximo 12 caracteres")
    .regex(/^[a-hjk-mo-z]+$/, "Solo letras minúsculas (excluyendo i, l, ñ, acentos y símbolos)"),
  confirmarContrasena: z
    .string()
    .nonempty("La confirmación de contraseña es requerida"),
})
.refine((data) => data.contrasena === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"],
});

export type ConductorFormValues = z.infer<typeof conductorFormSchema>;

export interface ConductorRegistrationApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    codigo: string;
  }
}

export interface HaciendaApiResponse {
  success: boolean;
  data?: {
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
  }
  message?: string;
}
