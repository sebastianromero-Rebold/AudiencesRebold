/**
 * data.js — Base de conocimiento de audiencias (Audiences Rebold)
 *
 * Este archivo reemplaza, por ahora, una conexión en vivo a la API de GWI.
 * Cada "caso" fue construido con la MISMA metodología que usa GWI (universo
 * digital de un mercado -> embudo de filtros sucesivos -> personas finales
 * mutuamente excluyentes), para que el motor de cálculo (ver app.js) sea
 * el mismo que se usaría con datos reales.
 *
 * MARCADO DE FUENTE:
 *   source: "gwi-real"   -> números tomados 1:1 de un estudio GWI real de Rebold
 *                            (caso Silvestre Dangond CDMX).
 *   source: "plantilla"  -> estructura de ejemplo con cifras ilustrativas,
 *                            pensada para ser reemplazada por una consulta
 *                            real a GWI antes de usarse en un plan de medios.
 *
 * Para conectar GWI real: reemplazar CATEGORIES[].cases por el resultado de
 * tu propio backend/proxy (ver README "Conectar datos reales de GWI").
 */

const MARKETS = [
  { id: "COL", name: "Colombia", flag: "🇨🇴", digitalPop: 31060000 },
  { id: "MEX", name: "México", flag: "🇲🇽", digitalPop: 78050000 },
  { id: "ESP", name: "España", flag: "🇪🇸", digitalPop: 38200000 },
  { id: "ITA", name: "Italia", flag: "🇮🇹", digitalPop: 49500000 },
  { id: "CHL", name: "Chile", flag: "🇨🇱", digitalPop: 15600000 },
  { id: "PER", name: "Perú", flag: "🇵🇪", digitalPop: 24300000 },
];

const AGE_BANDS = ["16-24", "25-34", "35-44", "45-54", "55-64", "65+"];

// ---------------------------------------------------------------------------
// CASO 1 — ENTRETENIMIENTO EN VIVO (dato real GWI: Silvestre Dangond, CDMX)
// ---------------------------------------------------------------------------

