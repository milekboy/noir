"use client";
import { Accordion, Tab, Nav } from "react-bootstrap";
import { useSearchParams } from "next/navigation";

import IMAGES from "@/constant/theme";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const headDataTitle = [
  { name: "General", keytitle: "General", icon: "icon-box" },
  {
    name: "Returns & Exchanges",
    keytitle: "Returns",
    icon: "icon-shopping-cart",
  },
  { name: "Gifts", keytitle: "Gift", icon: "icon-gift" },
  // { name: "Refunds", keytitle: "Refunds", icon: "icon-dollar-sign" },
  { name: "Payments", keytitle: "Payments", icon: "icon-credit-card" },
  { name: "Shipping", keytitle: "Shipping", icon: "icon-truck" },
];

const AboutAccordionData = [
  {
    headtext: "What is NOIR?",
    para: "NOIR is a contemporary fashion brand dedicated to creating elegant, timeless designs for individuals aged 18 and above. We blend sophistication with comfort to make every piece feel uniquely you.",
  },
  {
    headtext: "Where are you based?",
    para: " NOIR operates from Lagos,Nigeria, with worldwide shipping available.",
  },
  {
    headtext: "How do I know my size?",
    para: " You can refer to our Size Guide available on each product page. If you’re between sizes, we recommend choosing the larger option for the best fit.",
  },
  {
    headtext: "Do you restock sold-out items?",
    para: " Yes! Some collections are restocked depending on demand. You can sign up for restock alerts on the product page or follow us on social media for updates.",
  },
];
const ReturnAccordionData = [
  {
    headtext: "What is your return policy?",
    para: "We accept returns within 7–14 days of delivery, provided the item is unused, unwashed, and in its original packaging with tags attached.",
  },
  {
    headtext: "How do I request a return or exchange?",
    para: "  Simply email support.noirbrand@appcoy.com.ng with your order number, item details, and reason for return. Our team will guide you through the process.",
  },
  {
    headtext: "Are there any non-returnable items?",
    para: "  Yes — lingerie, swimwear, and customized pieces are non-returnable for hygiene and personalization reasons.",
  },
  {
    headtext: "Who covers the cost of return shipping?",
    para: " Return shipping costs are covered by the customer unless the item was defective or you received the wrong order.",
  },
];
const GiftAccordionData = [
  {
    headtext: " Can I send an order as a gift?",
    para: " Absolutely! You can select the “Mark as Gift/or include information on the order notes” option at checkout. We’ll exclude price tags and can include a custom message upon request.",
  },
  {
    headtext: "Do you offer gift cards/apply coupons?",
    para: "   Yes, NOIR offers digital gift cards/coupons in various denominations. They can be emailed directly to the recipient. V2",
  },
  {
    headtext: " Can I return or exchange a gift?",
    para: "  Gift returns are possible with proof of purchase. Refunds are issued as store credit only.",
  },
];
const ShipAccordionData = [
  {
    headtext: "  Do you ship internationally?",
    para: " Yes, we ship worldwide. Delivery times and rates vary depending on your location.",
  },
  {
    headtext: "How long will my order take to arrive?",
    para: "   Local deliveries: 2–5 business days. International deliveries: 7–14 business days Please note that shipping delays may occur during peak seasons or due to customs.",
  },
  {
    headtext: "How can I track my order?",
    para: "   Once your order ships, you’ll receive a confirmation email with your tracking number and a link to monitor delivery progress, also a pin upon collection.",
  },
  {
    headtext: "What are your shipping fees?",
    para: "    Shipping fees are calculated at checkout based on your delivery address and order weight. Free shipping may apply for orders above a certain amount.",
  },
];
const PayAccordionData = [
  {
    headtext: " What payment methods do you accept?",
    para: " We accept credit/debit cards, Paypal,paystack, and direct bank transfers. Local payment options may also be available at checkout depending on your region.",
  },
  {
    headtext: " Is my payment information secure?",
    para: "    Yes — all payments are processed through secure, encrypted gateways. NOIR does not store your card details.",
  },
  {
    headtext: " Can I use more than one payment method?",
    para: "    At this time, only one payment method can be used per order.",
  },
  {
    headtext: "Do you offer payment plans or buy-now-pay-later options?",
    para: "    No, not at this time.",
  },
];

