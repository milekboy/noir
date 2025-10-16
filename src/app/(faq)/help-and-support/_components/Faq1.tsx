"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

const faqContentData = [
  {
    time: 0.8,
    title: "How can I contact customer support?",
    para: "If your order has not yet shipped, you can contact us to change your shipping address. If your order has already shipped, we may not be able to change the address.",
  },
  {
    time: 1,
    title: "How can I track my order?",
    para: "Once your order has shipped, you will receive a tracking number via email. You can use this tracking number to track your order on our website or on the carrier's website.",
  },
  {
    time: 1.2,
    title: "Can I cancel my order?",
    para: "If your order has not yet shipped, you can cancel it by contacting us. If your order has already shipped, you will need to follow our return policy.",
  },
  {
    time: 1.4,
    title: "Do you offer gift wrapping?",
    para: "Yes, we offer gift wrapping for an additional fee. You can select this option during checkout.",
  },
  {
    time: 1.6,
    title: "Do you offer international shipping?",
    para: "Yes, we offer international shipping to select countries. Please check our shipping page for more information.",
  },
  {
    time: 1.8,
    title: "What is your return policy?",
    para: "We offer a 30-day return policy for most products. If you are not satisfied with your purchase, please contact us for instructions on how to return the item.",
  },
];
const headDataTitle = [
  { name: "General", keytitle: "General", icon: "icon-box" },
  { name: "Returns", keytitle: "Returns", icon: "icon-shopping-cart" },
  { name: "Gift", keytitle: "Gift", icon: "icon-gift" },
  { name: "Refunds", keytitle: "Refunds", icon: "icon-dollar-sign" },
  { name: "Payments", keytitle: "Payments", icon: "icon-credit-card" },
  { name: "Shipping", keytitle: "Shipping", icon: "icon-truck" },
];

interface Item {
  title: string;
  para: string;
}
const Faq1 = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestion, setSearchSuggestion] = useState<Item[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (searchSuggestion && searchValue.trim() !== "") {
        const searched = faqContentData.filter(
          (item) => item.title.toLowerCase().includes(searchValue.toLowerCase())
          // setSearchSuggestion(item.headtext.toLowerCase().includes(searchValue.toLowerCase()))
        );
        setSearchSuggestion(searched);
      } else {
        setSearchSuggestion([]);
      }
    }, 1000);
  }, [searchValue]);
  return (
    <div className="page-content bg-light">
      <section className="content-inner main-faq-content">
        <div className="container">
          <div className="row faq-head">
            <div className="col-12 text-center">
              <h1 className="title">Hi! How can we help you?</h1>
              <nav className="breadcrumb-row">
                <ul className="breadcrumb mb-lg-4 mb-3">
                  <li className="breadcrumb-item">
                    <Link href="/"> Home</Link>
                  </li>
                  <li className="breadcrumb-item">Help and Support</li>
                </ul>
              </nav>
              <div className="search_widget">
                <form className="dzSearch">
                  <div className="form-group">
                    <div className="input-group mb-0">
                      <input
                        name="dzSearch"
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="form-control"
                        placeholder="Search FAQ"
                        autoComplete="off"
                      />
                      <div className="input-group-addon">
                        <button name="dzSearch" value="search" className="btn">
                          <i className="icon feather icon-search" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
               
                  <div className="d-flex justify-content-center  position-absolute  align-items-center  " style={{left: "0", right: "0"}}>
                    <div
                      className="z-1 bg-white position-relative rounded-md"
                      style={{
                        marginTop: "0px",
                        width: "400px",
                        zIndex: "9999",
                      }}
                    >
                      <ul
                        className=" text-black  bg-white p-3 "
                        style={{ marginTop: "0px!important" }}
                      >
                        {searchSuggestion?.map((item, ind) => (
                            <Link href="/faqs-2" className="faq-link "> 
                          <li
                            className="px-3 py-2 position-relative text-start"
                            key={ind}
                            style={{ cursor: "pointer" }}
                          >
                            {item.title}
                          </li>
                          </Link> 
                        ))}
                      </ul>
                    </div>
                  </div>
              
              </div>
              <div className="dz-tabs style-1 tab-space">
                <Nav as="ul" className="nav nav-tabs">
                  {headDataTitle.map(({ name, keytitle, icon }, ind) => (
                    <Link href="/faqs-2" className="faq-link ">
                    <li
                      className="px-5  border rounded-2xl d-flex flex-column"
                      key={ind}
                       style={{marginRight: "20px", padding: "10px", alignItems: "center", justifyContent: "center", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer", transition: "transform 0.2s"}}
                    >
                      <i
                        className={`icon feather ${icon} `}
                        style={{ fontSize: "30px" }}
                      />
                      <span>{name}</span>
                    </li>
                    </Link> 
                  ))}
                </Nav>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {faqContentData.map((data, ind) => (
              <div
                className="col-xl-4 col-lg-4 col-md-4 col-sm-6 m-b30 m-sm-b15"
                key={ind}
              >
                <div className="faq-content-box style-1">
                  <div>
                    <h3 className="dz-title">{data.title}</h3>
                    <p>{data.para}</p>
                  </div>
                  <Link href="/faqs-2" className="faq-link">
                    <i className="flaticon-plus" />
                    Show More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq1;
