/**
 * googleSlidesExport.js — Genera la presentación directamente en Google Slides
 * (vía la API de Slides) y la guarda en una carpeta "Audiences Rebold" del
 * Drive del usuario (vía la API de Drive), usando Google Identity Services
 * para el login/OAuth. Sigue sin backend propio: todo corre en el navegador,
 * pero SÍ requiere un OAuth Client ID de Google Cloud (ver README.md).
 *
 * Requiere:
 *  - <script src="https://accounts.google.com/gsi/client"> cargado en index.html.
 *  - GOOGLE_CLIENT_ID configurado abajo con un Client ID real de tipo
 *    "Aplicación web", con https://sebastianromero-rebold.github.io (y
 *    localhost para pruebas) en "Orígenes autorizados de JavaScript".
 *
 * Alcance de permisos (scopes) usado a propósito:
 *  - drive.file: solo ve/gestiona archivos que ESTA app crea (o que el
 *    usuario abre explícitamente con un selector) — no requiere el proceso
 *    de verificación de Google que sí exige el scope completo "drive".
 *  - presentations: crear y editar presentaciones de Slides.
 * Nota: por el scope drive.file, si ya existe una carpeta "Audiences Rebold"
 * creada A MANO (no por esta app) en el Drive, la app no puede verla y
 * creará una carpeta nueva con el mismo nombre la primera vez que se use.
 */

// Client ID de OAuth 2.0 de Google Cloud (tipo "Aplicación web"), con
// https://sebastianromero-rebold.github.io y http://localhost:8799 como
// orígenes autorizados de JavaScript.
const GOOGLE_CLIENT_ID = "349724144839-ajqa0n3aghqnmttuutliu6ti0i3a4t3b.apps.googleusercontent.com";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/presentations",
].join(" ");

const GSLIDES_FOLDER_NAME = "Audiences Rebold";

// Diseño en el mismo canvas 13.33" x 7.5" que pptxExport.js (LAYOUT_WIDE),
// escalado al tamaño por defecto de una presentación nueva de Slides
// (10" x 5.625", misma proporción 16:9) para poder reusar los mismos
// números x/y/w/h que ya están afinados visualmente en pptxExport.js.
const GS_SCALE = 10 / 13.333333;
const EMU_PER_INCH = 914400;

const GX = {
  bg: "0A0A0A",
  bgAlt: "161616",
  line: "2A2A2A",
  accent: "CD2B53",
  white: "FFFFFF",
  muted: "B4B4B4",
};

function hexToRgb01(hex) {
  const n = parseInt(hex, 16);
  return { red: ((n >> 16) & 255) / 255, green: ((n >> 8) & 255) / 255, blue: (n & 255) / 255 };
}

function emu(inches) {
  return Math.round(inches * GS_SCALE * EMU_PER_INCH);
}

function szProp(w, h) {
  return { width: { magnitude: emu(w), unit: "EMU" }, height: { magnitude: emu(h), unit: "EMU" } };
}

function trProp(x, y) {
  return { scaleX: 1, scaleY: 1, translateX: emu(x), translateY: emu(y), unit: "EMU" };
}

// ------------------------------------------------------------------------
// Builder: acumula requests de presentations.batchUpdate con ids únicos.
// ------------------------------------------------------------------------
function makeBuilder() {
  let n = 0;
  return { requests: [], nextId: (prefix) => `${prefix}${n++}` };
}

function addSlide(b) {
  const id = b.nextId("slide");
  b.requests.push({ createSlide: { objectId: id, slideLayoutReference: { predefinedLayout: "BLANK" } } });
  return id;
}

