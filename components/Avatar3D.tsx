"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export type PrendaTipo = "chompa" | "poncho" | "saco" | "ninguna";
export type ColorPrenda = "tierra" | "verde" | "negro" | "gris";

interface Props {
  prenda?: PrendaTipo;
  color?: ColorPrenda;
  altura?: number;
  contextura?: "delgada" | "media" | "robusta";
  fotoUrl?: string | null;
}

const BRAND_COLORS: Record<ColorPrenda, number> = {
  tierra: 0xa08e6c,
  verde:  0x3a4032,
  negro:  0x1d1611,
  gris:   0x7a7066,
};

function stdMat(color: number, roughness = 0.80, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

async function loadGLTFLoader() {
  const mod = await import("three/examples/jsm/loaders/GLTFLoader.js" as any);
  return mod.GLTFLoader;
}

// ── Face swap ─────────────────────────────────────────────────────────────────
// Object_2 es la cabeza: center=(0,16.48,0.11), size=(3.49,3.61,2.79)
// En el espacio del modelo (antes de escalar) la cabeza ocupa Y: 14.67 → 18.28
// Después de escalar con factor ~0.2 queda en Y: ~2.9 → ~3.65
// Usamos un PlaneGeometry posicionado en la cara con la foto del usuario

function buildFacePlane(fotoUrl: string, modelRoot: THREE.Group, scale: number): THREE.Mesh {
  const img = new Image();
  img.crossOrigin = "anonymous";

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Fondo piel mientras carga
  ctx.fillStyle = "#c8956c";
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);

  img.onload = () => {
    ctx.clearRect(0, 0, 512, 512);

    // Recortar óvalo de cara del centro de la imagen
    const s = Math.min(img.width, img.height);
    const sx = (img.width - s) / 2;
    const sy = (img.height - s) / 2 + s * 0.05; // ligero offset hacia abajo para excluir pelo

    ctx.save();
    ctx.beginPath();
    // Óvalo que cubre cara pero no pelo ni cuello
    ctx.ellipse(256, 256, 210, 240, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, sx, sy, s, s * 0.85, 46, 32, 420, 448);
    ctx.restore();

    tex.needsUpdate = true;
  };
  img.src = fotoUrl;

  // La cabeza en coordenadas del mundo (después de escalar el modelo)
  // Object_2: center Y=16.48, el modelo se escala a ~3.4 unidades de alto
  // El modelo original mide ~20 unidades → scale = 3.4/20 = 0.17
  // Centro cara en mundo: Y = 16.48 * scale ≈ 2.8
  // Tamaño cara: 3.49 * scale ≈ 0.59 (ancho), 3.61 * scale ≈ 0.61 (alto)

  const faceW = 3.49 * scale * 0.85; // un poco menos para no salir de la cara
  const faceH = 3.61 * scale * 0.75;
  const faceY = 16.70 * scale;
  const faceZ = (0.11 + 1.4) * scale; // center Z + la mitad del depth (proyectado al frente)

  const geo = new THREE.PlaneGeometry(faceW, faceH);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const plane = new THREE.Mesh(geo, mat);
  plane.position.set(0, faceY, faceZ);
  plane.userData.isFacePlane = true;

  return plane;
}

// ── Prenda 3D sobre el GLB ────────────────────────────────────────────────────
// Object_3 es el torso: center=(0,8.04,-0.12), size=(9.57,14.32,2.80)
// El torso ocupa Y: 0.88 → 15.20 en espacio original
// Torso superior (cintura→hombros): Y: 8 → 15.20

