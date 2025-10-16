// forceRotateMobile.js
// Obliga a girar el móvil a horizontal mostrando una imagen personalizada.
// Uso: import('./forceRotateMobile.js').then(m => m.default(app));

export default function initForceRotate(app) {
  const MOBILE_REGEX = /Mobi|Android|iPhone|iPad|iPod|Tablet/i;
  const isMobileDevice = () => MOBILE_REGEX.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;

  const overlayId = 'v3d-force-rotate-overlay';
  if (document.getElementById(overlayId)) return;

  const overlay = document.createElement('div');
  overlay.id = overlayId;

  // 🔽 Cambia la ruta de la imagen aquí:
  const IMAGE_URL = '../img/rotacion.png'; // <-- reemplaza con tu imagen (ruta o URL)

  overlay.innerHTML = `
    <div class="v3d-rotate-inner">
      <img class="v3d-rotate-image" src="${IMAGE_URL}" alt="Gira tu dispositivo" />
      <div class="v3d-rotate-title">Gira tu dispositivo</div>
      <div class="v3d-rotate-sub">Por favor rota a modo horizontal para continuar</div>
      <button class="v3d-rotate-btn" aria-label="Intentar bloquear orientación">
        Intentar bloquear orientación
      </button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #${overlayId} {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      background: rgba(0,0,0,0.9);
      color: #fff;
      -webkit-user-select: none;
      user-select: none;
      touch-action: none;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    #${overlayId} .v3d-rotate-inner {
      text-align: center;
      max-width: 420px;
      padding: 24px;
      border-radius: 12px;
    }
    #${overlayId} .v3d-rotate-image {
      width: 120px;
      height: auto;
      margin-bottom: 16px;
      animation: rotateHint 2.5s infinite ease-in-out;
      filter: drop-shadow(0 0 8px rgba(255,255,255,0.4));
    }
    @keyframes rotateHint {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(90deg); }
    }
    #${overlayId} .v3d-rotate-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    #${overlayId} .v3d-rotate-sub {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 14px;
    }
    #${overlayId} .v3d-rotate-btn {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: white;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    #${overlayId} .v3d-rotate-btn:active {
      transform: translateY(1px);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  const tryLockOrientation = async () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      } else if (screen.lockOrientation) {
        screen.lockOrientation('landscape');
      }
    } catch (e) {
      // No pasa nada si falla
    }
  };

  const canvas = (app && app.renderer && app.renderer.domElement) ? app.renderer.domElement : document.querySelector('canvas');
  let lastCanvasDisplay = null;

  const showOverlay = () => {
    overlay.style.display = 'flex';
    if (canvas) {
      lastCanvasDisplay = canvas.style.display || '';
      canvas.style.pointerEvents = 'none';
      canvas.style.filter = 'blur(2px) brightness(0.6)';
    }
  };

  const hideOverlay = () => {
    overlay.style.display = 'none';
    if (canvas) {
      canvas.style.pointerEvents = '';
      canvas.style.filter = '';
      if (lastCanvasDisplay !== null) canvas.style.display = lastCanvasDisplay;
    }
  };

  const checkOrientation = () => {
    const isMobile = isMobileDevice();
    const portrait = window.innerHeight > window.innerWidth;
    if (isMobile && portrait) {
      showOverlay();
    } else {
      hideOverlay();
    }
  };

  overlay.querySelector('.v3d-rotate-btn').addEventListener('click', async () => {
    await tryLockOrientation();
    setTimeout(checkOrientation, 400);
  });

  window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 250));
  window.addEventListener('resize', () => requestAnimationFrame(checkOrientation));

  checkOrientation();

  return { show: showOverlay, hide: hideOverlay, check: checkOrientation, tryLockOrientation };
}

if (typeof window !== 'undefined' && window.app) {
  setTimeout(() => {
    try { initForceRotate(window.app); } catch (e) {}
  }, 200);
}
