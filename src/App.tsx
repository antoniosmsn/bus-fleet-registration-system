import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import PlaceholderPage from '@/pages/PlaceholderPage';

// Mantenimiento pages
import MantenimientoIndex from '@/pages/mantenimiento/Index';
import MantenimientoRegister from '@/pages/mantenimiento/Register';
import MantenimientoEdit from '@/pages/mantenimiento/Edit';

// Inspecciones pages
import InspeccionesIndex from '@/pages/mantenimiento/inspecciones/Index';
import InspeccionesRegister from '@/pages/mantenimiento/inspecciones/Register';

// Plantillas Matriz pages
import PlantillasMatrizIndex from '@/pages/mantenimiento/plantillas-matriz/Index';
import PlantillasMatrizRegister from '@/pages/mantenimiento/plantillas-matriz/Register';
import PlantillasMatrizRegisterV2 from '@/pages/mantenimiento/plantillas-matriz/RegisterV2';
import PlantillasMatrizEdit from '@/pages/mantenimiento/plantillas-matriz/Edit';

// Other pages (keeping existing imports)
import BusesIndex from '@/pages/buses/Index';
import BusesRegister from '@/pages/buses/Register';
import BusesEdit from '@/pages/buses/Edit';
import CapacidadCumplida from '@/pages/buses/CapacidadCumplida';
import AutobusesCapacidadCumplida from '@/pages/buses/AutobusesCapacidadCumplida';

import ConductoresIndex from '@/pages/conductores/Index';
import ConductoresRegister from '@/pages/conductores/Register';
import ConductoresEdit from '@/pages/conductores/Edit';

import PasajerosIndex from '@/pages/pasajeros/Index';
import PasajerosRegister from '@/pages/pasajeros/Register';
import PasajerosEdit from '@/pages/pasajeros/Edit';

import RutasIndex from '@/pages/rutas/Index';
import RutasRegister from '@/pages/rutas/Register';
import RutasEdit from '@/pages/rutas/Edit';

import ServiciosIndex from '@/pages/servicios/Index';
import ServiciosRegister from '@/pages/servicios/Register';
import ServiciosEdit from '@/pages/servicios/Edit';
import CumplimientoServicios from '@/pages/servicios/CumplimientoServicios';
import BitacoraCambiosRutas from '@/pages/servicios/BitacoraCambiosRutas';
import ListadoServiciosEmpresa from '@/pages/servicios/ListadoServiciosEmpresa';

import AsignacionesIndex from '@/pages/asignaciones/Index';
import AsignacionesRegister from '@/pages/asignaciones/Register';
import AsignacionesEdit from '@/pages/asignaciones/Edit';

import AsignacionesConductoresIndex from '@/pages/asignaciones-conductores/Index';
import AsignacionesConductoresAsignar from '@/pages/asignaciones-conductores/Asignar';

import GeocercasIndex from '@/pages/geocercas/Index';
import GeocercasCrear from '@/pages/geocercas/Crear';
import GeocercasEditar from '@/pages/geocercas/Editar';

import ParadasIndex from '@/pages/paradas/Index';
import ParadasRegister from '@/pages/paradas/Register';

import PerfilesIndex from '@/pages/perfiles/Index';
import PerfilesRegister from '@/pages/perfiles/Register';
import PerfilesPermisos from '@/pages/perfiles/Permisos';

import TiempoReal from '@/pages/rastreo/TiempoReal';
import RecorridosPrevios from '@/pages/rastreo/RecorridosPrevios';

import AlarmasListado from '@/pages/alarmas/Listado';
import AlarmasConductorListado from '@/pages/alarmas-conductor/Listado';
import TelemetriaListado from '@/pages/telemetria/Listado';
import SolicitudesTrasladoIndex from '@/pages/solicitudes-traslado/Index';
import BitacorasLectorasIndex from '@/pages/bitacoras-lectoras/Index';

