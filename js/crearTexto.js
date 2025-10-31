(function () {
  if (window.__v3d_cardmodulo_inited) return;
  window.__v3d_cardmodulo_inited = true;

  const containerId = "v3d-cards-centro-overlay";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

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
  gap: 16px;
}

.v3d-card-wrapper {
  position: relative;
  pointer-events: auto;
  will-change: transform, opacity;
  user-select: none;
}

.v3d-card-modulo {
  background-color: #FFFFFF;
  border-radius: 0px;
  padding: 24px;
  width: 200px;
  box-shadow: 0 10px 20px #6C6C6C;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: 5%;
}

.v3d-card-circle {
  width: 120px;
  height: 120px;
  border-radius: 5%;
  background-color: #d8d8d8;

  overflow: hidden;
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
  object-fit: cover;
  backface-visibility: hidden; 
}

.v3d-card-text {
  font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color:#031795;
  text-align: center;
}

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
  animation: v3d-coin-flip-in 1000ms ease-out 200ms forwards;
}

.v3d-card-wrapper.v3d-anim-pop .v3d-card-text {
  opacity: 0;
  animation: v3d-fade-in-up 700ms ease-out 300ms forwards;
}
`;
    document.head.appendChild(style);
  }

  let _idCounter = 1;

  function _createCardNode(text, imageUrl, opts) {
    opts = opts || {};
    const id = "v3d-card-" + (_idCounter++);

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

    const card = document.createElement("div");
    card.className = "v3d-card-modulo";

    const circle = document.createElement("div");
    circle.className = "v3d-card-circle";
    const img = document.createElement("img");
    img.src = imageUrl || "https://via.placeholder.com/120/d8d8d8/888?text=IMG";
    img.alt = opts.altText || "Ilustración del módulo";
    circle.appendChild(img);

    const textEl = document.createElement("div");
    textEl.className = "v3d-card-text";
    textEl.textContent = text;

    card.appendChild(circle);
    card.appendChild(textEl);
    wrapper.appendChild(card);

    setTimeout(() => {
      wrapper.classList.remove("v3d-anim-pop");
    }, 1300); 

    return { node: wrapper, id };
  }

  function crearCardModulo(text, imageUrl, options) {
    if (typeof text !== "string" && typeof text !== "number") text = String(text);
    options = options || {};
    const created = _createCardNode(text, imageUrl, options);
    container.appendChild(created.node);

    if (options.duration && typeof options.duration === "number" && options.duration > 0) {
      setTimeout(() => {
        const el = document.getElementById(created.id);
        if (el) {
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

  function clearCardsCentro() {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function removeCardById(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  window.crearCardModulo = crearCardModulo;
  window.clearCardsCentro = clearCardsCentro;
  window.removeCardById = removeCardById;

  window.crearMultiCards = function (arr, opts) {
    opts = opts || {};
    const ids = [];
    arr.forEach((item, i) => {
      const localOpts = Object.assign({}, opts);
      localOpts.margin = (i * (opts.stackGap || 16)) + "px 0 0 0";
      ids.push(crearCardModulo(item.text, item.imageUrl, localOpts));
    });
    return ids;
  };

  if (window.console && window.console.log) {
    console.log("[v3d-card-modulo] listo — llama a crearCardModulo('Módulo 2 y 3', 'img.png');");
  }
})();