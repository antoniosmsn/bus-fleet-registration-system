import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mockPerfiles = [
  { id: 1, nombre: "Administrador", usuariosAsignados: 3 },
  { id: 2, nombre: "Supervisor", usuariosAsignados: 1 },
  { id: 3, nombre: "Operador", usuariosAsignados: 5 },
  { id: 4, nombre: "Conductor", usuariosAsignados: 10 },
  { id: 5, nombre: "Analista", usuariosAsignados: 0 },
];

const PerfilesIndex = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [perfiles, setPerfiles] = useState(mockPerfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const perfilesPerPage = 5;

  const filteredPerfiles = perfiles.filter(perfil => 
    perfil.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPerfiles = [...filteredPerfiles].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.nombre.localeCompare(b.nombre);
    } else {
      return b.nombre.localeCompare(a.nombre);
    }
  });

  const indexOfLastPerfil = currentPage * perfilesPerPage;
  const indexOfFirstPerfil = indexOfLastPerfil - perfilesPerPage;
  const currentPerfiles = sortedPerfiles.slice(indexOfFirstPerfil, indexOfLastPerfil);
  const totalPages = Math.ceil(sortedPerfiles.length / perfilesPerPage);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeletePerfil = (perfilId: number, perfilNombre: string) => {
    const perfilToDelete = perfiles.find(p => p.id === perfilId);
    
    if (!perfilToDelete) return;
    
    if (perfilToDelete.usuariosAsignados > 0) {
      toast({
        title: "Error al eliminar perfil",
        description: `El perfil '${perfilNombre}' no puede ser eliminado porque está asignado a uno o más usuarios actualmente.`,
        variant: "destructive",
      });
    } else {
      const updatedPerfiles = perfiles.filter(p => p.id !== perfilId);
      setPerfiles(updatedPerfiles);
      
      toast({
        title: "Perfil eliminado",
        description: `Perfil '${perfilNombre}' eliminado exitosamente.`,
      });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Perfiles por Zona Franca</h1>
          <Button onClick={() => navigate('/perfiles/register')}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Perfil
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por nombre de perfil..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista de perfiles disponibles</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                    Nombre del Perfil {sortDirection === 'asc' ? '↑' : '↓'}
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPerfiles.length > 0 ? (
                  currentPerfiles.map((perfil) => (
                    <TableRow key={perfil.id}>
                      <TableCell>{perfil.nombre}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Deseas eliminar el perfil '{perfil.nombre}'? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePerfil(perfil.id, perfil.nombre)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No se encontraron perfiles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => setCurrentPage(number)}
                        isActive={currentPage === number}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PerfilesIndex;
