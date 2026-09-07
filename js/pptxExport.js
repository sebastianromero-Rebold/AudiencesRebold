/**
 * pptxExport.js — Genera un .pptx descargable (sin backend, sin OAuth)
 * replicando la paleta/estructura del deck de referencia de Rebold.
 * El archivo resultante se sube a Google Drive y Slides lo abre/convierte
 * automáticamente sin perder formato.
 *
 * Requiere PptxGenJS cargado globalmente (ver index.html).
 */

const PX = {
  bg: "0A0A0A",
  bgAlt: "161616",
  line: "2A2A2A",
  accent: "CD2B53",
  white: "FFFFFF",
  muted: "B4B4B4",
};

function newDeck() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
  return pres;
}

function bgSlide(slide) {
  slide.background = { color: PX.bg };
}

function addBar(slide, { x, y, w, h, pct, color }) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: h / 2, fill: { color: PX.bgAlt }, line: { color: PX.line, width: 0.5 } });
  const fillW = Math.max((w * Math.min(pct, 100)) / 100, 0.05);
  slide.addShape("roundRect", { x, y, w: fillW, h, rectRadius: h / 2, fill: { color: color || PX.accent }, line: { type: "none" } });
}

function addStatRow(slide, { x, y, w, label, pct, valueLabel }) {
  slide.addText(label, { x, y, w: w - 0.7, h: 0.24, fontFace: "Montserrat", fontSize: 9, color: PX.white, isTextBox: true, margin: 0 });
  slide.addText(valueLabel || `${pct}%`, { x: x + w - 0.7, y, w: 0.7, h: 0.24, fontFace: "Montserrat", fontSize: 8.5, color: PX.muted, align: "right", isTextBox: true, margin: 0 });
  addBar(slide, { x, y: y + 0.24, w, h: 0.08, pct });
}

function buildAudiencesPptx({ market, case: kase, steps, universe, personas }) {
  const pres = newDeck();

  // ---- Slide: Portada ----------------------------------------------------
  let s = pres.addSlide();
  bgSlide(s);
  s.addText("AUDIENCES REBOLD", { x: 0.6, y: 3.0, w: 12, h: 0.7, fontFace: "Montserrat", bold: true, fontSize: 30, color: PX.accent, isTextBox: true, margin: 0 });
  s.addText(kase.name, { x: 0.6, y: 3.7, w: 12, h: 0.5, fontFace: "Montserrat", fontSize: 16, color: PX.white, isTextBox: true, margin: 0 });
  s.addText(`Mercado base: ${market.name} · Generado por el equipo Rebold`, { x: 0.6, y: 4.2, w: 12, h: 0.4, fontFace: "Montserrat", fontSize: 11, color: PX.muted, isTextBox: true, margin: 0 });

  // ---- Slide: Mapa de demanda ---------------------------------------------
  s = pres.addSlide();
  bgSlide(s);
  s.addText("AUDIENCIAS", { x: 0.6, y: 0.4, w: 8, h: 0.6, fontFace: "Montserrat", bold: true, fontSize: 26, color: PX.accent, isTextBox: true, margin: 0 });
  s.addText(kase.insightNote, { x: 0.6, y: 1.0, w: 9, h: 0.6, fontFace: "Montserrat", fontSize: 11, color: PX.muted, isTextBox: true, margin: 0 });

  let fy = 1.9;
  steps.forEach((step, i) => {
    s.addText(i === 0 ? `Total / ${market.name}` : step.label, { x: 0.6, y: fy, w: 4.2, h: 0.3, fontFace: "Montserrat", bold: true, fontSize: 10, color: PX.white, isTextBox: true, margin: 0 });
    addBar(s, { x: 5.0, y: fy + 0.05, w: 6.4, h: 0.22, pct: step.pct });
    s.addText(`${step.pct}%  ·  ${Math.round(step.resultAbs).toLocaleString("es-CO")}`, { x: 11.5, y: fy, w: 1.3, h: 0.3, fontFace: "Montserrat", fontSize: 9.5, color: PX.white, align: "right", isTextBox: true, margin: 0 });
    fy += 0.55;
  });
  s.addText(kase.footnotes.map((f) => `* ${f}`).join("\n"), { x: 0.6, y: fy + 0.2, w: 10, h: 0.6, fontFace: "Montserrat", fontSize: 8.5, color: PX.muted, isTextBox: true, margin: 0 });
  s.addText("by Rebold", { x: 12.2, y: 7.1, w: 1, h: 0.3, fontFace: "Montserrat", fontSize: 8, color: PX.muted, align: "right", isTextBox: true, margin: 0 });

  // ---- 2 slides por persona -----------------------------------------------
  personas.forEach((p) => {
    addPersonaProfileSlide(pres, p);
    addPersonaJourneySlide(pres, p);
  });

  pres.writeFile({ fileName: `Audiencias-${slugify(kase.name)}.pptx` });
}

