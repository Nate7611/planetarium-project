import * as THREE from 'three';

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
  powerPreference: 'high-performance',
  reverseDepthBuffer: true
});

//Load html elements
//Main UI
const mainUI = document.getElementById('main-UI');
const distanceFromElement = document.getElementById('distance');
const timeToElement = document.getElementById('time-until');
const timeElapsedElement = document.getElementById('time-elapsed');
const timeScaleElement = document.getElementById('speed-scale');
const timeSlowButton = document.getElementById('slow-button');
const timeFastButton = document.getElementById('fast-button');
const unitSwitchButton = document.getElementById('unit-button');
const unitSwitchButtonText = document.getElementById('unit-button__text');

//Loading UI
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');

//Start UI
const startUI = document.getElementById('start-UI');
const startButton = document.getElementById('start-button')

//Facts UI
const factsContainer = document.getElementById('fact-container');
const factsName = document.getElementById('fact-container__name');
const factsDistance = document.getElementById('fact-container__distance');
const factsRadius = document.getElementById('fact-container__radius');
const factsLowTemp = document.getElementById('fact-container__low-tempature');
const factsHighTemp = document.getElementById('fact-container__high-tempature');
const factsOrbitSpeed = document.getElementById('fact-container__orbital-speed');
const factsDayLength = document.getElementById('fact-container__day-length');


//Make program fullscreen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Create orbit controls
const control = new OrbitControls(camera, renderer.domElement);

//Makes orbit controls smooth
control.enableDamping = true;

//Control max and min zoom of camera 
control.maxDistance = 3;
control.minDistance = 0.0000005;

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
bitmapLoader.setOptions({ imageOrientation: 'flipY' });

let sunTexture, mercuryTexture, venusTexture, earthTexture, moonTexture, marsTexture, jupiterTexture, uranusTexture, neptuneTexture, plutoTexture;
let sun, mercury, venus, earth, moon, mars, jupiter, uranus, neptune, pluto;

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

