"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Assets
const GLASSES_URL = "/assets/model/glasses.glb";
const HAT_URL = "/assets/model/hat_glb.glb";
const WATCH_URL = "/assets/model/wristwatch.glb";
const SHOE_URL = "/assets/model/shoes.glb";

// ------------ Debug toggles -------------
const SHOW_FACE_DOTS = false;
const DEBUG_FEET = true;
const SHOW_WATCH = false;

const isLargeScreen =
  typeof window !== "undefined" && window.innerWidth >= 1024;

// Face indices
const FACE_LEFT_EYE_OUTER = 33;
const FACE_RIGHT_EYE_OUTER = 263;
const FACE_FOREHEAD = 10;
const FACE_CHIN = 152;
const FACE_LEFT_TEMPLE = 234;
const FACE_RIGHT_TEMPLE = 454;

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

// ---- Shoe tuning knobs ----
const SHOE_DEPTH = 1.1;
const SHOE_SCALE_MULT = 12;
const SHOE_MODEL_CORRECTION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ")
);

// --- Orientation/placement knobs (tweak these) ---
const SHOE_OFFSET_FWD = 0.03; // push toward toes
const SHOE_OFFSET_UP = -0.02; // sink to “ground”
const SHOE_SCALE_MIN = 0.08;
const SHOE_SCALE_MAX = 0.55;
const SHOE_YAW_ONLY = true; // ← stability

// OPTIONAL tiny per-foot yaw trims if model faces a little left/right
const YAW_FIX_LEFT = THREE.MathUtils.degToRad(0); // try 5..10 if needed
const YAW_FIX_RIGHT = THREE.MathUtils.degToRad(0);

// Smoothing / stability
const EMA_POS = 0.3;
const EMA_ROT = 0.3;
const EMA_SCALE = 0.25;
const OUTLIER_MAX_JUMP = 0.25;

// Gates (relaxed)
const MIN_VISIBILITY = 0.2; // was 0.40
const MIN_FOOT_PX = 16; // ankle→toe on-screen length

// ---------- Hat tuning ----------
const HAT_SCALE_FACTOR = 0.032;
const HAT_LIFT_FACTOR = 0.08;
const HAT_FORWARD_OFFSET = -0.23;

