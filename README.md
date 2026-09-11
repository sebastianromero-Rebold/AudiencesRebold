# Audiences Rebold

Aplicativo interno para construir **mapas de demanda**, **buyer personas** y
**customer journeys** de audiencias, y exportarlos como presentación —
siguiendo el mismo formato que usa el equipo Rebold en sus entregables reales
de GWI (ver caso semilla: *Silvestre Dangond & Carlos Vives, CDMX*).

Es un sitio 100% estático (HTML/CSS/JS, sin build step, sin backend) pensado
para GitHub Pages.

## Cómo usarlo

1. Abre `index.html` (o publícalo con GitHub Pages: Settings → Pages → Deploy
   from branch → `main` / `/`).
2. **Nueva audiencia**: responde el wizard (mercado → categoría/caso →
   variables clave, más género/NSE/edad y, si la categoría es Entretenimiento
   en vivo, los **géneros musicales** a agrupar — variable real de GWI) y el
   aplicativo calcula el **mapa de demanda** (embudo secuencial de filtros
   sobre el universo digital del mercado elegido) y recomienda 2 audiencias
   finales, **excluyentes entre sí**. Hay 7 mercados (Colombia, México,
   España, Italia, Chile, Estados Unidos, Argentina) y 12 categorías, una por
   cada vertical de GWI Syndicated (Entretenimiento, Deportes, Retail & Moda,
   Fintech, Alcohol, Automotriz, Tecnología de Consumo, Gaming, Lujo,
   Ocasiones y Momentos, Viajes, Trabajo).
3. Aprueba las audiencias que quieras conservar y revisa su **perfil completo**
   (demografía, motivadores, barreras, comportamiento digital, medios), su
   **customer journey** (6 momentos del día, de la mañana a la noche) y un
   panel de **insights de IA** con ideas clave que puedes abrir una por una.
   Ese insight es texto redactado por el equipo, no una llamada en vivo a un
   modelo de IA — ver "Panel de insights de IA" más abajo.
4. **Guardar en histórico**: queda disponible en la pestaña *Histórico* para
   consultarlo o compararlo después con otra audiencia.
4.5. **Audiencias de GWI** (pestaña propia en el sidebar): en vez de construir
   una audiencia desde cero con el wizard, busca y selecciona directamente
   entre las **audiencias reales ya creadas en la plataforma de GWI** (236
   sincronizadas hasta ahora). Si esa audiencia ya tiene un análisis completo
   construido, se abre directo el mapa de demanda y el perfil; si no, queda
   marcada "Pendiente de análisis" y puedes copiar una solicitud lista para
   pedirle a Claude que la analice — ver "Catálogo de audiencias GWI" abajo.
5. **Descargar .pptx**: genera un PowerPoint con el mismo diseño (negro +
   acento cereza `#CD2B53`, tipografía Montserrat) listo para subir a Google
   Drive — Google Slides lo abre y convierte automáticamente sin perder
   formato.

## Arquitectura y decisiones (leer antes de extender)

Este proyecto se construyó como **sitio estático sin backend**, así que se
tomaron 3 decisiones de diseño que vale la pena conocer antes de tocar el
código:

| Decisión | Qué se hizo | Por qué |
|---|---|---|
| **Datos de audiencias** | Dataset curado en [`js/data.js`](js/data.js), no una llamada en vivo a la API de GWI | GWI requiere autenticación; un sitio estático en GitHub Pages no puede guardar una API key de forma segura |
| **Salida a presentación** | Genera un `.pptx` en el navegador (librería `pptxgenjs`, sin backend) | Crear Google Slides reales requiere OAuth de Google (Client ID en Google Cloud Console), fuera de alcance de un sitio estático |
| **Histórico de audiencias** | `localStorage` del navegador + exportar/importar a JSON | Sin backend no hay base de datos compartida; el JSON exportado se puede subir al repo o compartir manualmente con el equipo |

