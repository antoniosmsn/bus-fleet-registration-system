import { AsignacionRuta } from '@/types/asignacion-ruta';
import { AsignacionEdicionData, TarifaExistente } from '@/types/asignacion-edicion';
import { Ramal, EmpresaCliente } from '@/types/asignacion-registro';

// Mock data de ramales
export const mockRamales: Ramal[] = [
  { id: '1', nombre: 'San José - Cartago', tipoRuta: 'publica' as 'privada' },
  { id: '2', nombre: 'Heredia - Alajuela', tipoRuta: 'publica' as 'privada' },
  { id: '3', nombre: 'Zona Franca Intel', tipoRuta: 'privada' },
  { id: '4', nombre: 'Campus Tecnológico', tipoRuta: 'especial' },
  { id: '5', nombre: 'Parque Industrial', tipoRuta: 'parque' }
];

// Mock data de empresas cliente
export const mockEmpresasCliente: EmpresaCliente[] = [
  {
    id: '1',
    nombre: 'Intel Corporation',
    cuentasPO: [
      { id: '1', nombre: 'Cuenta Principal', codigo: 'MAIN001', esPrincipal: true },
      { id: '2', nombre: 'Desarrollo R&D', codigo: 'RD001', esPrincipal: false },
      { id: '3', nombre: 'Manufactura', codigo: 'MFG001', esPrincipal: false }
    ]
  },
  {
    id: '2',
    nombre: 'Universidad Nacional',
    cuentasPO: [
      { id: '4', nombre: 'Cuenta Principal', codigo: 'UNA001', esPrincipal: true },
      { id: '5', nombre: 'Campus Tecnológico', codigo: 'TECH001', esPrincipal: false }
    ]
  },
  {
    id: '3',
    nombre: 'Compañía Manufacturera XYZ',
    cuentasPO: [
      { id: '6', nombre: 'Cuenta Principal', codigo: 'XYZ001', esPrincipal: true }
    ]
  }
];

// Mock data de asignaciones para el listado
export const mockAsignaciones: AsignacionRuta[] = [
  {
    id: 1,
    ramal: 'R001',
    tipoRuta: 'privada',
    empresaCliente: 'Intel Corporation',
    empresaTransporte: 'Transportes Unidos S.A.',
    tipoUnidad: 'autobus',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'Belén',
    distrito: 'San Antonio',
    sector: 'Zona Franca',
    tarifaVigentePasajero: 850,
    tarifaVigenteServicio: 15000,
    fechaInicioVigencia: '2024-01-01',
    estado: 'activo',
    fechaCreacion: '2023-12-15T10:30:00Z',
    usuarioCreacion: 'admin',
    fechaModificacion: '2024-06-15T14:20:00Z',
    usuarioModificacion: 'admin'
  },
  {
    id: 2,
    ramal: 'R002',
    tipoRuta: 'especial',
    empresaCliente: 'Universidad Nacional',
    empresaTransporte: 'Buses Académicos S.A.',
    tipoUnidad: 'buseta',
    pais: 'Costa Rica',
    provincia: 'Heredia',
    canton: 'Heredia',
    distrito: 'Mercedes',
    sector: 'Campus Central',
    tarifaVigentePasajero: 500,
    tarifaVigenteServicio: 8000,
    fechaInicioVigencia: '2024-02-01',
    estado: 'activo',
    fechaCreacion: '2024-01-20T09:15:00Z',
    usuarioCreacion: 'supervisor',
    fechaModificacion: null,
    usuarioModificacion: null
  },
  {
    id: 3,
    ramal: 'R003',
    tipoRuta: 'parque',
    empresaCliente: '',
    empresaTransporte: 'Transportes Industriales S.A.',
    tipoUnidad: 'microbus',
    pais: 'Costa Rica',
    provincia: 'Cartago',
    canton: 'Cartago',
    distrito: 'Oriental',
    sector: 'Parque Industrial',
    tarifaVigentePasajero: 600,
    tarifaVigenteServicio: 0,
    fechaInicioVigencia: '2024-03-01',
    estado: 'inactivo',
    fechaCreacion: '2024-02-25T11:45:00Z',
    usuarioCreacion: 'operador',
    fechaModificacion: '2024-05-10T16:30:00Z',
    usuarioModificacion: 'supervisor'
  }
];

