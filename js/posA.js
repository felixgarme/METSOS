// Obtener la cámara principal de la aplicación Verge3D
var cam = app.camera;

// Establecer la posición de la cámara
cam.position.set(15.36, 456.31, -55.44);

// Establecer la rotación de la cámara (en radianes)
cam.rotation.set(-1.588, -0.000, -3.137);

// Actualizar la matriz de transformación de la cámara
cam.updateMatrixWorld();
