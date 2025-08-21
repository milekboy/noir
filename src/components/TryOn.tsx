"use client";
import { useEffect, useRef } from "react";

// Draw these connections between named joints
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

// Map some of MediaPipe’s 33 indices to human‑readable names
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

export default function TryOn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const poseRef = useRef<any | null>(null);
  const runningRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    let stopRaf = false;

    const startCamera = async () => {
      try {
        if (
          location.protocol !== "https:" &&
          location.hostname !== "localhost"
        ) {
          console.warn("[CAM] HTTPS recommended for getUserMedia");
        }
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

    const fitCanvas = () => {
      const el = containerRef.current;
      const cv = overlayRef.current;
      if (!el || !cv) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      cv.width = w;
      cv.height = h;
    };

    const initPose = async () => {
      // Dynamic import to avoid SSR issues in Next.js
      const vision = await import("@mediapipe/tasks-vision");
      const FilesetResolver = vision.FilesetResolver;
      const PoseLandmarker = vision.PoseLandmarker;

      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Use the lite model for realtime speed; swap to full later if needed
      poseRef.current = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      console.log("[LOCAL] MediaPipe Pose ready");
    };

    const startLoop = () => {
      const video = videoRef.current;
      const canvas = overlayRef.current;
      if (!video || !poseRef.current || !canvas) return;

      runningRef.current = true;
      const ctx = canvas.getContext("2d")!;

      const draw = (landmarks: MPPoint[]) => {
        const W = canvas.width,
          H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Build a dictionary name -> point (from normalized coords)
        const dict: Record<string, MPPoint> = {};
        for (const [idxStr, name] of Object.entries(MP_INDEX_TO_NAME)) {
          const idx = Number(idxStr);
          const L = landmarks[idx];
          if (L) dict[name] = L;
        }

        const toPx = (p: MPPoint) => ({ x: p.x * W, y: p.y * H });

        // Lines
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

        // Dots
        ctx.fillStyle = "rgba(0, 200, 255, 0.9)";
        for (const name in dict) {
          const P = toPx(dict[name]);
          ctx.beginPath();
          ctx.arc(P.x, P.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const processFrame = async (tsMs: number) => {
        if (!runningRef.current || !poseRef.current) return;
        const res = await poseRef.current.detectForVideo(video, tsMs);
        const lm = res?.landmarks?.[0];
        if (lm) draw(lm);
      };

      // Prefer requestVideoFrameCallback for best pacing
      // @ts-ignore
      const hasRVFC = typeof video.requestVideoFrameCallback === "function";

      if (hasRVFC) {
        // @ts-ignore
        const loopRVFC = (
          _now: number,
          metadata: VideoFrameCallbackMetadata
        ) => {
          if (!runningRef.current) return;
          processFrame(metadata.mediaTime * 1000).finally(() => {
            // @ts-ignore
            video.requestVideoFrameCallback(loopRVFC);
          });
        };
        // @ts-ignore
        video.requestVideoFrameCallback(loopRVFC);
      } else {
        const loopRAF = () => {
          if (!runningRef.current || stopRaf) return;
          const ts = performance.now();
          processFrame(ts).finally(() => {
            rafId = requestAnimationFrame(loopRAF);
          });
        };
        rafId = requestAnimationFrame(loopRAF);
      }

      // per-loop cleanup
      cleanupRef.current = () => {
        runningRef.current = false;
        stopRaf = true;
        if (rafId) cancelAnimationFrame(rafId);
      };
    };

    (async () => {
      await startCamera();
      fitCanvas();
      await initPose();
      startLoop();

      const onResize = () => fitCanvas();
      window.addEventListener("resize", onResize);

      // full cleanup on unmount
      cleanupRef.current = () => {
        window.removeEventListener("resize", onResize);
        runningRef.current = false;
        stopRaf = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (stream) stream.getTracks().forEach((t) => t.stop());
      };
    })();

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "80vh",
        background: "black",
        overflow: "hidden",
      }}
    >
      {/* Live camera */}
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
      {/* Skeleton overlay */}
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
    </div>
  );
}
