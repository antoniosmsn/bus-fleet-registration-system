
import React, { useState } from 'react';
import { Building2, Truck, Factory, TrendingUp, Users, MapPin, Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const chartData = [
  { name: 'Ene', value: 42 },
  { name: 'Feb', value: 28 },
  { name: 'Mar', value: 43 },
  { name: 'Abr', value: 34 },
  { name: 'May', value: 20 },
  { name: 'Jun', value: 25 },
  { name: 'Jul', value: 22 }
];

const overviewData = [
  { name: 'Lun', nuevos: 24, activos: 18 },
  { name: 'Mar', nuevos: 13, activos: 22 },
  { name: 'Mié', nuevos: 28, activos: 19 },
  { name: 'Jue', nuevos: 39, activos: 32 },
  { name: 'Vie', nuevos: 31, activos: 28 },
  { name: 'Sáb', nuevos: 22, activos: 15 },
  { name: 'Dom', nuevos: 18, activos: 12 }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('zona-franca');
  const navigate = useNavigate();

  const getTabContent = (tab: string) => {
    switch (tab) {
      case 'zona-franca':
        return {
          cards: [
            { title: 'Zonas Activas', value: '21', subtitle: 'Operando', color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Empresas', value: '147', subtitle: 'Registradas', color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Servicios', value: '24', subtitle: 'Disponibles', color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { title: 'Rutas', value: '38', subtitle: 'Configuradas', color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ]
        };
      case 'transportistas':
        return {
          cards: [
            { title: 'Transportistas', value: '15', subtitle: 'Activos', color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Autobuses', value: '89', subtitle: 'En Flota', color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Conductores', value: '142', subtitle: 'Certificados', color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { title: 'Asignaciones', value: '67', subtitle: 'Completadas', color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Solicitudes Pendientes', value: '7', subtitle: 'Cambios de Ruta', color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ]
        };
      case 'empresas':
        return {
          cards: [
            { title: 'Empresas', value: '28', subtitle: 'Registradas', color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Empleados', value: '1,247', subtitle: 'Activos', color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { title: 'Solicitudes', value: '43', subtitle: 'Pendientes', color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { title: 'Traslados', value: '156', subtitle: 'Este Mes', color: 'text-green-600', bgColor: 'bg-green-50' }
          ]
        };
      default:
        return { cards: [] };
    }
  };

  const currentContent = getTabContent(activeTab);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">Monitoreo y gestión del sistema de transporte</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="zona-franca" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Zona Franca
            </TabsTrigger>
            <TabsTrigger value="transportistas" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transportistas
            </TabsTrigger>
            <TabsTrigger value="empresas" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresas
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentContent.cards.map((card, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-shadow ${
                    activeTab === 'transportistas' && index === 4 
                      ? 'cursor-pointer hover:scale-105 transform' 
                      : ''
                  }`}
                  onClick={() => {
                    if (activeTab === 'transportistas' && index === 4) {
                      navigate('/servicios/solicitudes-aprobacion');
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                        <div className="flex items-baseline gap-2">
                          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
                      </div>
                      <div className={`p-3 rounded-full ${card.bgColor}`}>
                        {activeTab === 'zona-franca' && index === 0 && <TrendingUp className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'zona-franca' && index === 1 && <Users className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'zona-franca' && index === 2 && <Factory className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'zona-franca' && index === 3 && <Building2 className={`h-6 w-6 ${card.color}`} />}
                        
                        {activeTab === 'transportistas' && index === 0 && <TrendingUp className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'transportistas' && index === 1 && <Truck className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'transportistas' && index === 2 && <Users className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'transportistas' && index === 3 && <Building2 className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'transportistas' && index === 4 && <AlertTriangle className={`h-6 w-6 ${card.color}`} />}
                        
                        {activeTab === 'empresas' && index === 0 && <Building2 className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'empresas' && index === 1 && <Users className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'empresas' && index === 2 && <Factory className={`h-6 w-6 ${card.color}`} />}
                        {activeTab === 'empresas' && index === 3 && <TrendingUp className={`h-6 w-6 ${card.color}`} />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia Semanal</CardTitle>
                  <p className="text-sm text-muted-foreground">Actividad de los últimos 7 días</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Resumen de Actividad</CardTitle>
                    <p className="text-sm text-muted-foreground">Comparativa semanal</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Nuevos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Activos</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="nuevos" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activos" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
