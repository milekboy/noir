"use client";

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

interface Props {
  onChange: (range: [number, number]) => void;
  value: [number, number]; // 🔧 required controlled value from parent
}

export default function ShopSidebarPriceSlider({ onChange, value }: Props) {
  function handleChangeVale(eve: (string | number)[]) {
    const parseVal = (val: string | number): number => {
      if (typeof val === "string")
        return Math.round(parseFloat(val.replace("$", "")));
      return Math.round(val);
    };

    const newMin = parseVal(eve[0]);
    const newMax = parseVal(eve[1]);
    onChange([newMin, newMax]);
  }

  return (
    <div className="range-slider style-1">
      <div id="slider-tooltips2" className="mb-3">
        <Nouislider
          key={`${value[0]}-${value[1]}`}
          range={{ min: 0, max: 400 }}
          start={[value[0], value[1]]}
          connect
          format={{
            to: (val: number) => `$${val.toFixed(0)}`,
            from: (val: string) => parseFloat(val.replace("$", "")),
          }}
          onChange={handleChangeVale}
        />
      </div>
      <span className="example-val">Min Price: {value[0]}</span>
      <span className="example-val ms-3">Max Price: {value[1]}</span>
    </div>
  );
}
