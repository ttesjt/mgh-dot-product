import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';



export async function createNormalArrows(scene, options = {}, lightSource) {
  const loader = new FBXLoader();
  const { scale = 0.1, position = { x: 0, y: 0, z: -5 } } = options;

  const fbx = await new Promise((resolve, reject) => {
    loader.load('./models/normal.fbx', resolve, undefined, reject);
  });

  fbx.scale.set(scale, scale, scale);
  fbx.position.set(position.x, position.y, position.z);
  const groundNormalMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = groundNormalMaterial;
    }
  });
  const pointerUpPosition = new THREE.Vector3(fbx.position.x, fbx.position.y + 1, fbx.position.z);
  fbx.lookAt(pointerUpPosition);
  scene.add(fbx);

  const lightSourcePointer = await new Promise((resolve, reject) => {
    loader.load('./models/lightPointer.fbx', resolve, undefined, reject);
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

  const fontLoader = new FontLoader();
  const font = await new Promise((resolve, reject) => {
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', resolve, undefined, reject);
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const dotProductTextGeometry = new TextGeometry("Light dot Normal = 0", {
    font: font,
    size: 0.2,
    depth: 0.0001,
  });
  const dotProductText = new THREE.Mesh(dotProductTextGeometry, textMaterial);
  dotProductText.position.set(position.x + 1, position.y + 4, position.z);
  scene.add(dotProductText);

  function updateDotProductText(dotProduct) {
    const text = `Light dot Normal = ${dotProduct.toFixed(2)}`;
    dotProductText.geometry.dispose();
    dotProductText.geometry = new TextGeometry(text, {
      font: font,
      size: 0.2,
      depth: 0.0001,
    });
  }

  const directionVector = new THREE.Vector3();
  lightSourcePointer.update = () => {
    directionVector.subVectors(lightSource.position, lightSourcePointer.position).normalize();
    lightSourcePointer.lookAt(lightSource.position);

    const dotProduct = directionVector.dot(new THREE.Vector3(0, 1, 0));
    updateDotProductText(dotProduct);
  };
  lightSourcePointer.update();

  return { groundNormalPointer: fbx, lightSourcePointer };
}