# Seguimiento a tus Finanzas

Una aplicación web moderna y responsiva para el **seguimiento y gestión de tus finanzas personales**. Permite registrar, categorizar, filtrar y administrar ingresos y gastos de forma sencilla e intuitiva.

## Descripción

"Seguimiento a tus Finanzas" es una herramienta diseñada para ayudarte a controlar tu economía personal. Con una interfaz amigable, puedes registrar cada ingreso y gasto, organizarlos por categorías y mantener un historial completo de tus transacciones.

## Características Principales

- ✅ **Autenticación segura** - Sistema de login con credenciales de prueba
- ✅ **Registro de transacciones** - Registra ingresos y gastos fácilmente
- ✅ **Categorización** - Clasifica tus gastos en categorías predefinidas (Alimentación, Gastos Hogar, Tecnología, Otros)
- ✅ **Filtros avanzados** - Filtra por tipo (Ingreso/Gasto) y categoría
- ✅ **Edición y eliminación** - Modifica o elimina transacciones existentes
- ✅ **Persistencia de datos** - Todos tus datos se guardan localmente con localStorage
- ✅ **Validación de formularios** - Validación en tiempo real de los datos ingresados
- ✅ **Interfaz responsiva** - Diseño mobile-first que se adapta a cualquier dispositivo
- ✅ **Menú adaptativo** - Hamburguesa en móvil, navegación horizontal en desktop
- ✅ **Información del usuario** - Muestra datos del usuario autenticado

## Requisitos Previos

- **Node.js** (v14 o superior)
- **npm** (v6 o superior)
- Un navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/DevJulieth/App-de-seguimiento-de-finanzas-personales.git
cd App-de-seguimiento-de-finanzas-personales
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
App-de-seguimiento-de-finanzas-personales/
├── public/
│   ├── Inicio.html          # Página principal de la aplicación
│   ├── Login.html           # Página de autenticación
│   ├── styles.css           # Estilos generales (Tailwind CSS)
│   ├── script.js            # Lógica principal de transacciones
│   ├── auth.js              # Sistema de autenticación
│   └── Logo.jpeg            # Logo de la aplicación
├── src/
│   └── input.css            # Estilos de entrada de Tailwind
├── server.js                # Servidor Express
├── bs-config.js             # Configuración de BrowserSync
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo
```

## Credenciales de Prueba

Para probar la aplicación, usa las siguientes credenciales:

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `1234` |

Estas credenciales se muestran en la pantalla de login por defecto.

## 📖 Guía de Uso

### 1. **Iniciar Sesión**
   - Ingresa al sitio y verás la página de login
   - Usa las credenciales de prueba (admin / 1234)
   - Haz clic en "Ingresar"

### 2. **Registrar una Transacción**
   - En la página "Agregar Transacción", completa los siguientes campos:
     - **Tipo**: Selecciona si es "Ingreso" o "Gasto"
     - **Valor**: Ingresa el monto (sin comas ni puntos)
     - **Categoría**: Elige la categoría correspondiente
     - **Fecha**: Selecciona la fecha de la transacción
     - **Descripción**: (Opcional) Añade notas adicionales
   - Haz clic en "Guardar"

### 3. **Filtrar Transacciones**
   - Usa los filtros en la parte superior de la lista
   - Filtra por "Categoría" o "Tipo" de transacción
   - Selecciona "Todas las categorías" o "Todos los tipos" para ver todo

### 4. **Editar una Transacción**
   - En la tabla de transacciones, haz clic en el botón "Editar"
   - Modifica los datos que necesites
   - Haz clic en "Actualizar"

### 5. **Eliminar una Transacción**
   - En la tabla de transacciones, haz clic en el botón de eliminar
   - Confirma la acción en el diálogo de confirmación

### 6. **Cerrar Sesión**
   - Haz clic en el botón "Cerrar Sesión" en el header
   - Serás redirigido a la página de login

### Stack Tecnológico

- **Frontend**:
  - HTML5
  - CSS3 (Tailwind CSS v4.2.4)
  - JavaScript (ES6+)
  
- **Backend**:
  - Node.js
  - Express.js
  
- **Herramientas de Desarrollo**:
  - BrowserSync (para live reload)
  - npm (gestor de paquetes)
  
- **Almacenamiento**:
  - localStorage (almacenamiento local del navegador)

## Categorías de Transacciones

-  **Alimentación** - Comidas y bebidas
-  **Gastos Hogar** - Servicios y mantenimiento del hogar
-  **Tecnología y Electrodomésticos** - Dispositivos y aparatos electrónicos
-  **Otros** - Gastos diversos

## 🔄 Flujo de Datos

```
Usuario → Login → Página Principal → Registro de Transacción
                                   ↓
                            Almacenamiento (localStorage)
                                   ↓
                            Visualización en Tabla
                                   ↓
                            Filtrado, Edición o Eliminación
```

## Validaciones Implementadas

- Campo "Tipo" debe ser seleccionado
- Campo "Valor" debe ser un número mayor a cero
- Campo "Categoría" debe ser seleccionado
- Campo "Fecha" es requerido
- Validación en tiempo real mientras escribes
- Mensajes de error claros y descriptivos

## Diseño Responsivo

La aplicación utiliza Tailwind CSS con breakpoints para garantizar:
- **Móvil** (0px - 640px): Interfaz optimizada con menú hamburguesa
- **Tablet** (641px - 1024px): Layout adaptado
- **Desktop** (1025px+): Layout completo con menú horizontal

## Características del Diseño

- Paleta de colores azul índigo profesional
- Transiciones suaves en interacciones
- Validación con feedback visual (errores en rojo)
- Notificaciones de éxito en verde
- Iconografía SVG integrada

## Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usar, modificar y distribuir el código libremente.

## Soporte

Si encuentras algún problema o tienes preguntas:
- Verifica que Node.js y npm estén instalados correctamente
- Limpia el cache del navegador (localStorage)
- Asegúrate de usar las credenciales correctas (admin / 1234)
- Revisa la consola del navegador para mensajes de error

## Mejoras Futuras

- [ ] Backend con base de datos (MongoDB/PostgreSQL)
- [ ] Reportes gráficos de gastos
- [ ] Exportación de datos (PDF/Excel)
- [ ] Sincronización en la nube
- [ ] Categorías personalizadas
- [ ] Metas financieras
- [ ] Autenticación con OAuth
- [ ] Aplicación móvil nativa

## Changelog

### v1.0.0 - Versión Inicial
- Autenticación con login
- Registro de ingresos y gastos
- Edición y eliminación de transacciones
- Filtros por tipo y categoría
- Interfaz responsiva
- Menú adaptativo para móvil

---

**Hecho con ❤️ por Julieth Ochoa**