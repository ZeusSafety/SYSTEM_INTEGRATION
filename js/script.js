// Funcionalidad para las tarjetas del menú
document.addEventListener('DOMContentLoaded', function () {
    // Obtener todas las tarjetas
    const cards = document.querySelectorAll('.card');

    // Agregar evento click a cada tarjeta
    cards.forEach(card => {
        // Solo agregar evento click si la tarjeta no tiene enlace
        if (!card.querySelector('.card-link')) {
            card.addEventListener('click', function () {
                // Obtener el título de la tarjeta
                const title = this.querySelector('.card-title').textContent;

                // Simular navegación (aquí puedes agregar la lógica real de navegación)
                console.log(`Navegando a: ${title}`);

                // Efecto visual al hacer click
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }

        // Efectos hover adicionales - SOLO para tarjetas SIN enlaces
        if (!card.querySelector('.card-link')) {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        }
    });

    // Función para mostrar información de la tarjeta
    function showCardInfo(title, description) {
        console.log(`Tarjeta: ${title}`);
        console.log(`Descripción: ${description}`);
        // Aquí puedes agregar más funcionalidad como modales o tooltips
    }

    // Agregar tooltips informativos
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent;
        const subtitle = card.querySelector('.card-subtitle').textContent;

        card.setAttribute('title', `${title}: ${subtitle}`);
    });
});

// LOGIN CON API

// API
const API_BASE_URL = "https://colaboradores-2946605267.us-central1.run.app";

// FUNCION PARA CONSUMIR LA API
async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}?usuario=${encodeURIComponent(username)}&contrasena=${encodeURIComponent(password)}&metodo=login`);
        
        if (response.status === 200) {
            const data = await response.text();
            console.log("Respuesta de la API:", data);
            
            // Parsear la respuesta JSON
            let userData;
            try {
                userData = JSON.parse(data);
            } catch (e) {
                console.error("Error al parsear JSON:", e);
                return false;
            }
            
            // Guardar datos del usuario en localStorage
            localStorage.setItem("loggedUser", username);
            localStorage.setItem("userRoles", JSON.stringify(userData));
            
            return true;
        } else {
            console.error("Error en la respuesta de la API:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        return false;
    }
}

// CERRAR SESION
function logoutUser() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRoles");
    window.location.href = "index.html";
}

// VERIFICA EL LOGIN Y MUESTRA LAS VISTAS
function loadMenu() {
    const username = localStorage.getItem("loggedUser");
    if (!username) {
        window.location.href = "index.html";
        return;
    }

    const userRolesData = localStorage.getItem("userRoles");
    if (!userRolesData) {
        console.error("No se encontraron roles del usuario");
        window.location.href = "index.html";
        return;
    }

    let userRoles;
    try {
        userRoles = JSON.parse(userRolesData);
    } catch (e) {
        console.error("Error al parsear roles del usuario:", e);
        window.location.href = "index.html";
        return;
    }

    // Extraer los nombres de las secciones permitidas
    const allowedSections = userRoles.map(role => role.NOMBRE);

    console.log("Secciones permitidas:", allowedSections);

    // Mapeo de nombres de secciones a roles de las tarjetas
    const sectionToRoleMap = {
        "MARKETING": "marketing",
        "IMPORTACION": "importacion", 
        "SISTEMAS": "sistemas",
        "VENTAS": "ventas",
        "LOGISTICA": "logistica",
        "GERENCIA": "gerencia",
        "ADMINISTRACION": "administracion",
        "RECURSOS_HUMANOS": "recursos_humanos",
        "FACTURACION": "facturacion"
    };

    // Selecciona todas las cards del sidebar y del dashboard
    document.querySelectorAll(".menu-item-group[data-role], .module-card[data-role]").forEach(element => {
        const role = element.getAttribute("data-role");
        
        // Verificar si el rol de la tarjeta está en las secciones permitidas
        const isAllowed = allowedSections.some(section => 
            sectionToRoleMap[section] === role
        );
        
        if (!isAllowed) {
            element.style.display = "none";
        } else {
            element.style.display = "block";
        }
    });

    // Actualizar nombre de usuario en múltiples ubicaciones
    const usernameElements = document.querySelectorAll("#username-display, #welcome-username");
    usernameElements.forEach(element => {
        if (element) {
            element.textContent = username;
        }
    });
}

// FUNCIONES MEJORADAS PARA EL MENÚ RESPONSIVE
function toggleSubmenu(moduleName) {
    const submenu = document.getElementById(moduleName + '-submenu');
    const header = document.querySelector(`[onclick="toggleSubmenu('${moduleName}')"]`);
    
    if (!submenu || !header) return;
    
    const isOpen = submenu.classList.contains('open');
    
    // Cerrar otros submenús abiertos en móviles para evitar overflow
    if (window.innerWidth <= 768 && !isOpen) {
        document.querySelectorAll('.submenu.open').forEach(openSubmenu => {
            if (openSubmenu !== submenu) {
                openSubmenu.classList.remove('open');
                const openHeader = document.querySelector(`[onclick*="${openSubmenu.id.replace('-submenu', '')}"]`);
                if (openHeader) openHeader.classList.remove('active');
            }
        });
    }
    
    // Toggle submenu
    submenu.classList.toggle('open');
    header.classList.toggle('active');
    
    // Smooth scroll para asegurar que el contenido sea visible en móviles
    if (window.innerWidth <= 768 && submenu.classList.contains('open')) {
        setTimeout(() => {
            header.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }
}

function toggleSubSubmenu(submenuName) {
    const subSubmenu = document.getElementById(submenuName + '-submenu');
    const header = document.querySelector(`[onclick="toggleSubSubmenu('${submenuName}')"]`);
    
    if (!subSubmenu || !header) return;
    
    const isOpen = subSubmenu.classList.contains('open');
    
    // Cerrar otros sub-submenús abiertos en móviles
    if (window.innerWidth <= 768 && !isOpen) {
        document.querySelectorAll('.sub-submenu.open').forEach(openSubSubmenu => {
            if (openSubSubmenu !== subSubmenu) {
                openSubSubmenu.classList.remove('open');
                const openHeader = document.querySelector(`[onclick*="${openSubSubmenu.id.replace('-submenu', '')}"]`);
                if (openHeader) openHeader.classList.remove('active');
            }
        });
    }
    
    // Toggle sub-submenu
    subSubmenu.classList.toggle('open');
    header.classList.toggle('active');
    
    // Smooth scroll para móviles
    if (window.innerWidth <= 768 && subSubmenu.classList.contains('open')) {
        setTimeout(() => {
            header.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }
}

// Cerrar menús cuando se hace clic fuera en móviles
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggleMobile');
        
        // Si el clic no es dentro del sidebar ni en el botón de toggle
        if (sidebar && !sidebar.contains(event.target) && 
            sidebarToggle && !sidebarToggle.contains(event.target)) {
            
            // Cerrar sidebar si está abierto
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.getElementById('sidebarOverlay')?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
});

// Manejar resize de ventana
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Si cambiamos a desktop, asegurar que el sidebar esté en su estado correcto
    if (window.innerWidth >= 1024) {
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});


