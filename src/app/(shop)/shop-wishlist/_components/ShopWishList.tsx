"use client";
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NetworkInstance from "@/app/api/NetworkInstance";
import { CartContext } from "@/components/CartContext";
import { toast } from "react-toastify";

interface Images {
  url: string;
  public_id: string;
  filename: string;
}
interface WishlistType {
  _id: string;
  name: string;
  price: number;
  category: string;
  productImages: Images[];
}

export default function ShopWishList() {
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);

  const { setCartCount, fetchCartCount } = useContext(CartContext);

  const getWishlist = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await NetworkInstance().get("/wishlist", {
        headers: {
          "x-session-id": sessionId,
        },
      });

      setWishlist(res.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  async function handleDelete(productId: string, index: number) {
    setWishlist((prev) => prev.filter((_, i) => i !== index));
    try {
      const sessionId = localStorage.getItem("sessionId");
      await NetworkInstance().delete(`/wishlist/${productId}`, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    } catch (err: any) {
      console.log("error: ", err);
    }
  }
  console.log(wishlist);
  useEffect(() => {
    getWishlist();
  }, []);

  const addToCart = async (item: any) => {
    setCartCount((prev: number) => prev + 1);
    toast("Item moved to Cart successfully.", {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });
    setCartCount((prev: number) => prev + 1);
    const payload: Record<string, any> = {
      productId: item._id,
      categoryId: item.category,
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

  console.log("wishlist:", wishlist);

  return (
    <div className="page-content bg-light">
      <CommanBanner
        parentText="Home"
        currentText="Wishlist"
        mainText="Wishlist"
        image={IMAGES.BackBg1.src}
      />
      <div className="content-inner-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="table-responsive">
                <table className="table check-tbl style-1">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th></th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((elem, ind) => (
                      <tr key={elem._id}>
                        <td className="product-item-img">
                          <Image
                            src={
                              elem.productImages[0]?.url || "/placeholder.jpg"
                            }
                            width={1000}
                            height={1000}
                            alt={elem.name}
                            className="object-fit"
                            style={{ objectFit: "cover" }}
                          />
                        </td>
                        <td className="product-item-name">{elem.name}</td>
                        <td className="product-item-price">
                          <span>${elem.price}.00</span>
                        </td>
                        <td className="product-item-stock">In Stock</td>
                        <td className="product-item-totle">
                          <span
                            className="btn btn-secondary btnhover text-nowrap"
                            onClick={() => {
                              addToCart(elem);
                              handleDelete(elem._id, ind);
                            }}
                          >
                            Add To Cart
                          </span>
                        </td>
                        <td className="product-item-close">
                          <Link
                            href="#"
                            onClick={() => handleDelete(elem._id, ind)}
                          >
                            <i className="ti-close" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
