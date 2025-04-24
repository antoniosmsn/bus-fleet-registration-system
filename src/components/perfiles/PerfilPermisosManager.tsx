
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Save, X, Check } from "lucide-react";
import { PerfilSelector } from "./PerfilSelector";
import type { Profile } from '@/types/profile';
import type { Permiso } from '@/types/permiso';

// Mock data for modules and permissions
const mockModulos = [
  { id: 1, nombre: "Autobuses", acciones: [
    { id: 1, nombre: "Consultar", codigo: "BUS_VIEW" },
    { id: 2, nombre: "Crear", codigo: "BUS_CREATE" },
    { id: 3, nombre: "Editar", codigo: "BUS_EDIT" },
    { id: 4, nombre: "Eliminar", codigo: "BUS_DELETE" },
  ]},
  { id: 2, nombre: "Perfiles", acciones: [
    { id: 5, nombre: "Consultar", codigo: "PROFILE_VIEW" },
    { id: 6, nombre: "Crear", codigo: "PROFILE_CREATE" },
    { id: 7, nombre: "Editar", codigo: "PROFILE_EDIT" },
    { id: 8, nombre: "Eliminar", codigo: "PROFILE_DELETE" },
    { id: 9, nombre: "Gestionar Permisos", codigo: "PROFILE_PERMISSIONS" },
  ]},
  { id: 3, nombre: "Usuarios", acciones: [
    { id: 10, nombre: "Consultar", codigo: "USER_VIEW" },
    { id: 11, nombre: "Crear", codigo: "USER_CREATE" },
    { id: 12, nombre: "Editar", codigo: "USER_EDIT" },
    { id: 13, nombre: "Eliminar", codigo: "USER_DELETE" },
  ]},
  { id: 4, nombre: "Configuración", acciones: [
    { id: 14, nombre: "Parámetros", codigo: "CONFIG_PARAMS" },
    { id: 15, nombre: "Zonas Francas", codigo: "CONFIG_ZONES" },
  ]},
];

// Mock permissions assigned to profiles
const mockPermisosAsignados = {
  1: ["BUS_VIEW", "BUS_CREATE", "PROFILE_VIEW"], // Permissions for profile ID 1
  2: ["BUS_VIEW", "USER_VIEW"], // Permissions for profile ID 2
  3: ["BUS_VIEW", "BUS_CREATE", "BUS_EDIT", "BUS_DELETE", "USER_VIEW"] // Permissions for profile ID 3
};

// Mock current user permissions - used to determine what the user can assign
const mockUserPermisos = [
  "BUS_VIEW", "BUS_CREATE", "BUS_EDIT", "BUS_DELETE",
  "PROFILE_VIEW", "PROFILE_CREATE", "PROFILE_EDIT", "PROFILE_PERMISSIONS",
  "USER_VIEW", "USER_CREATE",
  "CONFIG_PARAMS"
];

// Mock current user profile ID
const mockUserPerfilId = 1;

