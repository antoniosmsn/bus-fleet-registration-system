import { Grid2X2, Grid3X3, LayoutGrid, Rows3, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type GridLayout = '1-column' | '2-columns' | '3-columns' | '2-rows' | 'sidebar-main' | 'header-content';

interface GridLayoutSelectorProps {
  currentLayout: GridLayout;
  onLayoutChange: (layout: GridLayout) => void;
}

const layoutOptions = [
  {
    id: '1-column' as GridLayout,
    name: '1 Columna',
    icon: Rows3,
    description: 'Una sola columna',
    gridTemplate: 'grid-cols-1',
    preview: 'w-full h-8 bg-muted rounded'
  },
  {
    id: '2-columns' as GridLayout,
    name: '2 Columnas',
    icon: Grid2X2,
    description: 'Dos columnas iguales',
    gridTemplate: 'grid-cols-2',
    preview: 'grid grid-cols-2 gap-1 w-full h-8'
  },
  {
    id: '3-columns' as GridLayout,
    name: '3 Columnas',
    icon: Grid3X3,
    description: 'Tres columnas iguales',
    gridTemplate: 'grid-cols-3',
    preview: 'grid grid-cols-3 gap-1 w-full h-8'
  },
  {
    id: 'sidebar-main' as GridLayout,
    name: 'Sidebar + Principal',
    icon: Columns3,
    description: 'Sidebar izquierdo + contenido principal',
    gridTemplate: 'grid-cols-3',
    preview: 'grid grid-cols-3 gap-1 w-full h-8'
  },
  {
    id: 'header-content' as GridLayout,
    name: 'Encabezado + Contenido',
    icon: LayoutGrid,
    description: 'Encabezado arriba + contenido abajo',
    gridTemplate: 'grid-rows-2',
    preview: 'grid grid-rows-2 gap-1 w-full h-8'
  }
];

export function GridLayoutSelector({ currentLayout, onLayoutChange }: GridLayoutSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Diseño de Sección</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {layoutOptions.map((option) => {
          const isActive = currentLayout === option.id;
          const Icon = option.icon;
          
          return (
            <Card 
              key={option.id}
              className={`relative cursor-pointer transition-all hover:shadow-md ${
                isActive ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => onLayoutChange(option.id)}
            >
              <div className="p-3 space-y-2">
                {isActive && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 px-1 text-xs">
                    Activo
                  </Badge>
                )}
                
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{option.name}</span>
                </div>
                
                <div className="h-8 w-full">
                  {option.id === '1-column' && (
                    <div className="w-full h-full bg-muted rounded" />
                  )}
                  {(option.id === '2-columns' || option.id === 'sidebar-main') && (
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className={`bg-muted rounded ${option.id === 'sidebar-main' ? 'col-span-1' : 'col-span-1'}`} />
                      <div className={`bg-muted rounded ${option.id === 'sidebar-main' ? 'col-span-2' : 'col-span-1'}`} />
                      {option.id === '2-columns' && <div className="bg-muted rounded col-span-1" />}
                    </div>
                  )}
                  {option.id === '3-columns' && (
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className="bg-muted rounded" />
                      <div className="bg-muted rounded" />
                      <div className="bg-muted rounded" />
                    </div>
                  )}
                  {option.id === 'header-content' && (
                    <div className="grid grid-rows-2 gap-1 h-full">
                      <div className="bg-muted rounded" />
                      <div className="bg-muted rounded" />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}