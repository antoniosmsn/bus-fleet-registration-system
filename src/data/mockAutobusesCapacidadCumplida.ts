import { AutobusCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";

export const mockAutobusesCapacidadCumplida: AutobusCapacidadCumplida[] = [
  {
    id: '1',
    empresaTransporte: 'Transportes San José S.A.',
    idAutobus: 'TSJ-001',
    placa: 'TSJ-1234',
    capacidad: 45,
    fechaHoraCumplimiento: '2024-08-07T08:30:00',
    rutaAsignada: 'San José - Cartago',
    conductorAsignado: 'Carlos Rodríguez'
  },
  {
    id: '2',
    empresaTransporte: 'Transportes San José S.A.',
    idAutobus: 'TSJ-002',
    placa: 'TSJ-5678',
    capacidad: 40,
    fechaHoraCumplimiento: '2024-08-07T09:15:00',
    rutaAsignada: 'San José - Alajuela',
    conductorAsignado: 'María González'
  },
  {
    id: '3',
    empresaTransporte: 'Autobuses del Valle',
    idAutobus: 'ADV-001',
    placa: 'ADV-9876',
    capacidad: 50,
    fechaHoraCumplimiento: '2024-08-07T07:45:00',
    rutaAsignada: 'Heredia - San José',
    conductorAsignado: 'José Pérez'
  },
  {
    id: '4',
    empresaTransporte: 'Autobuses del Valle',
    idAutobus: 'ADV-003',
    placa: 'ADV-3456',
    capacidad: 45,
    fechaHoraCumplimiento: '2024-08-07T10:20:00',
    rutaAsignada: 'Cartago - San José',
    conductorAsignado: 'Ana Jiménez'
  },
  {
    id: '5',
    empresaTransporte: 'Empresa de Transporte Central',
    idAutobus: 'ETC-001',
    placa: 'ETC-7890',
    capacidad: 48,
    fechaHoraCumplimiento: '2024-08-07T11:00:00',
    rutaAsignada: 'Puntarenas - San José',
    conductorAsignado: 'Luis Vargas'
  },
  {
    id: '6',
    empresaTransporte: 'Transportes Unidos',
    idAutobus: 'TU-002',
    placa: 'TU-2468',
    capacidad: 42,
    fechaHoraCumplimiento: '2024-08-06T16:30:00',
    rutaAsignada: 'Limón - San José',
    conductorAsignado: 'Patricia Mora'
  },
  {
    id: '7',
    empresaTransporte: 'Transportes Unidos',
    idAutobus: 'TU-004',
    placa: 'TU-1357',
    capacidad: 44,
    fechaHoraCumplimiento: '2024-08-06T14:15:00',
    rutaAsignada: 'Guanacaste - San José',
    conductorAsignado: 'Roberto Sánchez'
  },
  {
    id: '8',
    empresaTransporte: 'Buses Express Costa Rica',
    idAutobus: 'BECR-001',
    placa: 'BECR-9999',
    capacidad: 55,
    fechaHoraCumplimiento: '2024-08-06T12:45:00',
    rutaAsignada: 'San José - Pérez Zeledón',
    conductorAsignado: 'Elena Castro'
  }
];