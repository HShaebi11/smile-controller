import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';

// camera
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  -50000,
  10000
);
camera.position.set(0, 0, 0);
camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

// scene
const scene = new THREE.Scene();

// spline scene
const loader = new SplineLoader();
let splineScene; // Store the spline scene for interaction
loader.load(
  'https://prod.spline.design/OtRbkxmenw5vEE5O/scene.splinecode',
  (loadedScene) => {
    splineScene = loadedScene;
    scene.add(splineScene);
  }
);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// scene settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

scene.background = new THREE.Color('#2d2e32');
renderer.setClearAlpha(1);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.125;

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Controller Support (Gamepad API)
let gamepad;
window.addEventListener('gamepadconnected', (event) => {
  console.log('Gamepad connected:', event.gamepad);
  gamepad = event.gamepad;
});

function handleControllerInput() {
  if (!gamepad || !splineScene) return;

  // Refresh gamepad state
  const currentGamepad = navigator.getGamepads()[gamepad.index];
  if (!currentGamepad) return;

  // Left joystick: Translate (position)
  const leftX = currentGamepad.axes[0]; // X-axis
  const leftY = currentGamepad.axes[1]; // Y-axis
  splineScene.position.x += leftX * 10; // Adjust sensitivity by changing 10
  splineScene.position.y -= leftY * 10;

  // Right joystick: Rotate (rotation)
  const rightX = currentGamepad.axes[2]; // X-axis
  const rightY = currentGamepad.axes[3]; // Y-axis
  splineScene.rotation.y += rightX * 0.05; // Adjust sensitivity by changing 0.05
  splineScene.rotation.x -= rightY * 0.05;

  console.log(`Position: (${splineScene.position.x}, ${splineScene.position.y})`);
  console.log(`Rotation: (${splineScene.rotation.x}, ${splineScene.rotation.y})`);
}

function animate(time) {
  controls.update();
  handleControllerInput(); // Add controller input to animation loop
  renderer.render(scene, camera);
}