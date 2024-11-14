import * as THREE from 'three';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

const scene = new THREE.Scene();

const light = new THREE.AmbientLight(0x404040, 8);
const sunLight = new THREE.PointLight(0x404040, 500, 0, 0.5);
sunLight.castShadow = true;

//Space background
scene.background = new THREE.CubeTextureLoader()
  .setPath('textures/cube/space/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

//Lower background brightness
scene.backgroundIntensity = 0.7

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.000000118, 5000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
  alpha: true,
  powerPreference: "high-performance",
  reverseDepthBuffer: true
});

//Load html elements
//Main UI
const distanceFromElement = document.getElementById('distance');
const timeToElement = document.getElementById('time-until');
const timeElapsedElement = document.getElementById('time-elapsed');
const timeScaleElement = document.getElementById('speed-scale');
const timeSlowButton = document.getElementById('slow-button');
const timeFastButton = document.getElementById('fast-button');

//Loading UI
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');

//Start UI
const startButton = document.getElementById('start-button')

//Facts UI
const mercuryFacts = document.getElementById('mercury-facts');

//Make program fullscreen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Create orbit controls
const control = new OrbitControls(camera, renderer.domElement);

//Makes orbit controls smooth
control.enableDamping = true;

//Control max and min zoom of camera 
control.maxDistance = 3;
control.minDistance = 0.0000006;

//Lock movement during start
control.enableZoom = false;
control.enableRotate = false;
control.enablePan = false;

// Create a Loading Manager
const loadingManager = new THREE.LoadingManager(
  () => {
    // Called when all assets are loaded
    console.log('All assets loaded.');
    loadingScreen.style.display = 'none';
    setup();
  },
  (url, itemsLoaded, itemsTotal) => {
    // Called during loading to update progress
    console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
    loadingBar.style.width = String((itemsLoaded / itemsTotal) * 100 + '%')
  },
  (url) => {
    // Called if there’s an error loading
    console.error(`There was an error loading ${url}`);
  }
);

//Load Textures (bit of a mess but should run better than textureloader)
const bitmapLoader = new THREE.ImageBitmapLoader(loadingManager);
bitmapLoader.setOptions( { imageOrientation: 'flipY' } );

let sunTexture, mercuryTexture, venusTexture, earthTexture, earthNormal, earthCloudTexture, moonTexture, marsTexture, jupiterTexture, uranusTexture, neptuneTexture, plutoTexture;
let sun, mercury, venus, earth, earthCloud, moon, mars, jupiter, uranus, neptune, pluto;

bitmapLoader.load('textures/sun.jpg', (imageBitmap) => {
  sunTexture = new THREE.Texture(imageBitmap);
  sunTexture.needsUpdate = true;
});

bitmapLoader.load('textures/mercury.jpg', (imageBitmap) => {
  mercuryTexture = new THREE.Texture(imageBitmap);
  mercuryTexture.needsUpdate = true;
});

bitmapLoader.load('textures/venus.jpg', (imageBitmap) => {
  venusTexture = new THREE.Texture(imageBitmap);
  venusTexture.needsUpdate = true;
});

bitmapLoader.load('textures/earth/earth-surface.webp', (imageBitmap) => {
  earthTexture = new THREE.Texture(imageBitmap);
  earthTexture.needsUpdate = true;
});

bitmapLoader.load('textures/moon.jpg', (imageBitmap) => {
  moonTexture = new THREE.Texture(imageBitmap);
  moonTexture.needsUpdate = true;
});

bitmapLoader.load('textures/mars.jpg', (imageBitmap) => {
  marsTexture = new THREE.Texture(imageBitmap);
  marsTexture.needsUpdate = true;
});

bitmapLoader.load('textures/jupiter.jpg', (imageBitmap) => {
  jupiterTexture = new THREE.Texture(imageBitmap);
  jupiterTexture.needsUpdate = true;
});

bitmapLoader.load('textures/uranus.jpg', (imageBitmap) => {
  uranusTexture = new THREE.Texture(imageBitmap);
  uranusTexture.needsUpdate = true;
});

bitmapLoader.load('textures/neptune.jpg', (imageBitmap) => {
  neptuneTexture = new THREE.Texture(imageBitmap);
  neptuneTexture.needsUpdate = true;
});

bitmapLoader.load('textures/pluto.jpg', (imageBitmap) => {
  plutoTexture = new THREE.Texture(imageBitmap);
  plutoTexture.needsUpdate = true;
});

