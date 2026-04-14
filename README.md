# 🌍 Nominatim Explorer

Frontend interactivo para explorar la API pública de [Nominatim](https://nominatim.org) de OpenStreetMap directamente desde el navegador, sin necesidad de backend.

## 📸 Vista general

Interfaz de tema oscuro con tres secciones independientes, una para cada endpoint de la API. Permite configurar parámetros, previsualizar la URL generada en tiempo real y ver los resultados formateados junto con el JSON crudo colapsable.

---

## 🚀 Tecnologías

- **HTML5** semántico
- **CSS3** puro (sin frameworks) — glassmorphism, animaciones, tema oscuro
- **JavaScript** vanilla (Fetch API, sin dependencias)
- **Google Fonts** — Inter + JetBrains Mono
- Servidor local: `python -m http.server`

---

## 📡 Endpoints implementados

### 1. `/search.php` — Búsqueda por ciudad

Busca lugares en OpenStreetMap por nombre de ciudad, dirección o lugar.

```
GET https://nominatim.openstreetmap.org/search.php?city=bern&format=jsonv2
```

**Parámetros configurables:**
| Parámetro | Descripción |
|---|---|
| `city` | Nombre de la ciudad a buscar |
| `limit` | Máximo de resultados (1–20) |
| `accept-language` | Idioma de respuesta (`es`, `en`, `de`…) |

---

### 2. `/details` — Detalles de un objeto OSM

Devuelve información completa de un elemento de OpenStreetMap por su tipo e ID.

```
GET https://nominatim.openstreetmap.org/details?osmtype=R&osmid=175905&format=json
```

**Parámetros configurables:**
| Parámetro | Descripción |
|---|---|
| `osmtype` | Tipo de objeto: `R` (Relation), `W` (Way), `N` (Node) |
| `osmid` | ID numérico del objeto OSM |
| `accept-language` | Idioma de respuesta |

---

### 3. `/reverse` — Geocodificación inversa

Convierte coordenadas GPS (latitud/longitud) en una dirección legible.

```
GET https://nominatim.openstreetmap.org/reverse?lat=40.7127281&lon=-74.0060152&zoom=10&format=json
```

**Parámetros configurables:**
| Parámetro | Descripción |
|---|---|
| `lat` | Latitud decimal |
| `lon` | Longitud decimal |
| `zoom` | Nivel de detalle (3=país … 18=edificio) |
| `accept-language` | Idioma de respuesta |

---

## ✨ Características

- **Previsualización de URL en tiempo real** — el endpoint se actualiza mientras escribes los parámetros
- **Resultados formateados** — tarjetas con los datos más relevantes de cada endpoint
- **Visor JSON colapsable** con resaltado de sintaxis (strings, números, booleanos, nulos)
- **Links directos a OpenStreetMap** para cada resultado
- **Soporte de tecla Enter** para ejecutar consultas desde el teclado
- **Diseño responsive** adaptado a móvil y escritorio
- **Partículas animadas de fondo** para una experiencia visual premium

---

## 🗂️ Estructura del proyecto

```
FrontNominatim/
├── index.html   # Estructura de la interfaz (tabs, formularios, paneles)
├── style.css    # Estilos completos (dark mode, animaciones, layout)
└── app.js       # Lógica de fetching, renderizado y UI interactiva
```

---

## ▶️ Cómo ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Hesiquio/FrontNominatim.git
   cd FrontNominatim
   ```

2. Inicia un servidor local (requiere Python):
   ```bash
   python -m http.server 7830
   ```

3. Abre tu navegador en:
   ```
   http://localhost:7830
   ```

> **Nota:** La API de Nominatim requiere un servidor HTTP (no `file://`). Usa cualquier servidor local como Live Server de VS Code, `npx serve`, etc.

---

## 📋 Notas sobre la API

- La API de Nominatim es de uso público y gratuito.
- Se debe respetar su [política de uso](https://operations.osmfoundation.org/policies/nominatim/): máximo 1 solicitud por segundo y un `User-Agent` identificativo.
- Los datos provienen de © [Colaboradores de OpenStreetMap](https://www.openstreetmap.org/copyright).

---

## 📄 Licencia

Proyecto de uso libre. Los datos del mapa son © OpenStreetMap contributors bajo licencia [ODbL](https://opendatacommons.org/licenses/odbl/).
