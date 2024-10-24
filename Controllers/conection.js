import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

import {
    getFirestore,
    collection,
    setDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Método de autenticación de usuario
export const ctrlaccessuser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

// Observador para el estado de usuario
export function userstate() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log("Usuario: " + uid);
        } else {
            window.location.href = "../index.html";
        }
    });
}

// Cerrar sesión
export const logout = () => signOut(auth);

// Registrar nuevo usuario
export const registerauth = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

// Verificar usuario
export const verification = () =>
    sendEmailVerification(auth.currentUser);

// Restablecer contraseña
export const verificationcod = (email) =>
    sendPasswordResetEmail(auth, email);

// Obtener el usuario actualmente autenticado
export function getCurrentUser() {
    const user = auth.currentUser;
    return user ? { email: user.email } : null;
}

// Guardar usuarios en Firebase en colecciones separadas de "usuarios" y "administradores"
export const AddUserOrAdmin = async (email, data, coleccion) => {
    try {
        await setDoc(doc(db, coleccion, email), data);
        console.log(`${coleccion} guardado con éxito en Firebase.`);
    } catch (error) {
        console.error(`Error guardando en ${coleccion}: `, error);
    }
};

// Función para agregar productos en una categoría específica (colección según tipo)
export const AddProduct = async (collection, productData) => {
    try {
        await setDoc(doc(db, collection, productData.codigo), productData);
        console.log("Producto registrado en la colección:", collection);
    } catch (error) {
        console.error("Error al registrar el producto:", error);
    }
};

// Leer un registro específico por código y colección
export const GetProduct = (codigo, collection) => {
    return getDoc(doc(db, collection, codigo));
};

// Eliminar un producto específico por código y colección
export const DeleteProduct = async (codigo, collection) => {
    try {
        await deleteDoc(doc(db, collection, codigo));
        console.log(`Producto ${codigo} eliminado de la colección ${collection}`);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
};

// Actualizar un producto específico por código y colección
export const UpdateProduct = async (codigo, collection, updatedData) => {
    try {
        await setDoc(doc(db, collection, codigo), updatedData, { merge: true });
        console.log(`Producto ${codigo} actualizado en la colección ${collection}`);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
    }
};

// Función de almacenamiento de imágenes en Firebase Storage
export const archivoimg = async (file, referencia) => {
    const storageref = ref(storage, `Productos/${referencia + file.name}`);
    await uploadBytes(storageref, file);
    const url = await getDownloadURL(storageref);
    return url;
};

// Obtener todos los productos desde una colección
export const obtenerProductos = async (collection) => {
    try {
        const snapshot = await getDocs(collection(db, collection));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};
