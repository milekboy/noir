// app/components/TryOn.tsx
"use client";

import { useEffect, useRef } from "react";

export default function TryOn({ garmentUrl }: { garmentUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();
  }, []);
  return (
    <div
      style={{ height: "80vh" }}
      className=" d-flex align-items-center justify-content-center bg-black"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-100 h-100"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
