"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

// // NEW: Palm orientation utility
// // ✅ unchanged: this checks one hand
// function isPalmFacingCamera(hand: Array<{ x: number; y: number; z: number }>): boolean {
//   if (!hand[0] || !hand[5] || !hand[17]) return false;

//   const wrist = hand[0];
//   const indexBase = hand[5];
//   const pinkyBase = hand[17];

//   const v1 = {
//     x: indexBase.x - wrist.x,
//     y: indexBase.y - wrist.y,
//     z: (indexBase.z ?? 0) - (wrist.z ?? 0),
//   };
//   const v2 = {
//     x: pinkyBase.x - wrist.x,
//     y: pinkyBase.y - wrist.y,
//     z: (pinkyBase.z ?? 0) - (wrist.z ?? 0),
//   };

//   // Cross product → palm normal
//   const normal = {
//     x: v1.y * v2.z - v1.z * v2.y,
//     y: v1.z * v2.x - v1.x * v2.z,
//     z: v1.x * v2.y - v1.y * v2.x,
//   };

//   const camDir = { x: 0, y: 0, z: -1 }; // MediaPipe camera faces -Z

//   const dot = normal.x * camDir.x + normal.y * camDir.y + normal.z * camDir.z;

//   return dot > 0; // ✅ palm facing if positive
// }

// // ✅ NEW: loop through all hands detected
// function checkHands(hands: Array<Array<{ x: number; y: number; z: number }>>) {
//   return hands.map((hand, i) => {
//     const isPalm = isPalmFacingCamera(hand);
//     return { handIndex: i, palmFacing: isPalm };
//   });
// }

type MPPoint = { x: number; y: number; z?: number; visibility?: number };

export default function TryOn() {
  // removed testing UI and forced states
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter(); // ✅ initialize router

  const overlayRef = useRef<HTMLCanvasElement>(null);

  const poseRef = useRef<any | null>(null);
  const faceRef = useRef<any | null>(null);
  const handRef = useRef<any | null>(null);

  const logHandFramesRef = useRef(0);

  // Robust handedness label parser: handles nested arrays and common object shapes
  const parseHandLabel = (raw: any) => {
    try {
      let v = raw;
      // unwrap nested arrays
      while (Array.isArray(v) && v.length > 0) v = v[0];

      if (!v) return "Hand";

      if (typeof v === "string") return v;

      if (typeof v === "object") {
        // common fields used by various versions
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
    } catch (e) {
      // ignore
    }
    return "Hand";
  };

  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

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
      if (!el || !cv) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      cv.width = w;
      cv.height = h;
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

          // Face
          const faceRes = await faceRef.current.detectForVideo(video, tsMs);
          const faceLm = faceRes?.faceLandmarks?.[0];

          // Hands
          const handRes = await handRef.current.detectForVideo(video, tsMs);
          const handsLm = handRes?.landmarks || [];

          const W = canvas.width,
            H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // --- Draw Pose
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

          // --- Draw Face
          if (faceLm) {
            ctx.fillStyle = "rgba(0,255,0,0.7)";
            for (let i = 0; i < faceLm.length; i += 2) {
              // skip half points for perf
              const pt = faceLm[i];
              ctx.beginPath();
              ctx.arc(pt.x * W, pt.y * H, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // --- Draw Hands with mirror-aware correction
          if (handsLm && handsLm.length) {
            const handednessRaw =
              (handRes as any)?.handednesses ??
              (handRes as any)?.handedness ??
              [];

            // Optional logging for first few frames to inspect raw output
            if (logHandFramesRef.current < 6) {
              try {
                // eslint-disable-next-line no-console
                console.log("handRes", handRes);
              } catch {}
            }

            const midX = W / 2;

            for (let hi = 0; hi < handsLm.length; hi++) {
              const lm = handsLm[hi];
              const raw = handednessRaw[hi];
              // handedness can be returned as nested arrays or objects
              let label = "Hand";
              let rawVal: any = raw;
              if (Array.isArray(rawVal) && rawVal.length > 0)
                rawVal = rawVal[0];
              if (typeof rawVal === "string") label = rawVal;
              else if (rawVal && typeof rawVal === "object") {
                label =
                  rawVal.label ??
                  rawVal.categoryName ??
                  rawVal.category ??
                  rawVal.name ??
                  label;
              }

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

              // determine adjusted handedness from parsed label
              const labelLower = String(label).toLowerCase();
              const isLeft = labelLower.includes("left");

              // Palm orientation check: flip for left hands
              let facing = isPalmFacingCamera(lm);
              const facingBeforeFlip = facing;
              if (isLeft) facing = !facing;

              // Detailed debug log for first few frames so we can see why left is inverted
              if (logHandFramesRef.current < 6) {
                try {
                  // eslint-disable-next-line no-console
                  console.log({
                    handIndex: hi,
                    rawHandedness: raw,
                    parsedLabel: label,
                    wristPxX: (lm[0]?.x ?? 0) * W,
                    midX,
                    mirrorDetected: null,
                    isLeftBeforeMirrorAdjust: labelLower.includes("left"),
                    isLeftAfterMirrorAdjust: isLeft,
                    facingBeforeFlip,
                    facingAfterFlip: facing,
                  });
                } catch {}
                // increment global log frame count once per frame (only when first hand logs)
                if (hi === 0) logHandFramesRef.current++;
              }

              ctx.fillStyle = facing ? "lime" : "red";
              ctx.font = "16px sans-serif";
              ctx.fillText(
                `${label} ${facing ? "Palm Facing Camera" : "Back of Hand"}`,
                lm[0].x * W + 10,
                lm[0].y * H - 10
              );

              // draw dots
              ctx.fillStyle = "rgba(0,150,255,0.9)";
              for (const pt of lm) {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, 2.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
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
        if (stream) stream.getTracks().forEach((t) => t.stop());
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
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* control panel removed */}
    </div>
  );
}
