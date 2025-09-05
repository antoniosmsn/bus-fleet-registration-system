import { Link } from 'react-router-dom';
import { Settings, Monitor, Calendar, Tags, BookOpen, FileText, MapPin, AlertTriangle } from 'lucide-react';
import { ConfiguracionLayout } from '@/components/configuracion/ConfiguracionLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConfiguracionIndex = () => {
  const configOptions = [
    {
      title: 'Parámetros por Zona Franca',
      description: 'Configuración de parámetros específicos por zona franca',
      icon: Settings,
      url: '/configuracion/parametros',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Parámetros de Lectura',
      description: 'Configuración de dispositivos de lectura y telemetría',
      icon: Monitor,
      url: '/configuracion/parametros-lectura',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Programación de Parámetros',
      description: 'Programación y configuración de parámetros del sistema',
      icon: Calendar,
      url: '/programacion/parametros',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Categorías de Mantenimiento',
      description: 'Gestión de categorías para mantenimiento de vehículos',
      icon: Tags,
      url: '/configuracion/categorias-mantenimiento',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Catálogos de Alertas de Pasajeros',
      description: 'Gestión de tipos de alerta y motivos para pasajeros',
      icon: BookOpen,
      url: '/catalogos/alertas-pasajeros',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Catálogo de Alertas de Autobuses',
      description: 'Gestión de tipos de alerta para eventos relacionados con autobuses',
      icon: AlertTriangle,
      url: '/catalogos/alertas-autobuses',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Perfiles y Permisos',
      description: 'Gestión de perfiles de usuario y asignación de permisos',
      icon: FileText,
      url: '/perfiles',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Geocercas',
      description: 'Configuración y gestión de geocercas del sistema',
      icon: MapPin,
      url: '/geocercas',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <ConfiguracionLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Configuración</h1>
            <p className="text-muted-foreground">Selecciona una opción del menú lateral o haz clic en las tarjetas para acceder a las diferentes configuraciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configOptions.map((option, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
            >
              <Link to={option.url}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${option.bgColor} group-hover:scale-110 transition-transform`}>
                      <option.icon className={`h-6 w-6 ${option.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </ConfiguracionLayout>
  );
};

export default ConfiguracionIndex;