function addPageBg(b, pageId, hex) {
  b.requests.push({
    updatePageProperties: {
      objectId: pageId,
      pageProperties: { pageBackgroundFill: { solidFill: { color: { rgbColor: hexToRgb01(hex) } } } },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });
}

function addTextBox(b, pageId, { x, y, w, h, text, size = 10, color = GX.white, bold = false, italic = false, align = "START", font = "Montserrat" }) {
  if (!text) return null;
  const id = b.nextId("tbox_");
  b.requests.push({ createShape: { objectId: id, shapeType: "TEXT_BOX", elementProperties: { pageObjectId: pageId, size: szProp(w, h), transform: trProp(x, y) } } });
  b.requests.push({ insertText: { objectId: id, text: String(text) } });
  b.requests.push({
    updateTextStyle: {
      objectId: id,
      style: { fontFamily: font, fontSize: { magnitude: size, unit: "PT" }, foregroundColor: { opaqueColor: { rgbColor: hexToRgb01(color) } }, bold, italic },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold,italic",
    },
  });
  if (align !== "START") {
    b.requests.push({ updateParagraphStyle: { objectId: id, style: { alignment: align }, textRange: { type: "ALL" }, fields: "alignment" } });
  }
  return id;
}

// Caja de texto con pares "Clave: valor" en líneas separadas, clave en
// blanco/negrita y valor en gris (reemplaza los runs de texto de pptxgenjs).
function addKeyValueBox(b, pageId, { x, y, w, h, pairs, size = 6.8 }) {
  const id = b.nextId("tbox_");
  b.requests.push({ createShape: { objectId: id, shapeType: "TEXT_BOX", elementProperties: { pageObjectId: pageId, size: szProp(w, h), transform: trProp(x, y) } } });
  let text = "";
  const runs = [];
  pairs.forEach(([k, v]) => {
    const label = `${k}: `;
    runs.push({ start: text.length, end: text.length + label.length, bold: true, color: GX.white });
    text += label;
    runs.push({ start: text.length, end: text.length + String(v).length, bold: false, color: GX.muted });
    text += `${v}\n`;
  });
  b.requests.push({ insertText: { objectId: id, text } });
  b.requests.push({
    updateTextStyle: { objectId: id, style: { fontFamily: "Montserrat", fontSize: { magnitude: size, unit: "PT" } }, textRange: { type: "ALL" }, fields: "fontFamily,fontSize" },
  });
  runs.forEach((r) => {
    b.requests.push({
      updateTextStyle: {
        objectId: id,
        style: { bold: r.bold, foregroundColor: { opaqueColor: { rgbColor: hexToRgb01(r.color) } } },
        textRange: { type: "FIXED_RANGE", startIndex: r.start, endIndex: r.end },
        fields: "bold,foregroundColor",
      },
    });
  });
  return id;
}

function addShapeBox(b, pageId, { x, y, w, h, shapeType, fill, outline }) {
  const id = b.nextId("shape_");
  b.requests.push({ createShape: { objectId: id, shapeType, elementProperties: { pageObjectId: pageId, size: szProp(w, h), transform: trProp(x, y) } } });
  const shapeProperties = {};
  const fields = [];
  if (fill) {
    shapeProperties.shapeBackgroundFill = { solidFill: { color: { rgbColor: hexToRgb01(fill) } } };
    fields.push("shapeBackgroundFill.solidFill.color");
  }
  if (outline) {
    shapeProperties.outline = { outlineFill: { solidFill: { color: { rgbColor: hexToRgb01(outline.color) } } }, weight: { magnitude: outline.weight || 1, unit: "PT" } };
    fields.push("outline");
  } else {
    shapeProperties.outline = { propertyState: "NOT_RENDERED" };
    fields.push("outline.propertyState");
  }
  b.requests.push({ updateShapeProperties: { objectId: id, shapeProperties, fields: fields.join(",") } });
  return id;
}

function addRect(b, pageId, opts) {
  return addShapeBox(b, pageId, { ...opts, shapeType: opts.rounded === false ? "RECTANGLE" : "ROUND_RECTANGLE" });
}

function addEllipse(b, pageId, opts) {
  return addShapeBox(b, pageId, { ...opts, shapeType: "ELLIPSE" });
}

function addBar(b, pageId, { x, y, w, h, pct, color }) {
  addRect(b, pageId, { x, y, w, h, fill: GX.bgAlt, outline: { color: GX.line, weight: 0.75 } });
  const fillW = Math.max((w * Math.min(pct, 100)) / 100, 0.05);
  addRect(b, pageId, { x, y, w: fillW, h, fill: color || GX.accent });
}

function addStatRow(b, pageId, { x, y, w, label, pct, valueLabel }) {
  addTextBox(b, pageId, { x, y, w: w - 0.7, h: 0.24, text: label, size: 9, color: GX.white });
  addTextBox(b, pageId, { x: x + w - 0.7, y, w: 0.7, h: 0.24, text: valueLabel || `${pct}%`, size: 8.5, color: GX.muted, align: "END" });
  addBar(b, pageId, { x, y: y + 0.24, w, h: 0.08, pct });
}

// ------------------------------------------------------------------------
// Diapositivas (misma estructura y cifras que pptxExport.js)
// ------------------------------------------------------------------------
function slidePortada(b, { market, kase }) {
  const pageId = addSlide(b);
  addPageBg(b, pageId, GX.bg);
  addTextBox(b, pageId, { x: 0.6, y: 3.0, w: 12, h: 0.7, text: "AUDIENCES REBOLD", size: 30, color: GX.accent, bold: true });
  addTextBox(b, pageId, { x: 0.6, y: 3.7, w: 12, h: 0.5, text: kase.name, size: 16, color: GX.white });
  addTextBox(b, pageId, { x: 0.6, y: 4.2, w: 12, h: 0.4, text: `Mercado base: ${market.name} · Generado por el equipo Rebold`, size: 11, color: GX.muted });
}

function slideDemandMap(b, { market, kase, steps }) {
  const pageId = addSlide(b);
  addPageBg(b, pageId, GX.bg);
  addTextBox(b, pageId, { x: 0.6, y: 0.4, w: 8, h: 0.6, text: "AUDIENCIAS", size: 26, color: GX.accent, bold: true });
  addTextBox(b, pageId, { x: 0.6, y: 1.0, w: 9, h: 0.6, text: kase.insightNote, size: 11, color: GX.muted });

  let fy = 1.9;
  steps.forEach((step, i) => {
    addTextBox(b, pageId, { x: 0.6, y: fy, w: 4.2, h: 0.3, text: i === 0 ? `Total / ${market.name}` : step.label, size: 10, color: GX.white, bold: true });
    addBar(b, pageId, { x: 5.0, y: fy + 0.05, w: 6.4, h: 0.22, pct: step.pct });
    addTextBox(b, pageId, { x: 11.5, y: fy, w: 1.3, h: 0.3, text: `${step.pct}%  ·  ${Math.round(step.resultAbs).toLocaleString("es-CO")}`, size: 9.5, color: GX.white, align: "END" });
    fy += 0.55;
  });
  addTextBox(b, pageId, { x: 0.6, y: fy + 0.2, w: 10, h: 0.6, text: kase.footnotes.map((f) => `* ${f}`).join("\n"), size: 8.5, color: GX.muted });
  addTextBox(b, pageId, { x: 12.2, y: 7.1, w: 1, h: 0.3, text: "by Rebold", size: 8, color: GX.muted, align: "END" });
}

function slidePersonaProfile(b, p) {
  const pageId = addSlide(b);
  addPageBg(b, pageId, GX.bg);
  addTextBox(b, pageId, { x: 3.1, y: 0.4, w: 9.6, h: 0.6, text: `"${p.quote}"`, size: 13, color: GX.white, italic: true });
  addTextBox(b, pageId, { x: 3.1, y: 1.0, w: 9.6, h: 0.4, text: p.name.toUpperCase(), size: 18, color: GX.white, bold: true });
  addTextBox(b, pageId, { x: 3.1, y: 1.35, w: 9.6, h: 0.3, text: p.archetype.toUpperCase(), size: 12, color: GX.accent, bold: true });
  addTextBox(b, pageId, { x: 3.1, y: 1.7, w: 9.6, h: 0.7, text: p.description, size: 9.5, color: GX.muted });

  addRect(b, pageId, { x: 0.5, y: 0.4, w: 2.2, h: 2.2, fill: GX.bgAlt, outline: { color: GX.line, weight: 0.75 } });
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  addTextBox(b, pageId, { x: 0.5, y: 0.4, w: 2.2, h: 2.2, text: initials, size: 34, color: GX.accent, bold: true, align: "CENTER" });

  addTextBox(b, pageId, { x: 0.5, y: 2.85, w: 2, h: 0.25, text: "GÉNERO", size: 9, color: GX.accent, bold: true });
  addTextBox(b, pageId, { x: 0.5, y: 3.1, w: 2.2, h: 0.3, text: `${p.demographics.genderSplit.male}% H  /  ${p.demographics.genderSplit.female}% M`, size: 12, color: GX.white, bold: true });

  addTextBox(b, pageId, { x: 3.1, y: 2.85, w: 3, h: 0.25, text: "PRINCIPALES CIUDADES", size: 9, color: GX.accent, bold: true });
  let cy = 3.15;
  p.demographics.topCities.slice(0, 4).forEach((c) => {
    addTextBox(b, pageId, { x: 3.1, y: cy, w: 1.4, h: 0.2, text: c.city, size: 8, color: GX.white });
    addBar(b, pageId, { x: 4.5, y: cy + 0.02, w: 2.2, h: 0.1, pct: c.pct * 2 });
    addTextBox(b, pageId, { x: 6.8, y: cy, w: 0.5, h: 0.2, text: `${c.pct}%`, size: 8, color: GX.muted });
    cy += 0.26;
  });

  addTextBox(b, pageId, { x: 7.6, y: 2.85, w: 3, h: 0.25, text: "EDADES", size: 9, color: GX.accent, bold: true });
  let ax = 7.6;
  p.demographics.ageBands.forEach((a) => {
    const h = Math.max((a.pct / 40) * 0.5, 0.05);
    addRect(b, pageId, { x: ax, y: 3.65 - h, w: 0.5, h, fill: GX.accent, rounded: false });
    addTextBox(b, pageId, { x: ax - 0.05, y: 3.68, w: 0.6, h: 0.18, text: a.label, size: 6.5, color: GX.muted, align: "CENTER" });
    ax += 0.62;
  });

  const colY = 4.15;
  const colW = 4.0;
  const cols = [
    { x: 0.5, title: "MOTIVACIONES", rows: p.motivations.map((m) => ({ label: m.label, pct: m.pct, value: `${m.pct}%` })) },
    { x: 4.7, title: "BARRERAS", rows: p.barriers.map((m) => ({ label: m.label, pct: m.pct, value: `${m.pct}%` })) },
    { x: 8.9, title: "INTERESES DIGITALES", rows: p.digitalInterests.map((d) => ({ label: d.label, pct: Math.min(d.index / 2.5, 100), value: `Aff ${d.index}` })) },
  ];
  cols.forEach((col) => {
    addTextBox(b, pageId, { x: col.x, y: colY, w: colW, h: 0.25, text: col.title, size: 9.5, color: GX.accent, bold: true });
    let ry = colY + 0.32;
    col.rows.forEach((row) => {
      addStatRow(b, pageId, { x: col.x, y: ry, w: colW, label: row.label, pct: row.pct, valueLabel: row.value });
      ry += 0.42;
    });
  });

  addTextBox(b, pageId, { x: 0.5, y: 6.55, w: 4, h: 0.22, text: "PRINCIPALES MEDIOS", size: 9, color: GX.accent, bold: true });
  let mx = 0.5;
  p.media.slice(0, 8).forEach((m) => {
    addRect(b, pageId, { x: mx, y: 6.82, w: 1.5, h: 0.55, fill: GX.bgAlt, outline: { color: GX.line, weight: 0.5 } });
    addTextBox(b, pageId, { x: mx + 0.05, y: 6.85, w: 1.4, h: 0.25, text: `${m.pct}%`, size: 11, color: GX.accent, bold: true });
    addTextBox(b, pageId, { x: mx + 0.05, y: 7.08, w: 1.4, h: 0.25, text: m.label, size: 6.5, color: GX.muted });
    mx += 1.58;
  });
}

function slidePersonaJourney(b, p) {
  const pageId = addSlide(b);
  addPageBg(b, pageId, GX.bg);
  addTextBox(b, pageId, { x: 0.5, y: 0.35, w: 5, h: 0.4, text: p.name.toUpperCase(), size: 16, color: GX.white, bold: true });
  addTextBox(b, pageId, { x: 0.5, y: 0.72, w: 6, h: 0.35, text: "CUSTOMER JOURNEY", size: 14, color: GX.accent, bold: true });

  const cols = p.journey.length;
  const gap = 0.15;
  const totalW = 12.3;
  const colW = (totalW - gap * (cols - 1)) / cols;
  const top = 1.3;
  const colH = 5.7;

  p.journey.forEach((j) => {
    // nota: acumulamos x fuera del forEach de arriba porque los índices ya vienen en orden
  });

  p.journey.forEach((j, i) => {
    const x = 0.5 + i * (colW + gap);
    addRect(b, pageId, { x, y: top, w: colW, h: colH, fill: GX.bgAlt, outline: { color: GX.line, weight: 0.5 } });
    let ty = top + 0.15;
    addTextBox(b, pageId, { x: x + 0.12, y: ty, w: colW - 0.24, h: 0.3, text: j.block, size: 7.5, color: GX.muted });
    ty += 0.28;
    addTextBox(b, pageId, { x: x + 0.12, y: ty, w: colW - 0.24, h: 0.25, text: j.time, size: 10, color: GX.accent, bold: true });
    ty += 0.32;
    addKeyValueBox(b, pageId, {
      x: x + 0.12,
      y: ty,
      w: colW - 0.24,
      h: 2.5,
      pairs: [
        ["Lugar", j.lugar],
        ["Medios", j.medios],
        ["Vehículo", j.vehiculo],
        ["Activación", j.activacion],
      ],
      size: 6.8,
    });
    if (j.activities && j.activities.length) {
      const items = j.activities.slice(0, 4);
      const text = items.map((a) => `${a.label} — ${a.pct}% · Aff ${a.index}`).join("\n");
      addTextBox(b, pageId, { x: x + 0.12, y: top + colH - 0.18 * items.length - 0.15, w: colW - 0.24, h: 0.18 * items.length + 0.1, text, size: 6, color: GX.muted });
    }
  });
}

function slidePersonaInsight(b, p) {
  const pageId = addSlide(b);
  addPageBg(b, pageId, GX.bg);
  addTextBox(b, pageId, { x: 0.5, y: 0.35, w: 8, h: 0.4, text: p.name.toUpperCase(), size: 16, color: GX.white, bold: true });
  addTextBox(b, pageId, { x: 0.5, y: 0.72, w: 10, h: 0.35, text: "INSIGHTS DE IA — CRUCE DE TENDENCIAS", size: 14, color: GX.accent, bold: true });
  addTextBox(b, pageId, { x: 0.5, y: 1.25, w: 12.3, h: 0.9, text: p.aiInsight.summary, size: 11, color: GX.muted });

  let iy = 2.35;
  p.aiInsight.ideas.forEach((idea, i) => {
    addRect(b, pageId, { x: 0.5, y: iy, w: 12.3, h: 1.15, fill: GX.bgAlt, outline: { color: GX.line, weight: 0.5 } });
    addEllipse(b, pageId, { x: 0.7, y: iy + 0.18, w: 0.32, h: 0.32, fill: GX.accent });
    addTextBox(b, pageId, { x: 0.7, y: iy + 0.18, w: 0.32, h: 0.32, text: String(i + 1), size: 11, color: GX.white, bold: true, align: "CENTER" });
    addTextBox(b, pageId, { x: 1.2, y: iy + 0.12, w: 11.4, h: 0.3, text: idea.label, size: 11, color: GX.white, bold: true });
    addTextBox(b, pageId, { x: 1.2, y: iy + 0.44, w: 11.4, h: 0.6, text: idea.detail, size: 9, color: GX.muted });
    iy += 1.35;
  });

  addTextBox(b, pageId, {
    x: 0.5,
    y: 7.05,
    w: 10,
    h: 0.3,
    text: "Insight redactado por el equipo Rebold cruzando datos de la audiencia con tendencias de categoría — no es una llamada en vivo a un modelo de IA.",
    size: 7.5,
    color: GX.muted,
    italic: true,
  });
  addTextBox(b, pageId, { x: 12.2, y: 7.1, w: 1, h: 0.3, text: "by Rebold", size: 8, color: GX.muted, align: "END" });
}

// ------------------------------------------------------------------------
// Google Identity Services — obtiene un access token (OAuth implícito)
// ------------------------------------------------------------------------
let gTokenClient = null;
let gCachedToken = null; // { access_token, expires_at }

function ensureTokenClient() {
  if (gTokenClient) return gTokenClient;
  if (!window.google || !google.accounts || !google.accounts.oauth2) {
    throw new Error("Google Identity Services no cargó (revisa tu conexión a internet o que el script esté incluido en index.html).");
  }
  gTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GOOGLE_SCOPES,
    callback: () => {},
  });
  return gTokenClient;
}

