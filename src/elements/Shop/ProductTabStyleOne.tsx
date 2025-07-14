import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

// interface ProductTabtype{
//     image1: string | StaticImageData;
//     image2: string | StaticImageData;
//     image3: string | StaticImageData;
// }

interface ProductImage {
  url: string;
}

interface PopularProduct {
  productImages: ProductImage[];
  description: string;
  name: string;
  price: string;
  category: string;
  _id: string;
}

export default function ProductTabStyleOne(props: PopularProduct) {
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

  console.log(product?.productImages[0].url);

  return (
    <>
      <div className="detail-bx text-center">
        <h5 className="title">Flawless Denim Delights</h5>
        <p className="para-text">{product?.description}</p>
        {/* <ul className="feature-detail">
          <li>
            <i className="icon feather icon-check"></i>
            <h5>Versatile, enduring style for all occasions</h5>
          </li>
          <li>
            <i className="icon feather icon-check"></i>
            <h5>Handcrafted Elegance, Comfort</h5>
          </li>
          <li>
            <i className="icon feather icon-check"></i>
            <h5>Versatile, enduring style for all occasions</h5>
          </li>
        </ul> */}
      </div>
      <div className="row g-lg-4 g-3">
        <div className="col-xl-4 col-md-4 col-sm-4 col-6">
          <div className="related-img dz-media">
            <Image
              src={
                "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
              }
              width={1000}
              height={1000}
              alt="product1"
            />
          </div>
        </div>
        <div className="col-xl-4 col-md-4 col-sm-4 col-6">
          <div className="related-img dz-media">
            <Image
              src={
                "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
              }
              width={1000}
              height={1000}
              alt="product2"
            />
          </div>
        </div>
        <div className="col-xl-4 col-md-4 col-sm-4">
          <div className="related-img dz-media">
            <Image
              src={
                "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
              }
              width={1000}
              height={1000}
              alt="product3"
            />
          </div>
        </div>
      </div>
    </>
  );
}