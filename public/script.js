document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    const cerrarSesionBtnMobile = document.getElementById('cerrarSesionBtnMobile');
    const usuarioInfo = document.getElementById('usuarioInfo');
    const usuarioInfoMobile = document.getElementById('usuarioInfoMobile');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#menuToggle') && !e.target.closest('#mobileMenu')) {
            mobileMenu.classList.add('hidden');
        }
    });

    const originalSetAttribute = Element.prototype.setAttribute;
    if (usuarioInfo) {
        const observer = new MutationObserver(() => {
            if (usuarioInfoMobile) {
                usuarioInfoMobile.textContent = usuarioInfo.textContent;
            }
        });
        observer.observe(usuarioInfo, { childList: true, characterData: true, subtree: true });
        if (usuarioInfoMobile) {
            usuarioInfoMobile.textContent = usuarioInfo.textContent;
        }
    }

    if (cerrarSesionBtnMobile && cerrarSesionBtn) {
        cerrarSesionBtnMobile.addEventListener('click', () => {
            cerrarSesionBtn.click();
        });
    }
});

const CONFIG = Object.freeze({
    STORAGE_KEY: 'transacciones',
    AUTH_KEY: 'usuarioAutenticado',
    HORA_LOGIN_KEY: 'horaLogin',
    SUCCESS_DURATION: 3000,
    DEFAULT_VALUE: 'n/a'
});

const MENSAJES = Object.freeze({
    TIPO_REQUERIDO: 'Favor diligenciar el tipo de transacción',
    VALOR_REQUERIDO: 'Favor diligenciar el valor',
    VALOR_POSITIVO: 'Favor ingresar un valor mayor a cero',
    VALOR_INVALIDO: 'Favor ingresar un número válido',
    CATEGORIA_REQUERIDA: 'Favor diligenciar la categoría',
    FECHA_REQUERIDA: 'Favor diligenciar la fecha',
    TRANSACCION_AGREGADA: '✅ Transacción agregada correctamente',
    TRANSACCION_ACTUALIZADA: '✅ Transacción actualizada correctamente',
    TRANSACCION_ELIMINADA: '✅ Transacción eliminada correctamente',
    CONFIRMACION_ELIMINAR: '¿Está seguro de que desea eliminar esta transacción?'
});

let transacciones = [];
let editIndex = null;

class StorageManager {
    static cargarTransacciones() {
        try {
            const datos = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (datos) {
                transacciones = JSON.parse(datos);
            }
        } catch (error) {
            console.error('Error al cargar transacciones:', error);
            transacciones = [];
        }
    }

    static guardarTransacciones() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(transacciones));
        } catch (error) {
            console.error('Error al guardar transacciones:', error);
        }
    }
}

class FormValidator {
    static removerErrorDelCampo(inputElement) {
        if (!inputElement) return;
        const siguiente = inputElement.nextElementSibling;
        if (siguiente?.classList?.contains('error-mensaje-campo')) {
            siguiente.remove();
        }
    }

    static mostrarError(inputElement, mensaje) {
        if (!inputElement) return;
        
        this.removerErrorDelCampo(inputElement);
        
        const parent = inputElement.parentNode;
        if (window.getComputedStyle(parent).position !== 'relative') {
            parent.style.position = 'relative';
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-mensaje-campo text-red-600 text-sm mt-1 font-medium';
        errorDiv.textContent = mensaje;
        
        inputElement.classList.add('border-red-500', 'bg-red-50');
        inputElement.insertAdjacentElement('afterend', errorDiv);
    }

    static limpiarErrores(formulario) {
        if (!formulario) return;
        
        formulario.querySelectorAll('.error-mensaje-campo').forEach(error => error.remove());
        formulario.querySelectorAll('input, select, textarea').forEach(input => {
            input.classList.remove('border-red-500', 'bg-red-50');
        });
    }

    static inicializarValidacionTiempoReal(formulario) {
        if (!formulario) return;

        formulario.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.removerErrorDelCampo(input);
                input.classList.remove('border-red-500', 'bg-red-50');
            });
            input.addEventListener('change', () => {
                this.removerErrorDelCampo(input);
                input.classList.remove('border-red-500', 'bg-red-50');
            });
        });
    }

    static validarValor(valor) {
        if (!valor || valor === '') {
            return { valido: false, mensaje: MENSAJES.VALOR_REQUERIDO };
        }
        const numValue = parseFloat(valor);
        if (isNaN(numValue)) {
            return { valido: false, mensaje: MENSAJES.VALOR_INVALIDO };
        }
        if (numValue <= 0) {
            return { valido: false, mensaje: MENSAJES.VALOR_POSITIVO };
        }
        return { valido: true };
    }

    static validarSelectField(value, mensaje) {
        if (!value || value === CONFIG.DEFAULT_VALUE) {
            return { valido: false, mensaje };
        }
        return { valido: true };
    }

    static validarCampoTexto(value, mensaje) {
        if (!value || value === '') {
            return { valido: false, mensaje };
        }
        return { valido: true };
    }
}

