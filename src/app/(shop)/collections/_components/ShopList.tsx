"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Modal, Tab } from "react-bootstrap";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import PaginationBlog from "@/elements/Shop/PaginationBlog";
import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxTwo from "@/elements/Shop/SelectBoxTwo";
import ShopSidebar from "@/elements/Shop/ShopSidebar";
import { shopStyleData } from "@/constant/Alldata";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import ShopCategorySlider from "@/elements/Shop/ShopCategorySlider";

import NetworkInstance from "../../../api/NetworkInstance";

export default function ShopList({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
  const handleResetFilters = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedPriceRange([1000, 10000]);
  };

  interface ProductImage {
    url: string;
    public_id: string;
    filename: string;
  }

  interface Product {
    _id: string;
    name: string;
    price: any;
    category: string;
    productImages: ProductImage[];
    description: string;
    color: string;
    size: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const networkInstance = NetworkInstance();
  //api call

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProducts = async () => {
    try {
      const res = await networkInstance.get("product/get-all-products");

      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [detailModal, setDetailModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([1000, 10000]);

  const onPriceChange = (range: [number, number]) =>
    setSelectedPriceRange(range);
  const onColorChange = (color: string) => setSelectedColor(color);
  const onSizeChange = (size: string) => setSelectedSize(Number(size));

  const filteredCategory = products
    ? products.filter((item) => item.category === selectedCategory)
    : products;

  const filteredProducts = filteredCategory.filter((item) => {
    const price = item.price;
    const matchColor = selectedColor ? item.color === selectedColor : true;
    const matchSize = selectedSize
      ? item.size === selectedSize.toString()
      : true;
    const matchPrice =
      price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
    return matchColor && matchSize && matchPrice;
  });

  return (
    <div className="page-content bg-light">
      <CommanBanner
        mainText="Collections"
        currentText="Collections"
        parentText="Home"
        image={IMAGES.BackBg1.src}
      />
      <section className="content-inner-3 pt-3">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 d-lg-none">
              <div className="sticky-xl-top ">
                <Link
                  href={"#"}
                  className={`panel-close-btn ${mobileSidebar ? "active" : ""}`}
                  onClick={() => setMobileSidebar(false)}
                >
                  ✕
                </Link>
                <div
                  className={`shop-filter mt-xl-2 mt-0 ${
                    mobileSidebar ? "active" : ""
                  }`}
                >
                  <aside>
                    <div className="d-flex align-items-center justify-content-between m-b30">
                      <h6 className="title mb-0 fw-normal d-flex" style={{ color: "black" }}>
                        <i className="flaticon-filter me-3" />
                        Filter
                      </h6>
                    </div>
                    <ShopSidebar
                      onPriceChange={onPriceChange}
                      onColorChange={onColorChange}
                      onSizeChange={onSizeChange}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      selectedPriceRange={selectedPriceRange}
                    />
                    {/* <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn btn-sm font-14 btn-secondary btn-sharp"
                    >
                      RESET
                    </button> */}
                  </aside>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-80 col-xl-12 col-sm-">
              <h4 className="mb-3" style={{color: "black"}}>Category</h4>
              <div className="row">
                <div className="col-xl-12">
                  <ShopCategorySlider
                    onCategorySelect={function (id: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              </div>

              <Tab.Container defaultActiveKey={"Grid"}>
                <div className="filter-wrapper border-top p-t20">
                  <div className="filter-left-area">
                    <ul className="filter-tag">
                      <li>
                        <Link href={"#"} className="tag-btn">
                          Dresses{" "}
                          <i className="icon feather icon-x tag-close" />
                        </Link>
                      </li>
                    </ul>
                    <span>Showing 1–5 Of {products.length} Results</span>
                  </div>
                  <div className="filter-right-area">
                    <Link
                      href={"#"}
                      className="panel-btn"
                      onClick={() => setMobileSidebar(true)}
                    >
                      Filter
                    </Link>
                    <div className="form-group">
                      <SelectBoxOne />
                    </div>
                    <div className="form-group Category">
                      <SelectBoxTwo />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <Tab.Content className="col-12 tab-content shop-">
                    <Tab.Pane eventKey={"List"}>
                      <div className="row">
                        {products.slice(0, 6).map((item, index) => (
                          <div
                            className="col-md-12 col-sm-12 col-xxxl-6"
                            key={item._id}
                          >
                            {" "}
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={item.price}
                              showdetailModal={() => setDetailModal(true)}
                              _id={""}
                              category={""}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey={"Grid"}>
                      <div className="row gx-xl-4 g-3">
                        {products.map((item, index) => (
                          <div
                            className="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 m-b30"
                            key={index}
                          >
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={`₦${item.price}`}
                              showdetailModal={() => setDetailModal(true)}
                              _id={item._id}
                              category={""}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>

              {/* Pagination */}
              <div className="row page mt-0">
                <div className="col-md-6">
                  <p className="page-text">
                    Showing 1–5 of {filteredProducts.length} Results
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Blog Pagination">
                    <ul className="pagination style-1">
                      <PaginationBlog />
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        className="quick-view-modal"
        centered
        show={detailModal}
        onHide={() => setDetailModal(false)}
      >
        <button
          type="button"
          className="btn-close"
          onClick={() => setDetailModal(false)}
        >
          <i className="icon feather icon-x" />
        </button>
        <div className="modal-body">
          <div className="row g-xl-4 g-3">
            <div className="col-xl-6 col-md-6">
              <div className="dz-product-detail mb-0">
                <div className="swiper-btn-center-lr">
                  <ModalSlider />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6">
              <BasicModalData />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
