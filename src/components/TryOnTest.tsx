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
const SHOE_URL = "/assets/model/shoes.glb";

// ------------ Debug toggles -------------
const SHOW_FACE_DOTS = false;
const DEBUG_FEET = true; // draw ankle→toe line + heel marker
const SHOW_WATCH = false; // <— hide watch for now

const isLargeScreen =
  typeof window !== "undefined" && window.innerWidth >= 1024;

// Face indices
const FACE_LEFT_EYE_OUTER = 33;
const FACE_RIGHT_EYE_OUTER = 263;
const FACE_FOREHEAD = 10;
const FACE_CHIN = 152;
const FACE_LEFT_TEMPLE = 234;
const FACE_RIGHT_TEMPLE = 454;

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

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

// ---- Shoe tuning knobs ----

const SHOE_MODEL_CORRECTION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, Math.PI, "XYZ")
);
// --- Shoes: easy tuning knobs ---
const SHOE_DEPTH = 1.05; // 0.95–1.15 (closer/farther from camera ray)
const SHOE_SCALE_MULT = 7.5; // 7–11 (overall size from heel↔toe)
const SHOE_MODEL_OFFSET = new THREE.Vector3(0, -0.028, -0.01);
//                                   ↑down (sole)  ↑back (toward heel)
// If pointing is a bit off, nudge yaw a little:
const SHOE_YAW_NUDGE = 0.0; // radians; try ±0.15

// Smoothing / stability
const EMA_POS = 0.3; // 0..1 (higher = snappier)
const EMA_ROT = 0.3;
const EMA_SCALE = 0.25;
const OUTLIER_MAX_JUMP = 0.25; // meters; ignore bigger jumps
const MIN_VISIBILITY = 0.4; // MP visibility threshold

// ---------- Hat tuning knobs ----------
const HAT_SCALE_FACTOR = 0.032;
const HAT_LIFT_FACTOR = 0.08;
const HAT_FORWARD_OFFSET = -0.23;

// ---------- Watch tuning knobs (kept but gated) ----------
const WATCH_DEPTH = 0.9;
const WATCH_BASE_SCALE = 6;
const WATCH_SCALE_MIN = 0.05;
const WATCH_SCALE_MAX = Infinity;
const WATCH_WORLD_FACTOR = 30;
const WATCH_LOCAL_OFFSET = new THREE.Vector3(0.0, 0.0, 0.0);
const WATCH_ROLL_SMOOTH = 0.35;
const WATCH_MODEL_CORRECTION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, Math.PI / 2, 0, "XYZ")
);

