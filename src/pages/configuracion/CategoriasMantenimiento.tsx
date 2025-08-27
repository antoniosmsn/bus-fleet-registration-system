import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Save, X, Edit3 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoriaMantenimiento, CategoriaMantenimientoFilter } from '@/types/categoria-mantenimiento';
import { mockCategoriasMantenimiento } from '@/data/mockCategoriasMantenimiento';
import { registrarAcceso } from '@/services/bitacoraService';

const CategoriasMantenimiento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categorias, setCategorias] = useState<CategoriaMantenimiento[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<CategoriaMantenimiento[]>([]);
  const [paginatedCategorias, setPaginatedCategorias] = useState<CategoriaMantenimiento[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<CategoriaMantenimientoFilter>({
    nombre: '',
    estado: 'todos'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate';
    categoria: CategoriaMantenimiento | null;
  }>({ open: false, type: 'activate', categoria: null });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    registrarAcceso('CATEGORIAS_MANTENIMIENTO');
    setCategorias([...mockCategoriasMantenimiento]);
  }, []);

  useEffect(() => {
    let filtered = [...categorias];

    // Filtro por nombre
    if (filters.nombre) {
      const searchTerm = filters.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(cat => 
        cat.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(searchTerm)
      );
    }

    // Filtro por estado
    if (filters.estado === 'activos') {
      filtered = filtered.filter(cat => cat.activo);
    } else if (filters.estado === 'inactivos') {
      filtered = filtered.filter(cat => !cat.activo);
    }

    // Ordenar por nombre ascendente
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));

    setFilteredCategorias(filtered);
    
    // Calcular páginas
    const total = Math.ceil(filtered.length / pageSize);
    setTotalPages(total);
    
    // Resetear a la primera página si es necesario
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [categorias, filters, pageSize, currentPage]);

  // Efecto para paginación
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedCategorias(filteredCategorias.slice(startIndex, endIndex));
  }, [filteredCategorias, currentPage, pageSize]);

  const handleAddCategory = () => {
    const newCategory: CategoriaMantenimiento = {
      id: `temp-${Date.now()}`,
      nombre: '',
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimaActualizacion: new Date().toISOString().split('T')[0],
      isNew: true
    };
    
    setCategorias(prev => [newCategory, ...prev]);
    setCurrentPage(1); // Ir a la primera página para ver el nuevo elemento
    setEditingId(newCategory.id);
    setEditingName('');
    setHasChanges(true);
  };

  const handleRemoveNewCategory = (id: string) => {
    setCategorias(prev => prev.filter(cat => cat.id !== id));
    setEditingId(null);
    setEditingName('');
    setHasChanges(categorias.some(cat => cat.isNew && cat.id !== id));
  };

  const handleEditStart = (categoria: CategoriaMantenimiento) => {
    setEditingId(categoria.id);
    setEditingName(categoria.nombre);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleEditSave = (id: string) => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (editingName.length < 3 || editingName.length > 100) {
      toast({
        title: "Error", 
        description: "El nombre debe tener entre 3 y 100 caracteres",
        variant: "destructive"
      });
      return;
    }

    // Validar caracteres permitidos
    const validName = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(editingName);
    if (!validName) {
      toast({
        title: "Error",
        description: "El nombre solo puede contener letras, números y espacios",
        variant: "destructive"
      });
      return;
    }

    // Validar unicidad
    const normalizedNewName = editingName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const isDuplicate = categorias.some(cat => 
      cat.id !== id && 
      cat.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedNewName
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "Ya existe una categoría con ese nombre",
        variant: "destructive"
      });
      return;
    }

    setCategorias(prev => prev.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            nombre: editingName.trim(),
            ultimaActualizacion: new Date().toISOString().split('T')[0]
          }
        : cat
    ));
    
    setEditingId(null);
    setEditingName('');
    setHasChanges(true);
  };

  const handleToggleActive = (categoria: CategoriaMantenimiento) => {
    setConfirmDialog({
      open: true,
      type: categoria.activo ? 'deactivate' : 'activate',
      categoria
    });
  };

  const confirmToggleActive = () => {
    if (!confirmDialog.categoria) return;

    setCategorias(prev => prev.map(cat => 
      cat.id === confirmDialog.categoria!.id 
        ? { 
            ...cat, 
            activo: !cat.activo,
            ultimaActualizacion: new Date().toISOString().split('T')[0]
          }
        : cat
    ));

    setHasChanges(true);
    setConfirmDialog({ open: false, type: 'activate', categoria: null });
  };

  const handleSaveChanges = async () => {
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover isNew de las categorías nuevas y asignar IDs reales
      setCategorias(prev => prev.map(cat => {
        if (cat.isNew) {
          return {
            ...cat,
            id: `cat-${Date.now()}-${Math.random()}`,
            isNew: undefined
          };
        }
        return cat;
      }));

      setHasChanges(false);
      toast({
        title: "Éxito",
        description: "Cambios guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar los cambios",
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredCategorias.length)} de {filteredCategorias.length} categorías
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-2xl font-bold">Categorías de Mantenimiento de vehículos</h1>
          </div>
          
          {hasChanges && (
            <Button onClick={handleSaveChanges} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Guardar cambios</span>
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Filtros y Acciones */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Buscar por nombre</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar categoría..."
                    value={filters.nombre}
                    onChange={(e) => setFilters(prev => ({ ...prev, nombre: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select value={filters.estado} onValueChange={(value: any) => setFilters(prev => ({ ...prev, estado: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activos">Activos</SelectItem>
                    <SelectItem value="inactivos">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddCategory} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Agregar categoría</span>
              </Button>
            </div>

            {/* Tabla */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de creación</TableHead>
                    <TableHead>Última actualización</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategorias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCategorias.map((categoria) => (
                      <TableRow key={categoria.id}>
                        <TableCell>
                          {editingId === categoria.id ? (
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditSave(categoria.id);
                                if (e.key === 'Escape') handleEditCancel();
                              }}
                              autoFocus
                              placeholder="Nombre de la categoría"
                            />
                          ) : (
                            <span className={categoria.isNew && !categoria.nombre ? 'text-muted-foreground' : ''}>
                              {categoria.nombre || 'Nueva categoría'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={categoria.activo}
                              onCheckedChange={() => handleToggleActive(categoria)}
                              disabled={categoria.isNew && !categoria.nombre}
                            />
                            <span className={`text-sm ${categoria.activo ? 'text-green-600' : 'text-red-600'}`}>
                              {categoria.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{categoria.fechaCreacion}</TableCell>
                        <TableCell>{categoria.ultimaActualizacion}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingId === categoria.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleEditSave(categoria.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleEditCancel}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditStart(categoria)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {categoria.isNew && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveNewCategory(categoria.id)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            {renderPagination()}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'activate' ? 'Activar categoría' : 'Inactivar categoría'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'activate' 
                ? '¿Confirmas activar la categoría?' 
                : '¿Confirmas inactivar la categoría?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleActive}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CategoriasMantenimiento;