### Marcado de fuente de los datos

En `js/data.js` cada "caso" trae un campo `source`:

- `"gwi-real"` → cifras tomadas 1:1 de un estudio GWI real de Rebold (el caso
  *Artista colombiano en concierto en México*). Sirve como ejemplo de
  referencia end-to-end.
- `"plantilla"` → estructura de ejemplo con cifras **ilustrativas** (Deportes,
  Retail & Moda, Tecnología & Fintech). Estas **no son datos reales de GWI**:
  están para probar que el aplicativo generaliza a otras categorías, pero
  deben reemplazarse por una consulta real antes de usarse en un plan de
  medios. El aplicativo muestra un badge distinto para cada tipo de fuente.

## Conectar datos reales de GWI

Cuando el equipo tenga un backend/proxy que exponga la API de GWI de forma
segura (la API key nunca debe vivir en el HTML/JS del navegador):

1. Reemplaza el contenido de `CATEGORIES[].cases` en `js/data.js` por datos
   obtenidos de tu backend (mismo shape: `funnelSteps`, `personas` con
   `demographics`, `motivations`, `barriers`, `digitalInterests`, `media`,
   `journey`).
2. Si quieres que la consulta sea en vivo (no pre-cargada), cambia
   `computeResult()` en `js/app.js` para que haga un `fetch()` a tu backend en
   lugar de leer el objeto `CATEGORIES` local.
3. El resto del aplicativo (wizard, mapa de demanda, perfiles, export a pptx,
   histórico) no necesita cambios: todos consumen el mismo objeto `result`
   devuelto por `computeResult()`.

## Catálogo de audiencias GWI

[`js/gwiCatalog.js`](js/gwiCatalog.js) trae un listado (`GWI_AUDIENCE_CATALOG`)
de audiencias **reales** ya creadas en la plataforma de GWI, sincronizado a
mano vía la herramienta MCP `search_audiences` el 2026-09-11 (236 audiencias,
64 clientes distintos: Páramo, Monex, ASUS, HDI, Jägermeister, Corferias,
Banrep, CHUBB, Santander, etc.).

**Importante sobre qué tan "completo" es este catálogo**: `search_audiences`
es búsqueda semántica, no un endpoint de "listar todo" — no hay garantía
matemática de que esto sea el 100% exhaustivo de lo que existe en la cuenta de
GWI, aunque cubre una porción amplia y representativa. Para ampliarlo, corre
más consultas con `search_audiences` (usando `exclude_audience_ids` para
paginar) y agrega los resultados nuevos a `GWI_AUDIENCE_CATALOG`.

**Seleccionar una audiencia del catálogo no la analiza en vivo** — el sitio
sigue sin backend, así que no puede llamar a GWI desde el navegador de cada
usuario (misma limitación de siempre). Por eso cada entrada del catálogo
tiene dos estados posibles:

- **Analizada**: su `audience_id` aparece en `CATALOG_ANALYSIS_LINKS` (mismo
  archivo), apuntando a un `categoryId`/`caseId` ya construido en
  `js/data.js`. Seleccionarla abre el mapa de demanda y el perfil al
  instante — "evitando construirla desde cero", como se pidió.
- **Pendiente de análisis**: todavía no tiene ese enlace. El botón "Copiar
  solicitud de análisis" arma un prompt con el `audience_id` real y las
  instrucciones (usar `chat_gwi` con `docked_audiences`, una pregunta por
  llamada, y `explore_insight_gwi` para las cifras) para pegarlo en una
  conversación con Claude. Al terminar el análisis, se registra el enlace en
  `CATALOG_ANALYSIS_LINKS` y esa audiencia pasa a "Analizada" para todo el
  equipo en el próximo deploy.
- Cuando la **automatización diaria de GWI** (ver abajo) quede conectada, es
  el mecanismo natural para ir llenando `CATALOG_ANALYSIS_LINKS`
  automáticamente en vez de hacerlo a mano.

