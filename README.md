# 🌍 Nominatim Explorer

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()
[![OSM](https://img.shields.io/badge/Data-OpenStreetMap-orange?style=for-the-badge)](https://www.openstreetmap.org/)

**Nominatim Explorer** es un frontend interactivo de alto rendimiento diseñado para explorar la API pública de [Nominatim](https://nominatim.org) (OpenStreetMap) directamente desde tu navegador. Olvídate de configurar backends complejos; esta herramienta procesa geocodificación, detalles de objetos y búsqueda inversa con una interfaz **premium, rápida y responsive**.

![Nominatim Explorer Mockup](./nominatim_explorer_mockup_1778642600527.png)

---

## ✨ Características Principales

- 🔍 **Búsqueda Avanzada**: Localiza cualquier lugar del mundo por nombre, dirección o categoría.
- 🆔 **Detalles OSM**: Obtén la jerarquía completa, nombres en múltiples idiomas y metadatos de cualquier Nodo, Vía o Relación.
- 📍 **Geocodificación Inversa**: Convierte coordenadas de latitud y longitud en direcciones exactas con un solo click.
- ⚡ **Live URL Preview**: Visualiza la construcción de la URL de la API en tiempo real mientras ajustas los parámetros.
- 📄 **JSON Explorer**: Visor de respuestas crudas integrado con resaltado de sintaxis y estructura colapsable.
- 🎨 **Interfaz Premium**: Tema oscuro cinemático, efectos de glassmorphism y partículas animadas.

---

## 🛠️ Stack Tecnológico

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white" />
</p>

- **Vanilla JS**: Lógica pura sin frameworks pesados para un rendimiento instantáneo.
- **Modern CSS**: Layouts con Flexbox/Grid, animaciones fluidas y variables nativas.
- **Inter & JetBrains Mono**: Tipografía optimizada para lectura de datos.

---

## 🚀 Inicio Rápido

### Requisitos
- [Node.js](https://nodejs.org/) instalado (recomendado) o un servidor HTTP local (Python, etc).

### Instalación y Ejecución
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Hesiquio/FrontNominatim.git
   cd FrontNominatim
   ```

2. **Instala las dependencias de desarrollo:**
   ```bash
   npm install
   ```

3. **Inicia el servidor:**
   ```bash
   npm start
   ```

4. **Accede a la aplicación:**
   Abre [http://localhost:3000](http://localhost:3000) (o el puerto indicado por `serve`) en tu navegador.

> [!NOTE]
> También puedes simplemente abrir el archivo `index.html` con la extensión **Live Server** de VS Code o usar `python -m http.server 7830`.

---

## 📡 Endpoints Implementados

| Módulo | Endpoint | Descripción |
| :--- | :--- | :--- |
| **Search** | `/search.php` | Búsqueda global por texto libre o parámetros específicos (ciudad, país). |
| **Details** | `/details` | Recuperación de metadatos profundos mediante `osm_id` y `osm_type`. |
| **Reverse** | `/reverse` | Identificación de direcciones basadas en coordenadas GPS exactas. |

---

## 📋 Políticas de Uso de la API

Este proyecto utiliza la API gratuita de Nominatim. Al usarlo, asegúrate de cumplir con sus políticas:
- **Límite de velocidad**: Máximo 1 solicitud por segundo.
- **User-Agent**: El script incluye un identificador genérico; para uso intensivo, personaliza los headers en `app.js`.
- **Atribución**: Los datos son © [Colaboradores de OpenStreetMap](https://www.openstreetmap.org/copyright).

---

## 📁 Estructura del Proyecto

```text
FrontNominatim/
├── index.html   # Esqueleto semántico y estructura de tabs
├── style.css    # Motor de diseño, animaciones y sistema de tokens
├── app.js       # Orquestador de peticiones, lógica de UI y renderizado
└── package.json # Configuración de scripts y dependencias
```

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

Desarrollado con ❤️ por [Hesiquio](https://github.com/Hesiquio).