function AccordBlog() {
  return (
    <Accordion className=" dz-accordion accordion-sm" defaultActiveKey="0">
      {AboutAccordionData.map((item, ind) => (
        <Accordion.Item eventKey={`${ind}`} key={ind}>
          <Accordion.Header id="headingOne">
            <Link href={"#"}>
              {item.headtext}
              <span className="toggle-close"></span>
            </Link>
          </Accordion.Header>
          <Accordion.Body>
            <p className="m-b0">{item.para}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
function ShipBlog() {
  return (
    <Accordion className=" dz-accordion accordion-sm" defaultActiveKey="0">
      {ShipAccordionData.map((item, ind) => (
        <Accordion.Item eventKey={`${ind}`} key={ind}>
          <Accordion.Header id="headingOne">
            <Link href={"#"}>
              {item.headtext}
              <span className="toggle-close"></span>
            </Link>
          </Accordion.Header>
          <Accordion.Body>
            <p className="m-b0">{item.para}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function ReturnBlog() {
  return (
    <Accordion className=" dz-accordion accordion-sm" defaultActiveKey="0">
      {ReturnAccordionData.map((item, ind) => (
        <Accordion.Item eventKey={`${ind}`} key={ind}>
          <Accordion.Header id="headingOne">
            <Link href={"#"}>
              {item.headtext}
              <span className="toggle-close"></span>
            </Link>
          </Accordion.Header>
          <Accordion.Body>
            <p className="m-b0">{item.para}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
function GiftBlog() {
  return (
    <Accordion className=" dz-accordion accordion-sm" defaultActiveKey="0">
      {GiftAccordionData.map((item, ind) => (
        <Accordion.Item eventKey={`${ind}`} key={ind}>
          <Accordion.Header id="headingOne">
            <Link href={"#"}>
              {item.headtext}
              <span className="toggle-close"></span>
            </Link>
          </Accordion.Header>
          <Accordion.Body>
            <p className="m-b0">{item.para}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
function PayBlog() {
  return (
    <Accordion className=" dz-accordion accordion-sm" defaultActiveKey="0">
      {PayAccordionData.map((item, ind) => (
        <Accordion.Item eventKey={`${ind}`} key={ind}>
          <Accordion.Header id="headingOne">
            <Link href={"#"}>
              {item.headtext}
              <span className="toggle-close"></span>
            </Link>
          </Accordion.Header>
          <Accordion.Body>
            <p className="m-b0">{item.para}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

interface Item {
  headtext: string;
  para: string;
}

const Faq2 = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestion, setSearchSuggestion] = useState<Item[] | null>(null);
  const searchParams = useSearchParams();
  const [activeKey, setActiveKey] = useState("General");

  useEffect(() => {
    const tab = searchParams.get("tab") || "General";
    setActiveKey(tab);
  }, [searchParams]);

  useEffect(() => {
    setTimeout(() => {
      if (searchSuggestion && searchValue.trim() !== "") {
        const searched = AboutAccordionData.filter(
          (item) =>
            item.headtext.toLowerCase().includes(searchValue.toLowerCase())
          // setSearchSuggestion(item.headtext.toLowerCase().includes(searchValue.toLowerCase()))
        );
        setSearchSuggestion(searched);
      } else {
        setSearchSuggestion([]);
      }
    }, 1000);
  }, [searchValue]);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return (
    <div className="page-content bg-light">
      <section className="px-3">
        <div className="row">
          <Tab.Container
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k ?? "General")}
          >
            <div className="col-xl-6 col-lg-6 col-md-12 faq-side-content">
              <div className="dz-bnr-inr-entry">
                <h1>Have any questions? </h1>
                <nav
                  aria-label="breadcrumb text-align-start"
                  className="breadcrumb-row mb-lg-4 mb-3"
                >
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/"> Home</Link>
                    </li>
                    <li className="breadcrumb-item">FAQ</li>
                  </ul>
                </nav>
              </div>
              <div className="dz-tabs style-1 tab-space">
                <Nav as="ul" className="nav nav-tabs">
                  {headDataTitle.map(({ name, keytitle, icon }, ind) => (
                    <Nav.Link
                      as="li"
                      className=""
                      eventKey={keytitle}
                      key={ind}
                    >
                      <i className={`icon feather ${icon}`} />
                      <span>{name}</span>
                    </Nav.Link>
                  ))}
                </Nav>
              </div>
              <div className="dz-media d-none d-lg-block d-xl-block rounded">
                <Image className="media" src={IMAGES.FaqPic1} alt="" />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-12 faq-end-content">
              <div className="faq-head">
                <div className="search_widget">
                  <form className="dzSearch ">
                    <div className="form-group ">
                      <div className="input-group mb-0">
                        <input
                          name="dzSearch"
                          type="search"
                          className="form-control"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          autoComplete="off"
                          placeholder="Search FAQ"
                        />
                        <div className="input-group-addon">
                          <button
                            name="dzSearch"
                            value="search"
                            className="btn"
                          >
                            <i className="icon feather icon-search" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div
                  className="d-flex justify-content-center position-absolute align-items-cente  "
                  style={{
                    left: windowWidth > 685 ? "40" : "0",
                    right: windowWidth > 685 ? "none" : "0",
                  }}
                >
                  <div
                    className="z-1  position-relative rounded-md"
                    style={{
                      marginTop: "0px",
                      width: "400px",
                    }}
                  >
                    {searchSuggestion?.length ? (
                      <ul
                        className=" text-black  bg-white p-3"
                        style={{ marginTop: "0px!important" }}
                      >
                        {searchSuggestion?.map((item, ind) => (
                          <li
                            className="px-3 py-2 position-relative text-start"
                            key={ind}
                            style={{ cursor: "pointer" }}
                          >
                            {item.headtext}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey={`General`}>
                  <AccordBlog />
                </Tab.Pane>
                <Tab.Pane eventKey={`Returns`}>
                  <ReturnBlog />
                </Tab.Pane>
                <Tab.Pane eventKey={`Gift`}>
                  <GiftBlog />
                </Tab.Pane>
                {/* <Tab.Pane eventKey={`Refunds`}>
                  <AccordBlog />
                </Tab.Pane> */}
                <Tab.Pane eventKey={`Payments`}>
                  <PayBlog />
                </Tab.Pane>
                <Tab.Pane eventKey={`Shipping`}>
                  <ShipBlog />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </section>
    </div>
  );
};

export default Faq2;
