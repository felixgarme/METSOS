// Reducir resolución al 50% (por ejemplo)
const scaleFactor = 0.9; // 1 = 100%, 0.5 = 50%

// Ajustar el tamaño del renderer
app.renderer.setSize(
    window.innerWidth * scaleFactor,
    window.innerHeight * scaleFactor,
    false
);

// Ajustar pixel ratio (opcional, mejora el rendimiento)
app.renderer.setPixelRatio(window.devicePixelRatio * scaleFactor);

// Actualizar cámara para mantener proporción
app.camera.aspect = (window.innerWidth * scaleFactor) / (window.innerHeight * scaleFactor);
app.camera.updateProjectionMatrix();

// Escuchar cambio de ventana para mantener escala
window.addEventListener('resize', () => {
    app.renderer.setSize(window.innerWidth * scaleFactor, window.innerHeight * scaleFactor, false);
    app.renderer.setPixelRatio(window.devicePixelRatio * scaleFactor);
    app.camera.aspect = (window.innerWidth * scaleFactor) / (window.innerHeight * scaleFactor);
    app.camera.updateProjectionMatrix();
});
