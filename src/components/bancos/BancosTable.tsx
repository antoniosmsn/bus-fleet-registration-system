import { Banco, BancoFilter } from '@/types/banco';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface BancosTableProps {
  bancos: Banco[];
  filtros: BancoFilter;
  loading?: boolean;
  onToggleEstado: (banco: Banco) => void;
  onEdit: (banco: Banco) => void;
}

export function BancosTable({ 
  bancos, 
  filtros, 
  loading = false,
  onToggleEstado,
  onEdit
}: BancosTableProps) {

  const highlightText = (text: string, search?: string) => {
    if (!search || search.length < 2) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bancos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron bancos</h3>
        <p className="text-muted-foreground">
          No hay bancos que coincidan con los criterios de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
          <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
        </div>

        {/* Rows */}
        <div className="space-y-0">
          {bancos.map((banco, index) => (
            <div 
              key={banco.id} 
              className={`flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                index < bancos.length - 1 ? 'border-b border-border' : ''
              }`}
              onClick={() => onEdit(banco)}
            >
              <div className="flex-1">
                <span className="text-foreground font-medium">
                  {highlightText(banco.nombre, filtros.nombre)}
                </span>
              </div>
              
              <div 
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge 
                  variant={banco.activo ? "default" : "secondary"}
                  className="text-xs"
                >
                  {banco.activo ? 'Activo' : 'Inactivo'}
                </Badge>
                <Switch
                  checked={banco.activo}
                  onCheckedChange={() => onToggleEstado(banco)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}