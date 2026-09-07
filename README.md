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
   variables clave) y el aplicativo calcula el **mapa de demanda** (embudo
   secuencial de filtros sobre el universo digital del mercado elegido) y
   recomienda 2 audiencias finales, **excluyentes entre sí**.
3. Aprueba las audiencias que quieras conservar y revisa su **perfil completo**
   (demografía, motivadores, barreras, comportamiento digital, medios) y su
   **customer journey** (6 momentos del día, de la mañana a la noche).
4. **Guardar en histórico**: queda disponible en la pestaña *Histórico* para
   consultarlo o compararlo después con otra audiencia.
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
