"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Modal, Tab } from "react-bootstrap";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import NetworkInstance from "@/app/api/NetworkInstance";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import ShopListCard from "@/elements/Shop/ShopListCard";
import PaginationBlog from "@/elements/Shop/PaginationBlog";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import { TabData } from "@/constant/Alldata";
import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxFour from "@/elements/Shop/SelectBoxFour";
import SelectBoxFive from "@/elements/Shop/SelectBoxFive";
import SelectBoxSix from "@/elements/Shop/SelectBoxSix";

export default function ShopStandard() {
  interface ProductImage {
    url: string;
    public_id: string;
    filename: string;
  }

  interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    productImages: ProductImage[];
    description: string;
    color: string;
    size: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [detailModal, setDetailModal] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([1000, 10000]);

  const networkInstance = NetworkInstance();

  useEffect(() => {
    getProducts();
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

  const handleResetFilters = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedPriceRange([1000, 10000]);
  };

  const onPriceChange = (range: [number, number]) =>
    setSelectedPriceRange(range);
  const onColorChange = (colors: string[]) =>
    setSelectedColor(colors[0] || null);
  const onSizeChange = (sizes: string[]) => setSelectedSize(sizes[0] || null);

  const filteredProducts = products.filter((item) => {
    const price = Number(item.price);
    const matchColor = selectedColor ? item.color === selectedColor : true;
    const matchSize = selectedSize ? item.size === selectedSize : true;
    const matchPrice =
      price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
    return matchColor && matchSize && matchPrice;
  });

  return (
    <div className="page-content bg-light">
      <CommanBanner
        parentText="Home"
        currentText="Shop-List"
        mainText="Shop List"
        image={IMAGES.BackBg1.src}
      />

      <section className="content-inner-3 pt-3 z-index-unset">
        <div className="container-fluid">
          <div className="row">
            {/* FILTER HEADER */}
            <div
              className="d-flex align-items-center justify-content-end mb-3 w-100"
              style={{ marginTop: "30px" }}
            >
              {showFilters && (
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <SelectBoxFour onApply={onPriceChange} />
                  <SelectBoxFive onApply={onColorChange} />
                </div>
              )}

              <div
                className="d-flex align-items-center ms-2"
                style={{ gap: "4px" }}
              >
                <h6
                  className="title mb-0 fw-normal d-flex align-items-center"
                  style={{
                    color: "black",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  <i
                    className="flaticon-filter me-2"
                    style={{ color: "black" }}
                  />
                  <span className="d-none d-sm-inline">Filter</span>
                </h6>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-sm font-14 btn-secondary btn-sharp"
                  style={{ marginLeft: "4px" }}
                >
                  RESET
                </button>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="col-12">
              <Tab.Container defaultActiveKey={"Grid"}>
                <div className="filter-wrapper mb-4">
                  <div className="filter-right-area d-flex align-items-center justify-content-between">
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <SelectBoxFour onApply={onPriceChange} />
                    </div>
                    <div className="shop-tab">
                      <TabData />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <Tab.Content className="col-12 tab-content shop-">
                    <Tab.Pane eventKey={"List"}>
                      <div className="row">
                        {filteredProducts.slice(0, 6).map((item, ind) => (
                          <div
                            className="col-md-12 col-sm-12 col-xxxl-6"
                            key={ind}
                          >
                            <ShopListCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              description={item.description}
                              title={item.name}
                              price={`₦${item.price}`}
                              _id={item._id}
                              category={item.category}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey={"Grid"}>
                      <div className="row gx-xl-4 g-3">
                        {filteredProducts.map((item, ind) => (
                          <div
                            className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-6 m-md-b15 m-b30"
                            key={ind}
                          >
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={`₦${item.price}`}
                              _id={item._id}
                              category={item.category}
                              showdetailModal={() => setDetailModal(true)}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>

              {/* PAGINATION */}
              <div className="row page mt-0">
                <div className="col-md-6">
                  <p className="page-text">
                    Showing 1–{filteredProducts.length} of {products.length}{" "}
                    Results
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

      {/* MODAL */}
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
