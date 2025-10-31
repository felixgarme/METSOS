/**
 * v3d-boton-toggle.js
 *
 * Crea un botón de estado (toggle) en la parte inferior central.
 * Se inicializa de forma "lazy" (perezosa).
 *
 * FUNCIONALIDAD:
 * - Estado 1 (Inactivo):
 * - Texto: "Vista libre"
 * - Al hacer clic: Llama a v3d.puzzles.procedures["VistaLibre"]()
 * - Estado 2 (Activo):
 * - Texto: "Desactivar vista libre"
 * - Al hacer clic: Llama a v3d.puzzles.procedures["VistaLibreOff"]()
 *
 * CÓMO USAR DESDE VERGE3D (Puzzles "ejecutar código JS"):
 * - Para mostrar/ocultar el botón:
 * window.parent.mostrarBotonLibre();
 * window.parent.ocultarBotonLibre();
 * window.parent.BotonLibre(); // Alterna visibilidad
 *
 * - Para sincronizar el estado del botón (MUY RECOMENDADO):
 * // Si activas la vista por otros medios
 * window.parent.setBotonVistaLibreState(true);
 * // Si desactivas la vista por otros medios
 * window.parent.setBotonVistaLibreState(false);
 */
(function () {
  if (window.__v3d_boton_libre_inited) return;
  window.__v3d_boton_libre_inited = true;

  const BOTON_ID = "v3d-boton-libre-overlay";
  let botonElement = null;
  let cssInyectado = false;
  
  // Variable para rastrear el estado del botón
  let isVistaLibreActiva = false;

  function inyectarCSS() {
    if (cssInyectado || document.getElementById(BOTON_ID + "-style")) {
      cssInyectado = true;
      return;
    }

    const style = document.createElement('style');
    style.id = BOTON_ID + "-style";
    style.innerHTML = `
      #${BOTON_ID} {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        
        /* Estilos visuales (blanco simple) */
        padding: 10px 25px;
        font-size: 16px;
        font-family: AA Smart Sans;
        font-weight: 600;
        color: #031795;
        background-color: #E5EFF9;
        border: 1px solid #6B8BDE;
        border-radius: 50px;
        cursor: pointer;
        transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        min-width: 180px; /* Ancho mínimo para que quepa "Desactivar vista libre" */
        text-align: center;

        box-shadow: 0px 4px 19.2px 2px #6B8BDE66;


        display: none; 
      }

      #${BOTON_ID}:hover {
        background-color: #031794;
        border-color: #6B8BDE;
        color: #FFFFFF;
      }
      
      #${BOTON_ID}:active {
        background-color: #E5EFF9;;
        border-color: #6B8BDE;
        transform: translateX(-50%) translateY(1px);
        color: #031795;
      }
      
      /* [NUEVO] Estilo para cuando el botón está ACTIVO */
      #${BOTON_ID}.v3d-boton-activo {
        background-color: #E5EFF9; /* Fondo gris claro */
        border-color: #6B8BDE;
        font-weight: 600; /* Ligeramente más negrita */
      }
    `;
    document.head.appendChild(style);
    cssInyectado = true;
  }
  
  /**
   * Helper para encontrar la app de V3D (en ventana principal o iframe)
   */
  function getV3dApp() {
    let v3dApp = window.v3d || (window.frames[0] ? window.frames[0].v3d : null);
    if (v3dApp) return v3dApp;
    if (window.parent && window.parent.v3d) return window.parent.v3d;
    return null;
  }

  /**
   * Helper para ejecutar un puzzle de forma segura
   */
  function ejecutarPuzzle(puzzleName) {
    try {
      const v3dApp = getV3dApp();
      if (v3dApp && v3dApp.puzzles && v3dApp.puzzles.procedures && v3dApp.puzzles.procedures[puzzleName]) {
        console.log(`[BotonLibre] Ejecutando puzzle: "${puzzleName}"`);
        v3dApp.puzzles.procedures[puzzleName]();
        return true; // Éxito
      } else {
        console.warn(`[BotonLibre] No se pudo encontrar el puzzle: "${puzzleName}"`);
        alert(`Error: No se encontró la función "${puzzleName}".`);
        return false; // Falla
      }
    } catch (e) {
      console.error(`[BotonLibre] Error al ejecutar el puzzle "${puzzleName}":`, e);
      return false; // Falla
    }
  }

  function crearBoton() {
    let el = document.getElementById(BOTON_ID);
    if (el) {
      botonElement = el;
      return;
    }

    botonElement = document.createElement('button');
    botonElement.id = BOTON_ID;
    
    // Texto inicial
    botonElement.textContent = 'Vista libre';
    isVistaLibreActiva = false; // Estado inicial

    // [LÓGICA DE CLIC ACTUALIZADA]
    botonElement.addEventListener('click', () => {
      if (isVistaLibreActiva) {
        // --- ESTÁ ACTIVO, SE VA A DESACTIVAR ---
        if (ejecutarPuzzle("VistaLibreOff")) {
          botonElement.textContent = 'Vista libre';
          botonElement.classList.remove('v3d-boton-activo');
          isVistaLibreActiva = false;
        }
      } else {
        // --- ESTÁ INACTIVO, SE VA A ACTIVAR ---
        if (ejecutarPuzzle("VistaLibre")) {
          botonElement.textContent = 'Desactivar vista libre';
          botonElement.classList.add('v3d-boton-activo');
          isVistaLibreActiva = true;
        }
      }
    });

    if (document.body) {
        document.body.appendChild(botonElement);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (!document.getElementById(BOTON_ID)) {
                document.body.appendChild(botonElement);
            }
        });
    }
  }

  function asegurarBotonExiste() {
    if (botonElement) return;
    inyectarCSS();
    crearBoton();
    console.log("%c[BotonLibre] Inicializado y creado (lazy).", "color:#007bff;font-weight:700;");
  }

  // --- API Global para visibilidad ---

  window.mostrarBotonLibre = function () {
    asegurarBotonExiste();
    if (botonElement) {
      botonElement.style.display = 'block';
    }
  };

  window.ocultarBotonLibre = function () {
    asegurarBotonExiste();
    if (botonElement) {
      botonElement.style.display = 'none';
    }
  };

  window.toggleBotonLibre = function () {
    asegurarBotonExiste();
    if (botonElement) {
      const isVisible = botonElement.style.display === 'block';
      botonElement.style.display = isVisible ? 'none' : 'block';
    }
  };
  
  window.BotonLibre = window.toggleBotonLibre;

  // --- [NUEVO] API Global para Sincronizar Estado ---

  /**
   * Permite a Verge3D (u otro script) forzar el estado del botón.
   * Úsalo para mantener la sincronización.
   * @param {boolean} isActive - true para "Desactivar vista libre", false para "Vista libre"
   */
  window.setBotonVistaLibreState = function (isActive) {
    asegurarBotonExiste();
    if (typeof isActive !== 'boolean') {
      console.warn('[BotonLibre] setBotonVistaLibreState requiere un booleano (true/false).');
      return;
    }
    
    if (isActive) {
      botonElement.textContent = 'Desactivar vista libre';
      botonElement.classList.add('v3d-boton-activo');
      isVistaLibreActiva = true;
    } else {
      botonElement.textContent = 'Vista libre';
      botonElement.classList.remove('v3d-boton-activo');
      isVistaLibreActiva = false;
    }
  };

  console.log("%c[BotonLibre] Funciones listas. El botón se creará en la primera llamada.", "color:#007bff;font-weight:700;");

})();