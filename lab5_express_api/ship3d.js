import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('ship-canvas');
if (!canvas) {
  console.warn('Canvas #ship-canvas not found');
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xa7c6dd, 18, 40);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(7.5, 3.8, 9);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1.2, 0);
  controls.minDistance = 5;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.48;

  const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x204060, 1.05);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1.35);
  sun.position.set(7, 10, 3);
  sun.castShadow = true;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x89b7ff, 0.55);
  fill.position.set(-5, 4, -6);
  scene.add(fill);

  const ship = new THREE.Group();

  const hullMat = new THREE.MeshPhysicalMaterial({
    color: 0x123e65,
    metalness: 0.65,
    roughness: 0.28,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
  });
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xd6dde6, metalness: 0.22, roughness: 0.58 });
  const cabinMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f4f8,
    metalness: 0.25,
    roughness: 0.35,
    clearcoat: 0.35,
  });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xf6b73c, metalness: 0.2, roughness: 0.4 });
  const windowMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fd0ff,
    transmission: 0.65,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0,
  });

  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 3.7, 8, 22), hullMat);
  hull.rotation.z = Math.PI / 2;
  hull.scale.set(1, 0.78, 0.95);
  hull.position.y = 0.72;
  ship.add(hull);

  const keel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 0.36), hullMat);
  keel.position.set(0, 0.23, 0);
  ship.add(keel);

  const stern = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 1.28), hullMat);
  stern.position.set(-2.2, 0.75, 0);
  ship.add(stern);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.18, 1.15), deckMat);
  deck.position.set(0.2, 1.18, 0);
  ship.add(deck);

  const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.84, 1.02), cabinMat);
  cabinBase.position.set(-0.2, 1.7, 0);
  ship.add(cabinBase);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.58, 0.86), cabinMat);
  bridge.position.set(0.72, 1.82, 0);
  ship.add(bridge);

  const windowBand = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.26, 1.04), windowMat);
  windowBand.position.set(-0.17, 1.78, 0);
  ship.add(windowBand);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.5, 20), accentMat);
  chimney.position.set(-0.95, 2.28, 0);
  ship.add(chimney);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.3, 12), deckMat);
  mast.position.set(0.35, 2.42, 0);
  ship.add(mast);

  const radar = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.16), accentMat);
  radar.position.set(0.35, 2.86, 0);
  ship.add(radar);

  const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.07, 1.36), accentMat);
  sideStripe.position.set(0.05, 1.03, 0);
  ship.add(sideStripe);

  const propellerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 18), deckMat);
  propellerGuard.rotation.y = Math.PI / 2;
  propellerGuard.position.set(-2.45, 0.63, 0);
  ship.add(propellerGuard);

  const wake = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 1.1),
    new THREE.MeshBasicMaterial({ color: 0xd5ebf9, transparent: true, opacity: 0.38 })
  );
  wake.rotation.x = -Math.PI / 2;
  wake.position.set(-3.45, 0.06, 0);
  scene.add(wake);

  const waterGeo = new THREE.CircleGeometry(16, 120);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x7fb5da,
    roughness: 0.35,
    metalness: 0.16,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0;
  scene.add(water);

  ship.rotation.y = -0.35;
  ship.position.y = 0.08;
  scene.add(ship);

  const clock = new THREE.Clock();

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    resize();

    const t = clock.getElapsedTime();
    ship.rotation.y += 0.0018;
    ship.position.y = 0.08 + Math.sin(t * 1.35) * 0.06;
    ship.rotation.z = Math.sin(t * 0.95) * 0.02;
    ship.rotation.x = Math.cos(t * 1.15) * 0.015;

    wake.material.opacity = 0.28 + Math.sin(t * 3.1) * 0.09;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
