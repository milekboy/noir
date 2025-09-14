"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Three.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Assets
const GLASSES_URL = "/assets/model/glasses.glb";
const HAT_URL = "/assets/model/hat_glb.glb";
const WATCH_URL = "/assets/model/wristwatch.glb";

// Debug
const SHOW_FACE_DOTS = false;

// Face indices
const FACE_LEFT_EYE_OUTER = 33;
const FACE_RIGHT_EYE_OUTER = 263;
const FACE_FOREHEAD = 10;
const FACE_CHIN = 152;
const FACE_LEFT_TEMPLE = 234;
const FACE_RIGHT_TEMPLE = 454;

// Pose connections
const POSE_CONNECTIONS: [string, string][] = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  ["left_ankle", "left_heel"],
  ["left_heel", "left_foot_index"],
  ["right_ankle", "right_heel"],
  ["right_heel", "right_foot_index"],
  ["left_eye", "right_eye"],
  ["left_ear", "left_shoulder"],
  ["right_ear", "right_shoulder"],
];

// Pose indices → names
const MP_INDEX_TO_NAME: Record<number, string> = {
  0: "nose",
  2: "left_eye",
  5: "right_eye",
  7: "left_ear",
  8: "right_ear",
  11: "left_shoulder",
  12: "right_shoulder",
  13: "left_elbow",
  14: "right_elbow",
  15: "left_wrist",
  16: "right_wrist",
  23: "left_hip",
  24: "right_hip",
  25: "left_knee",
  26: "right_knee",
  27: "left_ankle",
  28: "right_ankle",
  29: "left_heel",
  30: "right_heel",
  31: "left_foot_index",
  32: "right_foot_index",
};

// Hands connections (unchanged)
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // index
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // middle
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // ring
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20], // pinky
  [0, 17], // palm base
];

function isPalmFacingCamera(
  hand: Array<{ x: number; y: number; z?: number }>
): boolean {
  if (!hand[0] || !hand[5] || !hand[17]) return false;
  const wrist = hand[0];
  const indexBase = hand[5];
  const pinkyBase = hand[17];

  const v1 = {
    x: indexBase.x - wrist.x,
    y: indexBase.y - wrist.y,
    z: (indexBase.z ?? 0) - (wrist.z ?? 0),
  };
  const v2 = {
    x: pinkyBase.x - wrist.x,
    y: pinkyBase.y - wrist.y,
    z: (pinkyBase.z ?? 0) - (wrist.z ?? 0),
  };

  const normal = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };

  const camDir = { x: 0, y: 0, z: -1 };
  const dot = normal.x * camDir.x + normal.y * camDir.y + normal.z * camDir.z;
  return dot > 0;
}

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

// ---------- Hat tuning knobs ----------
const HAT_SCALE_FACTOR = 0.042;
const HAT_LIFT_FACTOR = 0.1;
const HAT_FORWARD_OFFSET = -0.23;
const HAT_OCCLUDER_SCALE = { x: 0.3, y: 0.1, z: 0.42 }; // unused after dynamic occluder

// ---------- Watch tuning knobs ----------
const WATCH_DEPTH = 0.9;
const WATCH_BASE_SCALE = 6;
const WATCH_SCALE_K = 0.0007;
const WATCH_SCALE_MIN = 0.03;
const WATCH_SCALE_MAX = 0.12;
const WATCH_LOCAL_OFFSET = new THREE.Vector3(0.0, 0.0, 0.0);

