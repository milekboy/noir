import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

export const dataItemValue = [
  { title: "XS", category: "(6)" },
  { title: "S", category: "(8)" },
  { title: "M", category: "(10)" },
  { title: "M/L", category: "(12)" },
  { title: "L", category: "(14)" },
  { title: "XL", category: "(16)" },
  { title: "XXL", category: "(18)" },
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

  // ✅ Apply button closes the menu
  const handleApply = () => {
    const selected = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    alert("Selected sizes: " + selected.join(", "));
    setShowMenu(false); // close dropdown
  };

  return (
    <Dropdown
      className="select-dropdown"
      show={showMenu}
      onToggle={() => setShowMenu((prev) => !prev)}
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
        <span className="me-1">Size</span>
        <i className="fa-solid fa-angle-down ms-2" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "280px" }}>
        {dataItemValue.map((data, ind) => (
          <Dropdown.Item
            as="div"
            key={ind}
            onClick={(e) => e.stopPropagation()} // ✅ Prevent closing on click
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
                accentColor: "black", // ✅ black tick
              }}
            />

            {/* Size and count */}
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 500 }}>{data.title}</span>{" "}
              <span style={{ color: "#888", float: "right" }}>
                {data.category}
              </span>
            </div>
          </Dropdown.Item>
        ))}

        {/* ✅ Full-width button */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid #eee",
          }}
        >
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