class TransactionValidator {
    static getFormFields(form) {
        return {
            tipo: form.querySelector('select[name="tipo"]'),
            valor: form.querySelector('input[name="valor"]'),
            categoria: form.querySelector('select[name="categoria"]'),
            fecha: form.querySelector('input[name="fecha"]'),
            descripcion: form.querySelector('textarea[name="descripcion"]')
        };
    }

    static validarFormulario(fields) {
        const validaciones = [];
        let primerError = null;

        const validTipo = FormValidator.validarSelectField(fields.tipo?.value, MENSAJES.TIPO_REQUERIDO);
        if (!validTipo.valido) {
            FormValidator.mostrarError(fields.tipo, validTipo.mensaje);
            validaciones.push(false);
            if (!primerError) primerError = fields.tipo;
        }

        const validValor = FormValidator.validarValor(fields.valor?.value);
        if (!validValor.valido) {
            FormValidator.mostrarError(fields.valor, validValor.mensaje);
            validaciones.push(false);
            if (!primerError) primerError = fields.valor;
        }

        const validCategoria = FormValidator.validarSelectField(fields.categoria?.value, MENSAJES.CATEGORIA_REQUERIDA);
        if (!validCategoria.valido) {
            FormValidator.mostrarError(fields.categoria, validCategoria.mensaje);
            validaciones.push(false);
            if (!primerError) primerError = fields.categoria;
        }

        const validFecha = FormValidator.validarCampoTexto(fields.fecha?.value, MENSAJES.FECHA_REQUERIDA);
        if (!validFecha.valido) {
            FormValidator.mostrarError(fields.fecha, validFecha.mensaje);
            validaciones.push(false);
            if (!primerError) primerError = fields.fecha;
        }

        return {
            valido: validaciones.every(v => v !== false),
            primerError
        };
    }

    static construirTransaccion(fields) {
        return {
            tipo: fields.tipo.value,
            valor: fields.valor.value,
            categoria: fields.categoria.value,
            fecha: fields.fecha.value,
            descripcion: fields.descripcion?.value || ''
        };
    }
}

class Notification {
    static mostrarExito(mensaje) {
        const div = document.createElement('div');
        div.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        div.textContent = mensaje;
        document.body.appendChild(div);
        
        setTimeout(() => div.remove(), CONFIG.SUCCESS_DURATION);
    }
}

