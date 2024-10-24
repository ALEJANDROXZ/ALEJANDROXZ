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

// Animar secciones al hacer scroll
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function() {
    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add("in-view");
        }
    });
});
