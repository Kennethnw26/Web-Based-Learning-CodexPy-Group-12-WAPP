/* global React, THREE */
// CodexPy — Three.js scene components
// All scenes are real Three.js (r128 UMD). Each scene is self-contained,
// cleans up on unmount, and pauses when calm-motion mode is enabled.

const { useEffect, useRef, useState } = React;

// ---------- Shared helpers ----------------------------------------------------

function useResize(canvas, renderer, camera) {
  useEffect(() => {
    if (!canvas || !renderer || !camera) return;
    const onResize = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if (camera.isPerspectiveCamera) {
        camera.aspect = w / h;
      }
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvas, renderer, camera]);
}

function isCalm() {
  return document.documentElement.getAttribute("data-lens-motion") === "calm";
}

// Easing
const ease = (t) => 1 - Math.pow(1 - t, 3);

// ---------- 1. Snake Hero (landing) ------------------------------------------
// A coiled torus made of segmented spheres in Python-blue → yellow gradient.
// Slowly orbits a 3D extruded "Py" wordmark. On scroll, it stretches & rotates.

function SnakeHero({ scroll = 0 }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.3, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    // Lights
    const key = new THREE.DirectionalLight(0xfff7e6, 1.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6aa8e6, 0.9);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xfaf7f2, 0.55));

    // Snake — torus knot composed of segmented spheres along a curve
    const snakeGroup = new THREE.Group();
    scene.add(snakeGroup);

    // Use a custom curve: a coiled spiral wrapping around a torus axis
    class CoilCurve extends THREE.Curve {
      constructor(turns = 2.2, radius = 1.6, tubeRadius = 0.55, height = 1.0) {
        super();
        this.turns = turns; this.radius = radius;
        this.tubeRadius = tubeRadius; this.height = height;
      }
      getPoint(t, target = new THREE.Vector3()) {
        const tau = t * Math.PI * 2 * this.turns;
        const r = this.radius + this.tubeRadius * Math.cos(tau);
        const x = r * Math.cos(t * Math.PI * 2);
        const z = r * Math.sin(t * Math.PI * 2);
        const y = this.tubeRadius * Math.sin(tau) + (t - 0.5) * this.height;
        return target.set(x, y, z);
      }
    }
    const curve = new CoilCurve(2.4, 1.55, 0.55, 0.6);

    const SEG = 110;
    const segs = [];
    const points = [];
    for (let i = 0; i < SEG; i++) {
      const t = i / (SEG - 1);
      points.push(curve.getPoint(t));
    }

    // Use a tube for the body
    const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.16, 18, false);
    // Vertex colors blue->yellow
    const colors = [];
    const pos = tubeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) + 2) / 4; // rough horizontal gradient
      const blue = new THREE.Color(0x3776AB);
      const yellow = new THREE.Color(0xFFD43B);
      const c = blue.clone().lerp(yellow, Math.max(0, Math.min(1, t)));
      colors.push(c.r, c.g, c.b);
    }
    tubeGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const tubeMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.4,
      metalness: 0.15,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    snakeGroup.add(tube);

    // Snake head — sphere at curve end
    const headGeo = new THREE.SphereGeometry(0.24, 24, 18);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xFFD43B, roughness: 0.35, metalness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    const headPos = curve.getPoint(1);
    head.position.copy(headPos);
    snakeGroup.add(head);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.04, 12, 10);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.13, 0.06, 0.18);
    eyeR.position.set(-0.05, 0.06, 0.20);
    head.add(eyeL); head.add(eyeR);

    // Floating "Py" — use extruded shape
    const pyGroup = new THREE.Group();
    snakeGroup.add(pyGroup); // attach to group so it rotates together

    // Decorative ring around
    const ringGeo = new THREE.TorusGeometry(2.05, 0.012, 8, 120);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFD43B, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Floating code particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    const glyphs = ["{", "}", "=", ":", "()", "[]", "def", "py"];
    // Use plane sprites with text via canvas
    const makeGlyph = (txt) => {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 128;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, 128, 128);
      ctx.font = "600 56px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#3776AB";
      ctx.fillText(txt, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.6 });
      const s = new THREE.Sprite(mat);
      s.scale.set(0.7, 0.7, 0.7);
      return s;
    };
    const particleData = [];
    for (let i = 0; i < 14; i++) {
      const g = glyphs[i % glyphs.length];
      const sp = makeGlyph(g);
      const r = 2.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.2;
      sp.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r - 0.5);
      particlesGroup.add(sp);
      particleData.push({ sprite: sp, baseY: y, speed: 0.2 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 });
    }

    let raf;
    let t0 = performance.now();
    const animate = () => {
      const t = (performance.now() - t0) / 1000;
      const scrollPart = stateRef.current.scroll || 0;
      const calm = isCalm();

      if (!calm) {
        snakeGroup.rotation.y = t * 0.18 + scrollPart * 1.2;
        snakeGroup.rotation.x = Math.sin(t * 0.2) * 0.06 - scrollPart * 0.2;
        // breathing
        const breath = 1 + Math.sin(t * 1.1) * 0.012;
        snakeGroup.scale.setScalar(breath);

        ring.rotation.z = t * 0.05;

        particleData.forEach((p) => {
          p.sprite.position.y = p.baseY + Math.sin(t * p.speed + p.phase) * 0.18;
          p.sprite.material.opacity = 0.55 + Math.sin(t * p.speed + p.phase) * 0.1;
        });

        // camera subtle parallax
        camera.position.x = Math.sin(t * 0.18) * 0.2;
        camera.lookAt(0, 0, 0);
      } else {
        snakeGroup.rotation.y = 0.6;
        snakeGroup.rotation.x = 0.1;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Visibility pause
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { t0 = performance.now(); animate(); }
    };
    document.addEventListener("visibilitychange", onVis);

    stateRef.current.scroll = scroll;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      tubeGeo.dispose();
      tubeMat.dispose();
      headGeo.dispose();
      headMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    stateRef.current.scroll = scroll;
  }, [scroll]);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%" }} />;
}

