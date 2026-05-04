// ===== CONSTANTES DE AUTENTICACIÓN =====
const AUTH_CONFIG = Object.freeze({
    USUARIOS: {
        'admin': '1234',
        'julieth': 'pass123',
        'usuario1': 'contraseña'
    },
    AUTH_KEY: 'usuarioAutenticado',
    HORA_LOGIN_KEY: 'horaLogin'
});

// ===== VALIDADORES DE AUTENTICACIÓN =====
class AuthValidator {
    static verificarAutenticacion() {
        const usuarioActual = localStorage.getItem(AUTH_CONFIG.AUTH_KEY);
        const esPaginaInicio = window.location.pathname.includes('Inicio.html');
        
        if (esPaginaInicio && !usuarioActual) {
            window.location.href = './Login.html';
        }
    }

    static validarCredenciales(usuario, contrasena) {
        return AUTH_CONFIG.USUARIOS[usuario] === contrasena;
    }
}

// ===== MANEJADOR DE ERRORES =====
class ErrorHandler {
    static mostrar(mensaje) {
        const container = document.getElementById('mensajeError');
        const texto = document.getElementById('textoError');
        
        if (container && texto) {
            texto.textContent = mensaje;
            container.classList.remove('hidden');
        }
    }

    static ocultar() {
        const container = document.getElementById('mensajeError');
        if (container) {
            container.classList.add('hidden');
        }
    }
}

// ===== MANEJADOR DE LOGIN =====
class LoginHandler {
    static inicializar() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => this.manejarSubmit(e));
        }
    }

    static manejarSubmit(event) {
        event.preventDefault();

        const usuario = document.getElementById('Usuario')?.value.trim();
        const contrasena = document.getElementById('contra')?.value;

        if (!usuario || !contrasena) {
            ErrorHandler.mostrar('Por favor complete todos los campos');
            return;
        }

        if (!AuthValidator.validarCredenciales(usuario, contrasena)) {
            ErrorHandler.mostrar('Usuario o contraseña incorrectos');
            console.warn(`Intento de login fallido: ${usuario}`);
            return;
        }

        this.procesoLoginExitoso(usuario);
    }

    static procesoLoginExitoso(usuario) {
        localStorage.setItem(AUTH_CONFIG.AUTH_KEY, usuario);
        localStorage.setItem(AUTH_CONFIG.HORA_LOGIN_KEY, new Date().toLocaleString());
        
        document.getElementById('loginForm')?.reset();
        ErrorHandler.ocultar();
        
        window.location.href = './Inicio.html';
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    AuthValidator.verificarAutenticacion();
    LoginHandler.inicializar();
});
