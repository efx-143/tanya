/**
 * ===================================================================
 * 🌌 3D INTERACTIVE CELESTIAL ENGINE (THREE.JS)
 * ===================================================================
 * Features:
 * 1. Background Cosmic Stardust Galaxy & Pulsing 3D Heart Constellation
 * 2. Interactive 3D Tiered Birthday Cake with 360° OrbitControls & Blowable Flame Physics
 * 3. 3D Floating Wishing Sky Lanterns (Tangled-style Lantern Festival)
 */

class Cosmic3DManager {
  constructor() {
    this.bgScene = null;
    this.bgCamera = null;
    this.bgRenderer = null;
    this.starPoints = null;
    this.constellationHeart = null;
    this.shootingStars = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.cakeScene = null;
    this.cakeCamera = null;
    this.cakeRenderer = null;
    this.cakeControls = null;
    this.cakeGroup = null;
    this.candles = [];
    this.flames = [];
    this.flameLights = [];
    this.smokeParticles = [];
    this.candlesLit = true;
    this.cakeSlice = null;

    this.lanternScene = null;
    this.lanternCamera = null;
    this.lanternRenderer = null;
    this.lanterns = [];

    this.clock = new THREE.Clock();
  }

  initAll() {
    this.initBackgroundGalaxy();
    this.initBirthdayCakeScene();
    this.initLanternSkyScene();
    this.bindEvents();
    this.animate();
  }

  // -------------------------------------------------------------
  // 1. BACKGROUND COSMIC GALAXY & HEART CONSTELLATION
  // -------------------------------------------------------------
  initBackgroundGalaxy() {
    const container = document.getElementById('bg-canvas-container');
    if (!container) return;

    this.bgScene = new THREE.Scene();
    this.bgScene.fog = new THREE.FogExp2(0x060613, 0.0012);

    this.bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.bgCamera.position.z = 400;

    this.bgRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.bgRenderer.setSize(window.innerWidth, window.innerHeight);
    this.bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.bgRenderer.domElement);

