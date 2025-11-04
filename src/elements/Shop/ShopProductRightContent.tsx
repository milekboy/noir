"use client";
import { useState, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import StarRating from "./StarRating";
import ProductInputButton from "./ProductInputButton";
import ShopCardColour from "./ShopCardColour";

interface ProductImage {
  url: string;
  public_id: string;
  filename: string;
}

interface Product {
  _id: string;
  name: string;
  price: any;
  category: string;
  productImages: ProductImage[];
  description: string;
  color: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ShopProductRightContentProps {
  product: Product;
  inputValue: number;
  setInputValue: Dispatch<SetStateAction<number>>;
}

export default function ShopProductRightContent({
  product,
  inputValue,
  setInputValue
}: ShopProductRightContentProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  

  return (
    <div className="dz-product-detail style-2 p-t20 ps-0">
      <div className="dz-content">
        <div className="dz-content-footer">
          <div className="dz-content-start">
            <span className="badge bg-secondary mb-2">SALE 20% Off</span>
            <h4 className="title mb-1">{product.name}</h4>
            {/* <div className="review-num">
              <ul className="dz-rating me-2">
                <StarRating />
              </ul>
              <span className="text-secondary me-2">4.7 Rating</span>
              <Link href={"#"}>(5 customer reviews)</Link>
            </div> */}
          </div>
        </div>
        <p className="para-text">{product.description}</p>

        {/* Try It On Button */}
        <Link
          href={"/try-on"}
          className="btn btn-secondary"
          style={{
            animation: "zooming 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Try It On
        </Link>

        <style jsx>{`
          @keyframes zooming {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.08);
            }
          }
        `}</style>

        {/* Quantity & Size Section */}
        <div className="product-num mt-3">
          <div className="btn-quantity light d-xl-block d-sm-none d-none">
            <label className="form-label">Quantity</label>
            <ProductInputButton inputValue={inputValue} setInputValue={setInputValue} />
          </div>

          {/* Size Section with Size Guide */}
          <div className="d-block mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Size</label>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-underline"
                style={{ fontSize: "14px", color: "#000" }}
                onClick={() => setShowSizeGuide(true)}
              >
                Size Guide
              </button>
            </div>

            <div className="btn-group product-size m-0 mt-2">
              <input
                type="radio"
                className="btn-check"
                name="btnradio1"
                id="btnradio101"
                defaultChecked
              />
              <label className="btn" htmlFor="btnradio101">
                S
              </label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio1"
                id="btnradiol02"
              />
              <label className="btn" htmlFor="btnradiol02">
                M
              </label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio1"
                id="btnradiol03"
              />
              <label className="btn" htmlFor="btnradiol03">
                L
              </label>
            </div>
          </div>

          {/* Color Section */}
          <div className="meta-content mt-3">
            <label className="form-label">Color</label>
            <div className="d-flex align-items-center color-filter">
              <ShopCardColour />
            </div>
          </div>
        </div>

        {/* SIZE GUIDE MODAL */}
        {showSizeGuide && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content bg-white p-4 rounded"
              style={{ width: "500px", maxHeight: "80vh", overflowY: "auto" }}
            >
              <h5 className="mb-3">Size Guide</h5>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Hips (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S</td>
                    <td>34-36</td>
                    <td>28-30</td>
                    <td>35-37</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>38-40</td>
                    <td>32-34</td>
                    <td>39-41</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>42-44</td>
                    <td>36-38</td>
                    <td>43-45</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-end">
                <button
                  className="btn btn-dark mt-3"
                  onClick={() => setShowSizeGuide(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="dz-info mt-4">
          <ul>
            <li>
              <strong>SKU:</strong>
            </li>
            <li>PRT584E63A</li>
          </ul>
          <ul>
            <li>
              <strong>Category:</strong>
            </li>
            <li>
              <Link href="/shop-standard">Clothes</Link>
            </li>
          </ul>
          <ul>
            <li>
              <strong>Tags:</strong>
            </li>
            <li>
              <Link href="/shop-standard">Casual,</Link>
            </li>
            <li>
              <Link href="/shop-standard">Athletic,</Link>
            </li>
            <li>
              <Link href="/shop-standard">Workwear,</Link>
            </li>
            <li>
              <Link href="/shop-standard">Accessories,</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
