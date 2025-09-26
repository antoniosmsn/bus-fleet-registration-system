import { BitacoraSistema } from '@/types/bitacora-sistema';

export const mockBitacorasSistema: BitacoraSistema[] = [
  {
    id: '1',
    fechaHora: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    application: 'RideCode.Auth.Api',
    logLevel: 'Information',
    user: 'admin@zonafranca.com',
    message: 'Usuario autenticado correctamente',
    errorCode: '',
    apiErrorMessage: '',
    internalErrorMessage: ''
  },
  {
    id: '2',
    fechaHora: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    application: 'RideCode.Configuration.Api',
    logLevel: 'Warning',
    user: 'system',
    message: 'Configuración de zona franca no encontrada',
    errorCode: 'CFG_001',
    apiErrorMessage: 'Zone configuration not found for ID 123',
    internalErrorMessage: 'Database query returned null for zone_id=123'
  },
  {
    id: '3',
    fechaHora: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    application: 'RideCode.Reader.Api',
    logLevel: 'Error',
    user: 'conductor@transport.com',
    message: 'Error al procesar lectura de tarjeta',
    errorCode: 'RDR_002',
    apiErrorMessage: 'Card reading failed: Invalid card format',
    internalErrorMessage: 'RFID reader communication timeout after 5 seconds'
  },
  {
    id: '4',
    fechaHora: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    application: 'RideCode.Notifications.Api',
    logLevel: 'Information',
    user: 'system',
    message: 'Notificación enviada correctamente',
    errorCode: '',
    apiErrorMessage: '',
    internalErrorMessage: ''
  },
  {
    id: '5',
    fechaHora: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    application: 'RideCode.Logger',
    logLevel: 'Critical',
    user: 'system',
    message: 'Fallo crítico en base de datos',
    errorCode: 'DB_001',
    apiErrorMessage: 'Database connection lost',
    internalErrorMessage: 'SQL Server connection pool exhausted, max connections reached'
  },
  {
    id: '6',
    fechaHora: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
    application: 'RideCode.Reports.Api',
    logLevel: 'Information',
    user: 'admin@zonafranca.com',
    message: 'Reporte generado exitosamente',
    errorCode: '',
    apiErrorMessage: '',
    internalErrorMessage: ''
  },
  {
    id: '7',
    fechaHora: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    application: 'RideCode.Auth.Api',
    logLevel: 'Warning',
    user: 'user@company.com',
    message: 'Intento de acceso no autorizado',
    errorCode: 'AUTH_003',
    apiErrorMessage: 'Insufficient permissions for resource access',
    internalErrorMessage: 'User role validation failed for endpoint /api/admin/users'
  },
  {
    id: '8',
    fechaHora: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 hours ago
    application: 'RideCode.Reader.Api',
    logLevel: 'Information',
    user: 'conductor@transport.com',
    message: 'Lectura de tarjeta procesada correctamente',
    errorCode: '',
    apiErrorMessage: '',
    internalErrorMessage: ''
  }
];