function agregarTransaccion(event) {
    event.preventDefault();
    
    const form = document.getElementById('formAgregar');
    if (!form) return;
    
    const fields = TransactionValidator.getFormFields(form);
    FormValidator.limpiarErrores(form);
    
    const validacion = TransactionValidator.validarFormulario(fields);
    if (!validacion.valido) {
        if (validacion.primerError) {
            validacion.primerError.focus();
            validacion.primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    const transaccion = TransactionValidator.construirTransaccion(fields);
    transacciones.push(transaccion);
    StorageManager.guardarTransacciones();
    actualizarTabla();
    form.reset();
    Notification.mostrarExito(MENSAJES.TRANSACCION_AGREGADA);
}

function actualizarTransaccion(event) {
    event.preventDefault();
    
    const form = document.getElementById('formEditar');
    if (!form || editIndex === null) return;
    
    const fields = TransactionValidator.getFormFields(form);
    FormValidator.limpiarErrores(form);
    
    const validacion = TransactionValidator.validarFormulario(fields);
    if (!validacion.valido) {
        if (validacion.primerError) {
            validacion.primerError.focus();
        }
        return;
    }
    
    const transaccion = TransactionValidator.construirTransaccion(fields);
    transacciones[editIndex] = transaccion;
    StorageManager.guardarTransacciones();
    actualizarTabla();
    cerrarModal();
    Notification.mostrarExito(MENSAJES.TRANSACCION_ACTUALIZADA);
}

class TableRenderer {
    static renderizar() {
        const container = document.querySelector('.tabladetransaccion');
        if (!container) return;

        if (transacciones.length === 0) {
            container.innerHTML = this.renderizarVacio();
        } else {
            container.innerHTML = this.renderizarConDatos();
        }
    }

    static renderizarVacio() {
        return `
            <table class="w-full bg-white rounded-lg overflow-hidden shadow">
                <thead>
                    <tr class="bg-indigo-400">
                        <th class="text-left py-3 px-3 text-white">Tipo</th>
                        <th class="text-left py-3 px-3 text-white">Fecha</th>
                        <th class="text-left py-3 px-3 text-white">Categoría</th>
                        <th class="text-left py-3 px-3 text-white">Valor</th>
                        <th class="text-left py-3 px-3 text-white">Descripción</th>
                        <th class="text-left py-3 px-3 text-white">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="text-center py-8 text-gray-500 font-medium">
                            No hay transacciones registradas
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    static renderizarConDatos() {
        let html = `
            <table class="w-full bg-white rounded-lg overflow-hidden shadow">
                <thead>
                    <tr class="bg-indigo-400">
                        <th class="text-left py-3 px-3 text-white">Tipo</th>
                        <th class="text-left py-3 px-3 text-white">Fecha</th>
                        <th class="text-left py-3 px-3 text-white">Categoría</th>
                        <th class="text-left py-3 px-3 text-white">Valor</th>
                        <th class="text-left py-3 px-3 text-white">Descripción</th>
                        <th class="text-left py-3 px-3 text-white">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        transacciones.forEach((transaccion, index) => {
            html += this.renderizarFila(transaccion, index);
        });

        html += '</tbody></table>';
        return html;
    }

    static renderizarFila(transaccion, index) {
        const valorFormateado = Number(transaccion.valor).toLocaleString('es-ES');
        return `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="text-left py-2 px-3">${this.escaparHTML(transaccion.tipo)}</td>
                <td class="text-left py-2 px-3">${this.escaparHTML(transaccion.fecha)}</td>
                <td class="text-left py-2 px-3">${this.escaparHTML(transaccion.categoria)}</td>
                <td class="text-left py-2 px-3 font-semibold">$${valorFormateado}</td>
                <td class="text-left py-2 px-3">${this.escaparHTML(transaccion.descripcion || '-')}</td>
                <td class="text-left py-2 px-3 space-x-2">
                    <button data-action="editar" data-index="${index}" class="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-700 text-sm transition-colors">
                        ✏️ Editar
                    </button>
                    <button data-action="eliminar" data-index="${index}" class="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-700 text-sm transition-colors">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `;
    }

    static escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

function abrirModalEditar(index) {
    editIndex = index;
    const transaccion = transacciones[index];
    
    document.getElementById('tipoEdit').value = transaccion.tipo;
    document.getElementById('valorEdit').value = transaccion.valor;
    document.getElementById('categoriaEdit').value = transaccion.categoria;
    document.getElementById('fechaEdit').value = transaccion.fecha;
    document.getElementById('descripcionEdit').value = transaccion.descripcion || '';
    
    const modalForm = document.getElementById('formEditar');
    FormValidator.limpiarErrores(modalForm);
    
    document.getElementById('modal').classList.remove('hidden');
}

function eliminarTransaccion(index) {
    if (confirm(MENSAJES.CONFIRMACION_ELIMINAR)) {
        transacciones.splice(index, 1);
        StorageManager.guardarTransacciones();
        TableRenderer.renderizar();
        Notification.mostrarExito(MENSAJES.TRANSACCION_ELIMINADA);
    }
}

function cerrarModal() {
    document.getElementById('modal').classList.add('hidden');
    editIndex = null;
}

class FilterManager {
    static aplicar() {
        const filtroCategoria = document.getElementById('filtroCategoria').value;
        const filtroTipo = document.getElementById('filtroTipo').value;
        
        const tbody = document.querySelector('.tabladetransaccion tbody');
        if (!tbody) return;
        
        tbody.querySelectorAll('tr').forEach(fila => {
            if (fila.querySelector('td[colspan]')) return;
            
            const celdas = fila.querySelectorAll('td');
            if (celdas.length >= 3) {
                const tipo = celdas[0]?.textContent || '';
                const categoria = celdas[2]?.textContent || '';
                
                const coincide = (!filtroTipo || tipo === filtroTipo) && 
                                (!filtroCategoria || categoria === filtroCategoria);
                
                fila.style.display = coincide ? '' : 'none';
            }
        });
    }
}

class UserManager {
    static mostrarUsuario() {
        const usuarioActual = localStorage.getItem(CONFIG.AUTH_KEY);
        const usuarioInfo = document.getElementById('usuarioInfo');
        
        if (usuarioInfo && usuarioActual) {
            usuarioInfo.textContent = `👤 ${usuarioActual}`;
        }
    }

    static cerrarSesion() {
        localStorage.removeItem(CONFIG.AUTH_KEY);
        localStorage.removeItem(CONFIG.HORA_LOGIN_KEY);
        window.location.href = './Login.html';
    }
}

class AppInitializer {
    static inicializar() {
        // Mostrar usuario
        UserManager.mostrarUsuario();

        // Cargar transacciones
        StorageManager.cargarTransacciones();
        TableRenderer.renderizar();

        // Configurar event listeners
        this.setupFormListeners();
        this.setupModalListeners();
        this.setupFilterListeners();
        this.setupUserListeners();
        this.setupTableDelegation();

        console.log('Aplicación inicializada correctamente');
    }

    static setupFormListeners() {
        const formAgregar = document.getElementById('formAgregar');
        if (formAgregar) {
            formAgregar.addEventListener('submit', agregarTransaccion);
            FormValidator.inicializarValidacionTiempoReal(formAgregar);
        }

        const formEditar = document.getElementById('formEditar');
        if (formEditar) {
            formEditar.addEventListener('submit', actualizarTransaccion);
            FormValidator.inicializarValidacionTiempoReal(formEditar);
        }
    }

    static setupModalListeners() {
        const closeBtn = document.getElementById('closeModalButton');
        if (closeBtn) {
            closeBtn.addEventListener('click', cerrarModal);
        }

        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) cerrarModal();
            });
        }
    }

    static setupFilterListeners() {
        document.getElementById('filtroCategoria')?.addEventListener('change', () => FilterManager.aplicar());
        document.getElementById('filtroTipo')?.addEventListener('change', () => FilterManager.aplicar());
    }

    static setupUserListeners() {
        const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', () => UserManager.cerrarSesion());
        }
    }

    static setupTableDelegation() {
        const tabla = document.querySelector('.tabladetransaccion');
        if (tabla) {
            tabla.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;

                const index = parseInt(btn.dataset.index);
                const accion = btn.dataset.action;

                if (accion === 'editar') abrirModalEditar(index);
                if (accion === 'eliminar') eliminarTransaccion(index);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => AppInitializer.inicializar());

function inyectarEstilos() {
    const estilos = document.createElement('style');
    estilos.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        .error-mensaje-campo {
            font-size: 0.875rem;
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
            color: #dc2626;
            font-weight: 500;
        }
    `;
    document.head.appendChild(estilos);
}

inyectarEstilos();