import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

const scene = new THREE.Scene();

const light = new THREE.AmbientLight(0x404040, 100);

//Space background
scene.background = new THREE.CubeTextureLoader()
  .setPath('textures/cube/space/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

//Lower background brightness
scene.backgroundIntensity = 0.7

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0000001, 10000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
});

//Load html elements
const distanceText = document.getElementById('distance');
const timeText = document.getElementById('time');
const timeElapsed = document.getElementById('time-elapsed');
const timeScaleText = document.getElementById('slider-text');
const timeScaleSlider = document.getElementById('time-slider');
const loadingScreen = document.getElementById("loading-screen");
const loadingBar = document.getElementById("loading-bar");

timeScaleSlider.value = 1;

//Make program fullscreen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Create orbit controls
const control = new OrbitControls(camera, renderer.domElement);

//Makes orbit controls smooth
control.enableDamping = true;

//Control max and min zoom of camera 
control.maxDistance = 0.000005;
control.minDistance = 0.0000006;

// Create a Loading Manager
const loadingManager = new THREE.LoadingManager(
  () => {
    // Called when all assets are loaded
    console.log("All assets loaded.");
    loadingScreen.style.display = 'none';
    setup();
  },
  (url, itemsLoaded, itemsTotal) => {
    // Called during loading to update progress
    console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
    loadingBar.style.width = String((itemsLoaded/itemsTotal) * 100 + "%")
  },
  (url) => {
    // Called if there’s an error loading
    console.error(`There was an error loading ${url}`);
  }
);

//Load Textures
const textureLoader = new THREE.TextureLoader(loadingManager);
const sunTexture = textureLoader.load('textures/sun.jpg');
const mercuryTexture = textureLoader.load('textures/mercury.jpg');
const venusTexture = textureLoader.load('textures/venus.jpg');
const earthTexture = textureLoader.load('textures/earth/earth-surface.jpg');
const earthNormal = textureLoader.load('textures/earth/earth-normal.jpg');
const earthCloudTexture = textureLoader.load('textures/earth/earth-cloud.jpg');
const moonTexture = textureLoader.load('textures/moon.jpg');
const marsTexture = textureLoader.load('textures/mars.jpg');
const jupiterTexture = textureLoader.load('textures/jupiter.jpg');
const uranusTexture = textureLoader.load('textures/uranus.jpg');
const neptuneTexture = textureLoader.load('textures/neptune.jpg');
const plutoTexture = textureLoader.load('textures/pluto.jpg');

//Create planets
const sunGeometry = new THREE.SphereGeometry(0.5, 128, 64);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

const mercuryGeometry = new THREE.SphereGeometry(0.0017525, 64, 32);
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

const venusGeometry = new THREE.SphereGeometry(0.0043465, 64, 32);
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);

const earthGeometry = new THREE.SphereGeometry(0.004576, 128, 64);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture, normalMap: earthNormal, normalScale: new THREE.Vector2(1, 1) });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

const earthCloudGeometry = new THREE.SphereGeometry(0.00464, 128, 64);
const earthCloudMaterial = new THREE.MeshStandardMaterial({ alphaMap: earthCloudTexture, displacementMap: earthCloudTexture, displacementScale: -0.000005, transparent: true, opacity: 1.0 });
const earthCloud = new THREE.Mesh(earthCloudGeometry, earthCloudMaterial);

const moonGeometry = new THREE.SphereGeometry(0.00125, 64, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

const marsGeometry = new THREE.SphereGeometry(0.002435, 64, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);

const jupiterGeometry = new THREE.SphereGeometry(0.0502, 64, 32);
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

/*
Keeping for scale reference
const saturnGeometry = new THREE.SphereGeometry(0.041845, 64, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({ wireframe: true});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
*/

const uranusGeometry = new THREE.SphereGeometry(0.01822, 64, 32);
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

const neptuneGeometry = new THREE.SphereGeometry(0.01769, 64, 32);
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

const plutoGeometry = new THREE.SphereGeometry(0.00085366912, 64, 32);
const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });
const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);

//Load models
const loader = new GLTFLoader(loadingManager);
let voyagerModel;
loader.load('models/voyager.glb', (gltf) => {
  voyagerModel = gltf.scene;
  voyagerModel.scale.set(0.0000001, 0.0000001, 0.0000001);
  voyagerModel.position.set(0, -0.0000001, 0);
  voyagerModel.rotation.set((90 * Math.PI) / 180, (90 * Math.PI) / 180, 0)
  scene.add(voyagerModel);
});

let saturnModel;
loader.load('models/saturn.glb', (gltf) => {
  saturnModel = gltf.scene;
  saturnModel.scale.set(0.01, 0.01, 0.01);
  saturnModel.position.set(0, 0, 1029);
  scene.add(saturnModel);
});

var timer = new Timer();

var pos = 0;
var speed = 1;
var timeScale = 1;
var elapsedTimeRaw = 0;
var elapsedSeconds = 0;
var elapsedMinutes = 0;
var elapsedHours = 0;
var elapsedDays = 0;
var elapsedYears = 0;

