import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

// Load html elements
// Global UI
const muteButtonOff = document.getElementById('mute-button-off');
const muteButtonOn = document.getElementById('mute-button-on');
const minimizeButton = document.getElementById('minimize-button');
const maximizeButton = document.getElementById('maximize-button');

// Main UI
const mainUI = document.getElementById('main-UI');
const distanceFromElement = document.getElementById('distance');
const timeToElement = document.getElementById('time-until');
const timeElapsedElement = document.getElementById('time-elapsed');
const timeScaleElement = document.getElementById('speed-scale');
const timeSlowButton = document.getElementById('slow-button');
const timeFastButton = document.getElementById('fast-button');
const unitSwitchButton = document.getElementById('unit-button');
const unitSwitchButtonText = document.getElementById('unit-button__text');

// Loading UI
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');

// Start UI
const startUI = document.getElementById('start-UI');
const startButton = document.getElementById('start-button')

// Facts UI
const factsContainer = document.getElementById('fact-container');
const factsName = document.getElementById('fact-container__name');
const factsFunFact = document.getElementById('fact-container__fun-fact');
const factsDiameter = document.getElementById('fact-container__radius');
const factsTemperature = document.getElementById('fact-container__temperature');
const factsMoons = document.getElementById('fact-container__moons');
const factsDayLength = document.getElementById('fact-container__day-length');

// Opening UI
const openingElement = document.getElementById('opening-text');
const tutorialElement = document.getElementById('tutorial');
const tutorialSpeedElement = document.getElementById('tutorial__speed-text');
const tutorialCameraElement = document.getElementById('tutorial__camera-text');

// Ending UI
const endingElement = document.getElementById('ending');
const endingQuestion1 = document.getElementById('ending__question-1');
const endingQuestion2 = document.getElementById('ending__question-2');
const endingQuestion3 = document.getElementById('ending__question-3');
const endingQuestion4 = document.getElementById('ending__question-4');
const endingQuestion5 = document.getElementById('ending__question-5');
const endingAnswer1 = document.getElementById('ending__answer-1');
const endingAnswer2 = document.getElementById('ending__answer-2');
const endingAnswer3 = document.getElementById('ending__answer-3');
const endingAnswer4 = document.getElementById('ending__answer-4');
const endingAnswer5 = document.getElementById('ending__answer-5');
const endButton = document.getElementById('end-button');

const scene = new THREE.Scene();

const light = new THREE.AmbientLight(0x404040, 10);
const sunLight = new THREE.PointLight(0x404040, 500, 0, 0.5);
sunLight.castShadow = true;

// Space background
scene.background = new THREE.CubeTextureLoader()
  .setPath('textures/cube/space/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

// Lower background brightness
scene.backgroundIntensity = 0.7;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.000000118, 5000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
  alpha: true,
  powerPreference: 'high-performance',
  reverseDepthBuffer: true
});

// Make program fullscreen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create orbit controls
const control = new OrbitControls(camera, renderer.domElement);

// Makes orbit controls smooth
control.enableDamping = true;

// Control max and min zoom of camera 
control.maxDistance = 3;
control.minDistance = 0.0000005;

// Lock movement during start
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

// Load Textures (bit of a mess but should run better than textureloader)
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

// Load models
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

// Create planets geometry
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

const timer = new Timer();

const planetHeightOffset = 0.00003;
const maxDistance = 0.000004;

