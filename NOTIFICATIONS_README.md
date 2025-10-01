# Sistema de Notificaciones - ZEUS SAFETY

## Descripción
Sistema completo de notificaciones integrado en el dashboard de ZEUS SAFETY que permite a los usuarios recibir, visualizar y gestionar notificaciones en tiempo real.

## Características

### ✅ Funcionalidades Implementadas
- **Carga automática**: Las notificaciones se cargan automáticamente al hacer login
- **Dropdown interactivo**: Lista vertical desplegable debajo del botón de notificaciones
- **Diferenciación visual**: Notificaciones no leídas (marco rojo) vs leídas (marco verde)
- **Botón de recarga**: Actualizar notificaciones manualmente
- **Redirección**: Enlaces directos a acciones específicas con íconos
- **Marcado como leído**: Marcar notificaciones individuales como leídas
- **Badge dinámico**: Contador de notificaciones no leídas en el header
- **Toast notifications**: Mensajes de confirmación y error
- **Diseño responsive**: Optimizado para móviles y desktop
- **Cierre automático**: Se cierra al hacer clic fuera del dropdown

### 🎨 Diseño Visual
- **Colores diferenciados**:
  - 🔴 Rojo: Notificaciones no leídas
  - 🟢 Verde: Notificaciones leídas
  - 🔵 Azul: Acciones y enlaces
- **Animaciones suaves**: Transiciones y efectos visuales
- **Iconografía clara**: FontAwesome para mejor UX
- **Dropdown elegante**: Lista vertical con flecha indicadora
- **Posicionamiento inteligente**: Se abre debajo del botón de notificaciones

## Archivos Creados/Modificados

### Nuevos Archivos
1. **`js/notifications.js`** - Lógica principal del sistema
2. **`css/notifications.css`** - Estilos del modal y notificaciones
3. **`test-notifications.html`** - Página de prueba del sistema
4. **`NOTIFICATIONS_README.md`** - Esta documentación

### Archivos Modificados
1. **`index.html`** - Integración con el login
2. **`menu.html`** - Botón de notificaciones funcional

## API Integration

### Endpoint
```
GET https://colaboradores-2946605267.us-central1.run.app
```

### Parámetros
- `metodo`: "listado_notificaciones"
- `user`: Nombre de usuario (ej: "hervinzeus")

### Estructura de Datos
```json
[
  {
    "ID": 1,
    "NOMBRE": "Hervin Jhonson",
    "TITULO": "NUEVA IMPORTACIÓN",
    "CUERPO": "Se Registró una nueva importación: ZEUS100",
    "TIPO": "NUEVA IMPORTACION",
    "URL_ACCION": "http://127.0.0.1:5501/public/marketing/importaciones.html",
    "ESTADO_LECTURA": "0"
  }
]
```

### Estados de Lectura
- `"0"`: No leída (marco rojo)
- `"1"`: Leída (marco verde)

## Uso del Sistema

### 1. Login Automático
Al hacer login en `index.html`, las notificaciones se cargan automáticamente:
```javascript
// Se ejecuta automáticamente al login exitoso
await loadNotificationsOnLogin(usuario);
```

### 2. Visualización
En `menu.html`, hacer clic en el botón de campana para abrir el dropdown:
```javascript
// Función global disponible
showNotifications();
```

### 3. Gestión de Notificaciones
- **Recargar**: Botón de sincronización en el dropdown
- **Marcar como leída**: Botón de check en cada notificación
- **Redirigir**: Botón de enlace externo para acciones
- **Cerrar**: Hacer clic fuera del dropdown o en el botón X

## Clase NotificationManager

### Métodos Principales
```javascript
// Cargar notificaciones
await notificationManager.loadNotifications(username);

// Mostrar dropdown
notificationManager.showDropdown();

// Marcar como leída
await notificationManager.markAsRead(notificationId);

// Recargar notificaciones
await notificationManager.refreshNotifications();
```

### Propiedades
- `notifications`: Array de notificaciones
- `unreadCount`: Contador de no leídas
- `apiUrl`: URL de la API
- `method`: Método de la API

## Estilos CSS

### Variables CSS Utilizadas
```css
:root {
  --primary-color: #1e3a8a;
  --accent-color: #3b82f6;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

### Clases Principales
- `.notification-dropdown`: Dropdown principal
- `.notification-container`: Contenedor del botón
- `.notification-item.unread`: Notificación no leída
- `.notification-item.read`: Notificación leída
- `.notification-badge`: Badge del contador
- `.toast`: Mensajes toast

## Responsive Design

### Breakpoints
- **Desktop**: > 768px - Layout completo
- **Tablet**: 768px - Layout adaptado
- **Mobile**: < 480px - Layout vertical

### Características Mobile
- Dropdown adaptado al ancho de pantalla
- Botones más grandes
- Texto optimizado
- Navegación táctil
- Posicionamiento ajustado

## Testing

### Archivo de Prueba
Abrir `menu.html` en el navegador para:
- Probar la carga de notificaciones
- Verificar el dropdown
- Testear toast messages
- Validar responsive design

### Datos de Prueba
El sistema usa datos reales de la API con el usuario "hervinzeus".

## Seguridad

### Medidas Implementadas
- **Escape HTML**: Prevención de XSS
- **Validación de datos**: Verificación de estructura
- **Manejo de errores**: Try-catch en todas las operaciones
- **Sanitización**: Limpieza de inputs

## Rendimiento

### Optimizaciones
- **Lazy loading**: Modal se crea solo cuando se necesita
- **Debounce**: Prevención de múltiples llamadas
- **Caching**: Almacenamiento local de notificaciones
- **Animaciones CSS**: Hardware acceleration

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dependencias
- FontAwesome 6.0.0
- CSS Grid y Flexbox
- ES6+ JavaScript
- Fetch API

## Próximas Mejoras

### Funcionalidades Futuras
- [ ] Notificaciones push en tiempo real
- [ ] Filtros por tipo de notificación
- [ ] Búsqueda en notificaciones
- [ ] Notificaciones por email
- [ ] Configuración de preferencias
- [ ] Historial de notificaciones
- [ ] Integración con WebSockets

## Soporte

Para soporte técnico o reportar bugs, contactar al equipo de desarrollo de ZEUS SAFETY.

---
**Desarrollado para ZEUS SAFETY - Sistema de Integración** ⚡
