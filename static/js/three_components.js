/**
 * VERITAS AI - 3D THREE.JS ENGINES & PHYSICAL INTERACTION SYSTEM
 * Implements:
 * 1. Background 3D Cyber Particle Constellation
 * 2. 3D Holographic AI Neural Scanning Engine (Particle Sphere + Laser Mesh)
 * 3. 3D Truth Score Torus Gauge with Dynamic Rotation & Aura
 * 4. 3D Interactive Source Propagation Network Graph (Orbit, Raycasting, Pulses)
 * 5. Card Parallax Tilt & Specular Glare Physics
 * 6. Z-Axis Input Depression & Tactile Button Haptics
 * 7. Web Audio API Cyber Synthesizer
 */

// Global 3D Instances
window.Veritas3D = {
    backgroundScene: null,
    scannerScene: null,
    truthGauge: null,
    propagationMap: null,
    audioFX: null
};

// =============================================================================
// 1. WEB AUDIO API SYNTHESIZER (HIGH-TECH AUDIO FEEDBACK)
// =============================================================================
class CyberAudioFX {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('veritas_sound_fx') !== 'disabled';
        this.initButton();
    }

    initCtx() {
        if (!this.ctx && typeof AudioContext !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initButton() {
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (!soundBtn) return;
        const iconOn = soundBtn.querySelector('.icon-sound-on');
        const iconOff = soundBtn.querySelector('.icon-sound-off');

        const updateUI = () => {
            if (this.enabled) {
                if (iconOn) iconOn.classList.remove('d-none');
                if (iconOff) iconOff.classList.add('d-none');
                soundBtn.title = 'Cyber Sound FX: Enabled';
            } else {
                if (iconOn) iconOn.classList.add('d-none');
                if (iconOff) iconOff.classList.remove('d-none');
                soundBtn.title = 'Cyber Sound FX: Muted';
            }
        };
        updateUI();

        soundBtn.addEventListener('click', () => {
            this.initCtx();
            this.enabled = !this.enabled;
            localStorage.setItem('veritas_sound_fx', this.enabled ? 'enabled' : 'disabled');
            updateUI();
            if (this.enabled) this.playTone(880, 'sine', 0.08, 0.15);
        });
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.12) {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context policy fallback
        }
    }

    playClick() {
        this.playTone(1200, 'triangle', 0.04, 0.08);
    }

    playScanBeep(step = 1) {
        const freqs = [520, 680, 840, 1050];
        const f = freqs[(step - 1) % freqs.length] || 600;
        this.playTone(f, 'sine', 0.12, 0.14);
    }

    playVerdict(isFake) {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (isFake) {
                this.playTone(320, 'sawtooth', 0.35, 0.18);
                setTimeout(() => this.playTone(240, 'sawtooth', 0.45, 0.18), 120);
            } else {
                this.playTone(587, 'sine', 0.2, 0.15);
                setTimeout(() => this.playTone(880, 'sine', 0.35, 0.18), 100);
            }
        } catch (e) {}
    }
}

// =============================================================================
// 2. BACKGROUND 3D STARFIELD & CYBER MATRIX
// =============================================================================
function initBackground3D() {
    const canvas = document.getElementById('bg-canvas-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    // Particle Stars
    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f2fe);
    const colorIndigo = new THREE.Color(0x6366f1);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1200;
        positions[i + 1] = (Math.random() - 0.5) * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 800;

        const choice = Math.random();
        const c = choice < 0.45 ? colorCyan : (choice < 0.8 ? colorIndigo : colorWhite);
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.0004;
        particles.rotation.x += 0.0002;
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.Veritas3D.backgroundScene = scene;
}

