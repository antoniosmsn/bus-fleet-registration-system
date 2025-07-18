import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { BitacorasLectorasFilter, BitacorasLectorasFilterData } from "@/components/bitacoras-lectoras/BitacorasLectorasFilter";
import { BitacorasLectorasTable } from "@/components/bitacoras-lectoras/BitacorasLectorasTable";
import { mockBitacorasLectoras, BitacoraLectora } from "@/data/mockBitacorasLectoras";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 20;

export default function BitacorasLectorasIndex() {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState<BitacoraLectora[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterData, setFilterData] = useState<BitacorasLectorasFilterData>({
    fechaInicio: new Date(),
    fechaFin: new Date(),
    aplicarFiltroDescarga: false,
    fechaInicioDescarga: new Date(),
    fechaFinDescarga: new Date(),
    usuario: "",
    modulo: "todos",
    descripcion: "",
    serial: "",
    placaAutobus: "",
    idAutobus: "",
    empresaTransporte: "todos",
    datos: "",
    esHardware: "todos",
    mostrarContenidoCompleto: false
  });

  const filterBitacoras = (data: BitacorasLectorasFilterData): BitacoraLectora[] => {
    return mockBitacorasLectoras.filter((bitacora) => {
      // Convertir fechas UTC del mock a fechas locales para comparación
      const fechaEvento = new Date(bitacora.fechaHoraEvento);
      const fechaDescarga = new Date(bitacora.fechaHoraDescarga);
      
      // Ajustar fechas de filtro a UTC para comparación
      const fechaInicioUTC = new Date(data.fechaInicio.getTime() - data.fechaInicio.getTimezoneOffset() * 60000);
      const fechaFinUTC = new Date(data.fechaFin.getTime() - data.fechaFin.getTimezoneOffset() * 60000);
      fechaFinUTC.setHours(23, 59, 59, 999);

      // Filtro por fecha de evento
      if (fechaEvento < fechaInicioUTC || fechaEvento > fechaFinUTC) {
        return false;
      }

      // Filtro por fecha de descarga (si está activado)
      if (data.aplicarFiltroDescarga) {
        const fechaInicioDescargaUTC = new Date(data.fechaInicioDescarga.getTime() - data.fechaInicioDescarga.getTimezoneOffset() * 60000);
        const fechaFinDescargaUTC = new Date(data.fechaFinDescarga.getTime() - data.fechaFinDescarga.getTimezoneOffset() * 60000);
        fechaFinDescargaUTC.setHours(23, 59, 59, 999);
        
        if (fechaDescarga < fechaInicioDescargaUTC || fechaDescarga > fechaFinDescargaUTC) {
          return false;
        }
      }

      // Filtro por usuario
      if (data.usuario && !bitacora.usuario.toLowerCase().includes(data.usuario.toLowerCase())) {
        return false;
      }

      // Filtro por módulo
      if (data.modulo !== "todos" && bitacora.modulo !== data.modulo) {
        return false;
      }

      // Filtro por descripción
      if (data.descripcion && !bitacora.descripcion.toLowerCase().includes(data.descripcion.toLowerCase())) {
        return false;
      }

      // Filtro por serial
      if (data.serial && !bitacora.serial.toLowerCase().includes(data.serial.toLowerCase())) {
        return false;
      }

      // Filtro por placa
      if (data.placaAutobus && !bitacora.placaAutobus.toLowerCase().includes(data.placaAutobus.toLowerCase())) {
        return false;
      }

      // Filtro por ID de autobús (coincidencia exacta)
      if (data.idAutobus && bitacora.idAutobus !== parseInt(data.idAutobus)) {
        return false;
      }

      // Filtro por empresa de transporte
      if (data.empresaTransporte !== "todos" && !bitacora.empresaTransporte.toLowerCase().includes(data.empresaTransporte.toLowerCase())) {
        return false;
      }

      // Filtro por datos
      if (data.datos && !bitacora.datos.toLowerCase().includes(data.datos.toLowerCase())) {
        return false;
      }

      // Filtro por es hardware
      if (data.esHardware !== "todos") {
        const esHardwareValue = data.esHardware === "si";
        if (bitacora.esHardware !== esHardwareValue) {
          return false;
        }
      }

      return true;
    });
  };

  const handleFilter = async (data: BitacorasLectorasFilterData) => {
    setIsLoading(true);
    setFilterData(data);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filtered = filterBitacoras(data);
      setFilteredData(filtered);
      setCurrentPage(1);
      setHasSearched(true);
      
      toast({
        title: "Consulta realizada",
        description: `Se encontraron ${filtered.length} registros`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en la consulta",
        description: "Ocurrió un error al consultar las bitácoras",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bitácoras de Lectoras</h1>
        
        <BitacorasLectorasFilter 
          onFilter={handleFilter} 
          isLoading={isLoading}
        />

        {hasSearched && (
          <BitacorasLectorasTable
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            filterData={filterData}
          />
        )}
      </div>
    </Layout>
  );
}