"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface SubCategoryProps {
  id: string;
  label: string;
  image: string[];
  badge: string;
}

export default function ShopCategorySlider({
  categorySelect = [],
  autoScroll = true,
  speed = 0.5, // pixels per frame (approx). Lower = slower.
}: {
  categorySelect?: SubCategoryProps[];
  autoScroll?: boolean;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoScroll || !containerRef.current || !contentRef.current) return;

    let rafId: number | null = null;
    const el = containerRef.current;

    // width of one copy of items (we render two identical copies)
    const contentWidth = contentRef.current.scrollWidth / 2 || 0;

    // ensure starting at a safe position
    if (el.scrollLeft >= contentWidth) {
      el.scrollLeft = el.scrollLeft % contentWidth;
    }

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // when we've scrolled past one full copy, wrap seamlessly
        if (contentWidth > 0 && el.scrollLeft >= contentWidth) {
          el.scrollLeft = el.scrollLeft - contentWidth;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [autoScroll, isPaused, speed, categorySelect.length]);

  // reset scroll when items change to avoid jumping
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollLeft = 0;
  }, [categorySelect.length]);

  const renderItem = (item: SubCategoryProps, index: number) => (
    <div
      key={index}
      className="d-flex align-items-center gap-3 p-3 border rounded bg-white hover-shadow-sm transition cursor-pointer flex-shrink-0"
      style={{
        width: "250px",
        minWidth: "200px",
      }}
    >
      <div
        className="rounded overflow-hidden flex-shrink-0"
        style={{ width: "80px", height: "80px" }}
      >
        <Image
          src={
            item.image?.[0] ||
            "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
          }
          alt={item.label}
          width={80}
          height={80}
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      <h6 className="mb-0 text-nowrap fw-medium" style={{ fontSize: "0.95rem" }}>
        <Link
          href={`/collections?category=${encodeURIComponent(item.label)}`}
          className="text-dark text-decoration-none"
        >
          {item.label}
        </Link>
      </h6>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="d-flex flex-nowrap overflow-auto p-3 position-relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        gap: "16px",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      {/* contentRef contains two identical copies for seamless looping */}
      <div
        ref={contentRef}
        className="d-flex"
        style={{ gap: "16px", whiteSpace: "nowrap" }}
      >
        <div className="d-flex" aria-hidden="false" style={{ gap: "16px" }}>
          {categorySelect.map((item, index) => renderItem(item, index))}
        </div>

        <div className="d-flex" aria-hidden="true" style={{ gap: "16px" }}>
          {categorySelect.map((item, index) =>
            renderItem(item, index + categorySelect.length)
          )}
        </div>
      </div>

      <style jsx>{`
        .d-flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}