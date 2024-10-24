import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB0xGyc8OLyym1gFCgXQDr65px0Vd3z2Y4",
    authDomain: "nube2024-2b2d7.firebaseapp.com",
    projectId: "nube2024-2b2d7",
    storageBucket: "nube2024-2b2d7.appspot.com",
    messagingSenderId: "536550035398",
    appId: "1:536550035398:web:fe550a168a2f3285706cc7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar productos
async function cargarProductos() {
    const productosPlantas = document.getElementById("productos-plantas");
    const productosFlores = document.getElementById("productos-flores");
    const productosJardineria = document.getElementById("productos-jardineria");

    // Cargar productos de cada categoría
    const cargarCategoria = async (coleccion, contenedor) => {
        const snapshot = await getDocs(collection(db, coleccion));
        snapshot.forEach((productoDoc) => {
            const producto = productoDoc.data();
            const productoCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${producto.urlimagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio}</p>
                            <button class="btn btn-primary" onclick="abrirModal('${producto.codigo}')">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += productoCard;
        });
    };

    await cargarCategoria('productos_10', productosPlantas);
    await cargarCategoria('productos_20', productosFlores);
    await cargarCategoria('productos_30', productosJardineria);
}

// Función para abrir el modal de detalles del producto
window.abrirModal = async (codigo) => {
    const tipo = `productos_${codigo.substring(0, 2)}`;
    const productoRef = doc(db, tipo, codigo);
    const productoSnap = await getDoc(productoRef);
    
    if (productoSnap.exists()) {
        const producto = productoSnap.data();
        document.getElementById("modal-product-name").innerText = producto.nombre;
        document.getElementById("modal-product-description").innerText = producto.descripcion;
        document.getElementById("modal-product-price").innerText = producto.precio;
        document.getElementById("modal-product-total").innerText = producto.precio;
        document.getElementById("modal-product-image").src = producto.urlimagen;
        document.getElementById("product-quantity").value = 1;
        
        // Actualizar el total de acuerdo con la cantidad seleccionada
        document.getElementById("product-quantity").addEventListener("input", () => {
            const cantidad = document.getElementById("product-quantity").value;
            const total = producto.precio * cantidad;
            document.getElementById("modal-product-total").innerText = total;
        });
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
};

// Cargar productos cuando se cargue la página
window.addEventListener("DOMContentLoaded", cargarProductos);