    // 1.1 Stardust Galaxy (3,500 glowing stars)
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff), // Pure starlight
      new THREE.Color(0xffb3c6), // Soft rose
      new THREE.Color(0xffd166), // Warm gold
      new THREE.Color(0xc77dff), // Lavender
      new THREE.Color(0x90e0ef)  // Ice blue
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 250 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom star sprite material
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,230,240,0.8)');
    grad.addColorStop(0.7, 'rgba(255,107,157,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const starTex = new THREE.CanvasTexture(starCanvas);
    const starMat = new THREE.PointsMaterial({
      size: 4.5,
      map: starTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.bgScene.add(this.starPoints);

    // 1.2 Glowing 3D Heart Constellation in the Cosmos
    this.createHeartConstellation();

    // 1.3 Nebula Clouds
    this.createNebulaDust();
  }

  createHeartConstellation() {
    this.constellationHeart = new THREE.Group();

    const heartPoints = [];
    const segments = 120;
    // Parametric 3D heart formula
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.sin(t * 3) * 3);
      heartPoints.push(new THREE.Vector3(x * 5.5, y * 5.5, z * 5.5));
    }

    // Line loop connecting constellation
    const lineGeo = new THREE.BufferGeometry().setFromPoints(heartPoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.LineLoop(lineGeo, lineMat);
    this.constellationHeart.add(line);

    // Glowing star nodes on vertices
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(heartPoints);
    const nodeMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 7,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    this.constellationHeart.add(nodes);

    this.constellationHeart.position.set(0, 30, -50);
    this.bgScene.add(this.constellationHeart);
  }

  createNebulaDust() {
    const nebulaCount = 45;
    const nebGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 600;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 500;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    // Large soft puff
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(219, 39, 119, 0.15)');
    pGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
    pGrad.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const nebTex = new THREE.CanvasTexture(pCanvas);
    const nebMat = new THREE.PointsMaterial({
      size: 180,
      map: nebTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebGeo, nebMat);
    this.bgScene.add(nebula);
  }

  // -------------------------------------------------------------
  // 2. INTERACTIVE 3D TIERED BIRTHDAY CAKE SCENE
  // -------------------------------------------------------------
  initBirthdayCakeScene() {
    const container = document.getElementById('cake-3d-canvas-container');
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    this.cakeScene = new THREE.Scene();

    const isMobile = window.innerWidth < 640;
    this.cakeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.cakeCamera.position.set(0, isMobile ? 26 : 24, isMobile ? 56 : 46);

    this.cakeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.cakeRenderer.setSize(width, height);
    this.cakeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.cakeRenderer.shadowMap.enabled = true;
    this.cakeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.cakeRenderer.domElement);

    // OrbitControls for 360-degree rotation & inspection
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.cakeControls = new THREE.OrbitControls(this.cakeCamera, this.cakeRenderer.domElement);
      this.cakeControls.enableDamping = true;
      this.cakeControls.dampingFactor = 0.05;
      this.cakeControls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below cake table
      this.cakeControls.minDistance = isMobile ? 26 : 22;
      this.cakeControls.maxDistance = isMobile ? 85 : 75;
      this.cakeControls.autoRotate = true;
      this.cakeControls.autoRotateSpeed = 1.0;
      this.cakeControls.enablePan = false; // Disable panning so it never shifts offscreen
      this.cakeControls.rotateSpeed = 0.7; // Smooth touch rotation
      this.cakeControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }

    // Lighting setup for cake
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.85);
    this.cakeScene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    mainLight.position.set(20, 45, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    this.cakeScene.add(mainLight);

    const rimLight = new THREE.PointLight(0xff6b9d, 1.2, 50);
    rimLight.position.set(-20, 20, -20);
    this.cakeScene.add(rimLight);

    // Build the Cake Geometry
    this.buildCake();
  }

  buildCake() {
    this.cakeGroup = new THREE.Group();
    this.cakeScene.add(this.cakeGroup);

    // 1. Golden Pedestal / Plate
    const plateGeo = new THREE.CylinderGeometry(18, 17, 1.2, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xf5d061,
      metalness: 0.85,
      roughness: 0.25
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.6;
    plate.receiveShadow = true;
    this.cakeGroup.add(plate);

    // Golden beaded rim on plate
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const beadGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const bead = new THREE.Mesh(beadGeo, plateMat);
      bead.position.set(Math.cos(angle) * 17.5, 0.1, Math.sin(angle) * 17.5);
      this.cakeGroup.add(bead);
    }

    // 2. Bottom Tier: Dark Velvet & Strawberry Cream
    const bottomGeo = new THREE.CylinderGeometry(14, 14, 6.5, 64);
    const bottomMat = new THREE.MeshStandardMaterial({
      color: 0xff6b9d, // Rose strawberry
      roughness: 0.35
    });
    const bottomTier = new THREE.Mesh(bottomGeo, bottomMat);
    bottomTier.position.y = 3.25;
    bottomTier.castShadow = true;
    bottomTier.receiveShadow = true;
    this.cakeGroup.add(bottomTier);

    // Decorative whipped cream piping on bottom tier edge
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const dollopGeo = new THREE.SphereGeometry(0.75, 16, 16);
      dollopGeo.scale(1, 0.7, 1);
      const dollopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const dollop = new THREE.Mesh(dollopGeo, dollopMat);
      dollop.position.set(Math.cos(angle) * 14.1, 6.5, Math.sin(angle) * 14.1);
      this.cakeGroup.add(dollop);
    }

    // 3. Top Tier: Vanilla Whipped Frosting & Chocolate Drips
    const topGeo = new THREE.CylinderGeometry(9.5, 9.5, 5.5, 64);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f5, // Soft pastel cream
      roughness: 0.25
    });
    const topTier = new THREE.Mesh(topGeo, topMat);
    topTier.position.y = 9.25;
    topTier.castShadow = true;
    topTier.receiveShadow = true;
    this.cakeGroup.add(topTier);

    // Chocolate drip accents on top tier
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dripLength = 1.0 + Math.sin(i * 1.5) * 1.2;
      const dripGeo = new THREE.CylinderGeometry(0.5, 0.2, dripLength, 12);
      const dripMat = new THREE.MeshStandardMaterial({ color: 0x4a1525, roughness: 0.1 });
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.position.set(Math.cos(angle) * 9.6, 12 - (dripLength / 2), Math.sin(angle) * 9.6);
      this.cakeGroup.add(drip);
    }

    // Strawberries / Cherries on top
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const berryGeo = new THREE.SphereGeometry(1.0, 16, 16);
      berryGeo.scale(1, 1.2, 1);
      const berryMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.15 });
      const berry = new THREE.Mesh(berryGeo, berryMat);
      berry.position.set(Math.cos(angle) * 7.5, 12.6, Math.sin(angle) * 7.5);
      this.cakeGroup.add(berry);
    }

    // 4. Cake Topper: 3D Golden Heart & Banner "Anokhee"
    this.createCakeTopper();

    // 5. Candles with Animated Flickering Flames
    this.createCandles();
  }

  createCakeTopper() {
    const topperGroup = new THREE.Group();

    // 3D Heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 1.5, -2, 3, -3.5, 3);
    heartShape.bezierCurveTo(-5.5, 3, -5.5, 0.5, -5.5, 0.5);
    heartShape.bezierCurveTo(-5.5, -1.5, -3.5, -3.5, 0, -5.5);
    heartShape.bezierCurveTo(3.5, -3.5, 5.5, -1.5, 5.5, 0.5);
    heartShape.bezierCurveTo(5.5, 0.5, 5.5, 3, 3.5, 3);
    heartShape.bezierCurveTo(2, 3, 0, 1.5, 0, 0);

    const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.9,
      roughness: 0.15
    });

    const heartMesh = new THREE.Mesh(heartGeo, goldMat);
    heartMesh.rotation.z = Math.PI;
    heartMesh.scale.set(0.65, 0.65, 0.65);
    heartMesh.position.set(0, 19, 0);
    topperGroup.add(heartMesh);

    // Stem holding the heart
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, 5, 12);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    stem.position.set(0, 14.5, 0);
    topperGroup.add(stem);

    this.cakeGroup.add(topperGroup);
  }

  createCandles() {
    this.candles = [];
    this.flames = [];
    this.flameLights = [];

    const candleCount = 3;
    const offsets = [
      { x: -3.8, z: 2.2 },
      { x: 3.8, z: 2.2 },
      { x: 0, z: -4.0 }
    ];

    offsets.forEach((pos, idx) => {
      // Candle Body (Striped Cylinder)
      const candleGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.5, 24);
      const candleMat = new THREE.MeshStandardMaterial({
        color: idx === 1 ? 0xff477e : 0xffd166,
        roughness: 0.4
      });
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(pos.x, 14.25, pos.z);
      candle.castShadow = true;
      this.cakeGroup.add(candle);
      this.candles.push(candle);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(pos.x, 16.7, pos.z);
      this.cakeGroup.add(wick);

      // Flame Geometry (Teardrop shape)
      const flameGeo = new THREE.SphereGeometry(0.5, 16, 16);
      flameGeo.scale(0.7, 1.8, 0.7);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffa600,
        transparent: true,
        opacity: 0.95
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(pos.x, 17.6, pos.z);
      this.cakeGroup.add(flame);
      this.flames.push(flame);

      // Inner Core Flame (Blue/White intense core)
      const coreGeo = new THREE.SphereGeometry(0.25, 12, 12);
      coreGeo.scale(0.6, 1.4, 0.6);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(pos.x, 17.3, pos.z);
      this.cakeGroup.add(core);
      this.flames.push(core);

      // Warm Point Light radiating from candle
      const candleLight = new THREE.PointLight(0xff9e00, 1.5, 14);
      candleLight.position.set(pos.x, 17.6, pos.z);
      this.cakeScene.add(candleLight);
      this.flameLights.push(candleLight);
    });
  }

  // Blow out candles with realistic smoke particles & sound
  blowOutCandles() {
    if (!this.candlesLit) return false;
    this.candlesLit = false;

    // Extinguish flames & lights
    this.flames.forEach(f => {
      f.visible = false;
    });
    this.flameLights.forEach(l => {
      l.intensity = 0;
    });

    // Spawn smoke particles rising from wicks
    this.spawnSmokeParticles();

    // Trigger audio SFX
    if (window.romanticAudio) {
      window.romanticAudio.playBlowSound();
      setTimeout(() => {
        window.romanticAudio.playFireworkSound();
      }, 350);
    }

    return true;
  }

  relightCandles() {
    this.candlesLit = true;
    this.flames.forEach(f => {
      f.visible = true;
      f.scale.set(1, 1, 1);
    });
    this.flameLights.forEach(l => {
      l.intensity = 1.5;
    });
    if (window.romanticAudio) {
      window.romanticAudio.playSparkleSound();
    }
  }

  spawnSmokeParticles() {
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.6
    });

    const positions = [
      { x: -3.8, z: 2.2 },
      { x: 3.8, z: 2.2 },
      { x: 0, z: -4.0 }
    ];

    positions.forEach(p => {
      for (let i = 0; i < 18; i++) {
        const size = 0.2 + Math.random() * 0.4;
        const puffGeo = new THREE.SphereGeometry(size, 8, 8);
        const puff = new THREE.Mesh(puffGeo, smokeMat.clone());
        puff.position.set(
          p.x + (Math.random() - 0.5) * 0.4,
          16.9 + (Math.random() * 0.5),
          p.z + (Math.random() - 0.5) * 0.4
        );
        puff.userData = {
          vy: 0.08 + Math.random() * 0.08,
          vx: (Math.random() - 0.5) * 0.03,
          vz: (Math.random() - 0.5) * 0.03,
          growth: 1.025,
          life: 1.0
        };
        this.cakeGroup.add(puff);
        this.smokeParticles.push(puff);
      }
    });
  }

  // -------------------------------------------------------------
  // 3. 3D FLOATING WISHING SKY LANTERNS
  // -------------------------------------------------------------
  initLanternSkyScene() {
    const container = document.getElementById('lantern-3d-container');
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    this.lanternScene = new THREE.Scene();
    this.lanternScene.fog = new THREE.FogExp2(0x050410, 0.002);

    this.lanternCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.lanternCamera.position.set(0, 15, 60);

    this.lanternRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.lanternRenderer.setSize(width, height);
    this.lanternRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.lanternRenderer.domElement);

    const amb = new THREE.AmbientLight(0x221a3a, 1.2);
    this.lanternScene.add(amb);

    // Spawn ambient background lanterns
    for (let i = 0; i < 40; i++) {
      this.createLantern(
        (Math.random() - 0.5) * 140,
        Math.random() * 80 - 20,
        -Math.random() * 120 - 20,
        0.5 + Math.random() * 0.8,
        false
      );
    }
  }

  createLantern(x, y, z, scale = 1, isUserWish = false, wishText = '') {
    const group = new THREE.Group();

    // Cylindrical glowing paper body
    const bodyGeo = new THREE.CylinderGeometry(2.4, 2.0, 5.2, 16, 1, true);
    const bodyMat = new THREE.MeshBasicMaterial({
      color: isUserWish ? 0xffdd55 : 0xffa040,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Wooden rim caps
    const capGeo = new THREE.TorusGeometry(2.4, 0.12, 8, 24);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x3d2617 });
    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.rotation.x = Math.PI / 2;
    topCap.position.y = 2.6;
    group.add(topCap);

    const bottomCap = topCap.clone();
    bottomCap.position.y = -2.6;
    bottomCap.scale.set(0.85, 0.85, 0.85);
    group.add(bottomCap);

    // Glowing Inner Flame
    const flameGeo = new THREE.SphereGeometry(0.7, 12, 12);
    flameGeo.scale(0.8, 1.6, 0.8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = -1.2;
    group.add(flame);

    // PointLight illuminating surrounding
    const light = new THREE.PointLight(0xffaa33, isUserWish ? 3.0 : 1.2, 25);
    light.position.y = -1.2;
    group.add(light);

    group.position.set(x, y, z);
    group.scale.set(scale, scale, scale);

    group.userData = {
      isUserWish: isUserWish,
      vy: 0.12 + Math.random() * 0.08,
      wobbleSpeed: 1.0 + Math.random() * 1.5,
      wobbleAmp: 0.3 + Math.random() * 0.3,
      timeOffset: Math.random() * 10
    };

    if (this.lanternScene) {
      this.lanternScene.add(group);
      this.lanterns.push(group);
    }

    return group;
  }

  releaseUserWishLantern(wishText) {
    if (!this.lanternScene) return;
    // Spawn prominent user lantern at center front
    const userLantern = this.createLantern(0, -10, 20, 1.6, true, wishText);
    userLantern.userData.vy = 0.22; // Ascends majestically

    if (window.romanticAudio) {
      window.romanticAudio.playSparkleSound();
    }
  }

  // -------------------------------------------------------------
  // ANIMATION LOOP & EVENTS
  // -------------------------------------------------------------
  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - window.innerWidth / 2) * 0.001;
      this.mouse.targetY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    // Touch support for parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX - window.innerWidth / 2) * 0.001;
        this.mouse.targetY = (e.touches[0].clientY - window.innerHeight / 2) * 0.001;
      }
    });
  }

  onWindowResize() {
    if (this.bgCamera && this.bgRenderer) {
      this.bgCamera.aspect = window.innerWidth / window.innerHeight;
      this.bgCamera.updateProjectionMatrix();
      this.bgRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    const cakeContainer = document.getElementById('cake-3d-canvas-container');
    if (cakeContainer && this.cakeCamera && this.cakeRenderer) {
      const w = cakeContainer.clientWidth;
      const h = cakeContainer.clientHeight;
      this.cakeCamera.aspect = w / h;
      this.cakeCamera.updateProjectionMatrix();
      this.cakeRenderer.setSize(w, h);
    }

    const lanternContainer = document.getElementById('lantern-3d-container');
    if (lanternContainer && this.lanternCamera && this.lanternRenderer) {
      const lw = lanternContainer.clientWidth;
      const lh = lanternContainer.clientHeight;
      this.lanternCamera.aspect = lw / lh;
      this.lanternCamera.updateProjectionMatrix();
      this.lanternRenderer.setSize(lw, lh);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Update Background Galaxy
    if (this.bgScene && this.bgRenderer) {
      if (this.starPoints) {
        this.starPoints.rotation.y = elapsedTime * 0.02 + this.mouse.x * 0.5;
        this.starPoints.rotation.x = this.mouse.y * 0.5;
      }
      if (this.constellationHeart) {
        this.constellationHeart.rotation.y = Math.sin(elapsedTime * 0.4) * 0.15 + this.mouse.x;
        // Heartbeat rhythmic scale
        const heartPulse = 1 + Math.pow(Math.sin(elapsedTime * 2.5), 10) * 0.08;
        this.constellationHeart.scale.set(heartPulse, heartPulse, heartPulse);
      }
      this.bgRenderer.render(this.bgScene, this.bgCamera);
    }

    // 2. Update Cake Scene
    if (this.cakeScene && this.cakeRenderer) {
      if (this.cakeControls) {
        this.cakeControls.update();
      }

      // Candle Flame flickering
      if (this.candlesLit && this.flames.length > 0) {
        this.flames.forEach((flame, idx) => {
          const flicker = 1.0 + Math.sin(elapsedTime * 18 + idx * 2) * 0.12;
          flame.scale.y = 1.8 * flicker;
          flame.scale.x = 0.7 * (2 - flicker);
          flame.position.x += Math.sin(elapsedTime * 14 + idx) * 0.015;
        });
        this.flameLights.forEach((light, idx) => {
          light.intensity = 1.4 + Math.sin(elapsedTime * 20 + idx) * 0.3;
        });
      }

      // Smoke particle dissipation
      for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
        const puff = this.smokeParticles[i];
        puff.position.y += puff.userData.vy;
        puff.position.x += puff.userData.vx;
        puff.position.z += puff.userData.vz;
        puff.scale.multiplyScalar(puff.userData.growth);
        puff.material.opacity *= 0.96;
        puff.userData.life -= 0.018;

        if (puff.userData.life <= 0 || puff.material.opacity <= 0.01) {
          this.cakeGroup.remove(puff);
          this.smokeParticles.splice(i, 1);
        }
      }

      this.cakeRenderer.render(this.cakeScene, this.cakeCamera);
    }

    // 3. Update Lantern Sky Scene
    if (this.lanternScene && this.lanternRenderer) {
      this.lanterns.forEach(lantern => {
        lantern.position.y += lantern.userData.vy;
        lantern.position.x += Math.sin(elapsedTime * lantern.userData.wobbleSpeed + lantern.userData.timeOffset) * 0.04;
        lantern.rotation.y = elapsedTime * 0.3 + lantern.userData.timeOffset;
        lantern.rotation.z = Math.sin(elapsedTime * lantern.userData.wobbleSpeed) * 0.05;

        // Loop background lanterns back down when they reach top
        if (lantern.position.y > 90) {
          if (!lantern.userData.isUserWish) {
            lantern.position.y = -30;
            lantern.position.x = (Math.random() - 0.5) * 120;
          }
        }
      });

      this.lanternRenderer.render(this.lanternScene, this.lanternCamera);
    }
  }
}

// Global instance
window.cosmic3D = new Cosmic3DManager();

