var THREE = v3d;

function onMouseClick(event) {
    if (!app || !app.scene || !app.renderer || !app.camera) return;

    // Obtener coordenadas 
    var rect = app.renderer.domElement.getBoundingClientRect();
    var mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);

    // Obtener todos los objetos 
    var objects = [];
    app.scene.traverse(function(child) {
        if (child.isMesh) {
            objects.push(child);
        }
    });

    var intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
        var object = intersects[0].object;
        var camPos = app.camera.position;
        console.log(`Hiciste clic en: ${object.name}`);
        console.log(`Posición de la cámara: X=${camPos.x.toFixed(2)}, Y=${camPos.y.toFixed(2)}, Z=${camPos.z.toFixed(2)}`);
    }
}

// Registrar el evento de clic
app.renderer.domElement.addEventListener('click', onMouseClick, false);