export default function TryTest() {
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

  // Shoes
  const leftShoeAnchorRef = useRef<THREE.Group | null>(null);
  const rightShoeAnchorRef = useRef<THREE.Group | null>(null);
  const shoesLoadedRef = useRef(false);

  // Hat
  const hatAnchorRef = useRef<THREE.Group | null>(null);
  const hatAdjustRef = useRef<THREE.Group | null>(null);
  const hatLoadedRef = useRef(false);
  const hatOccluderRef = useRef<THREE.Mesh | null>(null);

  // Watch (kept but hidden)
  const watchAnchorRef = useRef<THREE.Group | null>(null);
  const watchAdjustRef = useRef<THREE.Group | null>(null);
  const watchLoadedRef = useRef(false);
  const watchQuatRef = useRef(new THREE.Quaternion());
  const prevZRef = useRef(new THREE.Vector3(0, 0, 1));
  const watchRectOccluderRef = useRef<THREE.Mesh | null>(null);

  // Foot smoothing state
  const Lpos = useRef(new THREE.Vector3());
  const Lquat = useRef(new THREE.Quaternion());
  const Lscale = useRef(0.12);
  const Rpos = useRef(new THREE.Vector3());
  const Rquat = useRef(new THREE.Quaternion());
  const Rscale = useRef(0.12);

  // Glasses smoothing
  const filtPos = useRef(new THREE.Vector3());
  const filtQuat = useRef(new THREE.Quaternion());
  const filtScale = useRef(0.12);

  // Toggles
  const [showGlasses, setShowGlasses] = useState(true);
  const [showHat, setShowHat] = useState(true);
  const showGlassesRef = useRef(true);
  const showHatRef = useRef(true);

  // Tracking-gate refs
  const faceGateRef = useRef(false);
  const handGateRef = useRef(false);

  // Loading overlay
  const [modelsReady, setModelsReady] = useState(false);

  // Camera stream
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  // ---- CAMERA HELPERS ----
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (mode: "user" | "environment") => {
    stopStream();
    const isIOS =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const idealW = isIOS ? 960 : 1280;
    const idealH = isIOS ? 540 : 720;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: mode },
        width: { ideal: idealW },
        height: { ideal: idealH },
      },
      audio: false,
    });

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", "");
      videoRef.current.setAttribute("autoplay", "");
      videoRef.current.muted = true;
      // @ts-ignore
      videoRef.current.disablePictureInPicture = true;
      await videoRef.current.play().catch(() => {});
    }
  };

  const flipCamera = async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await startCamera(next);
  };

  useEffect(() => {
    let rafId: number | null = null;
    let stopRaf = false;

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

    // ---------- Three.js init ----------
    const initThree = async () => {
      if (!webglRef.current || rendererRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: webglRef.current!,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false,
      });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Fast PMREM env
      const pmrem = new THREE.PMREMGenerator(renderer);
      const { RoomEnvironment } = await import(
        "three/examples/jsm/environments/RoomEnvironment.js"
      );
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(0.5, 1, 1);
      scene.add(dir);

      // Camera
      const el = containerRef.current!;
      const w = el?.clientWidth || window.innerWidth;
      const h = el?.clientHeight || window.innerHeight;
      const cam = new THREE.PerspectiveCamera(50, w / h, 0.01, 100);
      cam.position.set(0, 0, 2);
      cam.lookAt(0, 0, 0);
      cameraRef.current = cam;
      renderer.setSize(w, h, false);

      // Anchors
      const leftShoeAnchor = new THREE.Group();
      const rightShoeAnchor = new THREE.Group();
      leftShoeAnchor.visible = false;
      rightShoeAnchor.visible = false;
      scene.add(leftShoeAnchor, rightShoeAnchor);
      leftShoeAnchorRef.current = leftShoeAnchor;
      rightShoeAnchorRef.current = rightShoeAnchor;

      const glassesAnchor = new THREE.Group();
      const hatAnchor = new THREE.Group();
      const watchAnchor = new THREE.Group();
      glassesAnchor.visible = false;
      hatAnchor.visible = false;
      watchAnchor.visible = false;
      scene.add(glassesAnchor, hatAnchor, watchAnchor);
      glassAnchorRef.current = glassesAnchor;
      hatAnchorRef.current = hatAnchor;
      watchAnchorRef.current = watchAnchor;

      // Glasses occluder (depth-only)
      const occGeo = new THREE.BoxGeometry(1, 0.5, 0.25);
      const occMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (occMat as any).colorWrite = false;
      const gOcc = new THREE.Mesh(occGeo, occMat);
      gOcc.name = "HEAD_OCCLUDER";
      gOcc.position.set(0, 0, -0.04);
      gOcc.scale.set(0.3, 0, 0.5);
      gOcc.visible = false;
      glassesAnchor.add(gOcc);
      occluderRef.current = gOcc;

      // Hat occluder (depth-only)
      const hOccGeo = new THREE.BoxGeometry(1, 1.3, 0.25);
      const hOccMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (hOccMat as any).colorWrite = false;
      const hOcc = new THREE.Mesh(hOccGeo, hOccMat);
      hOcc.name = "HAT_OCCLUDER";
      hOcc.position.set(0, 0, -0.04);
      hOcc.scale.set(0.22, 0.6, 0.5);
      hOcc.visible = false;
      hatAnchor.add(hOcc);
      hatOccluderRef.current = hOcc;

      // Wrist occluder (kept, but watch hidden by flag)
      const rOccGeo = new THREE.BoxGeometry(0.1, 0.06, 0.01);
      const rOccMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (rOccMat as any).colorWrite = false;
      (rOccMat as any).polygonOffset = true;
      (rOccMat as any).polygonOffsetFactor = -1;
      (rOccMat as any).polygonOffsetUnits = -1;

      const rOcc = new THREE.Mesh(rOccGeo, rOccMat);
      rOcc.name = "WRIST_RECT_OCCLUDER";
      rOcc.visible = false;
      scene.add(rOcc);
      watchRectOccluderRef.current = rOcc;

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
            o.material.envMapIntensity = 1.2;
            o.material.needsUpdate = true;
          }
        }
      });
    };

    const loadShoes = async () => {
      if (
        !sceneRef.current ||
        !leftShoeAnchorRef.current ||
        !rightShoeAnchorRef.current
      )
        return;
      if (shoesLoadedRef.current) return;

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          SHOE_URL,
          (gltf) => {
            const src = gltf.scene;
            makePBRHappy(src);
            src.updateMatrixWorld(true);

            // --- 1) Collect mesh centers along X ---
            const centersX: number[] = [];
            src.traverse((o: any) => {
              if (o.isMesh && o.geometry) {
                o.updateWorldMatrix(true, false);
                const box = new THREE.Box3().setFromObject(o);
                const c = new THREE.Vector3();
                box.getCenter(c);
                centersX.push(c.x);
              }
            });

            // If nothing to split, just duplicate whole model to both anchors.
            const medianX = centersX.length
              ? centersX.slice().sort((a, b) => a - b)[
                  Math.floor(centersX.length / 2)
                ]
              : 0;

            // Helper: mark side by world bbox center.x
            const markSide = (root: THREE.Object3D, keepRight: boolean) => {
              let kept = 0;
              root.traverse((o: any) => {
                if (o.isMesh && o.geometry) {
                  const box = new THREE.Box3().setFromObject(o);
                  const c = new THREE.Vector3();
                  box.getCenter(c);
                  const isRight = c.x > medianX;
                  const visible = keepRight ? isRight : !isRight;
                  o.visible = visible;
                  if (visible) kept++;
                }
              });
              return kept;
            };

            // --- 2) Build two filtered clones ---
            const leftOnly = src.clone(true);
            const rightOnly = src.clone(true);

            let keptL = markSide(leftOnly, false); // keep "left" half
            let keptR = markSide(rightOnly, true); // keep "right" half

            // --- 3) Fallback: if one side ended up empty, disable filtering ---
            if (keptL === 0 || keptR === 0) {
              console.warn(
                "[SHOES] Name/geometry split failed; using full model for both sides."
              );
              leftOnly.traverse((o: any) => {
                if (o.isObject3D) o.visible = true;
              });
              rightOnly.traverse((o: any) => {
                if (o.isObject3D) o.visible = true;
              });
            }

            // --- 4) Orientation + initial scale ---
            leftOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
            rightOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
            leftOnly.scale.setScalar(0.1);
            rightOnly.scale.setScalar(0.1);
            leftOnly.position.copy(SHOE_MODEL_OFFSET);
            rightOnly.position.copy(SHOE_MODEL_OFFSET);
            leftShoeAnchorRef.current!.add(leftOnly);
            rightShoeAnchorRef.current!.add(rightOnly);

            shoesLoadedRef.current = true;

            // Debug: how many meshes survived on each side
            const countVisibleMeshes = (root: THREE.Object3D) => {
              let n = 0;
              root.traverse((o: any) => {
                if (o.isMesh && o.visible) n++;
              });
              return n;
            };
            console.log(
              "[SHOES] visible meshes – left:",
              countVisibleMeshes(leftOnly),
              "right:",
              countVisibleMeshes(rightOnly),
              "medianX:",
              medianX.toFixed(3)
            );

            resolve();
          },
          undefined,
          (err) => reject(err)
        );
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

            adjust.scale.setScalar(0.07);
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
      if (!SHOW_WATCH) return; // short-circuit
      if (!sceneRef.current || !watchAnchorRef.current) return;
      if (watchLoadedRef.current) return;

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          WATCH_URL,
          (gltf) => {
            const model = gltf.scene;
            makePBRHappy(model);

            const adjust = new THREE.Group();
            adjust.name = "WATCH_ADJUST";
            adjust.add(model);

            adjust.quaternion.copy(WATCH_MODEL_CORRECTION);
            adjust.scale.setScalar(WATCH_BASE_SCALE);
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

    // Map MediaPipe landmark (0..1) → canvas pixels with object-fit: cover
    function lmToCanvasPx(
      lm: MPPoint,
      videoEl: HTMLVideoElement,
      canvasEl: HTMLCanvasElement
    ) {
      const vidW = videoEl.videoWidth || 0;
      const vidH = videoEl.videoHeight || 0;
      const canW = canvasEl.width;
      const canH = canvasEl.height;
      if (!vidW || !vidH) return { x: lm.x * canW, y: lm.y * canH }; // fallback

      const scale = Math.max(canW / vidW, canH / vidH);
      const dispW = vidW * scale;
      const dispH = vidH * scale;
      const offX = (canW - dispW) * 0.5;
      const offY = (canH - dispH) * 0.5;

      return { x: offX + lm.x * dispW, y: offY + lm.y * dispH };
    }

    const startLoop = () => {
      const video = videoRef.current!;
      const canvas = overlayRef.current!;
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

          // Hands (kept for future watch)
          const handRes = await handRef.current.detectForVideo(video, tsMs);
          const handsLm: Array<Array<MPPoint>> = handRes?.landmarks || [];

          const W = canvas.width,
            H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // ===== SHOES (cover-aware mapping + smoothing) =====
          // ===== FEET DEBUG ONLY =====
          // ===== SHOES (mapping + smoothing + optional debug) =====
          if (
            poseLm &&
            leftShoeAnchorRef.current &&
            rightShoeAnchorRef.current
          ) {
            const leftAnkle = poseLm[27];
            const rightAnkle = poseLm[28];
            const leftHeel = poseLm[29];
            const rightHeel = poseLm[30];
            const leftToe = poseLm[31];
            const rightToe = poseLm[32];

            const toWorldFromLm = (lm: MPPoint) => {
              const p = lmToCanvasPx(lm, video, canvas); // cover-aware
              const nx = (p.x / canvas.width) * 2 - 1;
              const ny = -(p.y / canvas.height) * 2 + 1;
              return ndcToWorldAtDistance(nx, ny, SHOE_DEPTH);
            };

            const solveFoot = (
              ankle: MPPoint,
              heel: MPPoint,
              toe: MPPoint,
              posRef: React.MutableRefObject<THREE.Vector3>,
              quatRef: React.MutableRefObject<THREE.Quaternion>,
              scaleRef: React.MutableRefObject<number>,
              anchor: THREE.Group
            ) => {
              if (!ankle || !heel || !toe) {
                anchor.visible = false;
                return;
              }

              const visOK =
                (ankle.visibility ?? 1) > MIN_VISIBILITY &&
                (heel.visibility ?? 1) > MIN_VISIBILITY &&
                (toe.visibility ?? 1) > MIN_VISIBILITY;

              if (!visOK) {
                anchor.visible = false;
                return;
              }

              // 1️⃣ Convert MP landmarks to world points at fixed depth
              const ankleW = toWorldFromLm(ankle);
              const heelW = toWorldFromLm(heel);
              const toeW = toWorldFromLm(toe);

              // 2️⃣ Center = midpoint between heel and toe (not using knee)
              const footCenter = new THREE.Vector3()
                .addVectors(heelW, toeW)
                .multiplyScalar(0.5);

              // 3️⃣ Build local basis
              const forward = new THREE.Vector3()
                .subVectors(toeW, heelW)
                .normalize(); // heel→toe
              const upGuess = new THREE.Vector3()
                .subVectors(ankleW, heelW)
                .normalize(); // heel→ankle
              const right = new THREE.Vector3()
                .crossVectors(forward, upGuess)
                .normalize();
              const up = new THREE.Vector3()
                .crossVectors(right, forward)
                .normalize();

              // 4️⃣ Compose rotation + position
              const m = new THREE.Matrix4()
                .makeBasis(right, up, forward)
                .setPosition(footCenter);
              const pos = new THREE.Vector3();
              const q = new THREE.Quaternion();
              const s = new THREE.Vector3();
              m.decompose(pos, q, s);

              // 5️⃣ Outlier filtering
              if (
                anchor.visible &&
                posRef.current.distanceTo(pos) > OUTLIER_MAX_JUMP
              )
                pos.copy(posRef.current);

              // 6️⃣ Smoothing
              posRef.current.lerp(pos, EMA_POS);
              quatRef.current.slerp(q, EMA_ROT);

              // 7️⃣ Scale from heel↔toe length
              const footLen = heelW.distanceTo(toeW);
              const targetScale = THREE.MathUtils.clamp(
                footLen * SHOE_SCALE_MULT,
                0.01,
                100
              );
              scaleRef.current = THREE.MathUtils.lerp(
                scaleRef.current,
                targetScale,
                EMA_SCALE
              );

              // 8️⃣ Apply to anchor
              anchor.position.copy(posRef.current);
              anchor.quaternion.copy(quatRef.current);
              anchor.scale.setScalar(scaleRef.current);
              anchor.visible = true;

              // 9️⃣ Optional debug markers (ankle, heel, toe)
              if (DEBUG_FEET) {
                const aPx = lmToCanvasPx(
                  ankle,
                  videoRef.current!,
                  overlayRef.current!
                );
                const hPx = lmToCanvasPx(
                  heel,
                  videoRef.current!,
                  overlayRef.current!
                );
                const tPx = lmToCanvasPx(
                  toe,
                  videoRef.current!,
                  overlayRef.current!
                );
                const ctx = overlayRef.current!.getContext("2d")!;
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(hPx.x, hPx.y);
                ctx.lineTo(tPx.x, tPx.y);
                ctx.stroke();

                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(hPx.x, hPx.y, 6, 0, Math.PI * 2);
                ctx.fill(); // heel
                ctx.fillStyle = "blue";
                ctx.beginPath();
                ctx.arc(tPx.x, tPx.y, 6, 0, Math.PI * 2);
                ctx.fill(); // toe
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(aPx.x, aPx.y, 6, 0, Math.PI * 2);
                ctx.fill(); // ankle
              }
            };
            // Left shoe ← left landmarks
            if (leftAnkle && leftHeel && leftToe) {
              solveFoot(
                leftAnkle,
                leftHeel,
                leftToe,

                Lpos,
                Lquat,
                Lscale,
                leftShoeAnchorRef.current!
              );
            } else {
              leftShoeAnchorRef.current.visible = false;
            }

            // Right shoe ← right landmarks
            if (rightAnkle && rightHeel && rightToe) {
              solveFoot(
                rightAnkle,
                rightHeel,
                rightToe,

                Rpos,
                Rquat,
                Rscale,
                rightShoeAnchorRef.current!
              );
            } else {
              rightShoeAnchorRef.current.visible = false;
            }
          }

          // ===== GLASSES =====
          if (glassAnchorRef.current && glassAdjustRef.current && faceLm) {
            const anchor = glassAnchorRef.current;

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
              glassAdjustRef.current!.scale.set(s, s, s);

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

                occluderRef.current.scale.set(
                  s * (headWidthPx / (ipdPx || 1)) * 1.1,
                  s * (headHeightPx / (ipdPx || 1)) * 1.05,
                  s * 0.75
                );
                occluderRef.current.position.set(0, 0, -0.04);
              }
            }
          }

          // ===== HAT =====
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
              const hatScale = isLargeScreen
                ? THREE.MathUtils.clamp(ipdPx * 0.00055, 0.035, 0.09)
                : THREE.MathUtils.clamp(ipdPx * 0.0009, 0.035, 0.09);
              hatAdjustRef.current.scale.setScalar(hatScale);
              hatAdjustRef.current.position.set(0, 0.025, HAT_FORWARD_OFFSET);

              if (hatOccluderRef.current) {
                const Lc = faceLm[FACE_LEFT_TEMPLE];
                const Rc = faceLm[FACE_RIGHT_TEMPLE];
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

                const sHat = hatAdjustRef.current.scale.x;
                hatOccluderRef.current.scale.set(
                  sHat * (headWidthPx / (ipdPx || 1)) * 2.4,
                  sHat * (headHeightPx / (ipdPx || 1)) * 0.8,
                  sHat * 0.9
                );
                hatOccluderRef.current.position.set(0, -0.02, -0.05);
              }
            }
          }

          // ===== FINAL VISIBILITY GATING =====
          faceGateRef.current = !!(faceRef.current && faceLm);
          handGateRef.current = SHOW_WATCH && handsLm.length > 0;

          if (glassAnchorRef.current)
            glassAnchorRef.current.visible = !!faceLm && showGlassesRef.current;
          if (occluderRef.current)
            occluderRef.current.visible = !!faceLm && showGlassesRef.current;

          if (hatAnchorRef.current)
            hatAnchorRef.current.visible = !!faceLm && showHatRef.current;
          if (hatOccluderRef.current)
            hatOccluderRef.current.visible = !!faceLm && showHatRef.current;

          if (watchAnchorRef.current)
            watchAnchorRef.current.visible = handGateRef.current && SHOW_WATCH;
          if (watchRectOccluderRef.current)
            watchRectOccluderRef.current.visible =
              handGateRef.current && SHOW_WATCH;

          // --- Optional face dots ---
          if (SHOW_FACE_DOTS && faceLm) {
            ctx.fillStyle = "rgba(0,255,0,0.7)";
            for (let i = 0; i < faceLm.length; i += 2) {
              const pt = faceLm[i];
              const p = lmToCanvasPx(pt, video, canvas);
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } catch {
          // ignore intermittent errors
        }
      };

      const hasRVFC =
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
      await startCamera(facingMode);
      // size canvases once
      const fitCanvasNow = () => {
        const el = containerRef.current;
        const cv = overlayRef.current;
        if (!el || !cv) return;
        const w = el.clientWidth || window.innerWidth;
        const h = el.clientHeight || window.innerHeight;
        cv.width = w;
        cv.height = h;
      };
      fitCanvasNow();

      await initThree();
      await Promise.all([loadGlasses(), loadHat(), loadWatch(), loadShoes()]); // watch may no-op

      setModelsReady(true);

      renderThreeLoop();

      await initModels(); // MediaPipe tasks
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
        if (threeRafRef.current) cancelAnimationFrame(threeRafRef.current!);
        stopStream();
        rendererRef.current?.dispose();
        sceneRef.current = null;
        cameraRef.current = null;
      };
    })();

    return () => cleanupRef.current?.();
  }, []); // run once

  // Keep refs synced with toggles
  useEffect(() => {
    showGlassesRef.current = showGlasses;
    if (glassAnchorRef.current)
      glassAnchorRef.current.visible = faceGateRef.current && showGlasses;
    if (occluderRef.current)
      occluderRef.current.visible = faceGateRef.current && showGlasses;
  }, [showGlasses]);

  useEffect(() => {
    showHatRef.current = showHat;
    if (hatAnchorRef.current)
      hatAnchorRef.current.visible = faceGateRef.current && showHat;
    if (hatOccluderRef.current)
      hatOccluderRef.current.visible = faceGateRef.current && showHat;
  }, [showHat]);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const showLoading = !modelsReady;

  const mirrorStyle =
    facingMode === "user" ? { transform: "scaleX(-1)" } : undefined;

  return (
    <div
      ref={containerRef}
      className="responsive-container"
      style={{
        position: "relative",
        width: "100%",
        background: "black",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .responsive-container {
          height: 100vh; /* default for desktops */
        }

        @media (max-width: 576px) {
          .responsive-container {
            height: 60vh; /* small screens */
          }
        }
      `}</style>

      {/* Back */}
      <button
        onClick={() => router.push("/shop-standard")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 20,
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

      {/* Toggles (top-right) */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 20,
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

      {/* Flip camera */}
      <button
        onClick={flipCamera}
        aria-label="Flip camera"
        className="d-lg-none"
        style={{
          position: "absolute",
          right: 14,
          bottom: 14,
          zIndex: 21,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        Flip Camera
      </button>

      {/* Mirrored wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          ...mirrorStyle,
          transformOrigin: "center",
        }}
      >
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

        {/* 2D overlay (for debug) */}
        <canvas
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
            // hide dots if you want: display: "none",
          }}
        />
      </div>

      {/* Loading overlay */}
      {showLoading && (
        <>
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(15,15,20,0.85), rgba(0,0,0,0.65))",
              backdropFilter: "blur(2px)",
              animation: "fadein 250ms ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.25)",
                  borderTopColor: "#fff",
                  animation: "spin 1s linear infinite",
                }}
              />
              <div
                style={{
                  color: "#fff",
                  fontSize: 16,
                  letterSpacing: 0.3,
                  fontWeight: 600,
                }}
              >
                Loading models…
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
