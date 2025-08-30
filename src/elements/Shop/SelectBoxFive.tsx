import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

export const dataItemValue = [
  { title: "Blue", category: "(16)", color: "blue" },
  { title: "Red", category: "(19)", color: "red" },
  { title: "Green", category: "(16)", color: "green" },
  { title: "Purple", category: "(36)", color: "purple" },
  { title: "Pink", category: "(46)", color: "pink" },
  { title: "Cream", category: "(16)", color: "wheat" },
  { title: "Brown", category: "(17)", color: "brown" },
];

export default function SelectBoxColor() {
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
    alert("Selected colors: " + selected.join(", "));
    setShowMenu(false);
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
        <span className="me-1">Color</span>
        <i className="fa-solid fa-angle-down ms-2" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "280px" }}>
        {dataItemValue.map((data, ind) => (
          <Dropdown.Item
            as="div"
            key={ind}
            onClick={(e) => e.stopPropagation()} // ✅ keep dropdown open
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {/* Colored square acting as checkbox */}
            <label
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: data.color,
                borderRadius: "4px",
                border: checkedItems[data.title]
                  ? "2px solid black"
                  : "2px solid #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={!!checkedItems[data.title]}
                onChange={() => handleCheckboxChange(data.title)}
                style={{
                  display: "none", // hide native checkbox
                }}
              />
              {checkedItems[data.title] && (
                <i
                  className="fa fa-check"
                  style={{ color: "white", fontSize: "12px" }}
                />
              )}
            </label>

            {/* Title + Count */}
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
