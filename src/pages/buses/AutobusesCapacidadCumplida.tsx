import React, { useState } from 'react';
import { Calendar, Search, Filter, Download } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTransportistas } from '@/data/mockTransportistas';
import { mockEmpresas } from '@/data/mockEmpresas';

interface AutobusCapacidadCumplida {
  id: string;
  empresaTransporte: string;
  idAutobus: string;
  placa: string;
  capacidad: number;
  fechaHora: string;
  ruta: string;
  conductor: string;
}

// Mock data para autobuses con capacidad cumplida
const mockAutobusesCapacidadCumplida: AutobusCapacidadCumplida[] = [
  {
    id: '1',
    empresaTransporte: 'Transportes San José S.A.',
    idAutobus: 'TSJ-001',
    placa: 'SJO-1234',
    capacidad: 45,
    fechaHora: '2024-01-15 08:30',
    ruta: 'Ruta Central',
    conductor: 'Carlos Méndez'
  },
  {
    id: '2',
    empresaTransporte: 'Autobuses del Valle',
    idAutobus: 'ADV-002',
    placa: 'VAL-5678',
    capacidad: 50,
    fechaHora: '2024-01-15 09:15',
    ruta: 'Ruta Norte',
    conductor: 'María González'
  },
  {
    id: '3',
    empresaTransporte: 'Empresa de Transporte Central',
    idAutobus: 'ETC-003',
    placa: 'CEN-9012',
    capacidad: 40,
    fechaHora: '2024-01-15 10:00',
    ruta: 'Ruta Sur',
    conductor: 'José Rodríguez'
  },
  {
    id: '4',
    empresaTransporte: 'Transportes Unidos',
    idAutobus: 'TU-004',
    placa: 'UNI-3456',
    capacidad: 48,
    fechaHora: '2024-01-15 11:30',
    ruta: 'Ruta Este',
    conductor: 'Ana Jiménez'
  },
  {
    id: '5',
    empresaTransporte: 'Buses Express Costa Rica',
    idAutobus: 'BECR-005',
    placa: 'EXP-7890',
    capacidad: 52,
    fechaHora: '2024-01-15 12:45',
    ruta: 'Ruta Oeste',
    conductor: 'Luis Vargas'
  }
];

interface Filtros {
  empresaTransporte: string;
  idAutobus: string;
  placa: string;
  fechaHora: string;
  ruta: string;
  conductor: string;
}

export default function AutobusesCapacidadCumplida() {
  const [filtros, setFiltros] = useState<Filtros>({
    empresaTransporte: '',
    idAutobus: '',
    placa: '',
    fechaHora: '',
    ruta: '',
    conductor: ''
  });

  const [autobusesFiltrados, setAutobusesFiltrados] = useState(mockAutobusesCapacidadCumplida);

  const aplicarFiltros = () => {
    const resultado = mockAutobusesCapacidadCumplida.filter(autobus => {
      return (
        (filtros.empresaTransporte === '' || autobus.empresaTransporte.toLowerCase().includes(filtros.empresaTransporte.toLowerCase())) &&
        (filtros.idAutobus === '' || autobus.idAutobus.toLowerCase().includes(filtros.idAutobus.toLowerCase())) &&
        (filtros.placa === '' || autobus.placa.toLowerCase().includes(filtros.placa.toLowerCase())) &&
        (filtros.fechaHora === '' || autobus.fechaHora.includes(filtros.fechaHora)) &&
        (filtros.ruta === '' || autobus.ruta.toLowerCase().includes(filtros.ruta.toLowerCase())) &&
        (filtros.conductor === '' || autobus.conductor.toLowerCase().includes(filtros.conductor.toLowerCase()))
      );
    });
    setAutobusesFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltros({
      empresaTransporte: '',
      idAutobus: '',
      placa: '',
      fechaHora: '',
      ruta: '',
      conductor: ''
    });
    setAutobusesFiltrados(mockAutobusesCapacidadCumplida);
  };

  const exportarDatos = () => {
    // Funcionalidad de exportación
    console.log('Exportando datos de autobuses con capacidad cumplida...');
  };

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Autobuses con Capacidad Cumplida</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={exportarDatos} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Empresa de Transporte</label>
                <Select 
                  value={filtros.empresaTransporte} 
                  onValueChange={(value) => setFiltros({...filtros, empresaTransporte: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las empresas</SelectItem>
                    {mockTransportistas.map((transportista) => (
                      <SelectItem key={transportista.id} value={transportista.nombre}>
                        {transportista.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ID del Autobús</label>
                <Input
                  placeholder="Buscar por ID"
                  value={filtros.idAutobus}
                  onChange={(e) => setFiltros({...filtros, idAutobus: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Placa</label>
                <Input
                  placeholder="Buscar por placa"
                  value={filtros.placa}
                  onChange={(e) => setFiltros({...filtros, placa: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha y Hora</label>
                <Input
                  type="datetime-local"
                  value={filtros.fechaHora}
                  onChange={(e) => setFiltros({...filtros, fechaHora: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ruta</label>
                <Input
                  placeholder="Buscar por ruta"
                  value={filtros.ruta}
                  onChange={(e) => setFiltros({...filtros, ruta: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Conductor</label>
                <Input
                  placeholder="Buscar por conductor"
                  value={filtros.conductor}
                  onChange={(e) => setFiltros({...filtros, conductor: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={aplicarFiltros}>
                <Search className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de resultados */}
        <Card>
          <CardHeader>
            <CardTitle>
              Resultados ({autobusesFiltrados.length} autobuses encontrados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa de Transporte</TableHead>
                    <TableHead>ID del Autobús</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Conductor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autobusesFiltrados.map((autobus) => (
                    <TableRow key={autobus.id}>
                      <TableCell className="font-medium">{autobus.empresaTransporte}</TableCell>
                      <TableCell>{autobus.idAutobus}</TableCell>
                      <TableCell>{autobus.placa}</TableCell>
                      <TableCell>{autobus.capacidad} pasajeros</TableCell>
                      <TableCell>{autobus.fechaHora}</TableCell>
                      <TableCell>{autobus.ruta}</TableCell>
                      <TableCell>{autobus.conductor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}