// app/components/TryOn.tsx
"use client";

/* ── 1 · silence TF-Lite info in prod ── */
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  console.info = () => {};
}

import { useEffect, useRef } from "react";
import type {
  PoseLandmarker as PoseLM,
  FilesetResolver as FSResolver,
  PoseLandmarkerResult,
} from "@mediapipe/tasks-vision"; // type-only import

/* BlazePose landmark indices */
const L_SHOULDER = 11,
  R_SHOULDER = 12,
  L_HIP = 23,
  R_HIP = 24;

export default function TryOn({ garmentUrl }: { garmentUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let landmarker: PoseLM;
    let raf = 0;

    /* hidden <video> as camera source */
    const video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;

    const start = async () => {
      /* ① dynamic import AFTER console.info muted */
      const { PoseLandmarker, FilesetResolver } = (await import(
        "@mediapipe/tasks-vision"
      )) as {
        PoseLandmarker: typeof PoseLM;
        FilesetResolver: typeof FSResolver;
      };

      /* ② load WASM + model */
      const fs = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      landmarker = await PoseLandmarker.createFromOptions(fs, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
      });

      /* ③ open webcam */
      video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      await video.play();

      /* ④ fix canvas to 320 × 320 px (20 rem = w-80) */
      const canvas = canvasRef.current!;
      canvas.width = 320;
      canvas.height = 320;

      /* ⑤ preload garment */
      const shirt = new Image();
      shirt.src = garmentUrl;

      /* ⑥ render loop */
      const loop = () => {
        const res = landmarker.detectForVideo(video, performance.now());
        draw(res, shirt, video);
        raf = requestAnimationFrame(loop);
      };
      loop();
    };

    start();

    /* cleanup */
    return () => {
      cancelAnimationFrame(raf);
      (video.srcObject as MediaStream | null)
        ?.getTracks()
        .forEach((t) => t.stop());
    };
  }, [garmentUrl]);

  /* draw frame */
  function draw(
    res: PoseLandmarkerResult,
    shirt: HTMLImageElement,
    video: HTMLVideoElement
  ) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* mirror camera */
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!res.landmarks?.length) return;
    const lm = res.landmarks[0];

    const Ls = lm[L_SHOULDER],
      Rs = lm[R_SHOULDER];
    const Lh = lm[L_HIP],
      Rh = lm[R_HIP];

    const w = Math.hypot(Rs.x - Ls.x, Rs.y - Ls.y) * canvas.width * 1.4;
    const h = Math.hypot(Rh.y - Rs.y, Rh.x - Rs.x) * canvas.height * 1.6;

    const cx = (1 - (Ls.x + Rs.x) / 2) * canvas.width;
    const cy = ((Ls.y + Rs.y) / 2) * canvas.height;

    const angle = Math.atan2(Rs.y - Ls.y, Ls.x - Rs.x);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(shirt, -w / 2, -h * 0.15, w, h);
    ctx.restore();
  }

  /* ── UI ───────────────────────────────────────────────────────────── */
  return (
    <div className="d-flex align-items-center justify-content-center bg-black">
      {/* 20-rem square, centred, with black background */}

      <canvas ref={canvasRef} />
    </div>
  );
}
