import { MantenimientoRecord, CategoriaMantenimiento } from '@/types/mantenimiento';

export const mockCategoriasMantenimiento: CategoriaMantenimiento[] = [
  { id: '1', nombre: 'Mantenimiento Preventivo', codigo: 'PREV', activo: true },
  { id: '2', nombre: 'Mantenimiento Correctivo', codigo: 'CORR', activo: true },
  { id: '3', nombre: 'Cambio de Aceite', codigo: 'ACE', activo: true },
  { id: '4', nombre: 'Revisión de Frenos', codigo: 'FREN', activo: true },
  { id: '5', nombre: 'Cambio de Filtros', codigo: 'FILT', activo: true },
  { id: '6', nombre: 'Revisión de Motor', codigo: 'MOT', activo: true },
  { id: '7', nombre: 'Mantenimiento de Llantas', codigo: 'LLAN', activo: true },
  { id: '8', nombre: 'Sistema Eléctrico', codigo: 'ELEC', activo: true },
  { id: '9', nombre: 'Air Acondicionado', codigo: 'AC', activo: true },
  { id: '10', nombre: 'Carrocería', codigo: 'CARR', activo: true },
];

export const mockMantenimientos: MantenimientoRecord[] = [
  {
    id: '1',
    fechaMantenimiento: '2024-01-15',
    placa: 'BUS-001',
    categoria: mockCategoriasMantenimiento[0],
    detalle: 'Mantenimiento preventivo programado cada 10,000 km. Se realizó cambio de aceite de motor, filtro de aceite, revisión de niveles de fluidos, inspección de frenos y sistema de dirección.',
    transportista: { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ001' },
    costo: 250000,
    proveedor: 'Taller Central',
    kilometraje: 45000
  },
  {
    id: '2',
    fechaMantenimiento: '2024-01-14',
    placa: 'BUS-002',
    categoria: mockCategoriasMantenimiento[1],
    detalle: 'Reparación de sistema de frenos delanteros. Se detectó desgaste excesivo en las pastillas de freno y discos. Se procedió al cambio completo del sistema.',
    transportista: { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV002' },
    costo: 180000,
    proveedor: 'Frenos Especializados S.A.',
    kilometraje: 52000
  },
  {
    id: '3',
    fechaMantenimiento: '2024-01-13',
    placa: 'BUS-003',
    categoria: mockCategoriasMantenimiento[2],
    detalle: 'Cambio de aceite de motor y filtro. Mantenimiento rutinario programado cada 5,000 km para garantizar el buen funcionamiento del motor.',
    transportista: { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ001' },
    costo: 85000,
    proveedor: 'Lubricantes Premium',
    kilometraje: 38000
  },
  {
    id: '4',
    fechaMantenimiento: '2024-01-12',
    placa: 'BUS-004',
    categoria: mockCategoriasMantenimiento[5],
    detalle: 'Revisión completa del motor debido a pérdida de potencia reportada por el conductor. Se encontraron problemas en las bujías y cables de encendido que fueron reemplazados.',
    transportista: { id: '3', nombre: 'Empresa de Transporte Central', codigo: 'ETC003' },
    costo: 320000,
    proveedor: 'Motores y Repuestos Central',
    kilometraje: 67000
  },
  {
    id: '5',
    fechaMantenimiento: '2024-01-11',
    placa: 'BUS-005',
    categoria: mockCategoriasMantenimiento[6],
    detalle: 'Rotación y balanceo de llantas. Inspección del desgaste y presión de aire. Se detectó desgaste irregular en llanta trasera izquierda que fue reemplazada.',
    transportista: { id: '4', nombre: 'Transportes Unidos', codigo: 'TU004' },
    costo: 95000,
    proveedor: 'Llantas y Servicios',
    kilometraje: 41000
  },
  {
    id: '6',
    fechaMantenimiento: '2024-01-10',
    placa: 'BUS-006',
    categoria: mockCategoriasMantenimiento[7],
    detalle: 'Diagnóstico y reparación del sistema eléctrico. Se solucionaron problemas con las luces interiores y el sistema de carga de la batería.',
    transportista: { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV002' },
    costo: 150000,
    proveedor: 'Electricidad Automotriz',
    kilometraje: 33000
  },
  {
    id: '7',
    fechaMantenimiento: '2024-01-09',
    placa: 'BUS-007',
    categoria: mockCategoriasMantenimiento[8],
    detalle: 'Mantenimiento del sistema de aire acondicionado. Recarga de refrigerante, limpieza de filtros y revisión del compresor.',
    transportista: { id: '5', nombre: 'Buses Express Costa Rica', codigo: 'BECR005' },
    costo: 120000,
    proveedor: 'Clima Automotriz S.A.',
    kilometraje: 29000
  },
  {
    id: '8',
    fechaMantenimiento: '2024-01-08',
    placa: 'BUS-008',
    categoria: mockCategoriasMantenimiento[9],
    detalle: 'Reparación de daños menores en la carrocería. Soldadura de puntos de oxidación y pintura de áreas afectadas para prevenir mayor deterioro.',
    transportista: { id: '6', nombre: 'Transportes Metropolitanos', codigo: 'TM006' },
    costo: 200000,
    proveedor: 'Carrocerías y Pintura',
    kilometraje: 58000
  },
  {
    id: '9',
    fechaMantenimiento: '2024-01-07',
    placa: 'BUS-009',
    categoria: mockCategoriasMantenimiento[4],
    detalle: 'Cambio de filtros de aire, combustible y aceite. Mantenimiento preventivo para garantizar la calidad del aire del motor y combustible limpio.',
    transportista: { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ001' },
    costo: 65000,
    proveedor: 'Filtros Especializados',
    kilometraje: 35000
  },
  {
    id: '10',
    fechaMantenimiento: '2024-01-06',
    placa: 'BUS-010',
    categoria: mockCategoriasMantenimiento[3],
    detalle: 'Revisión y ajuste del sistema de frenos. Calibración de frenos de aire, inspección de tambores y zapatas. Sistema funcionando correctamente.',
    transportista: { id: '7', nombre: 'Línea Azul Transporte', codigo: 'LAT007' },
    costo: 175000,
    proveedor: 'Sistemas de Frenos',
    kilometraje: 46000
  },
  {
    id: '11',
    fechaMantenimiento: '2024-01-05',
    placa: 'BUS-011',
    categoria: mockCategoriasMantenimiento[0],
    detalle: 'Mantenimiento preventivo completo de 15,000 km. Incluye cambio de aceite, filtros, revisión de frenos, dirección, suspensión y sistema eléctrico.',
    transportista: { id: '8', nombre: 'Servicios de Transporte Especial', codigo: 'STE008' },
    costo: 380000,
    proveedor: 'Mantenimiento Integral',
    kilometraje: 60000
  },
  {
    id: '12',
    fechaMantenimiento: '2024-01-04',
    placa: 'BUS-012',
    categoria: mockCategoriasMantenimiento[1],
    detalle: 'Reparación de emergencia del sistema de transmisión. Se detectó fuga de aceite en el diferencial que requirió reemplazo del sello.',
    transportista: { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV002' },
    costo: 280000,
    proveedor: 'Transmisiones Profesionales',
    kilometraje: 71000
  }
];