var CLUSTER_SIZE = 20;

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
    this.points = {};
    this.pointsInPath = {};
    this.groups = {};
    this.styleEnum = Object.freeze({"line":1, "point":2, "sphere":3});
}

LineGenerator.prototype.removeAll = function () {
    while (this.scene.children.length)
    {
        this.scene.remove(this.scene.children[0]);
    }
    this.groups = {};
    this.points = {};
};

LineGenerator.prototype.removeLine = function (pathName) {
    this.scene.remove(this.scene.getObjectByName(pathName));
    delete this.groups[pathName];
    for (var i = this.pointsInPath[pathName].length-1; i >= 0; i--) {
        console.log("removeLine " + this.pointsInPath[pathName][i]);
        delete this.points[this.pointsInPath[pathName][i]];
    }
};

LineGenerator.prototype.generateLine = function (lat1, lon1, lat2, lon2, color, pathName, point, styleEnum) {
    //check if the path was created before
    var texlineGroup;
    if (pathName in this.groups === false) {
        texlineGroup = new THREE.Group();
        texlineGroup.name = pathName;
        this.scene.add(texlineGroup);
        this.groups[pathName] = texlineGroup;
        this.pointsInPath[pathName] = [];
    }
    else {
        texlineGroup = this.groups[pathName];
    }

    var startPosition = positionOnSphere(Number(lat1),Number(lon1),this.sphereRadius);
    var endPosition = positionOnSphere(Number(lat2),Number(lon2),this.sphereRadius);
    //add this points to hashTable, to create it only once
    if (lat1+lon1 in this.points === false) {
        if (point) {
            var geometry1 = new THREE.SphereGeometry( 0.2, 5, 5 );
            var material1 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var sphere1 = new THREE.Mesh( geometry1, material1 );
            sphere1.position.copy(startPosition);
            sphere1.name = lat1+lon1;
            texlineGroup.add(sphere1);
        }
        this.points[lat1+lon1] = {};
        this.pointsInPath[pathName].push(lat1+lon1);
    }
    if (lat2+lon2 in this.points === false) {
        if (point) {
            var geometry2 = new THREE.SphereGeometry( 0.2, 5, 5 );
            var material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var sphere2 = new THREE.Mesh( geometry2, material2 );
            sphere2.position.copy(endPosition);
            sphere2.name = lat2+lon2;
            texlineGroup.add(sphere2);
        }
        this.points[lat2+lon2] = {};
        this.pointsInPath[pathName].push(lat2+lon2);
    }
    //create curve to get center of the line
    var calculateCurve = new THREE.LineCurve3(startPosition,endPosition);
    var middlePosition = calculateCurve.getPoint(0.5);
    //console.log(middlePosition);
    var traceLenght = calculateCurve.getLength();

    //find position of centre on sphere with raycasting
    this.raycaster = new THREE.Raycaster();
    var tempVector = this.scene.localToWorld(middlePosition);
    this.raycaster.set(this.scene.getWorldPosition(),tempVector.normalize());
    var intersects = this.raycaster.intersectObject(this.scene,false);
    if (intersects.length > 0) {
        //position on sphere of the center of line
        middlePosition.copy(this.scene.worldToLocal(intersects[0].point));
        //move it litle above sphere
        var moveVector = new THREE.Vector3().copy(middlePosition);
        moveVector.normalize().multiplyScalar(0.5*traceLenght);
        //add randomness to the middlePosition
        var randomVector = new THREE.Vector3(Math.random(),Math.random(),Math.random());
        middlePosition.add(randomVector);
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

    if (styleEnum === this.styleEnum.line) {
        var geometryL = new THREE.BufferGeometry().setFromPoints( points );
        var materialL = new THREE.LineBasicMaterial( { color : color } );
        var curveObject = new THREE.Line( geometryL, materialL );
        texlineGroup.add(curveObject);
    }
    if (styleEnum === this.styleEnum.point) {
        for (var i = 0; i< 19;i++) {
            var dotGeometry = new THREE.Geometry();
            dotGeometry.vertices.push(new THREE.Vector3(points[i].x,points[i].y,points[i].z));
            var dotMaterial = new THREE.PointsMaterial( { size: 4, sizeAttenuation: false, color: color } );
            var dot = new THREE.Points( dotGeometry, dotMaterial );
            texlineGroup.add( dot );
        }
    }
    if (styleEnum=== this.styleEnum.sphere) {
        for (var i = 0; i< 19;i++) {
            var geometryS = new THREE.SphereGeometry( 0.1, 5, 5 );

            var materialS = new THREE.LineBasicMaterial( { color : color } );
            var sphereLine =  new THREE.Mesh( geometryS, materialS );
            sphereLine.position.set(points[i].x,points[i].y,points[i].z);
            texlineGroup.add(sphereLine);
        }
    }

    //NOTICE that objects are added to sphere and not to scene, maybe i the furure we will need update positions
};

LineGenerator.prototype.generateLines = function (path, color, point, zoom, styleEnum) {
    var lastIndex = 0;
    for (var i = 0; i < path.addresses.length-1; i++) {


        var startPosition = positionOnSphere(Number(path.addresses[lastIndex].lat),Number(path.addresses[lastIndex].lng),this.sphereRadius);
        var endPosition = positionOnSphere(Number(path.addresses[i+1].lat),Number(path.addresses[i+1].lng),this.sphereRadius);

        var calculateCurve = new THREE.LineCurve3(startPosition,endPosition);
        var curveLenght = calculateCurve.getLength();

        if (curveLenght > CLUSTER_SIZE*zoom) {
            //console.log(array[i]);
            this.generateLine(path.addresses[lastIndex].lat,path.addresses[lastIndex].lng,
                path.addresses[i+1].lat,path.addresses[i+1].lng,color,path.name,point,styleEnum);
            lastIndex = i+1;
        }
        else {
            //console.log("Skipping this line");
        }
    }
    if (lastIndex !== path.addresses.length-1) {
        //console.log("drawing the last line");
        this.generateLine(path.addresses[lastIndex].lat,path.addresses[lastIndex].lng,
            path.addresses[path.addresses.length-1].lat,path.addresses[path.addresses.length-1].lng,
            color,path.name, point, styleEnum);
    }
};