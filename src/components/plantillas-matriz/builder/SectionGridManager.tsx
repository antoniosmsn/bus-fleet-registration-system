import { GridLayout } from './GridLayoutSelector';
import { GridArea } from './GridArea';
import { CampoBuilder } from '@/types/plantilla-matriz';

interface SectionGridManagerProps {
  layout: GridLayout;
  campos: CampoBuilder[];
  onAddField: (tipoElemento: string, areaId?: string) => void;
  onUpdateCampo: (campoId: string, updates: Partial<CampoBuilder>) => void;
  onDeleteCampo: (campoId: string) => void;
  onDuplicateCampo: (campoId: string) => void;
  isDragDisabled?: boolean;
}

interface GridAreaConfig {
  id: string;
  name: string;
  className: string;
}

const getGridAreas = (layout: GridLayout): GridAreaConfig[] => {
  switch (layout) {
    case '1-column':
      return [
        { id: 'main', name: 'Contenido Principal', className: 'col-span-1' }
      ];
    
    case '2-columns':
      return [
        { id: 'left', name: 'Columna Izquierda', className: 'col-span-1' },
        { id: 'right', name: 'Columna Derecha', className: 'col-span-1' }
      ];
    
    case '3-columns':
      return [
        { id: 'left', name: 'Izquierda', className: 'col-span-1' },
        { id: 'center', name: 'Centro', className: 'col-span-1' },
        { id: 'right', name: 'Derecha', className: 'col-span-1' }
      ];
    
    case 'sidebar-main':
      return [
        { id: 'sidebar', name: 'Sidebar', className: 'col-span-1' },
        { id: 'main', name: 'Contenido Principal', className: 'col-span-2' }
      ];
    
    case 'header-content':
      return [
        { id: 'header', name: 'Encabezado', className: 'col-span-full row-span-1' },
        { id: 'content', name: 'Contenido', className: 'col-span-full row-span-1' }
      ];
    
    default:
      return [
        { id: 'main', name: 'Contenido Principal', className: 'col-span-1' }
      ];
  }
};

const getGridContainerClass = (layout: GridLayout): string => {
  switch (layout) {
    case '1-column':
      return 'grid grid-cols-1 gap-4';
    case '2-columns':
      return 'grid grid-cols-2 gap-4';
    case '3-columns':
      return 'grid grid-cols-3 gap-4';
    case 'sidebar-main':
      return 'grid grid-cols-3 gap-4';
    case 'header-content':
      return 'grid grid-cols-1 grid-rows-2 gap-4';
    default:
      return 'grid grid-cols-1 gap-4';
  }
};

export function SectionGridManager({
  layout,
  campos,
  onAddField,
  onUpdateCampo,
  onDeleteCampo,
  onDuplicateCampo,
  isDragDisabled = false
}: SectionGridManagerProps) {
  const areas = getGridAreas(layout);
  const containerClass = getGridContainerClass(layout);

  // Organizar campos por área (por ahora, todos van al área 'main' si no tienen areaId)
  const camposPorArea = campos.reduce((acc, campo) => {
    const areaId = (campo as any).areaId || 'main';
    if (!acc[areaId]) acc[areaId] = [];
    acc[areaId].push(campo);
    return acc;
  }, {} as Record<string, CampoBuilder[]>);

  return (
    <div className={containerClass}>
      {areas.map((area) => (
        <GridArea
          key={area.id}
          areaId={area.id}
          areaName={area.name}
          campos={camposPorArea[area.id] || []}
          onAddField={(tipoElemento) => onAddField(tipoElemento, area.id)}
          onUpdateCampo={onUpdateCampo}
          onDeleteCampo={onDeleteCampo}
          onDuplicateCampo={onDuplicateCampo}
          className={area.className}
          isDragDisabled={isDragDisabled}
        />
      ))}
    </div>
  );
}