// =============================================================================
// 3. 3D HOLOGRAPHIC AI NEURAL SCANNING STAGE
// =============================================================================
class HolographicScanner3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || typeof THREE === 'undefined') return;

        this.width = this.container.clientWidth || 600;
        this.height = this.container.clientHeight || 340;
        this.isScanning = false;
        this.animFrameId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 5, 28);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Ambient & Directional Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00f2fe, 2.5, 50);
        pointLight.position.set(0, 10, 15);
        this.scene.add(pointLight);

        // 1. Holographic Neural Particle Sphere
        const sphereGeo = new THREE.IcosahedronGeometry(7, 2);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        this.sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        this.scene.add(this.sphereMesh);

        // Outer Neural Node Points
        const pGeo = new THREE.IcosahedronGeometry(7.1, 2);
        const pMat = new THREE.PointsMaterial({
            color: 0x00ffe0,
            size: 0.35,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        this.nodePoints = new THREE.Points(pGeo, pMat);
        this.scene.add(this.nodePoints);

        // Inner Quantum Core
        const coreGeo = new THREE.SphereGeometry(2.4, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffb300,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        this.innerCore = new THREE.Mesh(coreGeo, coreMat);
        this.scene.add(this.innerCore);

        // 2. Holographic Wireframe Document Plane
        const docGeo = new THREE.PlaneGeometry(9, 12, 12, 16);
        const docMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
        });
        this.docMesh = new THREE.Mesh(docGeo, docMat);
        this.docMesh.position.set(0, 0, -2);
        this.scene.add(this.docMesh);

        // 3. Sweeping Neon Laser Scanning Bar
        const laserGeo = new THREE.BoxGeometry(11, 0.15, 0.15);
        const laserMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            transparent: true,
            opacity: 0.95
        });
        this.laserBeam = new THREE.Mesh(laserGeo, laserMat);
        this.scene.add(this.laserBeam);

        // Laser Glow Halo
        const glowGeo = new THREE.PlaneGeometry(12, 1.8);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        this.laserGlow = new THREE.Mesh(glowGeo, glowMat);
        this.laserGlow.position.z = 0.05;
        this.laserBeam.add(this.laserGlow);

        // Orbiting Cyber Data Rings
        const ringGeo = new THREE.RingGeometry(9.5, 9.8, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        this.orbitRing1 = new THREE.Mesh(ringGeo, ringMat);
        this.orbitRing1.rotation.x = Math.PI / 3;
        this.scene.add(this.orbitRing1);

        this.laserDirection = 1;
        this.laserY = 0;

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    startScanning() {
        this.isScanning = true;
        this.innerCore.material.color.setHex(0xffb300); // Amber scanning
    }

    stopScanning() {
        this.isScanning = false;
    }

    animate() {
        this.animFrameId = requestAnimationFrame(() => this.animate());

        // Continuous 3D rotation
        if (this.sphereMesh) this.sphereMesh.rotation.y += 0.01;
        if (this.nodePoints) this.nodePoints.rotation.y += 0.01;
        if (this.innerCore) {
            this.innerCore.rotation.x += 0.02;
            this.innerCore.rotation.y -= 0.015;
        }
        if (this.orbitRing1) this.orbitRing1.rotation.z += 0.008;

        // Laser Scanning Sweep
        if (this.laserBeam) {
            this.laserY += 0.12 * this.laserDirection;
            if (this.laserY > 5.5) this.laserDirection = -1;
            if (this.laserY < -5.5) this.laserDirection = 1;
            this.laserBeam.position.y = this.laserY;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.container) return;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 340;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}

// =============================================================================
// 4. 3D TRUTH SCORE TORUS GAUGE
// =============================================================================
class TruthScoreGauge3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || typeof THREE === 'undefined') return;

        this.width = 200;
        this.height = 200;
        this.currentValue = 0;
        this.targetValue = 0;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.camera.position.set(0, 0, 15);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Torus Ring Background Chassis (Dark Metallic)
        const bgTorusGeo = new THREE.TorusGeometry(4.8, 0.45, 20, 64);
        const bgTorusMat = new THREE.MeshBasicMaterial({
            color: 0x1e293b,
            wireframe: false,
            transparent: true,
            opacity: 0.6
        });
        this.bgTorus = new THREE.Mesh(bgTorusGeo, bgTorusMat);
        this.scene.add(this.bgTorus);

        // Active Glowing Arc Ring (Constructed dynamically based on value)
        this.activeArcGroup = new THREE.Group();
        this.scene.add(this.activeArcGroup);

        // Outer Rotating Orbit Particle Ring
        const ringPCount = 48;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(ringPCount * 3);
        for (let i = 0; i < ringPCount; i++) {
            const angle = (i / ringPCount) * Math.PI * 2;
            pPos[i * 3] = Math.cos(angle) * 5.8;
            pPos[i * 3 + 1] = Math.sin(angle) * 5.8;
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0x00f2fe,
            size: 0.28,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        this.orbitPoints = new THREE.Points(pGeo, pMat);
        this.scene.add(this.orbitPoints);

        this.animate();
    }

    updateScore(scorePercent, isFake) {
        this.targetValue = Math.max(0, Math.min(100, scorePercent));
        this.isFake = isFake;
        const colorHex = isFake ? 0xff0844 : 0x00ffe0;

        // Clear existing arc
        while (this.activeArcGroup.children.length > 0) {
            const obj = this.activeArcGroup.children[0];
            this.activeArcGroup.remove(obj);
        }

        // Build filled arc
        const arcLength = (this.targetValue / 100) * Math.PI * 2;
        const arcGeo = new THREE.TorusGeometry(4.8, 0.52, 24, 64, arcLength);
        const arcMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.95
        });
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        arcMesh.rotation.z = Math.PI / 2; // start from top
        arcMesh.rotation.y = Math.PI;
        this.activeArcGroup.add(arcMesh);

        // Update orbit particles color
        if (this.orbitPoints) {
            this.orbitPoints.material.color.setHex(colorHex);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.orbitPoints) this.orbitPoints.rotation.z += 0.015;
        this.bgTorus.rotation.x = 0.2;
        this.activeArcGroup.rotation.x = 0.2;
        this.renderer.render(this.scene, this.camera);
    }
}

