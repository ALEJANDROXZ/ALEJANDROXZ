// Mostrar las secciones y aplicar la animación al cargar y hacer scroll
const sections = document.querySelectorAll("section");

function showSections() {
    sections.forEach(section => {
        section.classList.add("in-view");
    });
}

// Mostrar las secciones al cargar la página
window.addEventListener("DOMContentLoaded", showSections);

// Mostrar las secciones al hacer scroll
window.addEventListener("scroll", showSections);
