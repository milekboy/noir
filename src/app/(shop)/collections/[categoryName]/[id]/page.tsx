"use client";
import CommanLayout from "@/components/CommanLayout";
import { useState, useEffect } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useParams } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import ShopProductDefault from "../../../product-default/_components/ShopProductDefault";
const ShopProductDefaultPage = () => {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState<any>(null)
  const params = useParams();
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const res = await NetworkInstance().get("product/get-all-products");
      const matchedProduct = res.data.find(
        (p: { _id: ParamValue }) => p._id === params?.id
      );
      if(matchedProduct) {
        setProduct(matchedProduct || null);
        const res = await NetworkInstance().get(`category/get-category/${matchedProduct.category}`);
        setCategory(res.data || null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  if (!product) {
    return <div className="text-center text-xl">Loading Product...</div>;
  }

  return (
    <CommanLayout>
      <ShopProductDefault product={product} category={category} />
    </CommanLayout>
  );
};
export default ShopProductDefaultPage;
