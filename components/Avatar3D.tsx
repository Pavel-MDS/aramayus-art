"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Tipos ────────────────────────────────────────────────────────────────────
export type PrendaTipo = "chompa" | "poncho" | "saco" | "ninguna";
export type ColorPrenda = "tierra" | "verde" | "negro" | "gris";

interface Props {
  prenda?: PrendaTipo;
  color?: ColorPrenda;
  altura?: number;
  contextura?: "delgada" | "media" | "robusta";
}

// ── Helpers de material ───────────────────────────────────────────────────────
function mat(color: number, roughness = 0.75, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

const COLORS: Record<ColorPrenda, number> = {
  tierra: 0xa08e6c,
  verde:  0x3a4032,
  negro:  0x1d1611,
  gris:   0x7a7066,
};

// ── Construcción del avatar ────────────────────────────────────────────────────
function buildAvatar(scene: THREE.Scene): THREE.Group {
  const avatar = new THREE.Group();
  scene.add(avatar);

  const skin    = mat(0xc8956c, 0.80);
  const hair    = mat(0x2a1a0a, 0.90);
  const eye     = mat(0x100800, 0.40);
  const white   = mat(0xffffff, 0.60);
  const pant    = mat(0x2c3e50, 0.85);
  const shoe    = mat(0x1a1210, 0.70, 0.10);

  const add = (
    geo: THREE.BufferGeometry,
    m: THREE.Material,
    px: number, py: number, pz: number,
    sx = 1, sy = 1, sz = 1,
    rx = 0, ry = 0, rz = 0
  ) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true;
    avatar.add(mesh);
    return mesh;
  };

  // ── Cabeza ────────────────────────────────────────────────────────────────
  const headG = new THREE.Group();
  headG.position.set(0, 3.15, 0);
  avatar.add(headG);

  const addH = (
    geo: THREE.BufferGeometry,
    m: THREE.Material,
    px: number, py: number, pz: number,
    sx = 1, sy = 1, sz = 1,
    rx = 0, ry = 0, rz = 0
  ) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true;
    headG.add(mesh);
    return mesh;
  };

  // Cráneo
  addH(new THREE.SphereGeometry(0.265, 32, 32), skin, 0, 0, 0, 1, 1.12, 1);
  // Cara baja / mandíbula
  addH(new THREE.SphereGeometry(0.235, 32, 32), skin, 0, -0.09, 0.05, 1, 0.62, 1);
  // Pelo
  addH(new THREE.SphereGeometry(0.225, 32, 32), hair, 0, 0.10, -0.01, 1, 1, 1);
  addH(new THREE.CylinderGeometry(0.232, 0.222, 0.14, 32), hair, 0, 0.22, -0.05);
  // Pelo lateral
  addH(new THREE.CylinderGeometry(0.15, 0.18, 0.20, 32), hair, 0, -0.26, -0.01);

  // Ojos, cejas, nariz, boca
  ([-0.11, 0.11] as number[]).forEach((x) => {
    // cuenca del ojo
    addH(new THREE.SphereGeometry(0.042, 14, 14), skin, x, 0.10, 0.227, 1, 0.68, 0.48);
    // iris
    addH(new THREE.SphereGeometry(0.026, 14, 14), eye, x, 0.10, 0.252);
    // reflejo
    addH(new THREE.SphereGeometry(0.008, 8, 8), white, x + 0.01, 0.108, 0.258);
    // ceja
    addH(
      new THREE.BoxGeometry(0.06, 0.012, 0.015),
      hair,
      x, 0.155, 0.245,
      1, 1, 1,
      0, 0, x > 0 ? 0.15 : -0.15
    );
  });
  // Nariz
  addH(new THREE.SphereGeometry(0.022, 10, 10), mat(0xb87060, 0.8), 0, 0.02, 0.263, 1, 0.5, 0.7);
  // Labios
  addH(new THREE.SphereGeometry(0.056, 12, 12), mat(0xa05040, 0.75), 0, -0.045, 0.252, 1, 0.38, 1);
  // Orejas
  ([-0.265, 0.265] as number[]).forEach((x) => {
    addH(new THREE.SphereGeometry(0.058, 12, 12), skin, x, 0.02, 0, 0.28, 0.70, 0.48);
    addH(new THREE.SphereGeometry(0.035, 10, 10), mat(0xb88060, 0.85), x, 0.02, 0, 0.18, 0.50, 0.30);
  });

  // ── Cuello ────────────────────────────────────────────────────────────────
  add(new THREE.CylinderGeometry(0.082, 0.092, 0.30, 16), skin, 0, 2.82, 0);

  // ── Pelvis ────────────────────────────────────────────────────────────────
  add(new THREE.CylinderGeometry(0.21, 0.20, 0.30, 16), skin, 0, 1.60, 0);

  // ── Piernas ────────────────────────────────────────────────────────────────
  ([-0.13, 0.13] as number[]).forEach((x) => {
    // muslo
    add(new THREE.CylinderGeometry(0.118, 0.105, 0.70, 16), pant, x, 1.27, 0);
    add(new THREE.SphereGeometry(0.112, 16, 16), pant, x, 0.93, 0); // rodilla
    // pantorrilla
    add(new THREE.CylinderGeometry(0.100, 0.088, 0.64, 16), pant, x, 0.60, 0);
    add(new THREE.SphereGeometry(0.095, 16, 16), pant, x, 0.31, 0); // tobillo

    // Pie
    const footG = new THREE.Group();
    footG.position.set(x, 0.08, 0.07);
    avatar.add(footG);
    footG.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 12), shoe), { castShadow: true }));
    const footBox = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.075, 0.285), shoe);
    footBox.position.set(0, -0.02, 0.08);
    footBox.castShadow = true;
    footG.add(footBox);
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 10), shoe);
    toe.scale.set(1, 0.48, 0.65);
    toe.position.set(0, -0.02, 0.20);
    toe.castShadow = true;
    footG.add(toe);
  });

  // ── Brazos ────────────────────────────────────────────────────────────────
  ([-1, 1] as number[]).forEach((side) => {
    const armG = new THREE.Group();
    armG.position.set(side * 0.545, 2.18, 0);
    avatar.add(armG);

    const addA = (
      geo: THREE.BufferGeometry,
      m: THREE.Material,
      px: number, py: number, pz: number,
      rx = 0, ry = 0, rz = 0
    ) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(px, py, pz);
      mesh.rotation.set(rx, ry, rz);
      mesh.castShadow = true;
      armG.add(mesh);
    };

    // hombro
    addA(new THREE.SphereGeometry(0.118, 14, 14), skin, 0, 0, 0);
    // brazo superior
    addA(new THREE.CylinderGeometry(0.092, 0.082, 0.52, 14), skin, 0, -0.26, 0, 0, 0, side * 0.18);
    // codo
    addA(new THREE.SphereGeometry(0.082, 12, 12), skin, side * 0.095, -0.52, 0);
    // antebrazo
    addA(new THREE.CylinderGeometry(0.078, 0.066, 0.46, 14), skin, side * 0.185, -0.75, 0, 0, 0, side * 0.26);
    // muñeca
    addA(new THREE.SphereGeometry(0.062, 12, 12), skin, side * 0.29, -0.97, 0);
    // palma
    addA(new THREE.BoxGeometry(0.105, 0.145, 0.058), skin, side * 0.345, -1.07, 0);

    // Dedos (4)
    const fzOffsets = [-0.038, -0.012, 0.014, 0.040];
    fzOffsets.forEach((fz) => {
      for (let seg = 0; seg < 3; seg++) {
        addA(
          new THREE.CylinderGeometry(0.014 - seg * 0.002, 0.013 - seg * 0.002, 0.055 - seg * 0.004, 8),
          skin,
          side * 0.345, -1.155 - seg * 0.056, fz
        );
      }
    });
    // Pulgar
    addA(
      new THREE.CylinderGeometry(0.016, 0.013, 0.075, 8),
      skin,
      side * 0.285, -1.065, side * -0.062,
      0, 0, side * 0.52
    );
  });

  return avatar;
}