import ParametrosLectura from '@/pages/configuracion/ParametrosLectura';
import ZoneParametersConfig from '@/pages/configuracion/ZoneParametersConfig';
import ParametrosIndex from '@/pages/configuracion/parametros/index';
import ProgramacionParametros from '@/pages/programacion/ProgramacionParametros';
import CategoriasMantenimiento from '@/pages/configuracion/CategoriasMantenimiento';
import ConfiguracionIndex from '@/pages/configuracion/Index';
import SolicitudesAprobacionIndex from '@/pages/servicios/solicitudes-aprobacion/Index';
import SolicitudesDevolucionSaldo from '@/pages/servicios/SolicitudesDevolucionSaldo';
import SolicitudPago from '@/pages/servicios/SolicitudPago';

// Recargas SINPE pages
import RecargasSinpeIndex from '@/pages/recargas-sinpe/Index';

// Bancos pages
import BancosIndex from '@/pages/bancos/Index';

// Catálogos Alertas Pasajeros
import AlertasPasajerosIndex from '@/pages/catalogos/alertas-pasajeros/Index';
import AlertasPasajerosRegister from '@/pages/catalogos/alertas-pasajeros/Register';
import AlertasPasajerosEdit from '@/pages/catalogos/alertas-pasajeros/Edit';

