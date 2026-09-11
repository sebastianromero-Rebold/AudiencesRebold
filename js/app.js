/**
 * app.js — Lógica del aplicativo Audiences Rebold.
 * Vanilla JS, sin build step (pensado para GitHub Pages).
 * Depende de: data.js (dataset) y pptxExport.js (export a .pptx).
 */

// ------------------------------------------------------------------------
// Estado
// ------------------------------------------------------------------------
const HISTORY_KEY = "audiencesRebold.history.v1";

const state = {
  view: "wizard",
  wizard: {
    step: 1,
    marketId: "COL",
    categoryId: null,
    caseId: null,
    selectedTraitIds: [],
    ageBands: [],
    genderFilter: "todos", // "todos" | "hombres" | "mujeres"
    nseLevels: [],
    genreIds: [], // solo aplica cuando categoryId === "entretenimiento"
  },
  result: null, // ver computeResult()
  approved: new Set(),
  history: loadHistory(),
  compareIds: [],
  openHistoryId: null,
  openIdeas: {}, // { [personaId]: openIdeaIndex } — para el panel de insights de IA
  catalogQuery: "",
  catalogTypeFilter: "todas", // "todas" | "authored" | "shared" | "curated"
  catalogSelectedId: null,
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("No se pudo leer el histórico local", e);
    return [];
  }
}
function persistHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

// ------------------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------------------
function fmt(n) {
  return Math.round(n).toLocaleString("es-CO");
}
function pct(n) {
  return `${n}%`;
}
function findCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}
function findCase(categoryId, caseId) {
  const cat = findCategory(categoryId);
  return cat ? cat.cases.find((c) => c.id === caseId) : null;
}
function findMarket(id) {
  return MARKETS.find((m) => m.id === id);
}
function uid() {
  return "aud_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// ------------------------------------------------------------------------
// Cálculo del embudo (mapa de demanda) y del tamaño de cada persona
// ------------------------------------------------------------------------
function computeResult(marketId, categoryId, caseId, genreIds) {
  const market = findMarket(marketId);
  const kase = findCase(categoryId, caseId);
  if (!market || !kase) return null;

  let running = market.digitalPop;
  const steps = [{ label: "Total activos en digital", pct: 100, resultAbs: running, ofPrevious: 100 }];
  kase.funnelSteps.forEach((s) => {
    running = running * (s.pct / 100);
    steps.push({ label: s.label, pct: Math.round((running / market.digitalPop) * 1000) / 10, resultAbs: running, ofPrevious: s.pct });
  });

  // Géneros musicales (solo Entretenimiento en vivo): agrupa los géneros
  // elegidos como "afinidad con AL MENOS UNO de los géneros seleccionados"
  // (fórmula de unión asumiendo independencia), usando el % real de GWI de
  // cada género como probabilidad individual, y añade un paso más al embudo.
  if (categoryId === "entretenimiento" && genreIds && genreIds.length > 0) {
    const genres = genreIds.map((id) => MUSIC_GENRES.find((g) => g.id === id)).filter(Boolean);
    const combinedPct = (1 - genres.reduce((acc, g) => acc * (1 - g.refPct / 100), 1)) * 100;
    running = running * (combinedPct / 100);
    steps.push({
      label: `Afinidad con géneros musicales seleccionados (${genres.map((g) => g.label).join(", ")})`,
      pct: Math.round((running / market.digitalPop) * 1000) / 10,
      resultAbs: running,
      ofPrevious: Math.round(combinedPct * 10) / 10,
    });
  }

  const finalTotal = running;

  const personas = kase.personas.map((p) => ({
    ...p,
    sizeAbs: finalTotal * (p.sharePct / 100),
  }));

  return { market, category: findCategory(categoryId), case: kase, steps, universe: market.digitalPop, finalTotal, personas };
}

// ------------------------------------------------------------------------
// Render raíz
// ------------------------------------------------------------------------
function render() {
  document.getElementById("root").innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="main">${renderMain()}</div>
    </div>
  `;
  bindEvents();
}

function renderSidebar() {
  const item = (view, label, icon) => `
    <button class="nav-item ${state.view === view ? "active" : ""}" data-nav="${view}">
      ${icon}<span>${label}</span>
    </button>`;
  return `
    <div class="sidebar">
      <div class="brand">
        <div class="mark">R</div>
        <div>
          <div class="name">Audiences Rebold</div>
          <div class="sub">Buyer personas · GWI</div>
        </div>
      </div>
      <div class="nav">
        ${item("wizard", "Nueva audiencia", icon("plus"))}
        ${item("catalog", "Audiencias de GWI", icon("search"))}
        ${item("history", "Histórico", icon("clock"))}
      </div>
      <div class="sidebar-footer">
        <b>Fuente de datos</b>
        Dataset curado (ver <code>js/data.js</code>). Un caso está construido con
        cifras reales de GWI; el resto son plantillas ilustrativas listas para
        reemplazar por tu propia consulta GWI.
      </div>
    </div>`;
}

function icon(name) {
  const icons = {
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>`,
  };
  return icons[name] || "";
}

function renderMain() {
  switch (state.view) {
    case "wizard": return renderWizard();
    case "catalog": return renderCatalog();
    case "profiles": return renderProfiles();
    case "history": return renderHistory();
    case "compare": return renderCompare();
    default: return "";
  }
}