const planets = [
  { name: 'Mercury', arrived: false, left: false, position: 41.596, endPosition: 41.604, diameter: '3,032 mi (4,879 km)', temperature: '333°F (167°C)', moons: '0', dayLength: '175.9 Earth Days', funFact: "Mercury's temperature fluctuates from around 800°F (430°C) during the day to around -290°F (-180°C) at night." },
  { name: 'Venus', arrived: false, left: false, position: 77.723, endPosition: 77.737, diameter: '7,521 mi (12,104 km)', temperature: '867°F (464°C)', moons: '0', dayLength: '116.8 Earth Days', funFact: 'Venus has a thick atmosphere of carbon dioxide that makes it hotter than Mercury, despite being farther from the Sun.' },
  { name: 'Earth', arrived: false, left: false, position: 107.492, endPosition: 107.508, diameter: '7,926 mi (12,756 km)', temperature: '59°F (15°C)', moons: '1', dayLength: '1 Earth Day', funFact: 'Earth is the only planet in the Universe known to support life.' },
  { name: 'The Moon', arrived: false, left: false, position: 107.774, endPosition: 107.778402704, diameter: '2,159 mi (3,475 km)', temperature: '-4°F (-20°C)', moons: '0', dayLength: '29.5 Earth Days', funFact: "When the Moon is at its farthest distance from Earth, you could fit all the other planets (including Pluto) in the space between them." },
  { name: 'Mars', arrived: false, left: false, position: 163.696, endPosition: 163.704, diameter: '4,221 mi (6,792 km)', temperature: '-85°F (-65°C)', moons: '2', dayLength: '1.03 Earth Days', funFact: 'Mars is home to the tallest volcano in the Solar System, Olympus Mons, which is about two and a half times the height of Mount Everest.' },
  { name: 'Jupiter', arrived: false, left: false, position: 559.2, endPosition: 559.4, diameter: '88,846 mi (142,984 km)', temperature: '-166°F (-110°C)', moons: '95', dayLength: '0.414 Earth Days', funFact: "Jupiter actually has rings, along with Uranus and Neptune. These rings are just much harder to see compared to Saturn's rings." },
  { name: 'Saturn', arrived: false, left: false, position: 1028.88, endPosition: 1029.12, diameter: '74,897 mi (120,536 km)', temperature: '-220°F (-140°C)', moons: '146', dayLength: '0.444 Earth Days', funFact: "Despite Saturn's rings being around 175,000 miles (282,000 km) wide, their thickness is less than the length of a football field." },
  { name: 'Uranus', arrived: false, left: false, position: 2066.968, endPosition: 2067.032, diameter: '31,763 mi (51,118 km)', temperature: '-320°F (-195°C)', moons: '27', dayLength: '0.718 Earth Days', funFact: 'Uranus is unique because it rotates on its side, with its axis tilted by about 98 degrees.' },
  { name: 'Neptune', arrived: false, left: false, position: 3234.968, endPosition: 3235.032, diameter: '30,775 mi (49,528 km)', temperature: '-330°F (-200°C)', moons: '14', dayLength: '0.671 Earth Days', funFact: 'Neptune is known for its strong winds, the fastest in the Solar System, reaching speeds of more than 1,200 mph (2,000 km/h).' },
  { name: 'Pluto', arrived: false, left: false, position: 4219.9978, endPosition: 4220.0022, diameter: '1,476 mi (2,376 km)', temperature: '-375°F (-225°C)', moons: '5', dayLength: '6.39 Earth Days', funFact: 'Pluto was once considered the ninth planet in our Solar System before being reclassified as a dwarf planet in 2006.' }
];

const timeScales = [
  { speed: 0, label: 'Time Stopped', soundVolume: 0 },
  { speed: 1, label: 'Real-time', soundVolume: 0 },
  { speed: 60, label: '1s = 1m', soundVolume: 0.08 },
  { speed: 300, label: '1s = 5m', soundVolume: 0.16 },
  { speed: 3600, label: '1s = 1h', soundVolume: 0.24 },
  { speed: 86400, label: '1s = 1d', soundVolume: 0.32 },
  { speed: 1296000, label: '1s = 15d', soundVolume: 0.4 },
  { speed: 2592000, label: '1s = 30d', soundVolume: 0.48 },
  { speed: 5184000, label: '1s = 60d', soundVolume: 0.56 },
  { speed: 10368000, label: '1s = 120d', soundVolume: 0.64 },
];