function buildClothMesh(
  prenda: PrendaTipo,
  color: ColorPrenda,
  scale: number,
  clothTextureUrl?: string | null
): THREE.Group | null {
  if (prenda === "ninguna") return null;

  const colHex    = BRAND_COLORS[color];
  const darkHex   = new THREE.Color(colHex).multiplyScalar(0.70).getHex();
  const lightHex  = new THREE.Color(colHex).lerp(new THREE.Color(0xffffff), 0.28).getHex();

  let clothMat: THREE.Material;
  if (clothTextureUrl) {
    const tex = new THREE.TextureLoader().load(clothTextureUrl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    clothMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.90 });
  } else {
    clothMat = stdMat(colHex, 0.92);
  }
  const darkMat  = stdMat(darkHex, 0.95);
  const lightMat = stdMat(lightHex, 0.90);

  const g = new THREE.Group();
  g.userData.isCloth = true;

  // Coordenadas en espacio del mundo (aplicando scale)
  // Torso Object_3: center=(0, 8.04, -0.12), size=(9.57, 14.32, 2.80)
  // Usamos la mitad superior: Y de ~7 a ~15.5
  const s = scale;

  // Medidas del torso en mundo:
  const torsoW   = 9.57  * s * 0.88;  // ancho hombros
  const waistW   = 9.57  * s * 0.70;  // ancho cintura
  const torsoH   = 7.5   * s;          // altura cintura→hombros
  const torsoD   = 2.80  * s * 0.60;  // profundidad
  const torsoY   = 9.74  * s;          // centro torso en mundo
  const torsoTop = torsoY + torsoH * 0.5;
  const torsoMid = torsoY;
  const torsoFZ  = (-0.12 + 1.4) * s; // frente del torso

  // ── Mangas (brazos) ──
  // Object_3 incluye brazos: ancho total 9.57
  // Cada manga: desde hombro hasta codo (~4 unidades)
  const armLen  = 4.5  * s;
  const armR    = 1.6  * s * 0.55;
  const shoulderX = 4.2 * s;
  const shoulderY = torsoTop - 0.8 * s;

  const addT = (geo: THREE.BufferGeometry, mat: THREE.Material,
    px: number, py: number, pz: number,
    sx = 1, sy = 1, sz = 1,
    rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(px, py, pz);
    m.rotation.set(rx, ry, rz);
    m.castShadow = true;
    g.add(m);
  };

  if (prenda === "chompa") {
    // Cuerpo principal
    addT(new THREE.CylinderGeometry(torsoW / 2, waistW / 2, torsoH, 20),
      clothMat, 0, torsoY, 0);

    // Patrón tejido andino (filas en el frente)
    if (!clothTextureUrl) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          const bx = (col / 6 - 0.5) * torsoW * 0.80;
          const by = torsoY - torsoH * 0.3 + row * torsoH * 0.13;
          const rowMat = (row + col) % 2 === 0 ? clothMat : lightMat;
          addT(new THREE.BoxGeometry(torsoW * 0.10, torsoH * 0.06, torsoD * 0.08),
            rowMat, bx, by, torsoFZ);
        }
      }
    }

    // Cuello
    addT(new THREE.CylinderGeometry(1.6 * s, 1.8 * s, 1.2 * s, 16),
      darkMat, 0, torsoTop + 0.4 * s, 0);

    // Ribete inferior
    addT(new THREE.CylinderGeometry(waistW / 2 + 0.1 * s, waistW / 2 + 0.1 * s, 0.4 * s, 20),
      darkMat, 0, torsoMid - torsoH * 0.5 + 0.2 * s, 0);

    // Mangas
    [-1, 1].forEach((side) => {
      addT(new THREE.CylinderGeometry(armR, armR * 0.85, armLen, 14),
        clothMat,
        side * shoulderX, shoulderY - armLen * 0.35, 0,
        1, 1, 1, 0, 0, side * 0.28);
      // Puño
      addT(new THREE.CylinderGeometry(armR * 0.82, armR * 0.82, 0.5 * s, 14),
        darkMat,
        side * (shoulderX + armLen * Math.sin(0.28) * 0.8),
        shoulderY - armLen * 0.85,
        0);
    });
    return g;
  }

  if (prenda === "poncho") {
    // Cono principal del poncho
    addT(new THREE.ConeGeometry(torsoW * 0.92, torsoH * 1.1, 8, 1, true),
      clothMat, 0, torsoY, 0);

    // Cuello
    addT(new THREE.CylinderGeometry(1.5 * s, 1.7 * s, 1.0 * s, 16),
      darkMat, 0, torsoTop + 0.3 * s, 0);

    // Rayas decorativas andinas
    [0, 1, 2, 3].forEach((i) => {
      addT(new THREE.TorusGeometry(torsoW * (0.5 + i * 0.08), 0.15 * s, 4, 40),
        i % 2 === 0 ? lightMat : darkMat,
        0, torsoY - torsoH * 0.1 - i * torsoH * 0.18, 0,
        1, 1, 1, Math.PI / 2, 0, 0);
    });
    return g;
  }

  if (prenda === "saco") {
    // Cuerpo
    addT(new THREE.CylinderGeometry(torsoW / 2, waistW / 2, torsoH, 20),
      clothMat, 0, torsoY, 0);

    // Solapas
    addT(new THREE.BoxGeometry(torsoW * 0.14, torsoH * 0.85, torsoD * 0.08),
      darkMat, -torsoW * 0.08, torsoY + torsoH * 0.05, torsoFZ);
    addT(new THREE.BoxGeometry(torsoW * 0.14, torsoH * 0.85, torsoD * 0.08),
      darkMat, torsoW * 0.08, torsoY + torsoH * 0.05, torsoFZ);

    // Botones
    const btnMat = stdMat(0xddddcc, 0.5, 0.15);
    [-0.15, 0.12, 0.38].map(t => torsoTop - torsoH * t).forEach((by) => {
      addT(new THREE.CylinderGeometry(0.25 * s, 0.25 * s, 0.18 * s, 10),
        btnMat, 0, by, torsoFZ + 0.1 * s,
        1, 1, 1, Math.PI / 2, 0, 0);
    });

    // Bolsillos
    [-1, 1].forEach((side) => {
      addT(new THREE.BoxGeometry(torsoW * 0.18, torsoH * 0.12, torsoD * 0.06),
        darkMat, side * torsoW * 0.28, torsoY - torsoH * 0.25, torsoFZ);
    });

    // Cuello / solapa superior
    addT(new THREE.BoxGeometry(torsoW * 0.55, 1.2 * s, torsoD * 0.08),
      darkMat, 0, torsoTop + 0.2 * s, torsoFZ - 0.05 * s,
      1, 1, 1, 0.12, 0, 0);

    // Mangas
    [-1, 1].forEach((side) => {
      addT(new THREE.CylinderGeometry(armR, armR * 0.85, armLen, 14),
        clothMat,
        side * shoulderX, shoulderY - armLen * 0.35, 0,
        1, 1, 1, 0, 0, side * 0.28);
    });
    return g;
  }

  return null;
}

