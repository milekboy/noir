"use client";
import CommanLayout from "@/components/CommanLayout";
import { useState, useEffect } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
import ShopProductDefault from "../_components/ShopProductDefault";
import { useParams } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
const ShopProductDefaultPage = () => {
  const [product, setProduct] = useState(null);
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
      setProduct(matchedProduct || null);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  if (!product) {
    return <div className="text-center text-xl">Loading Product...</div>;
  }

  return (
    <CommanLayout>
      <ShopProductDefault product={product} />
    </CommanLayout>
  );
};
export default ShopProductDefaultPage;
