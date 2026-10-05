import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Background3D — a full-screen, cursor-responsive Three.js layer that sits
 * behind all Study Haven content (fixed, z-index 0, pointer-events-none).
 *
 * Scene: a soft particle field + floating geometric shapes rendered in the
 * brand palette. Camera rotation and particle displacement are smoothly
 * lerped toward the cursor for a premium, parallax feel at ~60fps.
 */
export default function Background3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- renderer / scene / camera ----------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf7f1e3, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14);

    // ---------- lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffb347, 0.9); // marigold key light
    key.position.set(6, 8, 10);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3a5ba9, 0.5); // cobalt rim light
    rim.position.set(-8, -4, -6);
    scene.add(rim);

    // ---------- particle field (brand ink/cobalt/flame tones) ----------
    const COUNT = 1400;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const basePos = new Float32Array(COUNT * 3);
    const palette = [
      new THREE.Color("#1c1917"), // ink
      new THREE.Color("#3a5ba9"), // cobalt
      new THREE.Color("#e8590c"), // flame
      new THREE.Color("#f59f00"), // marigold
      new THREE.Color("#0ca678"), // teal
    ];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 34;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 18;
      basePos[i * 3] = positions[i * 3] = x;
      basePos[i * 3 + 1] = positions[i * 3 + 1] = y;
      basePos[i * 3 + 2] = positions[i * 3 + 2] = z;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ---------- floating wireframe shapes (stationery-ish geometry) ----------
    const shapeGroup = new THREE.Group();
    const geos: THREE.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.TorusGeometry(0.9, 0.32, 10, 28),
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.TetrahedronGeometry(1.1, 0),
      new THREE.TorusKnotGeometry(0.7, 0.22, 64, 8),
    ];
    const shapeMats = [
      new THREE.MeshStandardMaterial({ color: 0xe8590c, wireframe: true, transparent: true, opacity: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x3a5ba9, wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, wireframe: true, transparent: true, opacity: 0.14 }),
    ];
    const floaters: Array<{ mesh: THREE.Mesh; speed: number; phase: number; amp: number }> = [];
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(geos[i % geos.length], shapeMats[i % shapeMats.length]);
      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 14,
        -2 - Math.random() * 8
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shapeGroup.add(mesh);
      floaters.push({
        mesh,
        speed: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        amp: 0.4 + Math.random() * 0.8,
      });
    }
    scene.add(shapeGroup);

    // ---------- cursor tracking with lerp ----------
    const target = { x: 0, y: 0 }; // normalized -1..1
    const current = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---------- resize handling ----------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- animation loop ----------
    const clock = new THREE.Clock();
    let raf = 0;
    const posAttr = pGeo.getAttribute("position") as THREE.BufferAttribute;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // smooth interpolation toward cursor
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      // gentle camera parallax
      camera.position.x = current.x * 1.6;
      camera.position.y = current.y * 1.0;
      camera.lookAt(0, 0, 0);

      // particles drift + subtle repulsion from cursor position
      const cx = current.x * 17;
      const cy = current.y * 10;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const bx = basePos[ix];
        const by = basePos[ix + 1];
        const dx = bx - cx;
        const dy = by - cy;
        const d2 = dx * dx + dy * dy;
        const push = d2 < 12 ? (12 - d2) / 12 : 0; // 0..1 near cursor
        const len = Math.sqrt(d2) || 1;
        positions[ix] = bx + (dx / len) * push * 1.4 + Math.sin(t * 0.4 + by) * 0.12;
        positions[ix + 1] = by + (dy / len) * push * 1.4 + Math.cos(t * 0.35 + bx) * 0.12;
        positions[ix + 2] = basePos[ix + 2] + Math.sin(t * 0.3 + i) * 0.1;
      }
      posAttr.needsUpdate = true;
      points.rotation.z = t * 0.01 + current.x * 0.05;

      // floating shapes bob & spin, tilt toward cursor
      for (const f of floaters) {
        f.mesh.rotation.x += 0.0016 + f.speed * 0.002;
        f.mesh.rotation.y += 0.0021 + f.speed * 0.002;
        f.mesh.position.y += Math.sin(t * f.speed + f.phase) * 0.004 * f.amp;
      }
      shapeGroup.rotation.y = current.x * 0.12;
      shapeGroup.rotation.x = -current.y * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      geos.forEach((g) => g.dispose());
      shapeMats.forEach((m) => m.dispose());
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}
