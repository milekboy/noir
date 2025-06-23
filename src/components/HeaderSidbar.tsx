import { useState } from "react";
import Link from "next/link";
import ShopSidebar from "../elements/Shop/ShopSidebar";

export default function HeaderSidbar() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 400]);

  const handlePriceChange = (range: [number, number]) =>
    setSelectedPriceRange(range);
  const handleColorChange = (color: string) => setSelectedColor(color);
  const handleSizeChange = (size: string) => setSelectedSize(Number(size));

  return (
    <div className="product-description">
      <ShopSidebar
        onPriceChange={handlePriceChange}
        onColorChange={handleColorChange}
        onSizeChange={handleSizeChange}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedPriceRange={selectedPriceRange}
      />
      <Link href="#" className="btn btn-sm font-14 btn-secondary btn-sharp">
        RESET
      </Link>
    </div>
  );
}
