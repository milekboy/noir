"use client";
import { Fragment } from "react/jsx-runtime";
import Link from "next/link";
import {
  CategoryData,
  colorData,
  TagData,
  widgetSize,
} from "../../constant/Alldata";
import ShopSidebarPriceSlider from "./ShopSidebarPriceSlider";
import SelectBoxOne from "./SelectBoxOne";
import SelectBoxThree from "./SelectBoxThree";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useEffect, useState } from "react";

interface Props {
  onPriceChange: (range: [number, number]) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  selectedColor: string | null;
  selectedSize: number | null;
  selectedPriceRange: [number, number];
}
const networkInstance = NetworkInstance();

interface Category {
  _id: string;
  name: string;
  image: string[];
  __v: number;
}

export default function ShopSidebar({
  onPriceChange,
  onColorChange,
  onSizeChange,
  selectedColor,
  selectedSize,
  selectedPriceRange,
}: Props) {
  const [category, setCategory] = useState<Category[]>([]);
  const [latestOpen, setLatestOpen] = useState(false);
  const [selectedLatest, setSelectedLatest] = useState("Latest");

  const latestOptions = ["Price", "Size", "Material"];

  useEffect(() => {
    getCategory();
  }, []);

  async function getCategory() {
    const res = await networkInstance.get("category/get-all-categories");
    setCategory(res.data);
  }

  return (
    <Fragment>
      {/* Search */}
      <div className="widget widget_search">
        <div className="form-group">
          <div className="input-group">
            <input
              name="dzSearch"
              required
              type="search"
              className="form-control"
              placeholder="Search Product"
            />
            <div className="input-group-addon">
              <button
                name="submit"
                value="Submit"
                type="submit"
                className="btn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                    stroke="#0D775E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M17.5 17.5L13.875 13.875"
                    stroke="#0D775E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Dropdown
      <div className="widget">
        <h6
          className="widget-title"
          style={{
            color: "black",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setLatestOpen(!latestOpen)}
        >
          {selectedLatest}
          <span style={{ fontSize: "14px" }}>{latestOpen ? "▲" : "▼"}</span>
        </h6>

        {latestOpen && (
          <ul
            style={{
              listStyle: "none",
              padding: "8px 0",
              margin: 0,
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: "#fff",
            }}
          >
            {latestOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedLatest(opt);
                  setLatestOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom:
                    index !== latestOptions.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div> */}

      {/* Price */}
      <div className="widget">
        <h6 className="widget-title" style={{ color: "black" }}>
          Price
        </h6>
        <div className="price-slide range-slider">
          <div className="price">
            <ShopSidebarPriceSlider
              onChange={onPriceChange}
              value={selectedPriceRange}
            />
          </div>
        </div>
      </div>

      {/* Color */}
      <div className="widget">
        <h6 className="widget-title" style={{ color: "black" }}>
          Color
        </h6>
        <div className="d-flex align-items-center flex-wrap color-filter ps-2">
          {colorData.map((item, ind) => (
            <div className="form-check" key={ind}>
              <input
                className="form-check-input"
                type="radio"
                name="radioColor"
                id={item.inputid}
                value={item.valuecolor}
                onChange={() => onColorChange(item.valuecolor)}
                checked={selectedColor === item.valuecolor}
              />
              <span
                style={{
                  backgroundColor: item.valuecolor,
                  width: "25px",
                  height: "25px",
                }}
              ></span>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="widget">
        <h6 className="widget-title" style={{ color: "black" }}>
          Size
        </h6>
        <div className="btn-group product-size">
          {widgetSize.map((item, ind) => (
            <Fragment key={ind}>
              <input
                type="radio"
                className="btn-check"
                name="btnradio1"
                id={item.inputid}
                value={item.number}
                onChange={() => onSizeChange(item.number.toString())}
                checked={selectedSize === item.number}
              />

              <label
                className="btn"
                htmlFor={item.inputid}
                style={{
                  borderRadius: "0", // square
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                }}
              >
                {item.number}
              </label>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Latest Dropdown */}
      <div className="widget">
        <h6 className="widget-title" style={{ color: "black" }}>
          {" "}
          Sort By
        </h6>
        {/* {/* <h6
          className="widget-title"
          style={{
            color: "black",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setLatestOpen(!latestOpen)}
        >
          Latest
          <span style={{ fontSize: "14px" }}>{latestOpen ? "▲" : "▼"}</span>
        </h6> */}

        {/* {latestOpen && (
          <ul
            style={{
              listStyle: "none",
              padding: "8px 0",
              margin: 0,
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: "#fff",
            }}
          >
            {latestOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedLatest(opt); // still updates selection internally
                  setLatestOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom:
                    index !== latestOptions.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        )} */}
       
      </div>
       <div className="form-group" style={{ marginTop: "-30px" }}>
          <SelectBoxThree/>
        </div>

      {/* <div className="widget widget_categories"></div> */}

      {/* <div className="widget widget_tag_cloud">
        {/* <h6 className="widget-title" style={{color: "black"}}>Tags</h6> 
      </div> */}
    </Fragment>
  );
}
