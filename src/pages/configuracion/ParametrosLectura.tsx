import React, { useState } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save, FileText, Database, Search } from 'lucide-react';

interface Bus {
  id: number;
  placa: string;
}

const ParametrosLectura = () => {
  const [autobusSeleccionado, setAutobusSeleccionado] = useState<Bus | null>(null);
  const [modalAbierto, setModalAbierto] = useState(true); // Se abre automáticamente al cargar
  const [busquedaAutobus, setBusquedaAutobus] = useState('');
  const [autobusSelecionadoModal, setAutobusSelecionadoModal] = useState<string>('');

  const [idioma, setIdioma] = useState('Español');
  const [temaVisual, setTemaVisual] = useState('Oscuro');
  const [urlApi, setUrlApi] = useState('https://dfs-web.primeraplus.com');
  const [urlServicioMqtt, setUrlServicioMqtt] = useState('ssl://dfs-web.primeraplus.com');
  const [puertoApi, setPuertoApi] = useState('31000');
  const [puertoServicioMqtt, setPuertoServicioMqtt] = useState('32505');
  const [nombreRedWifi, setNombreRedWifi] = useState('Eticketing');
  const [contrasenaRedWifi, setContrasenaRedWifi] = useState('●●●●●●●●●●●●●●●');
  const [volumen, setVolumen] = useState('80');
  const [usuarioMqtt, setUsuarioMqtt] = useState('opto');
  const [contrasenaMqtt, setContrasenaMqtt] = useState('●●●●●●●');
  const [usoConexionSegura, setUsoConexionSegura] = useState(true);
  const [nivelDetalle, setNivelDetalle] = useState('OPTO');

  const handleGuardarConfiguracion = () => {
    console.log('Guardando configuración de parámetros de lectura:', {
      idioma,
      temaVisual,
      urlApi,
      urlServicioMqtt,
      puertoApi,
      puertoServicioMqtt,
      nombreRedWifi,
      contrasenaRedWifi,
      volumen,
      usuarioMqtt,
      contrasenaMqtt,
      usoConexionSegura,
      nivelDetalle
    });
    
    toast.success('Configuración guardada correctamente');
  };

  const handleMostrarParametrosBaseDatos = () => {
    toast.info('Función de parámetros de base de datos no implementada aún');
  };

  const handleLeerParametrosLectora = () => {
    toast.info('Función de lectura de parámetros no implementada aún');
  };

  const abrirModalSeleccion = () => {
    setModalAbierto(true);
    setAutobusSelecionadoModal('');
    setBusquedaAutobus('');
  };

  const seleccionarAutobus = () => {
    const bus = autobuses.find(b => b.id.toString() === autobusSelecionadoModal);
    if (bus) {
      setAutobusSeleccionado(bus);
      // Simular carga de parámetros específicos del autobús
      console.log(`Cargando parámetros para el autobús ${bus.id}-${bus.placa}`);
      setModalAbierto(false);
      toast.success(`Autobús ${bus.id}-${bus.placa} seleccionado correctamente`);
    }
  };

  const cancelarSeleccion = () => {
    setModalAbierto(false);
    if (!autobusSeleccionado) {
      // Si no hay autobús seleccionado y cancela, mantener el modal cerrado pero sin datos
      toast.info('Debe seleccionar un autobús para configurar los parámetros');
    }
  };

  // Datos de autobuses simulados
  const autobuses: Bus[] = [
    { id: 1, placa: 'SJB2569' },
    { id: 234, placa: 'LB2568' },
    { id: 156, placa: 'ABC1234' },
    { id: 78, placa: 'XYZ9876' },
    { id: 345, placa: 'DEF5678' },
    { id: 567, placa: 'MNO4321' },
    { id: 789, placa: 'PQR8765' }
  ];

  // Filtrar autobuses según la búsqueda
  const autobusesFiltrados = autobuses.filter(bus => 
    bus.id.toString().includes(busquedaAutobus) || 
    bus.placa.toLowerCase().includes(busquedaAutobus.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto">
         <Card className="mb-6">
           <CardHeader>
              <CardTitle>              
          <h1 className="text-2xl font-bold mb-2">Parámetros de Lectora</h1>          
               </CardTitle>
            </CardHeader>
        </Card>

        {autobusSeleccionado && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle> 
                 <div className="flex items-center gap-4">               
                 <Button variant="outline" onClick={abrirModalSeleccion}>
                  Seleccionar autobús
                </Button>
                {autobusSeleccionado 
                    ? `Autobús seleccionado: ${autobusSeleccionado.id}-${autobusSeleccionado.placa}`
                    : 'Ningún autobús seleccionado'
                  }
              </div>
               </CardTitle>
            </CardHeader>
             
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idioma" className="required-field">Idioma</Label>
                    <Select value={idioma} onValueChange={setIdioma}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Español">Español</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Français">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="urlApi" className="required-field">URL del API</Label>
                    <Input 
                      id="urlApi" 
                      value={urlApi} 
                      onChange={(e) => setUrlApi(e.target.value)}
                      placeholder="https://ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="puertoApi" className="required-field">Puerto del API</Label>
                    <Input 
                      id="puertoApi" 
                      value={puertoApi} 
                      onChange={(e) => setPuertoApi(e.target.value)}
                      placeholder="31000"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombreRedWifi" className="required-field">Nombre de red WiFi (SSID)</Label>
                    <Input 
                      id="nombreRedWifi" 
                      value={nombreRedWifi} 
                      onChange={(e) => setNombreRedWifi(e.target.value)}
                      placeholder="Nombre de la red"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volumen" className="required-field">Volumen</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="volumen" 
                          value={volumen} 
                          onChange={(e) => setVolumen(e.target.value)}
                          placeholder="80"
                          type="number"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="usuarioMqtt" className="required-field">Usuario MQTT</Label>
                      <Input 
                        id="usuarioMqtt" 
                        value={usuarioMqtt} 
                        onChange={(e) => setUsuarioMqtt(e.target.value)}
                        placeholder="usuario"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 py-3">
                    <Switch 
                      id="usoConexionSegura" 
                      checked={usoConexionSegura} 
                      onCheckedChange={setUsoConexionSegura}
                    />
                    <Label htmlFor="usoConexionSegura" className="required-field">
                      Uso de conexión segura MQTT (SSL)
                    </Label>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temaVisual" className="required-field">Tema visual</Label>
                    <Select value={temaVisual} onValueChange={setTemaVisual}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oscuro">Oscuro</SelectItem>
                        <SelectItem value="Claro">Claro</SelectItem>
                        <SelectItem value="Auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlServicioMqtt" className="required-field">URL del servicio MQTT</Label>
                    <Input 
                      id="urlServicioMqtt" 
                      value={urlServicioMqtt} 
                      onChange={(e) => setUrlServicioMqtt(e.target.value)}
                      placeholder="ssl://ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="puertoServicioMqtt" className="required-field">Puerto del servicio MQTT</Label>
                    <Input 
                      id="puertoServicioMqtt" 
                      value={puertoServicioMqtt} 
                      onChange={(e) => setPuertoServicioMqtt(e.target.value)}
                      placeholder="32505"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrasenaRedWifi" className="required-field">Contraseña de red WiFi</Label>
                    <Input 
                      id="contrasenaRedWifi" 
                      value={contrasenaRedWifi} 
                      onChange={(e) => setContrasenaRedWifi(e.target.value)}
                      placeholder="●●●●●●●●●●●●●●●"
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrasenaMqtt" className="required-field">Contraseña MQTT</Label>
                    <Input 
                      id="contrasenaMqtt" 
                      value={contrasenaMqtt} 
                      onChange={(e) => setContrasenaMqtt(e.target.value)}
                      placeholder="●●●●●●●"
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nivelDetalle" className="required-field">Nivel de detalle de logs (verbose)</Label>
                    <Select value={nivelDetalle} onValueChange={setNivelDetalle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPTO">OPTO</SelectItem>
                        <SelectItem value="DEBUG">DEBUG</SelectItem>
                        <SelectItem value="INFO">INFO</SelectItem>
                        <SelectItem value="WARN">WARN</SelectItem>
                        <SelectItem value="ERROR">ERROR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex  gap-3 mt-8 pt-6 border-t">
                <Button variant="outline" onClick={handleMostrarParametrosBaseDatos}>
                  <Database className="mr-2 h-4 w-4" />
                   Mostrar parámetros base de datos
                </Button>
                
                <Button variant="outline" onClick={handleLeerParametrosLectora}>
                  <FileText className="mr-2 h-4 w-4" />
                  Leer parámetros de la lectora
                </Button>
                
                <Button onClick={handleGuardarConfiguracion}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar parámetros en base de datos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de selección de autobús */}
        <Dialog open={modalAbierto} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Seleccionar Autobús</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Campo de búsqueda */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID o placa..."
                  value={busquedaAutobus}
                  onChange={(e) => setBusquedaAutobus(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              {/* Lista de autobuses con radio buttons */}
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                <RadioGroup 
                  value={autobusSelecionadoModal} 
                  onValueChange={setAutobusSelecionadoModal}
                  className="space-y-2"
                >
                  {autobusesFiltrados.map((bus) => (
                    <div key={bus.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <RadioGroupItem value={bus.id.toString()} id={`bus-${bus.id}`} />
                      <Label htmlFor={`bus-${bus.id}`} className="cursor-pointer flex-1">
                        {bus.id}-{bus.placa}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Mensaje cuando no hay resultados */}
              {autobusesFiltrados.length === 0 && (
                <p className="text-gray-500 text-center py-4">No se encontraron autobuses</p>
              )}
              
              {/* Botones de acción del modal */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={cancelarSeleccion}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={seleccionarAutobus}
                  disabled={!autobusSelecionadoModal}
                  className="flex-1"
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ParametrosLectura;
