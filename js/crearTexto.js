/**
 * v3d-cardmodulo.js
 * Versión: 1.5 (Animación de texto escalonada para suavizar la entrada)
 * Uso: crearCardModulo("Módulo 2 y 3", "url/a/tu/imagen.png");  // crea una card
 * clearCardsCentro();   // elimina todos las cards creadas
 *
 * Es autocontenido: inyecta estilos una sola vez y expone funciones globales.
 * (Refactorizado desde v3d-textocentro.js para coincidir con la imagen del módulo)
 */
(function () {
  // Evitar doble inclusión
  if (window.__v3d_cardmodulo_inited) return;
  window.__v3d_cardmodulo_inited = true;

  // --- Crear contenedor overlay centrado ---
  const containerId = "v3d-cards-centro-overlay";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Inyectar estilos (una vez)
  if (!document.getElementById("v3d-cardmodulo-styles")) {
    const style = document.createElement("style");
    style.id = "v3d-cardmodulo-styles";
    style.textContent = `
#${containerId} {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px; /* Espacio entre cards si hay varias */
}

/* Wrapper individual de cada card (para animaciones) */
.v3d-card-wrapper {
  position: relative;
  pointer-events: auto;
  will-change: transform, opacity;
  user-select: none;
}

/* Estilos de la Card (basado en la imagen) */
.v3d-card-modulo {
  background-color: #1a746b; /* Teal oscuro de la imagen */
  border-radius: 12px;
  padding: 24px;
  width: 200px; /* Ancho de ejemplo */
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.v3d-card-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #d8d8d8; /* Gris claro de la imagen */
  border: 8px solid #e87e22; /* Naranja de la imagen (ajustado) */
  overflow: hidden; /* Clave para que la imagen quede contenida */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) inset;
  transform-style: preserve-3d; 
  perspective: 1000px;
}

.v3d-card-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen llene el círculo */
  backface-visibility: hidden; 
}

.v3d-card-text {
  font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: white;
  text-align: center;
}

/* Animaciones */

@keyframes v3d-pop {
  0%   { transform: translateY(20px) scale(0.95); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes v3d-float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

@keyframes v3d-coin-flip-in {
  0%   { transform: rotateY(-180deg) scale(0.5); opacity: 0; }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
}

/* CAMBIO 1: Nueva animación para que el texto entre suavemente */
@keyframes v3d-fade-in-up {
  0%   { transform: translateY(15px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.v3d-anim-pop { 
  animation: v3d-pop 900ms cubic-bezier(0.4, 0, 0.2, 1); 
}
.v3d-anim-float { 
  animation: v3d-float 3000ms ease-in-out infinite; 
}

.v3d-card-wrapper.v3d-anim-pop .v3d-card-circle {
  opacity: 0; 
  animation: v3d-coin-flip-in 1000ms ease-out 200ms forwards; /* Retraso de 200ms */
}

/* CAMBIO 2: Aplicar la animación escalonada al texto */
.v3d-card-wrapper.v3d-anim-pop .v3d-card-text {
  opacity: 0;
  animation: v3d-fade-in-up 700ms ease-out 300ms forwards; /* Retraso de 300ms (un poco después del círculo) */
}
`;
    document.head.appendChild(style);
  }

  // Contador simple para IDs
  let _idCounter = 1;

  // Util: crea un nodo de Card
  function _createCardNode(text, imageUrl, opts) {
    opts = opts || {};
    const id = "v3d-card-" + (_idCounter++);

    // Wrapper para animaciones y posicionamiento
    const wrapper = document.createElement("div");
    wrapper.className = "v3d-card-wrapper v3d-anim-pop";
    if (!opts.disableFloat) {
      wrapper.classList.add("v3d-anim-float");
    }
    wrapper.id = id;
    wrapper.style.pointerEvents = opts.pointerEvents ? "auto" : "none";
    if (opts.margin) {
      wrapper.style.margin = opts.margin;
    }

    // Card principal
    const card = document.createElement("div");
    card.className = "v3d-card-modulo";

    // Círculo con imagen
    const circle = document.createElement("div");
    circle.className = "v3d-card-circle";
    const img = document.createElement("img");
    img.src = imageUrl || "https://via.placeholder.com/120/d8d8d8/888?text=IMG"; // Placeholder
    img.alt = opts.altText || "Ilustración del módulo";
    circle.appendChild(img);

    // Texto
    const textEl = document.createElement("div");
    textEl.className = "v3d-card-text";
    textEl.textContent = text;

    // Ensamblar
    card.appendChild(circle);
    card.appendChild(textEl);
    wrapper.appendChild(card);

    // Ajustado el tiempo de espera para que sea mayor que la nueva animación (1000ms + 200ms de retraso = 1200ms)
    // El texto termina en (700ms + 300ms = 1000ms), así que 1300ms sigue siendo correcto.
    setTimeout(() => {
      wrapper.classList.remove("v3d-anim-pop");
    }, 1300); 

    return { node: wrapper, id };
  }

  // API pública: crea una card en el centro
  // Opciones:
  //  - duration: ms para autodestruir
  //  - disableFloat: true (para quitar animación 'float')
  //  - altText: texto alt para la imagen
  function crearCardModulo(text, imageUrl, options) {
    if (typeof text !== "string" && typeof text !== "number") text = String(text);
    options = options || {};
    const created = _createCardNode(text, imageUrl, options);
    container.appendChild(created.node);

    // opcional: autodestruir después de timeout
    if (options.duration && typeof options.duration === "number" && options.duration > 0) {
      setTimeout(() => {
        const el = document.getElementById(created.id);
        if (el) {
          // salida animada
          el.style.transition = "transform 360ms ease, opacity 360ms ease";
          el.style.transform += " translateY(-24px) scale(0.95)";
          el.style.opacity = "0";
          setTimeout(() => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
          }, 380);
        }
      }, options.duration);
    }

    return created.id;
  }

  // Borra todos las cards creadas por esta librería
  function clearCardsCentro() {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  // Borra una card específica por id
  function removeCardById(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // Exponer API en window
  window.crearCardModulo = crearCardModulo;
  window.clearCardsCentro = clearCardsCentro;
  window.removeCardById = removeCardById;

  // Extra: función para crear varias cards apiladas
  window.crearMultiCards = function (arr, opts) {
    // arr: array de objetos [{text: '..', imageUrl: '..'}]
    opts = opts || {};
    const ids = [];
    arr.forEach((item, i) => {
      const localOpts = Object.assign({}, opts);
      // desplazar verticalmente cada card
      localOpts.margin = (i * (opts.stackGap || 16)) + "px 0 0 0";
      ids.push(crearCardModulo(item.text, item.imageUrl, localOpts));
    });
    return ids;
  };

  // Mensaje en consola para desarrolladores
  if (window.console && window.console.log) {
    console.log("%c[v3d-card-modulo] listo — llama a crearCardModulo('Módulo 2 y 3', 'img.png');", "color: #1a746b; font-weight:600;");
  }
})();