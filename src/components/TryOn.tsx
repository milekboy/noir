"use client";
import { useEffect, useRef } from "react";

const WS_URL = "wss://noirtryon-api.onrender.com/ws/pose";
const HEALTH_URL = "https://noirtryon-api.onrender.com/health";

// Skeleton connections (expand as needed)
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

type Point = {
  x?: number;
  y?: number;
  z?: number;
  x_px?: number;
  y_px?: number;
};
type Landmarks = Record<string, Point>;

export default function TryOn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  const videoReadyRef = useRef(false);
  const wsReadyRef = useRef(false);
  const inflightRef = useRef(false);

  // Adaptive pacing
  const rttMsRef = useRef(80);
  const targetFpsRef = useRef(15);

  // Initialize last-send timestamp safely in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__lastSendTs = performance.now();
    }
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;

    // Health ping (helps debug connectivity)
    (async () => {
      try {
        const r = await fetch(HEALTH_URL);
        console.log("[HEALTH]", r.status, await r.text());
      } catch (e) {
        console.error("[HEALTH] failed:", e);
      }
    })();

    // WebSocket
    const ws = new WebSocket(WS_URL);
    ws.binaryType = "arraybuffer"; // we send binary
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.log("[WS] open");
      wsReadyRef.current = true;
      if (videoReadyRef.current && typeof window !== "undefined") {
        (window as any).__lastSendTs = performance.now();
        sendNextFrame();
      }
    });

    ws.addEventListener("message", (e) => {
      // RTT estimate
      const t1 =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const last =
        (typeof window !== "undefined" && (window as any).__lastSendTs) || t1;
      const measured = Math.max(1, t1 - last);
      rttMsRef.current = rttMsRef.current * 0.8 + measured * 0.2;

      // Adapt target FPS between 8 and 20 based on RTT (+ small budget)
      const budget = 25;
      const nextFps = Math.min(
        20,
        Math.max(8, 1000 / (rttMsRef.current + budget))
      );
      targetFpsRef.current = nextFps;

      // Draw overlay
      try {
        const payload =
          typeof e.data === "string"
            ? JSON.parse(e.data)
            : JSON.parse(new TextDecoder().decode(e.data));
        drawOverlay(payload);
      } catch {
        // ignore non-JSON (if any)
      }

      // Schedule next send
      inflightRef.current = false;
      const pauseMs = Math.max(1, 1000 / targetFpsRef.current);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          (window as any).__lastSendTs = performance.now();
        }
        sendNextFrame();
      }, pauseMs);
    });

    ws.addEventListener("error", (e) => console.error("[WS] error:", e));
    ws.addEventListener("close", (e) => {
      console.warn("[WS] close:", e.code, e.reason);
      wsReadyRef.current = false;
    });

    // Camera
    const startCamera = async () => {
      try {
        if (
          location.protocol !== "https:" &&
          location.hostname !== "localhost"
        ) {
          console.warn(
            "[CAM] needs HTTPS or localhost. Current:",
            location.protocol
          );
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
          const markReady = () => {
            if (!videoRef.current) return;
            const vw = videoRef.current.videoWidth;
            const vh = videoRef.current.videoHeight;
            if (vw && vh) {
              console.log("[CAM] video metadata:", vw, vh);
              fitCanvases();
              videoReadyRef.current = true;
              if (wsReadyRef.current && typeof window !== "undefined") {
                (window as any).__lastSendTs = performance.now();
                sendNextFrame();
              }
            }
          };
          videoRef.current.addEventListener("loadedmetadata", markReady, {
            once: true,
          });
          videoRef.current.addEventListener("canplay", markReady, {
            once: true,
          });
          setTimeout(markReady, 300);
          setTimeout(markReady, 1000);
        }
        console.log("[CAM] started");
      } catch (err) {
        console.error("[CAM] access error:", err);
      }
    };

    // Size + encoder setup
    const fitCanvases = () => {
      const el = containerRef.current;
      const overlay = overlayRef.current;
      if (!el || !overlay) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      overlay.width = w;
      overlay.height = h;

      if (!offscreenRef.current)
        offscreenRef.current = document.createElement("canvas");
      const enc = offscreenRef.current;
      // Smaller encoder for low latency
      const encW = 224;
      const encH = Math.max(
        160,
        Math.round(h > 0 && w > 0 ? (h / w) * encW : 224)
      );
      enc.width = encW;
      enc.height = encH;

      console.log("[CANVAS] overlay:", w, h, "encoder:", encW, encH);
    };

    // Observe container for responsive overlay
    if (containerRef.current) {
      const ro = new ResizeObserver(() => fitCanvases());
      ro.observe(containerRef.current);
      resizeObsRef.current = ro;
    }

    startCamera();

    // Cleanup
    return () => {
      console.log("[CLEANUP]");
      resizeObsRef.current?.disconnect();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "component unmount");
      }
      if (stream) stream.getTracks().forEach((t) => t.stop());
      wsReadyRef.current = false;
      videoReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send the next frame only when the previous one has been answered
  const sendNextFrame = async () => {
    const enc = offscreenRef.current;
    const video = videoRef.current;
    const sock = wsRef.current;
    if (!enc || !video || !sock || sock.readyState !== WebSocket.OPEN) return;
    if (inflightRef.current) return;

    inflightRef.current = true;
    const ctx = enc.getContext("2d");
    if (!ctx) {
      inflightRef.current = false;
      return;
    }

    ctx.drawImage(video, 0, 0, enc.width, enc.height);

    // JPEG blob (~0.5 quality) for speed
    const blob: Blob = await new Promise((resolve) =>
      enc.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.5)
    );

    try {
      sock.send(blob);
    } catch (e) {
      console.error("[WS] send failed:", e);
      inflightRef.current = false;
    }
  };

  // Draw skeleton using pose.landmarks
  const drawOverlay = (payload: any) => {
    const canvas = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 2.5; // lighter to draw on mobile

    const landmarks: Landmarks = payload?.pose?.landmarks || {};

    const srcW = payload?.meta?.width || W;
    const srcH = payload?.meta?.height || H;
    const sx = W / srcW;
    const sy = H / srcH;

    const toPx = (p: Point | undefined) => {
      if (!p) return null;
      if (typeof p.x_px === "number" && typeof p.y_px === "number") {
        return { x: p.x_px * sx, y: p.y_px * sy };
      }
      if (typeof p.x === "number" && typeof p.y === "number") {
        return { x: p.x * W, y: p.y * H };
      }
      return null;
    };

    // Lines
    ctx.strokeStyle = "rgba(0, 200, 255, 0.9)";
    for (const [a, b] of POSE_CONNECTIONS) {
      const pa = toPx(landmarks[a]);
      const pb = toPx(landmarks[b]);
      if (!pa || !pb) continue;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    // Dots
    ctx.fillStyle = "rgba(0, 200, 255, 0.9)";
    for (const name in landmarks) {
      const pt = toPx(landmarks[name]);
      if (!pt) continue;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

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
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