// ── Torso con prenda ──────────────────────────────────────────────────────────
function buildTorso(
  avatar: THREE.Group,
  torsoRef: React.MutableRefObject<THREE.Group | null>,
  prenda: PrendaTipo,
  color: ColorPrenda
) {
  // Eliminar torso anterior
  if (torsoRef.current) {
    avatar.remove(torsoRef.current);
    torsoRef.current.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        (c.material as THREE.Material).dispose();
      }
    });
  }

  const torsoG = new THREE.Group();
  torsoG.position.set(0, 2.27, 0);
  avatar.add(torsoG);
  torsoRef.current = torsoG;

  const skin     = mat(0xc8956c, 0.80);
  const colHex   = COLORS[color];
  const clothMat = mat(colHex, 0.95);
  const darkCloth = mat(
    new THREE.Color(colHex).multiplyScalar(0.72).getHex(),
    0.95
  );
  const lightCloth = mat(
    new THREE.Color(colHex).lerp(new THREE.Color(0xffffff), 0.25).getHex(),
    0.92
  );

  const addT = (
    geo: THREE.BufferGeometry,
    m: THREE.Material,
    px: number, py: number, pz: number,
    sx = 1, sy = 1, sz = 1,
    rx = 0, ry = 0, rz = 0
  ) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true;
    torsoG.add(mesh);
  };

  const SW = 0.525; // shoulder width

  if (prenda === "ninguna") {
    addT(new THREE.CylinderGeometry(SW, 0.225, 0.76, 16), skin, 0, 0, 0);
    addT(new THREE.SphereGeometry(0.225, 16, 8), skin, 0, -0.38, 0, 1, 0.5, 1);
    addT(new THREE.SphereGeometry(SW, 16, 8), skin, 0, 0.38, 0, 1, 0.5, 1);
    return;
  }

  if (prenda === "poncho") {
    // Cuerpo bajo el poncho (oscuro)
    addT(new THREE.CylinderGeometry(SW, 0.225, 0.76, 16), darkCloth, 0, 0, 0);
    // Cono del poncho
    addT(new THREE.ConeGeometry(0.80, 1.05, 8, 1, true), clothMat, 0, -0.10, 0);
    // Cuello
    addT(new THREE.CylinderGeometry(0.14, 0.155, 0.14, 16), darkCloth, 0, 0.40, 0);
    // Rayas decorativas andinas
    [0, 1, 2].forEach((i) => {
      addT(
        new THREE.TorusGeometry(0.81 - i * 0.10, 0.013, 4, 48),
        i % 2 === 0 ? lightCloth : darkCloth,
        0, -0.14 - i * 0.24, 0,
        1, 1, 1,
        Math.PI / 2, 0, 0
      );
    });
    return;
  }

  if (prenda === "chompa") {
    // Cuerpo
    addT(new THREE.CylinderGeometry(SW + 0.025, 0.245, 0.80, 16), clothMat, 0, 0, 0);
    addT(new THREE.SphereGeometry(0.245, 16, 8), clothMat, 0, -0.40, 0, 1, 0.5, 1);
    addT(new THREE.SphereGeometry(SW + 0.02, 16, 8), clothMat, 0, 0.40, 0, 1, 0.5, 1);
    // Cuello (tipo boca tortuga)
    addT(new THREE.CylinderGeometry(0.135, 0.145, 0.135, 16), darkCloth, 0, 0.43, 0);
    // Patrón tejido (filas y columnas de rectángulos)
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const bx = (col / 7 - 0.5) * 0.88;
        const by = -0.26 + row * 0.13;
        const rowMat = (row + col) % 2 === 0 ? clothMat : lightCloth;
        addT(new THREE.BoxGeometry(0.092, 0.052, 0.022), rowMat, bx, by, 0.248);
      }
    }
    // Ribete inferior
    addT(new THREE.CylinderGeometry(0.245, 0.245, 0.045, 32), darkCloth, 0, -0.41, 0);
    return;
  }

  if (prenda === "saco") {
    // Cuerpo
    addT(new THREE.CylinderGeometry(SW + 0.02, 0.240, 0.80, 16), clothMat, 0, 0, 0);
    addT(new THREE.SphereGeometry(0.240, 16, 8), clothMat, 0, -0.40, 0, 1, 0.5, 1);
    addT(new THREE.SphereGeometry(SW + 0.015, 16, 8), clothMat, 0, 0.40, 0, 1, 0.5, 1);
    // Solapa izquierda
    addT(new THREE.BoxGeometry(0.12, 0.68, 0.032), darkCloth, -0.06, 0.02, 0.252);
    // Solapa derecha
    addT(new THREE.BoxGeometry(0.12, 0.68, 0.032), darkCloth, 0.06, 0.02, 0.252);
    // Botones
    const btnMat = mat(0xddddcc, 0.5, 0.1);
    [-0.15, 0.05, 0.25].forEach((by) => {
      addT(
        new THREE.CylinderGeometry(0.026, 0.026, 0.022, 12),
        btnMat,
        0, by, 0.272,
        1, 1, 1,
        Math.PI / 2, 0, 0
      );
    });
    // Bolsillos
    [-0.28, 0.28].forEach((bx) => {
      addT(new THREE.BoxGeometry(0.14, 0.08, 0.025), darkCloth, bx, -0.22, 0.255);
    });
    // Cuello / solapa superior
    addT(new THREE.BoxGeometry(0.35, 0.16, 0.035), darkCloth, 0, 0.40, 0.250, 1, 1, 1, 0.1, 0, 0);
    return;
  }
}

