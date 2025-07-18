export interface BitacoraLectora {
  id: number;
  usuario: string;
  empresaTransporte: string;
  fechaHoraEvento: string; // ISO UTC
  fechaHoraDescarga: string; // ISO UTC
  placaAutobus: string;
  idAutobus: number | null;
  modulo: string;
  serial: string;
  descripcion: string;
  datos: string;
  esHardware: boolean;
  lugar: string;
  latitud: number;
  longitud: number;
  evento: number;
}

const modulos = [
  'Lectora', 'Usuarios', 'Rutas', 'Sesión', 'Escaneo'
];

const lugaresCostaRica = [
  'San José', 'Cartago', 'Alajuela', 'Heredia', 'Puntarenas', 'Guanacaste', 'Limón',
  'Escazú', 'Santa Ana', 'Curridabat', 'Tibás', 'Moravia', 'Goicoechea', 'Vázquez de Coronado',
  'Tarrazú', 'León Cortés', 'Guarco', 'Acosta', 'Aserrí', 'Mora', 'Puriscal',
  'Turrubares', 'Dota', 'Corralillo', 'Garita', 'Sarchí', 'Grecia', 'San Mateo',
  'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero',
  'Valverde Vega', 'Upala', 'Los Chiles', 'Guatuso', 'Barva', 'Santo Domingo',
  'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo',
  'Sarapiquí', 'La Fortuna', 'Monteverde', 'Coyol', 'El Roble', 'Carrizal',
  'Tacares', 'Aurora', 'Sabana Redonda', 'Guarari', 'Rincón de Cacao', 'San Joaquín',
  'Poas', 'San Bosco', 'Volcán Poás', 'Manuel Antonio', 'Tamarindo', 'Jacó'
];

const descripciones = [
  'Licencia: Sin conexión al servicio de licenciamiento',
  'Licencia: Quedan 102.1 días de licencia. Última conexión al servidor de licenciamiento realizada',
  'Usuario: Usuarios descargados: 0',
  'Usuario: Inicia descarga de usuarios',
  'Ruta: Rutas descargadas: 0', 
  'Ruta: Inicia descarga de rutas',
  'Navegación interfaz: Ingresa: HomeActivity',
  'Navegación interfaz: Ingresa: LoginActivity',
  'Navegación interfaz: Ingresa: StartServiceActivity',
  'Navegación interfaz: Ingresa: ServiceActivity',
  'Sesión: Login - Cierra sesión',
  'Servicio: Se cierra el servicio',
  'Servicio: Ruta - Inicia Ruta',
  'Fecha hora del sistema: KRO = SYS =',
  'Apagado Boletera CC: Boletera apagada por el centro de carga',
  'Encendido Boletera: Boletera encendida',
  'Se inicia la lectora con la versión',
  'Lectura de Qr: QR -> Escaneado sin conexión',
  'Lectura de Qr: Timeout - The source did not signal an event',
  'Lectura de Qr: QR -> Finaliza petición servidor - Error',
  'Lectura de Qr: QR -> Inicia petición servidor',
  'Lectura de Qr: QR -> Válido con internet - validando contra el servidor',
  'Usuario: Error - The source did not signal an event for 15 seconds and has been terminated',
  'Ruta: Error - The source did not signal an event for 15 seconds and has been terminated'
];