const CASE_DANGOND = {
  id: "conciertos-artista-latam-en-mexico",
  name: "Artista colombiano en concierto en México (CDMX)",
  market: "COL",
  source: "gwi-real",
  sourceLabel: "Caso real GWI — Rebold (Silvestre Dangond & Carlos Vives, CDMX)",
  insightNote:
    "Identificando sus momentos de vida, poder adquisitivo y cercanía al momento del concierto, alineado a los eventos culturales de la ciudad.",
  funnelSteps: [
    { label: "Interesados en Turismo", pct: 52 },
    { label: "Viajan internacionalmente al menos 1 vez al año o más", pct: 32 },
    { label: "Interés en el Mundial de Fútbol y gusto por música Vallenata y Latina", pct: 39 },
  ],
  footnotes: [
    "Extrapolado a Total Colombia, según DANE.",
    "Las audiencias finales son excluyentes entre ellas.",
  ],
  personas: [
    {
      id: "hincha-premium",
      name: "Juan Carlos Corredor",
      archetype: "El Hincha Premium",
      quote:
        "No todos los días estoy fuera del país viendo fútbol… si además puedo vivir Colombia con música en vivo, el viaje se vuelve completo.",
      description:
        "Viaja a México como parte de una experiencia integral: fútbol, turismo y estatus. El concierto no es el plan principal, pero sí un complemento aspiracional que convierte el viaje en algo más memorable.",
      sharePct: 60,
      demographics: {
        genderSplit: { male: 60, female: 40 },
        ageBands: [
          { label: "16-24", pct: 9 },
          { label: "25-34", pct: 28 },
          { label: "35-44", pct: 34 },
          { label: "45-54", pct: 16 },
          { label: "55-64", pct: 9 },
          { label: "65+", pct: 4 },
        ],
        topCities: [
          { city: "Bogotá", pct: 45 },
          { city: "Medellín", pct: 14 },
          { city: "Barranquilla", pct: 13 },
          { city: "Cali", pct: 13 },
          { city: "Cartagena", pct: 9 },
          { city: "Bucaramanga", pct: 4 },
        ],
      },
      motivations: [
        { label: "Experiencia completa (fútbol + entretenimiento)", pct: 78 },
        { label: "Afinidad emocional con artistas colombianos", pct: 65 },
        { label: "Planes exclusivos / premium en el exterior", pct: 54 },
        { label: "Social currency (contenido, estatus)", pct: 47 },
      ],
      barriers: [
        { label: "Saturación de planes durante el viaje", pct: 62 },
        { label: "Precio alto vs. otros gastos del viaje", pct: 55 },
        { label: "Falta de awareness previo al viaje", pct: 48 },
        { label: "Logística (distancias, transporte)", pct: 35 },
      ],
      digitalInterests: [
        { label: "Portales de turismo para compra de planes de viaje", index: 165 },
        { label: "Recomendaciones / validación de lugares", index: 187 },
        { label: "All inclusive", index: 195 },
      ],
      media: [
        { label: "Instagram", pct: 81 },
        { label: "Facebook", pct: 80 },
        { label: "TikTok", pct: 68 },
        { label: "Display", pct: 96 },
        { label: "Video Online", pct: 90 },
        { label: "Retail / Conveniencia", pct: 88 },
        { label: "Streaming TV", pct: 89 },
        { label: "Apps nuevas", pct: 81 },
      ],
      journey: [
        {
          block: "Inicio de la mañana",
          time: "6 a 9 am",
          lugar: "Transporte (carro, Uber, taxi)",
          medios: "Google, Instagram, buscadores",
          vehiculo: "Google Search Ads, Gmail, Waze",
          activacion: "Promoted pin del Estadio GNP + CTA en contenidos de México.",
          activities: [],
        },
        {
          block: "Final de la mañana",
          time: "9 a 12 m",
          lugar: "Hotel, casa",
          medios: "Redes / apps de viaje / WhatsApp",
          vehiculo: "Meta, TikTok, Google Display y YouTube",
          activacion:
            "Clips de Silvestre + Vives en vivo, público cantando (emocional + aspiracional).",
          activities: [
            { label: "Retail", pct: 12, index: 115 },
            { label: "Revisando redes", pct: 19, index: 114 },
          ],
        },
        {
          block: "Medio día",
          time: "12 m a 3 pm",
          lugar: "Oficina (casa) / restaurantes",
          medios: "Redes + conversaciones",
          vehiculo: "Instagram, WhatsApp, influencers colombianos en CDMX",
          activacion: "Recomendación directa, mostrar ambiente colombiano.",
          activities: [
            { label: "Viendo videos", pct: 18, index: 118 },
            { label: "Revisando redes", pct: 23, index: 154 },
          ],
        },
        {
          block: "La tarde",
          time: "3 a 6 pm",
          lugar: "Trabajo",
          medios: "Navegación / búsqueda",
          vehiculo: "Google / medios digitales",
          activacion:
            "Retargeting a quienes buscaron vuelos a CDMX o eventos/conciertos; search + pauta con beneficios claros; CTA directo a venta (FOMO).",
          activities: [
            { label: "Revisando redes", pct: 24, index: 135 },
            { label: "Influencers", pct: 34, index: 111 },
            { label: "WhatsApp — grupos futuros viajeros", pct: 24, index: 121 },
            { label: "Escuchando radio o streaming", pct: 13, index: 134 },
            { label: "Investigando planes de viaje", pct: 26, index: 134 },
          ],
        },
        {
          block: "Fin de la tarde",
          time: "6 a 8 pm",
          lugar: "Casa / cama",
          medios: "Redes + mobile",
          vehiculo: "Instagram / links directos",
          activacion: "Gente cantando vallenato, ambiente tipo concierto.",
          activities: [],
        },
        {
          block: "Noche",
          time: "8 a 11 pm",
          lugar: "Casa / carro / gimnasio / bares",
          medios: "Redes, Google y WhatsApp",
          vehiculo: "Performance Ads (conversión directa), retargeting dinámico y DOOH en bares",
          activacion: "\"Últimas entradas\" + \"Zonas VIP disponibles\".",
          activities: [
            { label: "Investigando planes y compras en apps y redes", pct: 15, index: 123 },
            { label: "Revisando redes", pct: 38, index: 132 },
            { label: "Viendo TV / streaming", pct: 24, index: 109 },
            { label: "Actividades recreativas en bares", pct: 14, index: 121 },
          ],
        },
      ],
    },
    {
      id: "colombiano-nostalgico",
      name: "Luisa Benavides",
      archetype: 'El Colombiano "Nostálgico"',
      quote: "Vivir lejos hace que cualquier pedazo de Colombia se sienta más intenso.",
      description:
        "Ve el concierto como un reencuentro emocional con su cultura. Es más que entretenimiento: es identidad, pertenencia y comunidad.",
      sharePct: 40,
      demographics: {
        genderSplit: { male: 40, female: 60 },
        ageBands: [
          { label: "16-24", pct: 11 },
          { label: "25-34", pct: 31 },
          { label: "35-44", pct: 29 },
          { label: "45-54", pct: 17 },
          { label: "55-64", pct: 8 },
          { label: "65+", pct: 4 },
        ],
        topCities: [
          { city: "Bogotá", pct: 42 },
          { city: "Medellín", pct: 15 },
          { city: "Cali", pct: 13 },
          { city: "Barranquilla", pct: 12 },
          { city: "Cartagena", pct: 10 },
          { city: "Bucaramanga", pct: 8 },
        ],
      },
      motivations: [
        { label: "Conexión emocional con Colombia", pct: 82 },
        { label: "Nostalgia / identidad cultural", pct: 76 },
        { label: "Ver artistas difíciles de ver en México", pct: 63 },
        { label: "Plan social con comunidad colombiana", pct: 58 },
      ],
      barriers: [
        { label: "Precio (comparado con oferta local)", pct: 52 },
        { label: "Falta de urgencia si no se comunica bien", pct: 47 },
        { label: "Competencia con otros planes en CDMX", pct: 41 },
        { label: "Lejanía / logística", pct: 28 },
      ],
      digitalInterests: [
        { label: "Relaciones o networking en México", index: 212 },
        { label: "Blogs de opinión donde puede opinar y ser escuchada", index: 171 },
        { label: "Contenidos con CTA directo", index: 165 },
      ],
      media: [
        { label: "Instagram", pct: 82 },
        { label: "Facebook", pct: 76 },
        { label: "TikTok", pct: 80 },
        { label: "Search / Explorador", pct: 98 },
        { label: "Programmatic", pct: 97 },
        { label: "Grupos de colombianos", pct: 79 },
      ],
      journey: [
        {
          block: "Inicio de la mañana",
          time: "6 a 9 am",
          lugar: "Oficina / coworking / universidad",
          medios: "LinkedIn / navegación web / YouTube",
          vehiculo: "YouTube / TikTok / Display",
          activacion:
            'Anuncios y clips de artistas identificados: "CDMX se vuelve Colombia por una noche".',
          activities: [],
        },
        {
          block: "Final de la mañana",
          time: "9 a 12 m",
          lugar: "Casa / apartamento",
          medios: "Redes / Spotify / WhatsApp",
          vehiculo: "Spotify / TikTok / Meta",
          activacion:
            "Fragmentos de vallenato icónico, momentos de concierto (cantar en coro).",
          activities: [
            { label: "Escuchando y viendo videos musicales", pct: 17, index: 134 },
            { label: "Investigando temas de interés", pct: 15, index: 121 },
            { label: "Revisando redes", pct: 24, index: 124 },
          ],
        },
        {
          block: "Medio día",
          time: "12 m a 3 pm",
          lugar: "Restaurantes / oficinas",
          medios: "Chat + redes",
          vehiculo: "WhatsApp / Instagram / TikTok",
          activacion: 'Contenido tipo "plan recomendado" y promos grupales.',
          activities: [
            { label: "Escuchando o viendo playlists", pct: 16, index: 123 },
            { label: "Revisando redes", pct: 19, index: 132 },
          ],
        },
        {
          block: "La tarde",
          time: "3 a 6 pm",
          lugar: "Trabajo / universidad / transporte",
          medios: "Search / música",
          vehiculo: "Google / YouTube / portales",
          activacion: "Público cantando, momentos de conexión emocional.",
          activities: [
            { label: "Revisando redes", pct: 18, index: 141 },
            { label: "WhatsApp — grupos de colombianos", pct: 29, index: 124 },
            { label: "Escuchando y viendo videos musicales", pct: 24, index: 132 },
            { label: "Investigando planes", pct: 18, index: 105 },
            { label: "Movilizándose en transporte", pct: 15, index: 101 },
          ],
        },
        {
          block: "Fin de la tarde",
          time: "6 a 8 pm",
          lugar: "Casa",
          medios: "Netflix + second screen / Instagram / TikTok / YouTube",
          vehiculo: "Video ads emocionales largos e influencers",
          activacion: "CTA inmediato de influencers y compra en pocos pasos.",
          activities: [],
        },
        {
          block: "Noche",
          time: "8 a 11 pm",
          lugar: "Casa / cafés",
          medios: "Redes / WhatsApp / Google",
          vehiculo: "Remarketing / Google / Search, WhatsApp marketing / referral",
          activacion: "Compra en grupo y beneficios por combo.",
          activities: [
            { label: "Investigando planes y compras", pct: 20, index: 127 },
            { label: "Búsquedas de planes y portales", pct: 12, index: 108 },
            { label: "Revisando redes", pct: 34, index: 146 },
            { label: "Grupos de colombianos", pct: 28, index: 115 },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper para construir personas de las categorías "plantilla" con menos
// repetición de código.
// ---------------------------------------------------------------------------
function daypart(block, time, lugar, medios, vehiculo, activacion, activities) {
  return { block, time, lugar, medios, vehiculo, activacion, activities: activities || [] };
}

// ---------------------------------------------------------------------------
// CASO 2 — DEPORTES (plantilla ilustrativa)
// ---------------------------------------------------------------------------
const CASE_DEPORTES = {
  id: "liga-futbol-local-temporada",
  name: "Lanzamiento de temporada — Liga de fútbol local",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI",
  insightNote:
    "Identificando el nivel de involucramiento con el equipo/liga y el canal preferido de consumo, para separar hinchas de alta frecuencia de fans ocasionales.",
  funnelSteps: [
    { label: "Interés declarado en fútbol profesional", pct: 45 },
    { label: "Consumen contenido deportivo digital a diario", pct: 38 },
    { label: "Han comprado boletos o merchandising en el último año", pct: 30 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "hincha-digital",
      name: "Andrés Osorio",
      archetype: "El Hincha Digital",
      quote: "Si no lo vi en vivo, lo vi en highlights antes que nadie.",
      description:
        "Sigue a su equipo principalmente por redes y streaming. Consume estadísticas, fantasy y apuestas deportivas; su vínculo con el club es diario, no solo el día del partido.",
      sharePct: 55,
      demographics: {
        genderSplit: { male: 72, female: 28 },
        ageBands: [
          { label: "16-24", pct: 22 },
          { label: "25-34", pct: 33 },
          { label: "35-44", pct: 24 },
          { label: "45-54", pct: 12 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 3 },
        ],
        topCities: [
          { city: "Bogotá", pct: 38 },
          { city: "Medellín", pct: 20 },
          { city: "Cali", pct: 15 },
          { city: "Barranquilla", pct: 12 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 6 },
        ],
      },
      motivations: [
        { label: "Estar siempre informado sobre su equipo", pct: 74 },
        { label: "Participar en conversación / debate digital", pct: 61 },
        { label: "Fantasy / pronósticos y apuestas", pct: 49 },
        { label: "Coleccionar contenido y estadísticas", pct: 40 },
      ],
      barriers: [
        { label: "Costo de suscripciones de streaming", pct: 58 },
        { label: "Saturación de anuncios en apps deportivas", pct: 44 },
        { label: "Desconfianza en plataformas de apuestas", pct: 33 },
        { label: "Falta de tiempo para ver partidos completos", pct: 27 },
      ],
      digitalInterests: [
        { label: "Apps de estadísticas y resultados en vivo", index: 178 },
        { label: "Fantasy / pronósticos deportivos", index: 160 },
        { label: "Comunidades y foros de hinchas", index: 145 },
      ],
      media: [
        { label: "TikTok", pct: 84 },
        { label: "Instagram", pct: 82 },
        { label: "YouTube", pct: 88 },
        { label: "Streaming deportivo", pct: 79 },
        { label: "Podcasts", pct: 55 },
        { label: "Radio deportiva", pct: 46 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes, notificaciones push", "Instagram, TikTok", "Resumen de resultados y titulares del día."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / universidad", "Grupos de WhatsApp", "WhatsApp, Twitter/X", "Debate sobre alineaciones y fichajes.", [
          { label: "Revisando redes", pct: 22, index: 128 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurante", "Apps de noticias deportivas", "ESPN, apps de resultados", "Notificaciones de goles y estadísticas en vivo.", [
          { label: "Viendo highlights", pct: 27, index: 132 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "YouTube, podcasts", "YouTube, Spotify", "Análisis pre-partido, contenido de creadores deportivos.", [
          { label: "Escuchando podcasts deportivos", pct: 19, index: 141 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa / bar", "TV + segunda pantalla", "TV en vivo, Twitter/X", "Previa del partido, predicciones en vivo."),
        daypart("Noche", "8 a 11 pm", "Casa / bar / estadio", "TV, redes en vivo", "Streaming, redes sociales", "Reacciones en vivo y clips post-partido.", [
          { label: "Comentando en redes durante el partido", pct: 41, index: 156 },
        ]),
      ],
    },
    {
      id: "fan-familiar",
      name: "Marcela Ibarra",
      archetype: "La Fan Familiar",
      quote: "Ir al estadio con mis hijos es nuestro plan de cada mes.",
      description:
        "Vive el fútbol como plan familiar y social. Va al estadio ocasionalmente, prioriza la experiencia y la seguridad, y su consumo digital gira en torno a la logística del plan (boletas, parqueadero, horarios).",
      sharePct: 45,
      demographics: {
        genderSplit: { male: 38, female: 62 },
        ageBands: [
          { label: "16-24", pct: 8 },
          { label: "25-34", pct: 27 },
          { label: "35-44", pct: 34 },
          { label: "45-54", pct: 20 },
          { label: "55-64", pct: 8 },
          { label: "65+", pct: 3 },
        ],
        topCities: [
          { city: "Bogotá", pct: 34 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 16 },
          { city: "Barranquilla", pct: 11 },
          { city: "Cartagena", pct: 9 },
          { city: "Bucaramanga", pct: 8 },
        ],
      },
      motivations: [
        { label: "Plan familiar / calidad de tiempo en familia", pct: 71 },
        { label: "Experiencia en vivo (ambiente, cánticos)", pct: 60 },
        { label: "Tradición / cercanía al club de toda la vida", pct: 52 },
        { label: "Salir de la rutina", pct: 44 },
      ],
      barriers: [
        { label: "Precio de boletas para toda la familia", pct: 66 },
        { label: "Percepción de inseguridad en el estadio", pct: 49 },
        { label: "Logística de movilidad y parqueadero", pct: 42 },
        { label: "Horarios poco convenientes", pct: 31 },
      ],
      digitalInterests: [
        { label: "Compra de boletería en línea", index: 152 },
        { label: "Contenido familiar / experiencias", index: 138 },
        { label: "Promociones y combos", index: 149 },
      ],
      media: [
        { label: "Facebook", pct: 78 },
        { label: "Instagram", pct: 70 },
        { label: "WhatsApp", pct: 92 },
        { label: "TV abierta", pct: 66 },
        { label: "Radio", pct: 40 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "WhatsApp familiar", "WhatsApp", "Coordinación del plan del fin de semana."),
        daypart("Final de la mañana", "9 a 12 m", "Casa / trabajo", "Facebook, Instagram", "Facebook, Instagram", "Promos de boletería y combos familiares.", [
          { label: "Revisando promociones", pct: 20, index: 134 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, sitio del club", "Compra de boletas y consulta de horarios.", [
          { label: "Comprando boletería", pct: 14, index: 149 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa", "WhatsApp, redes", "WhatsApp, Instagram", "Confirmación del plan, logística de transporte."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa / camino al estadio", "Radio, WhatsApp", "Radio, apps de movilidad", "Recordatorio de llegada anticipada y parqueadero."),
        daypart("Noche", "8 a 11 pm", "Estadio / casa", "Vivencia en vivo", "Presencial", "Experiencia en vivo, fotos y video para compartir en familia.", [
          { label: "Compartiendo fotos/video en redes", pct: 33, index: 140 },
        ]),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 3 — RETAIL & MODA (plantilla ilustrativa)
// ---------------------------------------------------------------------------
const CASE_RETAIL = {
  id: "lanzamiento-coleccion-urbana",
  name: "Lanzamiento de colección urbana/deportiva",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI",
  insightNote:
    "Separando a quienes compran por estatus/tendencia de quienes compran por valor y validación social, para priorizar el mensaje de cada oleada de medios.",
  funnelSteps: [
    { label: "Interés en moda urbana / sneakers", pct: 41 },
    { label: "Compran ropa o calzado online al menos 1 vez al trimestre", pct: 46 },
    { label: "Siguen marcas o creadores de moda en redes", pct: 33 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "sneakerhead-early-adopter",
      name: "Kevin Torres",
      archetype: "El Sneakerhead Early Adopter",
      quote: "Si sale un drop nuevo, yo ya lo tengo en el carrito desde el anuncio.",
      description:
        "Compra por estatus, exclusividad y ser el primero. Sigue lanzamientos, colabora en comunidades de reventa y su decisión de compra es casi inmediata frente a ediciones limitadas.",
      sharePct: 48,
      demographics: {
        genderSplit: { male: 68, female: 32 },
        ageBands: [
          { label: "16-24", pct: 34 },
          { label: "25-34", pct: 38 },
          { label: "35-44", pct: 17 },
          { label: "45-54", pct: 7 },
          { label: "55-64", pct: 3 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 40 },
          { city: "Medellín", pct: 24 },
          { city: "Cali", pct: 13 },
          { city: "Barranquilla", pct: 11 },
          { city: "Bucaramanga", pct: 7 },
          { city: "Cartagena", pct: 5 },
        ],
      },
      motivations: [
        { label: "Ser de los primeros en tener el producto", pct: 80 },
        { label: "Exclusividad / ediciones limitadas", pct: 69 },
        { label: "Estatus dentro de su comunidad", pct: 57 },
        { label: "Potencial de reventa", pct: 39 },
      ],
      barriers: [
        { label: "Stock limitado / dificultad para comprar", pct: 64 },
        { label: "Precio de reventa inflado", pct: 51 },
        { label: "Desconfianza en tiendas no oficiales", pct: 37 },
        { label: "Tiempos de entrega", pct: 26 },
      ],
      digitalInterests: [
        { label: "Comunidades de reventa / marketplaces", index: 190 },
        { label: "Contenido de unboxing y reviews", index: 172 },
        { label: "Notificaciones de restock", index: 205 },
      ],
      media: [
        { label: "Instagram", pct: 89 },
        { label: "TikTok", pct: 86 },
        { label: "YouTube", pct: 74 },
        { label: "Apps de la marca", pct: 68 },
        { label: "Discord / comunidades", pct: 52 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Notificaciones de apps", "Apps de la marca, Instagram", "Alerta de drop / restock disponible."),
        daypart("Final de la mañana", "9 a 12 m", "Universidad / trabajo", "TikTok, Instagram", "TikTok, Instagram", "Contenido de unboxing e influencers de sneakers.", [
          { label: "Viendo contenido de moda", pct: 26, index: 158 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Universidad / trabajo", "Foros y comunidades", "Discord, marketplaces", "Validación de precios de reventa y autenticidad.", [
          { label: "Comparando precios", pct: 21, index: 163 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "YouTube", "YouTube, reviews", "Reviews en video de nuevos lanzamientos."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "App de la marca", "App propia, checkout online", "Countdown para el lanzamiento oficial del drop.", [
          { label: "Agregando al carrito / esperando drop", pct: 17, index: 176 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes sociales", "Instagram, TikTok", "Mostrar la compra / unboxing a su comunidad.", [
          { label: "Publicando en redes su compra", pct: 24, index: 149 },
        ]),
      ],
    },
    {
      id: "compradora-consciente",
      name: "Daniela Rojas",
      archetype: "La Compradora Consciente",
      quote: "Antes de comprar, reviso reseñas, tallas y si la marca sí cumple lo que promete.",
      description:
        "Compra por valor, calidad y validación social real (reseñas, materiales, políticas de devolución), no por hype. Es más leal a marcas que le generan confianza a largo plazo.",
      sharePct: 52,
      demographics: {
        genderSplit: { male: 30, female: 70 },
        ageBands: [
          { label: "16-24", pct: 18 },
          { label: "25-34", pct: 34 },
          { label: "35-44", pct: 28 },
          { label: "45-54", pct: 14 },
          { label: "55-64", pct: 5 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 37 },
          { city: "Medellín", pct: 19 },
          { city: "Cali", pct: 14 },
          { city: "Barranquilla", pct: 13 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 8 },
        ],
      },
      motivations: [
        { label: "Buena relación calidad-precio", pct: 75 },
        { label: "Reseñas y opiniones de otros compradores", pct: 68 },
        { label: "Políticas claras de cambio/devolución", pct: 55 },
        { label: "Marcas con prácticas sostenibles", pct: 43 },
      ],
      barriers: [
        { label: "Incertidumbre sobre tallas al comprar online", pct: 59 },
        { label: "Costos de envío", pct: 46 },
        { label: "Falta de reseñas confiables", pct: 38 },
        { label: "Tiempos de devolución largos", pct: 30 },
      ],
      digitalInterests: [
        { label: "Comparadores de precio y reseñas", index: 168 },
        { label: "Contenido de moda sostenible", index: 140 },
        { label: "Guías de talla y ajuste", index: 155 },
      ],
      media: [
        { label: "Instagram", pct: 80 },
        { label: "Facebook", pct: 62 },
        { label: "Pinterest", pct: 54 },
        { label: "Marketplaces (reseñas)", pct: 77 },
        { label: "Email / newsletters de marca", pct: 48 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Email, notificaciones", "Newsletters de marca", "Ofertas y novedades de la colección."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes sociales", "Instagram, Pinterest", "Inspiración de looks y combinaciones.", [
          { label: "Guardando ideas / inspiración", pct: 22, index: 137 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / casa", "Marketplaces", "Reseñas y comparadores", "Lectura de reseñas antes de decidir la compra.", [
          { label: "Leyendo reseñas", pct: 29, index: 165 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa", "Redes, buscadores", "Google, Instagram Shopping", "Comparación de precios entre tiendas.", [
          { label: "Comparando precios", pct: 24, index: 158 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Sitio de la marca", "E-commerce propio", "Checkout con garantías claras de devolución."),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes sociales", "Instagram, WhatsApp", "Comparte su compra o pide opinión a amigas antes de comprar.", [
          { label: "Consultando con su círculo cercano", pct: 20, index: 128 },
        ]),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 4 — TECNOLOGÍA & FINTECH (plantilla ilustrativa)
// ---------------------------------------------------------------------------
const CASE_FINTECH = {
  id: "lanzamiento-app-pagos-digitales",
  name: "Lanzamiento de nueva app de pagos digitales",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI",
  insightNote:
    "Separando adoptantes tempranos de tecnología financiera de quienes migran desde efectivo/banca tradicional, ya que requieren mensajes de confianza muy distintos.",
  funnelSteps: [
    { label: "Usan al menos una app financiera/billetera digital", pct: 58 },
    { label: "Han probado más de una app de pagos en el último año", pct: 34 },
    { label: "Abiertos a cambiar de proveedor si hay mejor beneficio", pct: 41 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "early-adopter-fintech",
      name: "Camilo Vargas",
      archetype: "El Early Adopter Fintech",
      quote: "Pruebo cada app de pagos que sale antes de que se vuelva mainstream.",
      description:
        "Curioso por naturaleza, prueba cada nueva app de pagos, compara comisiones y beneficios, y es un multiplicador de recomendación cuando encuentra algo mejor que lo actual.",
      sharePct: 44,
      demographics: {
        genderSplit: { male: 63, female: 37 },
        ageBands: [
          { label: "16-24", pct: 20 },
          { label: "25-34", pct: 39 },
          { label: "35-44", pct: 26 },
          { label: "45-54", pct: 11 },
          { label: "55-64", pct: 3 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 43 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 12 },
          { city: "Barranquilla", pct: 10 },
          { city: "Bucaramanga", pct: 8 },
          { city: "Cartagena", pct: 5 },
        ],
      },
      motivations: [
        { label: "Mejores beneficios / cashback", pct: 77 },
        { label: "Ser de los primeros en probar tecnología nueva", pct: 66 },
        { label: "Comisiones más bajas que la banca tradicional", pct: 60 },
        { label: "Experiencia de usuario superior", pct: 49 },
      ],
      barriers: [
        { label: "Dudas sobre seguridad de datos", pct: 54 },
        { label: "Poca red de comercios que acepten la app", pct: 47 },
        { label: "Fricción al migrar de una app a otra", pct: 36 },
        { label: "Soporte al cliente limitado", pct: 29 },
      ],
      digitalInterests: [
        { label: "Comparadores de apps financieras", index: 182 },
        { label: "Comunidades de tecnología / fintech", index: 175 },
        { label: "Programas de referidos", index: 163 },
      ],
      media: [
        { label: "YouTube", pct: 78 },
        { label: "Twitter/X", pct: 61 },
        { label: "TikTok", pct: 66 },
        { label: "Podcasts de tecnología", pct: 50 },
        { label: "Notificaciones push", pct: 84 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Notificaciones, noticias tech", "Push, Twitter/X", "Novedades de producto y beneficios por lanzamiento."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes, foros", "Twitter/X, comunidades", "Comparación de comisiones y beneficios entre apps.", [
          { label: "Comparando apps financieras", pct: 23, index: 172 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, reseñas de apps", "Lectura de reviews y calificación en tiendas de apps.", [
          { label: "Leyendo reseñas de apps", pct: 19, index: 168 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "Podcasts, YouTube", "YouTube, podcasts", "Contenido explicativo de nuevas funciones."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "App propia", "Onboarding en la app", "Registro y primer uso guiado con incentivo de bienvenida.", [
          { label: "Descargando / probando la app", pct: 16, index: 180 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes sociales", "Twitter/X, WhatsApp", "Recomienda la app a su círculo cercano.", [
          { label: "Recomendando la app a otros", pct: 21, index: 158 },
        ]),
      ],
    },
    {
      id: "migrante-bancario",
      name: "Rosa Elena Pardo",
      archetype: "La Migrante Bancaria",
      quote: "Si me dan confianza y me ahorran una fila en el banco, con gusto la uso.",
      description:
        "Viene del efectivo o de la banca tradicional. Necesita confianza, simplicidad y beneficios muy claros (ahorro de tiempo, sin filas, sin letra menuda) para dar el salto a lo digital.",
      sharePct: 56,
      demographics: {
        genderSplit: { male: 41, female: 59 },
        ageBands: [
          { label: "16-24", pct: 9 },
          { label: "25-34", pct: 22 },
          { label: "35-44", pct: 28 },
          { label: "45-54", pct: 24 },
          { label: "55-64", pct: 13 },
          { label: "65+", pct: 4 },
        ],
        topCities: [
          { city: "Bogotá", pct: 33 },
          { city: "Medellín", pct: 18 },
          { city: "Cali", pct: 15 },
          { city: "Barranquilla", pct: 13 },
          { city: "Bucaramanga", pct: 11 },
          { city: "Cartagena", pct: 10 },
        ],
      },
      motivations: [
        { label: "Ahorro de tiempo (sin filas, sin trámites)", pct: 72 },
        { label: "Confianza / respaldo reconocido", pct: 68 },
        { label: "Beneficios simples de entender", pct: 57 },
        { label: "Recomendación de familiares o amigos", pct: 45 },
      ],
      barriers: [
        { label: "Miedo a fraudes o pérdida del dinero", pct: 63 },
        { label: "Poca familiaridad con apps", pct: 51 },
        { label: "Preferencia por atención humana/presencial", pct: 44 },
        { label: "Letra menuda / condiciones poco claras", pct: 39 },
      ],
      digitalInterests: [
        { label: "Contenido educativo sobre finanzas digitales", index: 158 },
        { label: "Testimonios y recomendaciones", index: 171 },
        { label: "Atención al cliente por WhatsApp", index: 149 },
      ],
      media: [
        { label: "Facebook", pct: 74 },
        { label: "WhatsApp", pct: 93 },
        { label: "TV abierta", pct: 58 },
        { label: "Radio", pct: 47 },
        { label: "YouTube", pct: 52 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "TV, radio", "TV abierta, radio", "Testimonios de personas comunes usando la app."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / casa", "WhatsApp familiar", "WhatsApp", "Recomendación directa de un familiar o amigo.", [
          { label: "Preguntando a conocidos", pct: 18, index: 152 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Facebook", "Facebook", "Contenido educativo simple sobre cómo usar la app.", [
          { label: "Viendo contenido educativo", pct: 15, index: 149 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa", "YouTube", "YouTube (tutoriales)", "Video tutorial paso a paso de primer registro."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "WhatsApp", "Soporte por WhatsApp", "Acompañamiento humano durante el primer uso.", [
          { label: "Contactando soporte al cliente", pct: 11, index: 145 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa", "TV, Facebook", "TV abierta, Facebook", "Refuerzo de confianza (seguridad, respaldo, casos de éxito)."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CATEGORÍAS (verticales) — cada una agrupa uno o más "casos"
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    id: "entretenimiento",
    name: "Entretenimiento en vivo",
    icon: "🎤",
    description: "Conciertos, festivales y eventos culturales.",
    traits: [
      { id: "turismo", label: "Interés en turismo / viajes" },
      { id: "viajanIntl", label: "Viajan internacionalmente con frecuencia" },
      { id: "afinidadGenero", label: "Afinidad con el género musical del artista" },
      { id: "comunidadMigrante", label: "Comunidad de migrantes/compatriotas en el destino" },
    ],
    cases: [CASE_DANGOND],
  },
  {
    id: "deportes",
    name: "Deportes",
    icon: "⚽",
    description: "Ligas, equipos y eventos deportivos.",
    traits: [
      { id: "interesFutbol", label: "Interés en fútbol profesional" },
      { id: "consumoDigitalDiario", label: "Consumo diario de contenido deportivo" },
      { id: "compraBoletos", label: "Compra de boletos / merchandising" },
      { id: "planFamiliar", label: "Busca plan familiar / social" },
    ],
    cases: [CASE_DEPORTES],
  },
  {
    id: "retail",
    name: "Retail & Moda",
    icon: "👟",
    description: "Lanzamientos de producto, moda y estilo de vida.",
    traits: [
      { id: "modaUrbana", label: "Interés en moda urbana / sneakers" },
      { id: "compraOnline", label: "Compra ropa o calzado online con frecuencia" },
      { id: "sigueMarcas", label: "Sigue marcas o creadores de moda" },
      { id: "sensibilidadPrecio", label: "Alta sensibilidad a precio / reseñas" },
    ],
    cases: [CASE_RETAIL],
  },
  {
    id: "fintech",
    name: "Tecnología & Fintech",
    icon: "💳",
    description: "Apps financieras, pagos digitales y banca.",
    traits: [
      { id: "usaAppsFin", label: "Usa apps financieras / billeteras digitales" },
      { id: "pruebaMultiples", label: "Prueba múltiples apps de pagos" },
      { id: "abiertoCambiar", label: "Abierto a cambiar de proveedor" },
      { id: "migraEfectivo", label: "Viene de efectivo / banca tradicional" },
    ],
    cases: [CASE_FINTECH],
  },
];

// ---------------------------------------------------------------------------
// Relación variable -> persona, usada por el wizard para resaltar qué
// audiencias recomendadas encajan mejor con las variables que el usuario
// marcó como prioritarias en el paso 2 (no altera el tamaño calculado,
// solo el orden/resaltado de la recomendación).
// ---------------------------------------------------------------------------
const PERSONA_RELATED_TRAITS = {
  "hincha-premium": ["turismo", "viajanIntl", "afinidadGenero"],
  "colombiano-nostalgico": ["comunidadMigrante", "afinidadGenero"],
  "hincha-digital": ["interesFutbol", "consumoDigitalDiario"],
  "fan-familiar": ["planFamiliar", "compraBoletos"],
  "sneakerhead-early-adopter": ["modaUrbana", "sigueMarcas"],
  "compradora-consciente": ["compraOnline", "sensibilidadPrecio"],
  "early-adopter-fintech": ["pruebaMultiples", "abiertoCambiar"],
  "migrante-bancario": ["usaAppsFin", "migraEfectivo"],
};