var rotObjects = [];
var rotSpeed = [];

function setup() {
  //Add objects to scene
  scene.add(
    sun,
    mercury,
    venus,
    earth,
    earthCloud,
    moon,
    mars,
    jupiter,
    saturnModel,
    uranus,
    neptune,
    pluto,
    voyagerModel,
    light
  )

  //voyagerModel.position.setZ(0.500001);
  voyagerModel.position.setZ(107.49)
  //voyagerModel.position.setY(0.06);

  //Set planet distance from sun
  mercury.position.setZ(41.6);
  venus.position.setZ(77.73);
  earth.position.setZ(107.5);
  earthCloud.position.setZ(107.5);
  moon.position.setZ(107.5 + 0.27620135201);
  mars.position.setZ(163.7);
  jupiter.position.setZ(559.3);
  uranus.position.setZ(2067);
  neptune.position.setZ(3235);
  pluto.position.setZ(4220);

  //Make camera face sun on load
  camera.position.setZ(0.51)

  //Assign speed to all these
  rotObjects = [sun, mercury, venus, earth, earthCloud, moon, mars, jupiter, saturnModel, uranus, neptune, pluto]

  //Planet rotation speed in earth days (starts with sun)
  rotSpeed = [27, 58.66667, 243.018056, 0.997222, 0.8, 27.32, 1.025, 0.413194, 0.439583, 0.718056, 0.666667, 6.4]

  animate();
}

function animate() {
  //Need to do this to get accurate deltatime
  timer.update();

  //Deltatime
  var delta = timer.getDelta();

  //Move voyager and camera
  voyagerModel.position.add(new THREE.Vector3(0, 0, pos));
  camera.position.add(new THREE.Vector3(0, 0, pos));

  //Rotate planets
  for (let i = 0; i < rotObjects.length; i++) {
    rotObjects[i].rotateY(((2 * Math.PI) / (rotSpeed[i] * 86400) * delta) * speed);
  }

  //Around the 35,000 mph the voyager is moving
  pos = (0.00001124 * speed) * delta;

  //Converting Seconds to largest form
  elapsedTimeRaw += delta * speed;
  elapsedSeconds = Math.trunc(elapsedTimeRaw - 60 * Math.trunc(elapsedTimeRaw / 60))
  elapsedMinutes = Math.trunc((elapsedTimeRaw / 60) - 60 * Math.trunc(elapsedTimeRaw / 3600));
  elapsedHours = Math.trunc((elapsedTimeRaw / 3600) - 24 * Math.trunc(elapsedTimeRaw / 86400));
  elapsedDays = Math.trunc((elapsedTimeRaw / 86400) - 365.25 * Math.trunc(elapsedTimeRaw / 31557600));
  elapsedYears = Math.trunc(elapsedTimeRaw / 31557600);

  //Write time elapsed to canvas
  timeElapsed.innerHTML =
    elapsedYears + " Year(s) " +
    String(elapsedDays).padStart(3, "0") + " Day(s) " +
    String(elapsedHours).padStart(2, "0") + " Hour(s) " +
    String(elapsedMinutes).padStart(2, "0") + " Minute(s) " +
    String(elapsedSeconds).padStart(2, "0") + " Second(s)";

  //Miles from Sun
  distanceText.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1609) - 432567.34)) + " mi from the Sun";

  //Kilometers from Sun
  //distanceText.innerHTML =  new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1000) - 695999.99999)) + " km from the Sun";

  //Stop Voyager when at planet
  if (voyagerModel.position.z < mercury.position.z) {
    timeText.innerHTML = Math.round((mercury.position.z - voyagerModel.position.z) / (0.00001124 * speed));
  }

  //Set orbit control orgin to object
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  //Convert string to number
  timeScale = Number(timeScaleSlider.value);

  //Control time scale from slider value
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


  //Need to do this for orbit control damping
  control.update();



  //Debug
  //Time Elapsed Error Checking
  if (elapsedSeconds < 0 || elapsedSeconds > 60) {
    console.log("Error Seconds: " + elapsedSeconds);
  }
  if (elapsedMinutes < 0 || elapsedMinutes > 60) {
    console.log("Error Minutes: " + elapsedMinutes);
  }
  if (elapsedHours < 0 || elapsedHours > 24) {
    console.log("Error Hours: " + elapsedHours);
  }
  if (elapsedDays < 0 || elapsedDays > 365) {
    console.log("Error Days: " + elapsedDays);
  }
  if (elapsedYears < 0) {
    console.log("Error Years: " + elapsedYears);
  }

  //every second is a minute - 60
  //every second is an hour - 3600
  //every second is a day - 86400
  //every second is 30 days - 2592000
  //every second is 180 days - 15552000
  //every second is a year - 31557600  

  //End Debug

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

//Update program size and aspect ratio when window size changes
window.addEventListener('resize', () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});