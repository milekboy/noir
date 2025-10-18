"use client";
import Link from "next/link";
import Image from "next/image";

interface SubCategoryProps {
  id: string;
  label: string;
  image: string[];
  badge: string;
}

export default function ShopCategorySlider({
  categorySelect = [],
}: {
  categorySelect?: SubCategoryProps[];
}) {
  return (
    <div
      className="d-flex flex-nowrap overflow-auto p-3"
      style={{
        gap: "16px",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      {categorySelect.map((item, index) => (
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

          <h6
            className="mb-0 text-nowrap fw-medium"
            style={{ fontSize: "0.95rem" }}
          >
            <Link
              href={`/collections?category=${item.label}`}
              className="text-dark text-decoration-none"
            >
              {item.label}
            </Link>
          </h6>
        </div>
      ))}
    </div>
  );
}
