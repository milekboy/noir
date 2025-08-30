"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* =========================
   CONFIG
   ========================= */
const MODEL_URL = "/assets/model/test_shirt.glb";

// Mirrored selfie video, but we map your RIGHT → model RIGHT.
const MIRROR_X_COORDS = true;

const VIS_THRESH = 0.4;
const SCALE_CLAMP = { min: 0.3, max: 6.0 };
const SMOOTH = { pos: 0.5, rot: 0.6, scl: 0.6, arm: 0.6 };
const SCALE_FIT = 3.0;

// Base nudges (small now); extra auto-nudges come from your body metrics.
const NUDGE = {
  px: 20, // fixed pixels down
  byShoulder: 0.22, // % of shoulder width down
};
// Extra auto offset driven by torso length (shoulder-mid → hip-mid)
const TORSO_NUDGE_FACTOR = 0.18; // tweak 0.12..0.25 if needed

// Overlay controls
const SHOW_OVERLAY = true; // draws only the cyan pose lines/dots (no bone axes)

// MediaPipe landmark indices
const LIDX = 11; // left_shoulder
const RIDX = 12; // right_shoulder
const LELB = 13; // left_elbow
const RELB = 14; // right_elbow
const LWR = 15; // left_wrist
const RWR = 16; // right_wrist
const LHIP = 23; // left_hip
const RHIP = 24; // right_hip

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

/** Exact bone names from your rig */
const NAMES = {
  LU: "mixamorig1LeftArm",
  LL: "mixamorig1LeftForeArm",
  RU: "mixamorig1RightArm",
  RL: "mixamorig1RightForeArm",
  LSH: "mixamorig1LeftShoulder",
  RSH: "mixamorig1RightShoulder",
};

