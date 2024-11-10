import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';

export async function createNormalArrows(scene, options = {}, lightSource) {
  const loader = new FBXLoader();
  const { scale = 0.1, position = { x: 0, y: 0, z: -5 } } = options;

  const fbx = await new Promise((resolve, reject) => {
    loader.load('/src/assets/models/normal.fbx', resolve, undefined, reject);
  });
  fbx.scale.set(scale, scale, scale);
  fbx.position.set(position.x, position.y, position.z);
  const groundNormalMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = groundNormalMaterial;
    }
  });

  // Make the ground normal pointer look upward along the Y-axis
  const pointerUpPosition = new THREE.Vector3(
    fbx.position.x,
    fbx.position.y + 1,
    fbx.position.z
  );
  fbx.lookAt(pointerUpPosition);
  scene.add(fbx);



  const lightSourcePointer = await new Promise((resolve, reject) => {
    loader.load('/src/assets/models/lightPointer.fbx', resolve, undefined, reject);
  });
  lightSourcePointer.scale.set(scale, scale, scale);
  lightSourcePointer.position.set(position.x, position.y, position.z);
  const lightSourceMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  lightSourcePointer.traverse((child) => {
    if (child.isMesh) {
      child.material = lightSourceMaterial;
    }
  });
  scene.add(lightSourcePointer);

  const directionVector = new THREE.Vector3();
  lightSourcePointer.update = () => {
    // Calculate the direction from the light source pointer to the light source
    directionVector.subVectors(lightSource.position, lightSourcePointer.position).normalize();
    lightSourcePointer.lookAt(lightSource.position);
    // console.log('Euler angles:', {
    //   x: lightSourcePointer.rotation.x,
    //   y: lightSourcePointer.rotation.y,
    //   z: lightSourcePointer.rotation.z,
    // });
  };
  lightSourcePointer.update();

  return { groundNormalPointer: fbx, lightSourcePointer };
}