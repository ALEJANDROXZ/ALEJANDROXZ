import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

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
const auth = getAuth(app);
const storage = getStorage(app);

let userEmail = null;
let selectedProduct = null;

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
        selectedProduct = producto;

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

// Función para añadir producto al carrito
document.getElementById("add-to-cart").addEventListener("click", async () => {
    if (!userEmail || !selectedProduct) {
        alert("Debe iniciar sesión para agregar productos al carrito.");
        return;
    }

    const cantidad = document.getElementById("product-quantity").value;
    const total = cantidad * selectedProduct.precio;

    const carrito = {
        nombre: selectedProduct.nombre,
        cantidad: cantidad,
        total: total,
    };

    // Guardar en la colección del carrito del usuario en Firebase
    await setDoc(doc(db, `carritos/${userEmail}/productos`, selectedProduct.codigo), carrito);
    alert("Producto agregado al carrito");
    $('#productModal').modal('hide'); // Cerrar modal después de agregar al carrito
    cargarCarrito(); // Actualizar el carrito
});

// Función para cargar los productos del carrito
async function cargarCarrito() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = ""; // Limpiar carrito

    let total = 0;
    const carritoSnapshot = await getDocs(collection(db, `carritos/${userEmail}/productos`));
    carritoSnapshot.forEach((doc) => {
        const producto = doc.data();
        total += producto.total;
        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${producto.nombre} - Cantidad: ${producto.cantidad} - Total: $${producto.total}</p>
            </div>
        `;
    });

    document.getElementById("cart-total").innerText = total;

    // Mostrar los productos también en el modal de pago
    document.getElementById("payment-cart-items").innerHTML = cartItems.innerHTML;
    document.getElementById("payment-cart-total").innerText = total;
}

// Función para procesar el pago y guardar los datos en Firebase
document.getElementById("payment-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const buyerName = document.getElementById("buyer-name").value;
    const shippingAddress = document.getElementById("shipping-address").value;
    const paymentReceiptFile = document.getElementById("payment-receipt").files[0];

    if (!paymentReceiptFile) {
        alert("Debe subir el comprobante de pago.");
        return;
    }

    // Subir comprobante a Firebase Storage
    const storageRef = ref(storage, `comprobantes/${userEmail}/${paymentReceiptFile.name}`);
    await uploadBytes(storageRef, paymentReceiptFile);
    const receiptURL = await getDownloadURL(storageRef);

    // Guardar en la colección 'compras' de Firebase
    const compra = {
        comprador: buyerName,
        direccionEnvio: shippingAddress,
        total: document.getElementById("cart-total").innerText,
        comprobanteURL: receiptURL,
    };

    await setDoc(doc(db, `compras/${userEmail}`), compra);
    alert("Pago procesado correctamente. Gracias por su compra.");
    $('#paymentModal').modal('hide');
});

// Verificar el estado del usuario autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmail = user.email;
        cargarCarrito(); // Cargar el carrito del usuario al iniciar sesión
    } else {
        userEmail = null;
    }
});

// Cargar productos cuando se cargue la página
window.addEventListener("DOMContentLoaded", cargarProductos);

document.getElementById('salir').addEventListener('click', function() {
    // Aquí podrías implementar el logout en caso de tener autenticación.
    alert("Cerrando sesión...");
    window.location.href = '/index.html'; // Redirige a la página principal (index)
});