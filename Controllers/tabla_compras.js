import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

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

// Función para cargar las compras desde Firebase y mostrarlas en la tabla
async function cargarCompras() {
    const comprasTableBody = document.getElementById("compras-table-body");

    const snapshot = await getDocs(collection(db, 'compras'));
    snapshot.forEach((doc) => {
        const compra = doc.data();
        const row = `
            <tr id="row-${doc.id}">
                <td>${doc.id}</td>
                <td>${compra.carrito ? formatCarrito(compra.carrito) : "Sin detalles"}</td>
                <td>${compra.comprador}</td>
                <td>${compra.direccionEnvio}</td>
                <td>$${compra.total}</td>
                <td><button class="btn btn-info" onclick="verComprobante('${compra.comprobanteURL}')">Ver Comprobante</button></td>
                <td id="estado-${doc.id}">
                    <button id="aprobado-${doc.id}" class="btn btn-success" onclick="aprobarCompra('${doc.id}')">Aprobar</button>
                    <button id="no-aprobado-${doc.id}" class="btn btn-danger" onclick="desaprobarCompra('${doc.id}')">No Aprobar</button>
                </td>
            </tr>
        `;
        comprasTableBody.innerHTML += row;

        // Si ya tiene un estado de aprobación, mostrar solo el texto
        if (compra.estado === 'Aprobado') {
            document.getElementById(`estado-${doc.id}`).innerHTML = 'Aprobado';
        } else if (compra.estado === 'No Aprobado') {
            document.getElementById(`estado-${doc.id}`).innerHTML = 'No Aprobado';
        }
    });
}

// Función para formatear el carrito y mostrarlo en la tabla
function formatCarrito(carrito) {
    return carrito.map(producto => `${producto.nombre} (x${producto.cantidad})`).join(", ");
}

// Función para mostrar el comprobante de pago en un modal
window.verComprobante = (url) => {
    document.getElementById("receiptImage").src = url;
    const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
    modal.show();
};

// Función para aprobar la compra
window.aprobarCompra = async (compraId) => {
    await updateDoc(doc(db, 'compras', compraId), { estado: 'Aprobado' });
    document.getElementById(`estado-${compraId}`).innerHTML = 'Aprobado';
};

// Función para desaprobar la compra
window.desaprobarCompra = async (compraId) => {
    await updateDoc(doc(db, 'compras', compraId), { estado: 'No Aprobado' });
    document.getElementById(`estado-${compraId}`).innerHTML = 'No Aprobado';
};

// Cargar las compras al cargar la página
window.addEventListener("DOMContentLoaded", cargarCompras);
