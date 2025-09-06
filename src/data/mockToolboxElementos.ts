import { ElementoToolbox } from '@/types/plantilla-matriz';

export const mockToolboxElementos: ElementoToolbox[] = [
  {
    id: 'texto',
    tipo: 'texto',
    icono: 'Type',
    nombre: 'Texto',
    descripcion: 'Campo de texto libre para observaciones'
  },
  {
    id: 'checkbox',
    tipo: 'checkbox',
    icono: 'Square',
    nombre: 'Casilla de verificación',
    descripcion: 'Opción de sí/no para verificaciones'
  },
  {
    id: 'select',
    tipo: 'select',
    icono: 'ChevronDown',
    nombre: 'Lista desplegable',
    descripcion: 'Selección única entre múltiples opciones'
  },
  {
    id: 'radio',
    tipo: 'radio',
    icono: 'Circle',
    nombre: 'Botones de radio',
    descripcion: 'Selección única con opciones visibles'
  },
  {
    id: 'fecha',
    tipo: 'fecha',
    icono: 'Calendar',
    nombre: 'Fecha',
    descripcion: 'Selector de fecha'
  },
  {
    id: 'canvas',
    tipo: 'canvas',
    icono: 'Pen',
    nombre: 'Canvas de dibujo',
    descripcion: 'Área para dibujar o firmar sobre imagen'
  }
];