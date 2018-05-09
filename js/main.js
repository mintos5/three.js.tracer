var radiusSize = 20;
//GLOBAL variables
var paths = {};
var addresses = {};
var geos = {};
function Main() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.clock = new THREE.Clock();
    this.clockCounter = 0;
    this.cameraZoomOld = 1;
    this.cameraZoom = 1;
    this.renderer = new THREE.WebGLRenderer();
    this.lineGenerator = new LineGenerator(radiusSize,this.scene);
    this.controller = new Controller(this.scene);
    this.stats = new Stats();
    this.controls = {buttonClicked:false, mouseDownX: 0, mouseDownY: 0, x: 0, y: 0, keys: {}};
    this.sphere;
    this.canvas;
    this.canvasWidth;
    this.canvasHeight;
}

//todo bublinky zmenit farbu
//todo clustering urobit ho plynulo, asi vsetko prekreslovat
//todo rekonfiguracia tvaru, dat prec text a namiesto neho toto
//todo removing lines by one....
//todo starting point, ending point

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

    this.onWindowResize();
    this.canvas = document.getElementById("mainCanvas");
    this.canvas.appendChild( this.renderer.domElement );

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.copy(new THREE.Vector3(10,7,0));
    this.scene.add( directionalLight );
    //var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );

    //this.scene.add( helper );


    this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    //TO ENABLE/DISABLE performance panel
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
    this.controller.scene = this.sphere;
    this.scene.add( this.sphere );
    //this.sphere.translateX(-18);


    //create lineGenerator
    //this.lineGenerator.generateLine(0,0,48.143889,17.109722);

    this.camera.position.z = 40;


    var self = this;
    window.addEventListener( 'resize', function (ev) {
        self.onWindowResize();
    }, false );
    window.addEventListener( 'mousemove', function ( event ) {

        self.controls.x = ( event.clientX / self.canvasWidth ) * 2 - 1;
        self.controls.y = - ( event.clientY / self.canvasHeight ) * 2 + 1;


        if (self.controls.buttonClicked) {
            var x = -( self.controls.mouseDownX - event.clientX );
            var y = -( self.controls.mouseDownY - event.clientY );

            self.controls.mouseDownX = event.clientX;
            self.controls.mouseDownY = event.clientY;


            var axis = new THREE.Vector3(0,x,0).normalize();

            //console.log(axis);
            self.sphere.rotateOnAxis(axis,0.04);
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

        //Raycasting objects....
        console.log("RAYCASTING");
        var raycaster = new THREE.Raycaster();
        console.log(self.controls.x);
        console.log(self.controls.y);
        raycaster.setFromCamera( new THREE.Vector2(self.controls.x,self.controls.y), self.camera );
        var intersects = raycaster.intersectObjects(self.sphere.children,true);
        for (var i =0; i< intersects.length; i++) {
            if (intersects[i].object.name in geos) {
                main.controller.selectionCreate(intersects[i].object.name);
                break;
            }
        }
    }, false);
    window.addEventListener( 'mouseup', function ( event ) {
        self.controls.buttonClicked = false;
    }, false);

    this.controls.keys.W = 87;
    this.controls.keys.S = 83;
    this.controls.keys.A = 65;
    this.controls.keys.D = 68;
    this.controls.keys.UP = 38;
    this.controls.keys.DOWN = 40;

    document.body.onkeyup =
    document.body.onkeydown = function(e){
        var kc = e.keyCode || e.which;
        self.controls.keys[kc] = e.type == 'keydown';
    };

    //load Data
    loadDataFromServer();
};

Main.prototype.keyboardControll = function () {
    var keys = this.controls.keys;
    var axis = new THREE.Vector3();
    if (keys[keys.W]) {
        axis = new THREE.Vector3(1,0,0);
        this.sphere.rotateOnWorldAxis(axis,0.03);
    }
    if (keys[keys.S]) {
        axis = new THREE.Vector3(-1,0,0);
        this.sphere.rotateOnWorldAxis(axis,0.03);
    }
    if (keys[keys.A]) {
        axis = new THREE.Vector3(0,1,0);
        this.sphere.rotateOnAxis(axis,0.03);
    }
    if (keys[keys.D]) {
        axis = new THREE.Vector3(0,-1,0);
        this.sphere.rotateOnAxis(axis,0.03);
    }
    if (keys[keys.UP]) {
        if (this.cameraZoom > 0 ) {
            this.camera.position.z -= 0.3;
            this.cameraZoom -= 0.02;
            if (this.cameraZoom <= 0) {
                this.cameraZoom = 0;
            }
        }
    }
    if (keys[keys.DOWN]) {
        if (this.cameraZoom < 1 ) {
            this.camera.position.z += 0.3;
            this.cameraZoom += 0.02;
            if (this.cameraZoom >= 1) {
                this.cameraZoom = 1;
            }
        }
    }
};

Main.prototype.dataRefresh = function (deltaTime) {
    this.clockCounter += deltaTime;
    if (this.clockCounter >= 3){
        this.clockCounter = 0;
        if (this.cameraZoomOld !== this.cameraZoom) {
            console.log("REFRESHING");
            this.cameraZoomOld = this.cameraZoom;
            this.controller.refreshAll();
        }
    }
};
Main.prototype.animate = function () {
    requestAnimationFrame( this.animate.bind(this));
    this.stats.begin();
    //cube.rotation.x += 0.05;
    //sphere.rotation.y += 0.005;

    this.renderer.render(this.scene, this.camera);
    this.keyboardControll();
    this.dataRefresh(this.clock.getDelta());
    this.stats.end();
};


Main.prototype.onWindowResize = function () {
    this.canvasWidth = document.getElementById("mainCanvas").clientWidth;
    this.canvasHeight = document.getElementById("mainCanvas").clientHeight;

    this.camera.aspect = document.getElementById("mainCanvas").clientWidth / document.getElementById("mainCanvas").clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( document.getElementById("mainCanvas").clientWidth, document.getElementById("mainCanvas").clientHeight );

};