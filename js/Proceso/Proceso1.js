// === Crear efecto de nubes + botón "Empezar" ===

// Crear un contenedor de niebla/nubes
var fogOverlay = document.createElement("div");
Object.assign(fogOverlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: `
        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.33) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0) 70%),
        radial-gradient(circle at 70% 70%, rgba(255,255,255,0.33) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0) 70%),
        radial-gradient(circle at 50% 80%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.11) 40%, rgba(255,255,255,0) 70%)
    `,
    backdropFilter: "blur(10px)",
    animation: "fogMove 20s ease-in-out infinite alternate",
    transition: "opacity 2s ease, transform 2s ease",
    zIndex: "9998",
    opacity: "1",
    pointerEvents: "none",
});
document.body.appendChild(fogOverlay);

// Animación de movimiento suave de las nubes (CSS)
var fogKeyframes = `
@keyframes fogMove {
    0% { background-position: 0% 0%, 100% 100%, 50% 80%; }
    50% { background-position: 50% 40%, 60% 70%, 40% 90%; }
    100% { background-position: 100% 100%, 0% 0%, 60% 60%; }
}
@keyframes fogSimpsons {
    0% {
        opacity: 1;
        transform: scale(1);
        filter: blur(0px);
    }
    100% {
        opacity: 0;
        transform: scale(2);
        filter: blur(15px);
    }
}`;
var fogStyle = document.createElement("style");
fogStyle.innerHTML = fogKeyframes;
document.head.appendChild(fogStyle);

// === Crear botón "Empezar" ===
var startButton = document.createElement("button");
startButton.innerText = "Empezar";

// Estilos del botón
Object.assign(startButton.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.9)",
    padding: "18px 50px",
    fontSize: "26px",
    fontFamily: "Montserrat, Arial, sans-serif",
    fontWeight: "bold",
    color: "#007BFF",
    background: "#ffffff",
    border: "3px solid #007BFF",
    borderRadius: "40px",
    boxShadow: "0 0 25px rgba(0, 123, 255, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: "9999",
    opacity: "0"
});

// Agregar al documento
document.body.appendChild(startButton);

// Animación de aparición del botón
setTimeout(() => {
    startButton.style.opacity = "1";
    startButton.style.transform = "translate(-50%, -50%) scale(1)";
}, 300);

// Efecto hover
startButton.addEventListener("mouseenter", () => {
    startButton.style.transform = "translate(-50%, -50%) scale(1.1)";
    startButton.style.background = "#007BFF";
    startButton.style.color = "#ffffff";
    startButton.style.boxShadow = "0 0 35px rgba(0, 123, 255, 0.6)";
});
startButton.addEventListener("mouseleave", () => {
    startButton.style.transform = "translate(-50%, -50%) scale(1)";
    startButton.style.background = "#ffffff";
    startButton.style.color = "#007BFF";
    startButton.style.boxShadow = "0 0 25px rgba(0, 123, 255, 0.3)";
});

// === Acción al presionar ===
startButton.addEventListener("click", () => {
    // Animación de salida del botón
    startButton.style.opacity = "0";
    startButton.style.transform = "translate(-50%, -50%) scale(0.8)";
    
    // Efecto de nubes "Los Simpson" (se abren y disuelven)
    fogOverlay.style.animation = "fogSimpsons 2.5s ease forwards";

    // Llamar al procedimiento de Puzzles y limpiar
    setTimeout(() => {
        if (v3d && v3d.puzzles && v3d.puzzles.procedures["zoneA"]) {
            v3d.puzzles.procedures["zoneA"]();
        } else {
            console.warn("Procedimiento 'zoneA' no encontrado.");
        }
        startButton.remove();
        fogOverlay.remove();
    }, 2500); // espera a que termine la animación tipo "Los Simpson"
});
