import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

export const dataItemValue = [
  { title: "₦5,000", category: "(16)" },
  { title: "₦10,000", category: "(19)" },
  { title: "₦25,000", category: "(16)" },
  { title: "₦50,000", category: "(36)" },
  { title: "₦150,000", category: "(46)" },
  { title: "₦250,000", category: "(16)" },
  { title: "₦500,000", category: "(17)" },
];

export default function SelectBoxOne() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);

  const handleCheckboxChange = (title: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleApply = () => {
    const selected = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    alert("Selected prices: " + selected.join(", "));
    setShowMenu(false); // ✅ close after apply
  };

  return (
    <Dropdown
      className="select-dropdown"
      show={showMenu}
      onToggle={() => setShowMenu((prev) => !prev)}
      style={{ backgroundColor: "white" }}
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
        <span className="me-1">Price</span>
        <i className="fa-solid fa-angle-down ms-2" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "280px" }}>
        {dataItemValue.map((data, ind) => (
          <Dropdown.Item
            as="div"
            key={ind}
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={!!checkedItems[data.title]}
              onChange={() => handleCheckboxChange(data.title)}
              style={{
                transform: "scale(1.3)",
                cursor: "pointer",
                accentColor: "black",
              }}
            />

            {/* Price label */}
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 500 }}>{data.title}</span>{" "}
              <span style={{ color: "#888", float: "right" }}>
                {data.category}
              </span>
            </div>
          </Dropdown.Item>
        ))}

        {/* Apply button */}
        <div style={{ padding: "10px", borderTop: "1px solid #eee" }}>
          <a href="/collections">
            <Button
              // onClick={handleApply}
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                width: "100%", // ✅ Full width
              }}
            >
              Apply
            </Button>
          </a>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
