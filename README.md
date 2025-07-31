# ZEUS SAFETY - Sistema de Integración

Sistema web para gestión de importaciones, logística y administración empresarial.

## 🚀 Características

- **Diseño Moderno**: Interfaz con gradientes y efectos glassmorphism
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Navegación Intuitiva**: Menú principal con tarjetas interactivas
- **Integración Apps Script**: Conexión con Google Apps Script para funcionalidades

## 📁 Estructura del Proyecto

```
SYSTEM_INTEGRATION/
├── index.html              # Página principal
├── importacion.html        # Gestión de importaciones
├── logistica.html          # Gestión de logística
├── css/
│   ├── styles.css         # Estilos principales
│   ├── importacion.css    # Estilos de importación
│   └── logistica.css      # Estilos de logística
├── js/
│   ├── config.js          # Configuración centralizada
│   └── script.js          # Funcionalidades JavaScript
└── img/                   # Imágenes del proyecto
```

## ⚙️ Configuración de Apps Script

### 🔧 Actualizar URL de Apps Script

**IMPORTANTE**: Cuando despliegues tu Apps Script nuevamente, solo necesitas cambiar **UNA** URL:

1. **Abre el archivo**: `js/config.js`
2. **Encuentra la línea**: `APPS_SCRIPT_BASE_URL`
3. **Reemplaza la URL** con tu nueva URL de Apps Script
4. **¡Listo!** Todos los enlaces se actualizarán automáticamente

```javascript
// En js/config.js - LÍNEA 4
APPS_SCRIPT_BASE_URL: 'TU_NUEVA_URL_AQUI',
```

### 📋 Páginas Configuradas

- `importaciones` - Formulario de nueva importación
- `listado_import` - Listado de importaciones
- `nueva_incidencia` - Formulario de nueva incidencia logística
- `listado_incidencias` - Listado de incidencias logísticas

### 🔍 Verificar Configuración

Abre la consola del navegador (F12) para ver:
- ✅ Estado de la configuración
- 📡 URL base actual
- 📄 Páginas disponibles
- ⚠️ Advertencias si la URL necesita actualización

## 🎨 Características de Diseño

- **Gradientes Modernos**: Fondos con degradados púrpura-azul
- **Efectos Glassmorphism**: Transparencias y blur
- **Animaciones Suaves**: Hover effects y transiciones
- **Iconos FontAwesome**: Iconografía consistente
- **Responsive Design**: Adaptable a todos los dispositivos

## 🚀 Cómo Usar

1. **Abrir index.html** en tu navegador
2. **Navegar** por las diferentes secciones
3. **Hacer clic** en las tarjetas para acceder a las funcionalidades
4. **Usar el botón "Volver al Menú"** para regresar

## 🔄 Actualización de URLs

### Método Automático (Recomendado)
- Solo cambia la URL en `js/config.js`
- Todos los enlaces se actualizan automáticamente

### Método Manual (No recomendado)
- Cambiar cada URL individualmente en los archivos HTML
- Más propenso a errores

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móviles
- ✅ Tablets
- ✅ Desktop

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Gradientes)
- JavaScript (ES6+)
- FontAwesome Icons
- Google Apps Script

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verifica la consola del navegador
2. Asegúrate de que la URL de Apps Script sea correcta
3. Confirma que el archivo `js/config.js` esté cargado
