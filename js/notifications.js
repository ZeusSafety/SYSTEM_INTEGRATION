// Sistema de Notificaciones - ZEUS SAFETY
class NotificationManager {
    constructor() {
        this.apiUrl = "https://colaboradores-2946605267.us-central1.run.app";
        this.method = "listado_notificaciones";
        this.notifications = [];
        this.unreadCount = 0;
    }

    // Cargar notificaciones desde la API
    async loadNotifications(username) {
        try {
            const response = await fetch(`${this.apiUrl}?metodo=${this.method}&user=${username}`);
            if (!response.ok) {
                throw new Error('Error al cargar notificaciones');
            }
            
            const data = await response.json();
            this.notifications = Array.isArray(data) ? data : [];
            this.updateUnreadCount();
            return this.notifications;
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
            this.notifications = [];
            return [];
        }
    }

    // Actualizar contador de no leídas
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(notif => notif.ESTADO_LECTURA === "0").length;
        this.updateBadge();
    }

    // Actualizar badge de notificaciones
    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Marcar notificación como leída
    async markAsRead(notificationId) {
        try {
            // Aquí implementarías la llamada a la API para marcar como leída
            // Por ahora, actualizamos localmente
            const notification = this.notifications.find(n => n.ID == notificationId);
            if (notification) {
                notification.ESTADO_LECTURA = "1";
                this.updateUnreadCount();
            }
        } catch (error) {
            console.error('Error marcando notificación como leída:', error);
        }
    }

    // Crear dropdown de notificaciones
    createNotificationDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h3><i class="fas fa-bell"></i> Notificaciones</h3>
                <div class="notification-actions">
                    <button class="btn-refresh" onclick="notificationManager.refreshNotifications()" title="Actualizar">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="btn-close" onclick="notificationManager.closeDropdown()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="notification-body">
                <div class="notification-list" id="notificationList">
                    <!-- Las notificaciones se cargarán aquí -->
                </div>
                <div class="notification-empty" id="notificationEmpty" style="display: none;">
                    <i class="fas fa-bell-slash"></i>
                    <p>No hay notificaciones</p>
                </div>
            </div>
        `;
        
        return dropdown;
    }

    // Mostrar dropdown de notificaciones
    async showDropdown() {
        let dropdown = document.querySelector('.notification-dropdown');
        if (!dropdown) {
            dropdown = this.createNotificationDropdown();
            // Agregar el dropdown al contenedor de notificaciones
            const notificationContainer = document.querySelector('.notification-container');
            if (notificationContainer) {
                notificationContainer.appendChild(dropdown);
            } else {
                // Si no existe el contenedor, crearlo
                const notificationBtn = document.querySelector('.header-btn[onclick="showNotifications()"]');
                if (notificationBtn) {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    notificationBtn.parentNode.insertBefore(container, notificationBtn);
                    container.appendChild(notificationBtn);
                    container.appendChild(dropdown);
                }
            }
        }
        
        dropdown.style.display = 'flex';
        await this.renderNotifications();
        
        // Cerrar dropdown al hacer clic fuera
        this.setupClickOutside(dropdown);
    }

    // Cerrar dropdown
    closeDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    // Configurar cierre al hacer clic fuera
    setupClickOutside(dropdown) {
        const handleClickOutside = (event) => {
            if (!dropdown.contains(event.target) && !event.target.closest('.notification-container')) {
                this.closeDropdown();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        
        // Usar setTimeout para evitar que se cierre inmediatamente
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
    }

    // Renderizar notificaciones en el dropdown
    async renderNotifications() {
        const list = document.getElementById('notificationList');
        const empty = document.getElementById('notificationEmpty');
        
        if (!list) return;

        if (this.notifications.length === 0) {
            list.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        list.style.display = 'block';
        empty.style.display = 'none';

        // Ordenar notificaciones: no leídas primero, luego por ID descendente
        const sortedNotifications = [...this.notifications].sort((a, b) => {
            if (a.ESTADO_LECTURA !== b.ESTADO_LECTURA) {
                return a.ESTADO_LECTURA - b.ESTADO_LECTURA;
            }
            return b.ID - a.ID;
        })
        // Limitar a máximo 15 notificaciones (la API ya lo hace, reforzamos en UI)
        .slice(0, 15);

        list.innerHTML = sortedNotifications.map(notification => `
            <div class="notification-item ${notification.ESTADO_LECTURA === "0" ? 'unread' : 'read'}" 
                 data-id="${notification.ID}">
                <div class="notification-content">
                    <div class="notification-title">
                        <h4 class="notification-title-text" title="${this.escapeHtml(notification.TITULO)}">${this.escapeHtml(notification.TITULO)}</h4>
                        <span class="notification-type" title="${this.escapeHtml(notification.TIPO)}">${this.escapeHtml(notification.TIPO)}</span>
                    </div>
                    <div class="notification-body-text">
                        <p>${this.escapeHtml(notification.CUERPO)}</p>
                    </div>
                    <div class="notification-footer">
                        <span class="notification-author">${this.escapeHtml(notification.NOMBRE)}</span>
                        <span class="notification-time">ID: ${notification.ID}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    ${notification.URL_ACCION ? `
                        <button class="btn-action" onclick="notificationManager.redirectTo('${notification.URL_ACCION}', ${notification.ID})" 
                                title="Ir a la acción">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    ` : ''}
                    ${notification.ESTADO_LECTURA === "0" ? `
                        <button class="btn-mark-read" onclick="notificationManager.markAsRead(${notification.ID})" 
                                title="Marcar como leída">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Redirigir a URL de acción
    async redirectTo(url, notificationId) {
        // Marcar como leída antes de redirigir
        await this.markAsRead(notificationId);
        
        // Abrir en nueva pestaña
        window.open(url, '_blank');
        
        // Actualizar la vista
        this.renderNotifications();
    }

    // Recargar notificaciones
    async refreshNotifications() {
        const refreshBtn = document.querySelector('.btn-refresh i');
        if (refreshBtn) {
            refreshBtn.classList.add('fa-spin');
        }

        try {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                await this.loadNotifications(currentUser);
                await this.renderNotifications();
                this.showToast('Notificaciones actualizadas', 'success');
            }
        } catch (error) {
            console.error('Error recargando notificaciones:', error);
            this.showToast('Error al actualizar notificaciones', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('fa-spin');
            }
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        // Intentar obtener del localStorage o de la sesión
        return localStorage.getItem('currentUser') || 'hervinzeus';
    }

    // Escapar HTML para seguridad
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Mostrar toast
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Instancia global del gestor de notificaciones
const notificationManager = new NotificationManager();

// Función para mostrar notificaciones (llamada desde el botón)
function showNotifications() {
    notificationManager.showDropdown();
}

// Función para cargar notificaciones al login
async function loadNotificationsOnLogin(username) {
    try {
        await notificationManager.loadNotifications(username);
        console.log('Notificaciones cargadas:', notificationManager.notifications.length);
    } catch (error) {
        console.error('Error cargando notificaciones al login:', error);
    }
}
