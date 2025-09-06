import { ElementoToolbox } from '@/types/plantilla-matriz';

export const mockToolboxElementos: ElementoToolbox[] = [
  {
    id: 'texto',
    tipo: 'texto',
    icono: 'Type',
    nombre: 'Caja de Texto',
    descripcion: 'Campo de texto libre para observaciones y comentarios'
  },
  {
    id: 'select',
    tipo: 'select',
    icono: 'ChevronDown',
    nombre: 'Lista de Selección',
    descripcion: 'Selección única o múltiple entre opciones predefinidas'
  },
  {
    id: 'checkbox',
    tipo: 'checkbox',
    icono: 'Square',
    nombre: 'Casilla de Verificación',
    descripcion: 'Opción de sí/no para verificaciones'
  },
  {
    id: 'radio',
    tipo: 'radio',
    icono: 'Circle',
    nombre: 'Botones de Radio',
    descripcion: 'Selección única con opciones visibles'
  },
  {
    id: 'canvas',
    tipo: 'canvas',
    icono: 'Pen',
    nombre: 'Canvas de Dibujo',
    descripcion: 'Área para dibujar o firmar sobre imagen base'
  },
  {
    id: 'fecha',
    tipo: 'fecha',
    icono: 'Calendar',
    nombre: 'Selector de Fecha',
    descripcion: 'Campo para seleccionar fechas específicas'
  }
];