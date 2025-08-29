"use client";

import React, { useState, useEffect } from "react";
import IMAGES from "../../constant/theme";
import Link from "next/link";
import Image from "next/image";

const collectionImgData = [
  { image: IMAGES.CollectionPng1, design: "collection1" },
  { image: IMAGES.CollectionPng2, design: "collection2" },
  { image: IMAGES.CollectionPng3, design: "collection3" },
  { image: IMAGES.CollectionPng4, design: "collection4" },
];



const backgrounds = [
//   "https://images.unsplash.com/photo-1681510321636-24615988c470?q=80&w=1740&auto=format&fit=crop",
"https://images.unsplash.com/photo-1732605549484-eaada7040d71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1673712060934-34358642511b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
"https://images.unsplash.com/photo-1736741701910-3e8a563b926a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1602810318383-9c26a6d14df7?q=80&w=1740&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1740&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561052967-61fc91e48d79?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// 👇 fallback image (always stays underneath)
const fallbackBackground =
  "https://images.unsplash.com/photo-1732605549484-eaada7040d71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const CollectionBlog = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <React.Fragment>
      {/* Background wrapper */}
      <div
        style={{
          position: "relative",
          marginTop: "50px",
          overflow: "hidden",
        }}
      >
        {/* 👇 fallback background (never disappears) */}
        <div
          style={{
            backgroundImage: `url(${fallbackBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* 👇 sliding background images */}
        {backgrounds.map((bg, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              inset: 0,
              transition: "opacity 1.2s ease-in-out",
              opacity: i === bgIndex ? 1 : 0,
              zIndex: 1,
            }}
          />
        ))}

        {/* Content */}
        <div
          style={{
            position: "relative",
            padding: "100px 60px 195px",
            zIndex: 2,
            color: "#fff",
          }}
        >
          <div className="container text-center">
            <h2
              className="title wow fadeInUp"
              data-wow-delay="0.2s"
              style={{ color: "#fff" }}
            >
              Upgrade your style with our top-notch collection.
            </h2>
            <div>
              <Link
                href="/collections"
                className="btn btn-secondary btn-lg wow fadeInUp m-b30"
                data-wow-delay="0.4s"
              >
                All Collections
              </Link>
            </div>
          </div>

          {/* Collection images */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            {collectionImgData.map(({ image, design }, ind) => (
              <div
                style={{
                  width: "220px",
                  height: "180px",
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                className={design}
                key={ind}
              >
                <Image
                  src={image}
                  alt={`collection-${ind}`}
                  width={220}
                  height={180}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CollectionBlog;
