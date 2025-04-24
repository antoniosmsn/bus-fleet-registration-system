
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import type { Profile } from '@/types/profile';

// Mock data for available profiles
const mockProfiles: Profile[] = [
  { id: 1, nombre: "Administrador", usuariosAsignados: 3 },
  { id: 2, nombre: "Supervisor", usuariosAsignados: 1 },
  { id: 3, nombre: "Operador", usuariosAsignados: 5 },
  { id: 4, nombre: "Conductor", usuariosAsignados: 10 },
  { id: 5, nombre: "Analista", usuariosAsignados: 0 },
];

interface PerfilSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfiles: (profiles: Profile[]) => void;
  selectedProfiles: Profile[];
  excludeProfileId?: number;
}

export function PerfilSelector({
  isOpen,
  onClose,
  onSelectProfiles,
  selectedProfiles,
  excludeProfileId
}: PerfilSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState<Record<number, boolean>>({});
  
  // Initialize available profiles and selected IDs
  useEffect(() => {
    // Filter out the excluded profile ID
    const filtered = mockProfiles.filter(
      profile => excludeProfileId === undefined || profile.id !== excludeProfileId
    );
    setAvailableProfiles(filtered);
    
    // Initialize selected profile IDs
    const initialSelected: Record<number, boolean> = {};
    selectedProfiles.forEach(profile => {
      initialSelected[profile.id] = true;
    });
    setSelectedProfileIds(initialSelected);
  }, [excludeProfileId, selectedProfiles]);
  
  // Filter profiles based on search term
  const filteredProfiles = availableProfiles.filter(profile => 
    profile.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSelectProfile = (profileId: number, isChecked: boolean) => {
    setSelectedProfileIds(prev => ({
      ...prev,
      [profileId]: isChecked
    }));
  };
  
  const handleSubmit = () => {
    const selected = availableProfiles.filter(profile => selectedProfileIds[profile.id]);
    onSelectProfiles(selected);
  };
  
  const allSelected = filteredProfiles.length > 0 && 
    filteredProfiles.every(profile => selectedProfileIds[profile.id]);
  
  const handleSelectAll = () => {
    const newSelectedIds = { ...selectedProfileIds };
    
    filteredProfiles.forEach(profile => {
      newSelectedIds[profile.id] = !allSelected;
    });
    
    setSelectedProfileIds(newSelectedIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Perfiles</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por nombre de perfil..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          {filteredProfiles.length > 0 ? (
            <div>
              <div className="flex items-center space-x-2 py-2 px-1 border-b">
                <Checkbox 
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label 
                  htmlFor="select-all" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Seleccionar todos
                </label>
              </div>
              
              <div className="max-h-72 overflow-y-auto">
                {filteredProfiles.map(profile => (
                  <div key={profile.id} className="flex items-center space-x-2 py-2 px-1 border-b">
                    <Checkbox 
                      id={`profile-${profile.id}`}
                      checked={selectedProfileIds[profile.id] || false}
                      onCheckedChange={(checked) => handleSelectProfile(profile.id, !!checked)}
                    />
                    <label 
                      htmlFor={`profile-${profile.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {profile.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No se encontraron perfiles</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Seleccionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