function addPersonaProfileSlide(pres, p) {
  const s = pres.addSlide();
  bgSlide(s);
  s.addText(`"${p.quote}"`, { x: 3.1, y: 0.4, w: 9.6, h: 0.6, fontFace: "Montserrat", italic: true, fontSize: 13, color: PX.white, isTextBox: true, margin: 0 });
  s.addText(p.name.toUpperCase(), { x: 3.1, y: 1.0, w: 9.6, h: 0.4, fontFace: "Montserrat", bold: true, fontSize: 18, color: PX.white, isTextBox: true, margin: 0 });
  s.addText(p.archetype.toUpperCase(), { x: 3.1, y: 1.35, w: 9.6, h: 0.3, fontFace: "Montserrat", bold: true, fontSize: 12, color: PX.accent, isTextBox: true, margin: 0 });
  s.addText(p.description, { x: 3.1, y: 1.7, w: 9.6, h: 0.7, fontFace: "Montserrat", fontSize: 9.5, color: PX.muted, isTextBox: true, margin: 0 });

  s.addShape("roundRect", { x: 0.5, y: 0.4, w: 2.2, h: 2.2, rectRadius: 0.2, fill: { color: PX.bgAlt }, line: { color: PX.line, width: 0.75 } });
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  s.addText(initials, { x: 0.5, y: 0.4, w: 2.2, h: 2.2, align: "center", valign: "middle", fontFace: "Montserrat", bold: true, fontSize: 34, color: PX.accent, isTextBox: true, margin: 0 });

  // Demografía
  s.addText("GÉNERO", { x: 0.5, y: 2.85, w: 2, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 9, color: PX.accent, isTextBox: true, margin: 0 });
  s.addText(`${p.demographics.genderSplit.male}% H  /  ${p.demographics.genderSplit.female}% M`, { x: 0.5, y: 3.1, w: 2.2, h: 0.3, fontFace: "Montserrat", bold: true, fontSize: 12, color: PX.white, isTextBox: true, margin: 0 });

  s.addText("PRINCIPALES CIUDADES", { x: 3.1, y: 2.85, w: 3, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 9, color: PX.accent, isTextBox: true, margin: 0 });
  let cy = 3.15;
  p.demographics.topCities.slice(0, 4).forEach((c) => {
    s.addText(c.city, { x: 3.1, y: cy, w: 1.4, h: 0.2, fontFace: "Montserrat", fontSize: 8, color: PX.white, isTextBox: true, margin: 0 });
    addBar(s, { x: 4.5, y: cy + 0.02, w: 2.2, h: 0.1, pct: c.pct * 2 });
    s.addText(`${c.pct}%`, { x: 6.8, y: cy, w: 0.5, h: 0.2, fontFace: "Montserrat", fontSize: 8, color: PX.muted, isTextBox: true, margin: 0 });
    cy += 0.26;
  });

  s.addText("EDADES", { x: 7.6, y: 2.85, w: 3, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 9, color: PX.accent, isTextBox: true, margin: 0 });
  let ax = 7.6;
  p.demographics.ageBands.forEach((a) => {
    const h = Math.max((a.pct / 40) * 0.5, 0.05);
    s.addShape("rect", { x: ax, y: 3.65 - h, w: 0.5, h, fill: { color: PX.accent }, line: { type: "none" } });
    s.addText(a.label, { x: ax - 0.05, y: 3.68, w: 0.6, h: 0.18, fontFace: "Montserrat", fontSize: 6.5, color: PX.muted, align: "center", isTextBox: true, margin: 0 });
    ax += 0.62;
  });

  // 3 columnas: motivaciones / barreras / intereses digitales
  const colY = 4.15;
  const colW = 4.0;
  const cols = [
    { x: 0.5, title: "MOTIVACIONES", rows: p.motivations.map((m) => ({ label: m.label, pct: m.pct, value: `${m.pct}%` })) },
    { x: 4.7, title: "BARRERAS", rows: p.barriers.map((m) => ({ label: m.label, pct: m.pct, value: `${m.pct}%` })) },
    { x: 8.9, title: "INTERESES DIGITALES", rows: p.digitalInterests.map((d) => ({ label: d.label, pct: Math.min(d.index / 2.5, 100), value: `Aff ${d.index}` })) },
  ];
  cols.forEach((col) => {
    s.addText(col.title, { x: col.x, y: colY, w: colW, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 9.5, color: PX.accent, isTextBox: true, margin: 0 });
    let ry = colY + 0.32;
    col.rows.forEach((row) => {
      addStatRow(s, { x: col.x, y: ry, w: colW, label: row.label, pct: row.pct, valueLabel: row.value });
      ry += 0.42;
    });
  });

  s.addText("PRINCIPALES MEDIOS", { x: 0.5, y: 6.55, w: 4, h: 0.22, fontFace: "Montserrat", bold: true, fontSize: 9, color: PX.accent, isTextBox: true, margin: 0 });
  let mx = 0.5;
  p.media.slice(0, 8).forEach((m) => {
    s.addShape("roundRect", { x: mx, y: 6.82, w: 1.5, h: 0.55, rectRadius: 0.06, fill: { color: PX.bgAlt }, line: { color: PX.line, width: 0.5 } });
    s.addText(`${m.pct}%`, { x: mx + 0.05, y: 6.85, w: 1.4, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 11, color: PX.accent, isTextBox: true, margin: 0 });
    s.addText(m.label, { x: mx + 0.05, y: 7.08, w: 1.4, h: 0.25, fontFace: "Montserrat", fontSize: 6.5, color: PX.muted, isTextBox: true, margin: 0 });
    mx += 1.58;
  });
}

