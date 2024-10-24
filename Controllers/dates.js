// Función para verificar si la sección está en vista
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animar secciones al hacer scroll y cuando se carga la página
const sections = document.querySelectorAll("section");

function animateSections() {
    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add("in-view");
        }
    });
}

// Verificar la visibilidad de las secciones al cargar la página
window.addEventListener("DOMContentLoaded", animateSections);

// Verificar la visibilidad de las secciones al hacer scroll
window.addEventListener("scroll", animateSections);
