
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusesIndex from "./pages/buses/Index";
import RegisterBus from "./pages/buses/Register";
import EditBus from "./pages/buses/Edit";
import ZoneParametersConfig from "./pages/configuracion/parametros";
import PerfilesIndex from "./pages/perfiles/Index";
import RegisterPerfil from "./pages/perfiles/Register";
import PerfilPermisos from "./pages/perfiles/Permisos";
import ConductoresIndex from "./pages/conductores/Index";
import RegisterConductor from "./pages/conductores/Register";
import EditConductor from "./pages/conductores/Edit";
import GeocercasIndex from "./pages/geocercas/Index";
import CrearGeocerca from "./pages/geocercas/Crear";
import EditarGeocerca from "./pages/geocercas/Editar";
import RutasIndex from "./pages/rutas/Index";
import RegisterRuta from "./pages/rutas/Register";
import EditRuta from "./pages/rutas/Edit";
import ParadasIndex from "./pages/paradas/Index";

// Placeholder pages for new routes
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buses" element={<BusesIndex />} />
            <Route path="/buses/register" element={<RegisterBus />} />
            <Route path="/buses/edit/:id" element={<EditBus />} />
            <Route path="/configuracion/parametros" element={<ZoneParametersConfig />} />
            <Route path="/perfiles" element={<PerfilesIndex />} />
            <Route path="/perfiles/register" element={<RegisterPerfil />} />
            <Route path="/perfiles/permisos" element={<PerfilPermisos />} />
            <Route path="/conductores" element={<ConductoresIndex />} />
            <Route path="/conductores/register" element={<RegisterConductor />} />
            <Route path="/conductores/edit/:id" element={<EditConductor />} />
            <Route path="/geocercas" element={<GeocercasIndex />} />
            <Route path="/geocercas/crear" element={<CrearGeocerca />} />
            <Route path="/geocercas/editar/:id" element={<EditarGeocerca />} />
            <Route path="/rutas" element={<RutasIndex />} />
            <Route path="/rutas/register" element={<RegisterRuta />} />
            <Route path="/rutas/edit/:id" element={<EditRuta />} />
            <Route path="/paradas" element={<ParadasIndex />} />
            
            {/* New routes for sidebar navigation */}
            <Route path="/companies" element={<PlaceholderPage title="Empresas Administradoras" />} />
            <Route path="/zones" element={<PlaceholderPage title="Zonas Francas" />} />
            <Route path="/clients" element={<PlaceholderPage title="Empresas Cliente" />} />
            <Route path="/transport" element={<PlaceholderPage title="Empresas Transportistas" />} />
            <Route path="/users" element={<PlaceholderPage title="Usuarios Administradores" />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SidebarProvider>
  </QueryClientProvider>
);

export default App;
