import { registerauth, verification, AddUserOrAdmin } from "../Controllers/conection.js";

const crear = document.getElementById('btncrear');
const atras = document.getElementById('btnatras');
const tipoCuenta = document.getElementById('tipoCuenta');
const adminPassContainer = document.getElementById('adminPassContainer');
const adminPassword = document.getElementById('adminPassword');

// Mostrar u ocultar el campo de contraseña de administrador
tipoCuenta.addEventListener('change', () => {
    if (tipoCuenta.value === 'admin') {
        adminPassContainer.style.display = 'block';
        adminPassword.value = ''; // Siempre visible
    } else {
        adminPassContainer.style.display = 'none';
        adminPassword.value = '';
    }
});

// Función para validar la contraseña
function validarContraseña(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pw);
}

// Función para registrar un nuevo usuario
async function register() {
    const email = document.getElementById('edtuser').value;
    const confirmEmail = document.getElementById('edtconfiuser').value;
    const psw = document.getElementById('edtpsw').value;
    const confirmPsw = document.getElementById('edtconfipsw').value;

    // Validaciones
    if (email !== confirmEmail) {
        alert('Los correos electrónicos no coinciden.');
        return;
    }
    if (psw !== confirmPsw) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    if (!validarContraseña(psw)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        return;
    }

    // Si la cuenta es de administrador, validar la contraseña de administrador
    if (tipoCuenta.value === 'admin') {
        if (adminPassword.value !== 'TULIPAN_RAMA') {
            alert('Contraseña de administrador incorrecta.');
            return;
        }
    }

    try {
        const userCredential = await registerauth(email, psw);
        const user = userCredential.user;

        const userType = tipoCuenta.value === 'admin' ? 'administradores' : 'usuarios';

        // Guardar el usuario en la colección correspondiente
        await AddUserOrAdmin(email, { email, tipo: tipoCuenta.value }, userType);

        // Enviar correo de verificación
        await verification();
        alert('El usuario se registró exitosamente. Verifique su correo para continuar.');
        window.location.href = "/index.html";
    } catch (error) {
        alert('Error en el registro: ' + error.message);
        console.log('Error en el registro:', error);
    }
}

// Mostrar u ocultar la contraseña
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('edtpsw');
    const confirmPasswordInput = document.getElementById('edtconfipsw');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('change', () => {
        const type = togglePassword.checked ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
    });
});

// Función para regresar al inicio
async function atrasSesion() {
    window.location.href = "/index.html";
}

// Evento para registrar y regresar
window.addEventListener('DOMContentLoaded', () => {
    crear.addEventListener('click', register);
    atras.addEventListener('click', atrasSesion);
});
