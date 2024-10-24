import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import {
    getFirestore,
    collection,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0xGyc8OLyym1gFCgXQDr65px0Vd3z2Y4",
    authDomain: "nube2024-2b2d7.firebaseapp.com",
    projectId: "nube2024-2b2d7",
    storageBucket: "nube2024-2b2d7.appspot.com",
    messagingSenderId: "536550035398",
    appId: "1:536550035398:web:fe550a168a2f3285706cc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para obtener productos
const obtenerProductos = async (coleccion) => {
    try {
        const snapshot = await getDocs(collection(db, coleccion));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};

// Función para mostrar productos en la tabla
async function mostrarProductos() {
    const productTable = document.getElementById("product-table");
    productTable.innerHTML = ""; // Limpiar tabla
    const tipos = ["10", "20", "30"]; // Tipos de productos
    for (const tipo of tipos) {
        const productos = await obtenerProductos(`productos_${tipo}`);
        productos.forEach((producto) => {
            const row = `
                <tr>
                    <td>${producto.codigo}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td><img src="${producto.urlimagen}" alt="${producto.nombre}"></td>
                    <td>
                        <button class="btn btn-warning" onclick="abrirModalEditar('${producto.codigo}', 'productos_${tipo}')">Editar</button>
                        <button class="btn btn-danger" onclick="abrirModalEliminar('${producto.codigo}', 'productos_${tipo}')">Eliminar</button>
                    </td>
                </tr>
            `;
            productTable.innerHTML += row;
        });
    }
}

// Abrir modal de edición con los datos del producto
window.abrirModalEditar = async (codigo, tipo) => {
    const productRef = doc(db, tipo, codigo);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
        const producto = productSnap.data();
        document.getElementById("editname").value = producto.nombre;
        document.getElementById("editprecio").value = producto.precio;
        document.getElementById("editdesc").value = producto.descripcion;
        document.getElementById("editcodigo").value = producto.codigo;
        $('#editModal').modal('show'); // Mostrar modal
    }
};

// Guardar los cambios del producto editado
document.getElementById("saveEdit").addEventListener("click", async () => {
    const nombre = document.getElementById("editname").value;
    const precio = document.getElementById("editprecio").value;
    const descripcion = document.getElementById("editdesc").value;
    const codigo = document.getElementById("editcodigo").value;
    const imagenFile = document.getElementById("editfileimg").files[0];

    let urlimagen = null;
    if (imagenFile) {
        urlimagen = await archivoimg(imagenFile, codigo); // Subir nueva imagen
    }

    const updatedProduct = { nombre, precio, descripcion, ...(urlimagen && { urlimagen }) };
    await setDoc(doc(db, `productos_${codigo.substring(0, 2)}`, codigo), { ...updatedProduct, codigo }); // Actualizar producto
    $('#editModal').modal('hide'); // Cerrar modal
    mostrarProductos(); // Refrescar tabla
});

// Abrir modal de eliminación
window.abrirModalEliminar = (codigo, tipo) => {
    document.getElementById("deletecodigo").value = codigo;
    $('#deleteModal').modal('show'); // Mostrar modal
};

// Confirmar eliminación del producto
document.getElementById("confirmDelete").addEventListener("click", async () => {
    const codigo = document.getElementById("deletecodigo").value;
    const tipo = `productos_${codigo.substring(0, 2)}`;
    await deleteDoc(doc(db, tipo, codigo));
    $('#deleteModal').modal('hide'); // Cerrar modal
    mostrarProductos(); // Refrescar tabla
});

// Función para subir imágenes
const archivoimg = async (file, referencia) => {
    const storageref = ref(storage, `images/${referencia + file.name}`);
    await uploadBytes(storageref, file);
    const url = await getDownloadURL(storageref);
    return url;
};

// Inicializar productos al cargar la página
window.addEventListener("DOMContentLoaded", mostrarProductos);
