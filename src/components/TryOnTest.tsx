"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Assets
const GLASSES_URL = "/assets/model/glasses.glb";
const HAT_URL = "/assets/model/hat_glb.glb";
const SHOE_URL = "/assets/model/shoes.glb";

// Debug
const SHOW_FACE_DOTS = false;
const SHOW_FEET_DEBUG = true; // 👈 toggle heel→toe line

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
const SHOE_DEPTH = 1.2; // world distance to place shoes
const SHOE_SCALE_MULT = 10; // ⬆ bigger shoes
const SHOE_MODEL_CORRECTION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ")
);
// Smoothing
const SHOE_POS_ALPHA = 0.35; // 0..1 (higher = snappier)
const SHOE_ROT_ALPHA = 0.35;

// ---------- Hat tuning knobs ----------
const HAT_SCALE_FACTOR = 0.032;
const HAT_LIFT_FACTOR = 0.08;
const HAT_FORWARD_OFFSET = -0.23;

export default function TryTest() {
  const router = useRouter();

  // DOM
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  // MediaPipe
  const poseRef = useRef<any | null>(null);
  const faceRef = useRef<any | null>(null);

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

  // Shoes
  const leftShoeAnchorRef = useRef<THREE.Group | null>(null);
  const rightShoeAnchorRef = useRef<THREE.Group | null>(null);
  const shoesLoadedRef = useRef(false);

  // Shoe smoothing
  const leftShoePos = useRef(new THREE.Vector3());
  const rightShoePos = useRef(new THREE.Vector3());
  const leftShoeQuat = useRef(new THREE.Quaternion());
  const rightShoeQuat = useRef(new THREE.Quaternion());

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

  // Loading overlay
  const [modelsReady, setModelsReady] = useState(false);

  // Camera facing mode
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);
  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  // CAMERA HELPERS
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
      const { FilesetResolver, PoseLandmarker, FaceLandmarker } = vision;

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

      console.log("[LOCAL] Pose + Face models ready");
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

            // Split pair → left-only & right-only clones based on names
            const isRightName = (n: string) => /(?:001$|_R\b|Right\b)/i.test(n); // adjust if your naming differs

            const leftOnly = src.clone(true);
            const rightOnly = src.clone(true);

            leftOnly.traverse((o: THREE.Object3D) => {
              if (o.name && isRightName(o.name)) o.visible = false;
            });
            rightOnly.traverse((o: THREE.Object3D) => {
              if (o.name && !isRightName(o.name)) o.visible = false;
            });

            leftOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
            rightOnly.quaternion.copy(SHOE_MODEL_CORRECTION);
            // base size; final size still scales by foot length * SHOE_SCALE_MULT
            leftOnly.scale.setScalar(0.2);
            rightOnly.scale.setScalar(0.2);

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

    const startLoop = () => {
      const video = videoRef.current!;
      const canvas = overlayRef.current!;
      if (!video || !poseRef.current || !canvas || !faceRef.current) return;

      runningRef.current = true;
      const ctx = canvas.getContext("2d")!;

      const processFrame = async () => {
        if (!runningRef.current) return;
        const tsMs = performance.now();

        try {
          // Pose
          const poseRes = await poseRef.current.detectForVideo(video, tsMs);
          const poseLm: MPPoint[] | undefined = poseRes?.landmarks?.[0];

          // Face
          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm: MPPoint[] | undefined = faceRes?.faceLandmarks?.[0];
          const faceMat: Float32Array | undefined =
            faceRes?.facialTransformationMatrixes?.[0]?.data;

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

            const updateShoe = (
              anchor: THREE.Group,
              ankle: MPPoint,
              heel: MPPoint,
              toe: MPPoint,
              isLeft: boolean
            ) => {
              const toWorld = (lm: MPPoint) =>
                ndcToWorldAtDistance(lm.x * 2 - 1, -(lm.y * 2 - 1), SHOE_DEPTH);

              const ankleW = toWorld(ankle);
              const heelW = toWorld(heel);
              const toeW = toWorld(toe);

              // sanity check to suppress wild jumps
              const footLength = heelW.distanceTo(toeW);
              if (
                !isFinite(footLength) ||
                footLength < 0.01 ||
                footLength > 0.6
              )
                return;

              const forward = new THREE.Vector3()
                .subVectors(toeW, heelW)
                .normalize();
              const up = new THREE.Vector3(0, 1, 0);
              const right = new THREE.Vector3()
                .crossVectors(forward, up)
                .normalize();
              const correctedUp = new THREE.Vector3()
                .crossVectors(right, forward)
                .normalize();

              const mat = new THREE.Matrix4().makeBasis(
                right,
                correctedUp,
                forward
              );
              mat.setPosition(ankleW);

              const pos = new THREE.Vector3();
              const quat = new THREE.Quaternion();
              const scl = new THREE.Vector3();
              mat.decompose(pos, quat, scl);

              // smoothing
              const posRef = isLeft ? leftShoePos : rightShoePos;
              const quatRef = isLeft ? leftShoeQuat : rightShoeQuat;
              if (posRef.current.lengthSq() === 0) posRef.current.copy(pos); // warm start
              if (
                quatRef.current.w === 1 &&
                quatRef.current.x === 0 &&
                quatRef.current.y === 0 &&
                quatRef.current.z === 0
              )
                quatRef.current.copy(quat);

              posRef.current.lerp(pos, SHOE_POS_ALPHA);
              quatRef.current.slerp(quat, SHOE_ROT_ALPHA);

              anchor.position.copy(posRef.current);
              anchor.quaternion.copy(quatRef.current);
              anchor.visible = true;

              anchor.scale.setScalar(footLength * SHOE_SCALE_MULT);

              // debug line heel->toe
              if (SHOW_FEET_DEBUG && sceneRef.current) {
                const material = new THREE.LineBasicMaterial({
                  color: 0x00ff00,
                });
                const geometry = new THREE.BufferGeometry().setFromPoints([
                  heelW,
                  toeW,
                ]);
                const line = new THREE.Line(geometry, material);
                sceneRef.current.add(line);
                // remove quickly to avoid buildup
                setTimeout(() => sceneRef.current?.remove(line), 60);
              }
            };

            if (leftAnkle && leftHeel && leftToe) {
              updateShoe(
                leftShoeAnchorRef.current!,
                leftAnkle,
                leftHeel,
                leftToe,
                true
              );
            }
            if (rightAnkle && rightHeel && rightToe) {
              updateShoe(
                rightShoeAnchorRef.current!,
                rightAnkle,
                rightHeel,
                rightToe,
                false
              );
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

          if (glassAnchorRef.current)
            glassAnchorRef.current.visible = !!faceLm && showGlassesRef.current;
          if (occluderRef.current)
            occluderRef.current.visible = !!faceLm && showGlassesRef.current;

          if (hatAnchorRef.current)
            hatAnchorRef.current.visible = !!faceLm && showHatRef.current;
          if (hatOccluderRef.current)
            hatOccluderRef.current.visible = !!faceLm && showHatRef.current;

          // Optional visuals
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