bitmapLoader.load('textures/earth.jpg', (imageBitmap) => {
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

const timer = new Timer();

const planetHeightOffset = 0.00003;

const planets = [
  { name: 'Mercury', arrived: false, left: false, position: 41.596, endPosition: 41.604, distanceFromSun: '0.4 AU', radius: '1,516 mi (2,439 km)', tempLow: '-290°F (-180°C)', tempHigh: '800°F (430°C)', orbitSpeed: '29 miles (47 kilometers) per second', dayLength: '59 Earth Days' },
  { name: 'Venus', arrived: false, left: false, position: 77.723, endPosition: 77.737, distanceFromSun: '0.7 AU', radius: '3,760 mi (6,052 km)', tempLow: '870°F (465°C)', tempHigh: '870°F (465°C)', orbitSpeed: '22 miles (35 kilometers) per second', dayLength: '243 Earth Days' },
  { name: 'Earth', arrived: false, left: false, position: 107.492, endPosition: 107.508, distanceFromSun: '1 AU', radius: '3,959 mi (6,371 km)', tempLow: '-128°F (-89°C)', tempHigh: '134°F (57°C)', orbitSpeed: '18.5 miles (30 kilometers) per second', dayLength: '1 Earth Day' },
  { name: 'The Moon', arrived: false, left: false, position: 107.774, endPosition: 107.778402704, distanceFromSun: '1 AU', radius: '1,079 mi (1,737 km)', tempLow: '-387°F (-233°C)', tempHigh: '253°F (123°C)', orbitSpeed: '0.6 miles (1 kilometer) per second', dayLength: '27.3 Earth Days' },
  { name: 'Mars', arrived: false, left: false, position: 163.696, endPosition: 163.704, distanceFromSun: '1.5 AU', radius: '2,106 mi (3,390 km)', tempLow: '-195°F (-125°C)', tempHigh: '70°F (20°C)', orbitSpeed: '15 miles (24 kilometers) per second', dayLength: '1.03 Earth Days' },
  { name: 'Jupiter', arrived: false, left: false, position: 559.2, endPosition: 559.4, distanceFromSun: '5.2 AU', radius: '43,441 mi (69,911 km)', tempLow: '-234°F (-145°C)', tempHigh: '-234°F (-145°C)', orbitSpeed: '8 miles (13 kilometers) per second', dayLength: '0.41 Earth Days' },
  { name: 'Saturn', arrived: false, left: false, position: 1028.9, endPosition: 1029.1, distanceFromSun: '9.6 AU', radius: '36,184 mi (58,232 km)', tempLow: '-288°F (-178°C)', tempHigh: '-288°F (-178°C)', orbitSpeed: '6 miles (9.7 kilometers) per second', dayLength: '0.45 Earth Days' },
  { name: 'Uranus', arrived: false, left: false, position: 2066.968, endPosition: 2067.032, distanceFromSun: '19.2 AU', radius: '15,759 mi (25,362 km)', tempLow: '-371°F (-224°C)', tempHigh: '-371°F (-224°C)', orbitSpeed: '4 miles (6.8 kilometers) per second', dayLength: '0.72 Earth Days' },
  { name: 'Neptune', arrived: false, left: false, position: 3234.968, endPosition: 3235.032, distanceFromSun: '30.1 AU', radius: '15,299 mi (24,622 km)', tempLow: '-373°F (-225°C)', tempHigh: '-373°F (-225°C)', orbitSpeed: '3.4 miles (5.4 kilometers) per second', dayLength: '0.67 Earth Days' },
  { name: 'Pluto', arrived: false, left: false, position: 4219.999, endPosition: 4220.001, distanceFromSun: '39.5 AU', radius: '738 mi (1,187 km)', tempLow: '-387°F (-233°C)', tempHigh: '-369°F (-223°C)', orbitSpeed: '2.9 miles (4.7 kilometers) per second', dayLength: '6.39 Earth Days' }
];

const timeScales = [
  { speed: 0, label: 'Time Stopped' },
  { speed: 1, label: 'Real-time' },
  { speed: 60, label: '1s = 1m' },
  { speed: 300, label: '1s = 5m' },
  { speed: 3600, label: '1s = 1h' },
  { speed: 86400, label: '1s = 1d' },
  { speed: 1296000, label: '1s = 15d' },
  { speed: 2592000, label: '1s = 30d' },
  { speed: 5184000, label: '1s = 60d' },
  { speed: 10368000, label: '1s = 120d' },
];

var rotObjects = [];
var rotSpeed = [];
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
var secondsUntilPlanet = 0;
var secondsUntilPlanetRaw = 0;
var usingMetric = false;
var slowingDown = false;
var loaded = false;
var startLoop;
var started = false;
var targetPlanet;
var hasTarget = false;

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

  startUI.style.opacity = '1';
  mainUI.style.opacity = '0';
  factsContainer.style.opacity = '0';

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
startButton.addEventListener('click', function () {
  if (loaded) {
    started = true;
    startUI.style.animationName = 'hide';
  }
})

//Buttons to control speed
timeFastButton.addEventListener('click', function () {
  if (loaded && timeScale < (timeScales.length - 1) && !slowingDown) {
    timeFastButton.style.animationName = 'pressed';
    timeScale++;
  }
})

timeFastButton.addEventListener('animationend', () => {
  timeFastButton.style.animationName = 'none';
});

timeSlowButton.addEventListener('click', function () {
  if (loaded && timeScale > 1 && !slowingDown) {
    timeSlowButton.style.animationName = 'pressed';
    timeScale--;
  }
})

timeSlowButton.addEventListener('animationend', () => {
  timeSlowButton.style.animationName = 'none';
});


//Switch units and button text when pressed
unitSwitchButton.addEventListener('click', function () {
  if (!usingMetric) {
    usingMetric = true;
    unitSwitchButtonText.innerHTML = 'Switch to mi';
  }
  else {
    usingMetric = false;
    unitSwitchButtonText.innerHTML = 'Switch to km';
  }
})

//Start screen
function start() {
  //Store to cancel loop
  startLoop = requestAnimationFrame(start);

  //Set orbit target
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  //Need to do this to get accurate deltatime
  timer.update();

  //Needed for control damping
  control.update();

  //Deltatime
  var delta = timer.getDelta();

  //Rotate Sun
  sun.rotateY(((2 * Math.PI) / (27 * 86400) * delta) * 43200);

  if (control.maxDistance > 0.000005 && started) {
    //Gradually zoom into voyager
    control.maxDistance *= 1 / (1 + (2.5 * delta));
  }
  else if (control.maxDistance < 0.000005 && started) {
    //Cancel loop
    cancelAnimationFrame(startLoop);

    //Hide Start UI
    startUI.style.display = 'none';

    //Set camera max zoom
    control.maxDistance = 0.000005;

    //Unlock cam
    control.enableZoom = true;
    control.enableRotate = true;

    //Bring in main ui
    mainUI.style.display = 'block';
    mainUI.style.animationName = 'reveal';

    //Start main loop
    animate();
  }

  renderer.render(scene, camera);
}

control.addEventListener('end', () => {
  //console.log("Camera transformed by OrbitControls:");
});

function animate() {
  //Create loop
  requestAnimationFrame(animate);

  //Tracker for frustrum culling
  frameCounter++;

  //Turn back on culling after 1 frame, fixes lag spike when loading planets
  if (frameCounter == 2) {
    scene.traverse(obj => obj.frustumCulled = true);
  }

  //Need to do this to get accurate deltatime
  timer.update();

  //Deltatime
  var delta = timer.getDelta();

  speed = timeScales[timeScale].speed;

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


  if (!usingMetric) {
    //Miles from Sun
    distanceFromElement.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1609) - 432567.34)) + ' mi from the Sun';
  }
  else {
    //Kilometers from Sun
    distanceFromElement.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1000) - 695999.99999)) + ' km from the Sun';
  }

  //Stop Voyager when at planet
  for (let i = 0; i < planets.length; i++) {
    //When we arrive at planet
    if (voyagerModel.position.z >= planets[i].position && !planets[i].arrived) {
      planets[i].arrived = true;
      hasTarget = false;
      slowingDown = false;
      timeScale = 1;

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

      //Fade in fact container
      factsContainer.style.animationName = 'reveal';

      //Update FactContainer with planet info
      factsName.innerHTML = planets[i].name;
      factsDistance.innerHTML = planets[i].distanceFromSun;
      factsRadius.innerHTML = planets[i].radius;
      factsLowTemp.innerHTML = planets[i].tempLow;
      factsHighTemp.innerHTML = planets[i].tempHigh;
      factsOrbitSpeed.innerHTML = planets[i].orbitSpeed;
      factsDayLength.innerHTML = planets[i].dayLength;
    }

    //Check for new target
    if (!hasTarget && planets[i].arrived == false) {
      //Set closest planet that we have not yet arrived at as target
      hasTarget = true;
      targetPlanet = planets[i];
    }

    //Check if we left planet
    if (planets[i].arrived && !planets[i].left && voyagerModel.position.z >= planets[i].endPosition) {
      planets[i].left = true;

      //Fade out factContainer
      factsContainer.style.animationName = 'hide';
    }
  }

  //Time until next planet text
  secondsUntilPlanet = Math.round((targetPlanet.position - voyagerModel.position.z) / (0.00001124 * speed));
  secondsUntilPlanetRaw = (targetPlanet.position - voyagerModel.position.z) / (0.00001124 * speed);

  //Slow down when near planet
  if (secondsUntilPlanetRaw <= 0.05 && timeScale > 2) {
    slowingDown = true;
    timeScale--;
  }

  //Convert from seconds
  if ((secondsUntilPlanetRaw / 31557600) >= 1 && secondsUntilPlanetRaw != Infinity) {
    //Print in years
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 31557600) + 'y';
  }
  else if ((secondsUntilPlanetRaw / 86400) >= 1 && secondsUntilPlanetRaw != Infinity) {
    //Print in days
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 86400) + 'd';
  }
  else if ((secondsUntilPlanetRaw / 3600) >= 1 && secondsUntilPlanetRaw != Infinity) {
    //Print in hours
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 3600) + 'h';
  }
  else if ((secondsUntilPlanetRaw / 60) >= 1 && secondsUntilPlanetRaw != Infinity) {
    //Print in minutes
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 60) + 'm';
  }
  else if (secondsUntilPlanetRaw != Infinity) {
    //Print in seconds
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + secondsUntilPlanetRaw.toFixed(1) + 's';
  }
  else {
    //Removes extra letters for infinity
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + secondsUntilPlanetRaw;
  }

  //Set orbit control orgin to voyager
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  //Write speed to screen
  if (slowingDown) {
    timeScaleElement.innerHTML = 'Slowing Down'
  }
  else {
    timeScaleElement.innerHTML = timeScales[timeScale].label;
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
}

//Update program size and aspect ratio when window size changes
window.addEventListener('resize', () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});