// Audio variable
let listener;
let bgMusic;
let bgMusicElement;
let zoomSound;
let zoomSoundElement;
let zoomSoundLoop;
let zoomSoundLoopElement;

let muted;

if (localStorage.getItem('muted') == 'false') {
  muted = false;
}
else {
  muted = true;
}

let bgMusicVol = 0.1;
let startZoomVol = 0.4;

// Track for tutorial text
let movedCamera = false;
let timeRateChanged = false;
let tutorialComplete = false;

// Other variables
let rotObjects = [];
let rotSpeed = [];
let frameCounter = 0;
let pos = 0;
let speed = 1;
let timeScale = 0;
let elapsedTimeRaw = 0;
let elapsedSeconds = 0;
let elapsedMinutes = 0;
let elapsedHours = 0;
let elapsedDays = 0;
let elapsedYears = 0;
let secondsUntilPlanet = 0;
let secondsUntilPlanetRaw = 0;
let usingMetric = false;
let slowingDown = false;
let loaded = false;
let startLoop;
let started = false;
let targetPlanet;
let hasTarget = false;

function setup() {
  // Assign loaded textures
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

  // Add objects to scene
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
  mainUI.style.display = 'none';
  factsContainer.style.opacity = '0';

  if (muted) {
    muteButtonOff.style.display = 'none';
    muteButtonOn.style.display = 'block';
  }
  else {
    muteButtonOn.style.display = 'none';
    muteButtonOff.style.display = 'block';
  }

  // Move voyager in front of sun
  voyagerModel.position.setZ(0.500001);

  // Set planet distance from sun
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
  pluto.rotateY(Math.PI);

  // Make camera face sun on load
  camera.position.setZ(1.81);

  // Assign speed to all these
  rotObjects = [sun, mercury, venus, earth, moon, mars, jupiter, saturnModel, uranus, neptune, pluto];

  // Planet rotation speed in hours (starts with sun)
  rotSpeed = [648, 1407.6, -5832.5, 23.9, 655.7, 24.6, 9.9, 10.7, -17.2, 16.1, -153.3];

  // Gets rid of lag spike when turning camera around
  scene.traverse(obj => obj.frustumCulled = false);

  // Compile scene (may help performance... idk)
  renderer.compile(scene, camera);

  // Render scene
  renderer.render(scene, camera);

  loaded = true;

  start();
}

// Run start if button is pressed and everything is loaded
startButton.addEventListener('click', function () {
  if (loaded) {
    started = true;
    startUI.style.animationName = 'hide';

    // Listener for music
    listener = new THREE.AudioListener();
    camera.add(listener);

    // Global background music audio
    bgMusic = new THREE.Audio(listener);
    bgMusicElement = document.getElementById('bg-music');
    bgMusic.setMediaElementSource(bgMusicElement);
    bgMusicElement.play();

    // Zoom sound
    zoomSound = new THREE.Audio(listener);
    zoomSoundElement = document.getElementById('zoom-sound');
    zoomSound.setMediaElementSource(zoomSoundElement);
    zoomSoundElement.play();

    // Looping zoom sound
    zoomSoundLoop = new THREE.Audio(listener);
    zoomSoundLoopElement = document.getElementById('zoom-sound-loop');
    zoomSoundLoop.setMediaElementSource(zoomSoundLoopElement);
    zoomSoundLoopElement.play();
    zoomSoundLoop.setVolume(0);
  }
});

// Volume buttons
muteButtonOff.addEventListener('click', function () {
  if (!muted) {
    muted = true;
    localStorage.setItem('muted', 'true');
    muteButtonOff.style.display = 'none';
    muteButtonOn.style.display = 'block';
  }
});

muteButtonOn.addEventListener('click', function () {
  if (muted) {
    muted = false;
    localStorage.setItem('muted', 'false');
    muteButtonOn.style.display = 'none';
    muteButtonOff.style.display = 'block';
  }
});

