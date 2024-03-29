let direction = 1;
let timeout = 1;
var ball,table;

const DIAGONAL = {x:0.016,y:0.03,z:-0.015}
const STRAIGHT = {x:0,y:0.025,z:+0.018}
window.addEventListener('keydown',function(e){
  if (e.key == 'a'){
    direction = 1

  } else {
    direction = -1
  }
  // alert('keydown!')
  ball.applyImpulse({x:0, y: 0, z:direction * 0.0001},1)

})
function updateOimoPhysics() {
  if (world == null) return;
  world.step();

  var x,
    y,
    z,
    mesh,
    body,
    i = bodys.length;

  while (i--) {
    body = bodys[i];
    mesh = meshs[i];

    if (!body.sleeping) {
      mesh.position.copy(body.getPosition());
      mesh.quaternion.copy(body.getQuaternion());

      // change material
      if (mesh.material.name === "sbox") mesh.material = mats.box;
      if (mesh.material.name === "ssph") mesh.material = mats.sph;
      if (mesh.material.name === "scyl") mesh.material = mats.cyl;

      // reset position
    } else {
      if (mesh.material.name === "box") mesh.material = mats.sbox;
      if (mesh.material.name === "sph") mesh.material = mats.ssph;
      if (mesh.material.name === "cyl") mesh.material = mats.scyl;
    }
  }

  infos.innerHTML = world.getInfo();
}

function gravity(g) {
  nG = document.getElementById("gravity").value;
  world.gravity = new OIMO.Vec3(0, nG, 0);
}

