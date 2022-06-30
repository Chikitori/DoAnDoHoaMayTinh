export{createSphere}

function createSphere(r=1, lats = 30, longs = 30, latss = 0, longss = 0, wireframe = false, cx= 0, cy = 0, cz = 0, lr = true, color = 0xffffff){
    const sphere = new THREE.BufferGeometry();
    const texture = new THREE.TextureLoader().load('../Image/ComGa.jpg', 
        function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 1 );
            texture.repeat.set( 1, 1 );
    } );
   
    const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        wireframe: wireframe,
        map: texture 
    });
    var vertices = [];
    var M_PI = Math.PI;
    if(lr)
        for(var i = 0; i <= lats - latss; i++) {
            var lat0 = M_PI * (-0.5 + (i - 1) / lats);
            var z0  = r * Math.sin(lat0);
            var zr0 =  r * Math.cos(lat0);
            var lat1 = M_PI * (-0.5 + i / lats);
            var z1 = r * Math.sin(lat1);
            var zr1 = r * Math.cos(lat1);  
            for(var j = 0; j <=  longs - longss; j++) {
                var lng = 2 * M_PI * (j - 1) / longs;
                var olng = 2 * M_PI * (j - 2) / longs;
                var x = r * Math.cos(lng);
                var y = r * Math.sin(lng);
                var ox = r * Math.cos(olng);
                var oy = r * Math.sin(olng);
                vertices.push(x*zr0,y*zr0,z0,  x*zr1,y*zr1,z1,   ox*zr1,oy*zr1,z1);
                vertices.push(ox*zr0,oy*zr0,z0,  ox*zr1,oy*zr1,z1,  x*zr0,y*zr0,z0);
            }    
        }
    else 
        for(var i = lats; i >=  lats - latss ; i--) {
            var lat0 = M_PI * (-0.5 + (i + 1) / lats);
            var z0  = r * Math.sin(lat0);
            var zr0 =  r * Math.cos(lat0);
            var lat1 = M_PI * (-0.5 + i / lats);
            var z1 = r * Math.sin(lat1);
            var zr1 = r * Math.cos(lat1);  
            for(var j = 0; j <= longs - longss; j++) {
                var lng = 2 * M_PI * (j - 1) / longs;
                var olng = 2 * M_PI * (j - 2) / longs;
                var x = r * Math.cos(lng);
                var y = r * Math.sin(lng);
                var ox = r * Math.cos(olng);
                var oy = r * Math.sin(olng);
                vertices.push(x*zr0,y*zr0,z0,  x*zr1,y*zr1,z1,   ox*zr1,oy*zr1,z1);
                vertices.push(ox*zr0,oy*zr0,z0,  ox*zr1,oy*zr1,z1,  x*zr0,y*zr0,z0);
            }    
        }

    for(var i = 0; i < vertices.length; i++){
        if(i % 3 == 0 )
            vertices[i] += cx;
        if(i % 3 == 1)
            vertices[i] += cy;
        if(i % 3 == 2)
            vertices[i] += cz;
    }
    const b = vertices.map(function(x) {return x;});
    sphere.setAttribute("position", new THREE.Float32BufferAttribute(b, 3));
    const mesh = new THREE.Mesh(sphere, material);
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    return mesh;
}