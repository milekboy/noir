"use client"; // this must be here because we'll use useEffect

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommanLayout from "@/components/CommanLayout";
import AccountOrderDetails from "../_components/AccountOrderDetails";
import NetworkInstance from "@/app/api/NetworkInstance";

export default function AccountOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const networkInstance = NetworkInstance();
        const res = await networkInstance.get(`/order/track/${id}`);
        setOrder(res.data);
        console.log("Order data:", res.data);
      } catch (err: any) {
        console.error(
          "Error fetching order:",
          err?.response?.data || err.message
        );
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  return (
    <CommanLayout>
      {loading ? (
        <div className="page-content bg-light text-center py-5">
          <h5>Loading order details...</h5>
        </div>
      ) : error ? (
        <div className="page-content bg-light text-center py-5">
          <h5>{error}</h5>
        </div>
      ) : (
        <AccountOrderDetails order={order} />
      )}
    </CommanLayout>
  );
}