const datos = [
  'Sin conexión al servicio de licenciamiento',
  'Quedan 102.1 días de licencia. Última conexión al servidor de licenciamiento realizada el 07/18/2025 20:53:47.',
  'Usuarios descargados: 0',
  'Inicia descarga de usuarios - 2025-07-17T18:58:39',
  'Rutas descargadas: 0',
  'Inicia descarga de rutas - 2025-07-14T17:03:25',
  'Ingresa: HomeActivity',
  'Ingresa: LoginActivity', 
  'Ingresa: StartServiceActivity',
  'Ingresa: ServiceActivity',
  'Login - [1132] - Cierra sesión',
  'Se cierra el servicio',
  'Ruta - Inicia Ruta [B44 - Sabana Redonda]',
  'KRO = [Fri Jul 18 14:59:15 CST 2025] SYS = [Fri Jul 18 14:59:15 CST 2025]',
  'Boletera apagada por el centro de carga',
  'Boletera encendida',
  '0.43.0 (43)',
  'QR -> Escaneado sin conexión',
  'Timeout - The source did not signal an event for 4 seconds and has been terminated.',
  'QR -> Finaliza petición servidor - Error [1cb0e746-bb0e-429f-a391-6d784a29ac91 - Fri Jul 18 14:56:06 CST 2025]',
  'QR -> Inicia petición servidor [1cb0e746-bb0e-429f-a391-6d784a29ac91 - Fri Jul 18 14:56:06 CST 2025]',
  'QR -> Válido con internet - validando contra el servidor',
  'QR -> Datos: idUser [cbb14137-e6f0-42a3-a937-23aae61c047a] typePay [1] fecha [2025-07-18T14:56:06-06:00] idFreeZone {3a49d373-03b3-4b8f-8c45-93866c85918b}',
  'QR -> Plano: 0upWHl2mMnMnzjk7XlBUEuSUFPW7yi+toCR9idAtHEfpU90E0hQC6nTpXxbF5c8dZ9DsrATb3nRntjrRCe5fR9yfNfGqs0kuFN1bB2iVlDvR1B+Lx5XyUZnUzlE4tt9oVBjM4TZv1sl45AM3YYpFlA==',
  'Error - The source did not signal an event for 15 seconds and has been terminated.',
  '{"temperatura":25.6,"humedad":68,"estado":"activo","señal":{"fuerza":85,"tipo":"4G"},"bateria":{"nivel":92,"estado":"cargando"}}',
  '{"evento":"sincronizacion_completada","registros_procesados":156,"tiempo_procesamiento":"00:02:34","errores":0}',
  '{"dispositivo_id":"TE08239R40018","version_firmware":"2.4.1","memoria_disponible":"45MB","espacio_libre":"2.1GB"}',
  '{"coordenadas":{"lat":9.99386665,"lng":-84.27551363},"precision":3.2,"fecha_ubicacion":"2025-07-18T14:58:55Z"}',
  '{"transaccion_id":"TXN-789456","monto":1250,"tipo_pago":"tarjeta","estado":"aprobada","timestamp":"2025-07-18T14:56:35Z"}'
];

const usuarios = [
  'NELSON SOLANO OROZCO', 'EDWIN SOLIS ARROYO', 'ADOLFO ALBERTO BARRANTES CHAVARRIA',
  'MELVIN SOLIS ARROYO', 'ROLANDO SERRANO MELENDEZ', 'EDUARDO ENRIQUE CAMACHO CAMPOS',
  'ALONSO HERRERA MADRIGAL', 'FRANCISCO ALVAREZ MOREIRA', 'LEONARDO VALENCIANO SOLANO',
  'JORGE ARTURO SOLERA NOGUERA', 'JORGE LUIS ABARCA ZUÑIGA', 'RIGOBERTO CORTES OSES',
  'JAIRO ALBERTO ALVAREZ RIVERA', 'CARLOS GABRIEL ARRIETA ZAMORA', 'LUIS FERNANDO VARGAS GONZALEZ',
  'OSCAR MAURICIO BALDELOMAR MORALES', 'MARCO AURELIO CARVAJAL VARGAS', 'ALEXANDER RAMIREZ ALVARADO',
  'RODOLFO ROJAS GARCÍA', 'MANRIQUE ARIAS TORRES', 'JORGE ARTURO AGUILAR SOTO',
  'FELIX ALBERTO MORALES ESPINOZA', 'CARLOS SALAS VILLALOBOS', 'FERNANDO CORDERO CORDERO',
  'CRISTIAN MARCIAL MEJIAS HERRA', 'DENNIS RIVERA LACAYO', 'FRANKLIN VENEGAS VARGAS'
];

const placas = [
  'LB2104', 'HB3992', 'HB4498', 'SJB10647', 'HB4424', 'CB2082', 'SJB9742', 'PB2236',
  'SJB14139', 'SJB19642', 'HB2603', 'AB8511', 'SJB10853', 'HB4004', 'LB1340', 'CB1887',
  'AB4643', 'HB2151', 'SJB10641', 'LB1356', 'AB8506', 'HB4731', 'AB4096', 'HB4426',
  'AB4745', 'SJB12715', 'HB3993', 'HB1735', 'HB4172', 'CB2021', 'AB8027', 'HB4722',
  'GB2878', 'GB2663', 'SJB10643', 'HB4204', 'SJB12091', 'AB4020'
];

