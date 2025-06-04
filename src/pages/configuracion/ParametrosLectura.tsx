
import React, { useState } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import BusSelectionModal from '@/components/parametros/BusSelectionModal';
import ParametersHeaderCard from '@/components/parametros/ParametersHeaderCard';
import ParametersForm from '@/components/parametros/ParametersForm';

interface Bus {
  id: number;
  placa: string;
}

const ParametrosLectura = () => {
  const [autobusSeleccionado, setAutobusSeleccionado] = useState<Bus | null>(null);
  const [modalAbierto, setModalAbierto] = useState(true);
  const [busquedaAutobus, setBusquedaAutobus] = useState('');
  const [autobusSelecionadoModal, setAutobusSelecionadoModal] = useState<string>('');
  const [leyendoParametros, setLeyendoParametros] = useState(false);
  const [parametrosLeidosDesdeDispositivo, setParametrosLeidosDesdeDispositivo] = useState(false);
  const [mostrarContrasenaWifi, setMostrarContrasenaWifi] = useState(false);
  const [mostrarContrasenaMqtt, setMostrarContrasenaMqtt] = useState(false);

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

  const handleLeerParametrosEnLinea = () => {
    if (!autobusSeleccionado) {
      toast.error('Debe seleccionar un autobús primero');
      return;
    }

    setLeyendoParametros(true);
    console.log(`Leyendo parámetros en línea del autobús ${autobusSeleccionado.id}-${autobusSeleccionado.placa}`);
    
    // Simular lectura MQTT con timeout de 20 segundos
    setTimeout(() => {
      const exito = Math.random() > 0.3; // 70% de probabilidad de éxito
      
      if (exito) {
        // Simular parámetros leídos desde la lectora
        setIdioma('Español');
        setTemaVisual('Claro');
        setUrlApi('https://api-lectora.example.com');
        setUrlServicioMqtt('ssl://mqtt-lectora.example.com');
        setPuertoApi('31001');
        setPuertoServicioMqtt('32506');
        setNombreRedWifi('Lectora-WiFi');
        setContrasenaRedWifi('●●●●●●●●●●●●●●●');
        setVolumen('85');
        setUsuarioMqtt('lectora');
        setContrasenaMqtt('●●●●●●●●●');
        setUsoConexionSegura(true);
        setNivelDetalle('DEBUG');
        
        setParametrosLeidosDesdeDispositivo(true);
        toast.success('Se han leído los parámetros correctamente');
        console.log('Parámetros leídos exitosamente desde la lectora');
      } else {
        const tipoError = Math.random();
        if (tipoError < 0.5) {
          toast.error('El autobús seleccionado no respondió cuando se intentó leer los parámetros');
        } else {
          toast.error('No fue posible obtener los parámetros. Lectora no disponible');
        }
        console.log('Error al leer parámetros de la lectora');
      }
      
      setLeyendoParametros(false);
    }, 3000); // Simular 3 segundos de espera en lugar de 20 para demo
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
      setParametrosLeidosDesdeDispositivo(false);
      console.log(`Cargando parámetros para el autobús ${bus.id}-${bus.placa}`);
      setModalAbierto(false);
      toast.success(`Autobús ${bus.id}-${bus.placa} seleccionado correctamente`);
    }
  };

  const cancelarSeleccion = () => {
    setModalAbierto(false);
    if (!autobusSeleccionado) {
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

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto">
        <ParametersHeaderCard
          autobusSeleccionado={autobusSeleccionado}
          parametrosLeidosDesdeDispositivo={parametrosLeidosDesdeDispositivo}
          leyendoParametros={leyendoParametros}
          onAbrirModalSeleccion={abrirModalSeleccion}
          onLeerParametrosEnLinea={handleLeerParametrosEnLinea}
        />

        {autobusSeleccionado && (
          <ParametersForm
            idioma={idioma}
            setIdioma={setIdioma}
            temaVisual={temaVisual}
            setTemaVisual={setTemaVisual}
            urlApi={urlApi}
            setUrlApi={setUrlApi}
            urlServicioMqtt={urlServicioMqtt}
            setUrlServicioMqtt={setUrlServicioMqtt}
            puertoApi={puertoApi}
            setPuertoApi={setPuertoApi}
            puertoServicioMqtt={puertoServicioMqtt}
            setPuertoServicioMqtt={setPuertoServicioMqtt}
            nombreRedWifi={nombreRedWifi}
            setNombreRedWifi={setNombreRedWifi}
            contrasenaRedWifi={contrasenaRedWifi}
            setContrasenaRedWifi={setContrasenaRedWifi}
            volumen={volumen}
            setVolumen={setVolumen}
            usuarioMqtt={usuarioMqtt}
            setUsuarioMqtt={setUsuarioMqtt}
            contrasenaMqtt={contrasenaMqtt}
            setContrasenaMqtt={setContrasenaMqtt}
            usoConexionSegura={usoConexionSegura}
            setUsoConexionSegura={setUsoConexionSegura}
            nivelDetalle={nivelDetalle}
            setNivelDetalle={setNivelDetalle}
            mostrarContrasenaWifi={mostrarContrasenaWifi}
            setMostrarContrasenaWifi={setMostrarContrasenaWifi}
            mostrarContrasenaMqtt={mostrarContrasenaMqtt}
            setMostrarContrasenaMqtt={setMostrarContrasenaMqtt}
            onGuardarConfiguracion={handleGuardarConfiguracion}
            onMostrarParametrosBaseDatos={handleMostrarParametrosBaseDatos}
          />
        )}

        <BusSelectionModal
          isOpen={modalAbierto}
          busquedaAutobus={busquedaAutobus}
          setBusquedaAutobus={setBusquedaAutobus}
          autobusSelecionadoModal={autobusSelecionadoModal}
          setAutobusSelecionadoModal={setAutobusSelecionadoModal}
          onSeleccionar={seleccionarAutobus}
          onCancelar={cancelarSeleccion}
          autobuses={autobuses}
        />
      </div>
    </Layout>
  );
};

export default ParametrosLectura;
