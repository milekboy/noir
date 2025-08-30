import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export const dataItemValue = [
  { title: "Blue", category: "(16)" },
  { title: "Red", category: "(19)" },
  { title: "Green", category: "(16)" },
  { title: "Purple", category: "(36)" },
  { title: "Pink", category: "(46)" },
  { title: "Cream", category: "(16)" },
  { title: "Brown", category: "(17)" },
];

export default function SelectBoxOne() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (title: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Map color names to actual CSS colors
  const colorMap: Record<string, string> = {
    Blue: "blue",
    Red: "red",
    Green: "green",
    Purple: "purple",
    Pink: "pink",
    Cream: "#FFFDD0",
    Brown: "brown",
  };

  return (
    <Dropdown
      className="select-dropdown"
      style={{ backgroundColor: "white", marginLeft: "-20px" }}
    >
      <Dropdown.Toggle
        className="dropdown-inner"
        style={{
          width: "120px",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFAF3",
          border: "1px solid #fff",
          color: "black",
        }}
      >
        <span className="me-1">Color</span>
        <i className="fa-solid fa-angle-down ms-2" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "280px" }}>
        {dataItemValue.map((data, ind) => (
          <Dropdown.Item
            as="div"
            key={ind}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {/* Custom colored checkbox */}
            <input
              type="checkbox"
              checked={!!checkedItems[data.title]}
              onChange={() => handleCheckboxChange(data.title)}
              style={{
                appearance: "none", // remove default checkbox UI
                WebkitAppearance: "none",
                MozAppearance: "none",
                width: "18px",
                height: "18px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: colorMap[data.title] || "white", // fill color
                cursor: "pointer",
                position: "relative",
              }}
            />
            {/* Tick overlay (CSS pseudo-element effect) */}
            {checkedItems[data.title] && (
              <span
                style={{
                  position: "absolute",
                  width: "18px",
                  height: "18px",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "white",
                }}
              >
                ✓
              </span>
            )}

            {/* Label text */}
            <a
              href="/collections"
              style={{
                textDecoration: "none",
                color: "black",
                width: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500 }}>{data.title}</span>{" "}
                <span style={{ color: "#888", float: "right" }}>
                  {data.category}
                </span>
              </div>
            </a>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
