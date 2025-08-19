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
}
export default function ShopProductRightContent({
  product,
}: ShopProductRightContentProps) {
  return (
    <div className="dz-product-detail style-2 p-t20 ps-0">
      <div className="dz-content">
        <div className="dz-content-footer">
          <div className="dz-content-start">
            <span className="badge bg-secondary mb-2">SALE 20% Off</span>
            <h4 className="title mb-1">{product.name}</h4>
            <div className="review-num">
              <ul className="dz-rating me-2">
                <StarRating />
              </ul>
              <span className="text-secondary me-2">4.7 Rating</span>
              <Link href={"#"}>(5 customer reviews)</Link>
            </div>
          </div>
        </div>
        <p className="para-text">{product.description}</p>
        {/* <></> */}
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
        <div className="meta-content mt-2 m-b20 d-flex align-items-end">
          <div className="btn-quantity quantity-sm light d-xl-none d-blcok d-sm-block">
            <label className="form-label">Quantity</label>
            <ProductInputButton />
          </div>
        </div>
        <div className="product-num">
          <div className="btn-quantity light d-xl-block d-sm-none d-none">
            <label className="form-label">Quantity</label>
            <ProductInputButton />
          </div>
          <div className="d-block">
            <label className="form-label">Size</label>
            <div className="btn-group product-size m-0">
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
          <div className="meta-content">
            <label className="form-label">Color</label>
            <div className="d-flex align-items-center color-filter">
              <ShopCardColour />
            </div>
          </div>
        </div>
        <div className="dz-info">
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
          <ul className="social-icon">
            <li>
              <strong>Share:</strong>
            </li>
            <li>
              <Link href="https://www.facebook.com/dexignzone" target="_blank">
                <i className="fa-brands fa-facebook-f" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/showcase/3686700/admin/"
                target="_blank"
              >
                <i className="fa-brands fa-linkedin-in" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/dexignzone/"
                target="_blank"
              >
                <i className="fa-brands fa-instagram" />
              </Link>
            </li>
            <li>
              <Link href="https://www.behance.net/dexignzone" target="_blank">
                <i className="fa-brands fa-behance" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="banner-social-media">
        <ul>
          <li>
            <Link href="https://www.instagram.com/dexignzone/">Instagram</Link>
          </li>
          <li>
            <Link href="https://www.facebook.com/dexignzone">Facebook</Link>
          </li>
          <li>
            <Link href="https://twitter.com/dexignzones">twitter</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
