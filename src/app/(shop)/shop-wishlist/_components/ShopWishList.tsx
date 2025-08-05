"use client";
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { useEffect, useState } from "react";
import Image from "next/image";
import NetworkInstance from "@/app/api/NetworkInstance";

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
    try{
         const sessionId = localStorage.getItem("sessionId");
        await NetworkInstance().delete(`/wishlist/${productId}`, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    } catch (err: any){
        console.log("error: ", err)
    }
  
   
  }
console.log(wishlist)
  useEffect(() => {
    getWishlist();
  }, []);

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
                            style={{objectFit: "cover"}}
                          />
                        </td>
                        <td className="product-item-name">{elem.name}</td>
                        <td className="product-item-price">
                          <span>${elem.price}.00</span>
                        </td>
                        <td className="product-item-stock">In Stock</td>
                        <td className="product-item-totle">
                          <Link
                            href="/shop-cart"
                            className="btn btn-secondary btnhover text-nowrap"
                          >
                            Add To Cart
                          </Link>
                        </td>
                        <td className="product-item-close">
                          <Link href="#" onClick={() => handleDelete(elem._id,ind)}>
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