function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    if (gCachedToken && gCachedToken.expires_at > now + 60000) {
      resolve(gCachedToken.access_token);
      return;
    }
    let client;
    try {
      client = ensureTokenClient();
    } catch (e) {
      reject(e);
      return;
    }
    client.callback = (resp) => {
      if (resp.error) {
        reject(new Error(`Google no autorizó el acceso (${resp.error}). Intenta de nuevo y acepta los permisos de Drive/Slides.`));
        return;
      }
      gCachedToken = { access_token: resp.access_token, expires_at: Date.now() + resp.expires_in * 1000 };
      resolve(resp.access_token);
    };
    client.requestAccessToken({ prompt: gCachedToken ? "" : "consent" });
  });
}

// ------------------------------------------------------------------------
// Llamadas REST a Drive / Slides
// ------------------------------------------------------------------------
async function apiFetch(url, accessToken, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err.error && err.error.message) || `Error de API de Google (HTTP ${res.status})`);
  }
  return res.json();
}

async function ensureDriveFolder(accessToken, folderName) {
  const q = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`);
  const list = await apiFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, accessToken);
  if (list.files && list.files.length) return list.files[0].id;
  const created = await apiFetch("https://www.googleapis.com/drive/v3/files", accessToken, {
    method: "POST",
    body: JSON.stringify({ name: folderName, mimeType: "application/vnd.google-apps.folder" }),
  });
  return created.id;
}

async function createPresentationShell(accessToken, title) {
  const data = await apiFetch("https://slides.googleapis.com/v1/presentations", accessToken, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  const defaultSlideId = data.slides && data.slides[0] && data.slides[0].objectId;
  return { presentationId: data.presentationId, defaultSlideId };
}

async function moveFileToFolder(accessToken, fileId, folderId) {
  await apiFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${folderId}&removeParents=root&fields=id,parents`, accessToken, {
    method: "PATCH",
  });
}

