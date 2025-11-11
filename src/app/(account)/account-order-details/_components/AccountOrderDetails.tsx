"use client";
import Image from "next/image";
import { Nav, Tab } from "react-bootstrap";
import CommanBanner from "@/components/CommanBanner";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import IMAGES from "@/constant/theme";

interface Props {
  order: any;
}

export default function AccountOrderDetails({ order }: Props) {
  if (!order) return null; // safety check

  const item = order.items?.[0];

  return (
    <div className="page-content bg-light">
      <CommanBanner
        image="https://res.cloudinary.com/dbpjskran/image/upload/v1729679011/cld-sample.jpg"
        mainText="Order Details"
        parentText="Home"
        currentText="Order Details"
      />
      <div className="content-inner-1">
        <div className="container">
          <div className="row">
            <CommanSidebar />
            <section className="col-xl-9 account-wrapper">
              <div className="account-card order-details">
                <div className="order-head d-flex align-items-center">
                  <div className="head-thumb">
                    <Image
                      src={
                        item?.productDetails?.image?.[0]?.url ||
                        IMAGES.ShopSmallPic1
                      }
                      alt="product"
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  </div>
                  <div className="clearfix m-l20">
                    <div className="badge bg-warning text-dark">
                      {order.status}
                    </div>
                    <h4 className="mb-0">Order #{order.orderId}</h4>
                  </div>
                </div>

                {/* Order Info */}
                <div className="row mb-sm-4 mb-2 mt-3">
                  <div className="col-sm-6">
                    <div className="shiping-tracker-detail">
                      <span>Item</span>
                      <h6 className="title">{item?.productName}</h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="shiping-tracker-detail">
                      <span>Total Amount</span>
                      <h6 className="title">
                        ₦{Number(order.totalAmount).toLocaleString()}
                      </h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="shiping-tracker-detail">
                      <span>Order Date</span>
                      <h6 className="title">
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="shiping-tracker-detail">
                      <span>Status Updated</span>
                      <h6 className="title">
                        {new Date(order.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="clearfix">
                  <Tab.Container defaultActiveKey={"summary"}>
                    <div className="dz-tabs style-3">
                      <Nav className="nav nav-tabs" role="tablist">
                        <Nav.Link className="nav-link" eventKey={"summary"}>
                          Order Summary
                        </Nav.Link>
                      </Nav>
                    </div>

                    <Tab.Content className="tab-content mt-3">
                      <Tab.Pane eventKey={"summary"}>
                        <div className="tracking-item">
                          <div className="tracking-product">
                            <Image
                              src={
                                item?.productDetails?.image?.[0]?.url ||
                                IMAGES.ShopSmallPic1
                              }
                              alt="product"
                              width={80}
                              height={80}
                              className="rounded"
                            />
                          </div>
                          <div className="tracking-product-content">
                            <h6 className="title">
                              {item?.productDetails?.name}
                            </h6>
                            <small className="d-block">
                              <strong>Unit Price:</strong> ₦
                              {item?.unitPrice?.toLocaleString()}
                            </small>
                            <small className="d-block">
                              <strong>Quantity:</strong> {item?.quantity}
                            </small>
                          </div>
                        </div>

                        <div className="tracking-item-content border-top border-light mt-3 pt-2">
                          <span>Order Total</span>
                          <h6>₦{Number(order.totalAmount).toLocaleString()}</h6>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
