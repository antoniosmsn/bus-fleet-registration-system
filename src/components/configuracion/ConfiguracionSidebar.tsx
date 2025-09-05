import { NavLink, useLocation } from "react-router-dom";
import { Settings, Monitor, Calendar, Tags, BookOpen, FileText, MapPin, AlertTriangle, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const configMenuItems = [
  {
    title: "Parámetros por Zona Franca",
    url: "/configuracion/parametros",
    icon: Settings,
  },
  {
    title: "Parámetros de Lectura", 
    url: "/configuracion/parametros-lectura",
    icon: Monitor,
  },
  {
    title: "Programación de Parámetros",
    url: "/programacion/parametros", 
    icon: Calendar,
  },
  {
    title: "Categorías de Mantenimiento",
    url: "/configuracion/categorias-mantenimiento",
    icon: Tags,
  }
];

const catalogMenuItems = [
  {
    title: "Alertas de Pasajeros",
    url: "/catalogos/alertas-pasajeros",
    icon: BookOpen,
  },
  {
    title: "Alertas de Autobuses", 
    url: "/catalogos/alertas-autobuses",
    icon: AlertTriangle,
  },
];

const systemMenuItems = [
  {
    title: "Perfiles y Permisos",
    url: "/perfiles",
    icon: FileText,
  },
  {
    title: "Geocercas",
    url: "/geocercas", 
    icon: MapPin,
  }
];

export function ConfiguracionSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Enlace al inicio */}
        <SidebarGroup className="border-b">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span>Volver al Inicio</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuración del Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Catálogos */}
        <SidebarGroup>
          <SidebarGroupLabel>Catálogos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {catalogMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}