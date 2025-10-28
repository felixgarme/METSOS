// 1. Comprobar si los botones ya fueron creados
if (!window.botonesVACreados) {

  // A. Enlazar CSS externo (solo una vez)
  const cssId = 'v3d-pro-button-styles';
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link');
    link.id = cssId; link.rel = 'stylesheet';
    link.href = '../css/v3d-pro-button-styles.css';
    document.head.appendChild(link);
  }

  // B. Añadir CSS interno para bloqueo visual (NUEVO)
  const lockStyleId = 'v3d-lock-styles';
  if (!document.getElementById(lockStyleId)) {
    const style = document.createElement('style');
    style.id = lockStyleId;
    style.textContent = `
      /* Estilo para cuando los botones están bloqueados temporalmente */
      .v3d-buttons-locked .v3d-pro-button,
      .v3d-buttons-locked .v3d-next-button,
      .v3d-buttons-locked .v3d-prev-button {
          opacity: 0.6 !important;
          cursor: wait !important;
          pointer-events: none !important;
          transition: opacity 0.2s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Registro global
  window.v3dButtonLists = window.v3dButtonLists || {};
  window.v3dListOrder = ['VA', 'VB']; // Asegúrate que coincida con tus listas
  window.v3dCurrentListIndex = 0;

  // ⏱️ Variable global de bloqueo por delay
  window.v3dClickBloqueado = false;
  // MODIFICADO: 3000 milisegundos (3s)
  window.v3dClickDelay = 3000;

  // Crear lista genérica
  window.createV3DButtonList = function (key, cfg, opts) {
    if (!key || !Array.isArray(cfg)) return;
    const k = key.toUpperCase();
    if (window.v3dButtonLists[k]?.created) return;

    const idC = opts?.containerId || `miContenedorBotones${k}`;
    const idN = opts?.nextButtonId || `v3d-next-button-${k}`;
    const idM = opts?.mainContainerId || 'v3d-container';

    const state = {
      key: k,
      containerId: idC,
      nextButtonId: idN,
      nivelDesbloqueado: 0,
      botonesConfig: cfg.slice(),
      created: false
    };
    window.v3dButtonLists[k] = state;

    const cont = document.createElement('div');
    cont.id = idC;
    cont.classList.add('miContenedorBotones', `miContenedorBotones-${k}`);
    cont.dataset.listKey = k;
    cont.style.display = 'none';

    cfg.forEach((it, i) => {
      const b = document.createElement('button');
      b.innerText = it.texto;
      b.className = 'v3d-pro-button';
      b.dataset.index = i;
      b.dataset.listKey = k;
      if (i > state.nivelDesbloqueado) b.classList.add('disabled');
      b.onclick = () => {
        // ⏱️ Anti-click rápido
        if (window.v3dClickBloqueado) {
          console.warn('Por favor, espera un momento antes de presionar otro botón.');
          return;
        }
        if (b.classList.contains('disabled')) return;

        // MODIFICADO: Activar bloqueo visual
        window.v3dClickBloqueado = true;
        document.body.classList.add('v3d-buttons-locked');
        setTimeout(() => {
          window.v3dClickBloqueado = false;
          // MODIFICADO: Desactivar bloqueo visual
          document.body.classList.remove('v3d-buttons-locked');
        }, window.v3dClickDelay);

        const p = it.proc;
        if (window.v3d?.puzzles?.procedures?.[p]) {
          v3d.puzzles.procedures[p]();
          console.log('Procedimiento:', p);
          window.desbloquearSiguienteNivelV3D(k, i);
          window.actualizarEstadoBotonesV3D(k, i);
        } else {
          console.warn(`No se encontró el procedimiento "${p}"`);
        }
      };
      cont.appendChild(b);
    });

    // 🔹 Botones de navegación con texto
    const next = document.createElement('button'),
      prev = document.createElement('button');
    next.id = idN;
    prev.id = `v3d-prev-button-${k}`;
    next.classList.add('v3d-next-button');
    prev.classList.add('v3d-prev-button');
    next.dataset.listKey = prev.dataset.listKey = k;
    next.textContent = 'Continuar';
    prev.textContent = 'Anterior';
    next.style.display = prev.style.display = 'none';

    // ⏱️ Anti-spam también en navegación
    next.onclick = () => {
      if (window.v3dClickBloqueado) return;
      
      // MODIFICADO: Activar bloqueo visual
      window.v3dClickBloqueado = true;
      document.body.classList.add('v3d-buttons-locked');
      setTimeout(() => {
        window.v3dClickBloqueado = false;
        // MODIFICADO: Desactivar bloqueo visual
        document.body.classList.remove('v3d-buttons-locked');
      }, window.v3dClickDelay);
      
      window.nextV3DList();
    };
    prev.onclick = () => {
      if (window.v3dClickBloqueado) return;
      
      // MODIFICADO: Activar bloqueo visual
      window.v3dClickBloqueado = true;
      document.body.classList.add('v3d-buttons-locked');
      setTimeout(() => {
        window.v3dClickBloqueado = false;
        // MODIFICADO: Desactivar bloqueo visual
        document.body.classList.remove('v3d-buttons-locked');
      }, window.v3dClickDelay);
      
      window.prevV3DList();
    };

    (document.getElementById(idM) || document.body).append(cont, next, prev);
    state.created = true;
    return state;
  };

  // Actualizar botones
  window.actualizarEstadoBotonesV3D = function (k, idx) {
    k = k.toUpperCase();
    const s = window.v3dButtonLists[k];
    if (!s) return;
    const c = document.getElementById(s.containerId),
      n = document.getElementById(s.nextButtonId),
      p = document.getElementById(`v3d-prev-button-${k}`);
    if (!c || !n || !p) return;

    const btns = c.querySelectorAll('.v3d-pro-button');
    let done = true, gap = 10;
    idx ??= s.nivelDesbloqueado;
    if (idx >= btns.length) idx = btns.length - 1;

    btns.forEach((b, i) => {
      b.classList.remove('disabled', 'completed', 'active');
      if (i < s.nivelDesbloqueado) b.classList.add('completed');
      else if (i > s.nivelDesbloqueado) { b.classList.add('disabled'); done = false; }
      else done = false;
      if (i === idx) b.classList.add('active');
    });

    const act = btns[idx];
    if (act) {
      let off = 0;
      for (let i = 0; i < idx; i++) off += btns[i].offsetHeight + gap;
      c.style.transform = `translateY(-${off + act.offsetHeight / 2}px)`;
    }

    // 🔹 Mostrar “Continuar” solo si hay siguiente lista
    const curIndex = window.v3dListOrder.indexOf(k);
    const hasNext = curIndex < window.v3dListOrder.length - 1;
    n.style.display = done && hasNext ? 'flex' : 'none';
    p.style.display = curIndex > 0 ? 'flex' : 'none';
  };

  // Desbloquear siguiente nivel
  window.desbloquearSiguienteNivelV3D = function (k, i) {
    k = k.toUpperCase();
    const s = window.v3dButtonLists[k];
    if (!s) return;
    const n = i + 1;
    if (n > s.nivelDesbloqueado) s.nivelDesbloqueado = n;
  };

  // Mostrar / ocultar listas
  window.toggleBotonesV3D = function (k, show) {
    k = k.toUpperCase();
    const s = window.v3dButtonLists[k];
    if (!s) return;
    const c = document.getElementById(s.containerId),
      n = document.getElementById(s.nextButtonId),
      p = document.getElementById(`v3d-prev-button-${k}`);
    if (!c || !n || !p) return;

    if (show) {
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      window.actualizarEstadoBotonesV3D(k);

      // 🔹 Efecto delay secuencial
      [...c.getElementsByClassName('v3d-pro-button')].forEach((b, i) => {
        b.style.opacity = '0';
        b.style.transform = 'translateY(10px)';
        setTimeout(() => {
          b.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          b.style.opacity = '1';
          b.style.transform = 'translateY(0)';
        }, i * 120);
      });

      setTimeout(() => window.actualizarEstadoBotonesV3D(k), 500);
    } else {
      c.style.display = n.style.display = p.style.display = 'none';
    }
  };

  // Navegación entre listas
  window.nextV3DList = function () {
    const cur = window.v3dListOrder[window.v3dCurrentListIndex],
      nxt = window.v3dListOrder[window.v3dCurrentListIndex + 1];
    if (!nxt) return;

    // MODIFICADO: Llamar al procedimiento con el nombre de la lista destino (nxt)
    if (window.v3d?.puzzles?.procedures?.[nxt]) {
      v3d.puzzles.procedures[nxt]();
      console.log(`Procedimiento: ${nxt} (next)`);
    } else {
      console.warn(`No se encontró el procedimiento "${nxt}"`);
    }

    window.toggleBotonesV3D(cur, false);
    window.toggleBotonesV3D(nxt, true);
    window.v3dCurrentListIndex++;
  };

  // ***** CAMBIO AQUÍ *****
  window.prevV3DList = function () {
    const cur = window.v3dListOrder[window.v3dCurrentListIndex],
      prv = window.v3dListOrder[window.v3dCurrentListIndex - 1];
    if (!prv) return;

    // MODIFICADO: Ya no se llama al procedimiento al ir a "Anterior".
    // Se ha comentado el bloque que lo hacía.
    /*
    if (window.v3d?.puzzles?.procedures?.[prv]) {
      v3d.puzzles.procedures[prv]();
      console.log(`Procedimiento: ${prv} (prev)`);
    } else {
      console.warn(`No se encontró el procedimiento "${prv}"`);
    }
    */
   console.log(`Volviendo a la lista: ${prv}`);

    window.toggleBotonesV3D(cur, false);
    window.toggleBotonesV3D(prv, true);
    window.v3dCurrentListIndex--;
  };
  // ***** FIN DEL CAMBIO *****


  // Cargar listas
  const sid = 'v3d-button-lists-script';
  if (!document.getElementById(sid)) {
    const s = document.createElement('script');
    s.id = sid;
    // Asegúrate que esta ruta es correcta
    s.src = '../lists/v3d-button-lists.js'; 
    s.defer = true;
    document.body.appendChild(s);
  }

  window.botonesVACreados = true;
}