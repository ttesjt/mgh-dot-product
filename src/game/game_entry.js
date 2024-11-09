import * as THREE from 'three';

/**
 * Initializes and renders a Three.js game scene within a specified container.
 *
 * @function createGameScene
 * @param {HTMLElement} container - The HTML element (div or body) where the game scene will be rendered.
 * 
 * @returns {Object} An object containing references to the `scene`, `camera`, and `renderer` for further interaction if needed.
 * 
 * @description
 * A dot product visualizer.
 */
export function createGameScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x777777, 1);
  scene.add(ambientLight);
  // later the directional light should move with a slider.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 7, 6);
  scene.add(directionalLight);
  // const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  // pointLight.position.set(0, 0, 0);
  // scene.add(pointLight);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(-2, -2, -5);
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  return { scene, camera, renderer };
}