export function PerfilPermisosManager() {
  const { toast } = useToast();
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModulos, setFilteredModulos] = useState(mockModulos);
  const [permisosPorPerfil, setPermisosPorPerfil] = useState<Record<number, string[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize permissions when profiles are selected
  useEffect(() => {
    const initialPermisos: Record<number, string[]> = {};
    
    selectedProfiles.forEach(profile => {
      initialPermisos[profile.id] = mockPermisosAsignados[profile.id] || [];
    });
    
    setPermisosPorPerfil(initialPermisos);
  }, [selectedProfiles]);

  // Filter modules and actions based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredModulos(mockModulos);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filtered = mockModulos.map(modulo => {
      // Check if module name matches
      if (modulo.nombre.toLowerCase().includes(searchTermLower)) {
        return { ...modulo };
      }
      
      // Filter actions that match
      const matchingAcciones = modulo.acciones.filter(accion => 
        accion.nombre.toLowerCase().includes(searchTermLower)
      );
      
      if (matchingAcciones.length > 0) {
        return {
          ...modulo,
          acciones: matchingAcciones
        };
      }
      
      return null;
    }).filter(Boolean);
    
    setFilteredModulos(filtered as typeof mockModulos);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePermisoChange = (perfilId: number, permisoCodigo: string, isChecked: boolean) => {
    setPermisosPorPerfil(prev => {
      const currentPermisos = [...(prev[perfilId] || [])];
      
      if (isChecked) {
        if (!currentPermisos.includes(permisoCodigo)) {
          currentPermisos.push(permisoCodigo);
        }
      } else {
        const index = currentPermisos.indexOf(permisoCodigo);
        if (index !== -1) {
          currentPermisos.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [perfilId]: currentPermisos
      };
    });
  };

  const handleSelectProfiles = (profiles: Profile[]) => {
    // Filter out profiles that match the current user's profile
    const filteredProfiles = profiles.filter(profile => profile.id !== mockUserPerfilId);
    setSelectedProfiles(filteredProfiles);
    setIsModalOpen(false);
  };

  const handleSavePermissions = () => {
    // In a real application, this would send the data to your API
    console.log("Saving permissions:", permisosPorPerfil);
    
    toast({
      title: "Permisos actualizados",
      description: "Permisos actualizados correctamente.",
    });
  };

  // Check if the current user has a specific permission
  const canAssignPermiso = (permisoCodigo: string) => {
    return mockUserPermisos.includes(permisoCodigo);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Perfiles seleccionados ({selectedProfiles.length})</h2>
          <div className="flex flex-wrap gap-2">
            {selectedProfiles.length === 0 ? (
              <p className="text-gray-500 italic">No hay perfiles seleccionados</p>
            ) : (
              selectedProfiles.map(profile => (
                <div key={profile.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  {profile.nombre}
                  <button 
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => setSelectedProfiles(prev => prev.filter(p => p.id !== profile.id))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
            Seleccionar Perfiles
          </Button>
          
          <Button variant="outline" onClick={handleSavePermissions} disabled={selectedProfiles.length === 0}>
            <Save className="mr-2 h-4 w-4" /> Guardar Permisos
          </Button>
        </div>
      </div>
      
      {selectedProfiles.length > 0 && (
        <>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por módulo o acción..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Módulo
                    </th>
                    <th className="sticky left-32 bg-white px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acción
                    </th>
                    {selectedProfiles.map((profile) => (
                      <th key={profile.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {profile.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredModulos.map((modulo) => (
                    <React.Fragment key={modulo.id}>
                      {modulo.acciones.map((accion, index) => (
                        <tr key={accion.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {index === 0 ? (
                            <td 
                              rowSpan={modulo.acciones.length} 
                              className="sticky left-0 bg-inherit px-4 py-2 text-sm font-medium text-gray-900 align-top whitespace-nowrap"
                            >
                              {modulo.nombre}
                            </td>
                          ) : null}
                          <td className="sticky left-32 bg-inherit px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                            {accion.nombre}
                          </td>
                          {selectedProfiles.map((profile) => (
                            <td key={`${profile.id}-${accion.id}`} className="px-4 py-2 text-center">
                              <div className="flex justify-center items-center">
                                <Checkbox 
                                  id={`${profile.id}-${accion.codigo}`}
                                  checked={permisosPorPerfil[profile.id]?.includes(accion.codigo) || false}
                                  onCheckedChange={(checked) => handlePermisoChange(profile.id, accion.codigo, !!checked)}
                                  disabled={!canAssignPermiso(accion.codigo)}
                                  className={!canAssignPermiso(accion.codigo) ? "opacity-50 cursor-not-allowed" : ""}
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <PerfilSelector 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectProfiles={handleSelectProfiles}
        selectedProfiles={selectedProfiles}
        excludeProfileId={mockUserPerfilId}
      />
    </div>
  );
}
