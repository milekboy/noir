import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

export const dataItemValue = [
  { title: "₦5,000" },
  { title: "₦7,500" },
  { title: "₦8,000" },
  { title: "₦8,500" },
  { title: "₦9,000" },
  { title: "₦9,500" },
  { title: "₦10,000" },
];
export default function SelectBoxOne({
  onApply,
}: {
  onApply: (range: [number, number]) => void;
}) {
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
    if (selected.length > 0) {
      const numericValues = selected.map((s) => Number(s.replace(/[₦,]/g, "")));
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);

      onApply([min, max]);
      setShowMenu(false);
    } else {
      onApply([0, Infinity]);
      setShowMenu(false);
    }
  };
  return (
    <Dropdown
      className="select-dropdown "
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
            </div>
          </Dropdown.Item>
        ))}

        {/* Apply button */}
        <div style={{ padding: "10px", borderTop: "1px solid #eee" }}>
          <Button
            onClick={handleApply}
            style={{
              backgroundColor: "black",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              width: "100%",
            }}
          >
            Apply
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