export default function TryOn() {
  const router = useRouter();

  // DOM
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  // Models
  const poseRef = useRef<any | null>(null);
  const faceRef = useRef<any | null>(null);
  const handRef = useRef<any | null>(null);

  // Three.js
  const webglRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRafRef = useRef<number | null>(null);

  // Glasses
  const glassAnchorRef = useRef<THREE.Group | null>(null);
  const glassAdjustRef = useRef<THREE.Group | null>(null);
  const glassesLoadedRef = useRef(false);
  const occluderRef = useRef<THREE.Mesh | null>(null);

  // Hat
  const hatAnchorRef = useRef<THREE.Group | null>(null);
  const hatAdjustRef = useRef<THREE.Group | null>(null);
  const hatLoadedRef = useRef(false);
  const hatOccluderRef = useRef<THREE.Mesh | null>(null);

  // Watch
  const watchAnchorRef = useRef<THREE.Group | null>(null);
  const watchAdjustRef = useRef<THREE.Group | null>(null);
  const watchLoadedRef = useRef(false);

  // Smoothing for glasses (unchanged)
  const filtPos = useRef(new THREE.Vector3());
  const filtQuat = useRef(new THREE.Quaternion());
  const filtScale = useRef(0.12);

  // UI toggles (glasses/hat only)
  const [showGlasses, setShowGlasses] = useState(true);
  const [showHat, setShowHat] = useState(true);

  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});
  const logHandFramesRef = useRef(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    let stopRaf = false;

    const isIOS =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const startCamera = async () => {
      try {
        const idealW = isIOS ? 960 : 1280;
        const idealH = isIOS ? 540 : 720;

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: idealW },
            height: { ideal: idealH },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "");
          videoRef.current.setAttribute("autoplay", "");
          videoRef.current.muted = true;
          // @ts-ignore
          videoRef.current.disablePictureInPicture = true;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error("[CAM] error:", e);
      }
    };

    const fitCanvas = () => {
      const el = containerRef.current;
      const cv = overlayRef.current;
      if (!el) return;

      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;

      if (cv) {
        cv.width = w;
        cv.height = h;
      }
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(w, h, false);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const initModels = async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const {
        FilesetResolver,
        PoseLandmarker,
        FaceLandmarker,
        HandLandmarker,
      } = vision;

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

      faceRef.current = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: true,
      });

      handRef.current = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      console.log("[LOCAL] Pose, Face, and Hand models ready");
    };

    // ---------- Three.js init (ASYNCHRONOUS NOW for env) ----------
    const initThree = async () => {
      if (!webglRef.current || rendererRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: webglRef.current,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false,
      });
      renderer.setPixelRatio(window.devicePixelRatio || 1);

      // >>> PBR pipeline so metals look correct

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Add an environment for reflections (fast PMREM Room env)
      const pmrem = new THREE.PMREMGenerator(renderer);
      const { RoomEnvironment } = await import(
        "three/examples/jsm/environments/RoomEnvironment.js"
      );
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      // Lights (keep simple; env does most of the work)
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(0.5, 1, 1);
      scene.add(dir);

      // Camera
      const el = containerRef.current;
      const w = el?.clientWidth || window.innerWidth;
      const h = el?.clientHeight || window.innerHeight;
      const cam = new THREE.PerspectiveCamera(50, w / h, 0.01, 100);
      cam.position.set(0, 0, 2);
      cam.lookAt(0, 0, 0);
      cameraRef.current = cam;

      renderer.setSize(w, h, false);

      // Anchors
      const glassesAnchor = new THREE.Group();
      const hatAnchor = new THREE.Group();
      const watchAnchor = new THREE.Group();
      scene.add(glassesAnchor, hatAnchor, watchAnchor);
      glassAnchorRef.current = glassesAnchor;
      hatAnchorRef.current = hatAnchor;
      watchAnchorRef.current = watchAnchor;

      // Glasses occluder (depth-only)
      const occGeo = new THREE.BoxGeometry(1, 1, 0.25);
      const occMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (occMat as any).colorWrite = false;

      const gOcc = new THREE.Mesh(occGeo, occMat);
      gOcc.name = "HEAD_OCCLUDER";
      gOcc.position.set(0, 0, -0.04);
      gOcc.scale.set(0.3, 0.4, 0.5);
      glassesAnchor.add(gOcc);
      occluderRef.current = gOcc;

      // Hat occluder (depth-only, dynamic scale later)
      const hOccGeo = new THREE.BoxGeometry(1, 1, 0.25);
      const hOccMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (hOccMat as any).colorWrite = false;

      const hOcc = new THREE.Mesh(hOccGeo, hOccMat);
      hOcc.name = "HAT_OCCLUDER";
      hOcc.position.set(0, 0, -0.04);
      hOcc.scale.set(0.3, 0.4, 0.5);
      hatAnchor.add(hOcc);
      hatOccluderRef.current = hOcc;

      console.log("[THREE] init OK", { w, h });
    };

    const fitCameraToObject = (obj: THREE.Object3D) => {
      if (!cameraRef.current) return;
      const cam = cameraRef.current;

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      obj.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fov = (cam.fov * Math.PI) / 180;
      const dist = maxDim / 2 / Math.tan(fov / 2);

      cam.position.set(0, 0, dist * 1.6);
      cam.near = Math.max(0.01, dist / 50);
      cam.far = dist * 50;
      cam.updateProjectionMatrix();
    };

    const makePBRHappy = (model: THREE.Object3D) => {
      model.traverse((o: any) => {
        if (o.isMesh) {
          o.frustumCulled = false;
          o.castShadow = false;
          o.receiveShadow = false;
          if (o.material && o.material.isMeshStandardMaterial) {
            // stronger environment reflections for metal/plastic
            o.material.envMapIntensity = 1.2;
            o.material.needsUpdate = true;
          }
        }
      });
    };

    const loadGlasses = async () => {
      if (!sceneRef.current || !glassAnchorRef.current) return;
      if (glassesLoadedRef.current) return;

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          GLASSES_URL,
          (gltf) => {
            const model = gltf.scene;
            makePBRHappy(model);

            const adjust = new THREE.Group();
            adjust.name = "GLASSES_ADJUST";
            adjust.add(model);

            adjust.scale.setScalar(0.12);
            adjust.position.set(0, 0.02, 0.02);
            adjust.rotation.set(0, 0, 0);

            glassAdjustRef.current = adjust;
            glassAnchorRef.current!.add(adjust);
            glassesLoadedRef.current = true;

            fitCameraToObject(adjust);
            resolve();
          },
          undefined,
          (err) => reject(err)
        );
      });
    };

    const loadHat = async () => {
      if (!sceneRef.current || !hatAnchorRef.current) return;
      if (hatLoadedRef.current) return;

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          HAT_URL,
          (gltf) => {
            const model = gltf.scene;
            makePBRHappy(model);

            const adjust = new THREE.Group();
            adjust.name = "HAT_ADJUST";
            adjust.add(model);

            adjust.scale.setScalar(HAT_SCALE_FACTOR);
            adjust.position.set(0, 0.015, 0.0);
            adjust.rotation.set(0, 0, 0);

            hatAdjustRef.current = adjust;
            hatAnchorRef.current!.add(adjust);
            hatLoadedRef.current = true;

            resolve();
          },
          undefined,
          (err) => reject(err)
        );
      });
    };

    const loadWatch = async () => {
      if (!sceneRef.current || !watchAnchorRef.current) return;
      if (watchLoadedRef.current) return;

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          WATCH_URL,
          (gltf) => {
            console.log("[WATCH] Model loaded:", gltf);
            const model = gltf.scene;
            makePBRHappy(model);

            const adjust = new THREE.Group();
            adjust.name = "WATCH_ADJUST";
            adjust.add(model);

            // Initial size; overridden each frame
            adjust.scale.setScalar(WATCH_BASE_SCALE);
            adjust.position.copy(WATCH_LOCAL_OFFSET);
            adjust.rotation.set(-Math.PI / 2, 0, 0);

            watchAdjustRef.current = adjust;
            watchAnchorRef.current!.add(adjust);
            watchLoadedRef.current = true;

            resolve();
          },
          undefined,
          (err) => reject(err)
        );
      });
    };

    const ndcToWorldAtDistance = (
      ndcX: number,
      ndcY: number,
      distance: number
    ) => {
      const cam = cameraRef.current!;
      const p = new THREE.Vector3(ndcX, ndcY, 0).unproject(cam);
      const dir = p.sub(cam.position).normalize();
      return cam.position.clone().add(dir.multiplyScalar(distance));
    };

    const renderThreeLoop = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        threeRafRef.current = requestAnimationFrame(renderThreeLoop);
        return;
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      threeRafRef.current = requestAnimationFrame(renderThreeLoop);
    };

    const parseHandLabel = (raw: any) => {
      try {
        let v = raw;
        while (Array.isArray(v) && v.length > 0) v = v[0];
        if (!v) return "Hand";
        if (typeof v === "string") return v;
        if (typeof v === "object") {
          return (
            v.label ||
            v.categoryName ||
            v.category ||
            v.name ||
            v.displayName ||
            v.labelName ||
            v.tag ||
            "Hand"
          );
        }
      } catch {}
      return "Hand";
    };

    const startLoop = () => {
      const video = videoRef.current;
      const canvas = overlayRef.current;
      if (
        !video ||
        !poseRef.current ||
        !canvas ||
        !faceRef.current ||
        !handRef.current
      )
        return;

      runningRef.current = true;
      const ctx = canvas.getContext("2d")!;

      const processFrame = async () => {
        if (!runningRef.current) return;
        const tsMs = performance.now();

        try {
          // Pose
          const poseRes = await poseRef.current.detectForVideo(video, tsMs);
          const poseLm = poseRes?.landmarks?.[0];

          // Face + head pose
          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm: MPPoint[] | undefined = faceRes?.faceLandmarks?.[0];
          const faceMat: Float32Array | undefined =
            faceRes?.facialTransformationMatrixes?.[0]?.data;

          // Hands
          const handRes = await handRef.current.detectForVideo(video, tsMs);
          const handsLm: Array<Array<MPPoint>> = handRes?.landmarks || [];
          const handednessRaw =
            (handRes as any)?.handednesses ??
            (handRes as any)?.handedness ??
            [];

          const W = canvas.width,
            H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // --- Draw Pose (unchanged)
          if (poseLm) {
            const dict: Record<string, MPPoint> = {};
            for (const [idxStr, name] of Object.entries(MP_INDEX_TO_NAME)) {
              const idx = Number(idxStr);
              const L = poseLm[idx];
              if (L) dict[name] = L;
            }
            const toPx = (p: MPPoint) => ({ x: p.x * W, y: p.y * H });

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "rgba(0, 200, 255, 0.9)";
            for (const [a, b] of POSE_CONNECTIONS) {
              const pa = dict[a],
                pb = dict[b];
              if (!pa || !pb) continue;
              const A = toPx(pa),
                B = toPx(pb);
              ctx.beginPath();
              ctx.moveTo(A.x, A.y);
              ctx.lineTo(B.x, B.y);
              ctx.stroke();
            }
            ctx.fillStyle = "rgba(0, 200, 255, 0.9)";
            for (const name in dict) {
              const P = toPx(dict[name]);
              ctx.beginPath();
              ctx.arc(P.x, P.y, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // --- Face dots (disabled)
          if (SHOW_FACE_DOTS && faceLm) {
            ctx.fillStyle = "rgba(0,255,0,0.7)";
            for (let i = 0; i < faceLm.length; i += 2) {
              const pt = faceLm[i];
              ctx.beginPath();
              ctx.arc(pt.x * W, pt.y * H, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // --- Hands (unchanged visuals)
          if (handsLm && handsLm.length) {
            if (logHandFramesRef.current < 6) {
              try {
                console.log("handRes", handRes);
              } catch {}
            }

            for (let hi = 0; hi < handsLm.length; hi++) {
              const lm = handsLm[hi];

              // skeleton
              ctx.strokeStyle = "rgba(255,255,255,0.9)";
              for (const [a, b] of HAND_CONNECTIONS) {
                const A = lm[a],
                  B = lm[b];
                if (!A || !B) continue;
                ctx.beginPath();
                ctx.moveTo(A.x * W, A.y * H);
                ctx.lineTo(B.x * W, B.y * H);
                ctx.stroke();
              }

              // points
              ctx.fillStyle = "rgba(0,150,255,0.9)";
              for (const pt of lm) {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, 2.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // ===== 3D GLASSES ANCHORING (unchanged) =====
          if (glassAnchorRef.current && glassAdjustRef.current && faceLm) {
            const anchor = glassAnchorRef.current;

            // Orientation
            if (faceMat && faceMat.length === 16) {
              const m = new THREE.Matrix4().fromArray(Array.from(faceMat));
              const pos = new THREE.Vector3();
              const quat = new THREE.Quaternion();
              const scl = new THREE.Vector3();
              m.decompose(pos, quat, scl);

              const ALPHA_ROT = 0.25;
              filtQuat.current.slerp(quat, ALPHA_ROT);
              anchor.quaternion.copy(filtQuat.current);
            }

            // Position from eye midpoint
            const L = faceLm[FACE_LEFT_EYE_OUTER];
            const R = faceLm[FACE_RIGHT_EYE_OUTER];
            if (L && R && cameraRef.current) {
              const mx = (L.x * W + R.x * W) * 0.5;
              const my = (L.y * H + R.y * H) * 0.5;
              const ndcX = (mx / W) * 2 - 1;
              const ndcY = -(my / H) * 2 + 1;

              const targetPos = ndcToWorldAtDistance(ndcX, ndcY, 0.9);
              targetPos.y -= filtScale.current * 0.02;

              const ALPHA_POS = 0.3;
              filtPos.current.lerp(targetPos, ALPHA_POS);
              anchor.position.copy(filtPos.current);
            }

            // Scale from IPD + update occluder
            if (faceLm[FACE_LEFT_EYE_OUTER] && faceLm[FACE_RIGHT_EYE_OUTER]) {
              const lx = faceLm[FACE_LEFT_EYE_OUTER].x * W;
              const ly = faceLm[FACE_LEFT_EYE_OUTER].y * H;
              const rx = faceLm[FACE_RIGHT_EYE_OUTER].x * W;
              const ry = faceLm[FACE_RIGHT_EYE_OUTER].y * H;
              const ipdPx = Math.hypot(rx - lx, ry - ly);

              const desiredScale = THREE.MathUtils.clamp(
                ipdPx * 0.0017,
                0.08,
                0.35
              );
              const ALPHA_SCL = 0.3;
              filtScale.current = THREE.MathUtils.lerp(
                filtScale.current,
                desiredScale,
                ALPHA_SCL
              );

              const s = filtScale.current;
              glassAdjustRef.current.scale.set(s, s, s);

              if (occluderRef.current) {
                const Lc = faceLm[FACE_LEFT_TEMPLE];
                const Rc = faceLm[FACE_RIGHT_TEMPLE];
                const Fore = faceLm[FACE_FOREHEAD];
                const Chin = faceLm[FACE_CHIN];

                const headWidthPx =
                  Lc && Rc
                    ? Math.hypot(Rc.x * W - Lc.x * W, Rc.y * H - Lc.y * H)
                    : ipdPx * 2.6;
                const headHeightPx =
                  Fore && Chin
                    ? Math.hypot(
                        Chin.x * W - Fore.x * W,
                        Chin.y * H - Fore.y * H
                      )
                    : ipdPx * 3.2;

                const widthWorld = s * (headWidthPx / (ipdPx || 1)) * 1.15;
                const heightWorld = s * (headHeightPx / (ipdPx || 1)) * 1.05;
                const depthWorld = s * 0.75;

                occluderRef.current.scale.set(
                  widthWorld,
                  heightWorld,
                  depthWorld
                );
                occluderRef.current.position.set(0, 0, -0.04);
              }
            }
          }

          // ===== HAT ANCHORING (unchanged) =====
          if (hatAnchorRef.current && hatAdjustRef.current && faceLm) {
            if (faceMat && faceMat.length === 16) {
              const m = new THREE.Matrix4().fromArray(Array.from(faceMat));
              const pos = new THREE.Vector3();
              const quat = new THREE.Quaternion();
              const scl = new THREE.Vector3();
              m.decompose(pos, quat, scl);
              hatAnchorRef.current.quaternion.copy(quat);
            }

            const L = faceLm[FACE_LEFT_EYE_OUTER];
            const R = faceLm[FACE_RIGHT_EYE_OUTER];
            const Fore = faceLm[FACE_FOREHEAD];
            const Chin = faceLm[FACE_CHIN];

            if (L && R && Fore && cameraRef.current) {
              const mx = (L.x * W + R.x * W) * 0.5;
              const my = (L.y * H + R.y * H) * 0.5;
              const ndcX = (mx / W) * 2 - 1;
              const ndcY = -(my / H) * 2 + 1;

              const basePos = ndcToWorldAtDistance(ndcX, ndcY, 0.88);

              const faceHeightPx = Math.max(
                20,
                Math.hypot(Chin.x * W - Fore.x * W, Chin.y * H - Fore.y * H)
              );
              basePos.y += (faceHeightPx / 1000) * HAT_LIFT_FACTOR;

              hatAnchorRef.current.position.copy(basePos);

              const ipdPx = Math.hypot(R.x * W - L.x * W, R.y * H - L.y * H);
              const hatScale = THREE.MathUtils.clamp(
                ipdPx * 0.0021,
                0.035,
                0.09
              );
              hatAdjustRef.current.scale.setScalar(hatScale);

              hatAdjustRef.current.position.set(0, 0.025, HAT_FORWARD_OFFSET);

              if (
                hatOccluderRef.current &&
                faceLm[FACE_LEFT_EYE_OUTER] &&
                faceLm[FACE_RIGHT_EYE_OUTER]
              ) {
                const lx = faceLm[FACE_LEFT_EYE_OUTER].x * W;
                const ly = faceLm[FACE_LEFT_EYE_OUTER].y * H;
                const rx = faceLm[FACE_RIGHT_EYE_OUTER].x * W;
                const ry = faceLm[FACE_RIGHT_EYE_OUTER].y * H;
                const ipd = Math.hypot(rx - lx, ry - ly);

                const Lc = faceLm[FACE_LEFT_TEMPLE];
                const Rc = faceLm[FACE_RIGHT_TEMPLE];
                const headWidthPx =
                  Lc && Rc
                    ? Math.hypot(Rc.x * W - Lc.x * W, Rc.y * H - Lc.y * H)
                    : ipd * 2.6;

                const headHeightPx =
                  Fore && Chin
                    ? Math.hypot(
                        Chin.x * W - Fore.x * W,
                        Chin.y * H - Fore.y * H
                      )
                    : ipd * 3.2;

                const sHat = hatAdjustRef.current.scale.x;

                const widthWorld = sHat * (headWidthPx / (ipd || 1)) * 2.4;
                const heightWorld = sHat * (headHeightPx / (ipd || 1)) * 0.8;
                const depthWorld = sHat * 0.9;

                hatOccluderRef.current.scale.set(
                  widthWorld,
                  heightWorld,
                  depthWorld
                );
                hatOccluderRef.current.position.set(0, -0.02, -0.05);
              }
            }
          }

          // ===== WATCH ANCHORING (new) =====
          if (watchAnchorRef.current && watchAdjustRef.current) {
            // Decide which hand to use:
            let chosenIndex = -1;
            if (handsLm.length === 1) {
              chosenIndex = 0;
            } else if (handsLm.length >= 2) {
              // Prefer "Left"
              const label0 = parseHandLabel(handednessRaw[0]).toLowerCase();
              const label1 = parseHandLabel(handednessRaw[1]).toLowerCase();
              if (label0.includes("left")) chosenIndex = 0;
              else if (label1.includes("left")) chosenIndex = 1;
              else chosenIndex = 0;
            }

            if (chosenIndex < 0) {
              watchAnchorRef.current.visible = false;
            } else {
              const lm = handsLm[chosenIndex];
              const wrist = lm?.[0];
              const indexBase = lm?.[5];
              const pinkyBase = lm?.[17];

              if (!wrist || !indexBase || !pinkyBase || !cameraRef.current) {
                watchAnchorRef.current.visible = false;
              } else {
                watchAnchorRef.current.visible = true;

                // Position: project wrist to world
                const wx = wrist.x * W;
                const wy = wrist.y * H;
                const ndcX = (wx / W) * 2 - 1;
                const ndcY = -(wy / H) * 2 + 1;
                const wristWorld = ndcToWorldAtDistance(
                  ndcX,
                  ndcY,
                  WATCH_DEPTH
                );
                watchAnchorRef.current.position.copy(wristWorld);

                // Rotation in screen plane
                const ivx = indexBase.x * W - wx;
                const ivy = indexBase.y * H - wy;
                const angleZ = Math.atan2(ivy, ivx);
                watchAnchorRef.current.rotation.set(0, 0, angleZ);

                // Scale from hand span
                const spanPx = Math.hypot(
                  indexBase.x * W - pinkyBase.x * W,
                  indexBase.y * H - pinkyBase.y * H
                );
                const sWatch = THREE.MathUtils.clamp(
                  spanPx * WATCH_SCALE_K || WATCH_BASE_SCALE,
                  WATCH_SCALE_MIN,
                  WATCH_SCALE_MAX
                );
                watchAdjustRef.current.scale.setScalar(sWatch);

                // Local nudge if needed
                watchAdjustRef.current.position.copy(WATCH_LOCAL_OFFSET);
              }
            }
          }
        } catch {
          // ignore intermittent errors
        }
      };

      const hasRVFC =
        !isIOS &&
        typeof (video as any).requestVideoFrameCallback === "function";

      if (hasRVFC) {
        const loopRVFC = () => {
          if (!runningRef.current) return;
          processFrame().finally(() => {
            (video as any).requestVideoFrameCallback(loopRVFC);
          });
        };
        (video as any).requestVideoFrameCallback(loopRVFC);
      } else {
        const loopRAF = () => {
          if (!runningRef.current || stopRaf) return;
          processFrame().finally(() => {
            rafId = requestAnimationFrame(loopRAF);
          });
        };
        rafId = requestAnimationFrame(loopRAF);
      }

      cleanupRef.current = () => {
        runningRef.current = false;
        stopRaf = true;
        if (rafId) cancelAnimationFrame(rafId);
      };
    };

    (async () => {
      await startCamera();
      fitCanvas();

      await initThree(); // <-- now async to build PMREM env
      await Promise.all([loadGlasses(), loadHat(), loadWatch()]);
      renderThreeLoop();

      await initModels();
      startLoop();

      const onResize = () => fitCanvas();
      window.addEventListener("resize", onResize);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) runningRef.current = false;
        else if (!runningRef.current) {
          runningRef.current = true;
          const video = videoRef.current;
          if (video) requestAnimationFrame(() => startLoop());
        }
      });

      cleanupRef.current = () => {
        window.removeEventListener("resize", onResize);
        runningRef.current = false;
        if (rafId) cancelAnimationFrame(rafId);
        if (threeRafRef.current) cancelAnimationFrame(threeRafRef.current);
        if (stream) stream.getTracks().forEach((t) => t.stop());
        rendererRef.current?.dispose();
        sceneRef.current = null;
        cameraRef.current = null;
      };
    })();

    return () => cleanupRef.current?.();
  }, []);

  // Visibility toggles
  useEffect(() => {
    if (glassAnchorRef.current) glassAnchorRef.current.visible = showGlasses;
    if (occluderRef.current) occluderRef.current.visible = showGlasses;
  }, [showGlasses]);

  useEffect(() => {
    if (hatAnchorRef.current) hatAnchorRef.current.visible = showHat;
    if (hatOccluderRef.current) hatOccluderRef.current.visible = showHat;
  }, [showHat]);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isIOS ? "60vh" : "100vh",
        background: "black",
        overflow: "hidden",
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.push("/shop-standard")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: "6px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "1px solid white",
          cursor: "pointer",
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? "100px"
              : "0",
        }}
      >
        ← Back
      </button>

      {/* Toggles */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={() => setShowGlasses((v) => !v)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #fff",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {showGlasses ? "Hide Glasses" : "Show Glasses"}
        </button>
        <button
          onClick={() => setShowHat((v) => !v)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #fff",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {showHat ? "Hide Hat" : "Show Hat"}
        </button>
      </div>

      {/* Video */}
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
          zIndex: 1,
        }}
      />

      {/* Three.js */}
      <canvas
        ref={webglRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* 2D overlay */}
      <canvas
        ref={overlayRef}
        style={{
          display: "none",
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
