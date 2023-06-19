// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameCanvas').appendChild(renderer.domElement);

// Create a player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Hide the player cube
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// Set initial player position
player.position.set(0, 0, 0);

// Set initial camera position inside the player
camera.position.set(0, 0.5, 0);
player.add(camera);

// Player movement speed
const playerSpeed = 0.05; // Slower walking speed

// Player jump parameters
const jumpHeight = 0.5; // Reduced jump height
const jumpSpeed = Math.sqrt(2 * 9.8 * jumpHeight);
let isJumping = false;
let jumpVelocity = 0;
let initialJumpY = 0;
let groundY = 0; // Ground level
const jumpDuration = 1.0; // Slower jump duration in seconds
let jumpTime = 0;

// Mouse movement tracking
let isMouseLocked = false;
let mouseDeltaX = 0;
let mouseDeltaY = 0;
const mouseSensitivity = 0.002;

// Keyboard input tracking
const keyboard = {};

// Event listeners for keydown and keyup events
window.addEventListener('keydown', (event) => {
  keyboard[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  keyboard[event.code] = false;
});

// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
  if (!isMouseLocked) return;

  mouseDeltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  mouseDeltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
});

// Event listener for mouse click to lock the mouse pointer
window.addEventListener('click', () => {
  isMouseLocked = true;
  document.body.requestPointerLock();
});

// Event listener for pointer lock change
document.addEventListener('pointerlockchange', () => {
  isMouseLocked = (document.pointerLockElement === document.body);
});

// Create objects around the map
const numObjects = 7; // Number of objects to create
const objectGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);




// Load texture images
const textureLoader = new THREE.TextureLoader();
const boxTexture = textureLoader.load('path_to_texture_image.png');
const boxMaterial = new THREE.MeshBasicMaterial({ map: boxTexture });

const objects = [];

for (let i = 0; i < numObjects; i++) {
  const object = new THREE.Mesh(objectGeometry, boxMaterial);
  object.position.set(
    Math.random() * 10 - 5, // Random X position between -5 and 5
    0.25, // Fixed Y position
    Math.random() * 10 - 5 // Random Z position between -5 and 5
  );
  scene.add(object);
  objects.push(object);
}

// Update camera position and orientation
function updateCamera() {
  player.rotation.y -= mouseDeltaX * mouseSensitivity;
  camera.rotation.x -= mouseDeltaY * mouseSensitivity;
  camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

  mouseDeltaX = 0;
  mouseDeltaY = 0;

  // Update camera hitbox position and size based on camera's world position and rotation
  const cameraHitbox = new THREE.Box3().setFromObject(camera);
  camera.hitbox = cameraHitbox;
}

// Check collision between camera hitbox and objects
function checkCollision() {
  const cameraHitbox = camera.hitbox;

  for (const object of objects) {
    const objectBox = new THREE.Box3().setFromObject(object);
    if (cameraHitbox.intersectsBox(objectBox)) {
      // Handle collision between camera hitbox and object
      // For now, we reset the player's position
      player.position.set(0, groundY, 0);
      break;
    }
  }
}

// Player jump
function jump() {
  if (!isJumping && canJump) {
    isJumping = true;
    jumpVelocity = jumpSpeed;
    initialJumpY = player.position.y;
    jumpTime = 0;
    canJump = false;
  }
}
// Check collision between player and wall
function checkCollision() {
  const playerBox = new THREE.Box3().setFromObject(camera);
  const wallBox = new THREE.Box3().setFromObject(wall);

  if (playerBox.intersectsBox(wallBox)) {
    // Handle collision between player and wall
    // Stop player movement
    player.position.copy(previousPlayerPosition);
  }
}

// Update player movement
function updatePlayerMovement() {
  const playerDirection = new THREE.Vector3();
  const playerRotation = player.rotation.y;

  if (keyboard['KeyW'] || keyboard['ArrowUp']) {
    playerDirection.z -= Math.cos(playerRotation) * playerSpeed;
    playerDirection.x -= Math.sin(playerRotation) * playerSpeed;
  }
  if (keyboard['KeyA'] || keyboard['ArrowLeft']) {
    playerDirection.z -= Math.cos(playerRotation + Math.PI / 2) * playerSpeed;
    playerDirection.x -= Math.sin(playerRotation + Math.PI / 2) * playerSpeed;
  }
  if (keyboard['KeyS'] || keyboard['ArrowDown']) {
    playerDirection.z += Math.cos(playerRotation) * playerSpeed;
    playerDirection.x += Math.sin(playerRotation) * playerSpeed;
  }
  if (keyboard['KeyD'] || keyboard['ArrowRight']) {
    playerDirection.z += Math.cos(playerRotation + Math.PI / 2) * playerSpeed;
    playerDirection.x += Math.sin(playerRotation + Math.PI / 2) * playerSpeed;
  }

  // Store previous player position for collision detection
  previousPlayerPosition.copy(player.position);

  // Update player position
  player.position.add(playerDirection);

  // Check collision with wall
  checkCollision();
}

