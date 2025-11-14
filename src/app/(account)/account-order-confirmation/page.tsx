"use client";
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Image from "next/image";
import CommanLayout from "@/components/CommanLayout";
import { Suspense } from "react";
import { CartContext } from "@/components/CartContext";
import { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
function AccountOrderConfirm() {
  const searchParams = useSearchParams();
  const { setCartCount } = useContext(CartContext);
  // const router = useRouter();
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  useEffect(() => {
    if (status === "successful") {
      const hasReloaded = sessionStorage.getItem("hasReloaded");

      if (!hasReloaded) {
        const cartId = localStorage.getItem("cartId");

        localStorage.removeItem("cartId");
        localStorage.removeItem("shippingId");
        setCartCount(0);

        console.log("✅ Payment successful! Your order is confirmed.");
        console.log("cartId:", cartId);
        console.log("tx_ref:", tx_ref);
        console.log("transaction_id:", transaction_id);

        // mark as reloaded so it doesn't happen again
        sessionStorage.setItem("hasReloaded", "true");

        // reload after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }, [status, tx_ref, transaction_id, setCartCount]);

  return (
    <CommanLayout>
      <div className="page-content bg-light">
        <CommanBanner
          image={IMAGES.BackBg1.src}
          mainText="Order Confirmation"
          parentText="Home"
          currentText="Order Confirmation"
        />
        <div className="content-inner-1">
          <div className="container">
            <div className="row">
              <aside className="col-xl-1"></aside>
              <section className="col-xl-9 account-wrapper">
                <div className="confirmation-card account-card">
                  <div className="thumb">
                    <Image src={IMAGES.Confirmation} alt="confirm" />
                  </div>
                  <div className="text-center mt-4">
                    <h4 className="mb-3 text-capitalize">
                      Your Order Is Completed !
                    </h4>
                    <p className="mb-2">
                      You will receive an order confirmation email with details
                      of your order.
                    </p>
                    <p className="mb-0">Transaction ID: {transaction_id}</p>
                    <div className="mt-4 d-sm-flex gap-3 justify-content-center">
                      {/* <Link
                        href="/account-order-details"
                        className="btn my-1 btn-secondary"
                      >
                        View Order{" "}
                      </Link> */}
                      <Link
                        href="/"
                        className="btn btn-outline-secondary my-1 btnhover20"
                      >
                        Back To Home{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </CommanLayout>
  );
}

export default function PaymentSuccessful(props: any) {
  return (
    <Suspense fallback={<p>Loading payment details...</p>}>
      <AccountOrderConfirm {...props} />
    </Suspense>
  );
}
