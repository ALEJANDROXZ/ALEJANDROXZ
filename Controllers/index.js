import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';

import {
    getAuth,
    signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

import {
    getFirestore,
    doc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB0xGyc8OLyym1gFCgXQDr65px0Vd3z2Y4",
    authDomain: "nube2024-2b2d7.firebaseapp.com",
    projectId: "nube2024-2b2d7",
    storageBucket: "nube2024-2b2d7.appspot.com",
    messagingSenderId: "536550035398",
    appId: "1:536550035398:web:fe550a168a2f3285706cc7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencia al botón de inicio de sesión
const login = document.getElementById('btnlogin');

// Función para verificar si el usuario es administrador o usuario
async function verificarRol(email) {
    try {
        // Verificar si está en la colección de administradores
        const adminRef = doc(db, 'administradores', email);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
            return 'admin';
        }

        // Verificar si está en la colección de usuarios
        const userRef = doc(db, 'usuarios', email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return 'user';
        }

        // Si no está en ninguna colección, retorna null
        return null;
    } catch (error) {
        console.error("Error al verificar el rol: ", error);
        throw error;
    }
}

// Función para iniciar sesión
async function logear() {
    const email = document.getElementById('edtuser').value;
    const password = document.getElementById('edtpsw').value;

    try {
        // Autenticación en Firebase
        const validar = await signInWithEmailAndPassword(auth, email, password);
        const user = validar.user;

        // Verificar el rol del usuario en las colecciones 'usuarios' o 'administradores'
        const role = await verificarRol(user.email);

        if (role === 'admin') {
            alert('Bienvenido Administrador: ' + email);
            console.log('Autenticación exitosa como administrador: ' + email);
            window.location.href = "/Templates/admin.html";
        } else if (role === 'user') {
            alert('Bienvenido Usuario: ' + email);
            console.log('Autenticación exitosa como usuario: ' + email);
            window.location.href = "/Templates/productos_user.html";
        } else {
            alert('No tienes acceso, el usuario no se encuentra en la base de datos.');
            console.log('Error: Usuario no encontrado en las colecciones.');
        }

    } catch (error) {
        alert('Error de autenticación: ' + error.message);
        console.log('Error de autenticación: ' + error);
    }
}

// Mostrar u ocultar la contraseña
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('edtpsw');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('change', () => {
        passwordInput.type = togglePassword.checked ? 'text' : 'password';
    });
});

// Evento para iniciar sesión
window.addEventListener('DOMContentLoaded', () => {
    login.addEventListener('click', logear);
});

/* Script para aplicar animaciones al cargar la página */
window.addEventListener('DOMContentLoaded', (event) => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        section.classList.add('in-view');
    });
});
