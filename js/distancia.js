app.scene.traverse(function(obj){
    if (obj.isCamera) {
        obj.near = 0.1;
        obj.far = 10000; // aumenta este valor
        obj.updateProjectionMatrix();
    }
});
