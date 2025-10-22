// === LookOnlyControls Manager para Verge3D ===
// - No fullscreen
// - Sin movimiento (solo mirar)
// - Sin zoom de rueda
// - Se controla mediante window.LookOnlyControls.enable()/disable()/toggle()

(function () {
    if (!window || !app) {
        console.warn("LookOnlyControls: 'app' no está disponible.");
        return;
    }
    // No recrear si ya existe
    if (window.LookOnlyControls) return;

    var defaultContainer = app.container || (app.renderer && app.renderer.domElement) || document.body;

    var manager = {
        enabled: false,
        _savedControls: null,
        _savedControlsEnabled: null,
        _lookControls: null,
        _keyPreventHandler: null, // <--- Añadido para claridad
        _wheelPreventHandler: null, // <--- Añadido
        params: {
            lookSpeed: 0.15,        // sensibilidad del ratón
            movementSpeed: 0,       // 0 para desactivar movimiento
            noFly: true,            // no volar
            lookVertical: true,     // permitir mirar arriba/abajo
            activeLook: true,
            constrainVertical: true,
            verticalMin: -Math.PI/2 + 0.01, // límites razonables (-89°)
            verticalMax: Math.PI/2 - 0.01   // (89°)
        },

        enable: function (opts) {
            if (this.enabled) return;
            opts = opts || {};
            Object.assign(this.params, opts);

            // Guardar controles originales
            this._savedControls = app.controls || null;
            this._savedControlsEnabled = this._savedControls ? this._savedControls.enabled : null;
            if (this._savedControls) {
                try { this._savedControls.enabled = false; } catch (e) {}
            }

            // Preferimos v3d.FirstPersonControls si está disponible
            if (v3d && v3d.FirstPersonControls) {
                try {
                    this._lookControls = new v3d.FirstPersonControls(app.camera, defaultContainer);

                    // Aplicar parámetros: MOVIMIENTO = 0 para evitar moverse
                    this._lookControls.lookSpeed = this.params.lookSpeed;
                    this._lookControls.movementSpeed = this.params.movementSpeed; // 0 -> no mover
                    this._lookControls.noFly = !!this.params.noFly;
                    this._lookControls.lookVertical = !!this.params.lookVertical;
                    this._lookControls.activeLook = !!this.params.activeLook;
                    this._lookControls.constrainVertical = !!this.params.constrainVertical;
                    if (this._lookControls.constrainVertical) {
                        this._lookControls.verticalMin = this.params.verticalMin;
                        this._lookControls.verticalMax = this.params.verticalMax;
                    }
                    
                    app.controls = this._lookControls;
                    try { this._lookControls.enabled = true; } catch (e) {}
                } catch (err) {
                    console.error("LookOnlyControls: error creando FirstPersonControls", err);
                    if (this._savedControls) {
                        try { this._savedControls.enabled = this._savedControlsEnabled; app.controls = this._savedControls; } catch(e){}
                    }
                    return;
                }
            } else {
                // Fallback: si no está FirstPersonControls, intentar OrbitControls
                if (v3d && v3d.OrbitControls) {
                    try {
                        var orbit = new v3d.OrbitControls(app.camera, defaultContainer);
                        orbit.enableRotate = true;
                        orbit.enablePan = false;
                        orbit.enableZoom = false; // <-- Esto ya deshabilita el zoom en OrbitControls

                        if (typeof orbit.enableKeys !== 'undefined') {
                            orbit.enableKeys = false;
                        }
                        if (typeof orbit.enableKeyboardControls !== 'undefined') {
                            orbit.enableKeyboardControls = false;
                        }
                        orbit.keyPanSpeed = 0;
                        
                        orbit.rotateSpeed = this.params.lookSpeed * 10;
                        orbit.target.copy(app.camera.position).add(new v3d.Vector3(0,0,-1));
                        orbit.update();

                        this._lookControls = orbit;
                        app.controls = this._lookControls;
                        try { this._lookControls.enabled = true; } catch (e) {}
                    } catch (err) {
                        console.error("LookOnlyControls: fallback OrbitControls falló", err);
                        if (this._savedControls) {
                            try { this._savedControls.enabled = this._savedControlsEnabled; app.controls = this._savedControls; } catch(e){}
                        }
                        return;
                    }
                } else {
                    console.error("LookOnlyControls: no se encontró FirstPersonControls ni OrbitControls.");
                    if (this._savedControls) {
                        try { this._savedControls.enabled = this._savedControlsEnabled; app.controls = this._savedControls; } catch(e){}
                    }
                    return;
                }
            }

            // Evitar que las teclas W/A/S/D/Arrow... muevan la cámara O la página
            this._keyPreventHandler = function (e) {
                var keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space'];
                if (keys.indexOf(e.code) !== -1) {
                    e.preventDefault(); // Detener la acción del navegador (scroll)
                    e.stopPropagation(); // Detener la propagación al listener de FirstPersonControls
                }
            };
            // Usar { capture: true } para que este listener se ejecute PRIMERO
            window.addEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });

            // *** NUEVO: Evitar que la rueda del ratón haga scroll/zoom en la página ***
            this._wheelPreventHandler = function (e) {
                e.preventDefault(); // Detener la acción del navegador (scroll/zoom)
                e.stopPropagation(); // Detener la propagación
            };
            // Usar { capture: true } y { passive: false } para prevenir el scroll
            window.addEventListener('wheel', this._wheelPreventHandler, { capture: true, passive: false });


            this.enabled = true;
            console.log("LookOnlyControls: habilitado (solo mirar).");
        },

        disable: function () {
            if (!this.enabled) return;

            // Desactivar controles de mirar
            try {
                if (this._lookControls) {
                    this._lookControls.enabled = false;
                    if (typeof this._lookControls.dispose === 'function') {
                        try { this._lookControls.dispose(); } catch (e) {}
                    }
                }
            } catch (e) {}

            // Restaurar controles originales
            if (this._savedControls) {
                try {
                    app.controls = this._savedControls;
                    if (typeof this._savedControls.enabled !== 'undefined') this._savedControls.enabled = this._savedControlsEnabled;
                } catch (e) {
                    console.warn("LookOnlyControls: error restaurando controles originales", e);
                    app.controls = this._savedControls;
                }
            } else {
                try { app.controls = null; } catch (e) {}
            }

            // Quitar bloqueo de teclas
            if (this._keyPreventHandler) {
                window.removeEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
                this._keyPreventHandler = null;
            }

            // *** NUEVO: Quitar bloqueo de rueda del ratón ***
            if (this._wheelPreventHandler) {
                window.removeEventListener('wheel', this._wheelPreventHandler, { capture: true, passive: false });
                this._wheelPreventHandler = null;
            }

            this._lookControls = null;
            this._savedControls = null;
            this._savedControlsEnabled = null;
            this.enabled = false;
            console.log("LookOnlyControls: deshabilitado y controles originales restaurados.");
        },

        toggle: function (opts) {
            if (this.enabled) this.disable();
            else this.enable(opts);
        }
    };

    // Exponer en window para acceso desde Puzzles / consola
    window.LookOnlyControls = manager;

    // --- SECCIÓN DE TECLA 'F' ELIMINADA ---

    console.log("LookOnlyControls listo. Usa window.LookOnlyControls.enable()/disable()/toggle().");
})();