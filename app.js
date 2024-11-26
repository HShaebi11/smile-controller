alert("Hello");

src="https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.min.js"
src="https://cdn.jsdelivr.net/npm/three@0.154.0/examples/js/controls/OrbitControls.js"
src="https://cdn.jsdelivr.net/npm/@splinetool/loader@0.8.0/build/spline-loader.min.js"

// Get the container element
const container = document.getElementById('threejs-container');

if (!container) {
  console.error("No element with ID 'threejs-container' found.");
  throw new Error("Cannot initialize Three.js without a container element.");
}

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create camera
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -aspect * 500, aspect * 500, 500, -500, -50000, 10000
);
camera.position.set(0, 0, 1000); // Adjust position to see the scene

// Create scene
const scene = new THREE.Scene();

// Load Spline scene
const loader = new SplineLoader();
loader.load(
  'https://prod.spline.design/OtRbkxmenw5vEE5O/scene.splinecode',
  (splineScene) => {
    scene.add(splineScene);
  },
  undefined,
  (error) => {
    console.error("Error loading Spline scene:", error);
  }
);

// Renderer settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
scene.background = new THREE.Color('#2d2e32');

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.125;

// Handle window resize
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect * 500;
  camera.right = aspect * 500;
  camera.top = 500;
  camera.bottom = -500;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);