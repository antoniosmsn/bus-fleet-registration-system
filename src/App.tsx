
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusesIndex from "./pages/buses/Index";
import RegisterBus from "./pages/buses/Register";
import ZoneParametersConfig from "./pages/configuracion/parametros";
import PerfilesIndex from "./pages/perfiles/Index";
import RegisterPerfil from "./pages/perfiles/Register";
import PerfilPermisos from "./pages/perfiles/Permisos";
import ConductoresIndex from "./pages/conductores/Index";
import RegisterConductor from "./pages/conductores/Register";
import EditConductor from "./pages/conductores/Edit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buses" element={<BusesIndex />} />
          <Route path="/buses/register" element={<RegisterBus />} />
          <Route path="/configuracion/parametros" element={<ZoneParametersConfig />} />
          <Route path="/perfiles" element={<PerfilesIndex />} />
          <Route path="/perfiles/register" element={<RegisterPerfil />} />
          <Route path="/perfiles/permisos" element={<PerfilPermisos />} />
          <Route path="/conductores" element={<ConductoresIndex />} />
          <Route path="/conductores/register" element={<RegisterConductor />} />
          <Route path="/conductores/edit/:id" element={<EditConductor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
