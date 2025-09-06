import { InspeccionAutobus } from '@/types/inspeccion-autobus';
import { mockConductores } from '@/data/mockConductores';
import { mockAutobuses } from '@/data/mockAutobuses';
import { mockTransportistas } from '@/data/mockTransportistas';

// Función helper para generar fechas dinámicas
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getRandomDateInRange = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

// Función helper para generar hora aleatoria en formato ISO
const getRandomTimeInRange = (fecha: string, horaInicio: number = 6, horaFin: number = 22): string => {
  const hora = horaInicio + Math.floor(Math.random() * (horaFin - horaInicio));
  const minuto = Math.floor(Math.random() * 60);
  return `${fecha}T${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:00Z`;
};

// Usuarios del sistema para responsables
const usuariosResponsables = [
  'admin@sistema.com',
  'inspector.martinez@sistema.com',
  'supervisor.lopez@sistema.com',
  'jefe.mantenimiento@sistema.com',
  'inspector.rodriguez@sistema.com',
  'coordinador.flota@sistema.com'
];

export const mockInspeccionesAutobus: InspeccionAutobus[] = [
  // Generar inspecciones con fecha de hoy (20 registros)
  ...Array.from({ length: 20 }, (_, i) => {
    const fechaHoy = getTodayDate();
    const autobus = mockAutobuses[i % mockAutobuses.length];
    const conductor = mockConductores.find(c => c.empresaTransporteId === autobus.transportistaId) || mockConductores[i % mockConductores.length];
    const transportista = mockTransportistas.find(t => t.id === autobus.transportistaId) || mockTransportistas[i % mockTransportistas.length];
    const responsableUsuario = usuariosResponsables[i % usuariosResponsables.length];
    
    return {
      id: `insp${i + 1}`,
      consecutivo: 2024001 + i,
      fechaInspeccion: fechaHoy,
      placa: autobus.placa,
      conductor: {
        id: conductor.id,
        nombre: conductor.nombre,
        apellidos: conductor.apellidos,
        codigo: conductor.codigo
      },
      transportista: {
        id: transportista.id,
        nombre: transportista.nombre,
        codigo: transportista.codigo
      },
      plantilla: {
        id: `${(i % 3) + 1}`,
        nombre: ['Inspección General Diaria', 'Inspección Pre-viaje', 'Inspección Técnica Detallada'][i % 3]
      },
      kilometros: 45000 + (i * 1500) + Math.floor(Math.random() * 5000),
      respuestas: [
        {
          seccionId: 'motor_sistema',
          respuestas: [
            { campoId: 'estado_motor', valor: Math.random() > 0.15, puntuacion: Math.random() > 0.15 ? 10 : 0 },
            { campoId: 'aceite_motor', valor: ['Excelente', 'Bueno', 'Regular', 'Necesita cambio'][Math.floor(Math.random() * 4)], puntuacion: [10, 8, 6, 3][Math.floor(Math.random() * 4)] },
            { campoId: 'liquido_frenos', valor: Math.random() > 0.1, puntuacion: Math.random() > 0.1 ? 10 : 0 }
          ],
          puntuacionSeccion: Math.floor(Math.random() * 15) + 20
        },
        {
          seccionId: 'carroceria_exterior',
          respuestas: [
            { campoId: 'estado_llantas', valor: ['Excelente', 'Bueno', 'Regular'][Math.floor(Math.random() * 3)], puntuacion: [10, 7, 4][Math.floor(Math.random() * 3)] },
            { campoId: 'luces_funcionales', valor: Math.random() > 0.05, puntuacion: Math.random() > 0.05 ? 15 : 0 },
            { campoId: 'carroceria_estado', valor: Math.random() > 0.2, puntuacion: Math.random() > 0.2 ? 10 : 2 }
          ],
          puntuacionSeccion: Math.floor(Math.random() * 20) + 15
        }
      ],
      calificacionFinal: Math.floor(Math.random() * 20) + 80, // Calificaciones más altas para hoy
      estado: Math.random() > 0.05 ? 'completada' : 'pendiente' as 'completada' | 'pendiente',
      pdfUrl: Math.random() > 0.02 ? `storage/inspecciones/insp${i + 1}.pdf` : undefined,
      fechaCreacion: getRandomTimeInRange(fechaHoy, 6, 22),
      usuarioCreacion: responsableUsuario,
      observaciones: i % 5 === 0 ? `Inspección rutinaria ${fechaHoy}. Todo en orden según protocolo.` : undefined
    };
  }),
  
  // Generar inspecciones con fechas variadas (últimos 30 días - 25 registros)
  ...Array.from({ length: 25 }, (_, i) => {
    const fechaAleatoria = getRandomDateInRange(30);
    const autobus = mockAutobuses[(i + 20) % mockAutobuses.length];
    const conductor = mockConductores.find(c => c.empresaTransporteId === autobus.transportistaId) || mockConductores[(i + 20) % mockConductores.length];
    const transportista = mockTransportistas.find(t => t.id === autobus.transportistaId) || mockTransportistas[(i + 20) % mockTransportistas.length];
    const responsableUsuario = usuariosResponsables[(i + 20) % usuariosResponsables.length];
    
    return {
      id: `insp${i + 21}`,
      consecutivo: 2024021 + i,
      fechaInspeccion: fechaAleatoria,
      placa: autobus.placa,
      conductor: {
        id: conductor.id,
        nombre: conductor.nombre,
        apellidos: conductor.apellidos,
        codigo: conductor.codigo
      },
      transportista: {
        id: transportista.id,
        nombre: transportista.nombre,
        codigo: transportista.codigo
      },
      plantilla: {
        id: `${(i % 3) + 1}`,
        nombre: ['Inspección General Diaria', 'Inspección Pre-viaje', 'Inspección Técnica Detallada'][i % 3]
      },
      kilometros: 35000 + (i * 2000) + Math.floor(Math.random() * 8000),
      respuestas: [
        {
          seccionId: 'motor_sistema',
          respuestas: [
            { campoId: 'estado_motor', valor: Math.random() > 0.25, puntuacion: Math.random() > 0.25 ? 8 : 0 },
            { campoId: 'aceite_motor', valor: ['Excelente', 'Bueno', 'Regular', 'Necesita cambio'][Math.floor(Math.random() * 4)], puntuacion: [10, 8, 5, 2][Math.floor(Math.random() * 4)] },
            { campoId: 'sistema_frenos', valor: Math.random() > 0.15, puntuacion: Math.random() > 0.15 ? 12 : 3 }
          ],
          puntuacionSeccion: Math.floor(Math.random() * 20) + 15
        },
        {
          seccionId: 'interior_seguridad',
          respuestas: [
            { campoId: 'asientos_estado', valor: Math.random() > 0.1, puntuacion: Math.random() > 0.1 ? 8 : 2 },
            { campoId: 'extintor_presente', valor: Math.random() > 0.05, puntuacion: Math.random() > 0.05 ? 15 : 0 },
            { campoId: 'botiquin_completo', valor: Math.random() > 0.1, puntuacion: Math.random() > 0.1 ? 10 : 0 }
          ],
          puntuacionSeccion: Math.floor(Math.random() * 18) + 12
        }
      ],
      calificacionFinal: Math.floor(Math.random() * 35) + 65, // Calificaciones más variadas para fechas pasadas
      estado: (Math.random() > 0.08 ? 'completada' : 'pendiente') as 'completada' | 'pendiente',
      pdfUrl: Math.random() > 0.05 ? `storage/inspecciones/insp${i + 21}.pdf` : undefined,
      fechaCreacion: getRandomTimeInRange(fechaAleatoria, 6, 20),
      usuarioCreacion: responsableUsuario,
      observaciones: i % 4 === 0 ? `Inspección ${fechaAleatoria}. ${Math.random() > 0.5 ? 'Revisión completa sin novedades.' : 'Se requiere seguimiento en próxima inspección.'}` : undefined
    };
  }),

  // Generar inspecciones adicionales para pruebas específicas (10 registros)
  ...Array.from({ length: 10 }, (_, i) => {
    const fechaReciente = getRandomDateInRange(7); // Última semana
    const autobus = mockAutobuses[(i + 45) % mockAutobuses.length];
    const conductor = mockConductores.find(c => c.empresaTransporteId === autobus.transportistaId) || mockConductores[(i + 45) % mockConductores.length];
    const transportista = mockTransportistas.find(t => t.id === autobus.transportistaId) || mockTransportistas[(i + 45) % mockTransportistas.length];
    const responsableUsuario = usuariosResponsables[(i + 45) % usuariosResponsables.length];
    
    return {
      id: `insp${i + 46}`,
      consecutivo: 2024046 + i,
      fechaInspeccion: fechaReciente,
      placa: autobus.placa,
      conductor: {
        id: conductor.id,
        nombre: conductor.nombre,
        apellidos: conductor.apellidos,
        codigo: conductor.codigo
      },
      transportista: {
        id: transportista.id,
        nombre: transportista.nombre,
        codigo: transportista.codigo
      },
      plantilla: {
        id: `${(i % 3) + 1}`,
        nombre: ['Inspección General Diaria', 'Inspección Pre-viaje', 'Inspección Técnica Detallada'][i % 3]
      },
      kilometros: 28000 + (i * 3500) + Math.floor(Math.random() * 12000),
      respuestas: [
        {
          seccionId: 'revision_general',
          respuestas: [
            { campoId: 'documentacion_completa', valor: Math.random() > 0.02, puntuacion: Math.random() > 0.02 ? 15 : 0 },
            { campoId: 'revision_mecanica', valor: ['Aprobada', 'Aprobada con observaciones', 'Requiere atención'][Math.floor(Math.random() * 3)], puntuacion: [15, 10, 5][Math.floor(Math.random() * 3)] }
          ],
          puntuacionSeccion: Math.floor(Math.random() * 25) + 10
        }
      ],
      calificacionFinal: Math.floor(Math.random() * 25) + 75,
      estado: 'completada' as 'completada' | 'pendiente', // Todas completadas para pruebas
      pdfUrl: `storage/inspecciones/insp${i + 46}.pdf`,
      fechaCreacion: getRandomTimeInRange(fechaReciente, 7, 19),
      usuarioCreacion: responsableUsuario,
      observaciones: `Inspección especial ${fechaReciente}. Verificación detallada completada.`
    };
  })
];

// Función helper para obtener la inspección por ID
export const getInspeccionById = (id: string): InspeccionAutobus | null => {
  return mockInspeccionesAutobus.find(inspeccion => inspeccion.id === id) || null;
};

// Función helper para obtener inspecciones por placa
export const getInspeccionesByPlaca = (placa: string): InspeccionAutobus[] => {
  return mockInspeccionesAutobus.filter(inspeccion => 
    inspeccion.placa.toLowerCase().includes(placa.toLowerCase())
  );
};

// Función helper para obtener el siguiente consecutivo
export const getNextConsecutivo = (): number => {
  const maxConsecutivo = Math.max(...mockInspeccionesAutobus.map(i => i.consecutivo));
  return maxConsecutivo + 1;
};

// Función helper para obtener inspecciones por fecha
export const getInspeccionesByFecha = (fecha: string): InspeccionAutobus[] => {
  return mockInspeccionesAutobus.filter(inspeccion => inspeccion.fechaInspeccion === fecha);
};