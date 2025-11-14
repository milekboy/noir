"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

import { Modal, Tab } from "react-bootstrap";
import Image from "next/image"; // ✅ added
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import PaginationBlog from "@/elements/Shop/PaginationBlog";

import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxTwo from "@/elements/Shop/SelectBoxTwo";
import SelectBoxFour from "@/elements/Shop/SelectBoxFour";
import SelectBoxFive from "@/elements/Shop/SelectBoxFive";
import SelectBoxSix from "@/elements/Shop/SelectBoxSix";
import SelectBoxSeven from "@/elements/Shop/SelectBoxSeven";
// import SelectBoxEight from "@/elements/Shop/SelectBoxEight"; // ❌ commented (not used)
import ShopSidebar from "@/elements/Shop/ShopSidebar";
import { dataItemValue as sizeData } from "@/elements/Shop/SelectBoxSix";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import ShopCategorySlider from "@/elements/Shop/ShopCategorySlider";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import NetworkInstance from "@/app/api/NetworkInstance";

// import { label } from "three/src/nodes/TSL.js"; // ❌ remove

export default function ShopSearch({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
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
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const networkInstance = NetworkInstance();

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      const res = await networkInstance.get(
        `https://noir-api-pgco.onrender.com/api/product/search?q=${query}&page=1&limit=8`
      );

      const items = Array.isArray(res.data.results) ? res.data.results : [];

      setProducts(items);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const [detailModal, setDetailModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);

  const onPriceChange = (range: number[]) => {
    setSelectedPrices((prev) => [...new Set([...prev, ...range])]);
  };
  const onColorChange = (colors: string[]) => setSelectedColors(colors);

  const onSizeChange = (sizes: number[]) => {
    setSelectedSizes(sizes);
  };

  const [showFilters, setShowFilters] = useState(true);

  const [hovered, setHovered] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(false);
  const handleResetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    // setBreadcrumb(["Home"]);
    setSelectedPrices([]);
    setSelectedCategoryId(null);
    // router.push("/collections");
  };

  useEffect(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        setAlignRight(true); // shift to the right side
      } else {
        setAlignRight(false); // default left side
      }
    }
  }, [hovered]);

  const router = useRouter();

  const [hoveredSub, setHoveredSub] = useState<string | null>(null);

  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await networkInstance.get("category/get-all-categories");
        // sanitize labels
        // console.log(res.data);
        const cleanData = res.data.map((item: any) => ({
          ...item,
          label: item.label?.trim().replace(/\n/g, ""), // remove \n and spaces
          dropdown: item.dropdown?.map((drop: any) => ({
            ...drop,
            label: drop.label?.trim().replace(/\n/g, ""),
          })),
        }));
        setNavItems(cleanData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchNavItems();
  }, []);

  // const handleDropdownClick = (parentLabel: string, subLabel: string) => {
  //   console.log(`Clicked ${subLabel} inside ${parentLabel}`);
  // };

  // console.log(navItems);

  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Home"]);
  const handleDropdownClick = (parentName: string, subName: string) => {
    setBreadcrumb(["Home", "Collections", parentName, subName]);
    // console.log(
    //   `Breadcrumb updated: Home > Collections > ${parentName} > ${subName}`
    // );
  };

  interface CategoryProps {
    id: string;
    image: [];
    label: string;
    subCategory: SubCategoryProps[];
  }
  interface SubCategoryProps {
    id: string;
    label: string;
    image: string[];
    badge: string;
  }

  const [param, setParam] = useState<string | null>("");
  const [categoryData, setCategoryData] = useState<CategoryProps>();

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    setParam(categoryParam);
  }, [categoryParam]);

  // Select default category data based on the category query parameter
  useEffect(() => {
    if (!categoryParam || !navItems || navItems.length === 0) return;
    const target = categoryParam.trim().toLowerCase();
    const match = navItems.find(
      (it: any) => it?.label?.trim()?.toLowerCase() === target
    );
    if (match) {
      setCategoryData(match);
    }
  }, [categoryParam, navItems]);

  useEffect(() => {
    categoryData?.label;

    // console.log(categoryData, "categorydata")
  }, [categoryData]);
  return (
    <div className="page-content bg-light">
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {products.length === 0 ? (
              <div
                style={{
                  color: "black",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                No items match your search "
                <span style={{ color: "black" }}>{query}</span>"
              </div>
            ) : (
              <h4
                style={{
                  color: "#4d4c4a",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Search results for{" "}
                <span style={{ color: "black" }}>{query}</span>
              </h4>
            )}
          </div>
          <div className="d-none d-lg-block" style={{ width: "80px" }}></div>
        </div>

        {/* Category navigation */}

        <div>
          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
              padding: "10px 0",
              borderTop: "1px solid #eee",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              position: "relative",
              backgroundColor: "#000",
              zIndex: 100,
              whiteSpace: "nowrap",
            }}
            className="mobile-scroll"
          >
            {navItems.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    padding: "6px 10px",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownClick(item.label, item.label); // ✅ pass same label so breadcrumb shows
                    setCategoryData(item);
                    setSelectedCategoryId(item.id);
                    router.push(
                      `/collections?category=${encodeURIComponent(item.label)}`
                    );
                  }}
                >
                  {item.label}
                </div>

                {item.subCategory?.length > 0 && hovered === item.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "6px",
                      width: "700px",
                      padding: "20px 25px",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "20px",
                      zIndex: 1000,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: "20px",
                        rowGap: "6px",
                        alignItems: "flex-start",
                      }}
                    >
                      {item.subCategory.map((drop: any, i: number) => (
                        <Link
                          key={i}
                          href={drop.link || "#"}
                          style={{
                            flex: "0 0 45%",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 400,
                            padding: "2px 0",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDropdownClick(item.label, drop.label);
                            setCategoryData(item);
                            router.push("#");
                          }}
                        >
                          {drop.label}
                          {drop.badge && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "10px",
                                color: "red",
                                fontWeight: 600,
                              }}
                            >
                              {drop.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {item.images?.map((img: string, idx: number) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`${item.name}-${idx}`}
                          width={300}
                          height={400}
                          style={{
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <style jsx>{`
          @media (max-width: 576px) {
            .mobile-scroll {
              overflow-x: auto;
              overflow-y: hidden;
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE/Edge */
              justify-content: flex-start !important;
              gap: 20px !important;
            }

            .mobile-scroll::-webkit-scrollbar {
              display: none; /* Chrome/Safari */
            }
          }
        `}</style>
      </header>

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
                      <h6
                        className="title mb-0 fw-normal d-flex"
                        style={{ color: "black" }}
                      >
                        <i className="flaticon-filter me-3" />
                        Filter
                      </h6>
                    </div>

                    <button
                      type="button"
                      // onClick={handleResetFilters}
                      className="btn btn-sm font-14 btn-secondary btn-sharp"
                    >
                      RESET
                    </button>
                  </aside>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-80 col-xl-12 col-sm-">
              {param && (
                <h4 className="mb-3" style={{ color: "black" }}>
                  New In
                </h4>
              )}
              <div className="row">
                <div className="col-xl-12">
                  <ShopCategorySlider
                    categorySelect={categoryData?.subCategory ?? []}
                  />
                </div>
              </div>
              <div
                className="d-flex justify-content-space-between align-items-center m-b30"
                style={{ marginTop: "-10px", marginLeft: "-30px" }}
              >
                {/* Select boxes (shown/hidden based on state) */}
                {showFilters && (
                  <div className="d-flex align-items-center">
                    <SelectBoxFour onApply={onPriceChange} />
                    <SelectBoxFive onApply={onColorChange} />
                    <SelectBoxSix onApply={onSizeChange} />
                  </div>
                )}

                <div
                  className="d-flex align-items-center justify-content-end mb-3 w-100 filter-container"
                  style={{ gap: "10px" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowFilters((prev) => !prev)}
                  >
                    <h6
                      className="title mb-0 fw-normal d-flex align-items-center"
                      style={{ color: "black", fontSize: "0.95rem" }}
                    >
                      <i
                        className="flaticon-filter me-2"
                        style={{ color: "black" }}
                      />
                      <span className="d-none d-sm-inline">Filter</span>
                    </h6>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-sm font-14 btn-secondary btn-sharp"
                  >
                    RESET
                  </button>

                  <style jsx>{`
                    @media (max-width: 576px) {
                      .filter-container {
                        flex-direction: column !important;
                        align-items: flex-end !important;
                        gap: 6px !important;
                      }
                    }
                  `}</style>
                </div>
              </div>

              <Tab.Container defaultActiveKey={"Grid"}>
                <div className="filter-wrapper border-top p-t20">
                  <div className="filter-left-area">
                    <ul
                      className="filter-tag"
                      style={{
                        display: "flex",
                        padding: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {/* ✅ Dynamic color tags */}
                      {selectedColors.map((color) => (
                        <li key={color}>
                          <button
                            className="tag-btn"
                            onClick={() =>
                              setSelectedColors(
                                selectedColors.filter((c) => c !== color)
                              )
                            }
                          >
                            {color}{" "}
                            <i className="icon feather icon-x tag-close" />
                          </button>
                        </li>
                      ))}

                      {/* ✅ Dynamic size tags (show title instead of number) */}
                      {selectedSizes.map((sizeValue) => {
                        const sizeObj = sizeData.find(
                          (item) => Number(item.category) === sizeValue
                        );
                        const sizeTitle = sizeObj ? sizeObj.title : sizeValue;

                        return (
                          <li key={sizeValue}>
                            <button
                              className="tag-btn"
                              onClick={() =>
                                setSelectedSizes(
                                  selectedSizes.filter((s) => s !== sizeValue)
                                )
                              }
                            >
                              {sizeTitle}{" "}
                              <i className="icon feather icon-x tag-close" />
                            </button>
                          </li>
                        );
                      })}

                      {selectedPrices?.length > 0 &&
                        selectedPrices.map((price) => (
                          <li key={price}>
                            <button
                              className="tag-btn"
                              onClick={() =>
                                setSelectedPrices(
                                  selectedPrices.filter((s) => s !== price)
                                )
                              }
                            >
                              ₦{price.toLocaleString()}
                              <i className="icon feather icon-x tag-close" />
                            </button>
                          </li>
                        ))}
                    </ul>

                    {/*  */}

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
                  </div>
                </div>

                <div className="row">
                  <Tab.Content className="col-12 tab-content shop-">
                    <Tab.Pane eventKey={"Grid"}>
                      <div className="row gx-xl-4 g-3">
                        {(() => {
                          const filtered = products.filter((item) => {
                            // Category filter
                            if (
                              selectedCategoryId &&
                              item.category !== selectedCategoryId
                            )
                              return false;

                            // Color filter
                            if (
                              selectedColors.length &&
                              !selectedColors.includes(item.color)
                            )
                              return false;

                            // Size filter
                            if (
                              selectedSizes.length &&
                              !selectedSizes.includes(Number(item.size))
                            )
                              return false;

                            // Price filter
                            if (
                              selectedPrices.length &&
                              !selectedPrices.includes(Number(item.price))
                            ) {
                              return false;
                            }

                            return true;
                          });

                          // ✅ If no match, show friendly message
                          if (filtered.length === 0) {
                            return (
                              <div
                                className="text-center py-5"
                                style={{
                                  width: "100%",
                                  color: "#555",
                                  fontSize: "1rem",
                                }}
                              >
                                <p>No products match your selected filters.</p>
                              </div>
                            );
                          }

                          // ✅ Otherwise show the products
                          return filtered.map((item, index) => (
                            <div
                              className="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 m-b30"
                              key={index}
                            >
                              <ShopGridCard
                                image={
                                  item.productImages[0]?.url || "/fallback.jpg"
                                }
                                title={item.name}
                                price={item.price}
                                showdetailModal={() => setDetailModal(true)}
                                _id={item._id}
                                category={item.category || ""}
                              />
                            </div>
                          ));
                        })()}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>

              {/* Pagination */}
              <div className="row page mt-0">
                <div className="col-md-6">
                  <p className="page-text">Showing 1–5 of Results</p>
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
