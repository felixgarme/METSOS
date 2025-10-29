(function () {
    if (!window || !app) {
        console.warn("LookOnlyControls: 'app' no está disponible.");
        return;
    }
    if (window.LookOnlyControls) return;

    var defaultContainer = app.container || (app.renderer && app.renderer.domElement) || document.body;

    var manager = {
        enabled: false,
        _savedControls: null,
        _savedControlsEnabled: null,
        _lookControls: null,
        _keyPreventHandler: null,
        _wheelPreventHandler: null,
        params: {
            lookSpeed: 0.15,
            movementSpeed: 0,
            defaultMovementSpeed: 5.0,
            noFly: true,
            lookVertical: true,
            activeLook: true,
            constrainVertical: true,
            verticalMin: -Math.PI / 2 + 0.01,
            verticalMax: Math.PI / 2 - 0.01
        },

        enable: function (opts) {
            if (this.enabled) return;
            opts = opts || {};
            var inputSpeed = (opts && typeof opts.movementSpeed !== 'undefined') ? opts.movementSpeed : 0;
            Object.assign(this.params, opts);
            this.params.movementSpeed = inputSpeed;

            this._savedControls = app.controls || null;
            this._savedControlsEnabled = this._savedControls ? this._savedControls.enabled : null;
            if (this._savedControls) {
                try { this._savedControls.enabled = false; } catch (e) {}
            }

            if (v3d && v3d.FirstPersonControls) {
                try {
                    this._lookControls = new v3d.FirstPersonControls(app.camera, defaultContainer);
                    this._lookControls.lookSpeed = this.params.lookSpeed;
                    this._lookControls.movementSpeed = this.params.movementSpeed;
                    this._lookControls.noFly = !!this.params.noFly;
                    this._lookControls.lookVertical = !!this.params.lookVertical;
                    this._lookControls.activeLook = !!this.params.activeLook;
                    this._lookControls.constrainVertical = !!this.params.constrainVertical;
                    if (this._lookControls.constrainVertical) {
                        this._lookControls.verticalMin = this.params.verticalMin;
                        this._lookControls.verticalMax = this.params.verticalMax;
                    }
                    app.controls = this._lookControls;
                    this._lookControls.enabled = true;
                } catch (err) {
                    console.error("LookOnlyControls: error creando FirstPersonControls", err);
                    if (this._savedControls) {
                        try { 
                            this._savedControls.enabled = this._savedControlsEnabled; 
                            app.controls = this._savedControls; 
                        } catch(e){}
                    }
                    return;
                }
            } else if (v3d && v3d.OrbitControls) {
                try {
                    var orbit = new v3d.OrbitControls(app.camera, defaultContainer);
                    orbit.enableRotate = true;
                    orbit.enablePan = false;
                    orbit.enableZoom = false;
                    if (typeof orbit.enableKeys !== 'undefined') orbit.enableKeys = false;
                    if (typeof orbit.enableKeyboardControls !== 'undefined') orbit.enableKeyboardControls = false;
                    orbit.keyPanSpeed = 0;
                    orbit.rotateSpeed = this.params.lookSpeed * 10;
                    orbit.target.copy(app.camera.position).add(new v3d.Vector3(0, 0, -1));
                    orbit.update();
                    this._lookControls = orbit;
                    app.controls = this._lookControls;
                    this._lookControls.enabled = true;
                } catch (err) {
                    console.error("LookOnlyControls: fallback OrbitControls falló", err);
                    if (this._savedControls) {
                        try { 
                            this._savedControls.enabled = this._savedControlsEnabled; 
                            app.controls = this._savedControls; 
                        } catch(e){}
                    }
                    return;
                }
            } else {
                console.error("LookOnlyControls: no se encontró FirstPersonControls ni OrbitControls.");
                if (this._savedControls) {
                    try { 
                        this._savedControls.enabled = this._savedControlsEnabled; 
                        app.controls = this._savedControls; 
                    } catch(e){}
                }
                return;
            }

            this._keyPreventHandler = function (e) {
                var keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];
                if (keys.indexOf(e.code) !== -1) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            if (this.params.movementSpeed === 0) {
                window.addEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
            }

            this._wheelPreventHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };
            window.addEventListener('wheel', this._wheelPreventHandler, { capture: true, passive: false });

            this.enabled = true;
            console.log("LookOnlyControls: habilitado (solo mirar).");
        },

        disable: function () {
            if (!this.enabled) return;

            try {
                if (this._lookControls) {
                    this._lookControls.enabled = false;
                    if (typeof this._lookControls.dispose === 'function') {
                        try { this._lookControls.dispose(); } catch (e) {}
                    }
                }
            } catch (e) {}

            if (this._savedControls) {
                try {
                    app.controls = this._savedControls;
                    if (typeof this._savedControls.enabled !== 'undefined') 
                        this._savedControls.enabled = this._savedControlsEnabled;
                } catch (e) {
                    console.warn("LookOnlyControls: error restaurando controles originales", e);
                    app.controls = this._savedControls;
                }
            } else {
                try { app.controls = null; } catch (e) {}
            }

            if (this._keyPreventHandler) {
                window.removeEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
                this._keyPreventHandler = null;
            }

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
        },

        TeclasOn: function () {
            if (!this.enabled) {
                console.warn("LookOnlyControls: Debe llamar a .enable() primero.");
                return;
            }
            if (!this._lookControls || typeof this._lookControls.movementSpeed === 'undefined') {
                console.warn("LookOnlyControls: Los controles actuales no soportan 'movementSpeed'.");
                return;
            }

            var newSpeed = this.params.defaultMovementSpeed || 5.0;
            this._lookControls.movementSpeed = newSpeed;

            if (this._keyPreventHandler) {
                window.removeEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
            }
            console.log("LookOnlyControls: Movimiento con teclas ACTIVADO (velocidad " + newSpeed + ").");
        },

        TeclasOff: function () {
            if (!this.enabled) return;
            if (!this._lookControls || typeof this._lookControls.movementSpeed === 'undefined') return;

            this._lookControls.movementSpeed = 0;

            if (this._keyPreventHandler) {
                window.removeEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
                window.addEventListener('keydown', this._keyPreventHandler, { capture: true, passive: false });
            }
            console.log("LookOnlyControls: Movimiento con teclas DESACTIVADO (modo solo-mirar).");
        }
    };

    window.LookOnlyControls = manager;
    console.log("LookOnlyControls listo. Usa window.LookOnlyControls.enable()/disable()/toggle().");
})();
