export interface BitacoraSistema {
  id: string;
  fechaHora: string; // ISO string
  application: string;
  logLevel: 'Information' | 'Warning' | 'Error' | 'Critical';
  user?: string;
  message?: string;
  errorCode?: string;
  apiErrorMessage?: string;
  internalErrorMessage?: string;
}

export interface BitacoraSistemaFilter {
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  application: string; // 'todos' or specific application
  logLevel: string; // 'todos' or specific level
  user: string;
  message: string;
  errorCode: string;
  apiErrorMessage: string;
  internalErrorMessage: string;
}

export const applicationsOptions = [
  { value: 'todos', label: 'Todas las aplicaciones' },
  { value: 'RideCode.Configuration.Api', label: 'RideCode.Configuration.Api' },
  { value: 'RideCode.Notifications.Api', label: 'RideCode.Notifications.Api' },
  { value: 'RideCode.Auth.Api', label: 'RideCode.Auth.Api' },
  { value: 'RideCode.Logger', label: 'RideCode.Logger' },
  { value: 'RideCode.Reports.Api', label: 'RideCode.Reports.Api' },
  { value: 'RideCode.Reader.Api', label: 'RideCode.Reader.Api' }
];

export const logLevelsOptions = [
  { value: 'todos', label: 'Todos los niveles' },
  { value: 'Information', label: 'Information' },
  { value: 'Warning', label: 'Warning' },
  { value: 'Error', label: 'Error' },
  { value: 'Critical', label: 'Critical' }
];