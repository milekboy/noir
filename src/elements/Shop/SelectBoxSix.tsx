import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export const dataItemValue = [
  {title:"XS", category: "(6)"},
    {title:"S", category: "(8)"},
    {title:"M", category: "(10)"},
    {title:"M/L", category: "(12)"},
    {title:"L", category: "(14)"},
    {title:"XL", category: "(16)"},
    {title:"XXL", category: "(18)"},
];

export default function SelectBoxOne() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (title: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Dropdown className="select-dropdown" style={{ backgroundColor: "white", marginLeft: "-20px" }}>
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
        <span className="me-1">Size</span>
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
            {/* Big black checkbox */}
            <input
              type="checkbox"
              checked={!!checkedItems[data.title]}
              onChange={() => handleCheckboxChange(data.title)}
              style={{
                transform: "scale(1.3)", // bigger size
                cursor: "pointer",
                accentColor: "black", // ✅ makes the checkmark black
              }}
            />

            {/* Price and count */}
            <a href="/collections" style={{ textDecoration: "none", color: "black", width: "100%" }}>
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