// Game loop
function animate() {
  requestAnimationFrame(animate);

  // ...

  // Update player movement
  updatePlayerMovement();

  // ...

  renderer.render(scene, camera);
}




// Game loop
function animate() {
  requestAnimationFrame(animate);

  // Move player based on keyboard input
  const playerDirection = new THREE.Vector3();
  const playerRotation = player.rotation.y;

  if (keyboard['KeyW'] || keyboard['ArrowUp']) {
    playerDirection.z -= Math.cos(playerRotation) * playerSpeed;
    playerDirection.x -= Math.sin(playerRotation) * playerSpeed;
  }
  if (keyboard['KeyA'] || keyboard['ArrowLeft']) {
    playerDirection.z -= Math.cos(playerRotation + Math.PI / 2) * playerSpeed;
    playerDirection.x -= Math.sin(playerRotation + Math.PI / 2) * playerSpeed;
  }
  if (keyboard['KeyS'] || keyboard['ArrowDown']) {
    playerDirection.z += Math.cos(playerRotation) * playerSpeed;
    playerDirection.x += Math.sin(playerRotation) * playerSpeed;
  }
  if (keyboard['KeyD'] || keyboard['ArrowRight']) {
    playerDirection.z += Math.cos(playerRotation + Math.PI / 2) * playerSpeed;
    playerDirection.x += Math.sin(playerRotation + Math.PI / 2) * playerSpeed;
  }
  if (keyboard['Space']) {
    jump();
  }

  player.position.add(playerDirection);

  // Apply gravity and update jump
  if (isJumping) {
    jumpTime += 0.016; // Time elapsed since last frame (assuming 60 FPS)
    const t = Math.min(jumpTime / jumpDuration, 1); // Normalized time [0, 1]

    const jumpOffset = jumpVelocity * t - 0.5 * 9.8 * t * t; // Calculate jump offset using physics equation

    player.position.y = initialJumpY + jumpOffset;
    if (player.position.y < groundY) {
      player.position.y = groundY;
      isJumping = false;
      jumpVelocity = 0;
    }
  } else if (player.position.y > groundY) {
    player.position.y -= 0.05; // Gravity
  } else {
    canJump = true;
  }

  updateCamera();
  checkCollision();

  renderer.render(scene, camera);
}
// ...

// Load ground texture
const groundTexture = new THREE.TextureLoader().load('path_to_ground_texture.png');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10); // Adjust the repeat values based on the size of your ground

// Create ground material
const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });

// Create ground geometry
const groundGeometry = new THREE.PlaneGeometry(10, 10); // Adjust the size of the ground plane as needed

// Create ground mesh
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
scene.add(ground);

// Load sky texture
const skyTexture = new THREE.TextureLoader().load('path_to_sky_texture.png');

// Create sky material
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });

// Create sky geometry (a large sphere or box)
const skyGeometry = new THREE.SphereGeometry(100, 32, 32); // Adjust the size of the sphere as needed

// Create sky mesh
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// ...

const wallTexture = new THREE.TextureLoader().load('path_to_wall_texture.png');

// Create wall material
const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });

// Create wall geometry
const wallWidth = 4; // Adjust the width of the wall
const wallHeight = 2; // Adjust the height of the wall
const wallDepth = 0.1; // Adjust the depth of the wall
const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);

// Define the positions of the walls
const wallPositions = [
  { x: 0, y: wallHeight / 2, z: -5 }, // First wall position
  { x: 4, y: wallHeight / 2, z: -5 }, // Second wall position
  { x: -4, y: wallHeight / 2, z: -5 }, // Third wall position
  // Add more positions as needed
];

const wallData = [
  { position: new THREE.Vector3(-5, wallHeight / 2, 1), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
  { position: new THREE.Vector3(-5, wallHeight / 2, 5), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
  { position: new THREE.Vector3(-3, wallHeight / 2, 5), rotation: new THREE.Euler(0, 0, 0) },
  { position: new THREE.Vector3(1, wallHeight / 2, 5), rotation: new THREE.Euler(0, 0, 0) },
  { position: new THREE.Vector3(5, wallHeight / 2, 5), rotation: new THREE.Euler(0, 0, 0) },
  { position: new THREE.Vector3(5, wallHeight / 2, 3), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
  { position: new THREE.Vector3(5, wallHeight / 2, -1), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
  { position: new THREE.Vector3(5, wallHeight / 2, -5), rotation: new THREE.Euler(0, Math.PI / 2, 0) },
  // Add more entries as needed
];






const walls = wallData.map((data) => {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.copy(data.position);
  wall.rotation.copy(data.rotation);
  scene.add(wall);
  return wall;
});

// Add the walls to the objects array
objects.push(...walls);





// Create wall mesh
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(-5, wallHeight / 2, -3); // Adjust the position of the wall
scene.add(wall);



// Create walls using the positions
for (const position of wallPositions) {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(position.x, position.y, position.z);
  scene.add(wall);
}

const wallRotationY = Math.PI / 2; // Rotate 90 degrees clockwise around the y-axis
wall.rotation.y = wallRotationY;


// Start the game loop
animate();
