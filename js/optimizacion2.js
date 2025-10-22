function updateFrustumCulling() {
	const cam = app.camera;
		// Crear el frustum de la cámara
		const frustum = new v3d.Frustum();
		const camMatrix = new v3d.Matrix4().multiplyMatrices(
		cam.projectionMatrix,
		cam.matrixWorldInverse
		);
		frustum.setFromProjectionMatrix(camMatrix);
		// Recorre todos los objetos relevantes
		app.scene.traverse(obj => {
		if (obj.isMesh) {
		// Habilitar frustum culling
		obj.frustumCulled = true;
		// Chequear si el objeto está dentro del frustum
		const boundingBox = new v3d.Box3().setFromObject(obj);
		obj.visible = frustum.intersectsBox(boundingBox);
		}
	});
}
// Ejecutar cada frame
app.addEventListener('afterRender', updateFrustumCulling);