## Panel de insights de IA

Cada persona trae un campo `aiInsight` en `js/data.js` con un `summary` (cruce
de la audiencia con una tendencia de categoría) y una lista de `ideas` (label
+ detalle), que en el perfil se muestran como tarjetas que el usuario puede
abrir una por una — es la interactividad que pidió el equipo, resuelta sin
backend: es texto redactado por el equipo/IA en el momento de construir el
dataset, **no una llamada en vivo a un modelo de IA** desde el navegador de
cada usuario (mismo límite que GWI y Slides, ver arriba). Si más adelante se
conecta un backend real, este es el campo más fácil de convertir en una
llamada en vivo a un LLM.

## Automatización diaria de GWI (rutina en la nube)

Hay una rutina programada (Claude Code cloud routine, `0 13 * * *` UTC = 8:00
a.m. hora Colombia) que revisa diariamente si hay audiencias **nuevas**
(propias o compartidas) en la plataforma de GWI y arma un borrador de perfil
para cada una.

- **Detección de "nuevo":** compara contra
  [`data/gwi-audience-manifest.json`](data/gwi-audience-manifest.json), que
  registra los `audience_id` de GWI ya procesados. No lo edites a mano salvo
  para borrar una entrada y forzar que la rutina la vuelva a procesar.
- **Nunca escribe directo a `main`:** abre un Pull Request con el borrador
  para que alguien del equipo lo revise antes de que entre a la app en vivo.
  Los datos generados por IA sin supervisión no deben alimentar decisiones
  reales de medios sin pasar por una revisión humana.
- **Fuente `"gwi-auto-draft"`:** los casos que trae la rutina usan este valor
  en `source` (distinto de `"gwi-real"` y `"plantilla"`) para que el badge en
  el wizard deje claro que es un borrador pendiente de revisión editorial,
  sobre todo el *customer journey*, que requiere criterio humano y no debe
  tratarse como dato final solo por venir de GWI.
- Administra la rutina (pausar, editar el prompt, ver el historial de
  ejecuciones) en [claude.ai/code/routines](https://claude.ai/code/routines).

## Conectar Google Slides real (opcional, a futuro)

Si más adelante se quiere generar la presentación directamente en Google
Slides (en vez de descargar un `.pptx`):

1. Crear un proyecto en Google Cloud Console y habilitar la Slides API y la
   Drive API.
2. Crear un OAuth Client ID de tipo "Web application" con el dominio de
   GitHub Pages autorizado.
3. En `js/pptxExport.js`, añadir un flujo con Google Identity Services
   (`google.accounts.oauth2`) para obtener un token y llamar a
   `slides.presentations.create` + `batchUpdate` en lugar de `pptxgenjs`.

## Agregar una nueva categoría o audiencia

En `js/data.js`:

1. Define el "caso" (`CASE_...`) con `funnelSteps` (embudo secuencial de % que
   se aplican uno sobre el resultado del anterior) y 2+ `personas`, cada una
   con `sharePct` (deben sumar 100% para que las audiencias sean excluyentes).
2. Agrega el caso a `CATEGORIES` con sus `traits` (variables que el usuario
   puede priorizar en el wizard).
3. (Opcional) agrega entradas a `PERSONA_RELATED_TRAITS` para que el wizard
   resalte qué persona encaja mejor con las variables elegidas.

## Estructura del proyecto

```
index.html          Punto de entrada
css/app.css          Estilos (shell claro tipo SaaS + "deck" oscuro de preview)
js/data.js           Dataset de mercados, categorías, casos y personas
js/app.js            Wizard, cálculo del mapa de demanda, render, histórico
js/pptxExport.js     Generación del .pptx (usa pptxgenjs vía CDN)
```

## Desarrollo local

No requiere instalación. Sirve la carpeta con cualquier servidor estático,
por ejemplo:

```bash
python3 -m http.server 8791
```

y abre `http://localhost:8791`.