// ------------------------------------------------------------------------
// WIZARD
// ------------------------------------------------------------------------
function renderWizard() {
  const w = state.wizard;
  const steps = [1, 2, 3];
  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Nueva audiencia</div>
        <h1 class="title-xl">Construye el mapa de demanda</h1>
      </div>
    </div>
    <div class="steps">${steps.map((s) => `<div class="step-pill ${w.step > s || (w.step === s) ? "done" : ""}"></div>`).join("")}</div>
    <div class="card">
      ${w.step === 1 ? renderWizardStep1() : ""}
      ${w.step === 2 ? renderWizardStep2() : ""}
      ${w.step === 3 ? renderWizardStep3() : ""}
    </div>
  `;
}

function renderWizardStep1() {
  const w = state.wizard;
  return `
    <div class="section-title">Paso 1 · Mercado y categoría</div>
    <p style="margin-bottom:14px;color:var(--muted);font-size:13px;">¿Para qué mercado y qué tipo de negocio/campaña vas a construir audiencias?</p>
    <div style="margin-bottom:18px;">
      <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">Mercado principal</div>
      <div class="option-grid">
        ${MARKETS.map((m) => `
          <div class="option-card ${w.marketId === m.id ? "selected" : ""}" data-market="${m.id}">
            <div class="emoji">${m.flag}</div>
            <div class="label">${m.name}</div>
            <div class="desc">${fmt(m.digitalPop)} activos en digital</div>
          </div>`).join("")}
      </div>
    </div>
    <div>
      <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">Categoría / vertical</div>
      <div class="option-grid">
        ${CATEGORIES.map((c) => `
          <div class="option-card ${w.categoryId === c.id ? "selected" : ""}" data-category="${c.id}">
            <div class="emoji">${c.icon}</div>
            <div class="label">${c.name}</div>
            <div class="desc">${c.description}</div>
          </div>`).join("")}
      </div>
    </div>
    <div class="wizard-footer">
      <span></span>
      <button class="btn primary" data-action="wizard-next" ${!(w.marketId && w.categoryId) ? "disabled" : ""}>Siguiente →</button>
    </div>
  `;
}

function sourceBadgeHtml(source) {
  const map = {
    "gwi-real": { cls: "real", label: "● Dato real GWI" },
    "gwi-auto-draft": { cls: "draft", label: "◔ Borrador automático GWI — pendiente de revisión" },
    plantilla: { cls: "plantilla", label: "◐ Plantilla ilustrativa" },
  };
  const m = map[source] || map.plantilla;
  return `<span class="source-badge ${m.cls}" style="margin-top:6px;width:fit-content;">${m.label}</span>`;
}

function renderWizardStep2() {
  const w = state.wizard;
  const cat = findCategory(w.categoryId);
  if (!w.caseId) w.caseId = cat.cases[0].id;
  return `
    <div class="section-title">Paso 2 · Caso y variables clave</div>
    ${cat.cases.length > 1 ? `
      <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">Elige el caso</div>
      <div class="option-grid" style="margin-bottom:18px;">
        ${cat.cases.map((k) => `
          <div class="option-card ${w.caseId === k.id ? "selected" : ""}" data-case="${k.id}">
            <div class="label">${k.name}</div>
            <div class="desc">${k.insightNote}</div>
            ${sourceBadgeHtml(k.source)}
          </div>`).join("")}
      </div>` : `
      <div class="option-card selected" style="margin-bottom:18px;cursor:default;">
        <div class="label">${cat.cases[0].name}</div>
        <div class="desc">${cat.cases[0].insightNote}</div>
        ${sourceBadgeHtml(cat.cases[0].source)}
      </div>`}
    <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">¿Qué variables quieres priorizar para recomendar las audiencias?</div>
    <div class="trait-list" style="margin-bottom:18px;">
      ${cat.traits.map((t) => `
        <div class="trait-row ${w.selectedTraitIds.includes(t.id) ? "checked" : ""}" data-trait="${t.id}">
          <input type="checkbox" ${w.selectedTraitIds.includes(t.id) ? "checked" : ""} style="pointer-events:none;" />
          <span class="label">${t.label}</span>
        </div>`).join("")}
    </div>
    ${w.categoryId === "entretenimiento" ? `
      <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">Géneros musicales a agrupar (variable real de GWI)</div>
      <p style="font-size:11.5px;color:var(--muted);margin-bottom:8px;">Selecciona uno o más géneros — se agrupan como "afinidad con al menos uno de ellos" y se ven reflejados como un paso propio en el mapa de demanda.</p>
      <div class="age-chip-row" style="margin-bottom:18px;">
        ${MUSIC_GENRES.map((g) => `<div class="age-chip ${w.genreIds.includes(g.id) ? "checked" : ""}" data-genre="${g.id}">${g.label} <small style="opacity:.7;">(${g.refPct}%)</small></div>`).join("")}
      </div>` : ""}
    <div style="font-weight:700;font-size:12.5px;margin-bottom:8px;">Más datos demográficos a priorizar (opcional)</div>
    <div style="margin-bottom:10px;">
      <div style="font-size:11.5px;color:var(--muted);margin-bottom:6px;">Género</div>
      <div class="age-chip-row">
        ${[["todos", "Todos"], ["hombres", "Hombres"], ["mujeres", "Mujeres"]].map(([id, label]) => `<div class="age-chip ${w.genderFilter === id ? "checked" : ""}" data-gender="${id}">${label}</div>`).join("")}
      </div>
    </div>
    <div style="margin-bottom:10px;">
      <div style="font-size:11.5px;color:var(--muted);margin-bottom:6px;">Nivel socioeconómico (NSE)</div>
      <div class="age-chip-row">
        ${NSE_LEVELS.map((n) => `<div class="age-chip ${w.nseLevels.includes(n) ? "checked" : ""}" data-nse="${n}">${n}</div>`).join("")}
      </div>
    </div>
    <div style="margin-bottom:6px;">
      <div style="font-size:11.5px;color:var(--muted);margin-bottom:6px;">Rango de edad</div>
      <div class="age-chip-row">
        ${AGE_BANDS.map((a) => `<div class="age-chip ${w.ageBands.includes(a) ? "checked" : ""}" data-age="${a}">${a}</div>`).join("")}
      </div>
    </div>
    <div class="wizard-footer">
      <button class="btn ghost" data-action="wizard-back">← Atrás</button>
      <button class="btn primary" data-action="wizard-next">Calcular mapa de demanda →</button>
    </div>
  `;
}

function renderWizardStep3() {
  const w = state.wizard;
  if (!state.result) state.result = computeResult(w.marketId, w.categoryId, w.caseId, w.genreIds);
  const r = state.result;
  if (state.approved.size === 0) r.personas.forEach((p) => state.approved.add(p.id));

  const relatedScore = (persona) => {
    const rel = PERSONA_RELATED_TRAITS[persona.id] || [];
    return rel.filter((t) => w.selectedTraitIds.includes(t)).length;
  };

  return `
    <div class="section-title">Paso 3 · Mapa de demanda y audiencias recomendadas</div>
    <p style="color:var(--muted);font-size:12.5px;margin-bottom:6px;">
      Universo: <b>${r.market.name}</b> — ${fmt(r.universe)} activos en digital (100%).
    </p>
    <div class="funnel">
      ${r.steps.map((s, i) => `
        <div class="funnel-row">
          <div class="funnel-label">${i === 0 ? "Total" : s.label}</div>
          <div class="funnel-track"><div class="funnel-fill" style="width:${Math.max(s.pct, 2)}%"></div></div>
          <div class="funnel-value">${fmt(s.resultAbs)}<small>${s.pct}% del universo${i > 0 ? ` · ${s.ofPrevious}% del paso anterior` : ""}</small></div>
        </div>`).join("")}
    </div>
    <p style="font-size:11px;color:var(--muted);margin:10px 0 20px;">
      * Cálculo secuencial (cada filtro se aplica sobre el resultado del anterior), método idéntico al usado en estudios reales de GWI.
      ${r.case.footnotes.map((f) => `<br/>* ${f}`).join("")}
    </p>

    <div class="section-title">Audiencias recomendadas (excluyentes entre sí)</div>
    ${r.personas
      .slice()
      .sort((a, b) => relatedScore(b) - relatedScore(a))
      .map((p) => `
        <div class="persona-pick ${state.approved.has(p.id) ? "checked" : ""}" data-persona-toggle="${p.id}">
          <div>
            <input type="checkbox" ${state.approved.has(p.id) ? "checked" : ""} style="margin-right:10px;pointer-events:none;" />
            <span class="who">${p.name}</span> — <span class="arch">${p.archetype}</span>
            ${relatedScore(p) > 0 ? `<div class="pill" style="margin-top:6px;">Coincide con tus variables</div>` : ""}
          </div>
          <div class="size">${fmt(p.sizeAbs)}<small>${p.sharePct}% de la audiencia final</small></div>
        </div>`).join("")}

    <div class="wizard-footer">
      <button class="btn ghost" data-action="wizard-back">← Atrás</button>
      <button class="btn primary" data-action="approve-personas" ${state.approved.size === 0 ? "disabled" : ""}>
        Ver perfiles aprobados (${state.approved.size}) →
      </button>
    </div>
  `;
}

// ------------------------------------------------------------------------
// PERFILES (vista "deck" oscura)
// ------------------------------------------------------------------------
function renderProfiles() {
  const r = state.result;
  if (!r) {
    state.view = "wizard";
    return renderWizard();
  }
  const approvedPersonas = r.personas.filter((p) => state.approved.has(p.id));

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">${r.case.name}</div>
        <h1 class="title-xl">Perfiles de audiencia</h1>
      </div>
      <div class="topbar-actions">
        <button class="btn" data-action="back-to-wizard">← Editar mapa de demanda</button>
        <button class="btn accent" data-action="save-history">${icon("check")} Guardar en histórico</button>
        <button class="btn primary" data-action="export-pptx">${icon("download")} Descargar .pptx</button>
      </div>
    </div>

    <div class="deck">
      <div class="deck-slide-tag">MAPA DE DEMANDA</div>
      <h2 class="deck-title">AUDIENCIAS</h2>
      <div class="deck-sub">${r.case.insightNote}</div>
      <div class="deck-funnel">
        ${r.steps.map((s, i) => `
          <div class="deck-funnel-row">
            <div class="deck-funnel-label">${i === 0 ? `Total / ${r.market.name}` : s.label}</div>
            <div class="deck-track"><div class="deck-fill" style="width:${Math.max(s.pct, 2)}%"></div></div>
            <div class="deck-funnel-value">${s.pct}%<small>${fmt(s.resultAbs)}</small></div>
          </div>`).join("")}
      </div>
      <div class="deck-footnotes">${r.case.footnotes.map((f) => `<div>* ${f}</div>`).join("")}</div>
      <div class="deck-by">by Rebold</div>
    </div>

    ${approvedPersonas.map((p) => renderPersonaDeckSlides(p)).join("")}
  `;
}