// Mock data para edición con tarifas detalladas
export const mockAsignacionesEdicion: Record<number, AsignacionEdicionData> = {
  1: {
    id: 1,
    ramal: '3', // ID del ramal en mockRamales
    ramalNombre: 'Zona Franca Intel',
    tipoRuta: 'privada',
    empresaCliente: '1', // ID de Intel
    empresaTransporte: 'Transportes Unidos S.A.',
    cuentaPO: '2', // Desarrollo R&D
    tipoUnidad: 'autobus',
    montoFee: 5.5,
    tarifasPasajeroExistentes: [
      {
        id: 'p1-1',
        monto: 850,
        fechaInicioVigencia: '2024-01-01',
        estado: 'activo',
        esExistente: true
      },
      {
        id: 'p1-2',
        monto: 800,
        fechaInicioVigencia: '2023-06-01',
        estado: 'inactivo',
        esExistente: true
      },
      {
        id: 'p1-3',
        monto: 750,
        fechaInicioVigencia: '2023-01-01',
        estado: 'inactivo',
        esExistente: true
      }
    ],
    tarifasServicioExistentes: [
      {
        id: 's1-1',
        monto: 15000,
        fechaInicioVigencia: '2024-01-01',
        estado: 'activo',
        esExistente: true
      },
      {
        id: 's1-2',
        monto: 14000,
        fechaInicioVigencia: '2023-06-01',
        estado: 'inactivo',
        esExistente: true
      }
    ]
  },
  2: {
    id: 2,
    ramal: '4', // ID del ramal Campus Tecnológico
    ramalNombre: 'Campus Tecnológico',
    tipoRuta: 'especial',
    empresaCliente: '2', // ID de Universidad Nacional
    empresaTransporte: 'Buses Académicos S.A.',
    cuentaPO: '5', // Campus Tecnológico
    tipoUnidad: 'buseta',
    montoFee: 3.0,
    tarifasPasajeroExistentes: [
      {
        id: 'p2-1',
        monto: 500,
        fechaInicioVigencia: '2024-02-01',
        estado: 'activo',
        esExistente: true
      },
      {
        id: 'p2-2',
        monto: 450,
        fechaInicioVigencia: '2023-08-01',
        estado: 'inactivo',
        esExistente: true
      }
    ],
    tarifasServicioExistentes: [
      {
        id: 's2-1',
        monto: 8000,
        fechaInicioVigencia: '2024-02-01',
        estado: 'activo',
        esExistente: true
      },
      {
        id: 's2-2',
        monto: 7500,
        fechaInicioVigencia: '2023-08-01',
        estado: 'inactivo',
        esExistente: true
      }
    ]
  },
  3: {
    id: 3,
    ramal: '5', // ID del ramal Parque Industrial
    ramalNombre: 'Parque Industrial',
    tipoRuta: 'parque',
    empresaCliente: undefined,
    empresaTransporte: 'Transportes Industriales S.A.',
    cuentaPO: undefined,
    tipoUnidad: 'microbus',
    montoFee: 2.5,
    tarifasPasajeroExistentes: [
      {
        id: 'p3-1',
        monto: 600,
        fechaInicioVigencia: '2024-03-01',
        estado: 'activo',
        esExistente: true
      },
      {
        id: 'p3-2',
        monto: 550,
        fechaInicioVigencia: '2023-10-01',
        estado: 'inactivo',
        esExistente: true
      }
    ],
    tarifasServicioExistentes: [] // Las rutas de parque no tienen tarifas de servicio
  }
};

// Función helper para obtener datos de edición
export const getAsignacionEdicionData = (id: number): AsignacionEdicionData | null => {
  return mockAsignacionesEdicion[id] || null;
};

// Función helper para obtener asignación del listado
export const getAsignacionListado = (id: number): AsignacionRuta | null => {
  return mockAsignaciones.find(a => a.id === id) || null;
};