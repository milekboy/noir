"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Three.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Assets
const GLASSES_URL = "/assets/model/glasses.glb";
const HAT_URL = "/assets/model/hat_glb.glb";
const WATCH_URL = "/assets/model/wristwatch.glb"; // kept but disabled
const SHOE_URL = "/assets/model/shoes.glb";

// Debug toggles
const SHOW_FACE_DOTS = false;
const SHOW_FEET_DEBUG = true; // << draw ankle→heel→toe lines
const LOG_SHOE_KEEP = false; // << logs what nodes we keep per side

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

// ---------- Hat tuning ----------
const HAT_SCALE_FACTOR = 0.032;
const HAT_LIFT_FACTOR = 0.08;
const HAT_FORWARD_OFFSET = -0.23;

// ---------- Watch (disabled) ----------
const WATCH_ENABLED = false; // << turn off completely

// ---------- Shoes tuning (tracking depth/scale/smoothing) ----------
const SHOE_DEPTH = 1.15; // world Z depth to place shoe
const SHOE_SCALE_MULT = 10; // bump size a lot (was 6)
const SHOE_MODEL_CORRECTION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ")
);

// Smoothing + outlier reject
const EMA_POS = 0.35; // 0..1 (higher = snappier)
const EMA_ROT = 0.35;
const EMA_SCALE = 0.35;
const OUTLIER_MAX_JUMP = 0.26; // meters; ignore bigger jumps
const MIN_VISIBILITY = 0.6; // MP visibility threshold

// Name heuristic to split paired GLB: anything ending with 001 is "right"
const isRightName = (n: string) => /(?:001$|_R\b|Right\b)/i.test(n || "");

// ---------- Helpers ----------
function lpVec(target: THREE.Vector3, next: THREE.Vector3, alpha: number) {
  target.lerp(next, alpha);
}
function slerpQ(
  target: THREE.Quaternion,
  next: THREE.Quaternion,
  alpha: number
) {
  target.slerp(next, alpha);
}
function safeDist(a: THREE.Vector3, b: THREE.Vector3) {
  return a.distanceTo(b);
}

