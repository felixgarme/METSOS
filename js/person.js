// Pega esto dentro de: function runCode(app, puzzles) { ... }
// o dentro del editor del puzzle "Exec Script".
(function(app){
    // parámetros
    const SPEED = 2.0; // unidades por segundo (ajusta a tu escala)
    const personName = "person";

    // obtener el objeto
    const person = app.scene.getObjectByName(personName);
    if (!person) {
        console.warn("Objeto no encontrado:", personName);
        return;
    }

    // estado de teclas
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    // listeners de teclado
    window.addEventListener('keydown', (e) => {
        if (e.key in keys) {
            keys[e.key] = true;
            // prevenir scrolling de la página si quieres:
            e.preventDefault();
        }
    }, false);

    window.addEventListener('keyup', (e) => {
        if (e.key in keys) {
            keys[e.key] = false;
            e.preventDefault();
        }
    }, false);

    // función que se ejecuta cada frame
    app.renderCallbacks.push(function() {
        // dt = tiempo desde el último frame (segundos)
        const dt = app.elapsed || 0.016; // app.elapsed está disponible en App. :contentReference[oaicite:1]{index=1}

        // vector de movimiento en espacio local X/Z
        const move = new v3d.Vector3(0, 0, 0);

        if (keys.ArrowUp)    move.z -= 1;
        if (keys.ArrowDown)  move.z += 1;
        if (keys.ArrowLeft)  move.x -= 1;
        if (keys.ArrowRight) move.x += 1;

        if (move.x !== 0 || move.z !== 0) {
            move.normalize();
            move.multiplyScalar(SPEED * dt);

            // si quieres mover en el espacio del mundo en vez del local:
            // person.position.add(move);
            // Para mover relativo a la orientación del objeto/cámara, transforma el vector:
            // person.localToWorld(move)  -- ojo, adaptalo según necesidad.

            person.position.add(move);
            person.updateMatrixWorld(true);
        }
    });

})(app);
