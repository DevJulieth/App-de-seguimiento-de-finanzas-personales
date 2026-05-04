module.exports = {
    proxy: "http://localhost:3000",  // Proxy a tu servidor Express
    port: 3001,                       // Puerto donde abrirá BrowserSync
    open: true,                       // Abre automáticamente el navegador
    files: ["./public/**/*"],         // Archivos a vigilar
    reloadDelay: 0,
    reloadDebounce: 0,
    notify: false,                    // No mostrar notificaciones
    ui: false                         // No abrir la UI de BrowserSync
};