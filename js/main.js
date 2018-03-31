var sphere;
var radiusSize = 20;
function Main() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.lineGenerator = new LineGenerator(radiusSize,this.scene);
    this.stats = new Stats();
}
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
    sphere = new THREE.Mesh( geometry, material );
    this.lineGenerator.scene = sphere;
    this.scene.add( sphere );


    //create lineGenerator
    //this.lineGenerator.generateLine(0,0,48.143889,17.109722);

    this.camera.position.z = 40;

    loadData();
};

Main.prototype.animate = function () {
    requestAnimationFrame( this.animate.bind(this));
    this.stats.begin();
    //cube.rotation.x += 0.05;
    sphere.rotation.y += 0.005;

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
};

Main.prototype.addLine = function (object) {

};