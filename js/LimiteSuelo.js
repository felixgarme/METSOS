// ================================
// CONFIGURACIÓN DE VARIABLES
// ================================

// Nombre del objeto del terreno en Verge3D
var NOMBRE_TERRENO = "pPlane3"; 

// Vector de dirección hacia abajo
var DIRECCION_ABAJO = new v3d.Vector3(0, -1, 0); // Eje Y negativo

// Altura adicional sobre el terreno (en unidades del mundo)
var ALTURA_SOBRE_TERRENO = 1; // <-- distancia que la cámara se mantiene sobre el terreno

// Velocidad de interpolación para suavizar el movimiento de la cámara
var FACTOR_LERP = 1; // <-- entre 0 (sin movimiento) y 1 (instántaneo)

// ================================
// FUNCIÓN PRINCIPAL
// ================================

app.controls.addEventListener("change", function () {

    // Crear un rayo (raycaster) para detectar el terreno
    var raycaster = new v3d.Raycaster();
    var terreno = app.scene.getObjectByName(NOMBRE_TERRENO);

    // Si no se encuentra el terreno, salir
    if (!terreno) return;

    // El rayo parte desde la cámara hacia abajo
    raycaster.set(app.camera.position, DIRECCION_ABAJO);

    // Detectar intersección del rayo con el terreno
    var intersects = raycaster.intersectObject(terreno, true);

    if (intersects.length > 0) {
        // Si hay intersección, calcular la altura del terreno más la distancia deseada
        var groundY = intersects[0].point.y + ALTURA_SOBRE_TERRENO;

        // Si la cámara está por debajo de esa altura, elevarla suavemente
        if (app.camera.position.y < groundY) {
            app.camera.position.y = v3d.MathUtils.lerp(app.camera.position.y, groundY, FACTOR_LERP);
            app.camera.updateMatrixWorld();
        }

    } else {
        // Si no hay terreno debajo, elevar la cámara poco a poco
        var newHeight = app.camera.position.y + ALTURA_SOBRE_TERRENO;
        app.camera.position.y = v3d.MathUtils.lerp(app.camera.position.y, newHeight, FACTOR_LERP);
        app.camera.updateMatrixWorld();
    }

});
