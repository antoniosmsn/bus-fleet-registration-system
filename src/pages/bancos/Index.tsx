import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { BancosFilter } from '@/components/bancos/BancosFilter';
import { BancosTable } from '@/components/bancos/BancosTable';
import { Banco, BancoFilter, BancoForm } from '@/types/banco';
import { mockBancos } from '@/data/mockBancos';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

export default function BancosIndex() {
  const [filtros, setFiltros] = useState<BancoFilter>({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Registrar acceso al módulo
  useEffect(() => {
    registrarAcceso('BANCOS');
  }, []);

  // Filtrar bancos según los criterios
  const filteredBancos = mockBancos.filter(banco => {
    // Filtro por nombre
    if (filtros.nombre && filtros.nombre.trim()) {
      if (filtros.nombre.length < 2) {
        return true; // No aplicar filtro si es menos de 2 caracteres
      }
      const nombreBusqueda = filtros.nombre.toLowerCase();
      const nombreBanco = banco.nombre.toLowerCase();
      if (!nombreBanco.includes(nombreBusqueda)) {
        return false;
      }
    }

    return true;
  });

  const handleFiltrosChange = (newFiltros: BancoFilter) => {
    setFiltros(newFiltros);

    // Simular carga
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleToggleEstado = (banco: Banco) => {
    // Actualizar el estado del banco en el mock data
    const bancoIndex = mockBancos.findIndex(b => b.id === banco.id);
    if (bancoIndex !== -1) {
      mockBancos[bancoIndex] = {
        ...mockBancos[bancoIndex],
        activo: !mockBancos[bancoIndex].activo,
        fechaModificacion: new Date().toISOString()
      };
    }

    const accion = banco.activo ? 'desactivado' : 'activado';
    
    toast({
      title: `Banco ${accion}`,
      description: `El banco "${banco.nombre}" ha sido ${accion} correctamente.`
    });
  };

  const handleAgregar = () => {
    // Esta función ahora es solo para indicar que se va a agregar
    // La lógica real está en la tabla
  };

  const handleSave = async (data: BancoForm, banco?: Banco) => {
    setFormLoading(true);

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (banco) {
        // Editar banco existente
        const bancoIndex = mockBancos.findIndex(b => b.id === banco.id);
        if (bancoIndex !== -1) {
          mockBancos[bancoIndex] = {
            ...mockBancos[bancoIndex],
            ...data,
            fechaModificacion: new Date().toISOString()
          };
        }

        toast({
          title: "Banco actualizado",
          description: `El banco "${data.nombre}" ha sido actualizado correctamente.`
        });
      } else {
        // Crear nuevo banco
        const nuevoBanco: Banco = {
          id: Math.max(...mockBancos.map(b => b.id)) + 1,
          ...data,
          activo: true,
          fechaCreacion: new Date().toISOString(),
          fechaModificacion: new Date().toISOString()
        };

        mockBancos.push(nuevoBanco);

        toast({
          title: "Banco creado",
          description: `El banco "${data.nombre}" ha sido creado correctamente.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el banco. Inténtelo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Bancos</h1>
            <p className="text-muted-foreground">
              Gestión de bancos del sistema
            </p>
          </div>
        </div>

        <BancosFilter
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          loading={loading}
        />

        <BancosTable
          bancos={filteredBancos}
          filtros={filtros}
          loading={loading}
          onToggleEstado={handleToggleEstado}
          onSave={handleSave}
          onAdd={handleAgregar}
        />

        {/* Información de resultados */}
        {!loading && (
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {filteredBancos.length} de {mockBancos.length} registros
            {filteredBancos.length !== mockBancos.length && (
              <span> (filtrados)</span>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}