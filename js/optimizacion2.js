function updateVisibility() {
    const camPos = new v3d.Vector3();
    app.camera.getWorldPosition(camPos);

    app.scene.traverse(obj => {
        if (obj.isMesh) {
            const objPos = new v3d.Vector3();
            obj.getWorldPosition(objPos);
            const dist = camPos.distanceTo(objPos);

            obj.visible = dist < 100; // Oculta si está a más de 100 unidades
        }
    });
}

app.addEventListener('afterRender', updateVisibility);