// Catálogos Alertas Autobuses
import AlertasAutobusesIndex from '@/pages/catalogos/alertas-autobuses/Index';
import AlertasAutobusesRegister from '@/pages/catalogos/alertas-autobuses/Register';
import AlertasAutobusesEdit from '@/pages/catalogos/alertas-autobuses/Edit';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Mantenimiento routes */}
            <Route path="/mantenimiento" element={<MantenimientoIndex />} />
            <Route path="/mantenimiento/registrar" element={<MantenimientoRegister />} />
            <Route path="/mantenimiento/editar/:id" element={<MantenimientoEdit />} />
            
            {/* Inspecciones routes */}
            <Route path="/mantenimiento/inspecciones" element={<InspeccionesIndex />} />
            <Route path="/mantenimiento/inspecciones/registrar" element={<InspeccionesRegister />} />
            
            {/* Plantillas Matriz routes */}
            <Route path="/mantenimiento/plantillas-matriz" element={<PlantillasMatrizIndex />} />
            <Route path="/mantenimiento/plantillas-matriz/registrar" element={<PlantillasMatrizRegister />} />
            <Route path="/mantenimiento/plantillas-matriz/registrar-v2" element={<PlantillasMatrizRegisterV2 />} />
            <Route path="/mantenimiento/plantillas-matriz/editar/:id" element={<PlantillasMatrizEdit />} />
            
            {/* Bus routes */}
            <Route path="/buses" element={<BusesIndex />} />
            <Route path="/buses/register" element={<BusesRegister />} />
            <Route path="/buses/edit/:id" element={<BusesEdit />} />
            <Route path="/buses/capacidad-cumplida" element={<CapacidadCumplida />} />
            <Route path="/buses/autobuses-capacidad-cumplida" element={<AutobusesCapacidadCumplida />} />
            
            {/* Conductores routes */}
            <Route path="/conductores" element={<ConductoresIndex />} />
            <Route path="/conductores/register" element={<ConductoresRegister />} />
            <Route path="/conductores/edit/:id" element={<ConductoresEdit />} />
            
            {/* Pasajeros routes */}
            <Route path="/pasajeros" element={<PasajerosIndex />} />
            <Route path="/pasajeros/register" element={<PasajerosRegister />} />
            <Route path="/pasajeros/edit/:id" element={<PasajerosEdit />} />
            
            {/* Rutas routes */}
            <Route path="/rutas" element={<RutasIndex />} />
            <Route path="/rutas/register" element={<RutasRegister />} />
            <Route path="/rutas/edit/:id" element={<RutasEdit />} />
            
            {/* Servicios routes */}
            <Route path="/servicios" element={<ServiciosIndex />} />
            <Route path="/servicios/register" element={<ServiciosRegister />} />
            <Route path="/servicios/edit/:id" element={<ServiciosEdit />} />
            <Route path="/servicios/cumplimiento" element={<CumplimientoServicios />} />
            <Route path="/servicios/bitacora-cambios-rutas" element={<BitacoraCambiosRutas />} />
            <Route path="/servicios/solicitudes-aprobacion" element={<SolicitudesAprobacionIndex />} />
            <Route path="/servicios/saldo" element={<SolicitudesDevolucionSaldo />} />
        <Route path="/servicios/saldo/solicitud-pago/:numeroDevolucion" element={<SolicitudPago />} />
            <Route path="/servicios/listado-empresa-transporte" element={<ListadoServiciosEmpresa />} />
            
            {/* Recargas SINPE routes */}
            <Route path="/recargas-sinpe" element={<RecargasSinpeIndex />} />
            
            {/* Asignaciones routes */}
            <Route path="/asignaciones" element={<AsignacionesIndex />} />
            <Route path="/asignaciones/register" element={<AsignacionesRegister />} />
            <Route path="/asignaciones/edit/:id" element={<AsignacionesEdit />} />
            
            {/* Asignaciones Conductores routes */}
            <Route path="/asignaciones-conductores" element={<AsignacionesConductoresIndex />} />
            <Route path="/asignaciones-conductores/asignar" element={<AsignacionesConductoresAsignar />} />
            
            {/* Geocercas routes */}
            <Route path="/geocercas" element={<GeocercasIndex />} />
            <Route path="/geocercas/crear" element={<GeocercasCrear />} />
            <Route path="/geocercas/editar/:id" element={<GeocercasEditar />} />
            
            {/* Paradas routes */}
            <Route path="/paradas" element={<ParadasIndex />} />
            <Route path="/paradas/register" element={<ParadasRegister />} />
            
            {/* Perfiles routes */}
            <Route path="/perfiles" element={<PerfilesIndex />} />
            <Route path="/perfiles/register" element={<PerfilesRegister />} />
            <Route path="/perfiles/permisos/:id" element={<PerfilesPermisos />} />
            
            {/* Rastreo routes */}
            <Route path="/rastreo/tiempo-real" element={<TiempoReal />} />
            <Route path="/rastreo/recorridos-previos" element={<RecorridosPrevios />} />
            
            {/* Alarmas routes */}
            <Route path="/alarmas" element={<AlarmasListado />} />
            <Route path="/alarmas-conductor" element={<AlarmasConductorListado />} />
            
            {/* Telemetría routes */}
            <Route path="/telemetria" element={<TelemetriaListado />} />
            
            {/* Solicitudes Traslado routes */}
            <Route path="/solicitudes-traslado" element={<SolicitudesTrasladoIndex />} />
            
            {/* Bitácoras Lectoras routes */}
            <Route path="/bitacoras-lectoras" element={<BitacorasLectorasIndex />} />
            
            {/* Bancos routes */}
            <Route path="/bancos" element={<BancosIndex />} />
            
            {/* Configuración routes */}
            <Route path="/configuracion" element={<ConfiguracionIndex />} />
            <Route path="/configuracion/parametros-lectura" element={<ParametrosLectura />} />
            <Route path="/configuracion/zone-parameters" element={<ZoneParametersConfig />} />
            <Route path="/configuracion/parametros" element={<ParametrosIndex />} />
            <Route path="/configuracion/categorias-mantenimiento" element={<CategoriasMantenimiento />} />
            
            {/* Catálogos Alertas Pasajeros routes */}
            <Route path="/catalogos/alertas-pasajeros" element={<AlertasPasajerosIndex />} />
            <Route path="/catalogos/alertas-pasajeros/registrar" element={<AlertasPasajerosRegister />} />
            <Route path="/catalogos/alertas-pasajeros/editar/:id" element={<AlertasPasajerosEdit />} />
            
            {/* Catálogos Alertas Autobuses routes */}
            <Route path="/catalogos/alertas-autobuses" element={<AlertasAutobusesIndex />} />
            <Route path="/catalogos/alertas-autobuses/register" element={<AlertasAutobusesRegister />} />
            <Route path="/catalogos/alertas-autobuses/edit/:id" element={<AlertasAutobusesEdit />} />
            
            {/* Programación routes */}
            <Route path="/programacion/parametros" element={<ProgramacionParametros />} />
            
            {/* Placeholder routes */}
            <Route path="/placeholder" element={<PlaceholderPage title="Página en Construcción" />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