// ---------- Watch (kept but hidden) ----------
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

  // Tracking gates
  const faceGateRef = useRef(false);
  const handGateRef = useRef(false);

  const [modelsReady, setModelsReady] = useState(false);

  // Camera
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  // ---- Camera helpers ----
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

      // Env
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

      // Glasses occluder
      const occGeo = new THREE.BoxGeometry(1, 0.5, 0.25);
      const occMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (occMat as any).colorWrite = false;
      const gOcc = new THREE.Mesh(occGeo, occMat);
      gOcc.position.set(0, 0, -0.04);
      gOcc.scale.set(0.3, 0, 0.5);
      gOcc.visible = false;
      glassesAnchor.add(gOcc);
      occluderRef.current = gOcc;

      // Hat occluder
      const hOccGeo = new THREE.BoxGeometry(1, 1.3, 0.25);
      const hOccMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (hOccMat as any).colorWrite = false;
      const hOcc = new THREE.Mesh(hOccGeo, hOccMat);
      hOcc.position.set(0, 0, -0.04);
      hOcc.scale.set(0.22, 0.6, 0.5);
      hOcc.visible = false;
      hatAnchor.add(hOcc);
      hatOccluderRef.current = hOcc;

      // Wrist occluder (kept)
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
      rOcc.visible = false;
      scene.add(rOcc);
      watchRectOccluderRef.current = rOcc;
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

            // Right parts often end with "001" / "_R" / "Right"
            const isRightName = (n: string) => /(?:001$|_R\b|Right\b)/i.test(n);

            const leftOnly = src.clone(true);
            const rightOnly = src.clone(true);

            leftOnly.traverse((o: THREE.Object3D) => {
              if (!o.name) return;
              if (isRightName(o.name)) o.visible = false;
            });

            rightOnly.traverse((o: THREE.Object3D) => {
              if (!o.name) return;
              if (!isRightName(o.name)) o.visible = false;
            });

            // Static axis correction + optional tiny yaw trims
            const yawL = new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(0, 1, 0),
              YAW_FIX_LEFT
            );
            const yawR = new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(0, 1, 0),
              YAW_FIX_RIGHT
            );

            leftOnly.quaternion.copy(SHOE_MODEL_CORRECTION).premultiply(yawL);
            rightOnly.quaternion.copy(SHOE_MODEL_CORRECTION).premultiply(yawR);

            leftOnly.scale.setScalar(0.1);
            rightOnly.scale.setScalar(0.1);

            leftShoeAnchorRef.current!.add(leftOnly);
            rightShoeAnchorRef.current!.add(rightOnly);

            shoesLoadedRef.current = true;
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
            adjust.add(model);
            adjust.scale.setScalar(0.07);
            adjust.position.set(0, 0.02, 0.02);
            glassAdjustRef.current = adjust;
            glassAnchorRef.current!.add(adjust);
            glassesLoadedRef.current = true;
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
            adjust.add(model);
            adjust.scale.setScalar(HAT_SCALE_FACTOR);
            adjust.position.set(0, 0.015, 0.0);
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
      if (!SHOW_WATCH) return;
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

    // Map MP landmark (0..1) → canvas px (object-fit: cover)
    function lmToCanvasPx(
      lm: MPPoint,
      videoEl: HTMLVideoElement,
      canvasEl: HTMLCanvasElement
    ) {
      const vidW = videoEl.videoWidth || 0;
      const vidH = videoEl.videoHeight || 0;
      const canW = canvasEl.width;
      const canH = canvasEl.height;
      if (!vidW || !vidH) return { x: lm.x * canW, y: lm.y * canH };
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
          const poseRes = await poseRef.current.detectForVideo(video, tsMs);
          const poseLm = poseRes?.landmarks?.[0];

          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm: MPPoint[] | undefined = faceRes?.faceLandmarks?.[0];
          const faceMat: Float32Array | undefined =
            faceRes?.facialTransformationMatrixes?.[0]?.data;

          const handRes = await handRef.current.detectForVideo(video, tsMs);
          const handsLm: Array<Array<MPPoint>> = handRes?.landmarks || [];

          const W = canvas.width,
            H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // ===== SHOES =====
          if (
            poseLm &&
            leftShoeAnchorRef.current &&
            rightShoeAnchorRef.current
          ) {
            const LA = poseLm[27],
              RA = poseLm[28];
            const LH = poseLm[29],
              RH = poseLm[30];
            const LT = poseLm[31],
              RT = poseLm[32];

            const toWorldFromLm = (lm: MPPoint) => {
              const p = lmToCanvasPx(lm, video, canvas);
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

              // relaxed gate: either visibility OK or on-screen length is reasonable
              const aPx = lmToCanvasPx(ankle, video, canvas);
              const tPx = lmToCanvasPx(toe, video, canvas);
              const footPx = Math.hypot(aPx.x - tPx.x, aPx.y - tPx.y);
              const visOK =
                (ankle.visibility ?? 1) > MIN_VISIBILITY &&
                (heel.visibility ?? 1) > MIN_VISIBILITY &&
                (toe.visibility ?? 1) > MIN_VISIBILITY;
              if (!visOK && footPx < MIN_FOOT_PX) {
                anchor.visible = false;
                return;
              }

              const A = toWorldFromLm(ankle);
              const Hh = toWorldFromLm(heel);
              const T = toWorldFromLm(toe);

              // orientation
              let forward = new THREE.Vector3().subVectors(T, Hh).normalize(); // heel→toe
              if (SHOE_YAW_ONLY) {
                forward.y = 0;
                if (forward.lengthSq() < 1e-6) forward.set(0, 0, 1);
                forward.normalize();
              }
              const worldUp = new THREE.Vector3(0, 1, 0);
              const right = new THREE.Vector3()
                .crossVectors(worldUp, forward)
                .normalize();
              const up = new THREE.Vector3()
                .crossVectors(forward, right)
                .normalize();

              // position at mid-foot with offsets
              const mid = new THREE.Vector3()
                .addVectors(Hh, T)
                .multiplyScalar(0.5);
              const desired = mid
                .clone()
                .add(forward.clone().multiplyScalar(SHOE_OFFSET_FWD))
                .add(up.clone().multiplyScalar(SHOE_OFFSET_UP));

              const m = new THREE.Matrix4()
                .makeBasis(right, up, forward)
                .setPosition(desired);
              const nextPos = new THREE.Vector3();
              const nextQuat = new THREE.Quaternion();
              const tmpS = new THREE.Vector3();
              m.decompose(nextPos, nextQuat, tmpS);

              if (
                anchor.visible &&
                posRef.current.distanceTo(nextPos) > OUTLIER_MAX_JUMP
              ) {
                nextPos.copy(posRef.current);
              }
              posRef.current.lerp(nextPos, EMA_POS);
              quatRef.current.slerp(nextQuat, EMA_ROT);

              const footLen = Hh.distanceTo(T);
              const targetScale = THREE.MathUtils.clamp(
                footLen * SHOE_SCALE_MULT,
                SHOE_SCALE_MIN,
                SHOE_SCALE_MAX
              );
              scaleRef.current = THREE.MathUtils.lerp(
                scaleRef.current || targetScale,
                targetScale,
                EMA_SCALE
              );

              anchor.position.copy(posRef.current);
              anchor.quaternion.copy(quatRef.current);
              anchor.scale.setScalar(scaleRef.current);
              anchor.visible = true;

              if (DEBUG_FEET) {
                const hPx = lmToCanvasPx(heel, video, canvas);
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(aPx.x, aPx.y);
                ctx.lineTo(tPx.x, tPx.y);
                ctx.stroke();
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(hPx.x, hPx.y, 6, 0, Math.PI * 2);
                ctx.fill();
              }
            };

            if (LA && LH && LT) {
              solveFoot(
                LA,
                LH,
                LT,
                Lpos,
                Lquat,
                Lscale,
                leftShoeAnchorRef.current!
              );
            } else {
              leftShoeAnchorRef.current.visible = false;
            }

            if (RA && RH && RT) {
              solveFoot(
                RA,
                RH,
                RT,
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
            }
          }

          // ===== VISIBILITY GATING =====
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

      // size overlay once
      const el = containerRef.current;
      const cv = overlayRef.current;
      if (el && cv) {
        const w = el.clientWidth || window.innerWidth;
        const h = el.clientHeight || window.innerHeight;
        cv.width = w;
        cv.height = h;
      }

      await initThree();
      await Promise.all([loadGlasses(), loadHat(), loadWatch(), loadShoes()]);

      setModelsReady(true);
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
          height: 100vh;
        }
        @media (max-width: 576px) {
          .responsive-container {
            height: 60vh;
          }
        }
      `}</style>

      {/* Back */}
      <button
        onClick={() => router.push("/shop-standard")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 20,
          padding: "8px 14px",
          borderRadius: 6,
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
          top: 10,
          right: 10,
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
