app.controls.addEventListener("change", function () {
    var raycaster = new v3d.Raycaster();
    var downVector = new v3d.Vector3(0, -1, 0);
    var terreno = app.scene.getObjectByName("Mesh.6847_0");

    if (!terreno) return;

    raycaster.set(app.camera.position, downVector);
    var intersects = raycaster.intersectObject(terreno, true);

    if (intersects.length > 0) {
        var groundY = intersects[0].point.y + 10;
        if (app.camera.position.y < groundY) {

            app.camera.position.y = v3d.MathUtils.lerp(app.camera.position.y, groundY, 0.3);
            app.camera.updateMatrixWorld();
        }
    } else {
        var newHeight = app.camera.position.y + 50;
        app.camera.position.y = v3d.MathUtils.lerp(app.camera.position.y, newHeight, 0.3);
        app.camera.updateMatrixWorld();
    }

});