//Create planets geometry
const sunGeometry = new THREE.SphereGeometry(0.5, 128, 64);
const mercuryGeometry = new THREE.SphereGeometry(0.0017525, 64, 32);
const venusGeometry = new THREE.SphereGeometry(0.0043465, 64, 32);
const earthGeometry = new THREE.SphereGeometry(0.004576, 64, 32);
const moonGeometry = new THREE.SphereGeometry(0.00125, 64, 32);
const marsGeometry = new THREE.SphereGeometry(0.002435, 64, 32);
const jupiterGeometry = new THREE.SphereGeometry(0.0502, 64, 32);

/*
Keeping for scale reference
const saturnGeometry = new THREE.SphereGeometry(0.041845, 64, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({ wireframe: true});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
*/

const uranusGeometry = new THREE.SphereGeometry(0.01822, 64, 32);
const neptuneGeometry = new THREE.SphereGeometry(0.01769, 64, 32);
const plutoGeometry = new THREE.SphereGeometry(0.00085366912, 64, 32);

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

renderer.compile(scene, camera, scene);

var timer = new Timer();

var frameCounter = 0;

var pos = 0;
var speed = 1;
var timeScale = 0;
var elapsedTimeRaw = 0;
var elapsedSeconds = 0;
var elapsedMinutes = 0;
var elapsedHours = 0;
var elapsedDays = 0;
var elapsedYears = 0;

var planetHeightOffset = 0.00005;

var rotObjects = [];
var rotSpeed = [];
var planets = [];

var startUI;
var mainUI;

var loaded = false;

var startLoop;
var started = false;

var targetPlanet;
var hasTarget = false;
var orbitingPlanet = false;

//Temporary just for tracking stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function setup() {
  //Assign loaded textures
  let sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);

  let mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
  mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

  let venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
  venus = new THREE.Mesh(venusGeometry, venusMaterial);

  let earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  earth = new THREE.Mesh(earthGeometry, earthMaterial);

  let moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
  moon = new THREE.Mesh(moonGeometry, moonMaterial);

  let marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
  mars = new THREE.Mesh(marsGeometry, marsMaterial);

  let jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
  jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

  let uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
  uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

  let neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
  neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

  let plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });
  pluto = new THREE.Mesh(plutoGeometry, plutoMaterial);

  //Add objects to scene
  scene.add(
    sun,
    mercury,
    venus,
    earth,
    moon,
    mars,
    jupiter,
    saturnModel,
    uranus,
    neptune,
    pluto,
    voyagerModel,
    light,
    sunLight
  )

  //Position and height where you want the voyager to stop, not accurate to planet height or position 
  planets = [
    { 'name': 'Mercury', 'visited': false, 'position': 41.596, 'height': 0.0019, 'object': mercury },
    { 'name': 'Venus', 'visited': false, 'position': 77.723, 'height': 0.0045, 'object': venus },
    { 'name': 'Earth', 'visited': false, 'position': 107.492, 'height': 0.0046, 'object': earth },
    { 'name': 'The Moon', 'visited': false, 'position': 107.774, 'height': 0.0013, 'object': moon },
    { 'name': 'Mars', 'visited': false, 'position': 163.696, 'height': 0.00246, 'object': mars },
    { 'name': 'Jupiter', 'visited': false, 'position': 559.2, 'height': 0.0509, 'object': jupiter },
    { 'name': 'Saturn', 'visited': false, 'position': 1028.9, 'height': 0.0418, 'object': saturnModel },
    { 'name': 'Uranus', 'visited': false, 'position': 2066.968, 'height': 0.01829, 'object': uranus },
    { 'name': 'Neptune', 'visited': false, 'position': 3234.968, 'height': 0.01778, 'object': neptune },
    { 'name': 'Pluto', 'visited': false, 'position': 4219.999, 'height': 0.000856, 'object': pluto }
  ]

  startUI = document.getElementById('start-UI');
  startUI.style.opacity = '1';

  mainUI = document.getElementById('main-UI');
  mainUI.style.opacity = '0';

  mercuryFacts.style.display = 'none';
  mercuryFacts.style.opacity = '0';

  //Move voyager in front of sun
  voyagerModel.position.setZ(0.500001);

  //Set planet distance from sun
  mercury.position.setZ(41.6);
  mercury.position.setY(-0.0017525 - planetHeightOffset);

  venus.position.setZ(77.73);
  venus.position.setY(-0.0043465 - planetHeightOffset);

  earth.position.setZ(107.5);
  earth.position.setY(-0.00464 - planetHeightOffset);

  moon.position.setZ(107.776201352);
  moon.position.setY(-0.00125 - planetHeightOffset);

  mars.position.setZ(163.7);
  mars.position.setY(-0.002435 - planetHeightOffset);

  jupiter.position.setZ(559.3);
  jupiter.position.setY(-0.0502 - planetHeightOffset);

  saturnModel.position.setY(-0.041845 - planetHeightOffset);

  uranus.position.setZ(2067);
  uranus.position.setY(-0.01822 - planetHeightOffset);

  neptune.position.setZ(3235);
  neptune.position.setY(-0.01769 - planetHeightOffset);

  pluto.position.setZ(4220);
  pluto.position.setY(-0.00085366912 - planetHeightOffset);

  //Make camera face sun on load
  camera.position.setZ(1.81);

  //Assign speed to all these
  rotObjects = [sun, mercury, venus, earth, moon, mars, jupiter, saturnModel, uranus, neptune, pluto];

  //Planet rotation speed in earth days (starts with sun)
  rotSpeed = [27, 58.66667, 243.018056, 0.997222, 27.32, 1.025, 0.413194, 0.439583, 0.718056, 0.666667, 6.4]

  //Gets rid of lag spike when turning camera around
  scene.traverse(obj => obj.frustumCulled = false);

  //Compile scene (may help performance... idk)
  renderer.compile(scene, camera);

  //Render scene
  renderer.render(scene, camera);

  loaded = true;

  start();
}