const config = [2, 1, 3, 1, 0xffffffff];
//----------------------------------
//  OIMO PHYSICS
//----------------------------------
function addStaticBox(size, position, rotation) {
  var mesh = new THREE.Mesh(geos.box, mats.ground);
  mesh.scale.set(size[0], size[1], size[2]);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(
    rotation[0] * ToRad,
    rotation[1] * ToRad,
    rotation[2] * ToRad
  );
  scene.add(mesh);
  grounds.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
class World {
  constructor() {
    this.meshes = [];
    this.bodies = [];
  }

  add(object) {
    object.setup(world, scene);
    if (!object.static) {
      this.meshes.push(object.mesh);
      this.bodies.push(object.body);
    }
    meshs = this.meshes;
    bodys = this.bodies;
    scene.add(object.mesh);
    world.gravity = new OIMO.Vec3(0, -4, 0);
  }
}

class Box {
  constructor(size, position) {
    this.size = size;
    this.position = position;
    this.rotation = [0, 0, 0];
    this.static = true;
    // this.setup()
  }
  setup(world) {
    var mesh = new THREE.Mesh(geos.box, mats.ground);
    mesh.scale.set(...this.size);
    mesh.position.set(...this.position);
    mesh.rotation.set(
      this.rotation[0] * ToRad,
      this.rotation[1] * ToRad,
      this.rotation[2] * ToRad
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mesh = mesh;
    this.config = {
      type: "box",
      size: [...this.size],
      pos: [...this.position],
      move: true,
      world: world,
    };
    this.body = world.add(this.config);
  }

  updatePosition(newPosition) {
    this.position = newPosition;
    this.mesh.position.set(...this.position);
  }
}

class Sphere {
  constructor(position, radius,kinematic) {
    this.size = [radius / 2, radius / 2, radius / 2];
    this.radius = radius;
    this.position = position;
    this.rotation = [0, 0, 0];
    this.kinematic = kinematic
    this.static = false;
    // this.setup()
  }

  applyImpulse(impulse,time){
    this.duration = time
    this.impulse = impulse
  }

  reset(){
      ball.body.resetPosition(-180, 10, 180);
  }

  resetVelocity(){
    this.body.linearVelocity.x = 0
    this.body.linearVelocity.y = 0
    this.body.linearVelocity.z = 0
  }

  check(){
    if (this.duration>0){
      this.body.applyImpulse(this.body.position,this.impulse)
    }
    this.duration = Math.max(this.duration-1,0)

  }
  setup(world) {
    var mesh = new THREE.Mesh(geos.sphere, mats.sph);
    mesh.scale.set(...this.size);
    mesh.position.set(...this.position);
    mesh.rotation.set(
      this.rotation[0] * ToRad,
      this.rotation[1] * ToRad,
      this.rotation[2] * ToRad
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mesh = mesh;
    this.config = {
      type: "sphere",
      size: [this.radius * 0.5],
      pos: [...this.position],
      move: true,
      world: world,
      config: config,
      kinematic : this.kinematic
    };
    this.body = world.add(this.config);
    // this.body = world.add({type:'sphere', size:[this.radius*0.5], pos:[...this.position], move:true, world:world});
    // this.mesh = new THREE.Mesh( geos.sphere, mats.sph );
    // this.mesh.scale.set( this.radius*0.5, this.radius*0.5, this.radius*0.5 );
    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;

    // scene.add(this.mesh);
  }

  updatePosition(newPosition) {
    this.position = newPosition;
    this.mesh.position.set(...this.position);
  }
}

class Ground {
  constructor(size,position) {
    this.position = position
    this.size = size
    this.mesh = addStaticBox(size, position, [0, 0, 0]);
    this.body = world.add({
      size: size,
      pos: position,
      world: world,
    });
  }
}
var paddle, content, ball, ground0, net
function newSetup() {
  mouse = new THREE.Vector2()
  ray = new THREE.Raycaster();
  const universe = new World();
  content = new THREE.Object3D();
  scene.add(content)
  // const ground1 = new Box([400, 80, 400], [0, -40, 0])
  // const net = new Box([400, 40, 20], [0, 20, 0])
  ball = new Sphere([0, 0, 150], 20,false);
  //add ground
  ground0 = new Ground([400,80,400],[0,-40,0])
  net = new Ground([400,40,10],[0,20,0])
  // const paddle2 = 
  // paddle = new THREE.Object3D()
  // scene.add(paddle)

  const objects = [ball];
  for (const object of objects) {
    universe.add(object);
    content.add(object.mesh)
  }
}
let currentCounter = 0;
let currentSign = 0;
let touchTimeout = 0
let impulseTimeout = 0;
function customLoop(){
  ball.check()
  // // console.log(ball.body.position.z)
  touchTimeout = Math.max(touchTimeout-1,0)
  impulseTimeout = Math.max(impulseTimeout-1,0)
    if (ball.body.position.y < -100) {
      ball.body.resetPosition(0, 200, 0);
    }
  if (world.getContact(net.body,ball.body)){
    // alert('net!')
  }
  const SIZE = 1.9
  const STRENGTH = 0.001
  if (impulseTimeout === 0){

  // if (ball.body.position.z < -SIZE){
  //   // ball.applyImpulse({x:0,y:STRENGTH/16,z:STRENGTH},1)
  //   ball.resetVelocity()
  //   ball.applyImpulse({x:0,y:0.025,z:+0.018},1)
  //   impulseTimeout = 50

  //   // alert('deep end! (1)')
  // }
  // if (ball.body.position.z > SIZE){
  //   // ball.applyImpulse({x:0,y:STRENGTH/16,z:-STRENGTH},1)
  //   // alert('deep end! (2)')
  //   ball.resetVelocity()
  //   ball.applyImpulse({x:0,y:0.03,z:-0.0165},1)
  //   impulseTimeout = 50
  // }
  }
  if (touchTimeout === 0 && world.getContact(ball.body,ground0.body)){
    if (Math.sign(ball.body.position.y) < 0){
      if (currentSign === -1){
        // alert('double bounce')
      }
      currentSign = -1
    } else  {
      if (currentSign === 1){
        // alert('double bounce')
      }
      currentSign = 1

    }
    touchTimeout = 50

  }
}
// init();
// loop();
function loop() {
  updateOimoPhysics();
  customLoop()
  renderer.render(scene, camera);
  // paddle.updatePosition([200*mouseX/window.innerWidth,200*mouseY/window.innerHeight,0])
  requestAnimationFrame(loop);
}