import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

//Space background
scene.background = new THREE.CubeTextureLoader()
  .setPath('textures/cube/space/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

//Lower background brightness
scene.backgroundIntensity = 0.2

const light = new THREE.PointLight(0xffffff, 100000, 100); light.position.set(50, 50, 50); scene.add(light);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0000001, 10000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
});

const distanceText = document.getElementById('distance');
const timeText = document.getElementById('time');
const timeScaleText = document.getElementById('slider-text');
const timeScaleSlider = document.getElementById('time-slider');

timeScaleSlider.value = 1;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.maxDistance = 0.000005;

const sunGeometry = new THREE.SphereGeometry(0.5, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfcba03, wireframe: false });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const mercuryGeometry = new THREE.SphereGeometry(0.0017525, 32, 16);
const mercuryMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
scene.add(mercury);

const venusGeometry = new THREE.SphereGeometry(0.0043465, 32, 16);
const venusMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
scene.add(venus);

const earthGeometry = new THREE.SphereGeometry(0.004576, 32, 16);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const marsGeometry = new THREE.SphereGeometry(0.002435, 32, 16);
const marsMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

const jupiterGeometry = new THREE.SphereGeometry(0.0502, 32, 16);
const jupiterMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
scene.add(jupiter);

const saturnGeometry = new THREE.SphereGeometry(0.041845, 32, 16);
const saturnMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

const uranusGeometry = new THREE.SphereGeometry(0.01822, 32, 16);
const uranusMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
scene.add(uranus);

const neptuneGeometry = new THREE.SphereGeometry(0.01769, 32, 16);
const neptuneMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
scene.add(neptune);

let voyagerModel;
const loader = new GLTFLoader();
loader.load('models/voyager.glb', (gltf) => {
  voyagerModel = gltf.scene;
  voyagerModel.scale.set(0.0000001, 0.0000001, 0.0000001);
  voyagerModel.position.set(0, -0.0000001, 0.5000001);
  voyagerModel.rotation.set((90 * Math.PI) / 180.0, (90 * Math.PI) / 180, 0)
  scene.add(voyagerModel);

  loaded();
});

function loaded() {
  animate();
}

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

mercury.position.setZ(41.6);
venus.position.setZ(77.73);
earth.position.setZ(107.5);
mars.position.setZ(163.7);
jupiter.position.setZ(559.3);
saturn.position.setZ(1029);
uranus.position.setZ(2067);
neptune.position.setZ(3235);

//voyager.position.setZ(0.5000001);
camera.position.setZ(0.501)

const movementClock = new THREE.Clock();
const timeClock = new THREE.Clock();

var pos = 0;
var speed = 1;
var timeScale = 1;

function animate() {
  //Convert string to number
  timeScale = Number(timeScaleSlider.value);

  voyagerModel.position.add(new THREE.Vector3(0, 0, pos));
  camera.position.add(new THREE.Vector3(0, 0, pos));

  //Miles
  distanceText.innerHTML = Math.round(((voyagerModel.position.z * 1392000000) / 1609) - 432474.349797) + " mi from the Sun";

  //Kilometers
  //distanceText.innerHTML =  Math.round(((voyagerModel.position.z * 1392000000) / 1000) - 695999.99999) + " km from the Sun";

  //Time to next planet
  for (let i = 0; i < planets.length; i++) {
    if (voyagerModel.position.z < planets[i]) {

    }
  }

  if (voyagerModel.position.z < mercury.position.z) {
    timeText.innerHTML = Math.round((mercury.position.z - voyagerModel.position.z) / (0.00001124 * speed));
  }

  //Set orbit control orgin to object
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  //Around the 35,000 mph the voyager is moving
  pos = (0.00001124 * speed) * movementClock.getDelta();

  switch (timeScale) {
    case 1:
      //Realtime
      speed = 1
      timeScaleText.innerHTML = "Realtime"
      break;
    case 2:
      //Every Second is an hour
      speed = 3600
      timeScaleText.innerHTML = "1 Second = 1 Hour"
      break;
    case 3:
      //Every Second is a day
      speed = 86400
      timeScaleText.innerHTML = "1 Second = 1 Day"
      break;
    case 4:
      //Every Second is 5 days
      speed = 432000
      timeScaleText.innerHTML = "1 Second = 5 Day"
      break;
    case 5:
      //Every Second is 15 days
      speed = 1296000
      timeScaleText.innerHTML = "1 Second = 15 Day"
      break;
    case 6:
      //Every Second is 30 days
      speed = 2592000
      timeScaleText.innerHTML = "1 Second = 30 Days"
      break;
    case 7:
      //Every Second is 180 days
      speed = 15552000
      timeScaleText.innerHTML = "1 Second = 180 Days"
      break;
  }

  //every second is a minute - 60
  //every second is an hour - 3600
  //every second is a day - 86400
  //every second is 30 days - 2592000
  //every second is 180 days - 15552000
  //every second is a year - 31557600

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  control.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}