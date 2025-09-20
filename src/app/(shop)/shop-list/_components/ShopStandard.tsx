"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import CommanBanner from "@/components/CommanBanner";
import IMAGES, { SVGICON } from "@/constant/theme";
import ShopSidebar from "@/elements/Shop/ShopSidebar";
import ShopListCard from "@/elements/Shop/ShopListCard";
import { TabData } from "@/constant/Alldata";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import NetworkInstance from "@/app/api/NetworkInstance";
import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxTwo from "@/elements/Shop/SelectBoxTwo";
import PaginationBlog from "@/elements/Shop/PaginationBlog";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import SelectBoxFour from "@/elements/Shop/SelectBoxFour";
import SelectBoxFive from "@/elements/Shop/SelectBoxFive";
import SelectBoxSix from "@/elements/Shop/SelectBoxSix";
import SelectBoxSeven from "@/elements/Shop/SelectBoxSeven";

export default function ShopStandard() {
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
   const [showFilters, setShowFilters] = useState(true);

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
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([1000, 10000]);

  const onPriceChange = (range: [number, number]) =>
    setSelectedPriceRange(range);
  const onColorChange = (color: string) => setSelectedColor(color);
  const onSizeChange = (size: string) => setSelectedSize(Number(size));

  const filteredProducts = products.filter((item) => {
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
        parentText="Home"
        currentText="Shop-List"
        mainText=" Shop List"
        image={IMAGES.BackBg1.src}
      />
      <section className="content-inner-3 pt-3 z-index-unset">
        <div className="container-fluid">
          <div className="row">
            <div className="col-20 col-xl-3">
              <div className="sticky-xl-top">
                <Link
                  href={"#"}
                  className={`panel-close-btn ${mobileSidebar ? "active" : ""}`}
                  onClick={() => setMobileSidebar(false)}
                >
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 51 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.748 12.5L12.748 37.5"
                      stroke="white"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.748 12.5L37.748 37.5"
                      stroke="white"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                {/* <div
                  className={`shop-filter mt-xl-2 mt-0 ${
                    mobileSidebar ? "active" : ""
                  }`}
                >
                  <aside>
                    <div className="d-flex align-items-center justify-content-between m-b30">
                      <h6 className="title mb-0 fw-normal d-flex">
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
                    </button> *
                  </aside>
                </div> */}
              </div>
            </div>

              <div
                              className="d-flex justify-content-space-between align-items-center m-b30"
                              style={{ marginTop: "30px" }}
                            >
                              {/* Select boxes (shown/hidden based on state) */}
                              {showFilters && (
                                <div className="d-flex align-items-center">
                                  <SelectBoxFour />
                                  <SelectBoxFive />
                                  <SelectBoxSix />
                                  <SelectBoxSeven />
                                  {/* <SelectBoxEight /> */}
                                </div>
                              )}
              
                              {/* Filter button */}
                              <div
                                className="d-flex align-items-center justify-content-between m-b30"
                                style={{
                                  float: "right",
                                  marginLeft: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowFilters((prev) => !prev)}
                              >
                                <h6
                                  className="title mb-0 fw-normal d-flex"
                                  style={{ color: "black" }}
                                >
                                  <i
                                    className="flaticon-filter me-3"
                                    style={{ color: "black" }}
                                  />
                                  Filter
                                </h6>
                              </div>
                            </div>

            <div className="col-80 col-xl-12">
              <Tab.Container defaultActiveKey={"Grid"}>
                <div className="filter-wrapper">
                  <div className="filter-left-area">
                    <ul className="filter-tag">
                      <li>
                        <Link href={"#"} className="tag-btn">
                          Dresses
                          <i className="icon feather icon-x tag-close" />
                        </Link>
                      </li>
                      <li>
                        <Link href={"#"} className="tag-btn">
                          Tops
                          <i className="icon feather icon-x tag-close" />
                        </Link>
                      </li>
                      <li>
                        <Link href={"#"} className="tag-btn">
                          Outerwear
                          <i className="icon feather icon-x tag-close" />
                        </Link>
                      </li>
                    </ul>
                    <span>Showing 1–5 of 50 Results</span>
                  </div>
                  <div className="filter-right-area">
                    <Link
                      href={"#"}
                      className="panel-btn me-2"
                      onClick={() => setMobileSidebar(true)}
                    >
                      <svg
                        className="me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 25 25"
                        width="20"
                        height="20"
                      >
                        <g id="Layer_28" data-name="Layer 28">
                          <path d="M2.54,5H15v.5A1.5,1.5,0,0,0,16.5,7h2A1.5,1.5,0,0,0,20,5.5V5h2.33a.5.5,0,0,0,0-1H20V3.5A1.5,1.5,0,0,0,18.5,2h-2A1.5,1.5,0,0,0,15,3.5V4H2.54a.5.5,0,0,0,0,1ZM16,3.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path>
                          <path d="M22.4,20H18v-.5A1.5,1.5,0,0,0,16.5,18h-2A1.5,1.5,0,0,0,13,19.5V20H2.55a.5.5,0,0,0,0,1H13v.5A1.5,1.5,0,0,0,14.5,23h2A1.5,1.5,0,0,0,18,21.5V21h4.4a.5.5,0,0,0,0-1ZM17,21.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5v-2a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5Z"></path>
                          <path d="M8.5,15h2A1.5,1.5,0,0,0,12,13.5V13H22.45a.5.5,0,1,0,0-1H12v-.5A1.5,1.5,0,0,0,10.5,10h-2A1.5,1.5,0,0,0,7,11.5V12H2.6a.5.5,0,1,0,0,1H7v.5A1.5,1.5,0,0,0,8.5,15ZM8,11.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path>
                        </g>
                      </svg>
                      Filter
                    </Link>
                    <div className="form-group">
                      <SelectBoxOne />
                    </div>
                    <div className="form-group Category">
                      <SelectBoxTwo />
                    </div>
                    <div className="shop-tab">
                      <TabData />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <Tab.Content
                    className="col-12 tab-content shop-"
                    id="pills-tabContent"
                  >
                    <Tab.Pane eventKey={"List"}>
                      <div className="row">
                        {products.slice(2, 8).map((item, ind) => (
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
                              price={item.price}
                              _id={item._id}
                              category={item.category}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey={"Coloumn"}>
                      <div className="row gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3">
                        {filteredProducts.map((item, ind) => (
                          <div
                            className="col-6 col-xl-4 col-lg-6 col-md-6 col-sm-6 m-md-b15 m-sm-b0 m-b30"
                            key={ind}
                          >
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={item.price}
                              _id={item._id}
                              category={item.category}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey={"Grid"}
                      aria-labelledby="tab-list-grid-btn"
                    >
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
              <div className="row page mt-0">
                <div className="col-md-6">
                  <p className="page-text">Showing 1–5 of 50 Results</p>
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