// ── Componente ────────────────────────────────────────────────────────────────
export function Avatar3D({
  prenda = "chompa",
  color = "tierra",
  altura = 170,
  contextura = "media",
  fotoUrl = null,
}: Props) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const rendRef    = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef   = useRef<THREE.Scene | null>(null);
  const modelRef   = useRef<THREE.Group | null>(null);
  const clothRef   = useRef<THREE.Group | null>(null);
  const facePlRef  = useRef<THREE.Mesh | null>(null);
  const frameRef   = useRef<number>(0);
  const modelScale = useRef<number>(0.17); // se recalcula al cargar el GLB

  const camState = useRef({ rotY: 0, rotX: 0, dist: 3.2, auto: false });
  const drag     = useRef({ active: false, lastX: 0, lastY: 0 });

  // Props en refs para acceso en callbacks sin recrear efectos
  const prendaRef    = useRef(prenda);
  const colorRef     = useRef(color);
  const clothTexRef  = useRef<string | null>(null);

  useEffect(() => { prendaRef.current = prenda; }, [prenda]);
  useEffect(() => { colorRef.current  = color;  }, [color]);

  // ── Actualizar ropa ────────────────────────────────────────────────────────
  const refreshCloth = useCallback(() => {
    const scene = sceneRef.current;
    const model = modelRef.current;
    if (!scene || !model) return;

    // Quitar ropa anterior
    if (clothRef.current) {
      scene.remove(clothRef.current);
      clothRef.current.traverse((c) => {
        if (c instanceof THREE.Mesh) { c.geometry.dispose(); (c.material as THREE.Material).dispose(); }
      });
      clothRef.current = null;
    }

    const cloth = buildClothMesh(prendaRef.current, colorRef.current, modelScale.current, clothTexRef.current);
    if (cloth) {
      scene.add(cloth);
      clothRef.current = cloth;
    }
  }, []);

  // ── Setup escena (solo una vez) ────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || 600;
    const H = el.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1a2e, 1);
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a2e, 0.032);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
    camera.position.set(0, 1.9, 3.2);
    camera.lookAt(0, 1.8, 0);

    // Luces
    scene.add(new THREE.AmbientLight(0xffeedd, 0.55));
    const dir = new THREE.DirectionalLight(0xfff5e0, 1.30);
    dir.position.set(3, 8, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0x8899ff, 0.40);
    rim.position.set(-4, 3, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffddcc, 0.35, 12);
    fill.position.set(0, 2.5, 3);
    scene.add(fill);

    // Suelo
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5, 64),
      new THREE.MeshStandardMaterial({ color: 0x22223a, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Cargar GLB
    loadGLTFLoader().then((GLTFLoader) => {
      const loader = new GLTFLoader();
      loader.load(
        "/models/avatar.glb",
        (gltf: any) => {
          const model = gltf.scene;
          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow    = true;
              child.receiveShadow = true;
            }
          });

          // Escalar: el modelo mide ~20 unidades de alto → queremos ~3.4
          const box    = new THREE.Box3().setFromObject(model);
          const size   = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const sc     = 3.4 / maxDim;
          modelScale.current = sc;

          model.scale.setScalar(sc);
          model.position.sub(center.multiplyScalar(sc));
          model.position.y += (size.y * sc) / 2;

          scene.add(model);
          modelRef.current = model;

          // Ropa inicial
          refreshCloth();
        },
        undefined,
        (err: any) => {
          console.warn("GLB no cargado:", err);
        }
      );
    });

    // Loop
    const cs = camState.current;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (cs.auto && modelRef.current) cs.rotY += 0.008;
      if (modelRef.current) {
        modelRef.current.rotation.y = cs.rotY;
        modelRef.current.rotation.x = cs.rotX;
      }
      if (clothRef.current) {
        clothRef.current.rotation.y = cs.rotY;
        clothRef.current.rotation.x = cs.rotX;
      }
      if (facePlRef.current) {
        facePlRef.current.rotation.y = cs.rotY;
        facePlRef.current.rotation.x = cs.rotX;
      }
      camera.position.set(
        Math.sin(cs.rotY) * cs.dist * Math.cos(cs.rotX),
        1.9 + Math.sin(cs.rotX) * cs.dist,
        Math.cos(cs.rotY) * cs.dist * Math.cos(cs.rotX)
      );
      camera.lookAt(0, 1.8, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Controles mouse
    const onDown = (e: MouseEvent) => {
      drag.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      cs.auto = false;
    };
    const onMove = (e: MouseEvent) => {
      if (!drag.current.active) return;
      cs.rotY += (e.clientX - drag.current.lastX) * 0.011;
      cs.rotX += (e.clientY - drag.current.lastY) * 0.005;
      cs.rotX  = Math.max(-0.55, Math.min(0.65, cs.rotX));
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
    };
    const onUp    = () => { drag.current.active = false; };
    const onWheel = (e: WheelEvent) => {
      cs.dist = Math.max(1.5, Math.min(9.0, cs.dist + e.deltaY * 0.005));
      e.preventDefault();
    };

    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Touch
    let lastTD = 0;
    renderer.domElement.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) { drag.current = { active: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY }; cs.auto = false; }
      if (e.touches.length === 2) lastTD = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    });
    renderer.domElement.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && drag.current.active) {
        cs.rotY += (e.touches[0].clientX - drag.current.lastX) * 0.011;
        cs.rotX += (e.touches[0].clientY - drag.current.lastY) * 0.005;
        cs.rotX  = Math.max(-0.55, Math.min(0.65, cs.rotX));
        drag.current.lastX = e.touches[0].clientX;
        drag.current.lastY = e.touches[0].clientY;
      }
      if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        cs.dist = Math.max(1.5, Math.min(9.0, cs.dist - (d - lastTD) * 0.01));
        lastTD = d;
      }
      e.preventDefault();
    }, { passive: false });

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight || 560;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line

  // ── Cambio de prenda/color ─────────────────────────────────────────────────
  useEffect(() => {
    prendaRef.current = prenda;
    colorRef.current  = color;
    refreshCloth();
  }, [prenda, color, refreshCloth]);

  // ── Escala por altura/contextura ───────────────────────────────────────────
  useEffect(() => {
    if (!modelRef.current) return;
    const sc = modelScale.current;
    const heightScale = 0.82 + ((altura - 150) / 45) * 0.26;
    const bodyScale   = contextura === "delgada" ? 0.88 : contextura === "robusta" ? 1.10 : 1.0;
    modelRef.current.scale.set(sc * bodyScale * heightScale, sc * heightScale, sc * bodyScale * heightScale);
    // Refresca ropa con el scale actualizado
    setTimeout(refreshCloth, 50);
  }, [altura, contextura, refreshCloth]);

  // ── Face swap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !fotoUrl) return;

    // Quitar plano anterior si existe
    if (facePlRef.current) {
      scene.remove(facePlRef.current);
      (facePlRef.current.material as THREE.Material).dispose();
      facePlRef.current = null;
    }

    if (!fotoUrl) return;

    // Esperar a que el modelo esté cargado
    const tryApply = () => {
      if (!modelRef.current) { setTimeout(tryApply, 300); return; }
      const plane = buildFacePlane(fotoUrl, modelRef.current, modelScale.current);
      scene.add(plane);
      facePlRef.current = plane;
    };
    tryApply();
  }, [fotoUrl]);

  // ── Controles cámara ──────────────────────────────────────────────────────
  const setFront   = useCallback(() => { Object.assign(camState.current, { rotY: 0,            rotX: 0, auto: false }); }, []);
  const setSide    = useCallback(() => { Object.assign(camState.current, { rotY: Math.PI / 2,  rotX: 0, auto: false }); }, []);
  const setBack    = useCallback(() => { Object.assign(camState.current, { rotY: Math.PI,      rotX: 0, auto: false }); }, []);
  const toggleAuto = useCallback(() => { camState.current.auto = !camState.current.auto; }, []);
  const zoomIn     = useCallback(() => { camState.current.dist = Math.max(1.5, camState.current.dist - 0.5); }, []);
  const zoomOut    = useCallback(() => { camState.current.dist = Math.min(9.0, camState.current.dist + 0.5); }, []);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={mountRef}
        className="flex-1 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: 520, background: "#1a1a2e" }}
      />
      <div className="flex gap-2 mt-2.5 justify-center flex-wrap">
        {[
          { label: "⟳ Auto",     fn: toggleAuto },
          { label: "Frontal",    fn: setFront   },
          { label: "Lateral",    fn: setSide    },
          { label: "Posterior",  fn: setBack    },
          { label: "🔍 +",       fn: zoomIn     },
          { label: "🔎 −",       fn: zoomOut    },
        ].map(({ label, fn }) => (
          <button key={label} onClick={fn}
            className="text-[11px] px-3 py-1.5 rounded-md border border-border-subtle text-dark hover:border-dark transition-colors bg-cream">
            {label}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] text-muted mt-1.5">
        Arrastra para rotar · Scroll para zoom
      </p>
    </div>
  );
}