export default function TryOn() {
  const router = useRouter();

  // DOM
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);

  // MediaPipe
  const poseRef = useRef<any | null>(null);
  const lastPose = useRef<MPPoint[] | undefined>(undefined);

  // Three.js
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const pivotRef = useRef<THREE.Object3D | null>(null);
  const shirtGroupRef = useRef<THREE.Object3D | null>(null);
  const modelRootRef = useRef<THREE.Object3D | null>(null);
  const anchorShoulderDistRef = useRef<number>(240);

  const bonesRef = useRef<{
    LU?: THREE.Bone;
    LL?: THREE.Bone;
    RU?: THREE.Bone;
    RL?: THREE.Bone;
    LSH?: THREE.Bone;
    RSH?: THREE.Bone;
    restQ: Record<string, THREE.Quaternion>;
    lastZ: Record<string, number>;
  }>({ restQ: {}, lastZ: {} });

  // smoothing state
  const lastPos = useRef(new THREE.Vector3());
  const lastRot = useRef(0);
  const lastScl = useRef(1);

  // strict-mode guard
  const didInit = useRef(false);

  /* ---------- utils ---------- */
  const p2sX = (x: number, W: number) => (MIRROR_X_COORDS ? 1 - x : x) * W;
  const p2sY = (y: number, H: number) => y * H;

  const angle2D = (ax: number, ay: number, bx: number, by: number) =>
    Math.atan2(by - ay, bx - ax);

  const setGroupFromWorld = (world: THREE.Vector3) => {
    if (!pivotRef.current || !shirtGroupRef.current) return;
    const p = pivotRef.current.position;
    shirtGroupRef.current.position.set(world.x - p.x, world.y - p.y, 0);
  };

  function drawPoseOverlay(W: number, H: number, lm?: MPPoint[]) {
    if (!SHOW_OVERLAY) return;
    const ctx = overlayRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if (!lm) return;

    const P = (i: number) =>
      lm[i] ? { x: p2sX(lm[i]!.x, W), y: p2sY(lm[i]!.y, H) } : undefined;

    const Ls = P(LIDX),
      Rs = P(RIDX),
      Le = P(LELB),
      Re = P(RELB),
      Lw = P(LWR),
      Rw = P(RWR);

    // pose lines (cyan)
    ctx.strokeStyle = "rgba(0,200,255,0.9)";
    ctx.lineWidth = 4;
    const line = (a?: any, b?: any) => {
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };
    line(Ls, Rs);
    line(Ls, Le);
    line(Le, Lw);
    line(Rs, Re);
    line(Re, Rw);

    // dots
    ctx.fillStyle = "#0ff";
    [Ls, Rs, Le, Re, Lw, Rw].forEach((p) => {
      if (!p) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const setToRest = (bone?: THREE.Bone, key?: string) => {
    if (!bone || !key) return;
    const rq = bonesRef.current.restQ[key];
    if (rq) bone.quaternion.copy(rq);
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    let stopLoop = false;

    /* CAMERA */
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error("[CAM] error:", e);
      }
    };

    /* MEDIAPIPE */
    const initVision = async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const { FilesetResolver, PoseLandmarker } = vision;
      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      poseRef.current = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    };

    /* THREE */
    const initThree = () => {
      if (!threeCanvasRef.current) return;
      const w = threeCanvasRef.current.clientWidth || window.innerWidth;
      const h = threeCanvasRef.current.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas: threeCanvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(w, h, false);
      (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      scene.background = null;

      const cam = new THREE.OrthographicCamera(0, w, h, 0, -1000, 1000);
      cam.position.set(0, 0, 10);
      cameraRef.current = cam;

      const amb = new THREE.AmbientLight(0xffffff, 0.9);
      const dir = new THREE.DirectionalLight(0xffffff, 1.8);
      dir.position.set(1, 1, 1.5);
      scene.add(amb, dir);

      const pivot = new THREE.Object3D();
      pivot.position.set(w / 2, h / 2, 0);
      scene.add(pivot);
      pivotRef.current = pivot;

      new GLTFLoader().load(
        MODEL_URL,
        (gltf) => {
          const root = gltf.scene;
          modelRootRef.current = root;

          // Front faces only (so you sit "inside" it)
          root.traverse((o: any) => {
            if (o.isMesh) {
              o.frustumCulled = false;
              const mats = Array.isArray(o.material)
                ? o.material
                : [o.material];
              mats.forEach((m: any) => (m.side = THREE.FrontSide));
            }
          });

          // Normalize width and scale
          const box = new THREE.Box3().setFromObject(root);
          const size = new THREE.Vector3();
          box.getSize(size);
          const normalize = 400 / Math.max(1e-6, size.x);
          root.scale.multiplyScalar(normalize);

          // Recenter to shoulder midpoint (so base NUDGE stays small)
          root.updateWorldMatrix(true, true);
          const LSH = root.getObjectByName(NAMES.LSH) as THREE.Bone | undefined;
          const RSH = root.getObjectByName(NAMES.RSH) as THREE.Bone | undefined;
          if (LSH && RSH) {
            const lw = new THREE.Vector3();
            LSH.getWorldPosition(lw);
            const rw = new THREE.Vector3();
            RSH.getWorldPosition(rw);
            const midW = lw.add(rw).multiplyScalar(0.5);
            const midLocal = root.worldToLocal(midW.clone());
            root.position.sub(midLocal);
          } else {
            const center = new THREE.Vector3();
            box.getCenter(center);
            root.position.sub(center);
          }

          const shirtGroup = new THREE.Object3D();
          shirtGroup.add(root);
          pivot.add(shirtGroup);
          shirtGroupRef.current = shirtGroup;

          // Bones to drive + rest quats
          const getB = (n: string) =>
            root.getObjectByName(n) as THREE.Bone | undefined;
          bonesRef.current.LU = getB(NAMES.LU);
          bonesRef.current.LL = getB(NAMES.LL);
          bonesRef.current.RU = getB(NAMES.RU);
          bonesRef.current.RL = getB(NAMES.RL);
          bonesRef.current.LSH = getB(NAMES.LSH);
          bonesRef.current.RSH = getB(NAMES.RSH);

          ["LU", "LL", "RU", "RL", "LSH", "RSH"].forEach((k) => {
            const b = (bonesRef.current as any)[k] as THREE.Bone | undefined;
            if (b) bonesRef.current.restQ[k] = b.quaternion.clone();
          });
        },
        undefined,
        (err) => console.error("[THREE] GLB load error:", err)
      );
    };

    /* FIT */
    const fitAll = () => {
      const el = containerRef.current;
      const overlay = overlayRef.current;
      if (
        !el ||
        !overlay ||
        !cameraRef.current ||
        !rendererRef.current ||
        !pivotRef.current
      )
        return;

      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;

      overlay.width = w;
      overlay.height = h;
      rendererRef.current.setSize(w, h, false);
      cameraRef.current.left = 0;
      cameraRef.current.right = w;
      cameraRef.current.top = h;
      cameraRef.current.bottom = 0;
      cameraRef.current.updateProjectionMatrix();
      pivotRef.current.position.set(w / 2, h / 2, 0);
    };

    /* LOOP */
    const loop = async () => {
      if (stopLoop) return;

      // Update pose
      const video = videoRef.current;
      if (video && poseRef.current) {
        try {
          const ts = performance.now();
          const res = await poseRef.current.detectForVideo(video, ts);
          lastPose.current = res?.landmarks?.[0];
        } catch {}
      }

      // Overlay
      if (overlayRef.current) {
        drawPoseOverlay(
          overlayRef.current.width,
          overlayRef.current.height,
          lastPose.current
        );
      }

      // Update garment transform + arm bones
      if (shirtGroupRef.current && overlayRef.current && cameraRef.current) {
        const W = overlayRef.current.width;
        const H = overlayRef.current.height;

        const lm = lastPose.current;
        const Ls = lm?.[LIDX],
          Rs = lm?.[RIDX];
        const Le = lm?.[LELB],
          Re = lm?.[RELB];
        const Lw = lm?.[LWR],
          Rw = lm?.[RWR];
        const Lh = lm?.[LHIP],
          Rh = lm?.[RHIP];

        if (
          Ls &&
          Rs &&
          (Ls.visibility ?? 1) >= VIS_THRESH &&
          (Rs.visibility ?? 1) >= VIS_THRESH
        ) {
          // Shoulders (screen)
          const x1 = p2sX(Ls.x, W),
            y1 = p2sY(Ls.y, H);
          const x2 = p2sX(Rs.x, W),
            y2 = p2sY(Rs.y, H);
          const shoulderPx = Math.hypot(x2 - x1, y2 - y1);

          // Torso length for smarter down-offset
          let torsoPx = 0;
          if (Lh && Rh) {
            const hx = (p2sX(Lh.x, W) + p2sX(Rh.x, W)) * 0.5;
            const hy = (p2sY(Lh.y, H) + p2sY(Rh.y, H)) * 0.5;
            const sx = (x1 + x2) * 0.5;
            const sy = (y1 + y2) * 0.5;
            torsoPx = Math.hypot(hx - sx, hy - sy);
          }

          // Midpoint + combined nudges
          let midX = (x1 + x2) * 0.5;
          let midY =
            (y1 + y2) * 0.5 +
            1000 +
            NUDGE.byShoulder * shoulderPx +
            TORSO_NUDGE_FACTOR * torsoPx;

          // to world (ortho)
          const ndcX = (midX / W) * 2 - 1;
          const ndcY = -(midY / H) * 2 + 1;
          const world = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(
            cameraRef.current
          );

          // Smooth placement
          lastPos.current.lerp(world, SMOOTH.pos);
          setGroupFromWorld(lastPos.current);

          // Scale from shoulder width
          let s =
            (shoulderPx / (anchorShoulderDistRef.current ?? 240)) * SCALE_FIT;
          s = Math.min(SCALE_CLAMP.max, Math.max(SCALE_CLAMP.min, s));
          lastScl.current += (s - lastScl.current) * SMOOTH.scl;
          shirtGroupRef.current.scale.set(
            lastScl.current,
            lastScl.current,
            lastScl.current
          );

          // Rotate garment to shoulder tilt
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const targetRotZ = MIRROR_X_COORDS ? angle : -angle;
          lastRot.current += (targetRotZ - lastRot.current) * SMOOTH.rot;
          shirtGroupRef.current.rotation.set(0, 0, lastRot.current);

          // Keep shoulders at rest
          setToRest(bonesRef.current.LSH, "LSH");
          setToRest(bonesRef.current.RSH, "RSH");

          // Drive arms (Z rotation only)
          const B = bonesRef.current;
          const applyZ = (
            bone: THREE.Bone | undefined,
            key: string,
            z: number
          ) => {
            if (!bone) return;
            const base = B.restQ[key];
            if (!base) return;
            const prev = B.lastZ[key] ?? 0;
            const sm = prev + (z - prev) * SMOOTH.arm;
            B.lastZ[key] = sm;
            const rotZ = new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(0, 0, 1),
              sm
            );
            bone.quaternion.copy(base.clone().multiply(rotZ));
          };

          if (Le && Lw && (Le.visibility ?? 1) >= VIS_THRESH) {
            const l_s = { x: x1, y: y1 };
            const l_e = { x: p2sX(Le.x, W), y: p2sY(Le.y, H) };
            const l_w = { x: p2sX(Lw.x, W), y: p2sY(Lw.y, H) };
            applyZ(B.LU, "LU", angle2D(l_s.x, l_s.y, l_e.x, l_e.y));
            applyZ(B.LL, "LL", angle2D(l_e.x, l_e.y, l_w.x, l_w.y));
          }

          if (Re && Rw && (Re.visibility ?? 1) >= VIS_THRESH) {
            const r_s = { x: x2, y: y2 };
            const r_e = { x: p2sX(Re.x, W), y: p2sY(Re.y, H) };
            const r_w = { x: p2sX(Rw.x, W), y: p2sY(Rw.y, H) };
            applyZ(B.RU, "RU", angle2D(r_s.x, r_s.y, r_e.x, r_e.y));
            applyZ(B.RL, "RL", angle2D(r_e.x, r_e.y, r_w.x, r_w.y));
          }
        }
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      rafId = requestAnimationFrame(loop);
    };

    (async () => {
      await startCamera();
      await initVision();
      initThree();
      fitAll();
      window.addEventListener("resize", fitAll);
      loop();
    })();

    return () => {
      stopLoop = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", fitAll);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      <button
        onClick={() => router.push("/shop-standard")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 20,
          background: "#0006",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 6,
        }}
      >
        ← Back
      </button>

      {/* Mirrored video for “selfie” feel */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          zIndex: 1,
        }}
      />

      <canvas
        ref={threeCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      />

      {/* Cyan pose overlay (no RGB axes) */}
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
