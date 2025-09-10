import { HistorialArchivoSinpe, DetalleConciliacionSinpe } from '@/types/recarga-sinpe';

export const mockHistorialSinpe: HistorialArchivoSinpe[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15T10:30:00'),
    usuario: 'Juan Pérez',
    nombreArchivo: 'sinpe_enero_2024.csv',
    estadoConciliacion: 'Éxito',
    totalRegistros: 150,
    registrosConciliados: 150,
    registrosNoConciliados: 0,
    montoTotal: 750000,
    montoConciliado: 750000
  },
  {
    id: '2',
    fecha: new Date('2024-01-14T14:15:00'),
    usuario: 'María González',
    nombreArchivo: 'recargas_pasajeros_14012024.xlsx',
    estadoConciliacion: 'Parcial',
    totalRegistros: 200,
    registrosConciliados: 185,
    registrosNoConciliados: 15,
    montoTotal: 925000,
    montoConciliado: 850000
  },
  {
    id: '3',
    fecha: new Date('2024-01-13T09:45:00'),
    usuario: 'Carlos Rodríguez',
    nombreArchivo: 'sinpe_weekend_jan.csv',
    estadoConciliacion: 'Con errores',
    totalRegistros: 75,
    registrosConciliados: 50,
    registrosNoConciliados: 25,
    montoTotal: 375000,
    montoConciliado: 250000
  }
];

export const mockDetalleConciliacion: { [archivoId: string]: DetalleConciliacionSinpe[] } = {
  '1': [
    {
      id: '1-1',
      archivoId: '1',
      cedula: '118520147',
      nombre: 'Ana María Castillo Vega',
      monto: 5000,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-15T10:00:00'),
      referencia: 'SINPE001',
      linea: 1
    },
    {
      id: '1-2',
      archivoId: '1',
      cedula: '203450789',
      nombre: 'Carlos Alberto Méndez Soto',
      monto: 10000,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-15T10:05:00'),
      referencia: 'SINPE002',
      linea: 2
    },
    {
      id: '1-3',
      archivoId: '1',
      cedula: '305670123',
      nombre: 'Laura Patricia Jiménez Cruz',
      monto: 7500,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-15T10:10:00'),
      referencia: 'SINPE003',
      linea: 3
    }
  ],
  '2': [
    {
      id: '2-1',
      archivoId: '2',
      cedula: '118520147',
      nombre: 'Ana María Castillo Vega',
      monto: 3000,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-14T14:00:00'),
      referencia: 'SINPE004',
      linea: 1
    },
    {
      id: '2-2',
      archivoId: '2',
      cedula: '401230567',
      nombre: 'Roberto González Alvarado',
      monto: 8000,
      conciliado: false,
      fechaMovimiento: new Date('2024-01-14T14:05:00'),
      referencia: 'SINPE005',
      linea: 2
    },
    {
      id: '2-3',
      archivoId: '2',
      cedula: '507890234',
      nombre: 'Sofía Elena Vargas Mora',
      monto: 6000,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-14T14:10:00'),
      referencia: 'SINPE006',
      linea: 3
    }
  ],
  '3': [
    {
      id: '3-1',
      archivoId: '3',
      cedula: '609120345',
      nombre: 'Miguel Ángel Torres Ruiz',
      monto: 4000,
      conciliado: true,
      fechaMovimiento: new Date('2024-01-13T09:30:00'),
      referencia: 'SINPE007',
      linea: 1
    },
    {
      id: '3-2',
      archivoId: '3',
      cedula: '701450678',
      nombre: 'Patricia Isabel Ramírez León',
      monto: 5500,
      conciliado: false,
      fechaMovimiento: new Date('2024-01-13T09:35:00'),
      referencia: 'SINPE008',
      linea: 2
    }
  ]
};

export const mockUsuarios = [
  'Juan Pérez',
  'María González', 
  'Carlos Rodríguez',
  'Ana Sofía López',
  'Roberto Martínez'
];