function addPersonaJourneySlide(pres, p) {
  const s = pres.addSlide();
  bgSlide(s);
  s.addText(p.name.toUpperCase(), { x: 0.5, y: 0.35, w: 5, h: 0.4, fontFace: "Montserrat", bold: true, fontSize: 16, color: PX.white, isTextBox: true, margin: 0 });
  s.addText("CUSTOMER JOURNEY", { x: 0.5, y: 0.72, w: 6, h: 0.35, fontFace: "Montserrat", bold: true, fontSize: 14, color: PX.accent, isTextBox: true, margin: 0 });

  const cols = p.journey.length;
  const gap = 0.15;
  const totalW = 12.3;
  const colW = (totalW - gap * (cols - 1)) / cols;
  const top = 1.3;
  const colH = 5.7;

  p.journey.forEach((j, i) => {
    const x = 0.5 + i * (colW + gap);
    s.addShape("roundRect", { x, y: top, w: colW, h: colH, rectRadius: 0.08, fill: { color: PX.bgAlt }, line: { color: PX.line, width: 0.5 } });
    let ty = top + 0.15;
    s.addText(j.block, { x: x + 0.12, y: ty, w: colW - 0.24, h: 0.35, fontFace: "Montserrat", fontSize: 7.5, color: PX.muted, isTextBox: true, margin: 0 });
    ty += 0.28;
    s.addText(j.time, { x: x + 0.12, y: ty, w: colW - 0.24, h: 0.25, fontFace: "Montserrat", bold: true, fontSize: 10, color: PX.accent, isTextBox: true, margin: 0 });
    ty += 0.32;
    const kv = [
      ["Lugar", j.lugar],
      ["Medios", j.medios],
      ["Vehículo", j.vehiculo],
      ["Activación", j.activacion],
    ];
    kv.forEach(([k, v]) => {
      s.addText([{ text: `${k}: `, options: { bold: true, color: PX.white } }, { text: v, options: { color: PX.muted } }], {
        x: x + 0.12, y: ty, w: colW - 0.24, h: 0.6, fontFace: "Montserrat", fontSize: 6.8, isTextBox: true, margin: 0, valign: "top",
      });
      ty += 0.62;
    });
    if (j.activities && j.activities.length) {
      ty = top + colH - 0.18 * j.activities.length - 0.1;
      j.activities.slice(0, 4).forEach((a) => {
        s.addText(`${a.label} — ${a.pct}% · Aff ${a.index}`, { x: x + 0.12, y: ty, w: colW - 0.24, h: 0.18, fontFace: "Montserrat", fontSize: 6, color: PX.muted, isTextBox: true, margin: 0 });
        ty += 0.18;
      });
    }
  });
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
