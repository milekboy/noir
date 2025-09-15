"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

export default function ShopSlider({ categoryId }: { categoryId: string | null }) {
  const [images, setImages] = useState<string[]>([]);
  const networkInstance = NetworkInstance();

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await networkInstance.get(`category/get-category/${categoryId}`);
        setImages(res.data?.image || []); // API must return images as array
      } catch (error) {
        console.error("Error fetching category images:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (!images.length) {
    return null; // don’t render anything if no category selected
  }

  return (
    <div className="shop-slider d-flex gap-3">
      {images.map((img, idx) => (
        <Image
          key={idx}
          src={img}
          alt={`category-${idx}`}
          width={400}
          height={300}
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ))}
    </div>
  );
}
    