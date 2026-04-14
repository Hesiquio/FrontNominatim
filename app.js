/* =====================================================
   NOMINATIM EXPLORER — app.js
   ===================================================== */

const BASE_URL = 'https://nominatim.openstreetmap.org';

// ─── URL Previews ───────────────────────────────────────────────────────────

function buildSearchURL() {
  const city  = document.getElementById('search-city').value.trim() || 'Bern';
  const limit = document.getElementById('search-limit').value || '5';
  return `${BASE_URL}/search.php?city=${encodeURIComponent(city)}&limit=${limit}&format=jsonv2&addressdetails=1`;
}

function buildDetailsURL() {
  const osmtype = document.getElementById('details-osmtype').value;
  const osmid   = document.getElementById('details-osmid').value.trim() || '175905';
  return `${BASE_URL}/details?osmtype=${osmtype}&osmid=${osmid}&addressdetails=1&hierarchy=1&group_hierarchy=1&format=json`;
}

function buildReverseURL() {
  const lat  = document.getElementById('rev-lat').value.trim() || '40.7127281';
  const lon  = document.getElementById('rev-lon').value.trim() || '-74.0060152';
  const zoom = document.getElementById('rev-zoom').value;
  return `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&zoom=${zoom}&format=json&addressdetails=1`;
}

function updatePreviews() {
  const s = document.getElementById('url-preview-search');
  const d = document.getElementById('url-preview-details');
  const r = document.getElementById('url-preview-reverse');
  if (s) s.textContent = buildSearchURL();
  if (d) d.textContent = buildDetailsURL();
  if (r) r.textContent = buildReverseURL();
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  const tab   = document.getElementById('tab-' + name);
  const panel = document.getElementById('panel-' + name);
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  panel.classList.add('active');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setLoading(btnId, areaId, label) {
  const btn  = document.getElementById(btnId);
  const area = document.getElementById(areaId);
  btn.disabled = true;
  btn.classList.add('loading');
  area.innerHTML = `
    <div class="loader">
      <div class="loader-spinner"></div>
      <p>${label}</p>
    </div>`;
}

function clearLoading(btnId) {
  const btn = document.getElementById(btnId);
  btn.disabled = false;
  btn.classList.remove('loading');
}

function showError(areaId, message) {
  document.getElementById(areaId).innerHTML = `
    <div class="error-box">
      <div class="error-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
        </svg>
      </div>
      <div>
        <h4>Error de solicitud</h4>
        <p>${message}</p>
      </div>
    </div>`;
}

function syntaxHighlightJSON(json) {
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
    if (/^"/.test(match)) {
      if (/:$/.test(match)) return `<span class="json-key">${match}</span>`;
      return `<span class="json-str">${match}</span>`;
    }
    if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
    if (/null/.test(match))       return `<span class="json-null">${match}</span>`;
    return `<span class="json-num">${match}</span>`;
  });
}

function jsonSection(data) {
  const id = 'json-' + Math.random().toString(36).slice(2);
  return `
    <div class="json-section">
      <button class="json-toggle" id="${id}-btn" onclick="toggleJSON('${id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        Ver respuesta JSON completa
      </button>
      <div class="json-content" id="${id}">
        <pre>${syntaxHighlightJSON(data)}</pre>
      </div>
    </div>`;
}

function toggleJSON(id) {
  const content = document.getElementById(id);
  const btn = document.getElementById(id + '-btn');
  content.classList.toggle('open');
  btn.classList.toggle('open');
  btn.childNodes[2].textContent = content.classList.contains('open')
    ? ' Ocultar JSON' : ' Ver respuesta JSON completa';
}

function osmLink(type, id) {
  const typeMap = { N: 'node', W: 'way', R: 'relation' };
  const t = typeMap[type] || type;
  return `https://www.openstreetmap.org/${t}/${id}`;
}

function mapLink(lat, lon) {
  return `https://www.openstreetmap.org/#map=14/${lat}/${lon}`;
}

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

