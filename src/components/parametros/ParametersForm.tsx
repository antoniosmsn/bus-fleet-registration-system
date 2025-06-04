
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Database, Eye, EyeOff } from 'lucide-react';

interface ParametersFormProps {
  idioma: string;
  setIdioma: (value: string) => void;
  temaVisual: string;
  setTemaVisual: (value: string) => void;
  urlApi: string;
  setUrlApi: (value: string) => void;
  urlServicioMqtt: string;
  setUrlServicioMqtt: (value: string) => void;
  puertoApi: string;
  setPuertoApi: (value: string) => void;
  puertoServicioMqtt: string;
  setPuertoServicioMqtt: (value: string) => void;
  nombreRedWifi: string;
  setNombreRedWifi: (value: string) => void;
  contrasenaRedWifi: string;
  setContrasenaRedWifi: (value: string) => void;
  volumen: string;
  setVolumen: (value: string) => void;
  usuarioMqtt: string;
  setUsuarioMqtt: (value: string) => void;
  contrasenaMqtt: string;
  setContrasenaMqtt: (value: string) => void;
  usoConexionSegura: boolean;
  setUsoConexionSegura: (value: boolean) => void;
  nivelDetalle: string;
  setNivelDetalle: (value: string) => void;
  mostrarContrasenaWifi: boolean;
  setMostrarContrasenaWifi: (value: boolean) => void;
  mostrarContrasenaMqtt: boolean;
  setMostrarContrasenaMqtt: (value: boolean) => void;
  onGuardarConfiguracion: () => void;
  onMostrarParametrosBaseDatos: () => void;
}

const ParametersForm: React.FC<ParametersFormProps> = ({
  idioma,
  setIdioma,
  temaVisual,
  setTemaVisual,
  urlApi,
  setUrlApi,
  urlServicioMqtt,
  setUrlServicioMqtt,
  puertoApi,
  setPuertoApi,
  puertoServicioMqtt,
  setPuertoServicioMqtt,
  nombreRedWifi,
  setNombreRedWifi,
  contrasenaRedWifi,
  setContrasenaRedWifi,
  volumen,
  setVolumen,
  usuarioMqtt,
  setUsuarioMqtt,
  contrasenaMqtt,
  setContrasenaMqtt,
  usoConexionSegura,
  setUsoConexionSegura,
  nivelDetalle,
  setNivelDetalle,
  mostrarContrasenaWifi,
  setMostrarContrasenaWifi,
  mostrarContrasenaMqtt,
  setMostrarContrasenaMqtt,
  onGuardarConfiguracion,
  onMostrarParametrosBaseDatos
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primera columna */}
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
          </div>

          {/* Segunda columna */}
          <div className="space-y-4">
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
              <Label htmlFor="nombreRedWifi" className="required-field">Nombre de red WiFi (SSID)</Label>
              <Input 
                id="nombreRedWifi" 
                value={nombreRedWifi} 
                onChange={(e) => setNombreRedWifi(e.target.value)}
                placeholder="Nombre de la red"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasenaRedWifi" className="required-field">Contraseña de red WiFi</Label>
              <div className="relative">
                <Input 
                  id="contrasenaRedWifi" 
                  value={contrasenaRedWifi} 
                  onChange={(e) => setContrasenaRedWifi(e.target.value)}
                  placeholder="●●●●●●●●●●●●●●●"
                  type={mostrarContrasenaWifi ? "text" : "password"}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setMostrarContrasenaWifi(!mostrarContrasenaWifi)}
                >
                  {mostrarContrasenaWifi ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tercera columna */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuarioMqtt" className="required-field">Usuario MQTT</Label>
              <Input 
                id="usuarioMqtt" 
                value={usuarioMqtt} 
                onChange={(e) => setUsuarioMqtt(e.target.value)}
                placeholder="usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasenaMqtt" className="required-field">Contraseña MQTT</Label>
              <div className="relative">
                <Input 
                  id="contrasenaMqtt" 
                  value={contrasenaMqtt} 
                  onChange={(e) => setContrasenaMqtt(e.target.value)}
                  placeholder="●●●●●●●"
                  type={mostrarContrasenaMqtt ? "text" : "password"}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setMostrarContrasenaMqtt(!mostrarContrasenaMqtt)}
                >
                  {mostrarContrasenaMqtt ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

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
              <Label htmlFor="nivelDetalle" className="required-field">Nivel de detalle de logs (verbose)</Label>
              <Select value={nivelDetalle} onValueChange={setNivelDetalle}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                  <SelectItem value="OPTO">OPTO</SelectItem>
                  <SelectItem value="BÁSICO">BÁSICO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Switch para conexión segura - span completo */}
        <div className="flex items-center space-x-3 py-6 mt-4 border-t">
          <Switch 
            id="usoConexionSegura" 
            checked={usoConexionSegura} 
            onCheckedChange={setUsoConexionSegura}
          />
          <Label htmlFor="usoConexionSegura" className="required-field">
            Uso de conexión segura MQTT (SSL)
          </Label>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onMostrarParametrosBaseDatos}>
            <Database className="mr-2 h-4 w-4" />
            Mostrar parámetros base de datos
          </Button>
          
          <Button onClick={onGuardarConfiguracion}>
            <Save className="mr-2 h-4 w-4" />
            Guardar parámetros en base de datos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametersForm;
