// Event listeners para los botones
document.getElementById('registro').addEventListener('click', function() {
    window.location.href = '/Templates/registro_productos.html'; // Redirige a la página de registro de productos
});

document.getElementById('tabla').addEventListener('click', function() {
    window.location.href = '/Templates/tabla_productos.html'; // Redirige a la tabla de productos
});

document.getElementById('tabla2').addEventListener('click', function() {
    window.location.href = '/Templates/compras.html'; // Redirige a la tabla de productos
});

document.getElementById('salir').addEventListener('click', function() {
    // Aquí podrías implementar el logout en caso de tener autenticación.
    alert("Cerrando sesión...");
    window.location.href = '/index.html'; // Redirige a la página principal (index)
});