function renderPersonaDeckSlides(p) {
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return `
    <div class="deck">
      <div class="deck-slide-tag">PERFIL DE AUDIENCIA</div>
      <div class="deck-persona-header">
        <div class="deck-avatar">${initials}</div>
        <div>
          <div class="deck-quote">"${p.quote}"</div>
          <div class="deck-name">${p.name.toUpperCase()}</div>
          <div class="deck-arch">${p.archetype.toUpperCase()}</div>
          <div class="deck-desc">${p.description}</div>
        </div>
      </div>

      <div class="deck-demo">
        <div>
          <div class="deck-donut-label">Género</div>
          <div class="deck-gender">
            <div class="g"><b>${p.demographics.genderSplit.male}%</b>Hombres</div>
            <div class="g"><b>${p.demographics.genderSplit.female}%</b>Mujeres</div>
          </div>
        </div>
        <div style="flex:1;min-width:220px;">
          <div class="deck-donut-label">Edades</div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:60px;">
            ${p.demographics.ageBands.map((a) => `
              <div style="flex:1;text-align:center;">
                <div style="background:var(--deck-accent);height:${Math.max(a.pct * 1.6, 4)}px;border-radius:4px 4px 0 0;"></div>
                <div style="font-size:9px;color:var(--deck-muted);margin-top:3px;">${a.label}</div>
                <div style="font-size:9px;">${a.pct}%</div>
              </div>`).join("")}
          </div>
        </div>
        <div class="deck-cities">
          <div class="deck-donut-label">Principales ciudades</div>
          ${p.demographics.topCities.map((c) => `
            <div class="deck-city-row">
              <span>${c.city}</span>
              <div class="deck-track"><div class="deck-fill" style="width:${Math.max(c.pct * 2, 4)}%"></div></div>
              <span>${c.pct}%</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="deck-grid3">
        <div class="deck-col">
          <h4>Motivaciones</h4>
          ${p.motivations.map((m) => renderDeckStat(m)).join("")}
        </div>
        <div class="deck-col">
          <h4>Barreras</h4>
          ${p.barriers.map((m) => renderDeckStat(m)).join("")}
        </div>
        <div class="deck-col">
          <h4>Intereses y comportamiento digital</h4>
          ${p.digitalInterests.map((d) => `
            <div class="deck-stat">
              <div class="lbl">${d.label} <span class="pctnum">Índice ${d.index}</span></div>
              <div class="bar"><i style="width:${Math.min(d.index / 2.5, 100)}%"></i></div>
            </div>`).join("")}
        </div>
      </div>

      <div class="deck-donut-label" style="margin-top:16px;">Principales medios</div>
      <div class="deck-media-row">
        ${p.media.map((m) => `<div class="deck-media-chip"><div class="n">${m.pct}%</div><div class="l">${m.label}</div></div>`).join("")}
      </div>
      <div class="deck-by">by Rebold</div>
    </div>

    <div class="deck">
      <div class="deck-slide-tag">CUSTOMER JOURNEY</div>
      <div class="deck-journey-title">
        <span class="who">${p.name.toUpperCase()}</span>
        <span class="lbl">CUSTOMER JOURNEY</span>
      </div>
      <div class="journey-track">
        ${p.journey.map((j) => `
          <div class="journey-block">
            <div class="block-name">${j.block}</div>
            <div class="time">${j.time}</div>
            <div class="kv"><b>Lugar:</b> ${j.lugar}</div>
            <div class="kv"><b>Medios:</b> ${j.medios}</div>
            <div class="kv"><b>Vehículo:</b> ${j.vehiculo}</div>
            <div class="kv"><b>Activación:</b> ${j.activacion}</div>
            ${j.activities.length ? `<div class="act">${j.activities.map((a) => `<div>${a.label} — ${a.pct}% · Aff ${a.index}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>
      <div class="deck-by">by Rebold</div>
    </div>

    ${p.aiInsight ? `
    <div class="deck">
      <div class="deck-slide-tag">INSIGHTS DE IA</div>
      <h2 class="deck-title" style="font-size:22px;">Cruce de tendencias con IA</h2>
      <div class="deck-sub" style="max-width:100%;">${p.aiInsight.summary}</div>
      <div class="deck-donut-label" style="margin-top:10px;">Ideas clave — haz clic para ver el detalle</div>
      <div class="ai-idea-list" data-persona-id="${p.id}">
        ${p.aiInsight.ideas.map((idea, i) => `
          <div class="ai-idea ${state.openIdeas[p.id] === i ? "open" : ""}" data-idea-toggle="${p.id}:${i}">
            <div class="ai-idea-head">
              <span class="ai-idea-num">${i + 1}</span>
              <span class="ai-idea-label">${idea.label}</span>
              <span class="ai-idea-caret">${state.openIdeas[p.id] === i ? "−" : "+"}</span>
            </div>
            ${state.openIdeas[p.id] === i ? `<div class="ai-idea-detail">${idea.detail}</div>` : ""}
          </div>`).join("")}
      </div>
      <p style="font-size:10px;color:var(--deck-muted);margin-top:14px;">Insight redactado por el equipo Rebold cruzando los datos de esta audiencia con tendencias de categoría — no es una llamada en vivo a un modelo de IA (aplicativo sin backend, ver README).</p>
      <div class="deck-by">by Rebold</div>
    </div>` : ""}
  `;
}

function renderDeckStat(m) {
  return `
    <div class="deck-stat">
      <div class="lbl">${m.label} <span class="pctnum">${m.pct}%</span></div>
      <div class="bar"><i style="width:${m.pct}%"></i></div>
    </div>`;
}

// ------------------------------------------------------------------------
// HISTÓRICO
// ------------------------------------------------------------------------
function renderHistory() {
  const list = state.history.slice().sort((a, b) => b.createdAt - a.createdAt);
  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Histórico</div>
        <h1 class="title-xl">Audiencias construidas</h1>
      </div>
      <div class="topbar-actions">
        <button class="btn" data-action="export-json">${icon("download")} Exportar JSON</button>
        <label class="btn" style="cursor:pointer;">
          Importar JSON
          <input type="file" accept="application/json" id="import-file" style="display:none;" />
        </label>
      </div>
    </div>
    <div class="card" style="padding:0;">
      ${list.length === 0 ? `
        <div class="empty-state">
          <div class="big">🗂️</div>
          <b>Todavía no has guardado audiencias.</b>
          <p style="margin-top:6px;">Crea una audiencia y guárdala desde la vista de perfiles.</p>
        </div>` : list.map((h) => `
        <div class="hist-row">
          <div>
            <div class="name">${h.caseName}</div>
            <div class="meta">${h.marketName} · ${h.categoryName} · ${h.personas.map((p) => p.name).join(", ")}</div>
          </div>
          <div class="pill">${fmt(h.finalTotal)} pers.</div>
          <div class="pill">${new Date(h.createdAt).toLocaleDateString("es-CO")}</div>
          <div style="display:flex;gap:6px;">
            <input type="checkbox" data-compare="${h.id}" ${state.compareIds.includes(h.id) ? "checked" : ""} title="Seleccionar para comparar" />
            <span class="meta">comparar</span>
          </div>
          <div style="display:flex;gap:6px;justify-content:flex-end;">
            <button class="btn small" data-action="open-history" data-id="${h.id}">Ver</button>
            <button class="btn small ghost" data-action="delete-history" data-id="${h.id}">✕</button>
          </div>
        </div>`).join("")}
    </div>
    ${state.compareIds.length === 2 ? `
      <div style="margin-top:16px;text-align:right;">
        <button class="btn primary" data-action="go-compare">Comparar seleccionadas →</button>
      </div>` : ""}
    ${state.openHistoryId ? renderHistoryDetail() : ""}
  `;
}

function renderHistoryDetail() {
  const h = state.history.find((x) => x.id === state.openHistoryId);
  if (!h) return "";
  return `
    <div style="margin-top:18px;">
      <div class="section-title">Detalle: ${h.caseName}</div>
      ${h.personas.map((p) => renderPersonaDeckSlides(p)).join("")}
    </div>
  `;
}

// ------------------------------------------------------------------------
// COMPARAR
// ------------------------------------------------------------------------
function renderCompare() {
  const [a, b] = state.compareIds.map((id) => state.history.find((h) => h.id === id));
  if (!a || !b) {
    state.view = "history";
    return renderHistory();
  }
  const row = (label, va, vb) => `<div class="compare-col"><div class="stat-line"><span>${label}</span><b>${va}</b></div></div>`;
  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Comparar audiencias</div>
        <h1 class="title-xl">${a.caseName} vs. ${b.caseName}</h1>
      </div>
      <div class="topbar-actions"><button class="btn" data-action="nav-history">← Volver al histórico</button></div>
    </div>
    <div class="card">
      <div class="compare-grid">
        <div>
          <h3>${a.caseName}</h3>
          <p class="meta" style="color:var(--muted);margin:6px 0 12px;">${a.marketName} · ${new Date(a.createdAt).toLocaleDateString("es-CO")}</p>
          <div class="stat-line"><span>Audiencia total</span><b>${fmt(a.finalTotal)}</b></div>
          ${a.personas.map((p) => `<div class="stat-line"><span>${p.name} (${p.archetype})</span><b>${fmt(p.sizeAbs)}</b></div>`).join("")}
          ${a.personas.map((p) => `<div class="stat-line"><span>Top medio — ${p.name}</span><b>${p.media[0]?.label} ${p.media[0]?.pct}%</b></div>`).join("")}
        </div>
        <div>
          <h3>${b.caseName}</h3>
          <p class="meta" style="color:var(--muted);margin:6px 0 12px;">${b.marketName} · ${new Date(b.createdAt).toLocaleDateString("es-CO")}</p>
          <div class="stat-line"><span>Audiencia total</span><b>${fmt(b.finalTotal)}</b></div>
          ${b.personas.map((p) => `<div class="stat-line"><span>${p.name} (${p.archetype})</span><b>${fmt(p.sizeAbs)}</b></div>`).join("")}
          ${b.personas.map((p) => `<div class="stat-line"><span>Top medio — ${p.name}</span><b>${p.media[0]?.label} ${p.media[0]?.pct}%</b></div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------
// CATÁLOGO DE AUDIENCIAS REALES DE GWI
// ------------------------------------------------------------------------
const CATALOG_TYPE_LABEL = { authored: "Mis audiencias", shared: "Compartidas", curated: "GWI" };

function catalogMatches(a, q) {
  if (!q) return true;
  const hay = `${a.title} ${a.client} ${a.description}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((term) => hay.includes(term));
}

function renderCatalog() {
  const q = state.catalogQuery.trim();
  const typeFilter = state.catalogTypeFilter;
  const filtered = GWI_AUDIENCE_CATALOG.filter(
    (a) => catalogMatches(a, q) && (typeFilter === "todas" || a.type === typeFilter)
  );
  const showLimit = 60;
  const shown = filtered.slice(0, showLimit);
  const selected = state.catalogSelectedId ? GWI_AUDIENCE_CATALOG.find((a) => a.id === state.catalogSelectedId) : null;

  const typeCounts = { todas: GWI_AUDIENCE_CATALOG.length };
  ["authored", "shared", "curated"].forEach((t) => (typeCounts[t] = GWI_AUDIENCE_CATALOG.filter((a) => a.type === t).length));

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Audiencias de GWI</div>
        <h1 class="title-xl">Selecciona una audiencia ya creada</h1>
      </div>
    </div>
    <p style="color:var(--muted);font-size:12.5px;margin-bottom:16px;max-width:720px;">
      Catálogo sincronizado desde la plataforma de GWI (<code>search_audiences</code>) —
      ${GWI_AUDIENCE_CATALOG.length} audiencias reales creadas por el equipo. Si una ya tiene
      análisis completo, se abre directo; si no, puedes pedir que se analice, en vez de
      construirla desde cero.
    </p>
    <div class="card">
      <input type="text" id="catalog-search" placeholder="Buscar por cliente, marca o palabra clave (ej. Jagermeister, fútbol, fintech)..."
        value="${escapeHtml(state.catalogQuery)}"
        style="width:100%;padding:12px 16px;border-radius:999px;border:1.5px solid var(--border);font-size:13px;margin-bottom:14px;font-family:inherit;" />
      <div class="age-chip-row" style="margin-bottom:16px;">
        ${["todas", "authored", "shared", "curated"].map((t) => `
          <div class="age-chip ${typeFilter === t ? "checked" : ""}" data-catalog-type="${t}">
            ${t === "todas" ? "Todas" : CATALOG_TYPE_LABEL[t]} (${typeCounts[t]})
          </div>`).join("")}
      </div>
      <div style="max-height:420px;overflow-y:auto;">
        ${shown.length === 0 ? `<div class="empty-state"><div class="big">🔍</div>Sin resultados para esa búsqueda.</div>` : shown.map((a) => {
          const linked = CATALOG_ANALYSIS_LINKS[a.id];
          const parts = a.title.split(">").map((s) => s.trim());
          return `
          <div class="hist-row" style="grid-template-columns:1fr 120px 90px;cursor:pointer;" data-catalog-select="${a.id}">
            <div>
              <div class="name">${escapeHtml(parts[parts.length - 1])}</div>
              <div class="meta">${escapeHtml(parts.slice(0, -1).join(" › ") || a.client)}</div>
            </div>
            <div class="pill">${CATALOG_TYPE_LABEL[a.type]}</div>
            <div class="pill" style="background:${linked ? "var(--accent-soft)" : "var(--surface-alt)"};">${linked ? "✓ Analizada" : "Pendiente"}</div>
          </div>`;
        }).join("")}
      </div>
      ${filtered.length > showLimit ? `<p style="font-size:11px;color:var(--muted);margin-top:10px;">Mostrando ${showLimit} de ${filtered.length} resultados — afina la búsqueda para ver más.</p>` : ""}
    </div>

    ${selected ? renderCatalogDetail(selected) : ""}
  `;
}

function renderCatalogDetail(a) {
  const linked = CATALOG_ANALYSIS_LINKS[a.id];
  const parts = a.title.split(">").map((s) => s.trim());
  return `
    <div class="card" style="margin-top:16px;">
      <div class="section-title">Detalle de la audiencia</div>
      <h3 style="margin-bottom:4px;">${escapeHtml(parts[parts.length - 1])}</h3>
      <p style="color:var(--muted);font-size:12px;margin-bottom:10px;">${escapeHtml(parts.slice(0, -1).join(" › ") || a.client)} · ${CATALOG_TYPE_LABEL[a.type]} · dataset(s): ${a.datasets.join(", ")}</p>
      ${a.description ? `<p style="font-size:13px;margin-bottom:14px;">${escapeHtml(a.description)}</p>` : `<p style="font-size:12.5px;color:var(--muted);margin-bottom:14px;">Esta audiencia no tiene descripción registrada en GWI — el nombre es la única referencia disponible.</p>`}
      <p style="font-size:10.5px;color:var(--muted);margin-bottom:14px;">audience_id: <code>${a.id}</code></p>

      ${linked ? `
        <button class="btn primary" data-action="open-linked-catalog" data-id="${a.id}">Ver mapa de demanda y perfil →</button>
      ` : `
        <div class="pill" style="margin-bottom:12px;">Pendiente de análisis</div>
        <p style="font-size:12.5px;color:var(--muted);margin-bottom:14px;max-width:640px;">
          Esta audiencia real de GWI todavía no tiene un perfil completo construido en el
          aplicativo (demografía, motivadores, journey, etc.). Cuando la rutina diaria de GWI
          quede conectada, las nuevas audiencias se analizan automáticamente. Mientras tanto,
          copia esta solicitud y pégasela a Claude para que la analice y la integre.
        </p>
        <button class="btn" data-action="copy-catalog-request" data-id="${a.id}">📋 Copiar solicitud de análisis</button>
      `}
    </div>
  `;
}

// ------------------------------------------------------------------------
// Acciones / eventos
// ------------------------------------------------------------------------
function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((el) =>
    el.addEventListener("click", () => {
      state.view = el.dataset.nav;
      state.openHistoryId = null;
      render();
    })
  );

  document.querySelectorAll("[data-market]").forEach((el) =>
    el.addEventListener("click", () => {
      state.wizard.marketId = el.dataset.market;
      render();
    })
  );
  document.querySelectorAll("[data-category]").forEach((el) =>
    el.addEventListener("click", () => {
      state.wizard.categoryId = el.dataset.category;
      state.wizard.caseId = null;
      state.wizard.selectedTraitIds = [];
      state.wizard.genreIds = [];
      state.result = null;
      state.approved = new Set();
      render();
    })
  );
  document.querySelectorAll("[data-case]").forEach((el) =>
    el.addEventListener("click", () => {
      state.wizard.caseId = el.dataset.case;
      state.wizard.selectedTraitIds = [];
      state.result = null;
      state.approved = new Set();
      render();
    })
  );
  document.querySelectorAll("[data-trait]").forEach((el) =>
    el.addEventListener("click", () => {
      const id = el.dataset.trait;
      const idx = state.wizard.selectedTraitIds.indexOf(id);
      if (idx >= 0) state.wizard.selectedTraitIds.splice(idx, 1);
      else state.wizard.selectedTraitIds.push(id);
      render();
    })
  );
  document.querySelectorAll("[data-age]").forEach((el) =>
    el.addEventListener("click", () => {
      const a = el.dataset.age;
      const idx = state.wizard.ageBands.indexOf(a);
      if (idx >= 0) state.wizard.ageBands.splice(idx, 1);
      else state.wizard.ageBands.push(a);
      render();
    })
  );
  document.querySelectorAll("[data-genre]").forEach((el) =>
    el.addEventListener("click", () => {
      const g = el.dataset.genre;
      const idx = state.wizard.genreIds.indexOf(g);
      if (idx >= 0) state.wizard.genreIds.splice(idx, 1);
      else state.wizard.genreIds.push(g);
      render();
    })
  );
  document.querySelectorAll("[data-gender]").forEach((el) =>
    el.addEventListener("click", () => {
      state.wizard.genderFilter = el.dataset.gender;
      render();
    })
  );
  document.querySelectorAll("[data-nse]").forEach((el) =>
    el.addEventListener("click", () => {
      const n = el.dataset.nse;
      const idx = state.wizard.nseLevels.indexOf(n);
      if (idx >= 0) state.wizard.nseLevels.splice(idx, 1);
      else state.wizard.nseLevels.push(n);
      render();
    })
  );
  document.querySelectorAll("[data-persona-toggle]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.dataset.personaToggle;
      if (state.approved.has(id)) state.approved.delete(id);
      else state.approved.add(id);
      render();
    })
  );
  document.querySelectorAll("[data-idea-toggle]").forEach((el) =>
    el.addEventListener("click", () => {
      const [personaId, idx] = el.dataset.ideaToggle.split(":");
      const i = Number(idx);
      state.openIdeas[personaId] = state.openIdeas[personaId] === i ? -1 : i;
      render();
    })
  );

  const nextBtn = document.querySelector("[data-action='wizard-next']");
  if (nextBtn) nextBtn.addEventListener("click", () => {
    state.wizard.step = Math.min(3, state.wizard.step + 1);
    if (state.wizard.step === 3) state.result = null;
    render();
  });
  const backBtn = document.querySelector("[data-action='wizard-back']");
  if (backBtn) backBtn.addEventListener("click", () => {
    state.wizard.step = Math.max(1, state.wizard.step - 1);
    render();
  });
  const approveBtn = document.querySelector("[data-action='approve-personas']");
  if (approveBtn) approveBtn.addEventListener("click", () => {
    state.view = "profiles";
    render();
  });
  const backToWizard = document.querySelector("[data-action='back-to-wizard']");
  if (backToWizard) backToWizard.addEventListener("click", () => {
    state.view = "wizard";
    state.wizard.step = 3;
    render();
  });

  const saveHistBtn = document.querySelector("[data-action='save-history']");
  if (saveHistBtn) saveHistBtn.addEventListener("click", saveCurrentToHistory);

  const exportBtn = document.querySelector("[data-action='export-pptx']");
  if (exportBtn) exportBtn.addEventListener("click", () => {
    const r = state.result;
    const approvedPersonas = r.personas.filter((p) => state.approved.has(p.id));
    buildAudiencesPptx({ market: r.market, case: r.case, steps: r.steps, universe: r.universe, personas: approvedPersonas });
  });

  const exportJsonBtn = document.querySelector("[data-action='export-json']");
  if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportHistoryJSON);
  const importInput = document.getElementById("import-file");
  if (importInput) importInput.addEventListener("change", importHistoryJSON);

  document.querySelectorAll("[data-compare]").forEach((el) =>
    el.addEventListener("change", () => {
      const id = el.dataset.compare;
      const idx = state.compareIds.indexOf(id);
      if (el.checked && idx < 0) {
        if (state.compareIds.length >= 2) state.compareIds.shift();
        state.compareIds.push(id);
      } else if (!el.checked && idx >= 0) {
        state.compareIds.splice(idx, 1);
      }
      render();
    })
  );
  document.querySelectorAll("[data-action='open-history']").forEach((el) =>
    el.addEventListener("click", () => {
      state.openHistoryId = state.openHistoryId === el.dataset.id ? null : el.dataset.id;
      render();
    })
  );
  document.querySelectorAll("[data-action='delete-history']").forEach((el) =>
    el.addEventListener("click", () => {
      state.history = state.history.filter((h) => h.id !== el.dataset.id);
      persistHistory();
      render();
    })
  );
  const goCompareBtn = document.querySelector("[data-action='go-compare']");
  if (goCompareBtn) goCompareBtn.addEventListener("click", () => {
    state.view = "compare";
    render();
  });
  const navHistoryBtn = document.querySelector("[data-action='nav-history']");
  if (navHistoryBtn) navHistoryBtn.addEventListener("click", () => {
    state.view = "history";
    render();
  });

  const catalogSearch = document.getElementById("catalog-search");
  if (catalogSearch) {
    catalogSearch.addEventListener("input", (e) => {
      state.catalogQuery = e.target.value;
      render();
      const el = document.getElementById("catalog-search");
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    });
  }
  document.querySelectorAll("[data-catalog-type]").forEach((el) =>
    el.addEventListener("click", () => {
      state.catalogTypeFilter = el.dataset.catalogType;
      render();
    })
  );
  document.querySelectorAll("[data-catalog-select]").forEach((el) =>
    el.addEventListener("click", () => {
      state.catalogSelectedId = el.dataset.catalogSelect;
      render();
    })
  );
  document.querySelectorAll("[data-action='open-linked-catalog']").forEach((el) =>
    el.addEventListener("click", () => {
      const link = CATALOG_ANALYSIS_LINKS[el.dataset.id];
      if (!link) return;
      state.wizard.categoryId = link.categoryId;
      state.wizard.caseId = link.caseId;
      state.wizard.marketId = link.marketId || state.wizard.marketId;
      state.wizard.genreIds = [];
      state.result = computeResult(state.wizard.marketId, link.categoryId, link.caseId, []);
      state.approved = link.personaId
        ? new Set([link.personaId])
        : new Set(state.result.personas.map((p) => p.id));
      state.view = "profiles";
      render();
    })
  );
  document.querySelectorAll("[data-action='copy-catalog-request']").forEach((el) =>
    el.addEventListener("click", () => {
      const a = GWI_AUDIENCE_CATALOG.find((x) => x.id === el.dataset.id);
      if (!a) return;
      const text = `Analiza esta audiencia real de GWI y agrégala a Audiences Rebold como un caso con persona(s) completas (demografía, motivaciones, barreras, intereses digitales, medios y customer journey de 6 bloques), siguiendo el mismo esquema que ya usa js/data.js:\n\naudience_id: ${a.id}\nNombre: ${a.title}\nTipo: ${CATALOG_TYPE_LABEL[a.type]}\nDataset(s): ${a.datasets.join(", ")}\n${a.description ? "Descripción GWI: " + a.description : ""}\n\nUsa chat_gwi con docked_audiences: ["${a.id}"] (una pregunta por llamada) y explore_insight_gwi para las cifras. Al terminar, registra el enlace en js/gwiCatalog.js (CATALOG_ANALYSIS_LINKS) para que seleccionar esta audiencia en el catálogo abra el análisis directo.`;
      navigator.clipboard.writeText(text).then(
        () => showToast("Solicitud copiada — pégala en una conversación con Claude"),
        () => showToast("No se pudo copiar automáticamente; copia el texto manualmente")
      );
    })
  );
}

function saveCurrentToHistory() {
  const r = state.result;
  const approvedPersonas = r.personas.filter((p) => state.approved.has(p.id));
  const entry = {
    id: uid(),
    createdAt: Date.now(),
    marketId: r.market.id,
    marketName: r.market.name,
    categoryId: r.category.id,
    categoryName: r.category.name,
    caseId: r.case.id,
    caseName: r.case.name,
    source: r.case.source,
    finalTotal: r.finalTotal,
    steps: r.steps,
    personas: approvedPersonas,
  };
  state.history.push(entry);
  persistHistory();
  showToast("Audiencia guardada en el histórico ✅");
}

function exportHistoryJSON() {
  const blob = new Blob([JSON.stringify(state.history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audiences-rebold-historico-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importHistoryJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("Formato inválido");
      const ids = new Set(state.history.map((h) => h.id));
      imported.forEach((h) => {
        if (!ids.has(h.id)) state.history.push(h);
      });
      persistHistory();
      showToast(`Se importaron ${imported.length} audiencias`);
      render();
    } catch (err) {
      showToast("No se pudo importar el archivo: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ------------------------------------------------------------------------
// Init
// ------------------------------------------------------------------------
render();
