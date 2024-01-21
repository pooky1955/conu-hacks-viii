
// demolink();

// three var
var camera, scene, light, renderer, canvas, controls;
var meshs = [];
var grounds = [];

var isMobile = false;
var antialias = true;

var geos = {};
var mats = {};

//oimo var
var world = null;
var bodys = [];

var fps = [0, 0, 0, 0];
var ToRad = 0.0174532925199432957;
var type = 1;
var infos;


function init() {
  var n = navigator.userAgent;
  if (
    n.match(/Android/i) ||
    n.match(/webOS/i) ||
    n.match(/iPhone/i) ||
    n.match(/iPad/i) ||
    n.match(/iPod/i) ||
    n.match(/BlackBerry/i) ||
    n.match(/Windows Phone/i)
  ) {
    isMobile = true;
    antialias = false;
    document.getElementById("MaxNumber").value = 200;
  }

  infos = document.getElementById("info");

  canvas = document.getElementById("canvas");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.position.set(0, 160, 400);

  controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 20, 0);
  controls.update();

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    precision: "mediump",
    antialias: antialias,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  var materialType = "MeshBasicMaterial";

  if (!isMobile) {
    scene.add(new THREE.AmbientLight(0x3d4143));
    light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(300, 1000, 500);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    var d = 300;
    light.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600);
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;

    scene.add(light);

    materialType = "MeshPhongMaterial";

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; //THREE.BasicShadowMap;
  }

  // background
  var buffgeoBack = new THREE.BufferGeometry();
  buffgeoBack.fromGeometry(new THREE.IcosahedronGeometry(3000, 2));
  var back = new THREE.Mesh(
    buffgeoBack,
    new THREE.MeshBasicMaterial({
      map: gradTexture([
        [0.75, 0.6, 0.4, 0.25],
        ["#1B1D1E", "#3D4143", "#72797D", "#b0babf"],
      ]),
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    })
  );
  //back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
  scene.add(back);

  // geometrys
  geos["sphere"] = new THREE.BufferGeometry().fromGeometry(
    new THREE.SphereGeometry(1, 16, 10)
  );
  geos["box"] = new THREE.BufferGeometry().fromGeometry(
    new THREE.BoxGeometry(1, 1, 1)
  );
  geos["cylinder"] = new THREE.BufferGeometry().fromGeometry(
    new THREE.CylinderGeometry(1, 1, 1)
  );

  // materials
  mats["sph"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(0),
    name: "sph",
  });
  mats["box"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(2),
    name: "box",
  });
  mats["cyl"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(4),
    name: "cyl",
  });
  mats["ssph"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(1),
    name: "ssph",
  });
  mats["sbox"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(3),
    name: "sbox",
  });
  mats["scyl"] = new THREE[materialType]({
    shininess: 10,
    map: basicTexture(5),
    name: "scyl",
  });
  mats["ground"] = new THREE[materialType]({
    shininess: 10,
    color: 0x3d4143,
    transparent: true,
    opacity: 0.5,
  });

  // events

  window.addEventListener("resize", onWindowResize, false);

  // physics

  initOimoPhysics();
}

function initOimoPhysics() {
  // world setting:( TimeStep, BroadPhaseType, Iterations )
  // BroadPhaseType can be
  // 1 : BruteForce
  // 2 : Sweep and prune , the default
  // 3 : dynamic bounding volume tree

  world = new OIMO.World({ info: true, worldscale: 100 });
  newSetup()
//   populate(1);
  //setInterval(updateOimoPhysics, 1000/60);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//----------------------------------
//  TEXTURES
//----------------------------------

function gradTexture(color) {
  var c = document.createElement("canvas");
  var ct = c.getContext("2d");
  var size = 1024;
  c.width = 16;
  c.height = size;
  var gradient = ct.createLinearGradient(0, 0, 0, size);
  var i = color[0].length;
  while (i--) {
    gradient.addColorStop(color[0][i], color[1][i]);
  }
  ct.fillStyle = gradient;
  ct.fillRect(0, 0, 16, size);
  var texture = new THREE.Texture(c);
  texture.needsUpdate = true;
  return texture;
}

function basicTexture(n) {
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  var ctx = canvas.getContext("2d");
  var color;
  if (n === 0) color = "#3884AA"; // sphere58AA80
  if (n === 1) color = "#61686B"; // sphere sleep
  if (n === 2) color = "#AA6538"; // box
  if (n === 3) color = "#61686B"; // box sleep
  if (n === 4) color = "#AAAA38"; // cyl
  if (n === 5) color = "#61686B"; // cyl sleep
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillRect(32, 32, 32, 32);

  var tx = new THREE.Texture(canvas);
  tx.needsUpdate = true;
  return tx;
}