async function sendSlidesRequests(accessToken, presentationId, requests, onProgress) {
  const CHUNK = 300;
  for (let i = 0; i < requests.length; i += CHUNK) {
    const chunk = requests.slice(i, i + CHUNK);
    await apiFetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, accessToken, {
      method: "POST",
      body: JSON.stringify({ requests: chunk }),
    });
    if (onProgress) onProgress(Math.min(i + CHUNK, requests.length), requests.length);
  }
}

// ------------------------------------------------------------------------
// Orquestador principal — llamado desde app.js
// ------------------------------------------------------------------------
async function exportAudiencesToGoogleSlides({ market, case: kase, steps, universe, personas }, { onStatus } = {}) {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.indexOf("PEGA_AQUI") !== -1) {
    throw new Error('Falta configurar GOOGLE_CLIENT_ID en js/googleSlidesExport.js con un Client ID real de Google Cloud (ver README.md, sección "Conectar Google Slides real").');
  }

  onStatus && onStatus("Conectando con tu cuenta de Google…");
  const accessToken = await getGoogleAccessToken();

  onStatus && onStatus(`Buscando/creando la carpeta "${GSLIDES_FOLDER_NAME}" en tu Drive…`);
  const folderId = await ensureDriveFolder(accessToken, GSLIDES_FOLDER_NAME);

  onStatus && onStatus("Creando la presentación en Google Slides…");
  const title = `Audiencias - ${kase.name}`;
  const { presentationId, defaultSlideId } = await createPresentationShell(accessToken, title);

  const b = makeBuilder();
  if (defaultSlideId) b.requests.push({ deleteObject: { objectId: defaultSlideId } });
  slidePortada(b, { market, kase });
  slideDemandMap(b, { market, kase, steps });
  personas.forEach((p) => {
    slidePersonaProfile(b, p);
    slidePersonaJourney(b, p);
    if (p.aiInsight) slidePersonaInsight(b, p);
  });

  onStatus && onStatus("Escribiendo diapositivas…");
  await sendSlidesRequests(accessToken, presentationId, b.requests, (done, total) => {
    onStatus && onStatus(`Escribiendo diapositivas… ${Math.round((done / total) * 100)}%`);
  });

  onStatus && onStatus("Moviendo el archivo a tu carpeta de Drive…");
  await moveFileToFolder(accessToken, presentationId, folderId);

  return { presentationId, url: `https://docs.google.com/presentation/d/${presentationId}/edit` };
}
