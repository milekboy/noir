"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🔴 Three.js imports for glasses overlay
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 🔴 Change this to your actual path in /public
const GLASSES_URL = "/assets/model/glasses.glb";

// Debug toggles
const SHOW_FACE_DOTS = false; // ← turn off green face points

// Face indices we’ll use for anchoring (kept for future tuning)
const FACE_LEFT_EYE_OUTER = 33;
const FACE_RIGHT_EYE_OUTER = 263;

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

// Simple hand connections (21 landmarks)
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

  // Cross product → palm normal
  const normal = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };

  const camDir = { x: 0, y: 0, z: -1 };
  const dot = normal.x * camDir.x + normal.y * camDir.y + normal.z * camDir.z;

  // Positive dot means palm normal points toward camera (palm facing)
  return dot > 0;
}

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

export default function TryOn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const overlayRef = useRef<HTMLCanvasElement>(null);

  const poseRef = useRef<any | null>(null);
  const faceRef = useRef<any | null>(null);
  const handRef = useRef<any | null>(null);

  const logHandFramesRef = useRef(0);

  // Robust handedness label parser (unchanged)
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

  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  // ===== Three.js refs for the glasses overlay =====
  const webglRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRafRef = useRef<number | null>(null);

  const glassAnchorRef = useRef<THREE.Group | null>(null);
  const glassAdjustRef = useRef<THREE.Group | null>(null);
  const glassesLoadedRef = useRef(false); // ← prevent duplicates

  // Smoothing
  const filtPos = useRef(new THREE.Vector3());
  const filtQuat = useRef(new THREE.Quaternion());
  const filtScale = useRef(0.12);

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

    // size 2D + 3D canvases
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

      // Enable head-pose matrices
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

    // Three.js init
    const initThree = () => {
      if (!webglRef.current || rendererRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: webglRef.current,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false,
      });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
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

      // Anchor we’ll drive every frame
      const anchor = new THREE.Group();
      scene.add(anchor);
      glassAnchorRef.current = anchor;

      console.log("[GLASSES] Three init OK", { w, h });
    };

    const fitCameraToObject = (obj: THREE.Object3D) => {
      if (!cameraRef.current) return;
      const cam = cameraRef.current;

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      // center the model at origin
      obj.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fov = (cam.fov * Math.PI) / 180;
      const dist = maxDim / 2 / Math.tan(fov / 2);

      cam.position.set(0, 0, dist * 1.6);
      cam.near = Math.max(0.01, dist / 50);
      cam.far = dist * 50;
      cam.updateProjectionMatrix();
    };

    const loadGlasses = async () => {
      if (!sceneRef.current || !glassAnchorRef.current) return;
      if (glassesLoadedRef.current) {
        console.log("[GLASSES] already loaded, skipping");
        return;
      }

      console.log("[GLASSES] loading:", GLASSES_URL);

      return new Promise<void>((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          GLASSES_URL,
          (gltf) => {
            console.log("[GLASSES] GLB loaded OK");
            const model = gltf.scene;
            model.traverse((o: any) => {
              if (o.isMesh) {
                o.frustumCulled = false;
                o.castShadow = false;
                o.receiveShadow = false;
              }
            });

            // Adjust group (pivot/offset fixer)
            const adjust = new THREE.Group();
            adjust.name = "GLASSES_ADJUST";
            adjust.add(model);

            // initial guesses; will be overridden each frame
            adjust.scale.setScalar(0.12);
            adjust.position.set(0, 0.02, 0.02);
            adjust.rotation.set(0, 0, 0);

            glassAdjustRef.current = adjust;
            glassAnchorRef.current!.add(adjust);
            glassesLoadedRef.current = true;

            // Optional: initial camera fit
            fitCameraToObject(adjust);

            resolve();
          },
          (xhr) => {
            const pct = xhr.total
              ? Math.round((xhr.loaded / xhr.total) * 100)
              : -1;
            console.log(
              "[GLASSES] progress",
              pct >= 0 ? `${pct}%` : `${xhr.loaded} bytes`
            );
          },
          (err) => {
            console.error("[GLASSES] load ERROR", err);
            reject(err);
          }
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
      // DO NOT change tracking logic
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

          // Face (with head pose matrices)
          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm: MPPoint[] | undefined = faceRes?.faceLandmarks?.[0];
          const faceMat: Float32Array | undefined =
            faceRes?.facialTransformationMatrixes?.[0]?.data;

          // Hands
          const handRes = await handRef.current.detectForVideo(video, tsMs);
          const handsLm = handRes?.landmarks || [];

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

          // --- Draw Face landmarks: DISABLED
          if (SHOW_FACE_DOTS && faceLm) {
            ctx.fillStyle = "rgba(0,255,0,0.7)";
            for (let i = 0; i < faceLm.length; i += 2) {
              const pt = faceLm[i];
              ctx.beginPath();
              ctx.arc(pt.x * W, pt.y * H, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // --- Draw Hands (unchanged)
          if (handsLm && handsLm.length) {
            const handednessRaw =
              (handRes as any)?.handednesses ??
              (handRes as any)?.handedness ??
              [];

            if (logHandFramesRef.current < 6) {
              try {
                console.log("handRes", handRes);
              } catch {}
            }

            const midX = W / 2;

            for (let hi = 0; hi < handsLm.length; hi++) {
              const lm = handsLm[hi];
              const raw = handednessRaw[hi];
              let label = parseHandLabel(raw);

              // draw skeleton
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

              const labelLower = String(label).toLowerCase();
              const isLeft = labelLower.includes("left");

              let facing = isPalmFacingCamera(lm);
              const facingBeforeFlip = facing;
              if (isLeft) facing = !facing;

              if (logHandFramesRef.current < 6) {
                try {
                  console.log({
                    handIndex: hi,
                    rawHandedness: raw,
                    parsedLabel: label,
                    wristPxX: (lm[0]?.x ?? 0) * W,
                    midX,
                    isLeftBeforeMirrorAdjust: labelLower.includes("left"),
                    isLeftAfterMirrorAdjust: isLeft,
                    facingBeforeFlip,
                    facingAfterFlip: facing,
                  });
                } catch {}
                if (hi === 0) logHandFramesRef.current++;
              }

              ctx.fillStyle = facing ? "lime" : "red";
              ctx.font = "16px sans-serif";
              ctx.fillText(
                `${label} ${facing ? "Palm Facing Camera" : "Back of Hand"}`,
                lm[0].x * W + 10,
                lm[0].y * H - 10
              );

              ctx.fillStyle = "rgba(0,150,255,0.9)";
              for (const pt of lm) {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, 2.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // === 3D GLASSES ANCHORING ===
          if (glassAnchorRef.current && glassAdjustRef.current && faceLm) {
            const anchor = glassAnchorRef.current;

            // A) Orientation
            const faceMat = faceRes?.facialTransformationMatrixes?.[0]?.data;
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

            // B) Position from eye midpoint (screen → NDC → world at fixed depth)
            const L = faceLm[FACE_LEFT_EYE_OUTER];
            const R = faceLm[FACE_RIGHT_EYE_OUTER];
            if (L && R && cameraRef.current) {
              const mx = (L.x * W + R.x * W) * 0.5;
              const my = (L.y * H + R.y * H) * 0.5;
              const ndcX = (mx / W) * 2 - 1;
              const ndcY = -(my / H) * 2 + 1;

              const targetPos = ndcToWorldAtDistance(ndcX, ndcY, 0.9);
              targetPos.y -= filtScale.current * 0.02; // tiny nose-bridge drop

              const ALPHA_POS = 0.3;
              filtPos.current.lerp(targetPos, ALPHA_POS);
              anchor.position.copy(filtPos.current);
            }

            // C) Scale from IPD
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
            }

            // D) Mirror compensation (not needed now)
            // If you mirror the <video>, uncomment:
            // anchor.scale.set(-1, 1, 1);
          }
        } catch (e) {
          // swallow detection errors
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

      // 3D init + load glasses + 3D render loop
      initThree();
      await loadGlasses();
      renderThreeLoop();

      // tracking init (pose/face/hands)
      await initModels();
      startLoop();

      const onResize = () => fitCanvas();
      window.addEventListener("resize", onResize);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) runningRef.current = false;
        else if (!runningRef.current) {
          stopRaf = false;
          runningRef.current = true;
          const video = videoRef.current;
          if (video) requestAnimationFrame(() => startLoop());
        }
      });

      cleanupRef.current = () => {
        window.removeEventListener("resize", onResize);
        runningRef.current = false;
        stopRaf = true;
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

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isIOS ? "60vh" : "80vh",
        background: "black",
        overflow: "hidden",
      }}
    >
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

      {/* Three.js WebGL canvas for the glasses (between video and 2D overlay) */}
      <canvas
        ref={(el) => {
          // ✅ block body returns void
          webglRef.current = el;
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* 2D overlay for pose/face/hands (green face points disabled) */}
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
