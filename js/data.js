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
  { id: "USA", name: "Estados Unidos", flag: "🇺🇸", digitalPop: 250000000 },
  { id: "ARG", name: "Argentina", flag: "🇦🇷", digitalPop: 35000000 },
  // Agregado 2026-09-24 para el caso Jäger VidaSocial (Rio de Janeiro) — digitalPop es
  // una estimación poblacional de usuarios de internet en Brasil, no una cifra de GWI.
  { id: "BRA", name: "Brasil", flag: "🇧🇷", digitalPop: 180000000 },
];

const AGE_BANDS = ["16-24", "25-34", "35-44", "45-54", "55-64", "65+"];

// Niveles socioeconómicos (NSE) — variable demográfica adicional que el
// usuario puede priorizar en el wizard, junto a género y edad.
const NSE_LEVELS = ["A/B (alto)", "C+ (medio-alto)", "C (medio)", "C- (medio-bajo)", "D-E (bajo)"];

// Géneros musicales tal como los mide GWI (variable real de GWI Core,
// verificada vía chat_gwi — ranking real para Colombia: Latin 52%, 90s 43%,
// 80s 43%, Rock 42%, 00s 29%, EDM/Dance 28%, 50s-60s-70s 24%, Hip-Hop/Rap 22%,
// Reggae/Ska 22%, Pop/Top40 20%). Usado por el campo de "géneros musicales"
// que aparece cuando la categoría elegida es Entretenimiento en vivo.
const MUSIC_GENRES = [
  { id: "latin", label: "Música Latina", refPct: 52 },
  { id: "rock", label: "Rock", refPct: 42 },
  { id: "90s", label: "Música de los 90", refPct: 43 },
  { id: "80s", label: "Música de los 80", refPct: 43 },
  { id: "00s", label: "Música de los 2000", refPct: 29 },
  { id: "edm", label: "EDM / Dance (House, Techno)", refPct: 28 },
  { id: "classic", label: "Música de los 50s-60s-70s", refPct: 24 },
  { id: "hiphop", label: "Hip-Hop / Rap", refPct: 22 },
  { id: "reggae", label: "Reggae / Ska", refPct: 22 },
  { id: "pop", label: "Pop / Top 40", refPct: 20 },
];

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
      aiInsight: aiInsight(
        "Cruza con la tendencia de 'bleisure/eventleisure' (viajar por un evento deportivo y sumarle entretenimiento): esta audiencia ya decidió el viaje por el Mundial, así que el concierto compite por un presupuesto y una atención que ya están comprometidos en otro lado — el mensaje debe venderse como complemento, no como plan aparte.",
        [
          { label: "Ventana de decisión muy corta", detail: "Compra por FOMO durante el viaje, no con meses de anticipación: el activo de medios más rentable es retargeting en destino, no awareness temprano en origen." },
          { label: "El estatus pesa más que el precio", detail: "Están dispuestos a pagar más por una experiencia 'exclusiva' (zona VIP, meet & greet) que por un boleto general más barato." },
          { label: "Colombia como identidad exportable", detail: "El contenido que mejor conecta no es el artista solo, sino la escena colombiana completa (comida, acento, fútbol) como paquete emocional." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con la tendencia de comunidades de diáspora hiperconectadas: esta audiencia no busca el concierto como evento aislado, sino como excusa para activar su red de compatriotas en la ciudad — el canal más barato de adquisición es la referencia dentro de esa red, no la pauta fría.",
        [
          { label: "Compra en grupo, no individual", detail: "La decisión de compra se acelera cuando hay un beneficio de combo/grupo — el mensaje individual pierde frente al mensaje 'llévalo con tu comunidad'." },
          { label: "Nostalgia como gatillo, no como argumento", detail: "Responde mejor a un fragmento de canción o un acento reconocible que a un argumento racional sobre el line-up." },
          { label: "Alta sensibilidad a competencia local", detail: "Si CDMX tiene otro plan colombiano esa misma semana, canibaliza la decisión — vale la pena monitorear el calendario de eventos de la comunidad." },
        ]
      ),
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

// Insight de IA por persona: un resumen que cruza la audiencia con
// tendencias, más "ideas clave" que el usuario puede abrir una por una en
// el perfil (interactividad ligera, sin backend — ver README).
function aiInsight(summary, ideas) {
  return { summary, ideas };
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
      aiInsight: aiInsight(
        "Cruza con la fragmentación del consumo deportivo: ya no ve el partido completo en un solo canal, lo vive en fragmentos (highlights, stats en vivo, debate en redes) repartidos en 3-4 apps distintas — un plan de medios de un solo canal pierde la mayoría de sus momentos de atención reales.",
        [
          { label: "El segundo partido es el debate", detail: "Tanto o más engagement se genera en la conversación posterior en redes que durante el partido mismo — vale la pena pautar también en la ventana post-partido, no solo en la previa." },
          { label: "Fantasy/apuestas como hábito diario", detail: "Convierte el seguimiento en una rutina diaria incluso sin partido esa semana, lo que abre espacio a comunicación fuera de fechas de juego." },
          { label: "Desconfianza creciente en apuestas", detail: "La barrera de confianza en plataformas de apuestas es alta — un mensaje de marca que se asocie de forma transparente (no agresiva) a ese mundo puede diferenciarse." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con la tendencia de 'experiencias sobre productos': para esta audiencia el partido es el pretexto, el verdadero producto que compra es tiempo de calidad en familia — la comunicación que gana no vende fútbol, vende el recuerdo familiar alrededor del fútbol.",
        [
          { label: "La barrera real es logística, no el precio del boleto", detail: "Parqueadero, seguridad y horarios pesan casi tanto como el precio — resolver la fricción logística puede convertir más que un descuento." },
          { label: "WhatsApp es el canal de decisión real", detail: "El plan se coordina y confirma en el chat familiar, no en la red social donde vio el anuncio — vale la pena facilitar contenido 'para reenviar' en el anuncio mismo." },
          { label: "Baja frecuencia = alta oportunidad de recompra emocional", detail: "Como no va seguido, cada visita se vive como ocasión especial — hay espacio para un ritual pre-partido de marca (foto, souvenir) que fidelice para la próxima." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con la economía de la escasez artificial: para esta audiencia el 'drop' limitado no es un problema de stock, es el mecanismo mismo que activa la compra — comunicar 'quedan pocas unidades' no es honestidad operativa, es la palanca de marketing más efectiva que existe para este perfil.",
        [
          { label: "El reloj de countdown vende más que el producto", detail: "La ansiedad de perderse el drop supera al argumento racional del producto — priorizar mecánicas de urgencia visible (contador, stock en vivo) sobre descripciones largas." },
          { label: "La reventa valida el hype, no lo daña", detail: "Un precio alto de reventa refuerza el deseo de compra en el próximo lanzamiento en vez de desincentivarlo — no tratar el mercado secundario como un problema a combatir." },
          { label: "Comparte la compra como trofeo", detail: "El unboxing en redes es parte del valor percibido del producto mismo — empaques diseñados para ser fotografiados tienen retorno directo en alcance orgánico." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con el auge del 'de-influencing' (contenido que recomienda NO comprar ciertas cosas): esta audiencia confía más en quien le dice qué NO comprar que en publicidad tradicional — la marca que sea honesta sobre las limitaciones de su producto gana más credibilidad que la que solo destaca beneficios.",
        [
          { label: "Las reseñas negativas también venden", detail: "Mostrar reseñas mixtas (no solo 5 estrellas) aumenta la confianza en que las demás reseñas son reales." },
          { label: "La política de devolución es un argumento de venta", detail: "Comunicar devoluciones fáciles ANTES de la compra reduce más la fricción que un descuento del mismo valor." },
          { label: "Consulta a su círculo antes de comprar", detail: "El 'compartir con amigas antes de comprar' es un paso real del journey — un botón de 'pedir opinión' en el producto podría capturar esa intención en el propio sitio en vez de perderla a WhatsApp." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con la fatiga de apps fintech (tiene 3-4 billeteras instaladas y ninguna es 'la principal' todavía): esta audiencia no es leal por naturaleza, así que ganar su instalación no es la meta real — la meta es ganar el primer lugar en su lista de apps para pagar, que se decide en las primeras semanas de uso.",
        [
          { label: "El beneficio de bienvenida decide la prueba, no la retención", detail: "El cashback inicial atrae la descarga, pero solo un uso genuinamente más simple que la competencia logra que se quede como app principal." },
          { label: "Es el multiplicador de referidos más barato que existe", detail: "Cuando encuentra algo mejor lo recomienda activamente en sus redes tech — invertir en su experiencia de las primeras 2 semanas tiene efecto viral gratis." },
          { label: "La seguridad se comunica, no se asume", detail: "Aunque es early adopter, la duda de seguridad de datos sigue siendo su barrera #1 — no dar por hecho que 'ya confía' solo por ser digital-first." },
        ]
      ),
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
      aiInsight: aiInsight(
        "Cruza con la brecha de confianza digital que la banca tradicional aún no ha cerrado del todo en LatAm: para esta audiencia el salto a digital no es una decisión racional de comisiones, es una decisión emocional de riesgo percibido — cada testimonio de 'alguien como yo' pesa más que cualquier feature técnica.",
        [
          { label: "El testimonio vale más que el feature", detail: "Un video corto de una persona común contando su experiencia convierte más que una lista de beneficios técnicos de la app." },
          { label: "El soporte humano es la red de seguridad real", detail: "Saber que puede escribir a un humano por WhatsApp si algo sale mal reduce más el miedo que cualquier certificación de seguridad invisible." },
          { label: "La recomendación familiar es el gatillo, no el anuncio", detail: "El anuncio genera awareness, pero la decisión real de instalar la app casi siempre pasa por la validación de un familiar o amigo de confianza." },
        ]
      ),
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
// CASO 5 — ALCOHOL Y BEBIDAS (plantilla ilustrativa — GWI Alcohol)
// ---------------------------------------------------------------------------
const CASE_ALCOHOL = {
  id: "lanzamiento-bebida-premium",
  name: "Lanzamiento de bebida premium (RTD / spirits)",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Alcohol)",
  insightNote:
    "Separando a quien busca novedad y mixología de quien bebe socialmente con moderación, porque el mensaje de 'descubrimiento' no funciona igual para los dos.",
  funnelSteps: [
    { label: "Interés en probar nuevas bebidas alcohólicas", pct: 48 },
    { label: "Consumen bebidas premium o artesanales", pct: 35 },
    { label: "Salen a bares o eventos sociales 2+ veces al mes", pct: 40 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "explorador-cocteleria",
      name: "Esteban Ríos",
      archetype: "El Explorador de Coctelería",
      quote: "Si el bar tiene un cóctel de autor que no he probado, ese es mi pedido de la noche.",
      description:
        "Busca novedad y experiencias de mixología. Sigue bartenders y marcas boutique en redes, y su decisión de compra se guía por historia/origen del producto, no solo por sabor.",
      sharePct: 46,
      aiInsight: aiInsight(
        "Cruza con el auge de la coctelería de autor como contenido: para esta audiencia probar la bebida es secundario frente a poder mostrar que la probó — el packaging y el ritual de servir importan tanto como el líquido.",
        [
          { label: "Compra la historia, no solo el producto", detail: "El origen/proceso de producción (destilería pequeña, ingrediente raro) es un argumento de venta tan fuerte como el sabor." },
          { label: "El bartender es un influencer real", detail: "La recomendación de un bartender de confianza pesa más que la pauta paga — vale la pena invertir en programas de embajadores en bares clave." },
          { label: "Contenido para compartir, no para informar", detail: "Un video de cómo se sirve/prepara el trago tiene más tracción que una ficha técnica del producto." },
        ]
      ),
      demographics: {
        genderSplit: { male: 58, female: 42 },
        ageBands: [
          { label: "16-24", pct: 10 },
          { label: "25-34", pct: 38 },
          { label: "35-44", pct: 32 },
          { label: "45-54", pct: 14 },
          { label: "55-64", pct: 5 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 41 },
          { city: "Medellín", pct: 25 },
          { city: "Cali", pct: 13 },
          { city: "Barranquilla", pct: 10 },
          { city: "Cartagena", pct: 7 },
          { city: "Bucaramanga", pct: 4 },
        ],
      },
      motivations: [
        { label: "Descubrir sabores/marcas nuevas", pct: 73 },
        { label: "Experiencia de mixología / ritual de servir", pct: 62 },
        { label: "Estatus social al pedir algo distinto", pct: 51 },
        { label: "Historia u origen del producto", pct: 45 },
      ],
      barriers: [
        { label: "Precio alto vs. opciones tradicionales", pct: 57 },
        { label: "Poca disponibilidad en bares/tiendas cercanas", pct: 44 },
        { label: "Desconfianza en marcas nuevas/desconocidas", pct: 33 },
        { label: "Falta de recomendación de un experto", pct: 25 },
      ],
      digitalInterests: [
        { label: "Cuentas de bartenders y mixología", index: 174 },
        { label: "Reseñas de bares y coctelerías", index: 158 },
        { label: "Marcas boutique / de producción limitada", index: 166 },
      ],
      media: [
        { label: "Instagram", pct: 85 },
        { label: "TikTok", pct: 71 },
        { label: "YouTube", pct: 60 },
        { label: "Apps de reservas en bares/restaurantes", pct: 54 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Redes", "Instagram", "Contenido de recaps de fin de semana en bares."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes", "Instagram, TikTok", "Sigue cuentas de bartenders y nuevos lanzamientos.", [
          { label: "Explorando cuentas de mixología", pct: 18, index: 149 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google Maps, apps de reservas", "Investiga bares nuevos para el fin de semana.", [
          { label: "Buscando bares/coctelerías nuevas", pct: 15, index: 155 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Redes", "Instagram", "Coordina plan social con amigos para la noche."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "WhatsApp", "WhatsApp", "Confirma plan y reserva mesa."),
        daypart("Noche", "8 a 11 pm", "Bar / restaurante", "Presencial + redes", "Instagram Stories", "Pide el cóctel de autor y lo comparte en redes.", [
          { label: "Publicando su bebida en redes", pct: 29, index: 162 },
        ]),
      ],
    },
    {
      id: "socialite-moderada",
      name: "Valentina Muñoz",
      archetype: "La Socialite Moderada",
      quote: "Puedo disfrutar de una salida sin necesidad de tomar mucho — prefiero calidad a cantidad.",
      description:
        "Bebe socialmente y con moderación. Interesada en opciones bajas en alcohol o sin alcohol, prioriza pasarla bien y verse/sentirse bien al día siguiente.",
      sharePct: 54,
      aiInsight: aiInsight(
        "Cruza con la tendencia global de 'sober curious' / moderación consciente: para esta audiencia el consumo bajo en alcohol no es una restricción, es una elección de estilo de vida — comunicar la opción sin alcohol como 'la alternativa aburrida' aleja, no atrae.",
        [
          { label: "Lo social importa más que lo etílico", detail: "El motivador real es el plan y la compañía, no el efecto del alcohol — el producto que se integre mejor al ritual social gana, sea o no bajo en alcohol." },
          { label: "'Verse bien mañana' es un argumento de compra", detail: "La preocupación por el día siguiente (resaca, rendimiento) es una barrera de categoría que una oferta baja en alcohol puede resolver directamente." },
          { label: "Desconfía de que 'bajo en alcohol' sea sinónimo de bajo en sabor", detail: "Necesita evidencia (reseñas, prueba social) de que no está sacrificando calidad al elegir la opción moderada." },
        ]
      ),
      demographics: {
        genderSplit: { male: 35, female: 65 },
        ageBands: [
          { label: "16-24", pct: 12 },
          { label: "25-34", pct: 33 },
          { label: "35-44", pct: 30 },
          { label: "45-54", pct: 17 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 39 },
          { city: "Medellín", pct: 20 },
          { city: "Cali", pct: 15 },
          { city: "Barranquilla", pct: 12 },
          { city: "Cartagena", pct: 8 },
          { city: "Bucaramanga", pct: 6 },
        ],
      },
      motivations: [
        { label: "Disfrutar el plan social sin exceso", pct: 69 },
        { label: "Cuidar su salud/bienestar", pct: 64 },
        { label: "Verse y sentirse bien al día siguiente", pct: 58 },
        { label: "Opciones bajas en calorías/azúcar", pct: 41 },
      ],
      barriers: [
        { label: "Percepción de que 'sin alcohol' sabe peor", pct: 49 },
        { label: "Poca oferta en bares/eventos", pct: 43 },
        { label: "Presión social para tomar 'normal'", pct: 36 },
        { label: "Precio similar o mayor al producto tradicional", pct: 28 },
      ],
      digitalInterests: [
        { label: "Contenido de bienestar / vida balanceada", index: 152 },
        { label: "Marcas de bebidas bajas en alcohol", index: 169 },
        { label: "Reseñas honestas de sabor", index: 147 },
      ],
      media: [
        { label: "Instagram", pct: 79 },
        { label: "TikTok", pct: 58 },
        { label: "Pinterest", pct: 44 },
        { label: "Podcasts de bienestar", pct: 36 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Apps de bienestar", "Instagram", "Contenido de rutinas saludables."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes", "Instagram", "Ve contenido de marcas de bebidas bajas en alcohol.", [
          { label: "Explorando opciones bajas en alcohol", pct: 14, index: 158 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "WhatsApp", "WhatsApp", "Coordina el plan social del fin de semana."),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Búsqueda", "Google", "Busca reseñas de sabor antes de decidir qué comprar.", [
          { label: "Buscando reseñas de sabor", pct: 12, index: 151 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Instagram", "Se alista para la salida social."),
        daypart("Noche", "8 a 11 pm", "Bar / casa de amigos", "Presencial", "—", "Disfruta el plan con moderación, prioriza sentirse bien al otro día."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO GWI-AUTO — Jäger (BR) VidaSocial (Rio de Janeiro) — audiencias reales
// prioritarias del equipo, procesadas 2026-09-24. De las 5 audiencias del
// batch (UrbanEliteRJ, TribeKeepersRJ, SceneHunterRJ, NightArchitecsRJ,
// CamalonesRJ) se eligieron las 3 más diferenciadas entre sí según los datos
// reales de GWI: UrbanEliteRJ (confiada/social/familiar, cautelosa con lo
// nuevo), SceneHunterRJ (investigadora, escéptica, sobrecargada de trabajo) y
// CamalonesRJ (joven, ambiciosa, early-adopter). TribeKeepersRJ y
// NightArchitecsRJ quedan registradas en el catálogo/manifest pero sin
// persona propia por solaparse demográfica y actitudinalmente con
// SceneHunterRJ (las 3 comparten base Gen X + personalidad "neutral/cautelosa"
// casi idéntica en los atributos que GWI devolvió).
// ---------------------------------------------------------------------------
const CASE_JAGER_VIDASOCIAL_GWI_AUTO_20260924 = {
  id: "jager-vidasocial-noche-rio-de-janeiro",
  name: "Jäger VidaSocial — arquetipos de vida nocturna (Río de Janeiro)",
  market: "BRA",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "3 audiencias reales de GWI de la campaña Jäger (BR) VidaSocial (Rio de Janeiro): UrbanEliteRJ, SceneHunterRJ y CamalonesRJ — elegidas por ser las más diferenciadas entre sí de las 5 audiencias del batch.",
  funnelSteps: [
    {
      label:
        "Audiencia combinada de los 3 arquetipos Jäger VidaSocial sobre población digital de Brasil (universos reales de GWI: ~646K + ~1.53M + ~1.04M ≈ 3.22M sobre ~180M)",
      pct: 1.8,
    },
  ],
  footnotes: [
    "1.8% = universo combinado real de las 3 audiencias (suma de universos verificados vía explore_insight_gwi sobre la pregunta de género, la de mayor tasa de respuesta) sobre la población digital estimada de Brasil (180M, estimación poblacional — ver MARKETS). No es una cifra de GWI per se, sino un cálculo directo sobre universos reales de GWI.",
    "Brasil se agregó a MARKETS en este mismo cambio; su digitalPop (180M) es una estimación poblacional de referencia, no un dato de GWI.",
    "Demografía (género, edad), actitudes, medios y comportamiento digital de cada persona son datos reales de GWI Core Brasil, verificados 1:1 vía chat_gwi + explore_insight_gwi.",
    "GWI no devolvió desagregación geográfica por debajo del nivel 'Rio de Janeiro' para ninguna de las 3 audiencias — no hay dato de barrio/ciudad específico disponible.",
    "SceneHunterRJ: la edad se verificó completa para 35-44 (26%), 45-54 (24.9%) y 55-64 (21.9%); el 27.2% restante (16-24 + 25-34) no tuvo muestra suficiente para desagregarse en GWI — se repartió como estimado (13%/14%) y se marca aquí explícitamente como no verificado 1:1 con GWI, a diferencia del resto de la demografía de esta persona.",
    "Bloques del customer journey sin dato específico de GWI para ese horario quedan señalados como tal en el campo de activación, en vez de inventar una cifra — ver metodología en README.",
    "La cita de cada persona es un placeholder pendiente de reemplazo por el equipo creativo — nunca se fabricó una cita real.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "urban-elite-rj",
      name: "Bianca Ferreira",
      archetype: "La Anfitriona Confiada",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Adulta de 25 a 44 años en Rio de Janeiro, seguras de sí mismas y sociables, pero definidas por GWI como poco propensas a probar cosas nuevas primero y sin sentirse especialmente adineradas o ambiciosas. Su vida social gira en torno a un círculo ya establecido — familia y amigos de siempre — más que a la novedad.",
      aiInsight: aiInsight(
        "Cruza con una audiencia de retención, no de conquista: GWI la define explícitamente como cautelosa frente a lo nuevo (criterio de la propia audiencia), así que el objetivo de medios no es 'hacerla descubrir' sino reforzar el ritual social que ya tiene con su círculo cercano.",
        [
          { label: "La lealtad ya ganada es el activo, no la novedad", detail: "Por definición de la propia audiencia GWI, evita ser la primera en probar cosas nuevas — el mensaje de 'descubre algo distinto' rinde menos que reforzar el hábito/ritual ya instalado." },
          { label: "El círculo familiar decide, no solo el individuo", detail: "83% valora mucho pasar tiempo en familia — el plan nocturno debe convivir con esa identidad, no competir con ella; funciona mejor como premio bien merecido que como escape." },
          { label: "Instagram y WhatsApp cumplen roles distintos", detail: "58% usa Instagram más de una vez al día (inspiración/estatus) y 77% usa WhatsApp más de una vez al día (coordinación real del plan) — separar creatividad de conversión entre ambos canales." },
        ]
      ),
      sharePct: 20,
      demographics: {
        genderSplit: { male: 47, female: 53 },
        ageBands: [
          { label: "16-24", pct: 14 },
          { label: "25-34", pct: 36 },
          { label: "35-44", pct: 50 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Rio de Janeiro — sin desagregación por barrio/ciudad disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Se sienten confiadas y seguras de sí mismas", pct: 77 },
        { label: "Priorizan pasar tiempo en familia", pct: 83 },
        { label: "Cuidan mucho su apariencia/imagen personal", pct: 65 },
        { label: "Se consideran sociables y extrovertidas", pct: 59 },
      ],
      barriers: [
        { label: "Baja apertura a versiones sin alcohol o bajas en alcohol — prefieren la bebida tradicional", pct: 49 },
      ],
      digitalInterests: [
        { label: "Instagram como red social favorita", index: 106 },
        { label: "Interés en salir a comer / restaurantes", index: 137 },
        { label: "Uso de redes sociales para encontrar contenido de tendencia", index: 105 },
      ],
      media: [
        { label: "Instagram (más de una vez al día)", pct: 58 },
        { label: "WhatsApp (más de una vez al día)", pct: 77 },
        { label: "Navega redes sociales a diario o casi a diario", pct: 68 },
        { label: "TV internacional en la franja 5-7pm", pct: 51 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes sociales", "Instagram, WhatsApp", "Sin dato específico de GWI para este bloque horario — contenido genérico de marca/awareness."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / casa", "WhatsApp", "WhatsApp, Instagram", "Sin dato específico de GWI para este bloque — coordinación de planes vía WhatsApp (77% lo usa más de una vez al día en general)."),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / restaurantes", "Redes sociales", "Instagram", "Sin dato específico de GWI para este bloque horario — alto interés general en salir a comer (79%, índice 137)."),
        daypart("La tarde", "3 a 6 pm", "Casa / trabajo", "TV internacional", "TV, Instagram", "49% ve TV internacional en la franja de 2 a 5pm los fines de semana — ventana de refuerzo con contenido en TV + redes."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "TV internacional", "TV, WhatsApp", "51% ve TV internacional entre 5 y 7pm (índice 112) — la franja con mejor dato verificado por GWI para esta audiencia."),
        daypart("Noche", "8 a 11 pm", "Casa / bares", "Redes sociales", "Instagram, WhatsApp", "Sin dato específico de GWI para este bloque — 68% navega redes sociales a diario o casi a diario en general."),
      ],
    },
    {
      id: "scene-hunter-rj",
      name: "Rodrigo Andrade",
      archetype: "El Cazador de Escena",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "El más maduro de los tres arquetipos (Gen X, con sobre-representación en 55-64 años). Investiga antes de decidir, confía en reseñas y controla activamente la música/el ambiente de sus salidas — no improvisa, cura su propia experiencia social. Se declara con frecuencia sobrecargado de trabajo y algo propenso a la ansiedad.",
      aiInsight: aiInsight(
        "Cruza con un patrón de 'permiso informado' antes de salir: investiga (72%) y confía en reseñas (52%) antes de comprometerse con un plan — no es impulsivo, necesita evidencia social de que el plan vale la pena, sobre todo estando sobrecargado de trabajo (30%).",
        [
          { label: "Decide con la cabeza antes de soltarse con el cuerpo", detail: "72% investiga productos/lugares en línea antes de decidir y 52% confía en reseñas — una recomendación curada pesa más que un anuncio llamativo." },
          { label: "Sale a desestresarse, no a improvisar", detail: "30% se siente sobrecargado de trabajo y esta audiencia es más propensa a la ansiedad que el promedio — la propuesta de valor es 'un plan ya resuelto, sin sorpresas', no 'aventura espontánea'." },
          { label: "Es maduro pero no desconectado", detail: "95% accede a internet por celular durante todo el día pese al perfil más adulto (sobre-representación Gen X y 55-64 años) — no asumir bajo consumo digital solo por edad." },
        ]
      ),
      sharePct: 47,
      demographics: {
        genderSplit: { male: 45, female: 56 },
        ageBands: [
          { label: "16-24", pct: 13 },
          { label: "25-34", pct: 14 },
          { label: "35-44", pct: 26 },
          { label: "45-54", pct: 25 },
          { label: "55-64", pct: 22 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Rio de Janeiro — sin desagregación por barrio/ciudad disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Investigan productos o lugares en línea antes de decidir", pct: 72 },
        { label: "Confían en reseñas online para elegir dónde ir", pct: 52 },
        { label: "Buscan las mejores promociones/descuentos", pct: 52 },
        { label: "Les interesa estar al tanto de lo que pasa en el mundo", pct: 55 },
      ],
      barriers: [
        { label: "Bajo interés en spirits sin alcohol/bajos en alcohol como sustituto", pct: 64 },
        { label: "Se sienten sobrecargados de trabajo — menos tiempo/energía disponible para salir", pct: 30 },
      ],
      digitalInterests: [
        { label: "Confían en reseñas online", index: 125 },
        { label: "Investigan productos en línea antes de comprar", index: 105 },
        { label: "Uso de sitios/apps de noticias", index: 112 },
      ],
      media: [
        { label: "Uso de sitios/apps de noticias (último mes)", pct: 57 },
        { label: "Lectura de prensa online diaria", pct: 41 },
        { label: "TV abierta a diario o casi a diario", pct: 36 },
        { label: "TV en horario 10pm-12am", pct: 43 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Internet / organización del día", "Apps de organización, noticias", "24% usa internet para organizar su día a día en la mañana — buen momento para contenido informativo (ej. agenda de eventos de la semana)."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Celular / noticias", "Apps de noticias", "Sin dato específico de GWI para este bloque — 95% accede a internet desde el celular durante todo el día."),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Prensa online", "Sitios y apps de noticias", "Sin dato específico de GWI para este bloque horario — 57% usó sitios/apps de noticias en el último mes."),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Celular", "Apps, redes", "Sin dato específico de GWI para este bloque horario."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Celular", "Juegos, apps", "Sin dato específico de GWI para este bloque — 74% usa el celular para jugar durante tiempos muertos."),
        daypart("Noche", "8 a 11 pm", "Casa / bar curado por reseñas", "TV / celular", "TV, reseñas online", "43% prefiere ver TV en el horario de 10pm a 12am — el consumo se extiende hasta tarde, coherente con salidas nocturnas más tardías y decididas con antelación."),
      ],
    },
    {
      id: "camaleon-ambicioso-rj",
      name: "Yasmin Costa",
      archetype: "El Camaleón Ambicioso",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "El arquetipo más joven (16-34, alto ingreso, mayoría Gen Z). Ambiciosa, enfocada en su carrera, abierta de mente y con un índice muy alto de querer ser la primera en probar cosas nuevas — early adopter y líder de opinión dentro de su círculo, con alta actividad de publicación en redes.",
      aiInsight: aiInsight(
        "Cruza con el perfil clásico de early adopter/líder de opinión: quiere ser la primera en probar (índice 255) y se ve a sí misma como ambiciosa (índice 249) — es la audiencia ideal para sembrar tendencia antes de un push masivo, no para un mensaje genérico de marca.",
        [
          { label: "Prueba todo primero, pero se aburre rápido sin novedad constante", detail: "64% quiere ser la primera en probar cosas nuevas (índice 255) — la marca necesita un flujo constante de lanzamientos/ediciones limitadas, no una campaña estática." },
          { label: "Publica su vida social como parte de su marca personal", detail: "Publica opiniones sobre tecnología, gaming y vida nocturna muy por encima del promedio, y paga con frecuencia por suscripciones/compras dentro de apps — el contenido de marca debe ser material co-creable, no solo consumible." },
          { label: "El precio no es la barrera, la relevancia sí", detail: "Sensibilidad al precio ligeramente por debajo del promedio (48%) — comunicar exclusividad/edición limitada rinde más que un descuento." },
        ]
      ),
      sharePct: 33,
      demographics: {
        genderSplit: { male: 47, female: 53 },
        ageBands: [
          { label: "16-24", pct: 40 },
          { label: "25-34", pct: 60 },
          { label: "35-44", pct: 0 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Rio de Janeiro — sin desagregación por barrio/ciudad disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Se sienten seguras y confiadas de sí mismas", pct: 75 },
        { label: "Se consideran ambiciosas", pct: 73 },
        { label: "Les gusta ser las primeras en probar cosas nuevas", pct: 64 },
        { label: "Se consideran de mente abierta", pct: 73 },
      ],
      barriers: [
        { label: "El precio no es una barrera fuerte (sensibilidad al precio 3% por debajo del promedio) — la barrera real es la necesidad constante de novedad", pct: 48 },
      ],
      digitalInterests: [
        { label: "Interés en explorar otras culturas/países", index: 133 },
        { label: "Cuidan mucho su apariencia personal", index: 151 },
        { label: "Les gusta ser las primeras en probar cosas nuevas", index: 255 },
      ],
      media: [
        { label: "Pagaron suscripción de streaming de música (último mes)", pct: 61 },
        { label: "Suelen tener música sonando durante sus actividades diarias", pct: 82 },
        { label: "Usan internet para organizar su día a día", pct: 45 },
        { label: "TV internacional en horario 10pm-medianoche", pct: 49 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Internet / organización del día", "Apps, redes", "45% usa internet para organizar su día a día — más que el promedio (índice 142)."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / universidad", "Música / streaming", "Spotify y similares", "Sin dato específico de GWI para este bloque — 82% suele tener música sonando mientras hace sus actividades diarias."),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / universidad", "TV internacional", "TV", "46% ve TV internacional en la franja de 2 a 5pm entre quienes la ven con frecuencia."),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "TV internacional", "TV, redes", "55% ve TV internacional en la franja de 5 a 7pm entre quienes la ven con frecuencia — la franja más fuerte verificada."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes sociales", "Instagram, apps", "Sin dato específico de GWI para este bloque horario."),
        daypart("Noche", "8 a 11 pm", "Casa / salidas", "TV / redes", "TV, streaming", "49% prefiere ver TV en el horario de 10pm a medianoche — la noche se extiende hasta tarde para este perfil."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 6 — AUTOMOTRIZ (plantilla ilustrativa — GWI Automotive)
// ---------------------------------------------------------------------------
const CASE_AUTOMOTRIZ = {
  id: "lanzamiento-suv-hibrido-electrico",
  name: "Lanzamiento de SUV híbrido/eléctrico",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Automotive)",
  insightNote:
    "Separando al comprador movido por innovación/sostenibilidad del comprador movido por practicidad familiar, porque el argumento de venta que convence a uno repele al otro.",
  funnelSteps: [
    { label: "Interesados en comprar carro en los próximos 12 meses", pct: 22 },
    { label: "Consideran opciones híbridas o eléctricas", pct: 33 },
    { label: "Investigan activamente online antes de comprar", pct: 55 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "early-adopter-electrico",
      name: "Felipe Contreras",
      archetype: "El Early Adopter Eléctrico",
      quote: "Ya no se trata de ahorrar gasolina, se trata de manejar la tecnología del futuro hoy.",
      description:
        "Motivado por innovación y sostenibilidad. Sigue de cerca la evolución de la movilidad eléctrica y quiere ser de los primeros en adoptarla en su círculo.",
      sharePct: 42,
      aiInsight: aiInsight(
        "Cruza con la carrera de estatus tecnológico que reemplazó al estatus de marca tradicional en autos: para este comprador, la autonomía de la batería y el software del carro son hoy lo que antes era la potencia del motor — el argumento de venta es innovación, no ahorro.",
        [
          { label: "La autonomía es la nueva potencia", detail: "Compara specs de autonomía/carga tan obsesivamente como antes se comparaba caballos de fuerza — el contenido técnico detallado genera más conversión que el emocional." },
          { label: "La ansiedad de autonomía es la barrera real", detail: "Más que el precio, lo frena la duda sobre la red de carga disponible — mapear puntos de carga cercanos en la comunicación reduce fricción directa." },
          { label: "Quiere ser el primero en su grupo", detail: "El valor social de 'ya tengo uno' antes que sus pares es un motivador fuerte — programas de referidos entre early adopters pueden ser más efectivos que pauta masiva." },
        ]
      ),
      demographics: {
        genderSplit: { male: 66, female: 34 },
        ageBands: [
          { label: "16-24", pct: 4 },
          { label: "25-34", pct: 24 },
          { label: "35-44", pct: 36 },
          { label: "45-54", pct: 25 },
          { label: "55-64", pct: 9 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 44 },
          { city: "Medellín", pct: 23 },
          { city: "Cali", pct: 13 },
          { city: "Barranquilla", pct: 9 },
          { city: "Bucaramanga", pct: 7 },
          { city: "Cartagena", pct: 4 },
        ],
      },
      motivations: [
        { label: "Innovación / tecnología de punta", pct: 76 },
        { label: "Sostenibilidad / impacto ambiental", pct: 61 },
        { label: "Ahorro en combustible a largo plazo", pct: 55 },
        { label: "Ser reconocido como innovador en su círculo", pct: 39 },
      ],
      barriers: [
        { label: "Red de puntos de carga insuficiente", pct: 60 },
        { label: "Precio de compra inicial alto", pct: 53 },
        { label: "Autonomía real vs. anunciada", pct: 41 },
        { label: "Poca oferta de modelos en el mercado local", pct: 30 },
      ],
      digitalInterests: [
        { label: "Foros y reviews técnicos de autos eléctricos", index: 188 },
        { label: "Comparadores de autonomía/carga", index: 175 },
        { label: "Noticias de tecnología automotriz", index: 163 },
      ],
      media: [
        { label: "YouTube", pct: 82 },
        { label: "Foros especializados", pct: 58 },
        { label: "Instagram", pct: 55 },
        { label: "Podcasts de tecnología", pct: 47 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Noticias tech", "YouTube, foros", "Novedades de modelos y actualizaciones de software."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Foros", "Foros especializados", "Compara specs de autonomía entre modelos.", [
          { label: "Comparando specs técnicas", pct: 20, index: 178 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, mapas de puntos de carga", "Revisa disponibilidad de puntos de carga en su ciudad.", [
          { label: "Buscando puntos de carga", pct: 16, index: 171 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "YouTube", "YouTube", "Ve reviews en video de modelos que le interesan."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Instagram", "Sigue cuentas de entusiastas de autos eléctricos."),
        daypart("Noche", "8 a 11 pm", "Casa", "Foros", "Foros, WhatsApp", "Discute con otros entusiastas sobre su próxima compra.", [
          { label: "Participando en comunidades de EV", pct: 13, index: 182 },
        ]),
      ],
    },
    {
      id: "comprador-pragmatico",
      name: "Diana Ceballos",
      archetype: "El Comprador Pragmático",
      quote: "Necesito que el carro nuevo funcione para mi familia y mi bolsillo, no para presumir tecnología.",
      description:
        "Compra pensando en la familia: espacio, seguridad, confiabilidad y financiamiento accesible. La tecnología híbrida le interesa solo si resuelve un problema concreto (ahorro, mantenimiento).",
      sharePct: 58,
      aiInsight: aiInsight(
        "Cruza con la presión del costo de vida sobre decisiones de compra grandes: para este comprador un híbrido no es una declaración de valores, es una calculadora de ahorro a 5 años — si el mensaje no resuelve la cuenta, no hay decisión.",
        [
          { label: "Decide con calculadora, no con emoción", detail: "Una herramienta simple de 'cuánto ahorras en 5 años' puede pesar más en la decisión que cualquier campaña emocional." },
          { label: "El financiamiento importa tanto como el precio de lista", detail: "La cuota mensual y las condiciones de crédito son el filtro real de compra, no el precio total del vehículo." },
          { label: "La familia decide en conjunto", detail: "La decisión de compra rara vez es individual — contenido pensado para ver/discutir en pareja o familia convierte mejor que el dirigido a un solo comprador." },
        ]
      ),
      demographics: {
        genderSplit: { male: 48, female: 52 },
        ageBands: [
          { label: "16-24", pct: 3 },
          { label: "25-34", pct: 22 },
          { label: "35-44", pct: 38 },
          { label: "45-54", pct: 27 },
          { label: "55-64", pct: 8 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 36 },
          { city: "Medellín", pct: 21 },
          { city: "Cali", pct: 16 },
          { city: "Barranquilla", pct: 12 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 6 },
        ],
      },
      motivations: [
        { label: "Espacio y comodidad para la familia", pct: 72 },
        { label: "Ahorro en combustible/mantenimiento", pct: 66 },
        { label: "Seguridad y confiabilidad de marca", pct: 60 },
        { label: "Condiciones de financiamiento accesibles", pct: 54 },
      ],
      barriers: [
        { label: "Precio de compra inicial alto", pct: 62 },
        { label: "Desconfianza en costos de mantenimiento a futuro", pct: 46 },
        { label: "Poca experiencia previa con híbridos", pct: 38 },
        { label: "Proceso de crédito complicado", pct: 33 },
      ],
      digitalInterests: [
        { label: "Comparadores de financiamiento/crédito", index: 161 },
        { label: "Reseñas de confiabilidad a largo plazo", index: 154 },
        { label: "Contenido familiar / de seguridad vial", index: 140 },
      ],
      media: [
        { label: "Facebook", pct: 74 },
        { label: "YouTube", pct: 63 },
        { label: "WhatsApp", pct: 88 },
        { label: "Portales de clasificados de autos", pct: 57 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "WhatsApp familiar", "WhatsApp", "Coordina con la familia la visita al concesionario."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Búsqueda", "Google, portales de autos", "Compara precios y condiciones de financiamiento.", [
          { label: "Comparando financiamiento", pct: 19, index: 159 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "YouTube", "YouTube", "Ve reviews de confiabilidad y mantenimiento.", [
          { label: "Viendo reviews de confiabilidad", pct: 15, index: 148 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Facebook", "Facebook", "Ve testimonios de otros compradores en grupos."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "WhatsApp", "WhatsApp", "Discute la decisión final con la familia."),
        daypart("Noche", "8 a 11 pm", "Casa", "Portales", "Portales de autos", "Agenda una prueba de manejo para el fin de semana."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 7 — TECNOLOGÍA DE CONSUMO (plantilla ilustrativa — GWI Consumer Tech)
// ---------------------------------------------------------------------------
const CASE_CONSUMER_TECH = {
  id: "lanzamiento-smartphone-wearable",
  name: "Lanzamiento de smartphone / wearable",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Consumer Tech)",
  insightNote:
    "Separando a quien compra tecnología por la marca/novedad de quien compra por necesidad funcional, para no gastar presupuesto de 'hype' en quien solo quiere que el dispositivo le dure.",
  funnelSteps: [
    { label: "Compran gadgets tecnológicos nuevos cada año", pct: 30 },
    { label: "Siguen reviews de tecnología antes de comprar", pct: 52 },
    { label: "Dispuestos a pagar un premium por marca", pct: 38 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "coleccionista-gadgets",
      name: "Nicolás Peña",
      archetype: "El Coleccionista de Gadgets",
      quote: "No necesito el nuevo modelo, lo quiero — y eso ya es suficiente razón.",
      description:
        "Compra el último modelo de cada categoría (teléfono, reloj, audífonos) apenas sale. Sigue reviews técnicos exhaustivos y es un evangelista de marca en su círculo.",
      sharePct: 40,
      aiInsight: aiInsight(
        "Cruza con la gamificación del ciclo de lanzamientos anuales: para esta audiencia el evento de lanzamiento ES el producto, tanto como el dispositivo mismo — perderse la keynote se siente casi como perderse el producto.",
        [
          { label: "El evento de lanzamiento es contenido en sí mismo", detail: "El engagement pico ocurre durante la transmisión del anuncio, no en el post-review — vale la pena activar pauta en tiempo real durante el evento." },
          { label: "Evangeliza sin que se lo pidan", detail: "Recomienda proactivamente a su círculo apenas compra — un programa de referidos simple puede capturar ese impulso natural." },
          { label: "El ecosistema pesa más que el dispositivo suelto", detail: "Decide pensando en cómo el nuevo gadget se integra con lo que ya tiene — comunicar el ecosistema completo convierte mejor que un producto aislado." },
        ]
      ),
      demographics: {
        genderSplit: { male: 64, female: 36 },
        ageBands: [
          { label: "16-24", pct: 21 },
          { label: "25-34", pct: 37 },
          { label: "35-44", pct: 25 },
          { label: "45-54", pct: 12 },
          { label: "55-64", pct: 4 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 42 },
          { city: "Medellín", pct: 24 },
          { city: "Cali", pct: 12 },
          { city: "Barranquilla", pct: 10 },
          { city: "Bucaramanga", pct: 7 },
          { city: "Cartagena", pct: 5 },
        ],
      },
      motivations: [
        { label: "Ser de los primeros en tener lo último", pct: 78 },
        { label: "Especificaciones técnicas superiores", pct: 65 },
        { label: "Ecosistema de marca (dispositivos conectados)", pct: 58 },
        { label: "Estatus dentro de su círculo", pct: 44 },
      ],
      barriers: [
        { label: "Precio elevado de lanzamiento", pct: 55 },
        { label: "Mejoras marginales vs. modelo anterior", pct: 42 },
        { label: "Disponibilidad limitada al lanzamiento", pct: 34 },
        { label: "Ciclo de vida corto antes del siguiente modelo", pct: 27 },
      ],
      digitalInterests: [
        { label: "Reviews técnicos detallados", index: 181 },
        { label: "Comparadores de especificaciones", index: 172 },
        { label: "Comunidades de entusiastas de tecnología", index: 159 },
      ],
      media: [
        { label: "YouTube", pct: 86 },
        { label: "Instagram", pct: 74 },
        { label: "Foros especializados", pct: 61 },
        { label: "Twitter/X", pct: 55 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Noticias tech", "Twitter/X, YouTube", "Rumores y filtraciones del próximo lanzamiento."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "YouTube", "YouTube", "Ve reviews detallados de especificaciones.", [
          { label: "Viendo reviews técnicos", pct: 24, index: 176 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Foros", "Foros especializados", "Compara specs con su dispositivo actual.", [
          { label: "Comparando especificaciones", pct: 18, index: 169 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Instagram", "Instagram", "Sigue unboxings de otros usuarios."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Tienda online", "App de la marca / e-commerce", "Preordena el nuevo dispositivo apenas abre la venta.", [
          { label: "Preordenando el producto", pct: 11, index: 190 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes", "YouTube, Instagram", "Comparte su compra o espera ansiosamente la entrega."),
      ],
    },
    {
      id: "usuaria-funcional",
      name: "Paola Sánchez",
      archetype: "La Usuaria Funcional",
      quote: "Mi celular tiene que aguantarme el día completo, lo demás me da igual.",
      description:
        "Compra tecnología por necesidad y durabilidad, no por hype. Prioriza batería, cámara útil y buen precio; cambia de dispositivo solo cuando el actual falla o queda obsoleto.",
      sharePct: 60,
      aiInsight: aiInsight(
        "Cruza con la fatiga de upgrades anuales: para esta audiencia el ciclo de 'nuevo modelo cada año' no genera deseo, genera cansancio — el mensaje que funciona es 'dura más', no 'es más nuevo'.",
        [
          { label: "Compra cuando falla, no cuando sale lo nuevo", detail: "El ciclo de decisión está atado a la vida útil del dispositivo actual, no al calendario de lanzamientos — la pauta estacional de 'lanzamiento' le llega en el momento equivocado." },
          { label: "La batería es el argumento #1", detail: "Duración de batería pesa más en la decisión que cámara o diseño — liderar la comunicación con eso en vez de con especificaciones que no entiende ni le importan." },
          { label: "Confía en el precio medio, desconfía del extremo", detail: "Tanto lo muy barato (dudas de calidad) como lo muy caro (percepción de gasto innecesario) generan fricción — el punto óptimo de precio-confianza está en el medio." },
        ]
      ),
      demographics: {
        genderSplit: { male: 39, female: 61 },
        ageBands: [
          { label: "16-24", pct: 14 },
          { label: "25-34", pct: 28 },
          { label: "35-44", pct: 30 },
          { label: "45-54", pct: 19 },
          { label: "55-64", pct: 7 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 35 },
          { city: "Medellín", pct: 19 },
          { city: "Cali", pct: 16 },
          { city: "Barranquilla", pct: 13 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 8 },
        ],
      },
      motivations: [
        { label: "Duración de batería", pct: 71 },
        { label: "Buena relación calidad-precio", pct: 68 },
        { label: "Cámara útil para el día a día", pct: 53 },
        { label: "Facilidad de uso", pct: 47 },
      ],
      barriers: [
        { label: "Precio de los modelos más nuevos", pct: 58 },
        { label: "Complejidad innecesaria de funciones", pct: 39 },
        { label: "Dudas sobre durabilidad de marcas nuevas", pct: 35 },
        { label: "Falta de tiempo para investigar opciones", pct: 29 },
      ],
      digitalInterests: [
        { label: "Comparadores de precio", index: 155 },
        { label: "Reseñas de duración de batería", index: 163 },
        { label: "Ofertas y promociones", index: 158 },
      ],
      media: [
        { label: "Facebook", pct: 70 },
        { label: "Instagram", pct: 66 },
        { label: "WhatsApp", pct: 90 },
        { label: "Marketplaces / e-commerce", pct: 72 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "WhatsApp", "WhatsApp", "Revisa mensajes y notificaciones del día."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes", "Facebook, Instagram", "Ve ofertas de dispositivos en marketplaces.", [
          { label: "Revisando ofertas", pct: 16, index: 151 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, comparadores de precio", "Compara precios entre tiendas.", [
          { label: "Comparando precios", pct: 13, index: 148 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "WhatsApp", "WhatsApp", "Pregunta a conocidos qué modelo recomiendan."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Marketplace", "E-commerce", "Revisa reseñas de duración de batería antes de decidir."),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes", "Instagram", "Descansa del celular una vez decide o compra."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 8 — GAMING (plantilla ilustrativa — GWI Gaming)
// ---------------------------------------------------------------------------
const CASE_GAMING = {
  id: "lanzamiento-videojuego-consola",
  name: "Lanzamiento de videojuego / consola",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Gaming)",
  insightNote:
    "Separando al gamer competitivo (PC/consola, esports) del gamer casual (mobile, sesiones cortas), porque compiten por presupuesto de medios muy distinto.",
  funnelSteps: [
    { label: "Juegan videojuegos semanalmente", pct: 46 },
    { label: "Siguen streamers o esports", pct: 34 },
    { label: "Compran contenido, DLC o suscripciones gaming", pct: 29 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "hardcore-competitivo",
      name: "Julián Restrepo",
      archetype: "El Hardcore Competitivo",
      quote: "Si no estoy jugando, estoy viendo a alguien más jugar mejor que yo para aprender.",
      description:
        "Juega en PC/consola con enfoque competitivo. Sigue esports y streamers de forma casi diaria, e invierte en equipo y contenido para mejorar su desempeño.",
      sharePct: 41,
      aiInsight: aiInsight(
        "Cruza con la profesionalización del gaming como espectáculo: para esta audiencia ver jugar a otros no es un sustituto de jugar, es una forma de entrenamiento y entretenimiento igual de válida — el streaming compite por su tiempo tanto como el juego mismo.",
        [
          { label: "El streamer es más influyente que la marca", detail: "La recomendación de un streamer de confianza convierte mejor que cualquier campaña directa de marca — patrocinios de creadores rinden más que pauta tradicional." },
          { label: "Invierte en rendimiento, no en estética", detail: "Gasta en periféricos y suscripciones que mejoren su desempeño competitivo antes que en cosméticos visuales." },
          { label: "Vive en comunidades, no en plataformas sueltas", detail: "Discord y servidores de comunidad son donde realmente se organiza y decide — más relevante que la red social genérica de la marca." },
        ]
      ),
      demographics: {
        genderSplit: { male: 74, female: 26 },
        ageBands: [
          { label: "16-24", pct: 39 },
          { label: "25-34", pct: 34 },
          { label: "35-44", pct: 17 },
          { label: "45-54", pct: 7 },
          { label: "55-64", pct: 2 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 40 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 14 },
          { city: "Barranquilla", pct: 10 },
          { city: "Bucaramanga", pct: 8 },
          { city: "Cartagena", pct: 6 },
        ],
      },
      motivations: [
        { label: "Mejorar su nivel competitivo", pct: 75 },
        { label: "Seguir a sus streamers/equipos favoritos", pct: 68 },
        { label: "Socializar con su comunidad gamer", pct: 56 },
        { label: "Coleccionar contenido/skins exclusivos", pct: 38 },
      ],
      barriers: [
        { label: "Costo de equipo/periféricos gaming", pct: 54 },
        { label: "Tiempo limitado para jugar y ver streams", pct: 43 },
        { label: "Latencia/calidad de conexión a internet", pct: 37 },
        { label: "Toxicidad en comunidades competitivas", pct: 31 },
      ],
      digitalInterests: [
        { label: "Streams de esports en vivo", index: 195 },
        { label: "Comunidades de Discord de gaming", index: 183 },
        { label: "Reviews de periféricos/hardware gaming", index: 170 },
      ],
      media: [
        { label: "Twitch", pct: 78 },
        { label: "YouTube Gaming", pct: 81 },
        { label: "Discord", pct: 73 },
        { label: "TikTok", pct: 62 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Notificaciones", "Discord, Twitter/X", "Resumen de resultados de esports de la noche anterior."),
        daypart("Final de la mañana", "9 a 12 m", "Universidad / trabajo", "Redes", "YouTube, TikTok", "Ve clips destacados de streamers favoritos.", [
          { label: "Viendo clips de gaming", pct: 22, index: 174 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Universidad / trabajo", "Discord", "Discord", "Coordina partidas con su equipo/grupo.", [
          { label: "Coordinando en Discord", pct: 19, index: 168 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa", "Twitch", "Twitch", "Ve streams en vivo de sus jugadores favoritos."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Juego", "PC / consola", "Juega partidas competitivas."),
        daypart("Noche", "8 a 11 pm", "Casa", "Juego + Discord", "PC / consola, Discord", "Sigue jugando o viendo streams hasta tarde.", [
          { label: "Jugando o viendo streams", pct: 44, index: 179 },
        ]),
      ],
    },
    {
      id: "casual-mobile",
      name: "Camila Torres",
      archetype: "La Casual Mobile",
      quote: "Juego en el bus, en la fila del banco, mientras espero — momentos cortos, sin presión.",
      description:
        "Juega en el celular en sesiones cortas durante el día. Prefiere juegos free-to-play sin gran inversión de tiempo ni dinero, como forma de desconectarse rápido.",
      sharePct: 59,
      aiInsight: aiInsight(
        "Cruza con la fragmentación de la atención en 'micro-momentos': para esta audiencia el juego no compite con otros juegos, compite con Instagram y TikTok por los mismos huecos de tiempo muerto del día — la sesión tiene que dar valor en menos de 3 minutos o pierde.",
        [
          { label: "Compite con redes sociales, no con otros juegos", detail: "El verdadero rival por su atención en el momento de juego es el feed de TikTok, no otro título gaming — la propuesta de valor debe ser 'más satisfactorio que scrollear'." },
          { label: "El gasto es impulsivo y pequeño", detail: "Rara vez planea una compra in-app grande; responde mejor a micro-transacciones de bajo costo en el momento justo de frustración o logro." },
          { label: "Juega para desconectar, no para competir", detail: "A diferencia del gamer competitivo, el mensaje de 'mejora tu ranking' no conecta — el mensaje de 'relájate 5 minutos' sí." },
        ]
      ),
      demographics: {
        genderSplit: { male: 34, female: 66 },
        ageBands: [
          { label: "16-24", pct: 19 },
          { label: "25-34", pct: 29 },
          { label: "35-44", pct: 27 },
          { label: "45-54", pct: 17 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 34 },
          { city: "Medellín", pct: 20 },
          { city: "Cali", pct: 16 },
          { city: "Barranquilla", pct: 13 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 8 },
        ],
      },
      motivations: [
        { label: "Desconectarse/relajarse en tiempos muertos", pct: 70 },
        { label: "Entretenimiento sin compromiso de tiempo", pct: 63 },
        { label: "Jugar gratis sin gastar dinero", pct: 57 },
        { label: "Jugar con amigas/familiares casualmente", pct: 34 },
      ],
      barriers: [
        { label: "Anuncios intrusivos dentro del juego", pct: 61 },
        { label: "Presión de compras dentro de la app", pct: 45 },
        { label: "Consumo de datos/batería del celular", pct: 32 },
        { label: "Pérdida de interés rápido si es repetitivo", pct: 40 },
      ],
      digitalInterests: [
        { label: "Juegos free-to-play casuales", index: 178 },
        { label: "Contenido corto de entretenimiento", index: 161 },
        { label: "Recomendaciones de amigas", index: 144 },
      ],
      media: [
        { label: "TikTok", pct: 76 },
        { label: "Instagram", pct: 71 },
        { label: "App Store / Play Store", pct: 68 },
        { label: "Facebook", pct: 55 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Transporte", "Juego mobile", "App de juego casual", "Sesión corta de juego en el transporte al trabajo."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes", "TikTok, Instagram", "Descansos cortos entre tareas con contenido rápido.", [
          { label: "Jugando en pausas cortas", pct: 21, index: 156 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Juego mobile", "App de juego casual", "Juega mientras almuerza o espera algo.", [
          { label: "Jugando durante el almuerzo", pct: 18, index: 149 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Transporte", "Juego mobile", "App de juego casual", "Sesión corta de regreso a casa."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Instagram, TikTok", "Alterna entre redes sociales y el juego."),
        daypart("Noche", "8 a 11 pm", "Casa", "Juego mobile", "App de juego casual", "Última sesión corta antes de dormir.", [
          { label: "Jugando antes de dormir", pct: 24, index: 152 },
        ]),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 9 — LUJO (plantilla ilustrativa — GWI Luxury)
// ---------------------------------------------------------------------------
const CASE_LUJO = {
  id: "campana-marca-lujo",
  name: "Campaña de marca de lujo (moda/accesorios)",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Luxury)",
  insightNote:
    "Separando al comprador aspiracional que busca mostrar el logo del comprador de lujo silencioso que prioriza calidad y discreción — misma categoría, mensajes opuestos.",
  funnelSteps: [
    { label: "Interés declarado en marcas de lujo", pct: 18 },
    { label: "Alto poder adquisitivo (NSE A/B)", pct: 25 },
    { label: "Compran o aspiran comprar en los próximos 12 meses", pct: 30 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "coleccionista-aspiracional",
      name: "Alejandra Duarte",
      archetype: "La Coleccionista Aspiracional",
      quote: "Cada pieza que compro es una meta cumplida — y quiero que se note.",
      description:
        "Ahorra e invierte para acceder a piezas de marcas reconocidas. El logo visible es parte del valor: comunica estatus y logro personal a su círculo.",
      sharePct: 55,
      aiInsight: aiInsight(
        "Cruza con la 'logomanía' que vuelve a estar en tendencia tras años de lujo silencioso: para esta audiencia el reconocimiento social de la marca es tan importante como la calidad del producto — el logo visible es información, no solo estética.",
        [
          { label: "Ahorra específicamente para la pieza, no compra por impulso", detail: "El proceso de decisión puede tomar meses — contenido de 'wishlist' y notificaciones de disponibilidad tienen sentido en su journey largo." },
          { label: "El unboxing y el empaque son parte del producto", detail: "La experiencia de compra (bolsa, caja, atención en tienda) se comparte tanto como la pieza misma." },
          { label: "Compra el símbolo de logro, no solo el objeto", detail: "Comunicar la pieza como recompensa por un logro personal conecta más que destacar solo materiales o artesanía." },
        ]
      ),
      demographics: {
        genderSplit: { male: 22, female: 78 },
        ageBands: [
          { label: "16-24", pct: 12 },
          { label: "25-34", pct: 34 },
          { label: "35-44", pct: 30 },
          { label: "45-54", pct: 16 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 52 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 10 },
          { city: "Barranquilla", pct: 8 },
          { city: "Cartagena", pct: 5 },
          { city: "Bucaramanga", pct: 3 },
        ],
      },
      motivations: [
        { label: "Reconocimiento social de la marca", pct: 71 },
        { label: "Logro/recompensa personal", pct: 64 },
        { label: "Calidad y durabilidad de materiales", pct: 58 },
        { label: "Valor de reventa de la pieza", pct: 36 },
      ],
      barriers: [
        { label: "Precio de entrada muy alto", pct: 68 },
        { label: "Disponibilidad limitada / listas de espera", pct: 47 },
        { label: "Falta de tiendas físicas en su ciudad", pct: 39 },
        { label: "Autenticidad al comprar fuera de tienda oficial", pct: 33 },
      ],
      digitalInterests: [
        { label: "Contenido editorial de moda de lujo", index: 176 },
        { label: "Reventa/autenticación de piezas de lujo", index: 168 },
        { label: "Viajes de compras internacionales", index: 159 },
      ],
      media: [
        { label: "Instagram", pct: 88 },
        { label: "Revistas digitales de moda", pct: 62 },
        { label: "Pinterest", pct: 57 },
        { label: "TikTok", pct: 49 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Instagram", "Instagram", "Ve contenido editorial de la marca."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes", "Instagram, Pinterest", "Guarda piezas en su wishlist personal.", [
          { label: "Guardando piezas deseadas", pct: 14, index: 165 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, sitio de la marca", "Revisa disponibilidad y precios actualizados.", [
          { label: "Revisando disponibilidad", pct: 10, index: 158 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Instagram", "Instagram", "Sigue a creadoras de contenido de lujo/moda."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa / tienda", "Presencial", "Boutique de la marca", "Visita la tienda para ver/probar la pieza en persona."),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes", "Instagram", "Comparte su compra o sigue soñando con la próxima pieza."),
      ],
    },
    {
      id: "heredero-discreto",
      name: "Martín Uribe",
      archetype: "El Heredero Discreto",
      quote: "Prefiero que la calidad hable por sí sola, no necesito un logo gigante para saber lo que tengo.",
      description:
        "Poder adquisitivo alto y consolidado. Prioriza calidad, artesanía y exclusividad silenciosa por encima de logos visibles — el lujo, para él, es no tener que demostrarlo.",
      sharePct: 45,
      aiInsight: aiInsight(
        "Cruza con la tendencia de 'quiet luxury': para esta audiencia el logo visible es casi una señal de inseguridad social — comunicar exclusividad mediante detalles de artesanía y escasez discreta conecta mucho mejor que la ostentación de marca.",
        [
          { label: "El logo pequeño es un filtro, no un descuido", detail: "Prefiere piezas donde solo otro conocedor reconoce la marca — el marketing dirigido a 'que todos lo vean' lo aleja." },
          { label: "Compra por relación de largo plazo, no por campaña", detail: "Es más receptivo a invitaciones privadas o atención personalizada de un asesor de la marca que a pauta digital masiva." },
          { label: "La artesanía y el proceso importan más que la tendencia", detail: "Contenido sobre el proceso de fabricación y materiales conecta más que campañas de temporada." },
        ]
      ),
      demographics: {
        genderSplit: { male: 63, female: 37 },
        ageBands: [
          { label: "16-24", pct: 3 },
          { label: "25-34", pct: 14 },
          { label: "35-44", pct: 29 },
          { label: "45-54", pct: 32 },
          { label: "55-64", pct: 17 },
          { label: "65+", pct: 5 },
        ],
        topCities: [
          { city: "Bogotá", pct: 55 },
          { city: "Medellín", pct: 20 },
          { city: "Cali", pct: 9 },
          { city: "Cartagena", pct: 8 },
          { city: "Barranquilla", pct: 5 },
          { city: "Bucaramanga", pct: 3 },
        ],
      },
      motivations: [
        { label: "Calidad y artesanía superior", pct: 74 },
        { label: "Exclusividad discreta", pct: 66 },
        { label: "Durabilidad / inversión a largo plazo", pct: 59 },
        { label: "Atención y servicio personalizado", pct: 48 },
      ],
      barriers: [
        { label: "Percepción de sobreprecio por marketing, no calidad", pct: 41 },
        { label: "Falta de piezas verdaderamente discretas", pct: 36 },
        { label: "Poca personalización disponible", pct: 30 },
        { label: "Experiencia de compra poco personalizada", pct: 27 },
      ],
      digitalInterests: [
        { label: "Contenido sobre artesanía y manufactura", index: 164 },
        { label: "Relojería/piezas de colección", index: 172 },
        { label: "Servicios personalizados / a medida", index: 155 },
      ],
      media: [
        { label: "Revistas digitales especializadas", pct: 58 },
        { label: "LinkedIn", pct: 51 },
        { label: "Instagram (cuentas curadas)", pct: 44 },
        { label: "Email de marca / newsletters privadas", pct: 39 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Email", "Newsletters privadas de marca", "Revisa novedades de marcas de su interés."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "LinkedIn", "LinkedIn", "Networking profesional, poco tiempo en redes de consumo."),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Búsqueda", "Google, sitio de la marca", "Investiga procesos de fabricación de una pieza de interés.", [
          { label: "Investigando artesanía/manufactura", pct: 9, index: 161 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Revistas digitales", "Revistas especializadas", "Lee contenido editorial curado sobre relojería/moda."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa / boutique", "Presencial", "Atención personalizada en tienda", "Agenda una cita privada con un asesor de la marca."),
        daypart("Noche", "8 a 11 pm", "Casa", "—", "—", "Poca actividad digital relacionada con la categoría en la noche."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 10 — OCASIONES Y MOMENTOS (plantilla ilustrativa — GWI Moments)
// ---------------------------------------------------------------------------
const CASE_MOMENTOS = {
  id: "planeacion-temporada-alta",
  name: "Planeación de celebración de fin de año / temporada alta",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Moments)",
  insightNote:
    "Separando a quien planea con anticipación de quien decide a último momento, porque necesitan calendarios de pauta completamente distintos.",
  funnelSteps: [
    { label: "Planean celebrar una fecha especial este trimestre", pct: 60 },
    { label: "Compran regalos o planean experiencias con anticipación", pct: 45 },
    { label: "Investigan opciones online antes de decidir", pct: 58 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "planeadora-anticipada",
      name: "Lorena Cifuentes",
      archetype: "La Planeadora Anticipada",
      quote: "Ya tengo la lista de regalos de diciembre hecha desde octubre.",
      description:
        "Organiza celebraciones y regalos con semanas o meses de anticipación. Compara opciones, aprovecha preventas y evita el estrés de última hora.",
      sharePct: 52,
      aiInsight: aiInsight(
        "Cruza con el alargamiento del calendario comercial (Black Friday que ya no es un día sino un mes): esta audiencia empieza a comprar antes de que la marca empiece a comunicar temporada alta — llegar tarde con la campaña significa llegar después de que ya decidió.",
        [
          { label: "Decide antes de que empiece la 'temporada oficial'", detail: "Para cuando la mayoría de marcas lanza su campaña de fin de año, ella ya comparó y decidió — vale la pena adelantar el calendario de medios semanas antes de lo habitual." },
          { label: "Las preventas son su momento de conversión real", detail: "Responde fuertemente a accesos anticipados o preventas exclusivas, más que a el descuento del día pico." },
          { label: "Organiza en listas compartidas", detail: "Usa notas o listas colaborativas con familia — una función de 'compartir lista de regalos' puede facilitar directamente su proceso de decisión." },
        ]
      ),
      demographics: {
        genderSplit: { male: 30, female: 70 },
        ageBands: [
          { label: "16-24", pct: 10 },
          { label: "25-34", pct: 27 },
          { label: "35-44", pct: 32 },
          { label: "45-54", pct: 20 },
          { label: "55-64", pct: 9 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 37 },
          { city: "Medellín", pct: 20 },
          { city: "Cali", pct: 15 },
          { city: "Barranquilla", pct: 12 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 7 },
        ],
      },
      motivations: [
        { label: "Evitar el estrés de última hora", pct: 74 },
        { label: "Aprovechar preventas y mejores precios", pct: 65 },
        { label: "Elegir el regalo perfecto con calma", pct: 59 },
        { label: "Organización y control del presupuesto", pct: 51 },
      ],
      barriers: [
        { label: "No saber qué comprar con tanta anticipación", pct: 40 },
        { label: "Cambios de precio después de comprar temprano", pct: 34 },
        { label: "Poca disponibilidad de ofertas tan pronto", pct: 29 },
        { label: "Presupuesto ajustado en el momento de planear", pct: 37 },
      ],
      digitalInterests: [
        { label: "Listas y organizadores de regalos", index: 169 },
        { label: "Alertas de preventas y descuentos tempranos", index: 177 },
        { label: "Comparadores de precio histórico", index: 158 },
      ],
      media: [
        { label: "Instagram", pct: 78 },
        { label: "Pinterest", pct: 61 },
        { label: "Email / newsletters de marca", pct: 55 },
        { label: "WhatsApp", pct: 84 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Email", "Newsletters de marca", "Revisa ofertas y preventas tempranas."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Pinterest", "Pinterest", "Guarda ideas de regalos para su lista.", [
          { label: "Guardando ideas de regalos", pct: 17, index: 162 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "WhatsApp", "WhatsApp", "Comparte lista de ideas con familia.", [
          { label: "Compartiendo listas en WhatsApp", pct: 22, index: 155 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Búsqueda", "Google, comparadores de precio", "Compara precios antes de comprar con anticipación."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "E-commerce", "Tiendas online", "Realiza compras aprovechando preventas."),
        daypart("Noche", "8 a 11 pm", "Casa", "Instagram", "Instagram", "Revisa contenido de decoración/celebración para inspirarse."),
      ],
    },
    {
      id: "decisor-ultimo-momento",
      name: "Andrés Molina",
      archetype: "El Decisor de Último Momento",
      quote: "Siempre digo que voy a comprar temprano, y siempre termino comprando la última semana.",
      description:
        "Deja la compra de regalos/planes para los últimos días. Prioriza la conveniencia y la rapidez de entrega por encima del precio, y decide bajo presión de tiempo.",
      sharePct: 48,
      aiInsight: aiInsight(
        "Cruza con la economía de la conveniencia de última hora: para esta audiencia el precio deja de ser el criterio principal en los últimos días — lo que compra es velocidad de entrega y disponibilidad garantizada, no el mejor precio del mercado.",
        [
          { label: "En la última semana, la entrega rápida vale más que el descuento", detail: "Comunicar 'entrega garantizada antes de la fecha' convierte más en esos días que cualquier rebaja de precio." },
          { label: "Decide por lo que está disponible, no por lo ideal", detail: "La disponibilidad inmediata pesa más que la preferencia de producto — mostrar stock en tiempo real reduce fricción de decisión." },
          { label: "Alta ansiedad = alta receptividad a ayuda rápida", detail: "Un asistente de compra rápido (chat, recomendador) puede convertir mejor en este segmento que un catálogo extenso para explorar con calma." },
        ]
      ),
      demographics: {
        genderSplit: { male: 57, female: 43 },
        ageBands: [
          { label: "16-24", pct: 16 },
          { label: "25-34", pct: 33 },
          { label: "35-44", pct: 28 },
          { label: "45-54", pct: 15 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 2 },
        ],
        topCities: [
          { city: "Bogotá", pct: 38 },
          { city: "Medellín", pct: 21 },
          { city: "Cali", pct: 14 },
          { city: "Barranquilla", pct: 11 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 7 },
        ],
      },
      motivations: [
        { label: "Conveniencia y rapidez de entrega", pct: 69 },
        { label: "Evitar el esfuerzo de planear con anticipación", pct: 55 },
        { label: "Flexibilidad para decidir según el momento", pct: 44 },
        { label: "Disponibilidad garantizada", pct: 52 },
      ],
      barriers: [
        { label: "Poca disponibilidad de productos populares", pct: 56 },
        { label: "Costos de envío urgente elevados", pct: 48 },
        { label: "Estrés por falta de tiempo para decidir", pct: 45 },
        { label: "Precios más altos por comprar tarde", pct: 39 },
      ],
      digitalInterests: [
        { label: "Entregas exprés / same-day delivery", index: 183 },
        { label: "Buscadores de disponibilidad en tiempo real", index: 170 },
        { label: "Recomendadores rápidos de regalos", index: 152 },
      ],
      media: [
        { label: "Instagram", pct: 72 },
        { label: "Google (búsqueda directa)", pct: 80 },
        { label: "WhatsApp", pct: 86 },
        { label: "Apps de delivery/e-commerce", pct: 75 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "WhatsApp", "WhatsApp", "Recibe recordatorios de la fecha próxima de familiares."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Búsqueda", "Google", "Busca 'regalos para [ocasión] entrega rápida'.", [
          { label: "Buscando opciones de última hora", pct: 20, index: 174 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Apps de delivery", "Apps de e-commerce/delivery", "Revisa disponibilidad y tiempos de entrega.", [
          { label: "Revisando disponibilidad y entrega", pct: 18, index: 168 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "Instagram", "Instagram", "Ve anuncios de última hora de tiendas cercanas."),
        daypart("Fin de la tarde", "6 a 8 pm", "Camino a casa / tienda física", "Presencial", "Tienda cercana", "Compra en tienda física si el envío ya no alcanza a llegar a tiempo."),
        daypart("Noche", "8 a 11 pm", "Casa", "E-commerce", "Apps de e-commerce", "Finaliza la compra online con envío exprés antes del cierre del día."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 11 — VIAJES Y TURISMO (plantilla ilustrativa — GWI Travel)
// ---------------------------------------------------------------------------
const CASE_VIAJES = {
  id: "campana-destino-turistico",
  name: "Campaña de destino turístico",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Travel)",
  insightNote:
    "Separando al viajero independiente que arma su propio itinerario de la familia que planea con más anticipación y prioriza seguridad y comodidad.",
  funnelSteps: [
    { label: "Viajan por placer al menos 1 vez al año", pct: 54 },
    { label: "Investigan destinos activamente en redes/online", pct: 48 },
    { label: "Reservan directamente sin agencia", pct: 42 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "viajero-digital-independiente",
      name: "Sebastián Gómez",
      archetype: "El Viajero Digital Independiente",
      quote: "Armo mi itinerario completo con reseñas y mapas — no necesito que nadie más lo haga por mí.",
      description:
        "Planea y reserva todo su viaje por su cuenta usando apps y comparadores. Busca experiencias auténticas y fuera de lo turístico tradicional.",
      sharePct: 57,
      aiInsight: aiInsight(
        "Cruza con el declive de la agencia de viajes tradicional frente al viajero 'DIY' hiperinformado: esta audiencia no necesita que le vendan el destino, necesita herramientas para armar su propia versión de él — la marca gana influenciando el itinerario, no vendiendo el paquete cerrado.",
        [
          { label: "Arma, no compra, su viaje", detail: "Prefiere piezas sueltas (vuelo, hospedaje, actividades) que un paquete cerrado — la oferta modular convierte mejor que el todo incluido." },
          { label: "Las reseñas de otros viajeros pesan más que la publicidad del destino", detail: "Contenido generado por otros viajeros (fotos reales, itinerarios compartidos) genera más confianza que material oficial de turismo." },
          { label: "Busca lo 'no turístico' como diferenciador", detail: "Comunicar rincones poco conocidos o experiencias locales auténticas conecta más que destacar los íconos más fotografiados del destino." },
        ]
      ),
      demographics: {
        genderSplit: { male: 52, female: 48 },
        ageBands: [
          { label: "16-24", pct: 18 },
          { label: "25-34", pct: 38 },
          { label: "35-44", pct: 26 },
          { label: "45-54", pct: 12 },
          { label: "55-64", pct: 5 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 40 },
          { city: "Medellín", pct: 25 },
          { city: "Cali", pct: 12 },
          { city: "Barranquilla", pct: 9 },
          { city: "Bucaramanga", pct: 8 },
          { city: "Cartagena", pct: 6 },
        ],
      },
      motivations: [
        { label: "Experiencias auténticas / fuera de lo turístico", pct: 72 },
        { label: "Libertad de armar su propio itinerario", pct: 68 },
        { label: "Mejor precio al reservar directamente", pct: 55 },
        { label: "Descubrir lugares poco conocidos", pct: 49 },
      ],
      barriers: [
        { label: "Falta de tiempo para investigar tanto", pct: 44 },
        { label: "Incertidumbre sobre seguridad en destinos nuevos", pct: 37 },
        { label: "Complejidad de coordinar reservas por separado", pct: 33 },
        { label: "Costos ocultos al reservar por su cuenta", pct: 29 },
      ],
      digitalInterests: [
        { label: "Blogs y reseñas de viajeros", index: 187 },
        { label: "Comparadores de vuelos/hospedaje", index: 179 },
        { label: "Mapas y guías colaborativas", index: 165 },
      ],
      media: [
        { label: "Instagram", pct: 84 },
        { label: "YouTube", pct: 70 },
        { label: "Apps de viaje (comparadores)", pct: 88 },
        { label: "TikTok", pct: 65 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Redes", "Instagram, TikTok", "Ve contenido inspiracional de destinos."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Apps de viaje", "Comparadores de vuelos", "Compara precios y fechas de vuelos.", [
          { label: "Comparando vuelos", pct: 16, index: 176 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Blogs", "Blogs de viajeros", "Investiga itinerarios de otros viajeros.", [
          { label: "Investigando itinerarios", pct: 14, index: 169 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Trabajo", "YouTube", "YouTube", "Ve vlogs del destino que está considerando."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Apps de hospedaje", "Apps de reserva directa", "Reserva hospedaje directamente sin agencia."),
        daypart("Noche", "8 a 11 pm", "Casa", "Mapas colaborativos", "Google Maps, apps de viaje", "Arma el itinerario día a día del viaje."),
      ],
    },
    {
      id: "familia-planificadora",
      name: "Catalina Restrepo",
      archetype: "La Familia Planificadora",
      quote: "Con niños no hay espacio para improvisar — todo tiene que estar resuelto antes de salir.",
      description:
        "Planea viajes familiares con bastante anticipación. Prioriza seguridad, comodidad y actividades aptas para todas las edades por encima de la aventura o el precio más bajo.",
      sharePct: 43,
      aiInsight: aiInsight(
        "Cruza con la demanda creciente de turismo 'family-friendly' verificado: para esta audiencia la incertidumbre es el enemigo número uno — cada detalle no resuelto de antemano se vive como un riesgo, no como espontaneidad.",
        [
          { label: "La certeza vale más que el precio más bajo", detail: "Prefiere pagar más por una opción con reseñas específicas de otras familias que arriesgarse con la más barata sin esa validación." },
          { label: "Decide en función de la logística infantil", detail: "Horarios de siesta, distancias, disponibilidad de cunas/sillas son factores de decisión reales — el contenido que resuelve esas dudas puntuales convierte." },
          { label: "El itinerario se decide en familia, la compra la ejecuta uno", detail: "Aunque busca y decide en conjunto (a veces con los hijos), la reserva final la hace una sola persona — la experiencia de checkout debe ser simple para quien cierra la compra." },
        ]
      ),
      demographics: {
        genderSplit: { male: 32, female: 68 },
        ageBands: [
          { label: "16-24", pct: 4 },
          { label: "25-34", pct: 26 },
          { label: "35-44", pct: 40 },
          { label: "45-54", pct: 22 },
          { label: "55-64", pct: 7 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 36 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 15 },
          { city: "Barranquilla", pct: 12 },
          { city: "Bucaramanga", pct: 9 },
          { city: "Cartagena", pct: 6 },
        ],
      },
      motivations: [
        { label: "Seguridad y comodidad para toda la familia", pct: 77 },
        { label: "Actividades aptas para niños", pct: 66 },
        { label: "Todo planeado y confirmado con anticipación", pct: 61 },
        { label: "Buena relación calidad-precio familiar", pct: 50 },
      ],
      barriers: [
        { label: "Costo elevado de viajar con toda la familia", pct: 63 },
        { label: "Falta de información clara sobre servicios para niños", pct: 41 },
        { label: "Logística compleja (vuelos, traslados, horarios)", pct: 38 },
        { label: "Incertidumbre sobre seguridad del destino", pct: 34 },
      ],
      digitalInterests: [
        { label: "Reseñas de viajeros con niños", index: 181 },
        { label: "Comparadores de paquetes familiares", index: 163 },
        { label: "Guías de actividades familiares por destino", index: 158 },
      ],
      media: [
        { label: "Facebook", pct: 76 },
        { label: "Instagram", pct: 68 },
        { label: "WhatsApp", pct: 89 },
        { label: "Blogs de viajes familiares", pct: 54 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "WhatsApp", "WhatsApp familiar", "Coordina la planeación del viaje con la pareja."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / casa", "Blogs", "Blogs de viajes familiares", "Busca reseñas de otras familias sobre el destino.", [
          { label: "Buscando reseñas familiares", pct: 15, index: 172 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / casa", "Búsqueda", "Google, comparadores", "Compara paquetes familiares y precios.", [
          { label: "Comparando paquetes familiares", pct: 13, index: 160 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa", "Facebook", "Grupos de Facebook de viajes", "Pregunta recomendaciones en grupos de padres viajeros."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "WhatsApp", "WhatsApp", "Confirma detalles finales con la familia."),
        daypart("Noche", "8 a 11 pm", "Casa", "E-commerce", "Sitio de reservas", "Finaliza la reserva del paquete completo."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO 12 — TRABAJO Y PROFESIONALES (plantilla ilustrativa — GWI Work)
// ---------------------------------------------------------------------------
const CASE_TRABAJO = {
  id: "lanzamiento-saas-profesionales",
  name: "Herramienta B2B / SaaS para profesionales",
  market: "COL",
  source: "plantilla",
  sourceLabel: "Plantilla ilustrativa — reemplazar con consulta real a GWI (dataset GWI Work)",
  insightNote:
    "Separando al usuario individual que optimiza su propio flujo de trabajo del líder de equipo que decide herramientas para otros, porque el argumento de compra cambia de 'a mí me ayuda' a 'a mi equipo le ayuda'.",
  funnelSteps: [
    { label: "Trabajan en modalidad híbrida o remota", pct: 44 },
    { label: "Usan herramientas digitales de productividad a diario", pct: 62 },
    { label: "Tienen poder de decisión o influencia en compras de software", pct: 28 },
  ],
  footnotes: ["Cifras ilustrativas de referencia.", "Las audiencias finales son excluyentes entre ellas."],
  personas: [
    {
      id: "profesional-remoto-optimizador",
      name: "Tomás Vélez",
      archetype: "El Profesional Remoto Optimizador",
      quote: "Si una herramienta me ahorra 15 minutos al día, la pruebo ese mismo día.",
      description:
        "Trabaja remoto o híbrido y busca constantemente optimizar su flujo personal de trabajo. Prueba herramientas nuevas por su cuenta antes de proponerlas al equipo.",
      sharePct: 47,
      aiInsight: aiInsight(
        "Cruza con la cultura de 'productividad personal como deporte': para esta audiencia adoptar una herramienta nueva es casi un hobby — el punto de entrada más efectivo no es venderle al equipo, es dejar que él la descubra y la traiga como su hallazgo personal.",
        [
          { label: "Prueba antes de pedir permiso", detail: "Suele adoptar una herramienta individualmente antes de proponerla formalmente — un plan freemium robusto puede ser más efectivo que forzar una demo con el equipo desde el inicio." },
          { label: "El ahorro de tiempo es la métrica que le importa", detail: "Comunicar minutos/horas ahorradas por semana convierte mejor que listar funciones." },
          { label: "Es un embajador interno gratuito", detail: "Si la herramienta le resuelve algo real, la recomienda proactivamente en Slack/Teams internos — facilitar que comparta (invitaciones fáciles) multiplica la adopción." },
        ]
      ),
      demographics: {
        genderSplit: { male: 54, female: 46 },
        ageBands: [
          { label: "16-24", pct: 9 },
          { label: "25-34", pct: 41 },
          { label: "35-44", pct: 32 },
          { label: "45-54", pct: 14 },
          { label: "55-64", pct: 3 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 48 },
          { city: "Medellín", pct: 24 },
          { city: "Cali", pct: 11 },
          { city: "Barranquilla", pct: 7 },
          { city: "Bucaramanga", pct: 6 },
          { city: "Cartagena", pct: 4 },
        ],
      },
      motivations: [
        { label: "Ahorrar tiempo en tareas repetitivas", pct: 79 },
        { label: "Mantenerse actualizado en herramientas nuevas", pct: 63 },
        { label: "Mejorar su enfoque/concentración", pct: 54 },
        { label: "Destacar como referente de productividad en su equipo", pct: 37 },
      ],
      barriers: [
        { label: "Curva de aprendizaje de nuevas herramientas", pct: 46 },
        { label: "Costo si no lo cubre la empresa", pct: 51 },
        { label: "Saturación de apps/herramientas ya en uso", pct: 44 },
        { label: "Dudas sobre seguridad de datos corporativos", pct: 35 },
      ],
      digitalInterests: [
        { label: "Reviews y comparadores de herramientas SaaS", index: 173 },
        { label: "Comunidades de productividad", index: 165 },
        { label: "Contenido de automatización de tareas", index: 168 },
      ],
      media: [
        { label: "LinkedIn", pct: 81 },
        { label: "YouTube", pct: 66 },
        { label: "Newsletters de tecnología/productividad", pct: 58 },
        { label: "Twitter/X", pct: 49 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Newsletters", "Email, newsletters tech", "Revisa novedades de herramientas de productividad."),
        daypart("Final de la mañana", "9 a 12 m", "Casa / oficina", "LinkedIn", "LinkedIn", "Ve contenido sobre nuevas formas de trabajar.", [
          { label: "Explorando contenido de productividad", pct: 17, index: 158 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Casa / oficina", "Prueba de producto", "Apps SaaS (trial)", "Prueba una herramienta nueva en su flujo personal.", [
          { label: "Probando herramientas nuevas", pct: 12, index: 171 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa / oficina", "YouTube", "YouTube", "Ve tutoriales para sacarle más provecho a una herramienta."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Slack/Teams interno", "Slack, Teams", "Comparte con el equipo una herramienta que le funcionó."),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes", "Twitter/X, LinkedIn", "Sigue cuentas de productividad y automatización."),
      ],
    },
    {
      id: "lider-equipo-hibrida",
      name: "Manuela Ortiz",
      archetype: "La Líder de Equipo Híbrida",
      quote: "No compro una herramienta para mí, la compro para que mi equipo deje de perder tiempo coordinando.",
      description:
        "Lidera un equipo en modalidad híbrida y tiene influencia real en decisiones de compra de software. Evalúa herramientas pensando en adopción de equipo, seguridad y soporte, no solo en funciones.",
      sharePct: 53,
      aiInsight: aiInsight(
        "Cruza con la fatiga de herramientas fragmentadas en equipos híbridos: para esta audiencia el riesgo real no es elegir la herramienta 'menos buena', es elegir una que su equipo no adopte — la decisión de compra pesa más el riesgo de adopción que el listado de funciones.",
        [
          { label: "Decide pensando en adopción, no en funciones", detail: "Una herramienta con menos funciones pero más fácil de adoptar por todo el equipo gana sobre una más completa pero compleja." },
          { label: "El soporte y onboarding son parte de la decisión de compra", detail: "La disponibilidad de un onboarding guiado o soporte dedicado influye tanto como el precio en la decisión final." },
          { label: "Necesita justificar el gasto hacia arriba", detail: "Valora reportes/casos de éxito que pueda usar para justificar la inversión ante su propio jefe o finanzas." },
        ]
      ),
      demographics: {
        genderSplit: { male: 41, female: 59 },
        ageBands: [
          { label: "16-24", pct: 3 },
          { label: "25-34", pct: 28 },
          { label: "35-44", pct: 41 },
          { label: "45-54", pct: 22 },
          { label: "55-64", pct: 5 },
          { label: "65+", pct: 1 },
        ],
        topCities: [
          { city: "Bogotá", pct: 51 },
          { city: "Medellín", pct: 22 },
          { city: "Cali", pct: 10 },
          { city: "Barranquilla", pct: 7 },
          { city: "Bucaramanga", pct: 6 },
          { city: "Cartagena", pct: 4 },
        ],
      },
      motivations: [
        { label: "Facilitar coordinación de su equipo híbrido", pct: 75 },
        { label: "Reducir tiempo perdido en reuniones/coordinación", pct: 68 },
        { label: "Seguridad y control de datos del equipo", pct: 57 },
        { label: "Soporte y onboarding confiables", pct: 49 },
      ],
      barriers: [
        { label: "Resistencia al cambio de parte del equipo", pct: 53 },
        { label: "Costo por licencia a escala de equipo", pct: 58 },
        { label: "Integración con herramientas ya existentes", pct: 45 },
        { label: "Tiempo de implementación", pct: 36 },
      ],
      digitalInterests: [
        { label: "Casos de éxito y ROI de herramientas SaaS", index: 176 },
        { label: "Comparadores de software B2B", index: 169 },
        { label: "Contenido de liderazgo de equipos híbridos", index: 162 },
      ],
      media: [
        { label: "LinkedIn", pct: 86 },
        { label: "Webinars/eventos virtuales", pct: 61 },
        { label: "Newsletters B2B", pct: 55 },
        { label: "YouTube", pct: 48 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "LinkedIn", "LinkedIn", "Revisa tendencias de gestión de equipos híbridos."),
        daypart("Final de la mañana", "9 a 12 m", "Oficina / casa", "Búsqueda", "Google, comparadores B2B", "Investiga opciones de herramientas para su equipo.", [
          { label: "Comparando software B2B", pct: 14, index: 167 },
        ]),
        daypart("Medio día", "12 m a 3 pm", "Oficina / casa", "Webinars", "Webinars/demos", "Asiste a una demo o webinar de un proveedor.", [
          { label: "Asistiendo a demos/webinars", pct: 9, index: 174 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Oficina / casa", "Slack/Teams interno", "Slack, Teams", "Consulta con su equipo sobre la herramienta evaluada."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Email", "Email corporativo", "Solicita cotización o aprobación de presupuesto."),
        daypart("Noche", "8 a 11 pm", "Casa", "LinkedIn", "LinkedIn", "Lee casos de éxito de otras empresas con la herramienta."),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASOS "gwi-auto-draft" — generados por la rutina diaria de GWI (ver README
// "Automatización diaria de GWI"). Cada uno viene de UNA audiencia real de
// GWI (audience_id documentado abajo) consultada vía chat_gwi/explore_insight_gwi
// el 2026-09-24. A diferencia de los casos anteriores, cada uno trae una sola
// persona (sharePct 100) porque solo hay UNA audiencia real de origen -- no se
// fabrica una segunda persona/segmento sin respaldo de datos. `quote` queda
// como placeholder a propósito: no se inventan testimonios. Pendientes de
// revisión editorial -- ver badge "Borrador automático GWI".
// ---------------------------------------------------------------------------

const CASE_EVENTOS_VIVO_GWI_AUTO_20260924 = {
  id: "eventos-en-vivo-general-colombia",
  name: "Audiencia general de eventos en vivo (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Audiencia real de GWI ('Paramo (co) EventosEnVivoGeneral', audience_id 5190162e-beac-4432-9cba-eed11194afdd) definida solo por interés en eventos en vivo/festivales de música en Colombia.",
  funnelSteps: [
    { label: "Interesados en eventos en vivo como festivales de música (Colombia)", pct: 33 },
  ],
  footnotes: [
    "33% real de GWI Core Colombia (Q4 2025–Q3 2026) — es también el único criterio que define esta audiencia en GWI, así que el embudo no se fracciona más para evitar encadenar cifras de bases distintas sin respaldo real.",
    "Demografía (género y edad) tomada 1:1 de la audiencia real de GWI vía chat_gwi/explore_insight_gwi.",
    "Motivaciones, barreras, medios y geografía: GWI no devolvió crosstabs exclusivos de esta audiencia para estas variables — se usan cifras reales de GWI Core Colombia (población general conectada) como mejor proxy disponible; deben leerse como contexto de categoría, no como diferenciador exclusivo de esta audiencia.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "entusiasta-eventos-vivo-co",
      name: "Camila Rojas",
      archetype: "La Cazadora de Planes en Vivo",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Vive pendiente de la cartelera de conciertos y festivales en Colombia. Es parte del tercio de colombianos conectados que declara interés activo en eventos en vivo, aunque la conversión de ese interés a compra real de boletos sigue siendo la principal fricción de la categoría.",
      aiInsight: aiInsight(
        "Cruza con la brecha estructural entre interés y compra que muestra GWI en Colombia: 33% de los internautas colombianos declara interés en eventos en vivo, pero solo ~15% compró boletos de concierto en los últimos 3-6 meses — la oportunidad de medios no está en generar más interés, sino en remover fricción en el tramo final del funnel (disponibilidad, precio, facilidad de pago).",
        [
          { label: "El cuello de botella es la conversión, no el interés", detail: "Con un interés declarado de 33% y compra real de solo ~15%, más de la mitad del interés se pierde entre el deseo y el boleto — vale más invertir en checkout/retargeting que en awareness adicional." },
          { label: "Colombia usa redes y chat de forma casi universal", detail: "98%+ de los colombianos conectados usa redes sociales y apps de chat cada mes — cualquier activación de venta de boletos debe apoyarse en estos canales antes que en display genérico." },
          { label: "Geografía concentrada en el eje Bogotá-Antioquia-Valle", detail: "Más de la mitad de los internautas colombianos vive en Bogotá D.C., Antioquia o Valle del Cauca (dato de población general, GWI no desagregó esta variable solo para la audiencia) — la logística de gira/venta debería priorizar estas tres plazas." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 45.6, female: 54.4 },
        ageBands: [
          { label: "16-24", pct: 23.8 },
          { label: "25-34", pct: 28.0 },
          { label: "35-44", pct: 22.5 },
          { label: "45-54", pct: 15.9 },
          { label: "55-64", pct: 9.8 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Bogotá D.C.", pct: 28.2 },
          { city: "Antioquia", pct: 14.1 },
          { city: "Valle del Cauca", pct: 9.8 },
          { city: "Cundinamarca", pct: 8.3 },
        ],
      },
      motivations: [
        { label: "Interés declarado en eventos en vivo / festivales de música (Colombia — define la audiencia)", pct: 33 },
        { label: "Compró boletos de concierto en los últimos 3-6 meses (Colombia, GWI Core)", pct: 15 },
        { label: "Planea comprar boletos de concierto en los próximos 3-6 meses (Colombia, GWI Core)", pct: 13 },
      ],
      barriers: [
        { label: "Brecha entre interés declarado (33%) y compra real de boletos (15%) — Colombia, GWI Core", pct: 18 },
        { label: "Solo una minoría tiene plan concreto de compra en los próximos 3-6 meses (Colombia, GWI Core)", pct: 13 },
        { label: "Baja intención de compra de boletos de viaje asociados al plan (Colombia, GWI Core)", pct: 17 },
      ],
      digitalInterests: [],
      media: [
        { label: "Redes sociales (uso mensual, Colombia)", pct: 98.5 },
        { label: "Chat / mensajería tipo WhatsApp (uso mensual, Colombia)", pct: 97.9 },
        { label: "Buscadores (Google, etc. — uso mensual, Colombia)", pct: 89.3 },
        { label: "TikTok para contenido de entretenimiento (Colombia)", pct: 84.3 },
        { label: "Instagram para compartir fotos/videos (Colombia)", pct: 61 },
        { label: "Facebook para compartir fotos/videos (Colombia)", pct: 59.8 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes sociales y noticias", "Instagram, Facebook, Google", "Contenido de anuncio/lineup de próximos eventos.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina / estudio", "Búsqueda y redes", "Google, WhatsApp", "Recordatorio de venta de boletos / preventa.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Redes y mensajería", "Instagram, WhatsApp", "Contenido para compartir con grupo de amigos.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Redes y video online", "TikTok, YouTube, Instagram", "Retargeting a quienes vieron el lineup.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Instagram, TikTok", "CTA directo a compra de boletos.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Instagram", "Últimas entradas / urgencia de compra.", []),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASO GWI-AUTO — Páramo (co) Baum27 — escena electrónica/rave en Colombia,
// procesado 2026-09-24. 3 audiencias reales de GWI, cada una ya un arquetipo
// propio (no requirió elegir un subconjunto como en el caso Jäger): el
// prospecto que ama el género pero aún no asiste (PotencialRavers), la
// asistente que ya publica y amplifica la escena (Amplificadores) y quien
// marca tendencia y decide qué vale la pena para su círculo (Curadores).
// ---------------------------------------------------------------------------
const CASE_BAUM27_GWI_AUTO_20260924 = {
  id: "baum27-escena-electronica-colombia",
  name: "Baum27 — arquetipos de la escena electrónica/rave (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "3 audiencias reales de GWI de la campaña Páramo (co) Baum27: PotencialRavers, Amplificadores de la escena y Curadores.",
  funnelSteps: [
    {
      label:
        "Audiencia combinada de los 3 arquetipos Baum27 sobre población digital de Colombia (universos reales de GWI: ~3.64M + ~572K + ~3.03M ≈ 7.25M sobre 31.06M)",
      pct: 23,
    },
  ],
  footnotes: [
    "23% = universo combinado real de las 3 audiencias (suma de universos verificados vía explore_insight_gwi sobre la pregunta de género) sobre la población digital de Colombia (31.06M, ya usada en MARKETS). Cálculo directo sobre universos reales de GWI, no una cifra de GWI en sí misma.",
    "Demografía, actitudes, medios y comportamiento digital de cada persona son datos reales de GWI Core Colombia, verificados 1:1 vía chat_gwi + explore_insight_gwi.",
    "PotencialRavers está definida por GWI explícitamente como NO interesada actualmente en eventos en vivo pese a que el 100% disfruta música EDM/Dance — es una audiencia de conversión/adquisición, no de retención; Amplificadores y Curadores sí están definidas por un interés activo en eventos en vivo (100%).",
    "Amplificadores de la escena: por tamaño de muestra, GWI solo devolvió una banda de edad con dato robusto (25-34: 29.7%); el resto de bandas no tuvo suficiente muestra para desagregarse — se deja en 0 en vez de inventar un valor, y se complementa con su desglose generacional real (Gen Z 40.3%, Millennial/Gen Y 38.7%) en la descripción de la persona.",
    "Bloques del customer journey sin dato específico de GWI para ese horario quedan señalados como tal en el campo de activación, en vez de inventar una cifra.",
    "La cita de cada persona es un placeholder pendiente de reemplazo por el equipo creativo — nunca se fabricó una cita real.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "raver-en-potencia-co",
      name: "Camilo Tovar",
      archetype: "El Raver en Potencia",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Le encanta la música EDM/Dance (House, Techno) pero GWI lo define explícitamente como alguien que hoy NO se declara interesado en eventos en vivo como festivales — ya es fan del género, todavía no se ve a sí mismo como alguien que va a raves. Es creativo, abierto de mente y valora aprender cosas nuevas.",
      aiInsight: aiInsight(
        "Cruza con una oportunidad de conversión, no de descubrimiento musical: ya ama el género (100% por definición de la audiencia) pero no se identifica con la experiencia en vivo — el freno no es el gusto musical, es no verse a sí mismo como parte de esa escena todavía.",
        [
          { label: "Ya ama la música, falta el primer empujón para ir", detail: "100% disfruta EDM/Dance pero la propia audiencia se define por NO estar interesada en eventos en vivo — el gancho es una 'primera vez sin fricción' (line-up accesible, ir en grupo, entrada de bajo compromiso)." },
          { label: "Es un perfil creativo y abierto, no un raver de nicho", detail: "68% se ve creativo y 47% de mente abierta — el mensaje puede apoyarse en arte/moda/comunidad de forma más amplia, no solo en la escena electrónica hardcore." },
          { label: "Aprende antes de comprometerse", detail: "76% valora aprender nuevas habilidades y 61% usa internet con fines educativos — contenido tipo 'guía para tu primer festival' baja la barrera de entrada mejor que un anuncio de venta directa." },
        ]
      ),
      sharePct: 50,
      demographics: {
        genderSplit: { male: 59, female: 41 },
        ageBands: [
          { label: "16-24", pct: 24 },
          { label: "25-34", pct: 31 },
          { label: "35-44", pct: 22 },
          { label: "45-54", pct: 16 },
          { label: "55-64", pct: 7 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Se sienten creativos", pct: 68 },
        { label: "Valoran aprender nuevas habilidades", pct: 76 },
        { label: "Se consideran de mente abierta", pct: 47 },
        { label: "Se consideran aventureros", pct: 39 },
      ],
      barriers: [
        { label: "No se declaran interesados en eventos en vivo/festivales pese a que disfrutan el género (criterio que define a esta audiencia en GWI)", pct: 100 },
        { label: "Baja importancia de la tradición/herencia como motivador — la nostalgia no es el gancho para este perfil", pct: 26 },
      ],
      digitalInterests: [
        { label: "Disfrutan música EDM/Dance (House, Techno)", index: 281 },
        { label: "Uso de internet con fines educativos", index: 106 },
        { label: "Uso del celular para jugar videojuegos", index: 104 },
      ],
      media: [
        { label: "YouTube para ver/descargar TV, películas o videos (último mes)", pct: 61 },
        { label: "Facebook (más de una vez al día)", pct: 40 },
        { label: "Instagram (más de una vez al día)", pct: 35 },
        { label: "TikTok (más de una vez al día)", pct: 34 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Celular", "Redes, apps", "Sin dato específico de GWI para este bloque — 90% accede a internet por celular durante todo el día."),
        daypart("Final de la mañana", "9 a 12 m", "Universidad / trabajo", "Internet educativo", "Plataformas de estudio", "61% usa internet para fines educativos o de estudio."),
        daypart("Medio día", "12 m a 3 pm", "Universidad / trabajo", "Navegación general", "Redes, YouTube", "48% usa internet para llenar tiempo libre y navegar en general."),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "Redes", "YouTube, Instagram", "Sin dato específico de GWI para este bloque horario."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Celular / juegos", "Apps de juegos", "60% usa el celular para jugar videojuegos — momento de desconexión antes de la noche."),
        daypart("Noche", "8 a 11 pm", "Casa", "Música / streaming", "Apps de música", "69% suele tener música sonando mientras hace sus actividades — alta afinidad sonora incluso sin asistir hoy a eventos en vivo."),
      ],
    },
    {
      id: "amplificadora-escena-co",
      name: "Laura Gómez",
      archetype: "La Amplificadora de la Escena",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "A diferencia de El Raver en Potencia, esta audiencia SÍ está definida por un interés activo en eventos en vivo (100%) y en música (86%). Mayoría Gen Z (40.3%) y Millennial (38.7%). Es social, extrovertida, creativa y toma riesgos — y publica sobre su vida social en redes muy por encima del promedio, funcionando como caja de resonancia de la escena.",
      aiInsight: aiInsight(
        "Cruza con un perfil que ya es medio, no solo audiencia: usa Instagram y TikTok para publicar contenido propio muy por encima del promedio — el valor de marca no está en convencerla de ir, está en darle material que valga la pena amplificar.",
        [
          { label: "Ya es medio, no solo audiencia", detail: "67% de quienes usan Instagram publican fotos/videos (índice 106) y 51% hace lo mismo en TikTok (índice 129) — tratarla como creadora, no como espectadora, diseñando momentos pensados para grabarse." },
          { label: "Busca el descuento sin dejar de sentirse exclusiva", detail: "40% usa cupones/códigos de descuento pese a valorar destacar y ser social — combos grupales o preventa temprana funcionan mejor que un descuento genérico." },
          { label: "Es joven pero cuidadosa con su huella digital", detail: "31% le preocupa cómo el gobierno rastrea su actividad online — evitar pedir datos personales de más en el registro o compra de boletos." },
        ]
      ),
      sharePct: 8,
      demographics: {
        genderSplit: { male: 47, female: 53 },
        ageBands: [
          { label: "16-24", pct: 0 },
          { label: "25-34", pct: 30 },
          { label: "35-44", pct: 0 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Se consideran sociables y extrovertidas", pct: 54 },
        { label: "Se consideran creativas", pct: 75 },
        { label: "Se consideran aventureras", pct: 51 },
        { label: "Sienten que toman riesgos", pct: 45 },
      ],
      barriers: [
        { label: "Les preocupa cómo el gobierno rastrea su actividad online", pct: 31 },
      ],
      digitalInterests: [
        { label: "Son parte de la Generación Z", index: 123 },
        { label: "Se consideran sociables y extrovertidas", index: 147 },
        { label: "Se consideran de mente abierta", index: 128 },
      ],
      media: [
        { label: "TikTok (más de una vez al día)", pct: 48 },
        { label: "Instagram (más de una vez al día)", pct: 45 },
        { label: "Facebook (más de una vez al día)", pct: 41 },
        { label: "Publican fotos/video en Instagram (sobre usuarios de Instagram)", pct: 67 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Redes sociales", "Instagram, TikTok", "Sin dato específico de GWI para este bloque."),
        daypart("Final de la mañana", "9 a 12 m", "Universidad / trabajo", "Redes sociales", "Instagram, Facebook", "47% usa redes sociales principalmente para leer noticias."),
        daypart("Medio día", "12 m a 3 pm", "Universidad / trabajo", "Redes sociales", "Instagram, TikTok", "46% usa redes sociales para encontrar contenido nuevo."),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "Redes sociales", "TikTok", "Sin dato específico de GWI para este bloque horario."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "TikTok", "TikTok", "48% usa TikTok más de una vez al día (índice 141) — franja fuerte de consumo de video corto."),
        daypart("Noche", "8 a 11 pm", "Casa / salidas", "Instagram", "Instagram", "45% usa Instagram más de una vez al día (índice 128) y publica contenido de sus salidas (67% comparte fotos/videos en Instagram)."),
      ],
    },
    {
      id: "curador-escena-co",
      name: "Daniel Rueda",
      archetype: "El Curador de la Escena",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "También definido por un interés activo en la escena (interesado en explorar y estar al tanto de tendencias), pero su rol es distinto al de la Amplificadora: no solo comparte, decide qué vale la pena para su círculo. Sigue tendencias tecnológicas de cerca, quiere ser el primero en probar cosas nuevas y publica opiniones en categorías muy diversas — música, arte, tecnología, incluso finanzas.",
      aiInsight: aiInsight(
        "Cruza con el rol de tastemaker cultural: no sigue tendencias, las valida o las descarta para su círculo — publica opiniones en categorías muy diversas (música, arte, tecnología, finanzas) muy por encima del promedio, lo que lo hace más influyente que un asistente promedio pese a no ser necesariamente el más numeroso.",
        [
          { label: "No sigue tendencias, las valida para su círculo", detail: "40% quiere ser el primero en probar cosas nuevas (índice 167) y 45% sigue de cerca las tendencias tecnológicas (índice 154) — dar acceso anticipado/curaduría exclusiva antes que al público general." },
          { label: "Comenta sobre música, arte, tecnología y hasta finanzas", detail: "Publica opiniones online en categorías muy diversas muy por encima del promedio — el contenido de marca puede cruzar categorías (moda + tecnología + arte), no limitarse solo a música." },
          { label: "Paga por calidad, no necesariamente por precio bajo", detail: "40% pagó una suscripción de streaming de música en el último mes (índice 160) — el argumento de curaduría/calidad vende mejor que un descuento." },
        ]
      ),
      sharePct: 42,
      demographics: {
        genderSplit: { male: 57, female: 43 },
        ageBands: [
          { label: "16-24", pct: 28 },
          { label: "25-34", pct: 31 },
          { label: "35-44", pct: 22 },
          { label: "45-54", pct: 14 },
          { label: "55-64", pct: 6 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 },
        ],
      },
      motivations: [
        { label: "Se consideran creativos", pct: 76 },
        { label: "Les gusta ser los primeros en probar cosas nuevas", pct: 40 },
        { label: "Siguen de cerca las tendencias tecnológicas", pct: 45 },
        { label: "Se consideran de mente abierta", pct: 58 },
      ],
      barriers: [
        { label: "Solo una minoría cree que el contenido generado por IA puede ser de alta calidad sin intervención humana — escepticismo relativo hacia contenido no curado", pct: 30 },
      ],
      digitalInterests: [
        { label: "Interés en explorar otras culturas/países", index: 137 },
        { label: "Les gusta explorar el mundo", index: 149 },
        { label: "Publican su opinión sobre música online", index: 178 },
      ],
      media: [
        { label: "Instagram (más de una vez al día)", pct: 51 },
        { label: "Facebook (más de una vez al día)", pct: 48 },
        { label: "TikTok (más de una vez al día)", pct: 40 },
        { label: "Pagaron suscripción de streaming de música (último mes)", pct: 40 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "Redes / noticias", "Instagram, apps de noticias", "Sin dato específico de GWI para este bloque."),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Noticias / tendencias", "Apps de noticias, tech media", "67.5% dice que le gusta estar al tanto de lo que pasa en el mundo — consumo de noticias/tendencias concentrado en esta franja."),
        daypart("Medio día", "12 m a 3 pm", "Trabajo", "Tendencias tecnológicas", "Blogs y medios tech", "45% sigue de cerca las tendencias tecnológicas."),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "Redes sociales", "Instagram, Facebook", "Sin dato específico de GWI para este bloque horario."),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Instagram", "Instagram", "51% usa Instagram más de una vez al día (índice 146) y 78% de quienes lo usan publican fotos/video."),
        daypart("Noche", "8 a 11 pm", "Casa / eventos curados", "Streaming de música", "Apps de música", "40% pagó una suscripción de streaming de música en el último mes (índice 160) — consumo musical curado en la noche."),
      ],
    },
  ],
};

const CASE_CHAMPIONS_GWI_AUTO_20260924 = {
  id: "seguidores-champions-league-colombia",
  name: "Seguidores de la UEFA Champions League (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Audiencia real de GWI ('Paramo (co) LABUCL', audience_id 5826d1eb-a730-4df3-84c3-0e75aedd35c5): colombianos aficionados al deporte e interesados en la UEFA Champions League.",
  funnelSteps: [
    { label: "Interesados en fútbol / siguen la UEFA Champions League (Colombia)", pct: 27 },
  ],
  footnotes: [
    "27% = tamaño real de la audiencia en GWI (~8.5M) sobre la población digital total de Colombia (31.06M) — cifra derivada de universos reales devueltos por explore_insight_gwi, no estimada a ojo.",
    "Demografía, medios e intereses digitales tomados 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi (GWI la identificó explícitamente como 'Champions League Viewers').",
    "GWI no devolvió desagregación geográfica (ciudad/región) para esta audiencia específica.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "hincha-champions-colombia",
      name: "Andrés Salcedo",
      archetype: "El Hincha Multipantalla de la Champions",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Ve la Champions League principalmente por TV abierta o paga en casa, pero su seguimiento del torneo vive también en redes sociales: sigue equipos y jugadores, comenta y publica sobre deporte muy por encima del promedio. Es abrumadoramente masculino y transversal en edad, con fuerza particular entre los 25 y 54 años.",
      aiInsight: aiInsight(
        "Cruza con la fragmentación del 'segundo partido': aunque el consumo del juego en sí sigue anclado a la TV (92% lo ve en un televisor), el verdadero terreno de disputa por su atención es la conversación social alrededor del partido — publica sobre deporte con un índice de 232 frente al promedio y sigue cuentas de equipos/jugadores con índice 199 — lo que abre una ventana de activación de marca en el pre y post-partido en redes, no solo en la pauta de TV.",
        [
          { label: "La TV domina el partido, pero no el resto del día", detail: "92% ve el partido en un televisor, pero fuera del horario del juego esta audiencia vive en redes de deporte — separar presupuesto entre 'momento del partido' (TV/streaming) y 'conversación alrededor' (social) maximiza el alcance real." },
          { label: "Es una audiencia que amplifica, no solo consume", detail: "Publica sobre deporte con un índice de 232 frente al promedio — activarla con contenido para compartir (predicciones, retos, momentos icónicos) multiplica el alcance orgánico más que en otras categorías." },
          { label: "El streaming pago todavía no es el canal dominante", detail: "Solo 45% paga hoy un servicio de streaming de TV/cine — una estrategia 100% digital-only deja fuera a más de la mitad de esta audiencia; la señal abierta y la TV paga tradicional siguen siendo relevantes." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 77.5, female: 22.5 },
        ageBands: [
          { label: "16-24", pct: 19.9 },
          { label: "25-34", pct: 26.5 },
          { label: "35-44", pct: 24.3 },
          { label: "45-54", pct: 16.9 },
          { label: "55-64", pct: 12.4 },
          { label: "65+", pct: 0 },
        ],
        topCities: [{ city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 }],
      },
      motivations: [
        { label: "Interesados en ver deporte en general", pct: 74 },
        { label: "Muy interesados específicamente en la UEFA Champions League", pct: 83 },
        { label: "Usan redes sociales para seguir/ver deporte", pct: 53 },
      ],
      barriers: [
        { label: "Solo 45% paga hoy un servicio de streaming de TV/cine — la mayoría depende de TV abierta/paga tradicional", pct: 55 },
        { label: "Baja preferencia por streaming dedicado de eventos frente al hábito de TV tradicional", pct: 28 },
      ],
      digitalInterests: [
        { label: "Usar redes sociales para ver/seguir deportes", index: 208 },
        { label: "Seguir a deportistas y equipos en redes", index: 199 },
        { label: "Publicar opiniones sobre deportes online", index: 232 },
        { label: "Interés en eventos por streaming", index: 136 },
      ],
      media: [
        { label: "TV set para ver TV en vivo", pct: 92.2 },
        { label: "Sigue a equipos/jugadores en redes sociales", pct: 60.4 },
        { label: "Usa redes sociales para ver/seguir deporte", pct: 52.8 },
        { label: "Teléfono/tablet para ver TV en vivo", pct: 39.1 },
        { label: "Laptop/desktop para ver TV en vivo", pct: 26.5 },
        { label: "Streaming device / smart stick", pct: 8.7 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes y noticias deportivas", "Instagram, X, Google", "Resumen/preview del partido del día.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina / estudio", "Redes sociales", "Instagram, X", "Contenido de previa y alineaciones.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Redes y mensajería", "WhatsApp, Instagram", "Comentario/debate sobre el partido de la noche.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Redes y video online", "YouTube, Instagram", "Recordatorio de horario del partido + dónde verlo.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa / bar", "TV y redes", "TV abierta/paga, Instagram", "Activación en el pre-partido (TV + segunda pantalla).", []),
        daypart("Noche", "8 a 11 pm", "Casa / bar", "TV y redes sociales", "TV, X, Instagram", "Conversación en vivo y reacciones post-partido.", []),
      ],
    },
  ],
};

const CASE_FINTECH_GWI_AUTO_20260924 = {
  id: "fintech-general-colombia",
  name: "Interesados en Fintech (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Audiencia real de GWI ('Paramo(co)FintechColombia', audience_id 49dbc0ab-e5d3-47fc-88db-948265845b54): colombianos interesados en fintech / servicios financieros digitales.",
  funnelSteps: [
    { label: "Interesados en fintech / servicios financieros digitales (Colombia)", pct: 11 },
  ],
  footnotes: [
    "11% = tamaño real de la audiencia en GWI (~3.3M) sobre la población digital total de Colombia (31.06M) — cifra derivada de universos reales devueltos por explore_insight_gwi.",
    "Demografía (género, edad, nivel educativo) tomada 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi.",
    "Motivaciones, barreras y medios: GWI no devolvió crosstabs exclusivos de esta audiencia para estas variables — se usan cifras reales de GWI Core Colombia sobre usuarios de Billetera Móvil / compradores de apps móviles (proxy temático más cercano) y sobre población general conectada; deben leerse como contexto de categoría, no como diferenciador exclusivo de esta audiencia.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "usuario-fintech-colombia",
      name: "Daniel Marín",
      archetype: "El Optimizador Financiero Digital",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Colombiano conectado que ya usa o está dispuesto a probar apps financieras y billeteras digitales. Valora la seguridad financiera por encima de la conveniencia, pero mantiene una preocupación activa por el uso de sus datos personales — la confianza, no la fricción de uso, parece ser la barrera principal para escalar su adopción.",
      aiInsight: aiInsight(
        "Cruza con la paradoja de la confianza digital en fintech LatAm: esta audiencia ya usa canales digitales para casi todo (98% redes sociales, 70% WhatsApp a diario) pero solo 31% ha usado un producto de banca/inversión/seguros digital en el último mes — la brecha no parece ser de habilidad digital sino de confianza, reforzada por una preocupación por el manejo de datos personales por encima del promedio — cualquier estrategia de adquisición debería liderar con prueba social y transparencia de datos, no solo con conveniencia.",
        [
          { label: "La barrera parece ser confianza, no fricción de uso", detail: "Con 98% ya activo en redes sociales a diario pero solo 31% usando productos financieros digitales, el mensaje debe liderar con seguridad y transparencia sobre el manejo de datos (42% dice preocuparse por esto), no solo con velocidad o conveniencia." },
          { label: "La seguridad financiera pesa más que la promoción", detail: "70% considera importante ser financieramente seguro — comunicar ahorro/control financiero puede convertir mejor que mensajes centrados solo en cashback o promociones." },
          { label: "WhatsApp como canal de soporte y confianza", detail: "70% usa WhatsApp más de una vez al día — es el canal natural para atención al cliente y validación social (testimonios, soporte humano) que reduzca la percepción de riesgo." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 53.8, female: 46.2 },
        ageBands: [
          { label: "16-24", pct: 22.0 },
          { label: "25-34", pct: 30.0 },
          { label: "35-44", pct: 24.2 },
          { label: "45-54", pct: 14.9 },
          { label: "55-64", pct: 7.0 },
          { label: "65+", pct: 2.0 },
        ],
        topCities: [{ city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 }],
      },
      motivations: [
        { label: "Consideran importante ser financieramente seguros (usuarios de Billetera Móvil, Colombia)", pct: 70.6 },
        { label: "Gestionan sus finanzas o ahorros desde internet (compradores de apps móviles, Colombia)", pct: 47 },
        { label: "Prefieren poder diferir pagos sin intereses adicionales (compradores de apps móviles, Colombia)", pct: 23 },
      ],
      barriers: [
        { label: "Preocupación por el uso de sus datos personales por parte de empresas (usuarios de Billetera Móvil, Colombia)", pct: 41.6 },
        { label: "Preocupación por el rastreo del gobierno en línea (compradores de apps móviles, Colombia)", pct: 25 },
        { label: "Solo 31% de los colombianos conectados usó banca/inversión/seguros digitales en el último mes — adopción real aún minoritaria (Colombia, GWI Core)", pct: 31.3 },
      ],
      digitalInterests: [],
      media: [
        { label: "Redes sociales (uso mensual, Colombia)", pct: 98.4 },
        { label: "WhatsApp más de una vez al día (Colombia)", pct: 69.8 },
        { label: "Facebook más de una vez al día (Colombia)", pct: 38 },
        { label: "TikTok más de una vez al día (Colombia)", pct: 36 },
        { label: "Instagram más de una vez al día (Colombia)", pct: 34 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Apps y notificaciones", "App del banco/billetera, WhatsApp", "Notificación de saldo/movimiento matutino.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina", "Redes y búsqueda", "Google, Instagram", "Contenido educativo sobre finanzas personales.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Apps de pago", "Billetera digital, WhatsApp", "Uso de pago digital en almuerzo/compras del día.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Redes sociales", "Instagram, Facebook", "Testimonios o comparativas de producto financiero.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Apps y redes", "App del banco, WhatsApp", "Revisión de gastos / ahorro del día.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Instagram", "Soporte por WhatsApp o contenido de educación financiera.", []),
      ],
    },
  ],
};

const CASE_TECNOMOBILE_GWI_AUTO_20260924 = {
  id: "tecnomobile-colombia",
  name: "TecnoMobile — Amantes de la tecnología y compradores de smartphone gama media (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Campaña TecnoMobile: combina dos audiencias reales de GWI priorizadas por el equipo ('Páramo LAB (co) TecnoMobile_Colombia_AmantesDeLaTecnología', audience_id 73e30957-2da0-45b6-9dbf-1d463ec5a351, y 'Páramo LAB (co) TecnoMobile_Colombia_SmartphoneGamaMedia', audience_id b3af3d46-ba91-4870-81a3-8bf59376b7cd) en un solo caso con dos personas.",
  funnelSteps: [
    { label: "Unión de las dos audiencias reales de TecnoMobile (Amantes de la Tecnología + Compradores de Smartphone Gama Media, Colombia)", pct: 100 },
  ],
  footnotes: [
    "Las dos audiencias reales de GWI suman un universo combinado de 33,959,291 personas (20,092,721 'Amantes de la Tecnología' + 13,866,570 'Smartphone Gama Media'), superior a la población digital total de Colombia usada por la app (31.06M) porque son dos audiencias construidas con criterios propios de GWI y no hay garantía de que sean mutuamente excluyentes entre sí (una misma persona podría calificar en ambas). Por eso el funnelStep queda fijo en 100% (no se modela como embudo secuencial) y el tamaño final del caso queda topado a la población digital total de Colombia — el reparto entre las dos personas (59.2% / 40.8%) sí refleja la proporción real de tamaño de universo entre las dos audiencias según GWI.",
    "Demografía, geografía, marca preferida para la próxima compra de celular, actitudes hacia la tecnología y uso de redes sociales fueron verificados 1:1 vía chat_gwi/explore_insight_gwi sobre cada audience_id real.",
    "GWI no devolvió un customer journey por franja horaria para estas audiencias — los bloques del journey reutilizan los canales/medios reales identificados arriba, pero la secuencia horaria y el texto de activación son un borrador editorial, no un dato de GWI.",
    "Borrador generado automáticamente — pendiente de revisión editorial, especialmente la cita de cada persona y el customer journey.",
  ],
  personas: [
    {
      id: "amante-tecnologia-colombia",
      name: "Sebastián Duarte",
      archetype: "La Entusiasta Tecnológica",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Colombiano conectado con interés declarado en tecnología: se siente cómodo probando novedades, sigue de cerca las noticias del sector y consume redes sociales de forma casi universal. Es una audiencia amplia (equivalente a ~65% de la población digital de Colombia según GWI) — no es un nicho pequeño, sino el segmento general interesado en tecnología.",
      aiInsight: aiInsight(
        "Cruza con la paradoja del entusiasta pasivo: 38.8% se declara confiado con la tecnología y 34.0% sigue activamente noticias/tendencias del sector, pero solo 15.6% llegó a publicar una opinión sobre tecnología online en el último mes (38.6% no publicó ninguna opinión sobre nada) — el interés y la confianza no se traducen automáticamente en evangelización pública de marca; activar a ese núcleo que sí publica puede generar más alcance orgánico que dirigirse al total de la audiencia por igual.",
        [
          { label: "La confianza no es lo mismo que la prescripción pública", detail: "Solo 15.6% publicó opinión sobre tecnología en el último mes pese a que 38.8% se siente confiado usando tecnología — identificar y activar a ese núcleo que sí publica (reviews, unboxing, contenido para compartir) rinde más que un mensaje genérico a toda la audiencia." },
          { label: "Sigue tendencias, pero la adopción inmediata es minoritaria", detail: "34.0% sigue de cerca las noticias tech, pero solo 13.4% compra apenas sale el producto — la comunicación debe sostenerse más allá del lanzamiento, porque la mayoría de este segmento decide con calma pese a estar informada." },
          { label: "La preocupación por los datos convive con la falta de control percibido", detail: "39.3% dice preocuparle cómo las empresas usan sus datos, pero solo 25.9% siente que tiene control sobre ellos — comunicar transparencia y control explícito sobre datos personales puede ser un diferenciador real dentro de esta audiencia." },
        ]
      ),
      sharePct: 59.2,
      demographics: {
        genderSplit: { male: 57.7, female: 42.3 },
        ageBands: [
          { label: "16-24", pct: 22.5 },
          { label: "25-34", pct: 27.6 },
          { label: "35-44", pct: 23.8 },
          { label: "45-54", pct: 15.9 },
          { label: "55-64", pct: 10.2 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Distrito Capital (Bogotá)", pct: 27.8 },
          { city: "Antioquia", pct: 14.0 },
          { city: "Valle del Cauca", pct: 10.0 },
          { city: "Cundinamarca", pct: 8.2 },
        ],
      },
      motivations: [
        { label: "Se sienten confiados usando nueva tecnología", pct: 38.8 },
        { label: "Siguen las últimas tendencias y noticias de tecnología", pct: 34.0 },
        { label: "Publicaron su opinión sobre tecnología online en el último mes", pct: 15.6 },
        { label: "Compran productos tecnológicos nuevos tan pronto están disponibles", pct: 13.4 },
      ],
      barriers: [
        { label: "Les preocupa cómo las empresas usan sus datos personales online", pct: 39.3 },
        { label: "Solo una minoría siente que tiene control sobre sus datos personales online", pct: 25.9 },
        { label: "No publicó ninguna opinión online en el último mes (mayoría pasiva pese al interés en tecnología)", pct: 38.6 },
      ],
      digitalInterests: [
        { label: "Publicar su opinión sobre tecnología online", index: 132 },
        { label: "Seguir las últimas tendencias y noticias de tecnología", index: 125 },
        { label: "Comprar productos tech tan pronto están disponibles", index: 122 },
        { label: "Sentirse confiados usando nueva tecnología", index: 119 },
      ],
      media: [
        { label: "Redes sociales (uso mensual)", pct: 99.0 },
        { label: "Chat / mensajería (uso mensual)", pct: 98.4 },
        { label: "Buscadores (Google, etc. — uso mensual)", pct: 91.2 },
        { label: "Facebook más de una vez al día", pct: 40.4 },
        { label: "TikTok más de una vez al día", pct: 38.1 },
        { label: "Instagram más de una vez al día", pct: 35.4 },
        { label: "X (Twitter) más de una vez al día", pct: 9.5 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes sociales y noticias tech", "Instagram, Facebook, Google", "Contenido de noticias y lanzamientos de tecnología.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina / estudio", "Búsqueda y video", "Google, YouTube", "Comparativas y reviews de producto.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Redes y mensajería", "WhatsApp, Instagram", "Contenido para compartir sobre novedades tech.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Redes y video online", "TikTok, YouTube, Instagram", "Retargeting a quienes vieron reviews o comparativas.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Facebook, Instagram", "Contenido de lanzamiento / unboxing.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Instagram, TikTok", "CTA directo a comparar precios o comprar.", []),
      ],
    },
    {
      id: "smartphone-gama-media-colombia",
      name: "Jonathan Peña",
      archetype: "El Comprador Práctico de Gama Media",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Dueño de un smartphone de marca no-premium (ASUS, HTC, Lenovo, Motorola, Nokia, OnePlus, Oppo o Xiaomi) en Colombia. Es sensible al precio, pero su siguiente compra no está cerrada: la mayoría todavía elegiría Samsung, Xiaomi o Motorola antes que dar el salto a un iPhone.",
      aiInsight: aiInsight(
        "Cruza con la lealtad de marca todavía abierta en gama media: aunque esta audiencia ya posee un celular de marca no-premium, su primera opción para la próxima compra es Samsung (49.5%), seguida de Xiaomi (39.4%) y Motorola (26.5%) — apenas 24.3% elegiría iPhone (22% menos probable que el dueño de smartphone promedio) — la disputa real de esta categoría no es retener contra Apple, es ganar la migración entre marcas Android.",
        [
          { label: "La pelea es entre marcas Android, no contra Apple", detail: "Solo 24.3% elegiría iPhone en su próxima compra (22% menos probable que el dueño de smartphone promedio) — el presupuesto de medios rinde más compitiendo por la preferencia entre Samsung, Xiaomi y Motorola que tratando de convertir a esta audiencia a iOS." },
          { label: "Xiaomi y Motorola sobre-indexan fuerte en esta audiencia", detail: "Xiaomi (índice 150) y Motorola (índice ~150) son mucho más elegidas aquí que en el dueño de smartphone promedio — son las marcas con mayor 'permiso' real para conquistar a este segmento en su próxima renovación." },
          { label: "Uno de cada tres ya piensa en su próxima compra en 6-12 meses", detail: "34.5% planea comprar o actualizar su celular en los próximos 6 a 12 meses — es la ventana de consideración más grande del ciclo de compra y el momento clave para activar comparativas y reviews antes de que decidan marca." },
        ]
      ),
      sharePct: 40.8,
      demographics: {
        genderSplit: { male: 51.1, female: 48.9 },
        ageBands: [
          { label: "16-24", pct: 20.5 },
          { label: "25-34", pct: 27.4 },
          { label: "35-44", pct: 23.8 },
          { label: "45-54", pct: 16.9 },
          { label: "55-64", pct: 11.5 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Zona urbana (Colombia, sin desagregación por ciudad disponible en GWI)", pct: 85.3 },
          { city: "Zona rural", pct: 8.5 },
          { city: "Zona suburbana", pct: 6.2 },
        ],
      },
      motivations: [
        { label: "Su primera opción para la próxima compra de celular es Samsung", pct: 49.5 },
        { label: "Su primera opción para la próxima compra de celular es Xiaomi", pct: 39.4 },
        { label: "Su primera opción para la próxima compra de celular es Motorola", pct: 26.5 },
        { label: "Planean comprar o actualizar su celular en los próximos 6-12 meses", pct: 34.5 },
      ],
      barriers: [
        { label: "Son sensibles al precio al comprar un celular", pct: 31.9 },
        { label: "Les preocupa cómo las empresas usan sus datos personales online", pct: 40.6 },
        { label: "Les preocupa pasar demasiado tiempo en su celular", pct: 27.4 },
        { label: "Solo elegiría iPhone en su próxima actualización — la gama alta/Apple no es su prioridad", pct: 24.3 },
      ],
      digitalInterests: [
        { label: "Elegir Xiaomi en la próxima compra de celular", index: 150 },
        { label: "Elegir Motorola en la próxima compra de celular", index: 150 },
        { label: "Usar Facebook más de una vez al día", index: 108 },
        { label: "Preferir el anonimato online", index: 106 },
      ],
      media: [
        { label: "Vieron contenido de video (cualquier servicio) en el último mes", pct: 91.6 },
        { label: "Netflix (uso mensual)", pct: 63.6 },
        { label: "YouTube para ver/descargar contenido", pct: 58.8 },
        { label: "Facebook más de una vez al día", pct: 41.6 },
        { label: "TikTok más de una vez al día", pct: 37.5 },
        { label: "Instagram más de una vez al día", pct: 33.0 },
        { label: "Disney+ (uso mensual)", pct: 31.4 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes y notificaciones", "Facebook, Instagram", "Ofertas y promociones de celulares gama media.", []),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo", "Redes y video", "TikTok, YouTube", "Comparativas de precio Samsung vs. Xiaomi vs. Motorola.", []),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / restaurantes", "Streaming y video", "YouTube, Netflix", "Reviews en video de modelos gama media.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Redes sociales", "Facebook, Instagram, TikTok", "Retargeting con financiamiento / planes de pago.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Streaming", "Netflix, Disney+, YouTube", "Contenido patrocinado dentro de streaming.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Facebook, Instagram", "CTA directo a comprar / financiar el celular.", []),
      ],
    },
  ],
};

const CASE_COLOMBIA_VEHICULO_GWI_AUTO_20260924 = {
  id: "colombia-con-vehiculo",
  name: "Colombia con vehículo — Conductores frecuentes vs. ocasionales",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Audiencia real de GWI ('Colombia con vehiculo', audience_id ee0e32c0-fb98-4984-adbb-8b3b713b7745): colombianos con al menos un carro en el hogar, segmentada en dos personas según la frecuencia real de manejo que reporta GWI dentro de esa misma audiencia.",
  funnelSteps: [
    { label: "Colombianos con al menos un carro en el hogar (audiencia real GWI)", pct: 37.3 },
  ],
  footnotes: [
    "37.3% = universo real de la audiencia en GWI (11,584,904 personas) sobre la población digital total de Colombia (31.06M) — cifra derivada de universos reales devueltos por explore_insight_gwi.",
    "El reparto entre las dos personas (45.0% / 55.0%) usa la frecuencia real de manejo que reporta GWI dentro de esta misma audiencia: 45.0% maneja el carro regularmente (índice 200.8, el doble de probable que el promedio) y el 55.0% restante agrupa a quienes son semi-regulares (22.4%), ocasionales (16.8%) o no manejan el carro del hogar (15.8%).",
    "Demografía, tipo de vehículo, frecuencia de manejo, intención de compra y comportamiento digital tomados 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi.",
    "GWI no permite desagregar demografía ni medios por sub-segmento de frecuencia de manejo dentro de esta audiencia — ambas personas comparten la misma base demográfica y de medios generales de la audiencia total; lo que las diferencia son las variables reales de relación con el vehículo (frecuencia de uso, intención de compra, interés en tipo de vehículo o en alternativas de movilidad).",
    "Borrador generado automáticamente — pendiente de revisión editorial, especialmente la cita de cada persona y el customer journey.",
  ],
  personas: [
    {
      id: "conductor-frecuente-colombia",
      name: "Mauricio Salazar",
      archetype: "El Conductor Frecuente",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Maneja el carro del hogar con regularidad — el doble de probable que el colombiano promedio, según GWI. Para él el carro es infraestructura diaria, no un símbolo: depende de apps de navegación casi a diario y ya está evaluando su próxima compra (incluido el salto a híbrido).",
      aiInsight: aiInsight(
        "Cruza con la dependencia real del vehículo: quien maneja regularmente en Colombia es el doble de probable que el promedio (índice 200.8) y usa apps de mapas/ubicación como Google Maps o Waze de forma casi universal (71.4%) — para este conductor el carro no es un símbolo, es infraestructura diaria, lo que abre una ventana de comunicación en momentos de fricción real (tráfico, parqueo, mantenimiento) más que en momentos puramente aspiracionales.",
        [
          { label: "Las apps de navegación son el canal de contacto diario más confiable", detail: "71.4% usó mapas o apps de ubicación en el último mes (10.5% más probable que el promedio) — integrar comunicación contextual en ese momento (llegada a destino, alertas de tráfico) tiene más alcance real que la pauta social genérica." },
          { label: "El interés en híbridos ya superó al parque actual", detail: "Solo 5.7% de los hogares con carro tiene hoy un híbrido, pero 33.0% lo considera en su próxima compra — hay una brecha de intención-adopción real que un mensaje educativo sobre híbridos (no eléctricos puros, que solo interesan a 11.8%) puede capturar primero." },
          { label: "El seguro automotor es una categoría de compra activa, no solo el vehículo nuevo", detail: "10.5% está pensando en comprar seguro de carro en los próximos 3-6 meses (44.6% más probable que el promedio) — para este conductor frecuente, la comunicación de valor no debería limitarse al vehículo nuevo, sino extenderse a todo el ecosistema de propiedad (seguro, mantenimiento)." },
        ]
      ),
      sharePct: 45.0,
      demographics: {
        genderSplit: { male: 50.9, female: 49.1 },
        ageBands: [
          { label: "16-24", pct: 19.2 },
          { label: "25-34", pct: 23.7 },
          { label: "35-44", pct: 23.6 },
          { label: "45-54", pct: 19.2 },
          { label: "55-64", pct: 14.4 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Zona urbana (Colombia, sin desagregación por ciudad disponible en GWI)", pct: 89.3 },
          { city: "Zona rural", pct: 5.8 },
          { city: "Zona suburbana", pct: 4.8 },
        ],
      },
      motivations: [
        { label: "Maneja el carro del hogar con regularidad", pct: 45.0 },
        { label: "Usó mapas o apps de ubicación como Google Maps o Waze en el último mes", pct: 71.4 },
        { label: "Planea comprar carro en los próximos 3-6 meses", pct: 20.3 },
        { label: "Está pensando en un vehículo híbrido para su próxima compra", pct: 33.0 },
      ],
      barriers: [
        { label: "Solo 5.7% de los hogares con carro tiene hoy uno híbrido, pese al 33% de interés en su próxima compra", pct: 5.7 },
        { label: "Solo 2.4% de los hogares con carro tiene uno eléctrico — la adopción 100% eléctrica sigue siendo marginal", pct: 2.4 },
        { label: "Está pensando en comprar seguro de carro/automotor en los próximos 3-6 meses (gasto adicional a planear)", pct: 10.5 },
      ],
      digitalInterests: [
        { label: "Uso de mapas/ubicación (Google Maps, Waze)", index: 111 },
        { label: "Interés en comprar seguro automotor en 3-6 meses", index: 145 },
        { label: "Interés en vehículo híbrido para próxima compra", index: 113 },
      ],
      media: [
        { label: "Redes sociales (uso mensual)", pct: 99.0 },
        { label: "Chat / mensajería (uso mensual)", pct: 98.2 },
        { label: "Email (uso mensual)", pct: 94.2 },
        { label: "Mapas / ubicación (Google Maps, Waze)", pct: 71.4 },
        { label: "Instagram más de una vez al día", pct: 38.6 },
        { label: "Facebook más de una vez al día", pct: 37.2 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Carro / transporte", "Apps de navegación", "Google Maps, Waze", "Alertas de tráfico con mensaje contextual de marca.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina", "Redes y email", "Instagram, email", "Contenido sobre nuevos modelos e híbridos.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Redes y chat", "WhatsApp, Facebook", "Comparativo de costos de mantenimiento/combustible.", []),
        daypart("La tarde", "3 a 6 pm", "Carro / transporte", "Apps de navegación", "Google Maps, Waze", "Recordatorio de mantenimiento o vencimiento de seguro.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes", "Instagram, Facebook", "Contenido educativo sobre híbridos vs. eléctricos.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Instagram", "CTA a cotizar seguro o agendar prueba de manejo.", []),
      ],
    },
    {
      id: "conductor-ocasional-colombia",
      name: "Laura Fernanda Beltrán",
      archetype: "La Conductora Ocasional",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Vive en un hogar con carro, pero no depende de él a diario: es semi-regular, ocasional o de plano no maneja. En ese mismo hogar hay interés real en motocicleta, bicicleta o scooter eléctrico como alternativas de movilidad — el carro compite con otros modos de transporte, no solo con otras marcas de carro.",
      aiInsight: aiInsight(
        "Cruza con la movilidad híbrida (de medios de transporte, no de motor): más de la mitad de los hogares colombianos con carro (55%) no depende de él a diario —son semi-regulares, ocasionales o de plano no manejan— y en ese mismo universo hay interés real en motocicleta (15.2%), bicicleta (13.2%) e incluso scooter eléctrico (6.8%) como alternativas de movilidad — el carro compite dentro de su propio hogar con otros modos de transporte, no solo con otras marcas de carro.",
        [
          { label: "El carro no es su modo de transporte por defecto", detail: "55% de los hogares con carro no maneja con regularidad — para esta persona el vehículo puede ser compartido, de otro miembro del hogar, o de uso ocasional, así que el mensaje de 'tu carro ideal' pesa menos que el de 'la opción de movilidad que se ajusta a tu semana'." },
          { label: "Compite activamente con otros modos de transporte dentro del mismo hogar", detail: "13.2%-15.2% de este mismo universo está pensando en comprar motocicleta o bicicleta en los próximos meses — la categoría automotriz no debería ignorar que su comprador potencial también evalúa alternativas más económicas de movilidad." },
          { label: "Es una audiencia hiperconectada en redes pese a manejar poco", detail: "38.9% usa 5+ servicios de redes sociales (20.6% más probable que el promedio) — el canal de activación más eficiente para esta persona no es la experiencia en el punto de venta, sino la conversación social donde ya pasa la mayor parte de su tiempo." },
        ]
      ),
      sharePct: 55.0,
      demographics: {
        genderSplit: { male: 50.9, female: 49.1 },
        ageBands: [
          { label: "16-24", pct: 19.2 },
          { label: "25-34", pct: 23.7 },
          { label: "35-44", pct: 23.6 },
          { label: "45-54", pct: 19.2 },
          { label: "55-64", pct: 14.4 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Zona urbana (Colombia, sin desagregación por ciudad disponible en GWI)", pct: 89.3 },
          { city: "Zona rural", pct: 5.8 },
          { city: "Zona suburbana", pct: 4.8 },
        ],
      },
      motivations: [
        { label: "Es conductora semi-regular del carro del hogar", pct: 22.4 },
        { label: "Maneja el carro del hogar solo ocasionalmente", pct: 16.8 },
        { label: "No maneja el carro del hogar", pct: 15.8 },
        { label: "Usa 5 o más servicios de redes sociales", pct: 38.9 },
      ],
      barriers: [
        { label: "Está pensando en comprar motocicleta en los próximos 3-6 meses (alternativa de movilidad dentro del hogar)", pct: 15.2 },
        { label: "Está pensando en comprar bicicleta en los próximos 3-6 meses", pct: 13.2 },
        { label: "Está pensando en comprar un scooter eléctrico en los próximos 3-6 meses", pct: 6.8 },
      ],
      digitalInterests: [
        { label: "Uso de 5+ servicios de redes sociales", index: 121 },
        { label: "Uso de X (Twitter) más de una vez al día", index: 136 },
      ],
      media: [
        { label: "Redes sociales (uso mensual)", pct: 99.0 },
        { label: "Chat / mensajería (uso mensual)", pct: 98.2 },
        { label: "Videos móviles vistos en la última semana", pct: 70.4 },
        { label: "Instagram más de una vez al día", pct: 38.6 },
        { label: "TikTok más de una vez al día", pct: 35.2 },
        { label: "5+ servicios de redes sociales usados", pct: 38.9 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte público o compartido", "Redes sociales", "Instagram, TikTok", "Contenido de movilidad urbana (carro, moto, bici).", []),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / universidad", "Redes y video", "TikTok, Instagram", "Comparativo de costos: carro vs. moto vs. bici.", []),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / restaurantes", "Redes y chat", "WhatsApp, Instagram", "Contenido sobre flexibilidad de uso compartido del carro.", []),
        daypart("La tarde", "3 a 6 pm", "Transporte / trabajo", "Video móvil", "TikTok, YouTube", "Reviews de motos/bicicletas y de carros compactos.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Redes sociales", "Instagram, X", "Contenido aspiracional de movilidad flexible.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Redes y chat", "WhatsApp, Instagram, TikTok", "CTA a cotizar financiamiento de carro, moto o bici.", []),
      ],
    },
  ],
};
const CASE_COCA100_GWI_AUTO_20260924 = {
  id: "coca100-celebracion-multigeneracional-colombia",
  name: "Coca100 — Celebración multigeneracional de marca (Colombia)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-24)",
  insightNote:
    "Campaña 'Coca100' (Páramo LAB), identificada por el equipo como prioritaria y reciente: 3 audiencias reales de GWI ('Páramo LAB (co) Coca100_GenX', 'Coca100_Millennials' y 'Coca100_Genz') que segmentan por generación lo que parece ser una celebración/aniversario de marca — GWI no expone el nombre de marca ni el motivo exacto de la celebración más allá del nombre de campaña.",
  funnelSteps: [
    {
      label:
        "Colombianos en edad Gen X, Millennial o Gen Z activos en digital (3 audiencias reales de GWI para la campaña Coca100, sin filtro temático adicional detectado)",
      pct: 98.5,
    },
  ],
  footnotes: [
    "98.5% = universo combinado real de las 3 audiencias en GWI (GenX ~9.37M + Millennials ~10.85M + GenZ ~10.39M ≈ 30.6M) sobre la población digital total de Colombia (31.06M) — cifra derivada de universos reales devueltos por explore_insight_gwi, no estimada a ojo.",
    "Las 3 audiencias reales de GWI parecen estar definidas únicamente por rango de edad/generación (los rangos etarios declarados suman 100% dentro de cada una vía chat_gwi) — no se detectó un filtro temático adicional (interés, intención de compra) en las respuestas de GWI, así que el paso del embudo refleja el tamaño combinado de las tres generaciones, no una afinidad filtrada.",
    "sharePct de cada persona calculado proporcional al universo real que reporta GWI para su audiencia (GenX 30.6%, Millennials 35.5%, GenZ 33.9% del total combinado) — no se encontró un dato de peso relativo distinto entre las tres, así que se usa el universo real como mejor proxy disponible.",
    "Demografía (género, edad, ciudades/regiones), motivaciones, barreras, intereses digitales y medios: datos reales de GWI Core Colombia específicos de cada audiencia generacional (a diferencia del batch anterior, aquí sí fue posible obtener cifras propias de cada audiencia para casi todas las variables, no solo proxies de población general).",
    "Para Gen Z, GWI solo devolvió desagregación geográfica para 2 regiones (Distrito Capital y Meta) — dato parcial, no se completa con cifras de otras fuentes.",
    "GWI no devolvió datos de franja horaria (time-of-day) para ninguna de las 3 audiencias — el customer journey de 6 bloques queda con lugar/medios genéricos inferidos del perfil (trabajo, medios preferidos) y sin cifras propias, pendiente de criterio del equipo creativo.",
    "Borrador generado automáticamente — pendiente de revisión editorial, especialmente la cita de cada persona y el customer journey.",
  ],
  personas: [
    {
      id: "guardiana-nostalgia-coca100-genx",
      name: "Marta Elena Cifuentes",
      archetype: "La Guardiana de la Nostalgia de Marca",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Colombiana de 45 a 64 años que vivió gran parte de los 100 años de historia de la marca como parte de su propia vida. Es la generación más leal, más receptiva a un discurso de marca tradicional y más conectada a Facebook como su red principal — para ella, celebrar un aniversario de marca es también celebrar su propia memoria.",
      aiInsight: aiInsight(
        "Cruza con el gradiente de nostalgia real que muestra GWI entre las tres generaciones de esta campaña: 23.9% de Gen X en Colombia dice que abrazar herencia y tradiciones es importante para ellos (índice 124), frente a 18.7% en Millennials y 15.1% en Gen Z — la misma caída se repite casi exacta en 'quiero que las marcas sean tradicionales' (31.7% GenX vs. 23.9% Millennials vs. 17.1% GenZ). Gen X es, con datos reales, la única generación donde un discurso de aniversario apoyado en tradición pura tiene más probabilidad de resonar que de sentirse anticuado.",
        [
          { label: "La nostalgia es un activo real, no solo una narrativa", detail: "Gen X es 24% más propensa que el promedio a valorar herencia y tradición (índice 123.8) y 28% más propensa a querer marcas tradicionales (índice 128.4) — la comunicación de aniversario puede apoyarse en memoria de marca real sin necesidad de sobre-dramatizarla." },
          { label: "Facebook sigue siendo el canal, no una alternativa", detail: "44% usa Facebook más de una vez al día, muy por encima de Instagram (23% uso diario) o TikTok (18% uso diario) — cualquier activación de aniversario dirigida a Gen X debe priorizar Facebook, no asumir que las redes 'nuevas' son el canal principal para esta generación." },
          { label: "La confianza en el manejo de datos es la barrera silenciosa", detail: "46% se preocupa por el uso de sus datos personales por parte de empresas (índice 121) — mecánicas de campaña que pidan datos personales (registro, formularios de aniversario) deben comunicar transparencia explícita para no generar fricción en esta generación." },
        ]
      ),
      sharePct: 30.6,
      demographics: {
        genderSplit: { male: 47.6, female: 52.4 },
        ageBands: [
          { label: "16-24", pct: 0 },
          { label: "25-34", pct: 0 },
          { label: "35-44", pct: 14 },
          { label: "45-54", pct: 54 },
          { label: "55-64", pct: 32 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Bogotá D.C.", pct: 33 },
          { city: "Antioquia", pct: 14 },
          { city: "Valle del Cauca", pct: 9.6 },
          { city: "Atlántico", pct: 7.7 },
          { city: "Cundinamarca", pct: 7.2 },
          { city: "Santander", pct: 5 },
        ],
      },
      motivations: [
        { label: "Son leales a las marcas que les gustan", pct: 54 },
        { label: "Quieren que las marcas sean tradicionales", pct: 31.7 },
        { label: "Se sienten motivados a promocionar su marca favorita por recompensas", pct: 47 },
        { label: "Consideran importante abrazar su herencia y tradiciones", pct: 23.9 },
      ],
      barriers: [
        { label: "Preocupación por el uso de sus datos personales por parte de empresas", pct: 46 },
        { label: "Solo 20% compra marcas que ve anunciadas — bajo impacto directo de la publicidad tradicional", pct: 20 },
        { label: "26% cree que la economía del país empeorará en los próximos 6 meses — outlook cauteloso de gasto", pct: 26 },
        { label: "28% espera que sus finanzas personales se mantengan igual — sin margen adicional para gasto discrecional", pct: 28 },
      ],
      digitalInterests: [
        { label: "Quieren que las marcas sean confiables", index: 110 },
        { label: "Quieren que las marcas sean auténticas", index: 111 },
        { label: "Quieren que las marcas sean tradicionales", index: 128 },
        { label: "Investigan productos online antes de comprarlos", index: 112 },
      ],
      media: [
        { label: "Facebook (más de una vez al día)", pct: 44 },
        { label: "YouTube (uso diario)", pct: 29 },
        { label: "Instagram (uso diario)", pct: 23 },
        { label: "TikTok (uso diario)", pct: 18 },
        { label: "Suscripción a streaming de video/TV (último mes)", pct: 38 },
        { label: "Se entera de nuevas marcas por anuncios de TV", pct: 32 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa", "TV y radio matutina", "TV abierta, radio", "Repaso de titulares y rutina familiar de la mañana.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina / negocio propio", "Facebook, WhatsApp", "Facebook, WhatsApp", "Revisión de mensajes y contenido de marcas conocidas.", []),
        daypart("Medio día", "12 m a 3 pm", "Restaurantes / casa", "Facebook", "Facebook", "Contenido de aniversario/marca compartido por conocidos.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "TV, radio", "TV abierta, radio", "Anuncios de TV y radio como fuente principal de novedades de marca.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "Facebook, YouTube", "Facebook, YouTube", "Tiempo en familia con TV o streaming de fondo.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "TV, Facebook", "TV abierta, Facebook", "Programación de TV abierta y revisión final de redes.", []),
      ],
    },
    {
      id: "puente-familiar-coca100-millennials",
      name: "Juliana Prieto",
      archetype: "La Millennial que Comparte la Historia en Familia",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Colombiana de 25 a 44 años, generación puente entre la nostalgia de Gen X y el escepticismo de Gen Z. Trabaja tiempo completo muy por encima del promedio, valora la familia por encima de la marca, y es leal por hábito más que por identidad — su relación con un aniversario de 100 años probablemente se construye compartiéndolo con otros, no viviéndolo en primera persona.",
      aiInsight: aiInsight(
        "Cruza con su posición real de 'generación puente' en los datos de GWI: su valoración de herencia y tradición (18.7%, índice 98) está casi exactamente entre Gen X (23.9%, índice 124) y Gen Z (15.1%, índice 79) — ni completamente nostálgica ni completamente indiferente. Es además la generación con mayor tasa de empleo de tiempo completo (47%, índice 126), lo que reduce su disponibilidad de atención durante la jornada laboral frente a las otras dos.",
        [
          { label: "Es la generación puente, no un extremo", detail: "Su valoración de herencia/tradición (18.7%) cae exactamente entre Gen X (23.9%) y Gen Z (15.1%) — el mensaje de aniversario debería funcionar como bisagra entre ambos polos, ni completamente nostálgico ni completamente de descubrimiento." },
          { label: "La lealtad es real pero no identitaria", detail: "52% dice ser leal a sus marcas favoritas, pero solo 5.2% se autodefine explícitamente como 'leal a una marca' — la lealtad de esta generación funciona mejor reforzada por hábito y recompensas que apelando a un discurso de identidad de marca." },
          { label: "El trabajo de tiempo completo compite por su atención", detail: "47% trabaja tiempo completo (26% más que el promedio, índice 126) — el momento de mayor disponibilidad de atención real no es la jornada laboral sino las franjas de traslado y descanso en casa." },
        ]
      ),
      sharePct: 35.5,
      demographics: {
        genderSplit: { male: 49.5, female: 50.5 },
        ageBands: [
          { label: "16-24", pct: 0 },
          { label: "25-34", pct: 46 },
          { label: "35-44", pct: 54 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Bogotá D.C.", pct: 30 },
          { city: "Antioquia", pct: 15 },
          { city: "Valle del Cauca", pct: 10 },
          { city: "Cundinamarca", pct: 8.5 },
          { city: "Atlántico", pct: 8.1 },
          { city: "Santander", pct: 4.5 },
        ],
      },
      motivations: [
        { label: "Son leales a las marcas que les gustan", pct: 52 },
        { label: "Se sienten motivados a promocionar su marca favorita por recompensas", pct: 45 },
        { label: "Consideran importante pasar tiempo en familia", pct: 74 },
        { label: "Prefieren compras online cuando hay puntos de lealtad disponibles", pct: 26 },
      ],
      barriers: [
        { label: "Preocupación por el uso de sus datos personales por parte de empresas", pct: 38 },
        { label: "Solo 18.7% considera importante abrazar herencia y tradiciones — conexión emocional con lo 'tradicional' más débil que en Gen X", pct: 18.7 },
        { label: "Solo 5.2% se identifica explícitamente como 'leal a una marca', pese al 52% que dice ser leal a sus favoritas — lealtad más situacional que identitaria", pct: 5.2 },
      ],
      digitalInterests: [
        { label: "Quieren que las marcas sean confiables", index: 99 },
        { label: "Quieren que las marcas sean tradicionales", index: 100 },
        { label: "Usan redes sociales para ver actualizaciones de sus marcas favoritas", index: 103 },
        { label: "Trabajan tiempo completo", index: 126 },
      ],
      media: [
        { label: "Facebook (más de una vez al día)", pct: 43 },
        { label: "Instagram (uso diario)", pct: 23 },
        { label: "TikTok (uso diario)", pct: 18 },
        { label: "YouTube (suscriptores que ven más de una vez al día)", pct: 61 },
        { label: "Apps de chat/mensajería (uso en el último mes)", pct: 98 },
        { label: "Suscripción a streaming de video/TV (último mes)", pct: 41 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "WhatsApp, Instagram", "WhatsApp, Instagram", "Revisión de redes y coordinación familiar antes del trabajo.", []),
        daypart("Final de la mañana", "9 a 12 m", "Oficina", "Facebook, YouTube", "Facebook, YouTube", "Contenido de marcas y noticias durante pausas breves.", []),
        daypart("Medio día", "12 m a 3 pm", "Oficina / restaurantes", "Instagram, TikTok", "Instagram, TikTok", "Consumo de contenido breve durante el almuerzo.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "Facebook", "Facebook", "Revisión de redes en el trayecto de regreso a casa.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "YouTube, streaming", "YouTube, streaming", "Tiempo en familia con streaming o TV de fondo.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Instagram, TikTok, chat", "Instagram, TikTok, WhatsApp", "Ocio digital y mensajería antes de dormir.", []),
      ],
    },
    {
      id: "descubridora-digital-coca100-genz",
      name: "Sara Valentina Ortiz",
      archetype: "La Gen Z que Descubre los 100 Años en Redes",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Colombiana de 16 a 34 años (mayoritariamente 16-24), estudiante en una proporción muy superior al promedio y la generación más nativa de TikTok de las tres. No vivió los 100 años de historia de la marca, así que la conoce y la valida a través de contenido, no de memoria propia — es la generación con menor apego declarado a la tradición y menor identificación como 'leal a una marca'.",
      aiInsight: aiInsight(
        "Cruza con el punto más bajo del gradiente de nostalgia real medido por GWI: solo 15.1% de Gen Z en Colombia dice que abrazar herencia y tradiciones es importante para ellos (índice 79, el único por debajo del promedio de las tres generaciones), y solo 17.1% quiere que las marcas sean tradicionales (índice 72) — frente a 31.7% en Gen X. Para esta generación, 'cumplir 100 años' no es una apelación emocional heredada, es un dato que hay que descubrir y validar mediante contenido, preferentemente en TikTok, donde 47.7% de ellos ya está más de una vez al día (índice 133).",
        [
          { label: "No hereda la nostalgia, la descubre", detail: "Solo 15.1% de Gen Z en Colombia valora abrazar herencia y tradiciones (21% menos que el promedio, índice 79) — la historia de 100 años debe presentarse como contenido de descubrimiento (curiosidades, datos, detrás de cámaras), no como apelación emocional a un recuerdo que esta generación no tiene." },
          { label: "El canal es TikTok antes que cualquier otro", detail: "47.7% usa TikTok más de una vez al día (33% más que el promedio, índice 133), muy por encima de Instagram (38.3%) y Facebook (30.5%, índice 77 — el único canal donde Gen Z está por debajo del promedio) — una campaña pensada 'para todas las generaciones' pierde a este segmento si no tiene una versión nativa de TikTok." },
          { label: "Es la generación más escéptica del discurso de marca tradicional", detail: "Solo 17.1% quiere que las marcas sean tradicionales (28% menos que el promedio, índice 72) y solo 4.5% se identifica como leal a una marca — construir credibilidad con Gen Z requiere evidencia y honestidad más que la apelación directa a 'somos una marca de siempre'." },
        ]
      ),
      sharePct: 33.9,
      demographics: {
        genderSplit: { male: 49.7, female: 50.3 },
        ageBands: [
          { label: "16-24", pct: 68 },
          { label: "25-34", pct: 32 },
          { label: "35-44", pct: 0 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [
          { city: "Bogotá D.C. (Distrito Capital)", pct: 22 },
          { city: "Meta", pct: 2.1 },
        ],
      },
      motivations: [
        { label: "Se sienten motivados a promocionar su marca favorita porque la aman", pct: 30 },
        { label: "Consideran importante pasar tiempo en familia", pct: 67 },
        { label: "Son leales a las marcas que les gustan", pct: 49 },
        { label: "Priorizan experiencias culturales al elegir destino de vacaciones", pct: 19 },
      ],
      barriers: [
        { label: "Solo 15.1% considera importante abrazar herencia y tradiciones — la más baja de las 3 generaciones (Gen X 23.9%, Millennials 18.7%)", pct: 15.1 },
        { label: "Solo 17.1% quiere que las marcas sean tradicionales — frente a 31.7% en Gen X", pct: 17.1 },
        { label: "Preocupación por el uso de sus datos personales, aunque menor que el promedio", pct: 32 },
        { label: "Solo 4.5% se identifica explícitamente como leal a una marca", pct: 4.5 },
      ],
      digitalInterests: [
        { label: "Usan TikTok más de una vez al día", index: 133 },
        { label: "Usan Instagram más de una vez al día", index: 112 },
        { label: "Son estudiantes actualmente", index: 257 },
        { label: "Quieren que las marcas sean tradicionales (por debajo del promedio)", index: 72 },
      ],
      media: [
        { label: "TikTok (más de una vez al día)", pct: 47.7 },
        { label: "Instagram (más de una vez al día)", pct: 38.3 },
        { label: "Facebook (más de una vez al día)", pct: 30.5 },
        { label: "YouTube (para ver/descargar TV, películas o video, último mes)", pct: 63 },
        { label: "Suscripción a streaming de video/TV (último mes)", pct: 35 },
        { label: "Suscripción a streaming de música (último mes)", pct: 27 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "TikTok, Instagram", "TikTok, Instagram", "Scroll matutino antes de clases o trabajo.", []),
        daypart("Final de la mañana", "9 a 12 m", "Universidad / trabajo", "Instagram, TikTok", "Instagram, TikTok", "Contenido breve entre clases o pausas cortas.", []),
        daypart("Medio día", "12 m a 3 pm", "Universidad / casa", "TikTok", "TikTok", "Consumo de video corto durante el almuerzo.", []),
        daypart("La tarde", "3 a 6 pm", "Transporte / casa", "Instagram, YouTube", "Instagram, YouTube", "Contenido de entretenimiento después de clases.", []),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "TikTok, YouTube", "TikTok, YouTube", "Ocio digital y streaming de video.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "Instagram, TikTok, chat", "Instagram, TikTok, WhatsApp", "Mensajería y redes antes de dormir.", []),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// CASOS "gwi-auto-draft" — generados por la rutina diaria de GWI el 2026-09-26.
// ---------------------------------------------------------------------------

const CASE_ESCENA_URBANA_GWI_AUTO_20260926 = {
  id: "escena-urbana-eventos-vivo-colombia",
  name: "Escena urbana en eventos en vivo (Hip-Hop/Rap, Reggae/Ska) — Colombia",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-26)",
  insightNote:
    "Audiencia real de GWI ('Paramo>AudienciaEventosUrban', audience_id 2945ac21-4e1f-4eb7-b3be-4a40a3eab2c3): colombianos interesados en eventos en vivo (festivales de música) que además disfrutan Hip-Hop/Rap o Reggae/Ska — un ángulo de género musical distinto al caso general (CASE_DANGOND, vallenato/latina) y al de Baum27 (EDM).",
  funnelSteps: [
    { label: "Interesados en eventos en vivo (festivales) y afines a Hip-Hop/Rap o Reggae/Ska", pct: 16.7 },
  ],
  footnotes: [
    "16.7% = tamaño real de la audiencia en GWI (~5.19M) sobre la población digital total de Colombia (31.06M) — cifra derivada del universo real devuelto por explore_insight_gwi, no estimada a ojo.",
    "Demografía, motivaciones, barreras, intereses digitales y medios tomados 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi.",
    "GWI no devolvió desagregación geográfica (ciudad/región) para esta audiencia específica.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "urbano-cultural-colombia",
      name: "Valentina Ríos",
      archetype: "La Curadora de Cultura Urbana",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Vive los eventos en vivo como una extensión de un consumo cultural más amplio: teatro, danza, fotografía y vida al aire libre. El festival o concierto urbano es una experiencia entre varias que documenta y comparte activamente, no un evento aislado en el calendario.",
      aiInsight: aiInsight(
        "Cruza con la tendencia de 'consumo cultural ómnivoro digital': esta audiencia no separa el evento urbano en vivo de su consumo de teatro, danza y fotografía — cerca de la mitad declara interés en artes escénicas (45%) y danza (47%), y 31% admite que no siempre busca activamente nuevos eventos — el mensaje que funciona no es 'hay un nuevo evento', sino integrarlo a un calendario cultural más amplio que ya siguen.",
        [
          { label: "Prefieren vivirlo en persona, no en streaming", detail: "26% declara no estar interesado en eventos por streaming — a diferencia de otras audiencias digitales, el activo de marketing más rentable aquí es la activación presencial (POP, patrocinio de venue), no el streaming pagado del evento." },
          { label: "Son documentadores, no solo asistentes", detail: "56% tiene interés en fotografía y 37% paga una suscripción de streaming de música (50% más que el promedio) — contenido diseñado para ser fotografiado y compartido en el momento (photo ops, escenografía) rinde más que un anuncio estático." },
          { label: "No cazan activamente el próximo evento", detail: "31% admite que no siempre busca nuevos eventos en vivo — la estrategia de medios no puede depender solo de que la audiencia 'descubra' el evento por sí misma; el retargeting sobre su consumo habitual de redes (72% las revisa a diario) es más confiable que esperar búsqueda orgánica." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 52.1, female: 47.9 },
        ageBands: [
          { label: "16-24", pct: 29.4 },
          { label: "25-34", pct: 31.1 },
          { label: "35-44", pct: 23.1 },
          { label: "45-54", pct: 11.4 },
          { label: "55-64", pct: 4.9 },
          { label: "65+", pct: 0 },
        ],
        topCities: [{ city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 }],
      },
      motivations: [
        { label: "Interés en actividades al aire libre (camping, senderismo)", pct: 68 },
        { label: "Interés en fotografía", pct: 56 },
        { label: "Interés en danza (ballet, street dance, salsa, etc.)", pct: 47 },
        { label: "Interés en artes escénicas / teatro", pct: 45 },
      ],
      barriers: [
        { label: "No están interesados en eventos por streaming (prefieren la experiencia presencial)", pct: 26 },
        { label: "No siempre buscan activamente nuevos eventos en vivo", pct: 31 },
      ],
      digitalInterests: [
        { label: "Usan redes sociales para encontrar contenido", index: 135 },
        { label: "Usan Instagram más de una vez al día", index: 132 },
        { label: "Pagan suscripción de streaming de música", index: 150 },
        { label: "Usan X (Twitter) más de una vez al día", index: 137 },
      ],
      media: [
        { label: "Acceso principal a internet vía mobile", pct: 81 },
        { label: "Navegan redes sociales a diario", pct: 72 },
        { label: "Ven videos/TV/películas por internet", pct: 70 },
        { label: "Suscripción a streaming de video/TV (último mes)", pct: 55 },
        { label: "Instagram (más de una vez al día)", pct: 46 },
        { label: "TikTok (más de una vez al día)", pct: 40 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes sociales", "Instagram, TikTok", "Contenido breve de agenda cultural del día.", []),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / estudio", "Redes sociales", "Instagram, X", "Anuncios de line-up y adelantos de eventos.", []),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / restaurantes", "Redes y streaming de música", "Instagram, streaming de música", "Contenido de artistas/DJs con enfoque visual.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "TV internacional y redes", "TV internacional, Instagram", "50% ve canales de TV internacional en esta franja (2-5pm).", [
          { label: "Ven canales de TV internacional (2pm–5pm)", pct: 50, index: 118 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "TV internacional y redes", "TV internacional, TikTok", "56% ve canales de TV internacional en esta franja (5-7pm) — ventana para activación pre-evento.", [
          { label: "Ven canales de TV internacional (5pm–7pm)", pct: 56, index: 114 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa / venue", "Redes sociales, streaming de video", "Instagram, TikTok, streaming", "Contenido en vivo del evento y momentos para fotografiar/compartir.", []),
      ],
    },
  ],
};

const CASE_FUTBOL_JUGADORES_GWI_AUTO_20260926 = {
  id: "jugadores-futbol-amateur-bogota",
  name: "Jugadores amateur de fútbol — Bogotá y Cundinamarca",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-26)",
  insightNote:
    "Audiencia real de GWI ('Ejemplo>Soccer', audience_id 3f6c99d9-2bf8-403f-aa8c-acac644e09c9): colombianos de Bogotá D.C./Cundinamarca, 16-44 años, interesados en practicar deporte y que juegan fútbol — a diferencia del caso 'seguidores-champions-league-colombia' (hinchas que solo ven el torneo), aquí el 100% juega fútbol activamente.",
  funnelSteps: [
    { label: "Juegan fútbol y están interesados en practicar deporte (Bogotá/Cundinamarca, 16-44 años)", pct: 5.9 },
  ],
  footnotes: [
    "5.9% = tamaño real de la audiencia en GWI (~1.82M) sobre la población digital total de Colombia (31.06M) — cifra derivada del universo real devuelto por explore_insight_gwi. La audiencia está geográficamente acotada a Bogotá D.C. y Cundinamarca, así que este porcentaje subestima su penetración real dentro de esa región (no hay cifra oficial de población digital regional en este dataset).",
    "Demografía, motivaciones, barreras, intereses digitales y medios tomados 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi.",
    "A diferencia de 'seguidores-champions-league-colombia' (hinchas que ven fútbol), esta audiencia son jugadores activos: 100% juega fútbol y está interesada en practicar deporte, no solo verlo.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "jugador-amateur-futbol-bogota",
      name: "Julián Restrepo",
      archetype: "El Futbolista de Barrio Multipantalla",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "Juega fútbol semanalmente con amigos y lo vive como identidad, no solo pasatiempo: es el deporte que practica y también el que más sigue. Fuera de la cancha es un consumidor intenso de contenido deportivo y de gaming.",
      aiInsight: aiInsight(
        "Cruza con la tendencia del 'jugador-espectador': esta audiencia no solo ve fútbol, lo juega (100%) y también lo sigue como espectador (69% interesados en ver deporte, 99% sigue fútbol) — a diferencia del hincha pasivo de Champions League, responde mejor a activaciones que la involucran como participante (retos, ligas amateur, contenido de mejora de habilidad) que a contenido de solo espectáculo.",
        [
          { label: "El gaming es una segunda cancha", detail: "69% está interesado en gaming y 51% se identifica como 'gamer' (más del doble que el promedio, índice 211) — un patrocinio o activación cruzada con FIFA/EA Sports o esports de fútbol tiene más eco que un patrocinio deportivo tradicional." },
          { label: "Fieles al fútbol, agnósticos a otros deportes importados", detail: "36% conoce la NFL pero no le interesa y 30% conoce la NBA pero tampoco — cualquier patrocinio cruzado con ligas no-fútbol parte con desventaja; el fútbol (y el ciclismo, que sigue el 69%) es donde está la atención real." },
          { label: "El earned media pesa más que la pauta fría", detail: "74% interactúa con earned media (reseñas, recomendaciones) y 19% descubre marcas por patrocinio deportivo (73% más que el promedio) — activar líderes de opinión dentro del círculo futbolero rinde más que la pauta pagada genérica." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 82.7, female: 17.3 },
        ageBands: [
          { label: "16-24", pct: 30.9 },
          { label: "25-34", pct: 39.6 },
          { label: "35-44", pct: 29.6 },
          { label: "45-54", pct: 0 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [{ city: "Bogotá D.C. y Cundinamarca (100% — audiencia geográficamente acotada a esta región)", pct: 100 }],
      },
      motivations: [
        { label: "Siguen el fútbol como su deporte principal", pct: 99 },
        { label: "Interesados en ver deporte (no solo jugarlo)", pct: 69 },
        { label: "Se identifican como 'sports fan'", pct: 60 },
        { label: "Usan redes sociales para ver/seguir deportes", pct: 52 },
      ],
      barriers: [
        { label: "Conocen la NFL pero no están interesados en seguirla", pct: 36 },
        { label: "Conocen la NBA pero no están interesados en seguirla", pct: 30 },
      ],
      digitalInterests: [
        { label: "Se identifican como 'gamer'", index: 211 },
        { label: "Interés en gaming", index: 163 },
        { label: "Descubren marcas por patrocinio deportivo/eventos", index: 173 },
        { label: "Uso de apps de trabajo colaborativo (Zoom, Meet, Slack)", index: 131 },
      ],
      media: [
        { label: "Interactúan con earned media (reseñas, recomendaciones)", pct: 74 },
        { label: "Usan redes sociales para ver/seguir deportes", pct: 52 },
        { label: "TikTok (más de una vez al día)", pct: 42 },
        { label: "Descubren marcas vía anuncios en redes sociales", pct: 38 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Redes sociales", "Instagram, TikTok", "Resumen de resultados y noticias deportivas de la noche anterior.", []),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / estudio", "Redes sociales", "X, Instagram", "Contenido de previa de partidos y fichajes.", []),
        daypart("Medio día", "12 m a 3 pm", "Trabajo / restaurantes", "Redes y mensajería", "WhatsApp, Instagram", "Coordinación del próximo partido amateur con el grupo.", []),
        daypart("La tarde", "3 a 6 pm", "Trabajo / transporte", "TV internacional y redes", "TV internacional, TikTok", "48% ve canales de TV internacional en esta franja (2-5pm).", [
          { label: "Ven canales de TV internacional (2pm–5pm)", pct: 48, index: 115 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Cancha / casa", "TV internacional", "TV internacional", "51% ve canales de TV internacional en esta franja (5-7pm) — ventana de partido o entrenamiento.", [
          { label: "Ven canales de TV internacional (5pm–7pm)", pct: 51, index: 106 },
        ]),
        daypart("Noche", "8 a 11 pm", "Casa", "Streaming, gaming, redes", "Streaming de video, consola/mobile gaming", "Consumo de highlights, gaming (FIFA/EA Sports) y redes.", []),
      ],
    },
  ],
};

const CASE_FINTECH_DESBANCARIZADOS_GWI_AUTO_20260926 = {
  id: "colombia-no-bancarizados-pago-digital",
  name: "Colombianos sin acceso a pagos digitales (no bancarizados)",
  market: "COL",
  source: "gwi-auto-draft",
  sourceLabel: "Borrador automático GWI — pendiente de revisión (2026-09-26)",
  insightNote:
    "Audiencia real de GWI ('PuntoDePago>Desbancarizados', audience_id d61cd628-8f7d-4e3e-91c9-0e87b2da3d0b): colombianos que no han usado ningún servicio de pago online en el último mes — el extremo opuesto del embudo fintech (ver 'fintech-general-colombia' y CASE_FINTECH), útil para dimensionar el techo de inclusión financiera digital.",
  funnelSteps: [
    { label: "No han usado ningún servicio de pago online en el último mes", pct: 7.9 },
  ],
  footnotes: [
    "7.9% = tamaño real de la audiencia en GWI (~2.46M) sobre la población digital total de Colombia (31.06M) — cifra derivada del universo real devuelto por explore_insight_gwi.",
    "Demografía, actitudes financieras, intereses digitales y medios tomados 1:1 de esta audiencia real vía chat_gwi/explore_insight_gwi.",
    "Es una audiencia definida por AUSENCIA de comportamiento financiero digital (no un target de campaña fintech tradicional) — útil para dimensionar la oportunidad de inclusión financiera o el riesgo de exclusión de campañas 100% digitales.",
    "GWI solo devolvió desagregación de edad hasta el rango 45-54 (28.9% + 28% + 20.3% + 12.6% = 89.8% de la audiencia); no se completan los rangos 55-64 y 65+ con datos inventados.",
    "Borrador generado automáticamente — pendiente de revisión editorial.",
  ],
  personas: [
    {
      id: "colombiana-no-bancarizada",
      name: "Diana Marcela Gómez",
      archetype: "La Consumidora en Efectivo",
      quote: "[Pendiente: cita del equipo creativo]",
      description:
        "No usa servicios de pago digital ni tiene cuenta bancaria, tarjeta de crédito o ahorros formales — prefiere el efectivo y la compra en tienda física. No es resistencia tecnológica (usa redes sociales y mobile intensamente): es una brecha de acceso y hábito financiero, no de acceso digital.",
      aiInsight: aiInsight(
        "Cruza con la brecha de 'inclusión financiera digital' en Colombia: este segmento no es tecnófobo (92% usa redes sociales, 83% accede a internet vía mobile) pero sí financieramente informal — 45% no tiene ahorros ni inversiones, 66% no tiene tarjeta de crédito y 68% prefiere pagar en efectivo — cualquier producto fintech que exija una cuenta bancaria previa pierde a este segmento antes de empezar.",
        [
          { label: "El efectivo no es resistencia, es hábito arraigado", detail: "68% prefiere pagar en efectivo y 71% prefiere comprar en tienda física — más que rechazo a lo digital, es preferencia por control y tangibilidad; un producto que digitalice el efectivo (billetera que opera como efectivo, cash-in en puntos físicos) tiene más opción que uno 100% cashless." },
          { label: "Sub-índice generalizado en interés digital/tech", detail: "Interés en tecnología (índice 77), en gaming (índice 81) e inversiones (índice 62) están todos por debajo del promedio — la comunicación no puede asumir curiosidad tecnológica; el mensaje debe liderar con el beneficio cotidiano (ahorro de tiempo, seguridad), no con la novedad del producto." },
          { label: "TV abierta y radio superan a la pauta digital fría", detail: "Son usuarios ocasionales de TV abierta (índice 157) y de radio (índice 147) por encima del promedio, mientras que el descubrimiento de marca por voz a voz está por debajo del promedio — los canales tradicionales locales tienen más opción de alcanzarlos que la pauta 100% digital." },
        ]
      ),
      sharePct: 100,
      demographics: {
        genderSplit: { male: 44.5, female: 55.5 },
        ageBands: [
          { label: "16-24", pct: 28.9 },
          { label: "25-34", pct: 28 },
          { label: "35-44", pct: 20.3 },
          { label: "45-54", pct: 12.6 },
          { label: "55-64", pct: 0 },
          { label: "65+", pct: 0 },
        ],
        topCities: [{ city: "Colombia — sin desagregación geográfica disponible en GWI para esta audiencia", pct: 100 }],
      },
      motivations: [
        { label: "Prefieren pagar en efectivo", pct: 68 },
        { label: "Prefieren comprar en tienda física", pct: 71 },
      ],
      barriers: [
        { label: "No tienen tarjeta de crédito", pct: 66 },
        { label: "No tienen ahorros ni inversiones", pct: 45 },
        { label: "No tienen cuenta bancaria", pct: 28 },
      ],
      digitalInterests: [
        { label: "Interés en tecnología (por debajo del promedio)", index: 77 },
        { label: "Interés en gaming (por debajo del promedio)", index: 81 },
        { label: "Interés en inversiones (por debajo del promedio)", index: 62 },
      ],
      media: [
        { label: "Uso de redes sociales (último mes)", pct: 92 },
        { label: "Acceso principal a internet vía mobile", pct: 83 },
        { label: "Usuarios ocasionales de TV abierta/broadcast", pct: 38 },
        { label: "Usuarios ocasionales de radio", pct: 28 },
        { label: "Descubren marcas por voz a voz (amigos/familia) — por debajo del promedio", pct: 21 },
      ],
      journey: [
        daypart("Inicio de la mañana", "6 a 9 am", "Casa / transporte", "Radio, redes sociales", "Radio, WhatsApp", "Mensajes de la rutina diaria, sin señal específica de GWI para este bloque.", []),
        daypart("Final de la mañana", "9 a 12 m", "Trabajo / negocio propio", "Redes sociales", "WhatsApp, Facebook", "Interacción social cotidiana, sin cifra específica de GWI para este bloque.", []),
        daypart("Medio día", "12 m a 3 pm", "Tienda física / casa", "TV abierta, radio", "TV abierta, radio", "36% ve canales de TV internacional en esta franja (2-5pm) — por debajo del promedio.", [
          { label: "Ven canales de TV internacional (2pm–5pm)", pct: 36, index: 85 },
        ]),
        daypart("La tarde", "3 a 6 pm", "Casa / tienda física", "TV abierta, radio", "TV abierta, radio", "44% ve canales de TV internacional en esta franja (5-7pm) — por debajo del promedio.", [
          { label: "Ven canales de TV internacional (5pm–7pm)", pct: 44, index: 92 },
        ]),
        daypart("Fin de la tarde", "6 a 8 pm", "Casa", "TV abierta, redes sociales", "TV abierta, Facebook", "Momento de mayor consumo de TV abierta del día, sin cifra horaria adicional de GWI.", []),
        daypart("Noche", "8 a 11 pm", "Casa", "TV abierta, redes sociales", "TV abierta, WhatsApp", "Cierre del día sin señal horaria adicional específica de GWI.", []),
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
    cases: [CASE_DANGOND, CASE_EVENTOS_VIVO_GWI_AUTO_20260924, CASE_BAUM27_GWI_AUTO_20260924, CASE_ESCENA_URBANA_GWI_AUTO_20260926],
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
    cases: [CASE_DEPORTES, CASE_CHAMPIONS_GWI_AUTO_20260924, CASE_FUTBOL_JUGADORES_GWI_AUTO_20260926],
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
    cases: [CASE_FINTECH, CASE_FINTECH_GWI_AUTO_20260924, CASE_FINTECH_DESBANCARIZADOS_GWI_AUTO_20260926],
  },
  {
    id: "alcohol",
    name: "Alcohol y Bebidas",
    icon: "🍸",
    description: "Consumo y compra de bebidas alcohólicas (dataset GWI Alcohol).",
    traits: [
      { id: "pruebaBebidasNuevas", label: "Interés en probar bebidas nuevas" },
      { id: "consumePremium", label: "Consume bebidas premium/artesanales" },
      { id: "salidaSocialFrecuente", label: "Sale a bares/eventos sociales con frecuencia" },
      { id: "buscaModeracion", label: "Busca opciones bajas en alcohol / moderación" },
    ],
    cases: [CASE_ALCOHOL, CASE_JAGER_VIDASOCIAL_GWI_AUTO_20260924],
  },
  {
    id: "automotriz",
    name: "Automotriz",
    icon: "🚗",
    description: "Compra de vehículos y movilidad (dataset GWI Automotive).",
    traits: [
      { id: "compraCarro12m", label: "Planea comprar carro en 12 meses" },
      { id: "consideraHibridoElectrico", label: "Considera opciones híbridas/eléctricas" },
      { id: "investigaOnlineAntes", label: "Investiga activamente online antes de comprar" },
      { id: "prioridadFamiliar", label: "Prioriza espacio y seguridad familiar" },
    ],
    cases: [CASE_AUTOMOTRIZ, CASE_COLOMBIA_VEHICULO_GWI_AUTO_20260924],
  },
  {
    id: "consumer-tech",
    name: "Tecnología de Consumo",
    icon: "📱",
    description: "Dispositivos electrónicos y gadgets (dataset GWI Consumer Tech).",
    traits: [
      { id: "compraGadgetsAnual", label: "Compra gadgets tecnológicos cada año" },
      { id: "sigueReviewsTech", label: "Sigue reviews de tecnología antes de comprar" },
      { id: "pagaPremiumMarca", label: "Dispuesto a pagar premium por marca" },
      { id: "compraPorNecesidad", label: "Compra por necesidad/durabilidad, no por hype" },
    ],
    cases: [CASE_CONSUMER_TECH, CASE_TECNOMOBILE_GWI_AUTO_20260924],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    description: "Videojuegos, esports y comunidades gamer (dataset GWI Gaming).",
    traits: [
      { id: "juegaSemanal", label: "Juega videojuegos semanalmente" },
      { id: "sigueEsports", label: "Sigue streamers o esports" },
      { id: "compraDlcSuscripciones", label: "Compra contenido/DLC o suscripciones gaming" },
      { id: "juegaMobileCasual", label: "Juega en mobile en sesiones cortas" },
    ],
    cases: [CASE_GAMING],
  },
  {
    id: "lujo",
    name: "Lujo",
    icon: "💎",
    description: "Marcas y productos de lujo (dataset GWI Luxury).",
    traits: [
      { id: "interesMarcasLujo", label: "Interés declarado en marcas de lujo" },
      { id: "altoPoderAdquisitivo", label: "Alto poder adquisitivo (NSE A/B)" },
      { id: "buscaLogoVisible", label: "Busca reconocimiento social visible de marca" },
      { id: "buscaLujoSilencioso", label: "Prioriza calidad/discreción sobre el logo" },
    ],
    cases: [CASE_LUJO],
  },
  {
    id: "momentos",
    name: "Ocasiones y Momentos",
    icon: "🎁",
    description: "Planeación de celebraciones y fechas especiales (dataset GWI Moments).",
    traits: [
      { id: "planeaFechaTrimestre", label: "Planea celebrar una fecha especial este trimestre" },
      { id: "compraConAnticipacion", label: "Compra regalos/experiencias con anticipación" },
      { id: "investigaOnlineOcasion", label: "Investiga opciones online antes de decidir" },
      { id: "decideUltimoMomento", label: "Decide y compra a último momento" },
    ],
    cases: [CASE_MOMENTOS, CASE_COCA100_GWI_AUTO_20260924],
  },
  {
    id: "viajes",
    name: "Viajes y Turismo",
    icon: "✈️",
    description: "Turismo, destinos y planeación de viajes (dataset GWI Travel).",
    traits: [
      { id: "viajaAnual", label: "Viaja por placer al menos 1 vez al año" },
      { id: "investigaDestinosOnline", label: "Investiga destinos activamente en redes/online" },
      { id: "reservaDirecto", label: "Reserva directamente sin agencia" },
      { id: "viajaConFamilia", label: "Viaja priorizando comodidad familiar" },
    ],
    cases: [CASE_VIAJES],
  },
  {
    id: "trabajo",
    name: "Trabajo y Profesionales",
    icon: "💼",
    description: "Herramientas y comportamiento de profesionales (dataset GWI Work).",
    traits: [
      { id: "modalidadHibridaRemota", label: "Trabaja en modalidad híbrida o remota" },
      { id: "usaHerramientasDiario", label: "Usa herramientas digitales a diario" },
      { id: "decideSoftwareEquipo", label: "Tiene poder de decisión en compras de software" },
      { id: "optimizaFlujoPersonal", label: "Optimiza su propio flujo de trabajo" },
    ],
    cases: [CASE_TRABAJO],
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
  "explorador-cocteleria": ["pruebaBebidasNuevas", "consumePremium"],
  "socialite-moderada": ["salidaSocialFrecuente", "buscaModeracion"],
  "early-adopter-electrico": ["consideraHibridoElectrico", "investigaOnlineAntes"],
  "comprador-pragmatico": ["compraCarro12m", "prioridadFamiliar"],
  "coleccionista-gadgets": ["compraGadgetsAnual", "pagaPremiumMarca"],
  "usuaria-funcional": ["sigueReviewsTech", "compraPorNecesidad"],
  "hardcore-competitivo": ["juegaSemanal", "sigueEsports"],
  "casual-mobile": ["juegaMobileCasual", "compraDlcSuscripciones"],
  "coleccionista-aspiracional": ["interesMarcasLujo", "buscaLogoVisible"],
  "heredero-discreto": ["altoPoderAdquisitivo", "buscaLujoSilencioso"],
  "planeadora-anticipada": ["planeaFechaTrimestre", "compraConAnticipacion"],
  "decisor-ultimo-momento": ["investigaOnlineOcasion", "decideUltimoMomento"],
  "guardiana-nostalgia-coca100-genx": ["planeaFechaTrimestre"],
  "puente-familiar-coca100-millennials": ["compraConAnticipacion", "investigaOnlineOcasion"],
  "descubridora-digital-coca100-genz": ["investigaOnlineOcasion"],
  "viajero-digital-independiente": ["viajaAnual", "investigaDestinosOnline"],
  "familia-planificadora": ["reservaDirecto", "viajaConFamilia"],
  "profesional-remoto-optimizador": ["modalidadHibridaRemota", "optimizaFlujoPersonal"],
  "lider-equipo-hibrida": ["usaHerramientasDiario", "decideSoftwareEquipo"],
  "urbano-cultural-colombia": ["afinidadGenero"],
  "jugador-amateur-futbol-bogota": ["interesFutbol", "consumoDigitalDiario"],
  "colombiana-no-bancarizada": ["migraEfectivo"],
};