async function fetchNominatim(url, lang) {
  const headers = { 'Accept-Language': lang || 'es' };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Search ───────────────────────────────────────────────────────────────────

async function runSearch() {
  const url  = buildSearchURL();
  const lang = document.getElementById('search-lang').value.trim() || 'es';
  setLoading('btn-search', 'results-search', 'Buscando lugares…');
  try {
    const data = await fetchNominatim(url, lang);
    clearLoading('btn-search');
    renderSearchResults(data);
  } catch (e) {
    clearLoading('btn-search');
    showError('results-search', e.message);
  }
}

function renderSearchResults(data) {
  const area = document.getElementById('results-search');
  if (!data || data.length === 0) {
    area.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6M11 8v6"/>
        </svg>
        <h4>Sin resultados</h4>
        <p>No se encontraron lugares para tu búsqueda.</p>
      </div>`;
    return;
  }

  const cards = data.map((item, idx) => {
    const delay = idx * 0.05;
    const addr  = item.address || {};
    const addrParts = [addr.road, addr.suburb, addr.city || addr.town || addr.village, addr.state, addr.country]
      .filter(Boolean).join(', ');

    return `
      <div class="result-card" style="animation-delay:${delay}s">
        <div class="result-card-header">
          <div class="result-rank">${idx + 1}</div>
          <div class="result-name" title="${item.display_name}">${item.name || item.display_name}</div>
          <div class="result-type-badge">${item.type || item.class}</div>
        </div>
        <div class="result-card-body">
          <div class="result-grid">
            <div class="result-field">
              <div class="result-field-label">Display Name</div>
              <div class="result-field-value display-name">${item.display_name}</div>
            </div>
            <div class="result-field">
              <div class="result-field-label">Coordenadas</div>
              <div class="result-field-value coords-value">📍 ${parseFloat(item.lat).toFixed(6)}, ${parseFloat(item.lon).toFixed(6)}</div>
            </div>
            <div class="result-field">
              <div class="result-field-label">OSM Type / ID</div>
              <div class="result-field-value">${item.osm_type} / ${item.osm_id}</div>
            </div>
            <div class="result-field">
              <div class="result-field-label">Clase</div>
              <div class="result-field-value">${item.class} › ${item.type}</div>
            </div>
            ${item.importance != null ? `
            <div class="result-field">
              <div class="result-field-label">Importancia</div>
              <div class="result-field-value">${(item.importance * 100).toFixed(2)}%</div>
            </div>` : ''}
            ${item.place_rank != null ? `
            <div class="result-field">
              <div class="result-field-label">Place Rank</div>
              <div class="result-field-value">${item.place_rank}</div>
            </div>` : ''}
          </div>
          <a class="map-link" href="${mapLink(item.lat, item.lon)}" target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            </svg>
            Ver en OpenStreetMap
          </a>
          ${jsonSection(item)}
        </div>
      </div>`;
  });

  area.innerHTML = `
    <div class="results-header">
      <div class="results-count">Se encontraron <strong>${data.length}</strong> resultado${data.length !== 1 ? 's' : ''}</div>
    </div>
    ${cards.join('')}`;
}

// ─── Details ─────────────────────────────────────────────────────────────────

async function runDetails() {
  const url  = buildDetailsURL();
  const lang = document.getElementById('details-lang').value.trim() || 'es';
  setLoading('btn-details', 'results-details', 'Cargando detalles OSM…');
  try {
    const data = await fetchNominatim(url, lang);
    clearLoading('btn-details');
    renderDetails(data);
  } catch (e) {
    clearLoading('btn-details');
    showError('results-details', e.message);
  }
}

function renderDetails(d) {
  const area  = document.getElementById('results-details');
  const names = d.names || {};
  const geo   = d.geometry || {};
  const addr  = d.addresstags || {};
  const place = d.localname || d.names?.name || 'Elemento OSM';
  const osmLink_ = osmLink(d.osm_type, d.osm_id);

  const nameEntries = Object.entries(names);
  const addrEntries = Object.entries(addr);

  const extratags = d.extratags ? Object.entries(d.extratags) : [];

  area.innerHTML = `
    <div class="details-card">
      <div class="details-hero">
        <div class="details-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="details-hero-info">
          <h2>${place}</h2>
          <p>${d.country_code ? 'País: ' + d.country_code.toUpperCase() : ''} ${d.category ? '· ' + d.category : ''} ${d.type ? '· ' + d.type : ''}</p>
          <div class="details-meta">
            <span class="meta-chip">osm_type: ${d.osm_type}</span>
            <span class="meta-chip">osm_id: ${d.osm_id}</span>
            ${d.place_id ? `<span class="meta-chip">place_id: ${d.place_id}</span>` : ''}
            ${d.rank_address != null ? `<span class="meta-chip">rank: ${d.rank_address}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Geometry / Coordinates -->
      ${d.centroid ? `
      <div class="details-section">
        <div class="details-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>
          Geometry
        </div>
        <div class="kv-grid">
          <div class="kv-item"><div class="kv-key">Centroid Lat</div>
            <div class="kv-val highlight">${d.centroid.coordinates ? d.centroid.coordinates[1].toFixed(7) : '—'}</div></div>
          <div class="kv-item"><div class="kv-key">Centroid Lon</div>
            <div class="kv-val highlight">${d.centroid.coordinates ? d.centroid.coordinates[0].toFixed(7) : '—'}</div></div>
          <div class="kv-item"><div class="kv-key">Geometry Type</div>
            <div class="kv-val">${geo.type || '—'}</div></div>
          ${d.calculated_importance != null ? `
          <div class="kv-item"><div class="kv-key">Importancia</div>
            <div class="kv-val">${(d.calculated_importance * 100).toFixed(2)}%</div></div>` : ''}
        </div>
        ${d.centroid && d.centroid.coordinates ? `
        <a class="map-link" style="margin-top:16px" href="${mapLink(d.centroid.coordinates[1], d.centroid.coordinates[0])}" target="_blank" rel="noopener">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          </svg>
          Ver en OpenStreetMap
        </a>` : ''}
        <a class="map-link" style="margin-top:8px; margin-left:8px" href="${osmLink_}" target="_blank" rel="noopener">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Objeto OSM directo
        </a>
      </div>` : ''}

      <!-- Names -->
      ${nameEntries.length > 0 ? `
      <div class="details-section">
        <div class="details-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Nombres
        </div>
        <div class="names-list">
          ${nameEntries.map(([k,v]) => `
            <div class="name-item">
              <span class="name-key">${k}</span>
              <span class="name-val">${v}</span>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Address tags -->
      ${addrEntries.length > 0 ? `
      <div class="details-section">
        <div class="details-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Address Tags
        </div>
        <div class="address-list">
          ${addrEntries.map(([k,v]) => `
            <div class="addr-item">
              <span>${k}</span>
              <span>${v}</span>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Extra tags -->
      ${extratags.length > 0 ? `
      <div class="details-section">
        <div class="details-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Extra Tags
        </div>
        <div class="kv-grid">
          ${extratags.slice(0, 20).map(([k,v]) => `
            <div class="kv-item">
              <div class="kv-key">${k}</div>
              <div class="kv-val">${v}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- JSON raw -->
      <div class="details-section">
        ${jsonSection(d)}
      </div>
    </div>`;
}

// ─── Reverse ──────────────────────────────────────────────────────────────────

async function runReverse() {
  const url  = buildReverseURL();
  const lang = document.getElementById('rev-lang').value.trim() || 'es';
  setLoading('btn-reverse', 'results-reverse', 'Geocodificando coordenadas…');
  try {
    const data = await fetchNominatim(url, lang);
    clearLoading('btn-reverse');
    renderReverse(data);
  } catch (e) {
    clearLoading('btn-reverse');
    showError('results-reverse', e.message);
  }
}

function renderReverse(d) {
  const area = document.getElementById('results-reverse');
  if (d.error) {
    showError('results-reverse', d.error);
    return;
  }
  const addr = d.address || {};
  const lat  = parseFloat(d.lat).toFixed(7);
  const lon  = parseFloat(d.lon).toFixed(7);

  const addrFields = [
    ['País',       addr.country],
    ['Código',     addr.country_code?.toUpperCase()],
    ['Estado',     addr.state || addr.region],
    ['Condado',    addr.county],
    ['Ciudad',     addr.city || addr.town || addr.municipality],
    ['Barrio',     addr.suburb || addr.borough || addr.neighbourhood],
    ['Calle',      addr.road],
    ['Número',     addr.house_number],
    ['C.P.',       addr.postcode],
    ['Municipio',  addr.municipality],
  ].filter(([,v]) => v);

  area.innerHTML = `
    <div class="reverse-card">
      <div class="reverse-hero">
        <div class="reverse-coords">
          <div class="coord-chip"><span>Lat</span>${lat}</div>
          <div class="coord-chip"><span>Lon</span>${lon}</div>
        </div>
        <div class="reverse-display-name">${d.display_name}</div>
        <div class="reverse-osm-ref">${d.osm_type} / ${d.osm_id} · place_id: ${d.place_id}</div>
      </div>

      <!-- Address breakdown -->
      <div class="reverse-section">
        <div class="reverse-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Desglose de dirección
        </div>
        <div class="address-grid">
          ${addrFields.map(([label, val]) => `
            <div class="address-field">
              <div class="address-field-label">${label}</div>
              <div class="address-field-value ${label === 'País' ? 'big' : ''}">${val}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Links -->
      <div class="reverse-section">
        <div class="reverse-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Referencias
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="map-link" href="${mapLink(lat, lon)}" target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            Ver en mapa
          </a>
          <a class="map-link" href="${osmLink(d.osm_type?.charAt(0)?.toUpperCase(), d.osm_id)}" target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Objeto OSM
          </a>
        </div>
      </div>

      <!-- JSON raw -->
      <div class="reverse-section">
        ${jsonSection(d)}
      </div>
    </div>`;
}

// ─── Background particles ─────────────────────────────────────────────────────

function initParticles() {
  const container = document.getElementById('bg-particles');
  const colors    = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${color};
      animation-duration:${Math.random() * 18 + 12}s;
      animation-delay:${Math.random() * 12}s;
      box-shadow: 0 0 ${size * 3}px ${color}88;
    `;
    container.appendChild(p);
  }
}

// ─── Live URL preview listeners ───────────────────────────────────────────────

function setupLivePreviews() {
  const searchIds  = ['search-city', 'search-limit', 'search-lang'];
  const detailsIds = ['details-osmtype', 'details-osmid', 'details-lang'];
  const reverseIds = ['rev-lat', 'rev-lon', 'rev-zoom', 'rev-lang'];

  searchIds.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('url-preview-search').textContent = buildSearchURL();
    });
  });
  detailsIds.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('url-preview-details').textContent = buildDetailsURL();
    });
    document.getElementById(id).addEventListener('change', () => {
      document.getElementById('url-preview-details').textContent = buildDetailsURL();
    });
  });
  reverseIds.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('url-preview-reverse').textContent = buildReverseURL();
    });
    document.getElementById(id).addEventListener('change', () => {
      document.getElementById('url-preview-reverse').textContent = buildReverseURL();
    });
  });
}

// ─── Enter key support ────────────────────────────────────────────────────────

function setupEnterKeys() {
  document.getElementById('panel-search').addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });
  document.getElementById('panel-details').addEventListener('keydown', e => {
    if (e.key === 'Enter') runDetails();
  });
  document.getElementById('panel-reverse').addEventListener('keydown', e => {
    if (e.key === 'Enter') runReverse();
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  updatePreviews();
  setupLivePreviews();
  setupEnterKeys();
});