// =============================================================================
// 5. 3D SOURCE PROPAGATION NETWORK GRAPH (INTERACTIVE NODE TOPOLOGY)
// =============================================================================
class PropagationMap3D {
    constructor(containerId, tooltipId) {
        this.container = document.getElementById(containerId);
        this.tooltip = document.getElementById(tooltipId);
        if (!this.container || typeof THREE === 'undefined') return;

        this.width = this.container.clientWidth || 800;
        this.height = this.container.clientHeight || 440;
        this.autoRotate = true;
        this.nodes = [];
        this.nodeMeshes = [];
        this.edgePulses = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredNode = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 15, 45);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.06;
            this.controls.maxDistance = 100;
            this.controls.minDistance = 15;
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 80);
        pointLight1.position.set(20, 30, 20);
        this.scene.add(pointLight1);

        // Grid plane base
        const gridHelper = new THREE.GridHelper(60, 24, 0x00f2fe, 0x1e293b);
        gridHelper.position.y = -12;
        gridHelper.material.opacity = 0.25;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Groups
        this.nodesGroup = new THREE.Group();
        this.edgesGroup = new THREE.Group();
        this.pulsesGroup = new THREE.Group();
        this.scene.add(this.edgesGroup);
        this.scene.add(this.nodesGroup);
        this.scene.add(this.pulsesGroup);

        this.setupEvents();
        this.animate();
    }

    renderNetwork(data) {
        if (!data || !data.nodes) return;
        this.nodes = data.nodes;
        this.edges = data.edges || [];

        // Clear existing objects
        while (this.nodesGroup.children.length > 0) this.nodesGroup.remove(this.nodesGroup.children[0]);
        while (this.edgesGroup.children.length > 0) this.edgesGroup.remove(this.edgesGroup.children[0]);
        while (this.pulsesGroup.children.length > 0) this.pulsesGroup.remove(this.pulsesGroup.children[0]);
        this.nodeMeshes = [];
        this.edgePulses = [];

        // Calculate positions in 3D space
        const nodePosMap = new Map();
        const count = this.nodes.length;

        this.nodes.forEach((node, idx) => {
            let x = 0, y = 0, z = 0;
            if (idx === 0) {
                // Origin at center
                x = 0; y = 0; z = 0;
            } else {
                // Distribute in concentric orbits
                const layer = Math.ceil(idx / 3);
                const angle = (idx / (count - 1)) * Math.PI * 2;
                const radius = 10 + layer * 7;
                x = Math.cos(angle) * radius;
                y = (Math.sin(angle * 2) * 5) + (Math.random() - 0.5) * 4;
                z = Math.sin(angle) * radius;
            }
            nodePosMap.set(node.id, new THREE.Vector3(x, y, z));

            // Sphere Geometry
            const radius = (node.val || 18) * 0.08;
            const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
            const color = new THREE.Color(node.color || '#00f2fe');
            const sphereMat = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.45,
                shininess: 90
            });
            const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
            sphereMesh.position.set(x, y, z);
            sphereMesh.userData = node;

            // Outer Aura Glow Mesh
            const haloGeo = new THREE.SphereGeometry(radius * 1.35, 16, 16);
            const haloMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.22,
                wireframe: true
            });
            const haloMesh = new THREE.Mesh(haloGeo, haloMat);
            sphereMesh.add(haloMesh);

            this.nodesGroup.add(sphereMesh);
            this.nodeMeshes.push(sphereMesh);
        });

        // Create Links & Animated Light Pulses
        this.edges.forEach((edge) => {
            const posA = nodePosMap.get(edge.source);
            const posB = nodePosMap.get(edge.target);
            if (!posA || !posB) return;

            // Link Line
            const lineGeo = new THREE.BufferGeometry().setFromPoints([posA, posB]);
            const lineMat = new THREE.LineBasicMaterial({
                color: data.is_fake ? 0xff3366 : 0x00f2fe,
                transparent: true,
                opacity: 0.45
            });
            const line = new THREE.Line(lineGeo, lineMat);
            this.edgesGroup.add(line);

            // Energy Pulse traveling along edge
            const pulseGeo = new THREE.SphereGeometry(0.35, 12, 12);
            const pulseMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.95
            });
            const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
            this.pulsesGroup.add(pulseMesh);

            this.edgePulses.push({
                mesh: pulseMesh,
                start: posA,
                end: posB,
                progress: Math.random()
            });
        });
    }

    setupEvents() {
        const dom = this.renderer.domElement;
        dom.addEventListener('mousemove', (e) => {
            const rect = dom.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

            this.checkIntersection(e.clientX, e.clientY);
        });

        dom.addEventListener('mouseleave', () => {
            if (this.tooltip) this.tooltip.style.display = 'none';
            if (this.hoveredNode) {
                this.hoveredNode.scale.set(1, 1, 1);
                this.hoveredNode = null;
            }
        });

        // HUD Toolbar Controls
        const rotateBtn = document.getElementById('btn-toggle-rotate');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.autoRotate = !this.autoRotate;
                rotateBtn.classList.toggle('active', this.autoRotate);
            });
        }

        const resetBtn = document.getElementById('btn-reset-cam');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.camera.position.set(0, 15, 45);
                if (this.controls) this.controls.target.set(0, 0, 0);
            });
        }

        const focusOriginBtn = document.getElementById('btn-focus-origin');
        if (focusOriginBtn) {
            focusOriginBtn.addEventListener('click', () => {
                this.camera.position.set(0, 5, 22);
                if (this.controls) this.controls.target.set(0, 0, 0);
            });
        }

        window.addEventListener('resize', () => {
            if (!this.container) return;
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight || 440;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        });
    }

    checkIntersection(clientX, clientY) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodeMeshes);

        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            const data = mesh.userData;

            if (this.hoveredNode !== mesh) {
                if (this.hoveredNode) this.hoveredNode.scale.set(1, 1, 1);
                this.hoveredNode = mesh;
                mesh.scale.set(1.3, 1.3, 1.3);
                if (window.Veritas3D.audioFX) window.Veritas3D.audioFX.playTone(950, 'sine', 0.05, 0.06);
            }

            if (this.tooltip && data) {
                const rect = this.container.getBoundingClientRect();
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${clientX - rect.left}px`;
                this.tooltip.style.top = `${clientY - rect.top}px`;
                this.tooltip.innerHTML = `
                    <div class="tooltip-title">${data.label || 'Network Node'}</div>
                    <div class="tooltip-stat-row"><span>Role:</span> <strong class="text-white">${data.role || 'Participant'}</strong></div>
                    <div class="tooltip-stat-row"><span>Channel:</span> <span>${data.platform || 'Public Net'}</span></div>
                    <div class="tooltip-stat-row"><span>Timeline:</span> <span>${data.time || 'T+00h'}</span></div>
                    <div class="tooltip-stat-row"><span>Diffusion Volume:</span> <strong style="color:${data.color}">${data.volume || 'Active'}</strong></div>
                `;
            }
        } else {
            if (this.hoveredNode) {
                this.hoveredNode.scale.set(1, 1, 1);
                this.hoveredNode = null;
            }
            if (this.tooltip) this.tooltip.style.display = 'none';
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate && this.nodesGroup) {
            this.nodesGroup.rotation.y += 0.003;
            this.edgesGroup.rotation.y += 0.003;
            this.pulsesGroup.rotation.y += 0.003;
        }

        // Animate Traveling Light Pulses
        this.edgePulses.forEach((pulse) => {
            pulse.progress += 0.012;
            if (pulse.progress > 1) pulse.progress = 0;
            pulse.mesh.position.lerpVectors(pulse.start, pulse.end, pulse.progress);
        });

        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// =============================================================================
// 6. CARD PARALLAX TILT & SPECULAR GLARE PHYSICS
// =============================================================================
function initParallaxAnd3DPhysics() {
    const cards = document.querySelectorAll('.parallax-3d-card, .analysis-console-3d');

    cards.forEach((card) => {
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt degrees (Max ~10deg)
            const rotateX = ((y - centerY) / centerY) * -9;
            const rotateY = ((x - centerX) / centerX) * 9;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px)`;

            // Update dynamic specular glare coordinates
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            card.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Global subtle perspective parallax on mousemove
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
            mainContent.style.transform = `rotateY(${moveX.toFixed(3)}deg) rotateX(${-moveY.toFixed(3)}deg)`;
        });
    }
}

