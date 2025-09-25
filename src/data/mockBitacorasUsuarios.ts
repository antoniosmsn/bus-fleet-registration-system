import { BitacoraUsuario } from '@/types/bitacora-usuario';

// Generar datos para el día actual
const generateTodayData = (): BitacoraUsuario[] => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const baseData: BitacoraUsuario[] = [
    {
      id: '1',
      fechaHora: `${todayStr}T08:30:00.000Z`,
      usuario: 'admin@elcoyol.com',
      nombreCompleto: 'Carlos Administrador',
      perfil: 'Administrador Zona Franca',
      zonaFranca: 'El Coyol',
      accion: 'Ingreso al sistema',
      tipoAccion: 'Inicio Sesión',
      resultado: 'Exitoso',
      descripcion: 'Inicio de sesión exitoso desde IP 192.168.1.100'
    },
    {
      id: '2',
      fechaHora: `${todayStr}T09:15:00.000Z`,
      usuario: 'operador1@elcoyol.com',
      nombreCompleto: 'María Operadora',
      perfil: 'Operador de Transporte',
      zonaFranca: 'El Coyol',
      accion: 'Registro de nuevo conductor',
      tipoAccion: 'Registro',
      resultado: 'Exitoso',
      descripcion: 'Registro del conductor Juan Pérez, cédula 123456789'
    },
    {
      id: '3',
      fechaHora: `${todayStr}T10:00:00.000Z`,
      usuario: 'supervisor@elcoyol.com',
      nombreCompleto: 'Roberto Supervisor',
      perfil: 'Supervisor de Operaciones',
      zonaFranca: 'El Coyol',
      accion: 'Consulta de reportes de cumplimiento',
      tipoAccion: 'Consulta',
      resultado: 'Exitoso',
      descripcion: 'Consulta de reportes del periodo 01/09/2025 - 25/09/2025'
    },
    {
      id: '4',
      fechaHora: `${todayStr}T10:30:00.000Z`,
      usuario: 'operador2@elcoyol.com',
      nombreCompleto: 'Ana Operadora',
      perfil: 'Operador de Transporte',
      zonaFranca: 'El Coyol',
      accion: 'Intento de edición de ruta sin permisos',
      tipoAccion: 'Edición',
      resultado: 'Error',
      descripcion: 'Error: Usuario sin permisos para modificar ruta RT-001'
    },
    {
      id: '5',
      fechaHora: `${todayStr}T11:15:00.000Z`,
      usuario: 'admin@elcoyol.com',
      nombreCompleto: 'Carlos Administrador',
      perfil: 'Administrador Zona Franca',
      zonaFranca: 'El Coyol',
      accion: 'Aprobación de solicitud de cambio de ruta',
      tipoAccion: 'Aprobación',
      resultado: 'Exitoso',
      descripcion: 'Aprobación de cambio de ruta RT-001 a RT-002 para servicio SV-12345'
    },
    {
      id: '6',
      fechaHora: `${todayStr}T12:00:00.000Z`,
      usuario: 'auditor@elcoyol.com',
      nombreCompleto: 'Luis Auditor',
      perfil: 'Auditor Interno',
      zonaFranca: 'El Coyol',
      accion: 'Exportación de bitácoras de usuario',
      tipoAccion: 'Consulta',
      resultado: 'Exitoso',
      descripcion: 'Exportación a PDF de bitácoras del período actual'
    },
    {
      id: '7',
      fechaHora: `${todayStr}T13:30:00.000Z`,
      usuario: 'operador1@elcoyol.com',
      nombreCompleto: 'María Operadora',
      perfil: 'Operador de Transporte',
      zonaFranca: 'El Coyol',
      accion: 'Actualización de información de conductor',
      tipoAccion: 'Edición',
      resultado: 'Advertencia',
      descripcion: 'Actualización parcial: algunos campos no pudieron ser modificados'
    },
    {
      id: '8',
      fechaHora: `${todayStr}T14:15:00.000Z`,
      usuario: 'supervisor@elcoyol.com',
      nombreCompleto: 'Roberto Supervisor',
      perfil: 'Supervisor de Operaciones',
      zonaFranca: 'El Coyol',
      accion: 'Rechazo de solicitud de mantenimiento',
      tipoAccion: 'Rechazo',
      resultado: 'Exitoso',
      descripcion: 'Rechazo de solicitud MNT-001: documentación incompleta'
    },
    {
      id: '9',
      fechaHora: `${todayStr}T15:00:00.000Z`,
      usuario: 'operador3@elcoyol.com',
      nombreCompleto: 'Jorge Operador',
      perfil: 'Operador de Transporte',
      zonaFranca: 'El Coyol',
      accion: 'Registro de nueva ruta',
      tipoAccion: 'Registro',
      resultado: 'Exitoso',
      descripcion: 'Registro de ruta RT-025: Terminal A - Zona Industrial'
    },
    {
      id: '10',
      fechaHora: `${todayStr}T15:45:00.000Z`,
      usuario: 'admin@elcoyol.com',
      nombreCompleto: 'Carlos Administrador',
      perfil: 'Administrador Zona Franca',
      zonaFranca: 'El Coyol',
      accion: 'Consulta de bitácoras de sistema',
      tipoAccion: 'Consulta',
      resultado: 'Exitoso',
      descripcion: 'Revisión de logs del sistema para auditoría mensual'
    }
  ];

  return baseData;
};

export const mockBitacorasUsuarios = generateTodayData();