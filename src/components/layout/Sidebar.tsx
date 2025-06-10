
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, FileText, Bus, Users, Map, MapPin, Route, Monitor, Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarComponent = () => {
  const location = useLocation();
  
  // Configuration menu items
  const configItems = [
    { 
      title: "Parámetros por Zona Franca", 
      url: "/configuracion/parametros", 
      icon: Settings 
    },
    { 
      title: "Parámetros de Lectura", 
      url: "/configuracion/parametros-lectura", 
      icon: Monitor 
    },
    { 
      title: "Programación de Parámetros", 
      url: "/configuracion/programacion-parametros", 
      icon: Settings 
    },
    { 
      title: "Perfiles y Permisos", 
      url: "/perfiles", 
      icon: FileText 
    },
    { 
      title: "Geocercas", 
      url: "/geocercas", 
      icon: MapPin 
    },
  ];

  // Registration menu items
  const registrationItems = [
    { 
      title: "Empresas Administradoras", 
      url: "/companies", 
      icon: FileText 
    },
    { 
      title: "Zonas Francas", 
      url: "/zones", 
      icon: FileText 
    },
    { 
      title: "Empresas Cliente", 
      url: "/clients", 
      icon: FileText 
    },
    { 
      title: "Empresas Transportistas", 
      url: "/transport", 
      icon: FileText 
    },
    { 
      title: "Conductores", 
      url: "/conductores", 
      icon: Users 
    },
    { 
      title: "Autobuses", 
      url: "/buses", 
      icon: Bus 
    },
    { 
      title: "Rutas", 
      url: "/rutas", 
      icon: Route 
    },
    { 
      title: "Puntos de Parada", 
      url: "/paradas", 
      icon: Map 
    },
    { 
      title: "Asignaciones de Rutas", 
      url: "/asignaciones", 
      icon: Calendar 
    },
    { 
      title: "Usuarios Administradores", 
      url: "/users", 
      icon: Users 
    },
  ];

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center">
          <Bus className="h-6 w-6 text-transport-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">SistemaTransporte</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Settings className="mr-2" />
            Configuración
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <FileText className="mr-2" />
            Registro
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {registrationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarComponent;
