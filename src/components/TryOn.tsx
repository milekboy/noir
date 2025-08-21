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

    // Detect iOS once (iPhone/iPad)
    const isIOS =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const startCamera = async () => {
      try {
        if (
          location.protocol !== "https:" &&
          location.hostname !== "localhost"
        ) {
          console.warn("[CAM] HTTPS recommended for getUserMedia");
        }
        // Lower the requested size a bit on iOS to keep things snappy
        const idealW = isIOS ? 960 : 1280;
        const idealH = isIOS ? 540 : 720;

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: idealW },
            height: { ideal: idealH },
            // resizeMode: "crop-and-scale" as any, // optional; some Safari versions accept it
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Critical on iOS: set real attributes too
          videoRef.current.setAttribute("playsinline", "");
          videoRef.current.setAttribute("autoplay", "");
          videoRef.current.muted = true;
          // @ts-ignore (some Safari builds honor this)
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

      // Always use a monotonic timestamp on iOS; in fact it’s safe everywhere
      const processFrame = async () => {
        if (!runningRef.current || !poseRef.current) return;
        const tsMs = performance.now(); // <= monotonic, avoids iOS rVFC mediaTime issues
        try {
          const res = await poseRef.current.detectForVideo(video, tsMs);
          const lm = res?.landmarks?.[0];
          if (lm) draw(lm);
        } catch (e) {
          // swallow intermittent detect errors
        }
      };

      // Force RAF loop on iOS (skip rVFC). rVFC can report stale mediaTime on iOS.
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

      // Pause/resume when tab is backgrounded (saves battery on iOS)
      const onVisibility = () => {
        if (document.hidden) runningRef.current = false;
        else if (!runningRef.current) {
          // resume
          stopRaf = false;
          runningRef.current = true;
          // restart loop quickly
          const video = videoRef.current;
          if (video) requestAnimationFrame(() => startLoop());
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      // full cleanup on unmount
      cleanupRef.current = () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
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

  // Slightly smaller canvas on iOS helps FPS
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isIOS ? "60vh" : "80vh", // smaller on iOS
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