// ---------- Component ----------
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

  // Shoe smoothing state
  const Lpos = useRef(new THREE.Vector3());
  const Lquat = useRef(new THREE.Quaternion());
  const Lscale = useRef(1);
  const Rpos = useRef(new THREE.Vector3());
  const Rquat = useRef(new THREE.Quaternion());
  const Rscale = useRef(1);

  // Hat
  const hatAnchorRef = useRef<THREE.Group | null>(null);
  const hatAdjustRef = useRef<THREE.Group | null>(null);
  const hatLoadedRef = useRef(false);
  const hatOccluderRef = useRef<THREE.Mesh | null>(null);

  // Toggles
  const [showGlasses, setShowGlasses] = useState(true);
  const [showHat, setShowHat] = useState(true);
  const showGlassesRef = useRef(true);
  const showHatRef = useRef(true);

  // Tracking gates
  const faceGateRef = useRef(false);

  // Loading overlay
  const [modelsReady, setModelsReady] = useState(false);

  // Camera facing mode + stream ref
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

  // Flip button handler
  const flipCamera = async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await startCamera(next);
  };

  // ---------- Effect ----------
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
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const dir = new THREE.DirectionalLight(0xffffff, 1.1);
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
      glassesAnchor.visible = false;
      hatAnchor.visible = false;
      scene.add(glassesAnchor, hatAnchor);
      glassAnchorRef.current = glassesAnchor;
      hatAnchorRef.current = hatAnchor;

      // Glasses occluder (depth-only)
      const occGeo = new THREE.BoxGeometry(1, 0.5, 0.25);
      const occMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        depthWrite: true,
        depthTest: true,
      } as any);
      (occMat as any).colorWrite = false; // depth-only
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
      (hOccMat as any).colorWrite = false; // depth-only
      const hOcc = new THREE.Mesh(hOccGeo, hOccMat);
      hOcc.name = "HAT_OCCLUDER";
      hOcc.position.set(0, 0, -0.04);
      hOcc.scale.set(0.22, 0.6, 0.5);
      hOcc.visible = false;
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
            o.material.envMapIntensity = 1.2;
            o.material.needsUpdate = true;
          }
        }
      });
    };

    // ---------- Loaders ----------
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

            // Clone hierarchy and hide opposite side in each
            const leftOnly = src.clone(true);
            const rightOnly = src.clone(true);

            leftOnly.traverse((o: THREE.Object3D) => {
              if (isRightName(o.name)) o.visible = false;
            });
            rightOnly.traverse((o: THREE.Object3D) => {
              if (!isRightName(o.name)) o.visible = false;
            });

            // Optional: log kept nodes
            if (LOG_SHOE_KEEP) {
              console.log("[SHOES] left-only kept:");
              leftOnly.traverse(
                (o) => o.visible && console.log("  ", o.name || o.type)
              );
              console.log("[SHOES] right-only kept:");
              rightOnly.traverse(
                (o) => o.visible && console.log("  ", o.name || o.type)
              );
            }

            // Model axis fix + initial scale
            leftOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
            rightOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
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

    // Map MP 0..1 coord → canvas px (object-fit:cover correct)
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

    // ========== Main per-frame loop ==========
    const startLoop = () => {
      const video = videoRef.current!;
      const canvas = overlayRef.current!;
      if (!video || !poseRef.current || !canvas || !faceRef.current) return;

      runningRef.current = true;
      const ctx = canvas.getContext("2d")!;

      // scratch vecs
      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      const vC = new THREE.Vector3();

      // helper to compute shoe transform + smooth
      const solveFoot = (
        ankle: MPPoint,
        heel: MPPoint,
        toe: MPPoint,
        posRef: React.MutableRefObject<THREE.Vector3>,
        quatRef: React.MutableRefObject<THREE.Quaternion>,
        scaleRef: React.MutableRefObject<number>,
        anchor: THREE.Group
      ) => {
        // visibility gate
        const visOK =
          (ankle.visibility ?? 1) > MIN_VISIBILITY &&
          (heel.visibility ?? 1) > MIN_VISIBILITY &&
          (toe.visibility ?? 1) > MIN_VISIBILITY;
        if (!visOK) {
          anchor.visible = false;
          return;
        }

        // to world @ depth
        const toWorld = (lm: MPPoint) => {
          const nx = lm.x * 2 - 1;
          const ny = -(lm.y * 2 - 1);
          return ndcToWorldAtDistance(nx, ny, SHOE_DEPTH);
        };
        const ankleW = toWorld(ankle);
        const heelW = toWorld(heel);
        const toeW = toWorld(toe);

        // orientation basis: forward from heel→toe, right from forward×up
        const forward = vA.copy(toeW).sub(heelW).normalize();
        const up = vB.set(0, 1, 0);
        const right = vC.copy(forward).cross(up).normalize();
        const correctedUp = vB.copy(right).cross(forward).normalize();

        const m = new THREE.Matrix4().makeBasis(right, correctedUp, forward);
        m.setPosition(ankleW);

        const pos = new THREE.Vector3();
        const q = new THREE.Quaternion();
        const s = new THREE.Vector3();
        m.decompose(pos, q, s);

        // outlier reject on position
        if (anchor.visible) {
          if (safeDist(posRef.current, pos) > OUTLIER_MAX_JUMP) {
            // ignore this frame movement spike
            pos.copy(posRef.current);
          }
        }

        // smooth
        lpVec(posRef.current, pos, EMA_POS);
        slerpQ(quatRef.current, q, EMA_ROT);

        // scale from foot length
        const footLen = heelW.distanceTo(toeW);
        const desiredScale = THREE.MathUtils.clamp(
          footLen * SHOE_SCALE_MULT,
          0.01,
          100
        );
        scaleRef.current = THREE.MathUtils.lerp(
          scaleRef.current || desiredScale,
          desiredScale,
          EMA_SCALE
        );

        // apply
        anchor.position.copy(posRef.current);
        anchor.quaternion.copy(quatRef.current);
        anchor.scale.setScalar(scaleRef.current);
        anchor.visible = true;
      };

      const processFrame = async () => {
        if (!runningRef.current) return;
        const tsMs = performance.now();

        try {
          // Pose
          const poseRes = await poseRef.current.detectForVideo(video, tsMs);
          const poseLm: MPPoint[] | undefined = poseRes?.landmarks?.[0];

          // Face (for glasses/hat)
          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm: MPPoint[] | undefined = faceRes?.faceLandmarks?.[0];
          const faceMat: Float32Array | undefined =
            faceRes?.facialTransformationMatrixes?.[0]?.data;

          // Clear / debug draw
          const W = canvas.width,
            H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // ===== SHOES =====
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

            // Debug lines (canvas space)
            if (SHOW_FEET_DEBUG) {
              const drawFoot = (
                a?: MPPoint,
                h?: MPPoint,
                t?: MPPoint,
                color = "#00ff77"
              ) => {
                if (!a || !h || !t) return;
                const A = lmToCanvasPx(a, videoRef.current!, canvas);
                const Hh = lmToCanvasPx(h, videoRef.current!, canvas);
                const T = lmToCanvasPx(t, videoRef.current!, canvas);
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(Hh.x, Hh.y);
                ctx.lineTo(T.x, T.y); // heel->toe
                ctx.stroke();
                ctx.strokeStyle = "#ffffff";
                ctx.beginPath();
                ctx.moveTo(A.x, A.y);
                ctx.lineTo(Hh.x, Hh.y); // ankle->heel
                ctx.stroke();

                // little forward vector arrow
                const midX = (Hh.x + T.x) * 0.5;
                const midY = (Hh.y + T.y) * 0.5;
                const dirX = T.x - Hh.x;
                const dirY = T.y - Hh.y;
                const len = Math.hypot(dirX, dirY) || 1;
                const ux = dirX / len,
                  uy = dirY / len;
                ctx.beginPath();
                ctx.moveTo(midX, midY);
                ctx.lineTo(midX + ux * 24, midY + uy * 24);
                ctx.stroke();
              };
              drawFoot(leftAnkle, leftHeel, leftToe, "#73ff00");
              drawFoot(rightAnkle, rightHeel, rightToe, "#00e0ff");
            }
          } else {
            if (leftShoeAnchorRef.current)
              leftShoeAnchorRef.current.visible = false;
            if (rightShoeAnchorRef.current)
              rightShoeAnchorRef.current.visible = false;
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
              // light smoothing
              const fq = new THREE.Quaternion().copy(anchor.quaternion);
              fq.slerp(quat, 0.25);
              anchor.quaternion.copy(fq);
            }

            const L = faceLm[FACE_LEFT_EYE_OUTER];
            const R = faceLm[FACE_RIGHT_EYE_OUTER];
            if (L && R && cameraRef.current) {
              const mx = (L.x * W + R.x * W) * 0.5;
              const my = (L.y * H + R.y * H) * 0.5;
              const ndcX = (mx / W) * 2 - 1;
              const ndcY = -(my / H) * 2 + 1;
              const pos = ndcToWorldAtDistance(ndcX, ndcY, 0.9);
              anchor.position.lerp(pos, 0.3);
            }

            if (faceLm[FACE_LEFT_EYE_OUTER] && faceLm[FACE_RIGHT_EYE_OUTER]) {
              const lx = faceLm[FACE_LEFT_EYE_OUTER].x * W;
              const ly = faceLm[FACE_LEFT_EYE_OUTER].y * H;
              const rx = faceLm[FACE_RIGHT_EYE_OUTER].x * W;
              const ry = faceLm[FACE_RIGHT_EYE_OUTER].y * H;
              const ipdPx = Math.hypot(rx - lx, ry - ly);
              const s = THREE.MathUtils.clamp(ipdPx * 0.0017, 0.08, 0.35);
              glassAdjustRef.current!.scale.setScalar(
                THREE.MathUtils.lerp(glassAdjustRef.current!.scale.x, s, 0.3)
              );
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

              hatAnchorRef.current.position.lerp(basePos, 0.35);

              const ipdPx = Math.hypot(R.x * W - L.x * W, R.y * H - L.y * H);
              const hatScale = isLargeScreen
                ? THREE.MathUtils.clamp(ipdPx * 0.00055, 0.035, 0.09)
                : THREE.MathUtils.clamp(ipdPx * 0.0009, 0.035, 0.09);
              const sCurr = hatAdjustRef.current.scale.x;
              hatAdjustRef.current.scale.setScalar(
                THREE.MathUtils.lerp(sCurr, hatScale, 0.35)
              );
              hatAdjustRef.current.position.set(0, 0.025, HAT_FORWARD_OFFSET);
            }
          }

          // ===== FINAL VISIBILITY GATING =====
          faceGateRef.current = !!(faceRef.current && faceLm);

          if (glassAnchorRef.current)
            glassAnchorRef.current.visible = !!faceLm && showGlassesRef.current;
          if (occluderRef.current)
            occluderRef.current.visible = !!faceLm && showGlassesRef.current;

          if (hatAnchorRef.current)
            hatAnchorRef.current.visible = !!faceLm && showHatRef.current;
          if (hatOccluderRef.current)
            hatOccluderRef.current.visible = !!faceLm && showHatRef.current;

          if (!WATCH_ENABLED) {
            // nothing – watch is disabled
          }

          // Optional face debug
          if (SHOW_FACE_DOTS && faceLm) {
            ctx.fillStyle = "rgba(0,255,0,0.7)";
            for (let i = 0; i < faceLm.length; i += 2) {
              const pt = faceLm[i];
              ctx.beginPath();
              ctx.arc(pt.x * W, pt.y * H, 2, 0, Math.PI * 2);
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
      await Promise.all([loadGlasses(), loadHat(), loadShoes()]);

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
        if (rafId) cancelAnimationFrame(rafId);
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

  // Mirror video+webgl together when using front camera
  const mirrorStyle =
    facingMode === "user" ? { transform: "scaleX(-1)" } : undefined;

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

      {/* Toggles */}
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

      {/* Mirrored wrapper so video+3D stay aligned */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          ...mirrorStyle,
          transformOrigin: "center",
        }}
      >
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

        {/* 2D overlay (debug) */}
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
