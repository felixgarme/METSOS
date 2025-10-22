/**
 * v3d-textocentro.js
 * Versión: 1.0
 * Uso: textocentro("hola");  // crea un texto
 *      clearTextosCentro();   // elimina todos los textos creados
 *
 * Es autocontenido: inyecta estilos una sola vez y expone funciones globales.
 */
(function () {
  // Evitar doble inclusión
  if (window.__v3d_textocentro_inited) return;
  window.__v3d_textocentro_inited = true;

  // --- Crear contenedor overlay centrado ---
  const containerId = "v3d-textos-centro-overlay";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Inyectar estilos (una vez)
  if (!document.getElementById("v3d-textocentro-styles")) {
    const style = document.createElement("style");
    style.id = "v3d-textocentro-styles";
    style.textContent = `
#${containerId} {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  perspective: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Wrapper individual de cada texto 3D */
.v3d-3dtext {
  position: relative;
  transform-style: preserve-3d;
  pointer-events: auto; /* por si quieres click handlers en el futuro */
  display: inline-block;
  will-change: transform, opacity;
}

/* Capas para simular volumen 3D (stacked layers) */
.v3d-3dtext .layer {
  display: block;
  font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 1;
  letter-spacing: 0.02em;
  transform-origin: center center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  text-transform: none;
  user-select: none;
}

/* efecto visual frontal (gradiente + brillo) */
.v3d-3dtext .front {
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, #ffffff, #d0e8ff 35%, #ffd1f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 8px 18px rgba(0,0,0,0.25));
  padding: 0 6px;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}

/* sombra interna / borde sutil */
.v3d-3dtext .front::after {
  content: attr(data-text);
  position: absolute;
  left: 0; top: 0;
  z-index: -1;
  color: rgba(0,0,0,0.12);
  transform: translate3d(6px, 6px, -18px) rotateX(8deg);
  filter: blur(6px);
  width: 100%;
  height: 100%;
}

/* Capas traseras que simulan volumen */
.v3d-3dtext .depth {
  position: absolute;
  left: 0; top: 0;
  z-index: 1;
  color: rgba(0,0,0,0.25);
  transform-origin: left top;
  pointer-events: none;
}

/* Animaciones */
@keyframes v3d-pop {
  0%   { transform: translateY(18px) scale(0.92) rotateX(8deg); opacity: 0; }
  60%  { transform: translateY(-6px) scale(1.03) rotateX(0deg); opacity: 1; }
  100% { transform: translateY(0) scale(1) rotateX(0deg); opacity: 1; }
}

@keyframes v3d-float {
  0%   { transform: translateY(0) rotateX(0deg); }
  50%  { transform: translateY(-6px) rotateX(1deg); }
  100% { transform: translateY(0) rotateX(0deg); }
}

/* clases aplicables */
.v3d-anim-pop { animation: v3d-pop 700ms cubic-bezier(.2,.9,.2,1); }
.v3d-anim-float { animation: v3d-float 3000ms ease-in-out infinite; }

/* tamaño y estilo modificado cuando el usuario pide otra cosa */
.v3d-3dtext.small  .layer { font-size: 28px; }
.v3d-3dtext.large  .layer { font-size: 72px; }

/* para accesibilidad: ocultamos de lectores si es puramente decorativo */
.v3d-3dtext[aria-hidden="true"] { display: none; }
`;
    document.head.appendChild(style);
  }

  // Contador simple para IDs
  let _idCounter = 1;

  // Util: crea un texto 3D con capas para volumen
  function _create3DTextNode(text, opts) {
    opts = opts || {};
    const id = "v3d-txt-" + (_idCounter++);
    const wrapper = document.createElement("div");
    wrapper.className = "v3d-3dtext v3d-anim-pop v3d-anim-float";
    if (opts.size === "small") wrapper.classList.add("small");
    if (opts.size === "large") wrapper.classList.add("large");
    wrapper.style.pointerEvents = opts.pointerEvents ? "auto" : "none";
    wrapper.style.margin = opts.margin || "0";

    // establecer transformación de conjunto (opcional)
    if (opts.rotateY) wrapper.style.transform = `rotateY(${opts.rotateY}deg)`;
    if (opts.scale) wrapper.style.transform += ` scale(${opts.scale})`;

    // front (este es el texto principal con gradiente)
    const front = document.createElement("span");
    front.className = "layer front";
    front.setAttribute("data-text", text);
    front.textContent = text;
    if (opts.fontSize) front.style.fontSize = opts.fontSize + "px";
    if (opts.fontFamily) front.style.fontFamily = opts.fontFamily;
    if (opts.textTransform) front.style.textTransform = opts.textTransform;
    if (opts.ariaHidden) wrapper.setAttribute("aria-hidden", "true");

    // crear N capas de "profundidad" (depth) - se posicionan ligeramente hacia atrás
    const depthCount = typeof opts.depth === "number" ? Math.max(1, opts.depth) : 6;
    const depthGap = typeof opts.depthGap === "number" ? opts.depthGap : 2; // px por capa
    for (let i = 0; i < depthCount; i++) {
      const depth = document.createElement("span");
      depth.className = "layer depth";
      depth.textContent = text;
      // mayor índice -> más profundo (más atrás)
      const z = - (i + 1) * depthGap;
      depth.style.transform = `translate3d(${(i + 1) * 0.6}px, ${(i + 1) * 0.4}px, ${z}px) rotateX(${2 + i * 0.2}deg)`;
      depth.style.opacity = String(Math.max(0, 0.26 - i * 0.03));
      if (opts.fontSize) depth.style.fontSize = opts.fontSize + "px";
      wrapper.appendChild(depth);
    }

    wrapper.appendChild(front);
    wrapper.id = id;

    // Animación de entrada: opcionalmente podemos eliminar la clase 'v3d-anim-pop' después
    setTimeout(() => {
      wrapper.classList.remove("v3d-anim-pop");
    }, 900);

    return { node: wrapper, id };
  }

  // API pública: crea texto en el centro
  // textocentro(text, options)
  // Opciones disponibles:
  //  - size: "small"|"large"
  //  - depth: número de capas (por defecto 6)
  //  - depthGap: px entre capas
  //  - fontSize: número (px)
  //  - rotateY, scale, margin, pointerEvents
  function textocentro(text, options) {
    if (typeof text !== "string" && typeof text !== "number") text = String(text);
    options = options || {};
    const created = _create3DTextNode(text, options);
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

  // Borra todos los textos creados por esta librería
  function clearTextosCentro() {
    // eliminar hijos del contenedor
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  // Borra un texto específico por id (si lo quieres)
  function removeTextById(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // Exponer API en window para que otros bloques JS la llamen fácilmente
  window.textocentro = textocentro;
  window.clearTextosCentro = clearTextosCentro;
  window.removeTextocentroById = removeTextById;

  // Extra: función para crear varios textos con pequeño offset (útil para debugging)
  window.textocentroMulti = function (arr, opts) {
    // arr: array de strings
    opts = opts || {};
    const ids = [];
    arr.forEach((t, i) => {
      const localOpts = Object.assign({}, opts);
      // desplazar verticalmente cada texto
      localOpts.margin = (i * (opts.stackGap || 64)) + "px 0 0 0";
      ids.push(textocentro(t, localOpts));
    });
    return ids;
  };

  // Mensaje en consola para desarrolladores (opcional)
  if (window.console && window.console.log) {
    console.log("%c[v3d-textocentro] listo — llama a textocentro('hola');", "color: #0b7dda; font-weight:600;");
  }
})();