// Fullscreen buttons (I dont need both if statements but I dont want the user to get stuck so I am leaving them in case)
maximizeButton.addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    maximizeButton.style.display = 'none';
    minimizeButton.style.display = 'block';
  } 
  else if (document.exitFullscreen) {
    document.exitFullscreen();
    minimizeButton.style.display = 'none';
    maximizeButton.style.display = 'block';
  }
});

minimizeButton.addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    maximizeButton.style.display = 'none';
    minimizeButton.style.display = 'block';
  } 
  else if (document.exitFullscreen) {
    document.exitFullscreen();
    minimizeButton.style.display = 'none';
    maximizeButton.style.display = 'block';
  }
});

// Buttons to control speed
timeFastButton.addEventListener('click', function () {
  if (loaded && timeScale < (timeScales.length - 1) && !slowingDown) {
    timeFastButton.style.animationName = 'pressed';
    timeScale++;
    timeRateChanged = true;

    if (!tutorialComplete) {
      tutorial();
    }
  }
});

timeFastButton.addEventListener('animationend', () => {
  timeFastButton.style.animationName = 'none';
});

timeSlowButton.addEventListener('click', function () {
  if (loaded && timeScale > 0 && !slowingDown) {
    timeSlowButton.style.animationName = 'pressed';
    timeScale--;
  }
})

timeSlowButton.addEventListener('animationend', () => {
  timeSlowButton.style.animationName = 'none';
});

// Switch units and button text when pressed
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

control.addEventListener('start', () => {
  movedCamera = true;
  if (!tutorialComplete) {
    tutorial();
  }
});

openingElement.addEventListener('click', () => {
  // Hide and make none interactable
  openingElement.style.animationName = 'hide';
  openingElement.style.pointerEvents = 'none';

  mainUI.style.display = 'block';
  mainUI.style.animationName = 'reveal';

  tutorialElement.style.pointerEvents = 'none';
  tutorialElement.style.display = 'flex';
  tutorialElement.style.animationName = 'reveal';
});

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

// Fade in elements 2 seconds after each other
endingElement.addEventListener('animationend', async () => {
  let list = [
    endingQuestion1, endingAnswer1,
    endingQuestion2, endingAnswer2,
    endingQuestion3, endingAnswer3,
    endingQuestion4, endingAnswer4,
    endingQuestion5, endingAnswer5,
    endButton
  ];

  for (let l in list) {
    list[l].classList.add('reveal');
    await sleep(2000);
  };
});

// Reload page after 30 seconds of ending
endButton.addEventListener('animationend', async () => {
  await sleep(30000);
  window.location.reload();
});


function tutorial() {
  if (timeRateChanged) {
    tutorialSpeedElement.style.textDecoration = 'line-through';
    timeSlowButton.classList.remove('speed-button-tutorial');
    timeFastButton.classList.remove('speed-button-tutorial');
  }

  if (movedCamera) {
    tutorialCameraElement.style.textDecoration = 'line-through';
  }

  if (timeRateChanged && movedCamera) {
    tutorialComplete = true;
    tutorialElement.style.animationName = 'hide';
  }
};

// Start screen
function start() {
  // Store to cancel loop
  startLoop = requestAnimationFrame(start);

  // Set orbit target
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  // Need to do this to get accurate deltatime
  timer.update();

  // Needed for control damping
  control.update();

  // Deltatime
  let delta = timer.getDelta();

  // Rotate Sun
  sun.rotateY(((2 * Math.PI) / (27 * 86400) * delta) * 43200);

  if (control.maxDistance > maxDistance && started) {
    // Gradually zoom into voyager
    control.maxDistance *= 1 / (1 + (2.5 * delta));

    if (!muted) {
      zoomSound.setVolume(startZoomVol);
      bgMusic.setVolume(bgMusicVol);
    }
    else {
      zoomSound.setVolume(0);
      bgMusic.setVolume(0);
    }
  }
  else if (control.maxDistance < maxDistance && started) {
    // Cancel loop
    cancelAnimationFrame(startLoop);

    // Hide Start UI
    startUI.style.display = 'none';

    // Set camera max zoom
    control.maxDistance = maxDistance;

    // Unlock cam
    control.enableZoom = true;
    control.enableRotate = true;

    // Bring in main ui
    openingElement.style.display = 'flex';
    openingElement.style.animationName = 'reveal';

    zoomSoundElement.pause();

    // Start main loop
    animate();
  }

  renderer.render(scene, camera);
}

