// === BLOQUE COMPLETO JS PARA VERGE3D ===

// Crear el botón "Continuar"
const continuarBtn = document.createElement("button");
continuarBtn.id = "continuarBtn";
continuarBtn.innerText = "Continuar";

// Estilos del botón
const style = document.createElement("style");
style.textContent = `
  #continuarBtn {
    position: fixed;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    color: #007BFF;
    border: 2px solid #007BFF;
    border-radius: 12px;
    padding: 12px 28px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.3s ease;
    pointer-events: none; /* Deshabilitado al inicio */
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
  }

  #continuarBtn:hover:enabled {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 0 20px rgba(0,123,255,0.4);
  }

  #continuarBtn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  #continuarBtn.show {
    opacity: 1;
    pointer-events: auto;
  }

  #continuarBtn.hide {
    opacity: 0;
    pointer-events: none;
  }
`;
document.head.appendChild(style);
document.body.appendChild(continuarBtn);

// Estado inicial
continuarBtn.disabled = true;
continuarBtn.classList.add("hide");

// Acción al presionar
continuarBtn.addEventListener("click", () => {
  if (!continuarBtn.disabled && typeof v3d !== "undefined" && v3d.puzzles && v3d.puzzles.procedures["continuarB"]) {
    v3d.puzzles.procedures["continuarB"]();
  }
});

// === FUNCIONES CONTROLADORAS ===

// Mostrar el botón
window.mostrarContinuar = function() {
  continuarBtn.classList.remove("hide");
  continuarBtn.classList.add("show");
};

// Ocultar el botón
window.ocultarContinuar = function() {
  continuarBtn.classList.remove("show");
  continuarBtn.classList.add("hide");
};

// Habilitar el botón
window.habilitarContinuar = function() {
  continuarBtn.disabled = false;
};

// Deshabilitar el botón
window.deshabilitarContinuar = function() {
  continuarBtn.disabled = true;
};

// mostrarContinuar();       // Muestra el botón
// ocultarContinuar();       // Oculta el botón
// habilitarContinuar();     // Activa el botón (clickeable)
// deshabilitarContinuar();  // Lo desactiva