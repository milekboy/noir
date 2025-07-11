"use client";
// At the very top: mute MediaPipe’s WASM-worker print spam
if (typeof window !== "undefined") {
  (self as any).Module ??= {};
  (self as any).Module.print = (self as any).Module.printErr = () => {};
}

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  FilesetResolver,
  PoseLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const L_SHOULDER = 11,
  R_SHOULDER = 12,
  L_HIP = 23,
  R_HIP = 24;
const mpToVec = (p: NormalizedLandmark) =>
  new THREE.Vector3(p.x - 0.5, -(p.y - 0.5), -p.z).multiplyScalar(2);

export default function TryOn3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10);
    camera.position.set(0, 0, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(320, 320);
    mountRef.current!.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

    // Load the shirt GLB
    let shirt: THREE.Object3D | null = null;
    new GLTFLoader().load(
      "https://res.cloudinary.com/dbpjskran/raw/upload/v1751801413/t-shirt_rpectk.glb",
      (gltf) => {
        // find the first mesh/skinned-mesh
        gltf.scene.traverse((child) => {
          if (
            (child as THREE.Mesh).isMesh ||
            (child as THREE.SkinnedMesh).isSkinnedMesh
          ) {
            shirt = child;
          }
        });
        if (!shirt) {
          console.warn("No mesh found—using entire scene group");
          shirt = gltf.scene;
        }
        shirt.scale.setScalar(1.6);
        scene.add(gltf.scene);
      },
      undefined,
      (err) => console.error("Failed to load 3D model:", err)
    );

    // Create off-DOM video
    const video = document.createElement("video");
    video.playsInline = video.muted = true;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      return video.play();
    });

    (async () => {
      // **WAIT FOR FIRST FRAME** to avoid 0×0 ROI error
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) return resolve();
        video.onloadeddata = () => resolve();
      });

      // NOW video.videoWidth and video.videoHeight are > 0
      // (We’re not drawing to a canvas here, but MediaPipe needs valid
      // dimensions to compute its ROI.)

      // Initialize MediaPipe Pose Landmarker
      const fs = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const detector = await PoseLandmarker.createFromOptions(fs, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
      });

      // Animation loop
      const loop = () => {
        raf = requestAnimationFrame(loop);

        if (detector && shirt) {
          const res = detector.detectForVideo(video, performance.now());
          if (res.landmarks?.length) {
            const lm = res.landmarks[0];
            // For now just move the shirt’s group to chest midpoint
            const chestMid = mpToVec(lm[L_SHOULDER])
              .add(mpToVec(lm[R_SHOULDER]))
              .multiplyScalar(0.5);
            shirt!.position.copy(chestMid);
          }
        }

        renderer.render(scene, camera);
      };
      loop();
    })();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      (video.srcObject as MediaStream | null)
        ?.getTracks()
        .forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div ref={mountRef} className="rounded-4 shadow-lg bg-dark" />
    </div>
  );
}