function animate() {
  // Create loop
  requestAnimationFrame(animate);

  // Tracker for frustrum culling
  frameCounter++;

  // Turn back on culling after 1 frame, fixes lag spike when loading planets
  if (frameCounter == 2) {
    scene.traverse(obj => obj.frustumCulled = true);
  }

  // Need to do this to get accurate deltatime
  timer.update();

  // Deltatime
  let delta = timer.getDelta();

  // Set speed
  speed = timeScales[timeScale].speed;

  // Around the 38,026 mph the voyager is moving
  pos = (0.000012212 * speed) * delta;

  // Move voyager and camera
  voyagerModel.position.add(new THREE.Vector3(0, 0, pos));
  camera.position.add(new THREE.Vector3(0, 0, pos));

  // Rotate planets
  for (let i = 0; i < rotObjects.length; i++) {
    rotObjects[i].rotateY(((2 * Math.PI) / (rotSpeed[i] * 3600) * delta) * speed);
  }

  // Set audio volume
  if (muted) {
    zoomSoundLoop.setVolume(0);
    bgMusic.setVolume(0);
  }
  else {
    zoomSoundLoop.setVolume(timeScales[timeScale].soundVolume);
    bgMusic.setVolume(bgMusicVol);
  }

  // Converting Seconds to largest form
  elapsedTimeRaw += delta * speed;
  elapsedSeconds = Math.trunc(elapsedTimeRaw - 60 * Math.trunc(elapsedTimeRaw / 60))
  elapsedMinutes = Math.trunc((elapsedTimeRaw / 60) - 60 * Math.trunc(elapsedTimeRaw / 3600));
  elapsedHours = Math.trunc((elapsedTimeRaw / 3600) - 24 * Math.trunc(elapsedTimeRaw / 86400));
  elapsedDays = Math.trunc((elapsedTimeRaw / 86400) - 365.25 * Math.trunc(elapsedTimeRaw / 31557600));
  elapsedYears = Math.trunc(elapsedTimeRaw / 31557600);

  // Write time elapsed to canvas
  timeElapsedElement.innerHTML =
    'Elapsed Time: ' +
    elapsedYears + 'y ' +
    String(elapsedDays).padStart(3, '0') + 'd ' +
    String(elapsedHours).padStart(2, '0') + 'h ' +
    String(elapsedMinutes).padStart(2, '0') + 'm ' +
    String(elapsedSeconds).padStart(2, '0') + 's';


  if (!usingMetric) {
    // Miles from Sun
    distanceFromElement.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1609) - 432567.34)) + ' mi from the Sun';
  }
  else {
    // Kilometers from Sun
    distanceFromElement.innerHTML = new Intl.NumberFormat().format(Math.round(((voyagerModel.position.z * 1392000000) / 1000) - 695999.99999)) + ' km from the Sun';
  }

  // Stop Voyager when at planet
  for (let i = 0; i < planets.length; i++) {
    // When we arrive at planet
    if (voyagerModel.position.z >= planets[i].position && !planets[i].arrived) {
      planets[i].arrived = true;
      hasTarget = false;
      slowingDown = false;
      timeScale = 1;

      // Store camoffset to restore after teleport
      let camOffsetX = camera.position.x - voyagerModel.position.x;
      let camOffsetY = camera.position.y - voyagerModel.position.y;
      let camOffsetZ = camera.position.z - voyagerModel.position.z;

      // Teleport to set location as high speeds can shoot past it
      voyagerModel.position.z = planets[i].position;

      // Restore camera orbital position around voyager
      camera.position.set(
        voyagerModel.position.x + camOffsetX,
        voyagerModel.position.y + camOffsetY,
        voyagerModel.position.z + camOffsetZ
      );

      // Fade in fact container
      factsContainer.style.animationName = 'reveal';

      // Update FactContainer with planet info
      factsName.innerHTML = planets[i].name;
      factsDiameter.innerHTML = planets[i].diameter;
      factsTemperature.innerHTML = planets[i].temperature;
      factsDayLength.innerHTML = planets[i].dayLength;
      factsMoons.innerHTML = planets[i].moons;
      factsFunFact.innerHTML = planets[i].funFact;
    }

    // Check for new target
    if (!hasTarget && planets[i].arrived == false) {
      // Set closest planet that we have not yet arrived at as target
      hasTarget = true;
      targetPlanet = planets[i];
    }

    // Check if we left planet
    if (planets[i].arrived && !planets[i].left && voyagerModel.position.z >= planets[i].endPosition) {
      planets[i].left = true;

      // Fade out factContainer
      factsContainer.style.animationName = 'hide';
    }
  }

  // Time until next planet text
  secondsUntilPlanet = Math.round((targetPlanet.position - voyagerModel.position.z) / (0.00001124 * speed));
  secondsUntilPlanetRaw = (targetPlanet.position - voyagerModel.position.z) / (0.00001124 * speed);

  // Slow down when near planet
  if (secondsUntilPlanetRaw <= 0.05 && timeScale > 2 && secondsUntilPlanetRaw > 0) {
    slowingDown = true;
    timeScale--;
  }

  // Convert from seconds
  if ((secondsUntilPlanetRaw / 31557600) >= 1 && secondsUntilPlanetRaw != Infinity && !slowingDown) {
    // Print in years
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 31557600) + 'y';
  }
  else if ((secondsUntilPlanetRaw / 86400) >= 1 && secondsUntilPlanetRaw != Infinity && !slowingDown) {
    // Print in days
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 86400) + 'd';
  }
  else if ((secondsUntilPlanetRaw / 3600) >= 1 && secondsUntilPlanetRaw != Infinity && !slowingDown) {
    // Print in hours
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 3600) + 'h';
  }
  else if ((secondsUntilPlanetRaw / 60) >= 1 && secondsUntilPlanetRaw != Infinity && !slowingDown) {
    // Print in minutes
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + Math.round(secondsUntilPlanet / 60) + 'm';
  }
  else if (secondsUntilPlanetRaw != Infinity && !slowingDown) {
    // Print in seconds
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + secondsUntilPlanetRaw.toFixed(1) + 's';
  }
  else {
    // Fix extra letter when writing infinity
    timeToElement.innerHTML = 'Time until ' + targetPlanet.name + ': ' + secondsUntilPlanetRaw;
  }

  if (secondsUntilPlanetRaw == Infinity || secondsUntilPlanetRaw < 0) {
    timeToElement.style.animationName = 'hide';
  }
  else {
    timeToElement.style.animationName = 'reveal';
  }

  // Set orbit control orgin to voyager
  control.target = new THREE.Vector3(voyagerModel.position.x, voyagerModel.position.y, voyagerModel.position.z);

  // Write speed to screen
  if (slowingDown) {
    timeScaleElement.innerHTML = 'Slowing Down';
    timeToElement.innerHTML = 'Arriving At ' + targetPlanet.name;
  }
  else {
    timeScaleElement.innerHTML = timeScales[timeScale].label;
  }

  if (voyagerModel.position.z > planets.at(-1).endPosition) {
    mainUI.style.animationName = 'hide';
    endingElement.style.display = 'flex';
    endingElement.style.animationName = 'reveal';
  }

  // Need to do this for orbit control damping
  control.update();

  // Debug
  // Time Elapsed Error Checking
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
  // End Debug

  renderer.render(scene, camera);
}

// Update program size and aspect ratio when window size changes
window.addEventListener('resize', () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});