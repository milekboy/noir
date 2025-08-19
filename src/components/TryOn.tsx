"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TryOn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId = 0;

    // ---- 1) Start selfie camera ----
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // selfie camera
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    })();

    // ---- 2) Three.js setup (transparent overlay) ----
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true, // keep background transparent over video
      preserveDrawingBuffer: false,
    });
    renderer.setClearAlpha(0);

    // Lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    // Test cube (performance check)
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      metalness: 0.2,
      roughness: 0.6,
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cube);

    // Handle resize
    const resize = () => {
      const el = containerRef.current!;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    resize();
    window.addEventListener("resize", resize);

    // Animate
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.015;
      renderer.render(scene, camera);
    };
    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      if (stream) stream.getTracks().forEach((t) => t.stop());
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
      {/* Live camera underlay */}
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

      {/* Three.js transparent overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none", // let UI clicks pass through
        }}
      />
    </div>
  );
}
