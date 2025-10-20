import { RespuestaSondeo } from '@/types/sondeo-ruta';

// Función auxiliar para generar respuestas
const generarRespuestasAleatorias = (
  sondeoId: string,
  questionId: string,
  opciones: string[],
  numRespuestas: number,
  distribucion: number[]
): (RespuestaSondeo & { sondeoId: string })[] => {
  const respuestas: (RespuestaSondeo & { sondeoId: string })[] = [];
  let pasajeroIndex = 1;
  
  opciones.forEach((opcionId, index) => {
    const cantidad = Math.floor(numRespuestas * distribucion[index]);
    for (let i = 0; i < cantidad; i++) {
      respuestas.push({
        sondeoId,
        questionId,
        optionId: opcionId,
        pasajeroId: `pas${sondeoId}_${pasajeroIndex}`,
        fechaRespuesta: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      pasajeroIndex++;
    }
  });
  
  return respuestas;
};

export const mockRespuestasSondeos: (RespuestaSondeo & { sondeoId: string })[] = [
  // Sondeo 1: Ruta San José - Cartago Express (50 respuestas)
  ...generarRespuestasAleatorias('1', 'p1', ['o1', 'o2'], 50, [0.82, 0.18]), // 82% Sí, 18% No
  ...generarRespuestasAleatorias('1', 'p2', ['o3', 'o4', 'o5', 'o6'], 41, [0.45, 0.30, 0.15, 0.10]),
  ...generarRespuestasAleatorias('1', 'p3', ['o7', 'o8', 'o9', 'o10'], 41, [0.15, 0.40, 0.30, 0.15]),
  ...generarRespuestasAleatorias('1', 'p4', ['o11', 'o12', 'o13', 'o14'], 41, [0.60, 0.20, 0.10, 0.10]),

  // Sondeo 2: Circuito Zona Franca El Coyol (35 respuestas)
  ...generarRespuestasAleatorias('2', 'p3', ['o7', 'o8'], 35, [0.71, 0.29]),
  ...generarRespuestasAleatorias('2', 'p4', ['o9', 'o10', 'o11'], 25, [0.48, 0.32, 0.20]),

  // Sondeo 3: Ruta Nocturna (20 respuestas)
  ...generarRespuestasAleatorias('3', 'p5', ['o12', 'o13'], 20, [0.65, 0.35]),

  // Sondeo 4: Ruta Aeropuerto (60 respuestas)
  ...generarRespuestasAleatorias('4', 'p6', ['o14', 'o15'], 60, [0.88, 0.12]),

  // Sondeo 5: Circuito Urbano (40 respuestas)
  ...generarRespuestasAleatorias('5', 'p7', ['o16', 'o17'], 40, [0.75, 0.25]),

  // Sondeo 6: Ruta Estudiantes (55 respuestas)
  ...generarRespuestasAleatorias('6', 'p8', ['o18', 'o19'], 55, [0.85, 0.15]),

  // Sondeo 7: Zonas Industriales (70 respuestas)
  ...generarRespuestasAleatorias('7', 'p9', ['o20', 'o21'], 70, [0.90, 0.10]),

  // Sondeo 8: Ruta Ecológica (30 respuestas)
  ...generarRespuestasAleatorias('8', 'p10', ['o22', 'o23'], 30, [0.67, 0.33]),

  // Sondeo 9: Hospitales (45 respuestas)
  ...generarRespuestasAleatorias('9', 'p11', ['o24', 'o25'], 45, [0.78, 0.22]),

  // Sondeo 10: Centros Comerciales (50 respuestas)
  ...generarRespuestasAleatorias('10', 'p12', ['o26', 'o27'], 50, [0.80, 0.20]),

  // Sondeo 11: Turística (25 respuestas)
  ...generarRespuestasAleatorias('11', 'p13', ['o28', 'o29'], 25, [0.72, 0.28]),

  // Sondeo 12: Nocturna Seguridad (28 respuestas)
  ...generarRespuestasAleatorias('12', 'p14', ['o30', 'o31'], 28, [0.68, 0.32]),

  // Sondeo 13: Terminal Bus (58 respuestas)
  ...generarRespuestasAleatorias('13', 'p15', ['o32', 'o33'], 58, [0.86, 0.14]),

  // Sondeo 14: Residencial Norte (65 respuestas)
  ...generarRespuestasAleatorias('14', 'p16', ['o34', 'o35'], 65, [0.83, 0.17]),

  // Sondeo 15: Deportiva Estadios (40 respuestas con 4 preguntas)
  ...generarRespuestasAleatorias('15', 'p17', ['o36', 'o37'], 40, [0.70, 0.30]),
  ...generarRespuestasAleatorias('15', 'p17a', ['o37a', 'o37b', 'o37c'], 28, [0.25, 0.45, 0.30]),
  ...generarRespuestasAleatorias('15', 'p17b', ['o37d', 'o37e', 'o37f', 'o37g'], 28, [0.50, 0.20, 0.20, 0.10]),
  ...generarRespuestasAleatorias('15', 'p17c', ['o37h', 'o37i', 'o37j'], 28, [0.15, 0.50, 0.35]),

  // Sondeo 16: Escolar (48 respuestas)
  ...generarRespuestasAleatorias('16', 'p18', ['o38', 'o39'], 48, [0.81, 0.19]),

  // Sondeo 17: Playera (35 respuestas)
  ...generarRespuestasAleatorias('17', 'p19', ['o40', 'o41'], 35, [0.74, 0.26]),

  // Sondeo 18: Cultural Museos (32 respuestas)
  ...generarRespuestasAleatorias('18', 'p20', ['o42', 'o43'], 32, [0.69, 0.31]),

  // Sondeo 19: Parque Tecnológico (62 respuestas)
  ...generarRespuestasAleatorias('19', 'p21', ['o44', 'o45'], 62, [0.87, 0.13]),

  // Sondeo 20: Mercados (42 respuestas)
  ...generarRespuestasAleatorias('20', 'p22', ['o46', 'o47'], 42, [0.76, 0.24]),
];
