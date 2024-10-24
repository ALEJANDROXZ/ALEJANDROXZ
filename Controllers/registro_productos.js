import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';

import {
    getFirestore,
    collection,
    setDoc,
    getDocs,
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

// Función para agregar productos a la colección
const AddProduct = async (coleccion, data) => {
    try {
        await setDoc(doc(db, coleccion, data.codigo), data);
        alert("Producto guardado con éxito");
    } catch (error) {
        console.error("Error guardando producto: ", error);
    }
};

// Función para subir imágenes
const archivoimg = async (file, referencia) => {
    const storageref = ref(storage, `images/${referencia + file.name}`);
    await uploadBytes(storageref, file);
    const url = await getDownloadURL(storageref);
    return url;
};

// Registrar producto
document.getElementById("btnregister").addEventListener("click", async () => {
    const tipo = document.getElementById("edttipo").value;
    const codigo = document.getElementById("edtcodigo").value;
    const nombre = document.getElementById("edtname").value;
    const descripcion = document.getElementById("edtdesc").value;
    const precio = document.getElementById("edtprecio").value;
    const imagenFile = document.getElementById("fileimg").files[0];

    if (tipo && codigo && nombre && descripcion && precio && imagenFile) {
        const urlimagen = await archivoimg(imagenFile, codigo); // Subir imagen
        const productData = { codigo, nombre, descripcion, precio, urlimagen };
        await AddProduct(`productos_${tipo}`, productData); // Guardar producto
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Generar código automáticamente según el tipo de producto
document.getElementById("edttipo").addEventListener("change", () => {
    const tipo = document.getElementById("edttipo").value;
    obtenerProductos(`productos_${tipo}`).then(productos => {
        const totalProductos = productos.length + 1;
        const codigo = `${tipo}${String(totalProductos).padStart(3, "0")}`;
        document.getElementById("edtcodigo").value = codigo;
    });
});

// Obtener productos para generar código
const obtenerProductos = async (coleccion) => {
    try {
        const snapshot = await getDocs(collection(db, coleccion));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};
