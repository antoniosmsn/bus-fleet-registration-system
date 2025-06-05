
export interface AutobusProgramacion {
  id: number;
  placa: string;
  identificador: string;
  empresaTransporte: string;
  conductores: number; // 0 = ENVIADO, 1 = PENDIENTE DE ENVÍO
  geocercas: number;
  paradas: number;
  rutas: number;
  parametros: number;
  tarifas: number;
  usuariosSoporte: number;
  logcat: number;
}

export interface FiltrosProgramacion {
  empresaTransporte: string;
  placa: string;
  identificador: string;
}

export interface TiposDatos {
  conductores: boolean;
  geocercas: boolean;
  paradas: boolean;
  rutas: boolean;
  parametros: boolean;
  tarifas: boolean;
  usuariosSoporte: boolean;
  logcat: boolean;
}
