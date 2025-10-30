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

// Animación de nubes y animaciones de giro del botón
var fogKeyframes = `
@keyframes fogMove {
    0% { background-position: 0% 0%, 100% 100%, 50% 80%; }
    50% { background-position: 50% 40%, 60% 70%, 40% 90%; }
    100% { background-position: 100% 100%, 0% 0%, 60% 60%; }
}
@keyframes fogSimpsons {
    0% { opacity: 1; transform: scale(1); filter: blur(0px); }
    100% { opacity: 0; transform: scale(2); filter: blur(15px); }
}

/* Animación de giro para APARECER */
@keyframes coinFlipIn {
    0% {
        transform: translate(-50%, -50%) scale(0.8) rotateY(-180deg);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(1) rotateY(0deg);
        opacity: 1;
    }
}

/* Animación de giro para DESAPARECER */
@keyframes coinFlipOut {
    0% {
        transform: translate(-50%, -50%) scale(1) rotateY(0deg);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(0.8) rotateY(180deg);
        opacity: 0;
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
    // Estado inicial (coincide con el 0% de coinFlipIn)
    transform: "translate(-50%, -50%) scale(0.8) rotateY(-180deg)",
    padding: "18px 50px",
    fontSize: "26px",
    fontFamily: "Montserrat, Arial, sans-serif",
    fontWeight: "bold",
    color: "#FFFFFF",
    background: "#031794",
    border: "none", // Sin bordes
    borderRadius: "90px",
    boxShadow: "none",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.3s ease", // Transición para el hover
    zIndex: "9999",
    opacity: "0" // Empieza invisible
});

// Agregar al documento
document.body.appendChild(startButton);

// Animación de aparición del botón (con giro)
setTimeout(() => {
    // Aplica la animación "coinFlipIn". 'forwards' hace que mantenga el estado final.
    startButton.style.animation = "coinFlipIn 0.8s ease-out forwards";
}, 300);

// Efecto hover (SIMPLE: escala y color)
startButton.addEventListener("mouseenter", () => {
    // Estado final de la animación es scale(1) rotateY(0deg)
    startButton.style.transform = "translate(-50%, -50%) scale(1.05) rotateY(0deg)";
    startButton.style.background = "#03169472"; 
});
startButton.addEventListener("mouseleave", () => {
    // Vuelve al estado final de la animación de entrada
    startButton.style.transform = "translate(-50%, -50%) scale(1) rotateY(0deg)";
    startButton.style.background = "#031794";
});

// === Acción al presionar ===
startButton.addEventListener("click", () => {
    // Desactiva los listeners de hover para evitar conflictos
    startButton.onmouseenter = null;
    startButton.onmouseleave = null;

    // Animación de salida (con giro)
    startButton.style.animation = "coinFlipOut 0.8s ease-in forwards";
    
    // Efecto de nubes "Los Simpson"
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