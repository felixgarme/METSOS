app.scene.traverse(function(obj) {
    if (obj.isMesh && obj.material && obj.material.map) {
        const tex = obj.material.map;
        tex.anisotropy = 2; // reduce filtrado anisotrópico
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
    }
});
