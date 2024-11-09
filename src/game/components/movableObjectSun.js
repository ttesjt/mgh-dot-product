import * as THREE from 'three';

/**
 * Creates a movable object (sun) that can be moved horizontally based on drag distance.
 * A directional light is attached to the sun and points towards a specified target.
 *
 * @param {THREE.Object3D} lightTarget - The target object that the light will always point towards.
 * @returns {Object} An object containing the sun mesh and directional light.
 */
export function createMovableObjectSun(lightTarget) {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffff00 });
  const sun = new THREE.Mesh(geometry, material);
  sun.position.set(0, 1, -5);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.copy(sun.position); // Start at the sun's position
  directionalLight.target = lightTarget;

  /**
   * Moves the sun horizontally based on drag distance and updates the light position.
   * @param {number} dragDistance - The drag distance, positive for right, negative for left.
   */
  sun.moveHorizontally = function (dragDistance) {
    sun.position.x += dragDistance * 0.01;
    directionalLight.position.copy(sun.position);
    // in case the target object also moved, this method will update the light direction basing on the new target position.
    directionalLight.target.updateMatrixWorld();
  };

  return { sun, directionalLight };
}