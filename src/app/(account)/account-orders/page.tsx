"use client";
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import { AccoountOrdersTable } from "@/constant/Alldata";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import CommanLayout from "@/components/CommanLayout";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
export default function AccountOrder() {
  const [orders, setOrders] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const params = {
    page: 1,
    limit: 10,
    status: "pending",
    from: "2025-01-01",
    to: "2025-12-31",
  };

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    async function fetchOrders() {
      if (!user) return; // wait until login
      console.log("Fetching orders for user:", user);

      try {
        const networkInstance = NetworkInstance();
        const res = await networkInstance.get("/order/history", { params });
        setOrders(res.data.items.orders);
        console.log(res.data);
      } catch (err: any) {
        console.log("Error fetching orders:", err?.response?.data || err);
      }
    }

    fetchOrders();
  }, []); // runs whenever user changes

  return (
    <CommanLayout>
      <div className="page-content bg-light">
        <CommanBanner
          image="https://res.cloudinary.com/dbpjskran/image/upload/v1729679011/cld-sample.jpg"
          mainText="My Orders"
          parentText="Home"
          currentText="Orders"
        />
        <div className="content-inner-1">
          <div className="container">
            <div className="row">
              <CommanSidebar />
              <div className="col-xl-9 account-wrapper">
                <div className="account-card">
                  <div className="table-responsive table-style-1">
                    <table className="table check-tbl table-hover mb-3">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Date Purchased</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(
                          (data: {
                            _id: Key | null | undefined;
                            id:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactPortal
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                            createdAt: string | number | Date;
                            totalAmount: any;
                            status:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactPortal
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                          }) => (
                            <tr key={data._id}>
                              <td>
                                <Link href="#" className="fw-medium">
                                  {data.id}
                                </Link>
                              </td>
                              <td>
                                {new Date(data.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td>
                                {" "}
                                ₦{Number(data.totalAmount).toLocaleString()}
                              </td>
                              .00
                              <td>
                                <span className={`badge  m-0 `}>
                                  {data.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  href="/account-order-details"
                                  className="btn-link text-underline p-0"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-center">
                    <nav aria-label="Table Pagination">
                      <ul className="pagination style-1">
                        <li className="page-item">
                          <Link className="page-link" href={"#"}>
                            Prew
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" href={"#"}>
                            1
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" href={"#"}>
                            2
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" href={"#"}>
                            3
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" href={"#"}>
                            Next
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommanLayout>
  );
}