const seriales = [
  'TE08239R40018', 'TE08239S40151', 'TE08239R40004', 'TE08239R40129', 'TE08239S40327',
  'TE08239R40074', 'TE08239S40280', 'TE08239R40114', 'TE08239S40338', 'TE08239R40050',
  'TE08239S40104', 'TE08239T40004', 'TE08239R40119', 'TE08239S40112', 'TE08239S40005',
  'TE08239R40106', 'TE08239R40046', 'TE08239S40059', 'TE08239R40103', 'TE08239S40008',
  'TE08239S40189', 'TE08239S40311', 'TE08239S40187', 'TE08239S40082', 'TE08239S40317',
  'TE08239S40025', 'TE08239R40122', 'TE08239S40146', 'TE08239R40030', 'TE08239S40134',
  'TE08239S40169', 'TE08239S40012', 'TE08239S40113', 'TE08239S40034', 'TE08239R40079',
  'TE08239R40141', 'TE08239R40110', 'TE08239R40005', 'TE08239S40305', 'TE08239S40335',
  'TE08239R40025'
];

const servicios = [
  'Carrizal - AUTOBUS', 'B44 - HEREDIA AURORA - AUTOBUS', 'B44 - Tacares - AUTOBUS',
  'Rincon de Cacao - AUTOBUS', 'Tacares - AUTOBUS', 'Aurora - AUTOBUS', 'EPS - HEREDIA - BUSETA',
  'B44 - Coyol - AUTOBUS', 'B44 - HEREDIA - AUTOBUS', 'Coyol - MICROBUS', 'B44 - El Roble - AUTOBUS',
  'Sarchi - AUTOBUS', 'Poas - BUSETA', 'Naranjo (El Rosario) - AUTOBUS', 'Coyol - AUTOBUS',
  'B44 - Sabana Redonda - MICROBUS', 'San Jose - AUTOBUS', 'B44 - Sabana Redonda - BUSETA',
  'EL ROBLE - BUSETA', 'B44 - Guarari - AUTOBUS', 'Naranjo - AUTOBUS', 'San Joaquin - AUTOBUS',
  'B44 - Carrizal - AUTOBUS', 'San Bosco - AUTOBUS'
];

function generateRandomDate(daysAgo: number = 0): string {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  now.setHours(Math.floor(Math.random() * 24));
  now.setMinutes(Math.floor(Math.random() * 60));
  now.setSeconds(Math.floor(Math.random() * 60));
  return now.toISOString();
}

function generateCoordinates(): { lat: number; lng: number } {
  // Coordenadas aproximadas de Costa Rica
  const lat = 9.5 + Math.random() * 1.5; // Entre 9.5 y 11.0
  const lng = -85.5 + Math.random() * 1.5; // Entre -85.5 y -84.0
  return { 
    lat: parseFloat(lat.toFixed(8)), 
    lng: parseFloat(lng.toFixed(8)) 
  };
}

export const mockBitacorasLectoras: BitacoraLectora[] = Array.from({ length: 250 }, (_, index) => {
  const fechaEvento = generateRandomDate(Math.floor(Math.random() * 7));
  const fechaDescarga = new Date(fechaEvento);
  fechaDescarga.setMinutes(fechaDescarga.getMinutes() + Math.floor(Math.random() * 60));
  
  const coords = generateCoordinates();
  const hasUser = Math.random() > 0.3;
  const hasService = Math.random() > 0.2;
  
  return {
    id: index + 1,
    usuario: hasUser ? usuarios[Math.floor(Math.random() * usuarios.length)] : '',
    empresaTransporte: hasService ? servicios[Math.floor(Math.random() * servicios.length)] : '',
    fechaHoraEvento: fechaEvento,
    fechaHoraDescarga: fechaDescarga.toISOString(),
    placaAutobus: placas[Math.floor(Math.random() * placas.length)],
    idAutobus: Math.random() > 0.1 ? Math.floor(Math.random() * 9999999) + 1000 : null,
    modulo: modulos[Math.floor(Math.random() * modulos.length)],
    serial: seriales[Math.floor(Math.random() * seriales.length)],
    descripcion: descripciones[Math.floor(Math.random() * descripciones.length)],
    datos: datos[Math.floor(Math.random() * datos.length)],
    esHardware: Math.random() > 0.7,
    lugar: lugaresCostaRica[Math.floor(Math.random() * lugaresCostaRica.length)],
    latitud: Math.random() > 0.05 ? coords.lat : 0,
    longitud: Math.random() > 0.05 ? coords.lng : 0,
    evento: [1, 6, 7, 8, 9, 14, 15, 16, 18, 19, 20][Math.floor(Math.random() * 11)]
  };
});