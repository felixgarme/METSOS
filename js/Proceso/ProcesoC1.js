// === BLOQUE COMPLETO JS PARA VERGE3D: BOTÓN "Continuar 2" ===

// Crear el botón "Continuar 2"
const continuarBtn2 = document.createElement("button");
continuarBtn2.id = "continuarBtn2";
continuarBtn2.innerText = "Continuar 2";

// Estilos del botón
const style2 = document.createElement("style");
style2.textContent = `
  #continuarBtn2 {
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
    z-index: 9999;
  }

  #continuarBtn2:hover:enabled {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 0 20px rgba(0,123,255,0.4);
  }

  #continuarBtn2:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  #continuarBtn2.show {
    opacity: 1;
    pointer-events: auto;
  }

  #continuarBtn2.hide {
    opacity: 0;
    pointer-events: none;
  }
`;
document.head.appendChild(style2);
document.body.appendChild(continuarBtn2);

// Estado inicial
continuarBtn2.disabled = true;
continuarBtn2.classList.add("hide");

// Acción al presionar
continuarBtn2.addEventListener("click", () => {
  if (!continuarBtn2.disabled && typeof v3d !== "undefined" && v3d.puzzles && v3d.puzzles.procedures["continuarC"]) {
    v3d.puzzles.procedures["continuarC"]();
  }
});

// === FUNCIONES CONTROLADORAS ===

// Mostrar el botón
window.mostrarContinuar2 = function() {
  continuarBtn2.classList.remove("hide");
  continuarBtn2.classList.add("show");
};

// Ocultar el botón
window.ocultarContinuar2 = function() {
  continuarBtn2.classList.remove("show");
  continuarBtn2.classList.add("hide");
};

// Habilitar el botón
window.habilitarContinuar2 = function() {
  continuarBtn2.disabled = false;
};

// Deshabilitar el botón
window.deshabilitarContinuar2 = function() {
  continuarBtn2.disabled = true;
};
