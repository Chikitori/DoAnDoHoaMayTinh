export{createCone}

function createCone(scale = 1, cx=0,cy=0,cz=0, r = 10, h = 10, step = 100) {
    const Cone = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial({
        color:0xffffff,
        side: THREE.DoubleSide,
        // wireframe: true,
    });
    const vertices = [];
    for (var i = 0; i <= step; i++){
        var nx = r*Math.cos(i*2*Math.PI/step);
        var ny = r*Math.sin(i*2*Math.PI/step);
        var ox = r*Math.cos((i-1)*2*Math.PI/step);
        var oy = r*Math.sin((i-1)*2*Math.PI/step);
        var oz = 0;
        vertices.push(cx + 0, cy + 0, cz + 0, cx+ nx, cy+ 0,cz + ny, cx + ox, cy +oz,  cz+oy);
    }
    for (var i = 0; i <= step; i++){
        var nx = r*Math.cos(i*2*Math.PI/step);
        var ny = r*Math.sin(i*2*Math.PI/step);
        var ox = r*Math.cos((i-1)*2*Math.PI/step);
        var oy = r*Math.sin((i-1)*2*Math.PI/step);
        var oz = 0;
        vertices.push(cx + 0, cy + h, cz + 0, cx+ nx,cy + 0, cz+ ny, cx + ox, cy + oz, cz + oy);
    }
    const b = vertices.map(function(x) {return x * scale;});
    Cone.setAttribute("position", new THREE.Float32BufferAttribute(b, 3));
    const mesh = new THREE.Mesh(Cone, material);
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    return mesh;
}