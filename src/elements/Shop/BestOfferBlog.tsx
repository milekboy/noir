import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

interface PopularProduct {
  description: string;
  name: string;
  price: string;
  category: string;
  _id: string;
}

export default function BestOfferBlog() {
  const [product, setProduct] = useState<PopularProduct | null>(null);

  // const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const network = NetworkInstance();

    async function fetchProduct() {
      try {
        const res = await network.get(
          "/product/get-product/685e1123bc259461ad56b4ea"
        );

        console.log(res.data);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to load product", error);
      }
    }

    fetchProduct();
  }, []);

  return (
    <div className="cart-detail">
      {/* <Link href={"#"} className="btn btn-outline-secondary w-100 m-b20">Bank Offer 5% Cashback</Link> */}
      <div className="icon-bx-wraper style-4 m-b15">
        <div className="icon-bx">
          <i className="flaticon flaticon-ship" />
        </div>
        <div className="icon-content">
          <span className=" font-14">Easy Returns</span>
          <h6 className="dz-title">2 Days</h6>
        </div>
      </div>
      <div className="icon-bx-wraper style-4 m-b30">
        <div className="icon-bx">
          <Image src={IMAGES.ShopIconBox} alt="/" />
        </div>
        <div className="icon-content">
          <h6 className="dz-title">Enjoy The Product</h6>
          <p>
            Crafted with passion, designed for comfort, and delivered with care.
            Your satisfaction means the world to us, and we’re excited to be
            part of your journey.
          </p>
        </div>
      </div>
      <div className="save-text">
        {/* <i className="icon feather icon-check-circle" /> */}
        {/* <span className="m-l10">You will save ₹504 on this order</span> */}
      </div>
      <table>
        <tbody>
          <tr className="total">
            <td>
              <h6 className="mb-0">Total</h6>
            </td>
            <td className="price">&#8358;{product?.price}</td>
          </tr>
        </tbody>
      </table>
      <Link
        href="/shop-wishlist"
        className="btn btn-outline-secondary btn-icon m-b20"
      >
        <svg
          width="19"
          height="17"
          viewBox="0 0 19 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: SVGICON.BlankHeart }}
        ></svg>
        Add To Wishlist
      </Link>
      <Link href="/shop-cart" className="btn btn-secondary w-100">
        ADD TO CART
      </Link>
    </div>
  );
}