//Run start if button is pressed and everything is loaded
startButton.addEventListener('click', function() {
  if (loaded) {
    started = true;
  }
});

//Buttons to control speed
timeFastButton.addEventListener('click', function() {
  if (loaded && timeScale < 9) {
    timeScale++;
  }
})

timeSlowButton.addEventListener('click', function() {
  if (loaded && timeScale > 1) {
    timeScale--;
  }
})


//Start screen
function start() {
  //Store to cancle loop
  startLoop = requestAnimationFrame(start);

  //Set orbit target
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  //Need to do this to get accurate deltatime
  timer.update();

  //Needed for control damping
  control.update();

  //Deltatime
  var delta = timer.getDelta();

  sun.rotateY(((2 * Math.PI) / (27 * 86400) * delta) * 43200);

  //Fade out and disable start UI
  if (parseFloat(startUI.style.opacity) > 0 && started) {
    startUI.style.opacity = Math.max(0, parseFloat(startUI.style.opacity) - (1 * delta));
  } 
  else if (parseFloat(startUI.style.opacity) <= 0 && started) {
    startUI.style.display = 'none';
  }

  if (control.maxDistance > 0.000005 && started) {
    //Gradually zoom into voyager
    control.maxDistance *= 1 / (1 + (2.5 * delta));
  } 
  else if (control.maxDistance < 0.000005 && started) {
    //Cancel loop
    cancelAnimationFrame(startLoop);

    //Set camera max zoom
    control.maxDistance = 0.000005;

    //Unlock cam
    control.enableZoom = true;
    control.enableRotate = true;

    //Bring in main ui
    mainUI.style.display = 'block';

    //Start main loop
    animate();
  }

  renderer.render(scene, camera);
}

