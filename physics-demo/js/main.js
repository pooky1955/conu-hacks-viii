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
      if (mesh.position.y < -100) {
        x = -100 + Math.random() * 200;
        z = -100 + Math.random() * 200;
        y = 100 + Math.random() * 1000;
        body.resetPosition(x, y, z);
      }
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

const config = [0.2, 1, 3.5, 1, 0xffffffff];
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
  constructor(position, radius) {
    this.size = [radius / 2, radius / 2, radius / 2];
    this.radius = radius;
    this.position = position;
    this.rotation = [0, 0, 0];
    this.static = false;
    // this.setup()
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
      // kinematic : true
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
var paddle
function newSetup() {
  const universe = new World();
  // const ground1 = new Box([400, 80, 400], [0, -40, 0])
  // const net = new Box([400, 40, 20], [0, 20, 0])
  const ball = new Sphere([0, 200, 0], 20);
  //add ground
  const ground0 = new Ground([400,80,400],[0,-40,0])
  const net = new Ground([400,40,10],[0,20,0])
  paddle = new Sphere([0,200,200],30)
  const objects = [ball,paddle];
  for (const object of objects) {
    universe.add(object);
  }
}

let ray, mouse;
let mouseX = 0;
let mouseY = 0;
init();
loop();
        window.addEventListener( 'mousemove', rayTest, false);
function loop() {
  updateOimoPhysics();
  renderer.render(scene, camera);
  paddle.updatePosition([200*mouseX/window.innerWidth,200*mouseY/window.innerHeight,0])
  requestAnimationFrame(loop);
}
function rayTest (e) {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    ray.setFromCamera( mouse, camera );
    var intersects = ray.intersectObjects( content.children, true );
    if ( intersects.length) {
        paddle.position.copy( intersects[0].point.add(new THREE.Vector3( 0, 20, 0 )) );
    }
}