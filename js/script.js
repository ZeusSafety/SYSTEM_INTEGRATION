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

// PARA EL LOGIN

// USUARIOS 
const users = {
    "joseph_log": {
        password: "jplog01",
        roles: ["importacion", "logistica"]
    }
};

// PARA ALMACENAR LOS USUARIOS LOGEADOS
function loginUser(username, password) {
    const user = users[username];
    if (user && user.password === password) {
        localStorage.setItem("loggedUser", username);
        return true;
    }
    return false;
}

// CERRAR SESION
function logoutUser() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

// VERIFICA EL LOGIN Y MUESTRA LAS VISTAS
function loadMenu() {
    const username = localStorage.getItem("loggedUser");
    if (!username) {
        window.location.href = "index.html";
        return;
    }

    const user = users[username];
    const allowedRoles = user.roles;

    // Selecciona todas las cards
    document.querySelectorAll(".card").forEach(card => {
        const role = card.getAttribute("data-role"); 
        if (!allowedRoles.includes(role)) {
            card.style.display = "none"; 
        }
    });

    document.getElementById("username-display").textContent = username;
}