// =============================================================================
// 7. Z-AXIS INPUT DEPRESSION & TACTILE BUTTONS
// =============================================================================
function initZAxisInteractions() {
    const inputs = document.querySelectorAll('.input-3d');
    inputs.forEach((input) => {
        input.addEventListener('focus', () => {
            input.classList.add('depressed');
            if (window.Veritas3D.audioFX) window.Veritas3D.audioFX.playTone(800, 'sine', 0.04, 0.05);
        });

        input.addEventListener('blur', () => {
            input.classList.remove('depressed');
        });

        input.addEventListener('input', () => {
            // Depress pulse while typing
            input.classList.add('depressed');
        });
    });

    // 3D Push-down buttons audio & haptic press
    const pushBtns = document.querySelectorAll('.btn-3d-push, .btn-preset-3d, .mode-tab-btn');
    pushBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (window.Veritas3D.audioFX) window.Veritas3D.audioFX.playClick();
        });
    });
}

// =============================================================================
// INITIALIZE 3D RUNTIME ON DOM READY
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Audio Synthesizer
    window.Veritas3D.audioFX = new CyberAudioFX();

    // 2. Initialize 3D Starfield Background
    initBackground3D();

    // 3. Initialize 3D Scanning Stage
    window.Veritas3D.scannerScene = new HolographicScanner3D('scanner-3d-stage');

    // 4. Initialize 3D Truth Score Torus Gauge
    window.Veritas3D.truthGauge = new TruthScoreGauge3D('truth-gauge-canvas');

    // 5. Initialize 3D Source Propagation Network Graph
    window.Veritas3D.propagationMap = new PropagationMap3D('propagation-map-canvas-container', 'propagation-tooltip');

    // 6. Initialize Physics & Parallax
    initParallaxAnd3DPhysics();
    initZAxisInteractions();
});
