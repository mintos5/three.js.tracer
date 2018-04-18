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

LineGenerator.prototype.removeAll = function () {

};

LineGenerator.prototype.removeLine = function (lineName) {

};

LineGenerator.prototype.generateLine = function (lat1, lon1, lat2, lon2, color) {

    //todo add path name to the line and test for points and text

    // var dotGeometry = new THREE.Geometry();
    // dotGeometry.vertices.push(positionOnSphere(lat1,lon1,this.sphereRadius));
    // var dotMaterial = new THREE.PointsMaterial( { size: 10, sizeAttenuation: false } );
    // var dot = new THREE.Points( dotGeometry, dotMaterial );
    // this.scene.add( dot );

    var startPosition = positionOnSphere(lat1,lon1,this.sphereRadius);
    var endPosition = positionOnSphere(lat2,lon2,this.sphereRadius);

    //create curve to get center of the line
    var calculateCurve = new THREE.LineCurve3(startPosition,endPosition);
    var middlePosition = calculateCurve.getPoint(0.5);
    console.log(middlePosition);
    var traceLenght = calculateCurve.getLength();

    //find position of centre on sphere with raycasting
    this.raycaster = new THREE.Raycaster();
    this.raycaster.set(this.scene.getWorldPosition(),middlePosition.normalize());
    var intersects = this.raycaster.intersectObject(this.scene,false);
    if (intersects.length > 0) {
        //position on sphere of the center of line
        middlePosition.copy(this.scene.worldToLocal(intersects[0].point));
        //move it litle above sphere
        var moveVector = new THREE.Vector3().copy(middlePosition);
        moveVector.normalize().multiplyScalar(0.8*traceLenght);
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

    var geometryL = new THREE.BufferGeometry().setFromPoints( points );

    var materialL = new THREE.LineBasicMaterial( { color : color } );
    var curveObject = new THREE.Line( geometryL, materialL );
    this.scene.add(curveObject);

    //NOTICE that objects are added to sphere and not to scene, maybe i the furure we will need update positions
};

LineGenerator.prototype.generateLines = function (path, color, text, point) {
    for (var i = 0; i < path.addresses.length-1; i++) {

        //console.log(array[i]);
        this.generateLine(Number(path.addresses[i].lat),Number(path.addresses[i].lng),
            Number(path.addresses[i+1].lat),Number(path.addresses[i+1].lng),color);
    }
};