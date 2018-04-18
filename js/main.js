var radiusSize = 20;
var sphereTest;
//GLOBAL variables
var paths = {};
var addresses = {};
var geos = {};
function Main() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.lineGenerator = new LineGenerator(radiusSize,this.scene);
    this.stats = new Stats();
    this.controls = {buttonClicked:false, mouseDownX: 0, mouseDownY: 0};
    this.sphere;
}

//todo
//
//3 scenare vizualnej analyzy>
//3 use case, chce nieco na datach zistit....
//najprv scenar az potom implementacia
//
//1. FILTROVANIE/PRIDANIE SI DAT Uzivatel si vie vybrat konkretny traceRoute a zobrazit si ho
//2. Selekcia uzlov vyfiltrovat len cesty prechadzajuce tymto bodom
//3. Detaily na pouziadanie, zapinat vypinat veci pre sprehladnenie, zobrazenie textu IP adresy zobrazenie bodov
//4.
//

//klustrovanie rozne urove zoomu
//rovnake ciary spajat
//namiesto ciar pouzivat 3d valec /tvar ciary
//selekcia a detail na poziadanie mi davaju 4b staci aj viacej poklikat
//V K3 dorobit vsetko

Main.prototype.init = function () {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.copy(new THREE.Vector3(10,7,0));
    this.scene.add( directionalLight );
    //var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );

    //this.scene.add( helper );


    this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( this.stats.dom );

    //generate sphere
    var geometry = new THREE.SphereGeometry( radiusSize, 50, 50 );
    var material = new THREE.MeshPhongMaterial();
    material.side = THREE.DoubleSide;
    //material.wireframe = true;
    var loaderDiffuse = new THREE.TextureLoader();
    loaderDiffuse.load("textures/earthmap8k.jpg", function (texture) {
        material.map = texture;
        material.needsUpdate = true;
    });
    var loaderBump = new THREE.TextureLoader();
    loaderBump.load("textures/earthbump1k.jpg", function (texture) {
        material.bumpMap = texture;
        material.bumpScale = 0.001;
        material.needsUpdate = true;
    });
    var loaderSpecular = new THREE.TextureLoader();
    loaderSpecular.load("textures/earthspec1k.jpg", function (texture) {
        material.specularMap = texture;
        material.needsUpdate = true;
    });
    this.sphere = new THREE.Mesh( geometry, material );
    this.lineGenerator.scene = this.sphere;
    this.scene.add( this.sphere );
    this.sphere.translateX(-20);
    sphereTest = this.sphere;


    //create lineGenerator
    //this.lineGenerator.generateLine(0,0,48.143889,17.109722);

    this.camera.position.z = 40;

    var self = this;
    window.addEventListener( 'mousemove', function ( event ) {
        if (self.controls.buttonClicked) {
            var x = -( self.controls.mouseDownX - event.clientX );
            var y = -( self.controls.mouseDownY - event.clientY );

            self.controls.mouseDownX = event.clientX;
            self.controls.mouseDownY = event.clientY;

            console.log(x);

            //cleaner micromovements
            // if (x < 4 && x > -4) {
            //     x = 0;
            // }
            // if (y < 4 && y > -4) {
            //     y = 0;
            // }

            var axis = new THREE.Vector3(y,x,0).normalize();

            console.log(axis);
            self.sphere.rotateOnWorldAxis(axis,0.03);
            //self.sphere.rotateY(x);
            //self.sphere.rotateX(y);
        }


    }, false);
    window.addEventListener( 'mousedown', function ( event ) {
        //console.log("mouseDown");
        self.controls.buttonClicked = true;
        self.controls.mouseDownX = event.clientX;
        self.controls.mouseDownY = event.clientY;
        //console.log(self.controls.mouseDownY);
    }, false);
    window.addEventListener( 'mouseup', function ( event ) {
        self.controls.buttonClicked = false;
    }, false);

    window.addEventListener( 'mousewheel', function ( event ) {
        //console.log(event.wheelDeltaY);
        self.camera.position.z += event.wheelDeltaY*0.006;
    }, false);


    //load Data
    loadDataFromServer();
};

Main.prototype.animate = function () {
    requestAnimationFrame( this.animate.bind(this));
    this.stats.begin();
    //cube.rotation.x += 0.05;
    //sphere.rotation.y += 0.005;

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
};

Main.prototype.addLine = function (object) {

};