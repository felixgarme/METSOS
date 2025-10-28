/**
 * v3d-ondas3d-robusto.js
 * Uso:
 *   crearOndas3d("polySurface1105");
 *   eliminarOndas3d("polySurface1105"); // opcional: elimina solo las ondas de ese objeto
 *   eliminarOndas3d(); // elimina todas las ondas
 *
 * Características:
 *  - Reintenta búsqueda si app u objeto no están listos
 *  - No duplica grupos de ondas por objeto
 *  - Actualiza posición de ondas si el objeto se mueve
 *  - Limpia recursos (geometría/material.dispose)
 */
(function () {
  if (window.__v3d_ondas3d_robusto_inited) return;
  window.__v3d_ondas3d_robusto_inited = true;

  // --- Config global ---
  const defaultOptions = {
    color: 0x00ff66,
    duracion: 2.2,     // segundos por ciclo
    numOndas: 3,
    radioInicial: 0.2, // metros (o unidades de la escena)
    radioFinal: 2.2,
    segmentos: 64,
    gapOffset: 0.35,   // desplazamiento entre cada onda (fraccional de duración)
    yOffset: 0.01      // pequeño offset en Y para evitar z-fighting con la superficie
  };

  let appRef = null;
  const gruposOndas = new Map(); // key = nombreObjeto, value = { group, createdAt, options, rings:[] }
  let rafId = null;

  // Detectar app Verge3D / Three.js
  function getApp() {
    if (appRef && appRef.scene) return appRef;
    if (window.app && window.app.scene) { appRef = window.app; return appRef; }
    if (window.v3d && v3d.apps && v3d.apps.size > 0) { appRef = Array.from(v3d.apps.values())[0]; return appRef; }
    return null;
  }

  // Espera hasta que la app esté lista (promesa simple)
  function ensureAppReady(timeout = 8000) {
    return new Promise((resolve) => {
      const start = performance.now();
      (function check() {
        const app = getApp();
        if (app) return resolve(app);
        if (performance.now() - start > timeout) return resolve(null);
        setTimeout(check, 300);
      })();
    });
  }

  // Crea un RingGeometry con orientación horizontal (plano XZ)
  function crearRingGeometry(innerRadius, outerRadius, segments) {
    // THREE.RingGeometry(inner, outer, segments)
    try {
      return new v3d.RingGeometry(innerRadius, outerRadius, segments);
    } catch (e) {
      // fallback en caso de ausencia de v3d (muy raro)
      console.error("[ondas3d] Error creando RingGeometry:", e);
      return null;
    }
  }

  // Crea grupo de ondas para un objeto (si ya existe, no hace nada)
  async function crearOndas3d(nombreObjeto, opciones = {}) {
    const merged = Object.assign({}, defaultOptions, opciones);

    // esperar app
    const app = await ensureAppReady();
    if (!app) {
      console.warn("[ondas3d] No se pudo encontrar la app de Verge3D en el tiempo esperado.");
      return;
    }

    // si ya hay un grupo para ese objeto, evitamos duplicados
    if (gruposOndas.has(nombreObjeto)) {
      console.log(`[ondas3d] Ya existen ondas para "${nombreObjeto}", no se duplicarán.`);
      return;
    }

    // buscar objeto (si no existe, reintentar hasta encontrarlo N veces)
    const obj = await encontrarObjetoConReintentos(app.scene, nombreObjeto, 10, 500);
    if (!obj) {
      console.warn(`[ondas3d] Objeto "${nombreObjeto}" no encontrado en la escena.`);
      return;
    }

    // construir grupo
    const group = new v3d.Group();
    group.name = `ondas_group_${nombreObjeto}_${Date.now()}`;
    app.scene.add(group);

    const rings = [];

    for (let i = 0; i < merged.numOndas; i++) {
      const inner = merged.radioInicial * 0.9;
      const outer = merged.radioInicial * 1.02; // we scale the mesh later
      const geom = crearRingGeometry(inner, outer, merged.segmentos);
      if (!geom) continue;

      const mat = new v3d.MeshBasicMaterial({
        color: merged.color,
        transparent: true,
        opacity: 0.45,
        side: v3d.DoubleSide,
        depthWrite: false
      });

      const mesh = new v3d.Mesh(geom, mat);
      // colocamos inicialmente en (0,0,0) del grupo; actualizaremos posición cada frame
      mesh.rotation.x = -Math.PI / 2; // plano XZ
      mesh.userData = {
        startOffset: i * merged.gapOffset * merged.duracion, // segundos
        duracion: merged.duracion,
        radioInicial: merged.radioInicial,
        radioFinal: merged.radioFinal
      };

      // aumentar renderOrder para evitar recortes por otras mallas (ajustable)
      mesh.renderOrder = 9999;

      group.add(mesh);
      rings.push(mesh);
    }

    gruposOndas.set(nombreObjeto, {
      group,
      targetObject: obj,
      createdAt: Date.now(),
      options: merged,
      rings
    });

    // asegurar loop de animación
    if (!rafId) startLoop(app);

    console.log(`[ondas3d] Grupo de ondas creado para "${nombreObjeto}".`);
    return group;
  }

  // Encuentra objeto con reintentos
  function encontrarObjetoConReintentos(scene, nombre, maxAttempts = 8, delayMs = 400) {
    return new Promise((resolve) => {
      let attempts = 0;
      (function intento() {
        attempts++;
        const found = scene.getObjectByName(nombre);
        if (found) return resolve(found);
        if (attempts >= maxAttempts) return resolve(null);
        setTimeout(intento, delayMs);
      })();
    });
  }

  // Eliminar ondas: si se pasa nombre elimina solo ese grupo, si no elimina todo
  function eliminarOndas3d(nombreObjeto) {
    const app = getApp();
    if (!app) {
      console.warn("[ondas3d] App no encontrada al intentar eliminar ondas.");
      return;
    }

    if (typeof nombreObjeto === 'string') {
      const info = gruposOndas.get(nombreObjeto);
      if (!info) { console.log(`[ondas3d] No hay ondas para "${nombreObjeto}".`); return; }
      limpiarGrupo(info);
      gruposOndas.delete(nombreObjeto);
      console.log(`[ondas3d] Ondas eliminadas para "${nombreObjeto}".`);
    } else {
      // eliminar todo
      gruposOndas.forEach((info, key) => {
        limpiarGrupo(info);
      });
      gruposOndas.clear();
      console.log("[ondas3d] Todas las ondas eliminadas.");
    }

    // si no quedan grupos, parar loop
    if (gruposOndas.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // limpiar un grupo (remover del scene y dispose de geometría/material)
  function limpiarGrupo(info) {
    try {
      if (info.group && info.group.parent) info.group.parent.remove(info.group);
      if (info.rings && info.rings.length) {
        info.rings.forEach(r => {
          if (r.geometry) r.geometry.dispose();
          if (r.material) r.material.dispose();
        });
      }
    } catch (e) {
      console.error("[ondas3d] Error limpiando grupo:", e);
    }
  }

  // Loop global de animación: actualiza posición/escala/opacidad de cada anillo
  function startLoop(app) {
    const clock = new v3d.Clock();

    function loop() {
      // si la app desaparece, parar
      if (!getApp()) { rafId = null; return; }

      const now = clock.getElapsedTime();

      // actualizar cada grupo
      gruposOndas.forEach((info, nombre) => {
        const target = info.targetObject;
        if (!target) return;
        // obtener posición mundial del target (para seguir movimientos)
        const worldPos = new v3d.Vector3();
        target.getWorldPosition(worldPos);

        // opcional: si target tiene bounding box, podemos elevar las ondas a la altura del centro
        // pero por ahora colocamos las ondas justo sobre worldPos con pequeño offset Y
        const yOffset = info.options.yOffset || 0.01;
        info.group.position.set(worldPos.x, worldPos.y + yOffset, worldPos.z);

        // actualizar cada anillo
        info.rings.forEach((ring) => {
          const ud = ring.userData;
          // tiempo relativo al offset
          const t = (now - (ud.startOffset || 0));
          // normalizar entre 0 y duracion
          const prog = ((t % ud.duracion) / ud.duracion + ud.duracion) % ud.duracion / ud.duracion;
          // ease out curve (suave)
          const ease = 1 - Math.pow(1 - prog, 2); // simple easeOutQuad
          const scale = ud.radioInicial + (ud.radioFinal - ud.radioInicial) * ease;
          ring.scale.set(scale, scale, scale);
          // opacidad decrece con prog
          if (ring.material && ring.material.transparent) {
            ring.material.opacity = Math.max(0, 0.45 * (1 - ease));
          }
        });
      });

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
  }

  // Exponer API global
  window.crearOndas3d = crearOndas3d;
  window.eliminarOndas3d = eliminarOndas3d;

  console.log("%c[ondas3d-robusto] listo. Usa crearOndas3d('polySurface1105');", "color:#0bda8a;font-weight:700;");
})();
