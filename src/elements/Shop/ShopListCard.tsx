
import Image from "next/image";
import { useContext } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
import Link from "next/link";
import { CartContext } from "@/components/CartContext";
interface varibleType {
  description: string;
  image: string;
  title: string;
  price?: string;
  _id: string;
  category: string;
  inputtype?: string;
}

export default function ShopListCard(props: varibleType) {
  const { setCartCount, fetchCartCount } = useContext(CartContext);
  const addToCart = async () => {
    const payload: Record<string, any> = {
      productId: props._id,
      categoryId: props.category,
      quantity: 1,
    };

    const existingCartId = localStorage.getItem("cartId");
    if (existingCartId) {
      payload.cartId = existingCartId;
    } else {
      setCartCount((prev: number) => prev + 1);
    }

    try {
      const response = await NetworkInstance().post("/cart/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200 || response?.status === 201) {
        fetchCartCount();
        const newCartId = response.data?.cartId;

        if (newCartId) {
          localStorage.setItem("cartId", newCartId);
        }

        console.log("product added to cart");
      }
    } catch (err: any) {
      console.error("Not added to cart:", err?.response?.data || err, payload);
    }
  };
  return (
    <div className="dz-shop-card style-2">
      <div className="dz-media">
        <Image height={300} width={300} src={props.image} alt="shop" />
      </div>
      <div className="dz-content">
        <div className="dz-header">
          <div>
            <h4 className="title mb-0">
              <Link href="/shop-list">{props.title}</Link>
            </h4>
            <ul className="dz-tags">
              <li>
                <Link href="/shop-with-category">Accessories,</Link>
              </li>
              <li>
                <Link href="/shop-with-category">Sunglasses</Link>
              </li>
            </ul>
          </div>
          <div className="review-num">
            <ul className="dz-rating">
              <li className="star-fill">
                <i className="flaticon-star-1" />
              </li>
              <li className="star-fill">
                <i className="flaticon-star-1" />
              </li>
              <li className="star-fill">
                <i className="flaticon-star-1" />
              </li>
              <li>
                <i className="flaticon-star-1" />
              </li>
              <li>
                <i className="flaticon-star-1" />
              </li>
            </ul>
            <span>
              <Link href="#"> 250 Review</Link>
            </span>
          </div>
        </div>
        <div className="dz-body">
          <div className="dz-rating-box">
            <div>
              <p className="dz-para">{props.description}</p>
            </div>
          </div>
          <div className="rate">
            <div className="d-flex align-items-center mb-xl-3 mb-2">
              <div className="meta-content m-0">
                <span className="price-name">Price</span>
                <span className="price">{props.price}</span>
              </div>
            </div>
            <div className="d-flex">
              <button
                onClick={() => {
                  addToCart();
                }}
                className="btn btn-secondary btn-md btn-icon"
              >
                <i className="icon feather icon-shopping-cart d-md-none d-block" />
                <span className="d-md-block d-none">Add to cart</span>
              </button>
              <div className="bookmark-btn style-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={props.inputtype}

                />
                <label className="form-check-label" htmlFor={props.inputtype}>
                  <i className="fa-solid fa-heart" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