// ── Componente principal ──────────────────────────────────────────────────────
export function Avatar3D({
  prenda = "chompa",
  color = "tierra",
  altura = 170,
  contextura = "media",
}: Props) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const rendRef   = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef  = useRef<THREE.Scene | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);
  const torsoRef  = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef  = useRef<number>(0);

  // Estado de cámara
  const camState = useRef({ rotY: 0, rotX: 0, dist: 4.8, auto: false });
  const drag     = useRef({ active: false, lastX: 0, lastY: 0 });

  // ── Setup Three.js ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1a2e, 1);
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a2e, 0.038);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
    camera.position.set(0, 1.6, 4.8);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // Luces
    scene.add(new THREE.AmbientLight(0xffeedd, 0.50));
    const dir = new THREE.DirectionalLight(0xfff5e0, 1.30);
    dir.position.set(3, 8, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0x8899ff, 0.45);
    rim.position.set(-4, 3, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffddcc, 0.35, 12);
    fill.position.set(0, 2.5, 3);
    scene.add(fill);

    // Suelo
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4, 64),
      new THREE.MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Avatar
    const avatar = buildAvatar(scene);
    avatarRef.current = avatar;
    buildTorso(avatar, torsoRef, prenda, color);

    // Animación
    const cs = camState.current;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (cs.auto) cs.rotY += 0.008;
      avatar.rotation.y = cs.rotY;
      avatar.rotation.x = cs.rotX;
      const cx = Math.sin(cs.rotY) * cs.dist * Math.cos(cs.rotX);
      const cz = Math.cos(cs.rotY) * cs.dist * Math.cos(cs.rotX);
      const cy = 1.6 + Math.sin(cs.rotX) * cs.dist;
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 1.5, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag
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
    const onUp   = () => { drag.current.active = false; };
    const onWheel = (e: WheelEvent) => {
      cs.dist = Math.max(2.5, Math.min(8.5, cs.dist + e.deltaY * 0.005));
      e.preventDefault();
    };

    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Touch
    let lastTouchDist = 0;
    renderer.domElement.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        drag.current = { active: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
        cs.auto = false;
      }
      if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
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
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        cs.dist = Math.max(2.5, Math.min(8.5, cs.dist - (d - lastTouchDist) * 0.01));
        lastTouchDist = d;
      }
      e.preventDefault();
    }, { passive: false });

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line

  // ── Actualizar prenda/color cuando cambien las props ──────────────────────
  useEffect(() => {
    if (avatarRef.current) buildTorso(avatarRef.current, torsoRef, prenda, color);
  }, [prenda, color]);

  // ── Escala del avatar por altura ──────────────────────────────────────────
  useEffect(() => {
    if (!avatarRef.current) return;
    const base  = 170;
    const scale = 0.85 + ((altura - base) / base) * 0.35;
    const sx    = contextura === "delgada" ? 0.88 : contextura === "robusta" ? 1.10 : 1.0;
    avatarRef.current.scale.set(scale * sx, scale, scale * sx);
  }, [altura, contextura]);

  // ── Controles de cámara expuestos ─────────────────────────────────────────
  const setFront = useCallback(() => {
    camState.current.rotY = 0;
    camState.current.rotX = 0;
    camState.current.auto = false;
  }, []);
  const setSide = useCallback(() => {
    camState.current.rotY = Math.PI / 2;
    camState.current.rotX = 0;
    camState.current.auto = false;
  }, []);
  const setBack = useCallback(() => {
    camState.current.rotY = Math.PI;
    camState.current.rotX = 0;
    camState.current.auto = false;
  }, []);
  const toggleAuto = useCallback(() => {
    camState.current.auto = !camState.current.auto;
  }, []);

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div
        ref={mountRef}
        className="flex-1 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: 520, background: "#1a1a2e" }}
      />
      <div className="flex gap-2 mt-2.5 justify-center flex-wrap">
        {[
          { label: "⟳ Auto", fn: toggleAuto },
          { label: "Frontal", fn: setFront },
          { label: "Lateral", fn: setSide },
          { label: "Posterior", fn: setBack },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className="text-[11px] px-3 py-1.5 rounded-md border border-border-subtle text-dark hover:border-dark transition-colors"
          >
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