function animate() {
  //Create loop
  requestAnimationFrame(animate);

  //Track fps
  stats.begin();

  //Tracker for frustrum culling
  frameCounter++;

  //Turn back on culling after 1 frame, should help performance
  if (frameCounter == 2) {
    scene.traverse(obj => obj.frustumCulled = true);
  }

  //Need to do this to get accurate deltatime
  timer.update();

  //Deltatime
  var delta = timer.getDelta();

  //Fade in main UI
  if (parseFloat(mainUI.style.opacity) < 1) {
    mainUI.style.opacity = Math.min(1, parseFloat(mainUI.style.opacity) + (1 * delta));
  }

  //Around the 35,000 mph the voyager is moving
  pos = (0.00001124 * speed) * delta;

  //Move voyager and camera
  voyagerModel.position.add(new THREE.Vector3(0, 0, pos));
  camera.position.add(new THREE.Vector3(0, 0, pos));

  //Rotate planets
  for (let i = 0; i < rotObjects.length; i++) {
    rotObjects[i].rotateY(((2 * Math.PI) / (rotSpeed[i] * 86400) * delta) * speed);
  }

  //Converting Seconds to largest form
  elapsedTimeRaw += delta * speed;
  elapsedSeconds = Math.trunc(elapsedTimeRaw - 60 * Math.trunc(elapsedTimeRaw / 60))
  elapsedMinutes = Math.trunc((elapsedTimeRaw / 60) - 60 * Math.trunc(elapsedTimeRaw / 3600));
  elapsedHours = Math.trunc((elapsedTimeRaw / 3600) - 24 * Math.trunc(elapsedTimeRaw / 86400));
  elapsedDays = Math.trunc((elapsedTimeRaw / 86400) - 365.25 * Math.trunc(elapsedTimeRaw / 31557600));
  elapsedYears = Math.trunc(elapsedTimeRaw / 31557600);

  //Write time elapsed to canvas
  timeElapsedElement.innerHTML =
    'Elapsed Time: ' +
    elapsedYears + 'y ' +
    String(elapsedDays).padStart(3, '0') + 'd ' +
    String(elapsedHours).padStart(2, '0') + 'h ' +
    String(elapsedMinutes).padStart(2, '0') + 'm ' +
    String(elapsedSeconds).padStart(2, '0') + 's';

  //Miles from Sun
  distanceFromElement.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1609) - 432567.34)) + ' mi from the Sun';

  //Kilometers from Sun
  //distanceFromElement.innerHTML =  new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1000) - 695999.99999)) + ' km from the Sun';

  //Stop Voyager when at planet
  for (let i = 0; i < planets.length; i++) {
    if (voyagerModel.position.z >= planets[i].position && !planets[i].visited) {
      planets[i].visited = true;
      hasTarget = false;

      timeScale = 0;

      //Store camoffset to restore after teleport
      let camOffsetX = camera.position.x - voyagerModel.position.x;
      let camOffsetY = camera.position.y - voyagerModel.position.y;
      let camOffsetZ = camera.position.z - voyagerModel.position.z;

      //Teleport to set location as high speeds can shoot past it
      voyagerModel.position.z = planets[i].position;

      //Restore camera orbital position around voyager
      camera.position.set(
        voyagerModel.position.x + camOffsetX,
        voyagerModel.position.y + camOffsetY,
        voyagerModel.position.z + camOffsetZ
      );

      mercuryFacts.style.display = 'block';
      mercuryFacts.style.opacity = '1';
    }
    else if (!hasTarget && planets[i].visited == false) {
      //Set closest non visited planet as target
      hasTarget = true;
      targetPlanet = planets[i];
    }
  }

  //Time until next planet text
  timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round((targetPlanet.position - voyagerModel.position.z) / (0.00001124 * speed));

  //Set orbit control orgin to voyager
  if (!orbitingPlanet) {
    control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);
  }

  //Control time scale from slider value
  switch (timeScale) {
    case 0:
      //Realtime
      speed = 0
      timeScaleElement.innerHTML = 'Time Stopped'
      break;
    case 1:
      //Realtime
      speed = 1
      timeScaleElement.innerHTML = 'Real-time'
      break;
    case 2:
      //Every Second is an minute
      speed = 60
      timeScaleElement.innerHTML = '1s = 1m'
      break;
    case 3:
      //Every Second is 5 minutes
      speed = 300
      timeScaleElement.innerHTML = '1s = 5m'
      break;
    case 4:
      //Every Second is an hour
      speed = 3600
      timeScaleElement.innerHTML = '1s = 1h'
      break;
    case 5:
      //Every Second is a day
      speed = 86400
      timeScaleElement.innerHTML = '1s = 1d'
      break;
    case 6:
      //Every Second is 5 days
      speed = 432000
      timeScaleElement.innerHTML = '1s = 5d'
      break;
    case 7:
      //Every Second is 15 days
      speed = 1296000
      timeScaleElement.innerHTML = '1s = 15d'
      break;
    case 8:
      //Every Second is 30 days
      speed = 2592000
      timeScaleElement.innerHTML = '1s = 30d'
      break;
    case 9:
      //Every Second is 180 days
      speed = 15552000
      timeScaleElement.innerHTML = '1s = 180d'
      break;
  }

  //Need to do this for orbit control damping
  control.update();

  //Debug
  //Time Elapsed Error Checking
  if (elapsedSeconds < 0 || elapsedSeconds > 60) {
    console.error('Error Seconds: ' + elapsedSeconds);
  }
  if (elapsedMinutes < 0 || elapsedMinutes > 60) {
    console.error('Error Minutes: ' + elapsedMinutes);
  }
  if (elapsedHours < 0 || elapsedHours > 24) {
    console.error('Error Hours: ' + elapsedHours);
  }
  if (elapsedDays < 0 || elapsedDays > 365) {
    console.error('Error Days: ' + elapsedDays);
  }
  if (elapsedYears < 0) {
    console.error('Error Years: ' + elapsedYears);
  }

  //every second is a minute - 60
  //every second is an hour - 3600
  //every second is a day - 86400
  //every second is 30 days - 2592000
  //every second is 180 days - 15552000
  //every second is a year - 31557600  

  //End Debug

  renderer.render(scene, camera);

  stats.end();
}

//Update program size and aspect ratio when window size changes
window.addEventListener('resize', () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});