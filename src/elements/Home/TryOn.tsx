"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import IMAGES from "../../constant/theme";

const backgrounds = [
  "https://images.unsplash.com/photo-1707157229729-9349695f2a36?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677575082172-01d12a3f5af8?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627325169322-cbdb3b3f6a87?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1673712060934-34358642511b?q=80&w=1740&auto=format&fit=crop",
];

const fallbackBackground =
  "https://images.unsplash.com/photo-1673712060934-34358642511b?q=80&w=1740&auto=format&fit=crop";

const TryOn = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Fallback background */}
      <div
        style={{
          backgroundImage: `url(${fallbackBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          filter: "brightness(1.2)",
        }}
      />

      {/* Background transitions */}
      {/* {backgrounds.map((bg, i) => (
        <div
          key={i}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: 0,
            opacity: i === bgIndex ? 1 : 0,
            transition: "opacity 1.8s ease-in-out",
            filter: "brightness(0.5)",
            zIndex: 1,
          }}
        />
      ))} */}

      {/* Semi-dark overlay for text visibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "40px",
          maxWidth: "720px",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          background: "rgba(0,0,0,0.4)",
          boxShadow: "0 6px 25px rgba(0,0,0,0.5)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "20px",
            letterSpacing: "1px",
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Try-On Experience Coming Soon
        </h1>

        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 400,
            lineHeight: "1.6",
            marginBottom: "30px",
            color: "#f0f0f0",
            opacity: 0.95,
          }}
        >
          We’re crafting something futuristic for your fashion experience. Soon,
          you’ll be able to{" "}
          <strong style={{ color: "#fff" }}>virtually try on</strong> every
          outfit and see your perfect fit powered by AI.
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: "#dcdcdc",
            opacity: 0.9,
            marginBottom: "40px",
          }}
        >
          It’s not just fashion it’s innovation meeting your mirror. Stay tuned
          for the official launch.
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/collections" className="btn btn-primary w-50">
            Go to Shop
          </Link>
          <Link
            href="/"
            style={{
              padding: "12px 26px",
              border: "2px solid #fff",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              color: "#fff",
              zIndex: 15,
              position: "relative",
              display: "inline-block",
            }}
          >
            Back Home
          </Link>
        </div>
      </div>

      {/* Floating visual */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "40px",
          opacity: 0.25,
          zIndex: 3,
        }}
      >
        <Image
          src={IMAGES.CollectionPng3}
          alt="floating-item"
          width={150}
          height={150}
          style={{ transform: "rotate(-10deg)" }}
        />
      </div>
    </div>
  );
};

export default TryOn;