// ---------- 2. Progress Orb (dashboard) --------------------------------------
// Sphere with normal-displacement noise + orbiting rings showing fill %.

function ProgressOrb({ progress = 0.62 }) {
  const mountRef = useRef(null);
  const propRef = useRef({ progress });
  useEffect(() => { propRef.current.progress = progress; }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5e0, 0.6));
    const key = new THREE.DirectionalLight(0xfff5e0, 1.4);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xFFD43B, 1.2, 8);
    rim.position.set(-1.5, 1, 2);
    scene.add(rim);

    // Orb — icosahedron with subtle displacement via shader
    const geo = new THREE.IcosahedronGeometry(1.0, 4);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: progress },
        uColorA: { value: new THREE.Color(0x3776AB) },
        uColorB: { value: new THREE.Color(0xFFD43B) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        // simplex noise (Ashima)
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
        float snoise(vec3 v){
          const vec2 C = vec2(1./6., 1./3.);
          const vec4 D = vec4(0., .5, 1., 2.);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0., i1.z, i2.z, 1.))
                  + i.y + vec4(0., i1.y, i2.y, 1.))
                  + i.x + vec4(0., i1.x, i2.x, 1.));
          float n_ = .142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49. * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7. * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1. - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2. + 1.;
          vec4 s1 = floor(b1)*2. + 1.;
          vec4 sh = -step(h, vec4(0.));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
          m = m*m;
          return 42. * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        void main(){
          float n = snoise(position * 1.4 + vec3(0., uTime * 0.25, 0.));
          float disp = n * 0.08;
          vec3 newPos = position + normal * disp;
          vPosition = newPos;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uProgress;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main(){
          // Fresnel rim
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float rim = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
          // Vertical gradient based on progress
          float y = (vPosition.y + 1.0) * 0.5;
          float wave = sin(vPosition.y * 8.0 + uTime * 1.4) * 0.04;
          float mask = smoothstep(uProgress + wave - 0.02, uProgress + wave + 0.02, y);
          vec3 base = mix(uColorB, uColorA, mask);
          vec3 col = mix(base, vec3(1.0,0.95,0.8), rim * 0.55);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    // Orbit rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    const ringMats = [];
    for (let i = 0; i < 3; i++) {
      const r = 1.18 + i * 0.07;
      const ringGeo = new THREE.TorusGeometry(r, 0.006, 6, 120);
      const rm = new THREE.MeshStandardMaterial({
        color: i === 1 ? 0xFFD43B : 0x3776AB,
        transparent: true,
        opacity: 0.55 - i * 0.12,
      });
      const ring = new THREE.Mesh(ringGeo, rm);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      ring.rotation.z = Math.random() * Math.PI;
      ring.userData = { speed: 0.4 + i * 0.15, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() };
      ringGroup.add(ring);
      ringMats.push(rm);
    }

    // Sparkle particles
    const sparkleGeo = new THREE.BufferGeometry();
    const N = 80;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.35 + Math.random() * 0.35;
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
    }
    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xFFD43B,
      size: 0.04,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    let raf, t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const calm = isCalm();
      mat.uniforms.uTime.value = t;
      mat.uniforms.uProgress.value += (propRef.current.progress - mat.uniforms.uProgress.value) * 0.05;
      if (!calm) {
        orb.rotation.y = t * 0.18;
        ringGroup.children.forEach((r, i) => {
          r.rotation.x += 0.003 * (1 + i * 0.3);
          r.rotation.y += 0.005 * (1 + i * 0.2);
        });
        sparkles.rotation.y = t * 0.12;
        sparkles.rotation.x = Math.sin(t * 0.3) * 0.2;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose(); mat.dispose();
      sparkleGeo.dispose(); sparkleMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%" }} />;
}

// ---------- 3. Score Gauge ---------------------------------------------------
// Radial 3D arc that fills smoothly to a percentage.

function ScoreGauge({ score = 0.8, label = "Score" }) {
  const mountRef = useRef(null);
  const propRef = useRef({ score });
  useEffect(() => { propRef.current.score = score; }, [score]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0.6, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    const dl = new THREE.DirectionalLight(0xfff5e0, 1.2);
    dl.position.set(2, 3, 4); scene.add(dl);
    const rim = new THREE.DirectionalLight(0x3776AB, 0.6);
    rim.position.set(-3, -2, 1); scene.add(rim);

    // Background track
    const trackGeo = new THREE.TorusGeometry(1.3, 0.11, 16, 64, Math.PI * 1.5);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0xECE7DD, roughness: 0.7 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.z = Math.PI * 1.25;
    scene.add(track);

    // Filled arc — start invisible then grow
    const arcMat = new THREE.MeshStandardMaterial({ color: 0x3776AB, roughness: 0.35, metalness: 0.15 });
    const arcContainer = new THREE.Object3D();
    scene.add(arcContainer);
    let currentArc = null;
    let currentArcAngle = 0;

    const rebuildArc = (angle) => {
      if (currentArc) {
        arcContainer.remove(currentArc);
        currentArc.geometry.dispose();
      }
      if (angle < 0.01) return;
      const g = new THREE.TorusGeometry(1.3, 0.13, 18, 80, angle);
      currentArc = new THREE.Mesh(g, arcMat);
      currentArc.rotation.z = Math.PI * 1.25;
      arcContainer.add(currentArc);
    };

    // Tip sphere
    const tipGeo = new THREE.SphereGeometry(0.16, 24, 18);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xFFD43B, roughness: 0.3, metalness: 0.4, emissive: 0xFFD43B, emissiveIntensity: 0.2 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    scene.add(tip);

    // Ticks
    const ticks = new THREE.Group();
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * 1.25 + (i / 10) * Math.PI * 1.5;
      const r1 = 1.45, r2 = 1.52;
      const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
      const x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2;
      const tGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1,y1,0), new THREE.Vector3(x2,y2,0)]);
      const tMat = new THREE.LineBasicMaterial({ color: 0x9A9892 });
      ticks.add(new THREE.Line(tGeo, tMat));
    }
    scene.add(ticks);

    let raf, t0 = performance.now();
    const TARGET_FRAC = () => propRef.current.score;
    let displayed = 0;

    const tick = () => {
      const calm = isCalm();
      const target = TARGET_FRAC();
      displayed += (target - displayed) * (calm ? 1 : 0.06);
      const ang = displayed * Math.PI * 1.5;
      if (Math.abs(ang - currentArcAngle) > 0.005) {
        rebuildArc(ang);
        currentArcAngle = ang;
      }
      // Tip position
      const aFinal = Math.PI * 1.25 + ang;
      tip.position.set(Math.cos(aFinal) * 1.3, Math.sin(aFinal) * 1.3, 0);
      if (!calm) {
        tip.scale.setScalar(1 + Math.sin((performance.now() - t0) / 280) * 0.06);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      trackGeo.dispose(); trackMat.dispose();
      arcMat.dispose();
      tipGeo.dispose(); tipMat.dispose();
      if (currentArc) currentArc.geometry.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%" }} />;
}

// ---------- 4. Journey Map (progress page) -----------------------------------
// A 3D constellation of module nodes connected by curving paths.

function JourneyMap({ nodes = [], onNodeClick = () => {} }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.5, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    const dl = new THREE.DirectionalLight(0xfff5e0, 1.0);
    dl.position.set(3, 5, 4); scene.add(dl);
    const blue = new THREE.PointLight(0x3776AB, 0.6, 12);
    blue.position.set(-4, 2, 3); scene.add(blue);

    // Layout nodes along a curve in 3D space
    const positions = [];
    nodes.forEach((n, i) => {
      const t = i / Math.max(1, nodes.length - 1);
      const x = (t - 0.5) * 6;
      const y = Math.sin(t * Math.PI * 1.8) * 1.2 + Math.sin(t * Math.PI * 4) * 0.2;
      const z = Math.cos(t * Math.PI * 1.5) * 1.4;
      positions.push(new THREE.Vector3(x, y, z));
    });

    // Path lines (curve through nodes)
    if (positions.length > 1) {
      const curve = new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.4);
      const pts = curve.getPoints(140);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xC8B98A, transparent: true, opacity: 0.55 });
      scene.add(new THREE.Line(lineGeo, lineMat));
    }

    // Nodes — sphere per module
    const nodeMeshes = [];
    nodes.forEach((n, i) => {
      const isLocked = n.status === "locked";
      const isDone = n.status === "done";
      const isCur = n.status === "current";
      const r = isCur ? 0.30 : 0.22;
      const g = new THREE.SphereGeometry(r, 24, 18);
      const color = isDone ? 0x3776AB : isCur ? 0xFFD43B : 0xD7CFC0;
      const m = new THREE.MeshStandardMaterial({
        color, roughness: 0.4, metalness: 0.2,
        emissive: isCur ? 0xFFD43B : isDone ? 0x3776AB : 0x000000,
        emissiveIntensity: isCur ? 0.4 : isDone ? 0.15 : 0,
        transparent: isLocked,
        opacity: isLocked ? 0.55 : 1.0,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.copy(positions[i]);
      mesh.userData = { idx: i, ...n };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Halo ring for current/done
      if (isCur || isDone) {
        const haloGeo = new THREE.RingGeometry(r * 1.3, r * 1.5, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(positions[i]);
        halo.lookAt(camera.position);
        scene.add(halo);
        mesh.userData.halo = halo;
      }
    });

    // Background stars
    const starGeo = new THREE.BufferGeometry();
    const N = 120;
    const starPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      starPos[i*3] = (Math.random() - 0.5) * 18;
      starPos[i*3+1] = (Math.random() - 0.5) * 10;
      starPos[i*3+2] = -3 - Math.random() * 8;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x6B6F76, size: 0.04, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(999, 999);
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onClick = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length > 0) onNodeClick(hits[0].object.userData);
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("click", onClick);

    let raf, t0 = performance.now();
    let hovered = null;
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const calm = isCalm();

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      const newHover = hits[0]?.object || null;
      if (newHover !== hovered) {
        if (hovered) hovered.scale.setScalar(1);
        if (newHover) newHover.scale.setScalar(1.18);
        hovered = newHover;
        mount.style.cursor = newHover ? "pointer" : "default";
      }

      if (!calm) {
        nodeMeshes.forEach((m, i) => {
          if (m.userData.status === "locked") {
            m.position.y = positions[i].y + Math.sin(t * 0.8 + i) * 0.04;
          }
          if (m.userData.halo) {
            m.userData.halo.lookAt(camera.position);
            m.userData.halo.material.opacity = 0.25 + Math.sin(t * 1.5 + i) * 0.12;
          }
        });
        scene.rotation.y = Math.sin(t * 0.12) * 0.04;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("click", onClick);
      nodeMeshes.forEach(m => { m.geometry.dispose(); m.material.dispose(); });
      starGeo.dispose(); starMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [nodes]);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%", cursor: "default" }} />;
}

// ---------- 5. Quiz Feedback Burst -------------------------------------------
// On correct: yellow particle burst from a point. On wrong: red glow + shake.

function QuizBurst({ trigger = 0, kind = "correct" }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ trigger: 0 });

  useEffect(() => { stateRef.current.trigger = trigger; stateRef.current.kind = kind; }, [trigger, kind]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Particles
    const N = 80;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const life = new Float32Array(N);
    for (let i = 0; i < N; i++) { life[i] = 0; }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xFFD43B, size: 0.12, transparent: true, opacity: 1.0, sizeAttenuation: true });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let lastTrigger = 0;
    let raf;
    const tick = () => {
      const tr = stateRef.current.trigger;
      const k = stateRef.current.kind || "correct";
      if (tr !== lastTrigger) {
        lastTrigger = tr;
        // re-init particles
        for (let i = 0; i < N; i++) {
          pos[i*3] = (Math.random() - 0.5) * 0.2;
          pos[i*3+1] = (Math.random() - 0.5) * 0.2;
          pos[i*3+2] = 0;
          const a = Math.random() * Math.PI * 2;
          const s = 0.04 + Math.random() * 0.08;
          vel[i*3] = Math.cos(a) * s;
          vel[i*3+1] = Math.sin(a) * s;
          vel[i*3+2] = (Math.random() - 0.5) * 0.05;
          life[i] = 1.0;
        }
        mat.color.set(k === "correct" ? 0xFFD43B : 0xEF4444);
        geo.attributes.position.needsUpdate = true;
      }
      // Update
      let anyAlive = false;
      for (let i = 0; i < N; i++) {
        if (life[i] > 0) {
          pos[i*3]   += vel[i*3];
          pos[i*3+1] += vel[i*3+1];
          pos[i*3+2] += vel[i*3+2];
          vel[i*3+1] -= 0.0015; // gravity-ish
          life[i] -= 0.012;
          anyAlive = true;
        }
      }
      geo.attributes.position.needsUpdate = true;
      mat.opacity = anyAlive ? 0.95 : 0;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose(); mat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ---------- 6. Medallion (badge unlock) --------------------------------------

function Medallion({ tone = "blue" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5e0, 0.6));
    const dl = new THREE.DirectionalLight(0xfff5e0, 1.4);
    dl.position.set(3, 4, 3); scene.add(dl);
    const rim = new THREE.DirectionalLight(0xFFD43B, 0.8);
    rim.position.set(-2, -1, 2); scene.add(rim);

    const colorMain = tone === "yellow" ? 0xFFD43B : 0x3776AB;
    const colorAlt = tone === "yellow" ? 0x3776AB : 0xFFD43B;

    // Base disc
    const discGeo = new THREE.CylinderGeometry(1, 1, 0.16, 64);
    const discMat = new THREE.MeshStandardMaterial({ color: colorMain, roughness: 0.3, metalness: 0.5 });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = Math.PI / 2;
    scene.add(disc);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(0.95, 0.05, 14, 80);
    const ringMat = new THREE.MeshStandardMaterial({ color: colorAlt, roughness: 0.3, metalness: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Star — extrude a star shape onto the disc
    const starShape = new THREE.Shape();
    const spikes = 5, outer = 0.45, inner = 0.20;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
    const starMat = new THREE.MeshStandardMaterial({ color: colorAlt, roughness: 0.2, metalness: 0.6 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.z = 0.08;
    scene.add(star);

    let raf, t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const calm = isCalm();
      if (!calm) {
        scene.rotation.y = t * 0.4;
        scene.rotation.x = Math.sin(t * 0.6) * 0.15;
      } else {
        scene.rotation.y = 0.4;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      discGeo.dispose(); discMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      starGeo.dispose(); starMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [tone]);

  return <div ref={mountRef} className="three-mount" style={{ width: "100%", height: "100%" }} />;
}

// Expose globally
Object.assign(window, { SnakeHero, ProgressOrb, ScoreGauge, JourneyMap, QuizBurst, Medallion });
