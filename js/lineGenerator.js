function positionOnSphere(lat, lon, radius) {
    var phi   = (90-lat)*(Math.PI/180),
        theta = (lon+180)*(Math.PI/180),
        x = -((radius) * Math.sin(phi)*Math.cos(theta)),
        z = ((radius) * Math.sin(phi)*Math.sin(theta)),
        y = ((radius) * Math.cos(phi));

    return new THREE.Vector3(x,y,z);
}


function LineGenerator(radius, scene) {
    this.sphereRadius = radius;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
}

LineGenerator.prototype.generateLine = function (lat1, lon1, lat2, lon2, color) {
    // var dotGeometry = new THREE.Geometry();
    // dotGeometry.vertices.push(positionOnSphere(lat,lon,this.sphereRadius));
    // var dotMaterial = new THREE.PointsMaterial( { size: 10, sizeAttenuation: false } );
    // var dot = new THREE.Points( dotGeometry, dotMaterial );
    // this.scene.add( dot );

    var startPosition = positionOnSphere(lat1,lon1,this.sphereRadius);
    var endPosition = positionOnSphere(lat2,lon2,this.sphereRadius);

    //create curve to get center of the line
    var calculateCurve = new THREE.LineCurve3(startPosition,endPosition);
    var middlePosition = calculateCurve.getPoint(0.5);

    //find position of centre on sphere with raycasting
    this.raycaster = new THREE.Raycaster();
    this.raycaster.set(this.scene.getWorldPosition(),middlePosition.normalize());
    var intersects = this.raycaster.intersectObject(this.scene,false);
    if (intersects.length > 0) {
        //position on sphere of the center of line
        middlePosition.copy(intersects[0].point);
        //move it litle above sphere
        var moveVector = new THREE.Vector3().copy(middlePosition);
        moveVector.normalize().multiplyScalar(10);
        middlePosition.add(moveVector);
    }
    var curve = new THREE.QuadraticBezierCurve3(
        startPosition,
        middlePosition,
        endPosition
    );
    //CREATE THE LINE
    //get three.js like
    var points = curve.getPoints( 18 );
    /*
    var color = new THREE.Color( 0xff0000 );


    var pointsArray = [];
    var colors = [];

    for (var i =0; i < points.length; i++) {
        pointsArray.push(points[i].x,points[i].y,points[i].z);
        colors.push(color.r,color.g,color.b);
    }

    var geometryL = new THREE.LineGeometry();
    geometryL.setPositions( pointsArray );
    geometryL.setColors(colors);

    var materialL = new THREE.LineMaterial( {
        color: 0xffffff,
        linewidth: 1, // in pixels
        vertexColors: THREE.VertexColors,
        //resolution:  // to be set by renderer, eventually
        dashed: false
    }  );
    materialL.resolution.set( window.innerWidth, window.innerHeight );

    var curveObject = new THREE.Line2( geometryL, materialL );
    curveObject.computeLineDistances();
    curveObject.scale.set( 1, 1, 1 );
    this.scene.add(curveObject);*/

    var geometryL = new THREE.BufferGeometry().setFromPoints( points );

    var materialL = new THREE.LineBasicMaterial( { color : color } );
    var curveObject = new THREE.Line( geometryL, materialL );
    this.scene.add(curveObject);

    //NOTICE that objects are added to sphere and not to scene, maybe i the furure we will need update positions
};

LineGenerator.prototype.generateLines = function (array, color) {
    for (var i = 0; i < array.length-1; i++) {

        console.log(array[i]);
        //console.log(array[i]);
        this.generateLine(array[i].lat,array[i].lng,array[i+1].lat,array[i+1].lng,color);
    }
};