import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { addModelToDB, getAllModelsFromDB } from './idb.js';

const PRESETS = [
  { id: 1, title: 'Фрегат проекта F-2', model: 'models/frigate.glb' },
  { id: 2, title: 'Патрульный корабль P-1', model: 'models/patrol.glb' },
  { id: 3, title: 'Судно снабжения S-3', model: 'models/supply.glb' },
  {
    id: 4,
    title: 'Охрана + снабжение',
    models: [{ model: 'models/patrol.glb' }, { model: 'models/supply.glb' }],
  },
];

const cardList = document.getElementById('card-list');
const uploadInput = document.getElementById('uploadModel');
let userModels = [];

getAllModelsFromDB().then((models) => {
  userModels = models;
  renderCards();
});

function renderCards() {
  cardList.innerHTML = '';
  PRESETS.forEach((model) => addCard(model, false, model.id));
  userModels.forEach((model) => addCard(model, true, model.id));
}

function addCard(model, isUser, userId) {
  const card = document.createElement('article');
  card.className = 'gallery-card';

  const previewCanvas = document.createElement('canvas');
  previewCanvas.className = 'preview-canvas';
  previewCanvas.width = 260;
  previewCanvas.height = 170;
  card.appendChild(previewCanvas);

  renderPreviewModelToCanvas(model, isUser, previewCanvas);

  const title = document.createElement('h3');
  title.className = 'gallery-card-title';
  title.textContent = model.title || 'Пользовательская модель';
  card.appendChild(title);

  card.addEventListener('click', () => {
    const href = isUser ? `model-detail.html?user=${userId}` : `model-detail.html?id=${model.id}`;
    window.location.href = href;
  });

  cardList.appendChild(card);
}

function renderPreviewModelToCanvas(model, isUser, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0xeaf5ff, 1);
  renderer.setSize(canvas.width, canvas.height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 0.7, 2);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(2, 6, 4);
  scene.add(light);

  const loader = new GLTFLoader();

  function normalizeModelToFloor(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    obj.position.x -= center.x;
    obj.position.z -= center.z;
    obj.position.y -= box.min.y;

    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      obj.scale.multiplyScalar(1.1 / maxDim);
    }
  }

  const drawFallback = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#dde6f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '56px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666';
    ctx.fillText('🧩', canvas.width / 2, canvas.height / 2);
  };

  if (isUser && model.buffer) {
    loader.parse(
      model.buffer,
      '',
      (gltf) => {
        const obj = gltf.scene;
        normalizeModelToFloor(obj);
        scene.add(obj);
        renderer.render(scene, camera);
      },
      drawFallback
    );
  } else if (model.model) {
    loader.load(
      model.model,
      (gltf) => {
        const obj = gltf.scene;
        normalizeModelToFloor(obj);
        scene.add(obj);
        renderer.render(scene, camera);
      },
      undefined,
      drawFallback
    );
  } else if (model.models && Array.isArray(model.models)) {
    const gap = 0.6;
    let loaded = 0;
    model.models.forEach((m, idx) => {
      loader.load(
        m.model,
        (gltf) => {
          const obj = gltf.scene;
          normalizeModelToFloor(obj);
          obj.position.x = idx === 0 ? -gap : gap;
          scene.add(obj);
          loaded += 1;
          if (loaded === 2) renderer.render(scene, camera);
        },
        undefined,
        () => {
          loaded += 1;
          if (loaded === 2) renderer.render(scene, camera);
        }
      );
    });
  } else {
    drawFallback();
  }
}

uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const modelObj = {
        title: file.name,
        buffer: e.target.result,
        filename: file.name,
      };

      addModelToDB(modelObj).then((id) => {
        modelObj.id = id;
        userModels.push(modelObj);
        renderCards();
      });
    };
    reader.readAsArrayBuffer(file);
  });
});
