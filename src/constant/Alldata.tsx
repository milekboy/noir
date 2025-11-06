import { Nav } from "react-bootstrap";
import IMAGES, { SVGICON } from "./theme";
import { link } from "fs";

//home 1
export const MainSwiperData = [
  { title: "Beautiful Woman Purple Sweater.", price: "30.00" },
  { title: "Shot Slad Curly Woman.", price: "80.00" },
  { title: "Curly Girl Beautiful Dress", price: "30.00" },
  { title: "Beautiful Woman Purple Sweater.", price: "40.00" },
  { title: "Shot Slad Curly Woman.", price: "50.00" },
  { title: "Curly Girl Beautiful Dress", price: "60.00" },
];

//home 1
export const MainSwiperData2 = [
  { image: IMAGES.Bannermedia, name: "Winter" },
  { image: IMAGES.Bannermedia2, name: "Summer" },
  { image: IMAGES.Bannermedia3, name: "Leggings" },
  { image: IMAGES.Bannermedia4, name: "Dress" },
  { image: IMAGES.Bannermedia5, name: "Shorts" },
];

//home 1
export const FeaturedSliderData = [
  { image: IMAGES.Clothes1, name: "Shirts" },
  { image: IMAGES.Clothes2, name: "Shorts" },
  { image: IMAGES.Clothes3, name: "T-Shirt" },
  { image: IMAGES.Clothes4, name: "Jeans" },
  { image: IMAGES.Clothes2, name: "Shorts" },
  { image: IMAGES.Clothes5, name: "Jeans" },
  { image: IMAGES.Clothes3, name: "T-Shirt" },
];

// text slider
export const PopluarProdutData = [
  { name: "Jacket" },
  { name: "Jeans" },
  { name: "Shirts" },
  { name: "Shorts" },
  { name: "t-shirt" },
  { name: "Blazer" },
  { name: "Jacket" },
  { name: "Jeans" },
  { name: "Shirts" },
  { name: "Shorts" },
];

// Production Section
export const headfilterData = [
  { title: "ALL" },
  { title: "Men" },
  { title: "Women" },
  { title: "Back to Campus" },
];
export const masonryData = [
  {
    id: 1,
    hert: false,
    image: IMAGES.shopproduct1,
    price: "80",
    name: "Cozy Knit Cardigan Sweater",
    discount: "20",
    category: "ALL Dresses  Outerwear Jacket",
  },
  {
    id: 2,
    hert: false,
    image: IMAGES.shopproduct2,
    price: "70",
    name: "Sophisticated Swagger Suit",
    discount: "10",
    category: "ALL  Tops Outerwear ",
  },
  {
    id: 3,
    hert: false,
    image: IMAGES.shopproduct3,
    price: "50",
    name: "Classic Denim Skinny Jeans",
    discount: "15",
    category: "ALL Dresses  Outerwear Jacket",
  },
  {
    id: 4,
    hert: false,
    image: IMAGES.shopproduct4,
    price: "30",
    name: "Athletic Mesh Sports Leggings",
    discount: "40",
    category: "ALL Dresses   Jacket",
  },
  {
    id: 5,
    hert: false,
    image: IMAGES.shopproduct5,
    price: "55",
    name: "Vintage Denim Overalls Shorts",
    discount: "25",
    category: "ALL Dresses Tops Outerwear ",
  },
  {
    id: 6,
    hert: false,
    image: IMAGES.shopproduct6,
    price: "65",
    name: "Satin Wrap Party Blouse",
    discount: "30",
    category: "ALL   Outerwear Jacket",
  },
  {
    id: 7,
    hert: false,
    image: IMAGES.shopproduct7,
    price: "35",
    name: "Plaid Wool Winter Coat",
    discount: "15",
    category: "ALL Dresses  Outerwear Jacket",
  },
  {
    id: 8,
    hert: false,
    image: IMAGES.shopproduct8,
    price: "75",
    name: "Water-Resistant Windbreaker Jacket",
    discount: "25",
    category: "ALL Dresses Tops  ",
  },
];

// home 1 map slider
export const HottestSliderBlogData = [
  { image: IMAGES.productmedium3, title: "Cardigan Sweater" },
  { image: IMAGES.productmedium4, title: "Swagger Suit" },
  { image: IMAGES.productmedium5, title: "Skinny Jeans" },
  { image: IMAGES.productmedium6, title: "Sports Leggings" },
  { image: IMAGES.productmedium3, title: "Cardigan Sweater" },
  { image: IMAGES.productmedium4, title: "Swagger Suit" },
];

// bluster dea;
export const BlockbusterSliderData = [
  { image: IMAGES.ShartShop1, title: "Printed Spread Collar Casual Shirt" },
  { image: IMAGES.ShartShop2, title: "Checkered Slim Collar Casual Shirt" },
  { image: IMAGES.ShartShop3, title: "Solid Cut Away Collar Casual Shirt" },
  { image: IMAGES.ShartShop4, title: "Printed Spread Collar Casual Shirt" },
  { image: IMAGES.ShartShop5, title: "Checkered Spread Collar Casual Shirt" },
];

// feature now slider
export const FeaturedNowSliderData = [
  { image: IMAGES.shopproduct1, name: "Cozy Knit Cardigan Sweater" },
  { image: IMAGES.shopproduct2, name: "Sophisticated Swagger Suit" },
  { image: IMAGES.shopproduct3, name: "Classic Denim Skinny Jeans" },
  { image: IMAGES.shopproduct4, name: "Cozy Knit Cardigan Sweater" },
  { image: IMAGES.shopproduct5, name: "Sophisticated Swagger Suit" },
  { image: IMAGES.shopproduct6, name: "Classic Denim Skinny Jeans" },
];

//Home great and short list
export const GreatSavindData = [
  { image: IMAGES.ShopPorductPng1, name: "Cozy Knit Cardigan Sweater" },
  {
    image: IMAGES.ShopPorductPng2,
    name: "Sophisticated Swagger Suit",
    star: "star",
  },
  { image: IMAGES.ShopPorductPng3, name: "Classic Denim Skinny Jeans" },
  { image: IMAGES.ShopPorductPng4, name: "Athletic Mesh Sports Leggings" },
];

//Sponsored Slider
export const SponsoredSliderData = [
  {
    image: IMAGES.CompanyImg1,
    time: 0.6,
    image2: IMAGES.CompanyLogo1,
    title: "Outdoor Shoes",
  },
  {
    image: IMAGES.CompanyImg2,
    time: 0.8,
    image2: IMAGES.CompanyLogo2,
    store: "store",
    title: "Best Cloths",
  },
  {
    image: IMAGES.CompanyImg1,
    time: 1.0,
    image2: IMAGES.CompanyLogo3,
    title: "Sports Shoes",
  },
  {
    image: IMAGES.CompanyImg3,
    time: 1.2,
    image2: IMAGES.CompanyLogo4,
    store: "store",
    title: "Modern Jewellery",
  },
  {
    image: IMAGES.CompanyImg1,
    time: 1.4,
    image2: IMAGES.CompanyLogo1,
    title: "Running Shoes",
  },
  {
    image: IMAGES.CompanyImg2,
    time: 1.5,
    image2: IMAGES.CompanyLogo3,
    store: "store",
    title: "Sports Shoes",
  },
];

// Trading
export const TradingSliderBlogdata = [
  {
    image: IMAGES.BlogGridPic1,
    time: "0.6",
    name: "Style Diaries: A Week in Fashion",
    date: "14 Feb 2025",
  },
  {
    image: IMAGES.BlogGridPic2,
    time: "0.8",
    name: "Chic & Unique: Personalized Fashion Finds",
    date: "17 Feb 2025",
  },
  {
    image: IMAGES.BlogGridPic3,
    time: "1.0",
    name: "Dress to Impress: Elevate Your Everyday Style",
    date: "19 Feb 2025",
  },
  {
    image: IMAGES.BlogGridPic4,
    time: "1.2",
    name: "Street Style Safari: Global Fashion Influences",
    date: "21 Feb 2025",
  },
  {
    image: IMAGES.BlogGridPic5,
    time: "1.4",
    name: "Fashion & Beauty Fusion: The Ultimate Style Guide",
    date: "25 Feb 2025",
  },
];

//Footer data start

export const WidgetData = [
  { name: "Customer Care", link: "/faqs-2" },
  { name: "Shipping", link: "/faqs-2?tab=Shipping" },
  { name: "Orders & Payments", link: "/faqs-2?tab=Payments" },
  { name: "Returns", link: "/faqs-2?tab=Returns" },
  { name: "FAQ", link: "/faqs-2" },
];

export const Company = [
  { name: "About Us", link: "/about-me" },
  { name: "Careers", link: "/career-1" },
  { name: "Contact Us", link: "/contact-us-1" },
  { name: "Editorial", link: "/editorial-1" },
];

export const FooterMenu = [
  {
    name: "New in Clothing",
    link: "/collections?category=New%20in%20Clothing",
  },
  { name: "Men", link: "/collections?category=Men" },
  { name: "Women", link: "/collections?category=Women" },
  { name: "Shirts", link: "/collections?category=Shirts" },
  { name: "Jeans", link: "/collections?category=Jeans" },
];

export const OurStores = [
  { name: "New York" },
  { name: "London SF" },
  { name: "Edinburgh" },
  { name: "Los Angeles" },
  { name: "Chicago" },
  { name: "Las Vegas" },
];
//Footer data end

//Abou Me comapanty logo
export const Aboutcompanylogodata = [
  { image: IMAGES.CompanyPngLogo1, duration: 0.6 },
  { image: IMAGES.CompanyPngLogo2, duration: 0.8 },
  { image: IMAGES.CompanyPngLogo3, duration: 1 },
  { image: IMAGES.CompanyPngLogo4, duration: 1.2 },
  { image: IMAGES.CompanyPngLogo5, duration: 1.3 },
  { image: IMAGES.CompanyPngLogo6, duration: 1.4 },
  { image: IMAGES.CompanyPngLogo7, duration: 1.6 },
  { image: IMAGES.CompanyPngLogo8, duration: 1.8 },
];

export const voucherBlogData = [
  { image: IMAGES.voucherpic1, name: "The perfect gift for any occasion" },
  { image: IMAGES.voucherpic2, name: "Delight Someone with a Gift Voucher" },
  { image: IMAGES.voucherpic3, name: "Let Them Choose Their Perfect Gift" },
  { image: IMAGES.voucherpic4, name: "Experience the Ultimate Gift" },
  { image: IMAGES.voucherpic5, name: "Share the Joy with a Gift Voucher" },
  { image: IMAGES.voucherpic6, name: "Gift a Voucher and Make Their Day" },
];

type CountryItem = {
  imgSrc: string;
  country: string;
  amount: string;
  className?: string;
};

export const countries: CountryItem[] = [
  {
    imgSrc: IMAGES.CountryPic1,
    country: "United States",
    amount: "$130.00",
  },
  {
    imgSrc: IMAGES.CountryPic2,
    country: "India",
    amount: "$110.00",
  },
  {
    imgSrc: IMAGES.CountryPic3,
    country: "Africa",
    amount: "$90.00",
  },
  {
    imgSrc: IMAGES.CountryPic4,
    country: "Canada",
    amount: "$75.00",
  },
  {
    imgSrc: IMAGES.CountryPic5,
    country: "Brazil",
    amount: "$60.00",
  },
  {
    imgSrc: IMAGES.CountryPic6,
    country: "Jordan",
    amount: "$50.00",
    className: "border-bottom-0", // Optional
  },
];

type OrderRow = {
  id: string;
  date: string;
  amount: string;
  status: {
    label: string;
    badgeClass: string;
  };
  viewLink: string;
};

export const AccoountOrdersTable: OrderRow[] = [
  {
    id: "#34VB5540K83",
    date: "Jan 21, 2025",
    amount: "$358.75",
    status: { label: "In Progress", badgeClass: "bg-info" },
    viewLink: "/account-order-details",
  },
  {
    id: "#78A643CD409",
    date: "Feb 09, 2025",
    amount: "$760.50",
    status: { label: "Canceled", badgeClass: "bg-danger" },
    viewLink: "/account-order-details",
  },
  {
    id: "#112P45A90V2",
    date: "Jan 15, 2025",
    amount: "$1,264.00",
    status: { label: "Delayed", badgeClass: "bg-warning" },
    viewLink: "/account-order-details",
  },
  {
    id: "#28BA67U0981",
    date: "Jan 19, 2025",
    amount: "$198.35",
    status: { label: "Delivered", badgeClass: "bg-success" },
    viewLink: "/account-order-details",
  },
  {
    id: "#502TR872W2",
    date: "Jan 04, 2025",
    amount: "$2,133.90",
    status: { label: "Delivered", badgeClass: "bg-success" },
    viewLink: "/account-order-details",
  },
  {
    id: "#47H76G09F33",
    date: "Jan 30, 2025",
    amount: "$86.40",
    status: { label: "Delivered", badgeClass: "bg-success" },
    viewLink: "/account-order-details",
  },
  {
    id: "#53U76G09E38",
    date: "Jan 21, 2025",
    amount: "$86.40",
    status: { label: "Delivered", badgeClass: "bg-success" },
    viewLink: "/account-order-details",
  },
  {
    id: "#31M76G09G76",
    date: "Jan 07, 2025",
    amount: "$112.40",
    status: { label: "Delivered", badgeClass: "bg-success" },
    viewLink: "/account-order-details",
  },
];

interface Product {
  id: number;
  name: string;
  image: string;
  url: string;
}

export const AccountProducts: Product[] = [
  {
    id: 1,
    name: "Collar Casual Shirt",
    image: IMAGES.ShopSmallPic1,
    url: "/product-default",
  },
  {
    id: 2,
    name: "Collar Tranding Shirt",
    image: IMAGES.ShopSmallPic2,
    url: "/product-default",
  },
  {
    id: 3,
    name: "Casual Full Shirt",
    image: IMAGES.ShopSmallPic1,
    url: "/product-default",
  },
  {
    id: 4,
    name: "Tranding Full Shirt",
    image: IMAGES.ShopSmallPic2,
    url: "/product-default",
  },
];

interface orderRequest {
  requestno: string;
  image: string;
  name: string;
  price: string;
  status: string;
}

export const ReturnReqData: orderRequest[] = [
  {
    requestno: "#1374845",
    image: IMAGES.ShopSmallPic1,
    name: "Collar Casual Shirt",
    price: "$105",
    status: "Return Made",
  },
  {
    requestno: "#2374237",
    image: IMAGES.ShopSmallPic2,
    name: "Collar Casual Shirt",
    price: "$304",
    status: "Request Submited",
  },
  {
    requestno: "#4374528",
    image: IMAGES.ShopSmallPic1,
    name: "Classic Denim Skinny Shirt",
    price: "$657",
    status: "Request Submited",
  },
  {
    requestno: "#5374619",
    image: IMAGES.ShopSmallPic2,
    name: "Classic Denim Skinny Shirt",
    price: "$245",
    status: "Request Submited",
  },
];

// Account Review
interface reviewblog {
  id: number;
  image: string;
  name: string;
}

export const ReviewBlogData: reviewblog[] = [
  { id: 1, image: IMAGES.TeamProfile1, name: "Michel Poe" },
  { id: 2, image: IMAGES.TeamProfile2, name: "Celesto Anderson" },
  { id: 3, image: IMAGES.TeamProfile3, name: "Monsur Rahman Lito" },
  { id: 4, image: IMAGES.TeamProfile4, name: "Johan Doe" },
  { id: 5, image: IMAGES.TeamProfile1, name: "Michel Poe" },
  { id: 6, image: IMAGES.TeamProfile2, name: "Celesto Anderson" },
  { id: 7, image: IMAGES.TeamProfile3, name: "Monsur Rahman Lito" },
  { id: 8, image: IMAGES.TeamProfile4, name: "Johan Doe" },
];

interface modalCategoryType {
  name: string;
}

export const modalCategoryBlog: modalCategoryType[] = [
  { name: "Dresses," },
  { name: "Jeans," },
  { name: "Swimwear," },
  { name: "Summer," },
  { name: "Clothing" },
];

interface modalCategory2Type {
  name: string;
}

export const modalCategoryBlog2: modalCategory2Type[] = [
  { name: "Casual" },
  { name: "Athletic," },
  { name: "Workwear," },
  { name: "Accessories" },
];

interface BlogPostType {
  image: string;
  name: string;
  date: string;
  coloumStyle: string;
}
export const BlogPostData: BlogPostType[] = [
  {
    coloumStyle: "card-1",
    image: IMAGES.BlogPostPic1,
    name: "Trendsetter Chronicles: Unveiling the Latest in Fashion",
    date: "20 January 2025",
  },
  {
    coloumStyle: "card-2",
    image: IMAGES.BlogPostPic2,
    name: "Runway Rundown: Decoding Fashion Week’s Best Looks",
    date: "21 January 2025",
  },
  {
    coloumStyle: "card-3",
    image: IMAGES.BlogPostPic3,
    name: "loset Confidential: Behind-the-Scenes of a Fashionista",
    date: "22 January 2025",
  },
  {
    coloumStyle: "card-4",
    image: IMAGES.BlogPostPic4,
    name: "DIY Couture: Crafting Your Own Fashion Masterpieces",
    date: "24 January 2025",
  },
];

interface FeatureBoxtype {
  image: string;
}

export const FeatureBoxBlog: FeatureBoxtype[] = [
  { image: IMAGES.FeaturePng1 },
  { image: IMAGES.FeaturePng2 },
  { image: IMAGES.FeaturePng3 },
  { image: IMAGES.FeaturePng4 },
  { image: IMAGES.FeaturePng5 },
  { image: IMAGES.FeaturePng6 },
];

export function CopyText() {
  let changeText: HTMLElement | null = document.getElementById("copyButton");
  navigator.clipboard.writeText(FooterStyleCode7);
  changeText!.textContent = `Copied`;
  changeText?.classList.add("active");
}

interface PortfolioTilestype {
  image: string;
  category: string;
}
export const PortfolioTilesData: PortfolioTilestype[] = [
  { image: IMAGES.Portfolio1Pic1, category: "Dresses" },
  { image: IMAGES.Portfolio1Pic2, category: "Outerwear" },
  { image: IMAGES.Portfolio1Pic5, category: "Outerwear" },
  { image: IMAGES.Portfolio1Pic3, category: "Dresses" },
  { image: IMAGES.Portfolio1Pic4, category: "Jacket" },
  { image: IMAGES.Portfolio1Pic5, category: "Jacket" },
  { image: IMAGES.Portfolio1Pic5, category: "Formal wear" },
  { image: IMAGES.Portfolio1Pic2, category: "Formal wear" },
  { image: IMAGES.Portfolio1Pic4, category: "Tops" },
  { image: IMAGES.Portfolio1Pic6, category: "Tops" },
];
interface tabListtype {
  name: string;
  filter?: string;
}
export const tabList: tabListtype[] = [
  { name: "All", filter: "*" },
  { name: "Dresses", filter: ".Dresses" },
  { name: "Tops", filter: ".Outerwear" },
  { name: "Outerwear", filter: ".Jacket" },
  { name: "Jacket", filter: ".Formal-wear" },
  { name: "Formal wear", filter: ".Tops" },
];

export const FooterStyleCode1 = `<footer className="site-footer style-1 bg-light">
 <div className="footer-top">
    <div className="container">
        <div className="row">
            <div className="col-xl-3 col-md-4 col-sm-6">
                <div className="widget widget_about me-2">
                    <div className="footer-logo logo-white">
                        <Link to={"/"}><Image src={IMAGES.logo} alt="" /></Link> 
                    </div>
                    <ul className="widget-address">
                        <li>
                            <p><span>Address</span> : 451 Wall Street, UK, London</p>
                        </li>
                        <li>
                            <p><span>E-mail</span> : example@info.com</p>
                        </li>
                        <li>
                            <p><span>Phone</span> : (064) 332-1233</p>
                        </li>
                    </ul>
                    <div className="subscribe_widget">
                        <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                        <form className="dzSubscribe style-1" action="script/mailchamp.php" method="post">
                            <div className="dzSubscribeMsg"></div>
                            <div className="form-group">
                                <div className="input-group mb-0">
                                    <input name="dzEmail" required type="email" className="form-control" placeholder="Your Email Address" />
                                    <div className="input-group-addon">
                                        <button name="submit" value="Submit" type="submit" className="btn">
                                            <i className="icon feather icon-arrow-right" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
                <div className="widget widget_post">
                    <h5 className="footer-title">Recent Posts</h5>
                    <ul>
                        {WidgetData.map((item, ind)=>(
                            <li key={ind}>
                                <div className="dz-media"><Image src={item.image} alt="" /></div>
                                <div className="dz-content">
                                    <h6 className="name"><Link to="/post-standard">{item.name}</Link></h6>
                                    <span className="time">April 23, 2024</span>
                                </div>
                            </li>
                        ))}                                    
                    </ul>
                </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-4 col-6" >
                <div className="widget widget_services">
                    <h5 className="footer-title">Our Stores</h5>
                    <ul>
                        {OurStores.map((item,ind)=>(
                            <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                        ))}                                    
                    </ul>   
                </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                <div className="widget widget_services">
                    <h5 className="footer-title">Useful Links</h5>
                    <ul>
                        {UsefulLinks.map((item, i)=>(
                            <li key={i}><Link to="#">{item.name}</Link></li>
                        ))}                                    
                    </ul>
                </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-4">
                <div className="widget widget_services">
                    <h5 className="footer-title">Footer Menu</h5>
                    <ul>
                        {FooterMenu.map((item,ind)=>(
                            <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                        ))}                                    
                    </ul>
                </div>
            </motion.div>
        </div>
    </div>
</div>
{/*  Footer Top End  */}

{/*  Footer Bottom  */}
<div className="footer-bottom">
    <div className="container">
        <div className="row fb-inner">
            <div className="col-lg-6 col-md-12 text-start"> 
                <p className="copyright-text">© <span className="current-year">{year}</span> <a href="https://www.dexignzone.com/">DexignZone</a> Theme. All Rights Reserved.</p>
            </div>
            <div className="col-lg-6 col-md-12 text-end"> 
                <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                    <span className="me-3">We Accept: </span>
                    <Image src={IMAGES.FooterImg} alt="" />
                </div>
            </div>
        </div>
    </div>
 </div>
</footer>`;

export const FooterStyleCode2 = `<footer className="site-footer footer-dark">
 <div className="footer-top">
        <div className="container">
            <div className="row">
                <div className="col-xl-3 col-md-4 col-sm-6">
                    <div className="widget widget_about me-2">
                        <div className="footer-logo logo-white">
                            <Link to={"/"}><Image src={IMAGES.LogoWhite} alt="" /></Link> 
                        </div>
                        <ul className="widget-address">
                            <li>
                                <p><span>Address</span> : 451 Wall Street, UK, London</p>
                            </li>
                            <li>
                                <p><span>E-mail</span> : example@info.com</p>
                            </li>
                            <li>
                                <p><span>Phone</span> : (064) 332-1233</p>
                            </li>
                        </ul>
                        <div className="subscribe_widget">
                            <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                            <form className="dzSubscribe style-1" action="script/mailchamp.php" method="post">
                                <div className="dzSubscribeMsg"></div>
                                <div className="form-group">
                                    <div className="input-group mb-0">
                                        <input name="dzEmail" required type="email" className="form-control" placeholder="Your Email Address" />
                                        <div className="input-group-addon">
                                            <button name="submit" value="Submit" type="submit" className="btn">
                                                <i className="icon feather icon-arrow-right" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6">
                    <div className="widget widget_post">
                        <h5 className="footer-title">Recent Posts</h5>
                        <ul>
                            {WidgetData.map((item, ind)=>(
                                <li key={ind}>
                                    <div className="dz-media"><Image src={item.image} alt="" /></div>
                                    <div className="dz-content">
                                        <h6 className="name"><Link to="/post-standard">{item.name}</Link></h6>
                                        <span className="time">April 23, 2024</span>
                                    </div>
                                </li>
                            ))}                                    
                        </ul>
                    </div>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-6" >
                    <div className="widget widget_services">
                        <h5 className="footer-title">Our Stores</h5>
                        <ul>
                            {OurStores.map((item,ind)=>(
                                <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                            ))}                                    
                        </ul>   
                    </div>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                    <div className="widget widget_services">
                        <h5 className="footer-title">Useful Links</h5>
                        <ul>
                            {UsefulLinks.map((item, i)=>(
                                <li key={i}><Link to="#">{item.name}</Link></li>
                            ))}                                    
                        </ul>
                    </div>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4">
                    <div className="widget widget_services">
                        <h5 className="footer-title">Footer Menu</h5>
                        <ul>
                            {FooterMenu.map((item,ind)=>(
                                <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                            ))}                                    
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/*  Footer Top End  */}

    {/*  Footer Bottom  */}
    <div className="footer-bottom">
        <div className="container">
            <div className="row fb-inner">
                <div className="col-lg-6 col-md-12 text-start"> 
                    <p className="copyright-text">© <span className="current-year">{year}</span> <a href="https://www.dexignzone.com/">DexignZone</a> Theme. All Rights Reserved.</p>
                </div>
                <div className="col-lg-6 col-md-12 text-end"> 
                    <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                        <span className="me-3">We Accept: </span>
                        <Image src={IMAGES.FooterImg} alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
 </footer>`;
export const FooterStyleCode3 = `
<footer className="site-footer footer-dark style-3">		
    <div className="container">
        <div className="row">
            <div className="col-md-4 col-lg-4 col-md-12 px-0">
                <div className="row dz-post g-0 spno">
                    {footerImage.map((elem, index)=>(
                        <div className="col-lg-6 col-6" key={index}>
                            <div className="dz-post-media">
                                <Image src={elem.image} alt="" />
                            </div>
                        </div>
                    ))}                                    
                    <Link to={"#"} className="instagram-link">
                        <div className="follow-link bg-white wow bounceIn" data-wow-delay="0.1s">
                            <div className="follow-link-icon">
                                <Image src={IMAGES.InstaFollow} alt="follow" />
                            </div>
                            <div className="follow-link-content">
                                <h4>Share with #Pixio</h4>
                                <p>Follow @Pixio for inspiration.</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="col-md-8 col-lg-8 col-md-12">
                <div className="footer-top">
                    <div className="dz-custom-container">
                        <div className="row align-items-center logo-topbar gx-0 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="col-12 col-sm-6">
                                <div className="footer-logo logo-white mb-0">
                                    <Link to="/"><Image src={IMAGES.LogoWhiteSvg} alt=""/></Link> 
                                </div>	
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="dz-social-icon style-1">
                                    <ul>                                                        
                                        <SocialIcon />
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.2s">
                                <div className="widget widget_services">
                                    <h5 className="footer-title">Our Stores</h5>
                                    <ul>
                                        {OurStores.map((item,ind)=>(
                                            <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                                        ))}                                                                                                                                                    
                                    </ul>   
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.3s">
                                <div className="widget widget_services">
                                    <h5 className="footer-title">Useful Links</h5>
                                    <ul>
                                        {UsefulLinks.map((item, i)=>(
                                            <li key={i}><Link to="#">{item.name}</Link></li>
                                        ))} 
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4 col-12 wow fadeInUp" data-wow-delay="0.4s">
                                <div className="widget widget_services">
                                    <h5 className="footer-title">Footer Menu</h5>
                                    <ul>
                                        {FooterMenu.map((item,ind)=>(
                                            <li key={ind}><Link to="#">{item.name}</Link></li>
                                        ))}
                                    </ul>                                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Footer Bottom --> */}
                <div className="footer-bottom wow fadeInUp" data-wow-delay="0.5s">
                    <div className="fb-inner">
                        <div className="text-center"> 
                            <p className="copyright-text">© <span className="current-year">{det.getFullYear()}</span> 
                                <Link to="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
                {/* <!-- Footer Bottom End --> */}
            </div>
        </div>
    </div>
</footer>    
`;

export const FooterStyleCode4 = `
<footer className="site-footer style-1 footer-dark overlay-black-middle" 
        style={{backgroundImage:\`url('${IMAGES.BackBg1.src}')\`, backgroundAttachment:'fixed', backgroundSize:'cover' }}
    >                    
        <div className="footer-top">
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-md-4 col-sm-6">
                        <div className="widget widget_about me-2">
                            <div className="footer-logo logo-white">
                                <Link to={"/"}><Image src={IMAGES.LogoWhite} alt="logo" /></Link> 
                            </div>
                            <ul className="widget-address">
                                <li>
                                    <p><span>Address</span> : 451 Wall Street, UK, London</p>
                                </li>
                                <li>
                                    <p><span>E-mail</span> : example@info.com</p>
                                </li>
                                <li>
                                    <p><span>Phone</span> : (064) 332-1233</p>
                                </li>
                            </ul>
                            <div className="subscribe_widget">
                                <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                                <form className="dzSubscribe style-1">
                                    <div className="dzSubscribeMsg"></div>
                                    <div className="form-group">
                                        <div className="input-group mb-0">
                                            <input name="dzEmail" required type="email" className="form-control" placeholder="Your Email Address" />
                                            <div className="input-group-addon">
                                                <button name="submit" value="Submit" type="submit" className="btn">
                                                    <i className="icon feather icon-arrow-right" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-4 col-sm-6">
                        <div className="widget widget_post">
                            <h5 className="footer-title">Recent Posts</h5>
                            <ul>
                                {WidgetData.map((item, ind)=>(
                                    <li key={ind}>
                                        <div className="dz-media"><Image src={item.image} alt="" /></div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link to="/post-standard">{item.name}</Link></h6>
                                            <span className="time">April 23, 2024</span>
                                        </div>
                                    </li>
                                ))}                                    
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-6" >
                        <div className="widget widget_services">
                            <h5 className="footer-title">Our Stores</h5>
                            <ul>
                                {OurStores.map((item,ind)=>(
                                    <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                                ))}                                    
                            </ul>   
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                        <div className="widget widget_services">
                            <h5 className="footer-title">Useful Links</h5>
                            <ul>
                                {UsefulLinks.map((item, i)=>(
                                    <li key={i}><Link to="#">{item.name}</Link></li>
                                ))}                                    
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-4 col-sm-4">
                        <div className="widget widget_services">
                            <h5 className="footer-title">Footer Menu</h5>
                            <ul>
                                {FooterMenu.map((item,ind)=>(
                                    <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                                ))}                                    
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*  Footer Top End  */}

        {/*  Footer Bottom  */}
        <div className="footer-bottom">
            <div className="container">
                <div className="row fb-inner">
                    <div className="col-lg-6 col-md-12 text-start"> 
                        <p className="copyright-text">© <span className="current-year">{year}</span> <a href="https://www.dexignzone.com/">DexignZone</a> Theme. All Rights Reserved.</p>
                    </div>
                    <div className="col-lg-6 col-md-12 text-end"> 
                        <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                            <span className="me-3">We Accept: </span>
                            <Image src={IMAGES.FooterImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;

export const FooterStyleCode5 = `<footer className="site-footer footer-dark">
        <div className="footer-top">
            <div className="container">                            
                <div className="row">
                    <div className="col-md-6">
                        <div className="widget widget_about me-2">
                            <div className="footer-logo logo-white">
                                <a href="index.html"><Image src={IMAGES.LogoWhiteSvg} alt="logo" /></a> 
                            </div>
                            <ul className="widget-address nav-inline">
                                <li>
                                    <p><span>E-mail</span> : example@info.com</p>
                                </li>
                                <li>
                                    <p><span>Phone</span> : (064) 332-1233</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="widget widget_services text-lg-end">
                            <ul className="nav-inline mb-3">
                                <li><Link to="/about-us">About Us</Link></li>
                                <li><Link to="/blog-dark-2-column-sidebar">Latest News</Link></li>
                                <li><Link to="/faqs-2">Help Desk</Link></li>
                                <li><Link to="/contact-us-1">Contact Us</Link></li>
                            </ul>
                            <ul className="nav-inline">
                                <SocialIcon />                                            
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>                    
        <div className="footer-bottom">
            <div className="container">
                <div className="row fb-inner">
                    <div className="col-lg-6 col-md-12 text-start"> 
                        <p className="copyright-text">© <span className="current-year">{year}</span> 
                            <Link to="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                        </p>
                    </div>
                    <div className="col-lg-6 col-md-12 text-end"> 
                        <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-lg-end">
                            <span className="me-3">We Accept: </span>
                            <Image src={IMAGES.FooterImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </footer>`;

export const FooterStyleCode6 = `<footer className="site-footer footer-map footer-dark">
    <div className="container">
        <div className="row">
            <div className="col-md-4 col-lg-4 col-sm-12 px-0">
                <div className="map-iframe map">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970649679!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C+Rajasthan!5e0!3m2!1sen!2sin!4v1500819483219" 
                        style={{border:'0', width:"100%", minHeight:"100%", marginBottom: "-8px"}} allowFullScreen>                                        
                    </iframe>
                </div>
            </div>
            <div className="col-md-8 col-lg-8 col-sm-12">
                
                <div className="footer-top m-t30">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="widget widget_about">
                                <div className="footer-logo logo-white">
                                    <Link to="/"><Image src={IMAGES.LogoWhiteSvg} alt="logo" /></Link>
                                </div>
                                <ul className="widget-address">
                                    <li>
                                        <p><span>Address</span> : 451 Wall Street, UK, London</p>
                                    </li>
                                    <li>
                                        <p><span>E-mail</span> : example@info.com</p>
                                    </li>
                                    <li>
                                        <p><span>Phone</span> : (064) 332-1233</p>
                                    </li>
                                </ul>
                                <div className="subscribe_widget">
                                    <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                                    <form className="dzSubscribe style-1">
                                        <div className="dzSubscribeMsg"></div>
                                        <div className="form-group">
                                            <div className="input-group mb-0">
                                                <input name="dzEmail" required type="email" className="form-control" placeholder="Your Email Address" />
                                                <div className="input-group-addon">
                                                    <button name="submit" value="Submit" type="submit" className="btn">
                                                        <i className="icon feather icon-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-6">
                            <div className="widget widget_services">
                                <h5 className="footer-title">Useful Links</h5>
                                <ul>
                                    {UsefulLinks.map((item, i)=>(
                                        <li key={i}><Link to="#">{item.name}</Link></li>
                                    ))} 
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-6">
                            <div className="widget widget_services">
                                <h5 className="footer-title">Footer Menu</h5>
                                <ul>
                                    {FooterMenu.map((item,ind)=>(
                                        <li key={ind}><Link to={"#"}>{item.name}</Link></li>
                                    ))}  
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="fb-inner">
                        <div className="text-start"> 
                            <p className="copyright-text">© <span>{year}</span> 
                                <Link to="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>`;

export const FooterStyleCode7 = `
<footer className="site-footer  footer-dark">
 {/* <!-- Footer Top --> */}
  <div className="footer-top">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="widget widget_about me-2 text-center">
                        <div className="footer-logo logo-white">
                            <Link to="/"><Image src={IMAGES.LogoWhiteSvg} alt="logo"/></Link> 
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="widget widget_services text-center">
                        <ul className="nav-inline mb-3 text">
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/blog-dark-2-column-sidebar">Latest News</Link></li>
                            <li><Link to="/faqs-2">Help Desk</Link></li>
                            <li><Link to="/contact-us-1">Contact Us</Link></li>
                        </ul>
                        <ul className="nav-inline">
                            <li><Link to={"#"} target="_blank" className="site-button-link facebook hover"><i className="fab fa-facebook-f"/></Link></li>
                            <li><Link to={"#"} target="_blank" className="site-button-link google-plus hover"><i className="fab fa-google-plus-g"/></Link></li>
                            <li><Link to={"#"} target="_blank" className="site-button-link linkedin hover"><i className="fab fa-linkedin-in"/></Link></li>
                            <li><Link to={"#"} target="_blank" className="site-button-link instagram hover"><i className="fab fa-instagram"/></Link></li>
                            <li><Link to={"#"} target="_blank" className="site-button-link twitter hover"><i className="fab fa-twitter"/></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Footer Top End --> */}                    
    {/* <!-- Footer Bottom --> */}
    <div className="footer-bottom">
        <div className="container">
            <div className="row fb-inner">
                <div className="col-lg-6 col-md-12 text-start"> 
                    <p className="copyright-text">© <span>{year}</span> <Link to="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.</p>
                </div>
                <div className="col-lg-6 col-md-12 text-end"> 
                    <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-lg-end">
                        <span className="me-3">We Accept: </span>
                        <Image src={IMAGES.FooterImg} alt="cards" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Footer Bottom End --> */}                    
</footer>
`;

interface CategoryType {
  name?: string;
  number?: number;
  tagname?: string;
}
export const CategoryData: CategoryType[] = [
  { name: "Dresses", number: 10 },
  { name: "Top & Blouses", number: 5 },
  { name: "Boots", number: 17 },
  { name: "Jewelry", number: 13 },
  // { name: "Makeup", number: 11 },
  { name: "Fragrances", number: 17 },
  // { name: "Shaving & Grooming", number: 13 },
  { name: "Jacket", number: 12 },
  { name: "Coat", number: 22 },
];
export const TagData: CategoryType[] = [
  { tagname: "Vintage" },
  { tagname: "Wedding" },
  { tagname: "Cotton" },
  { tagname: "Linen" },
  { tagname: "Navy" },
  { tagname: "Urban" },
  { tagname: "Business Meeting" },
  { tagname: "Formal" },
];

export const widgetBox = [
  {
    image: IMAGES.RecentBlog1,
    title: "The Anatomy of an Effective Shopping Cart Page",
    date: "17 May 2025",
  },
  {
    image: IMAGES.RecentBlog2,
    title: "Shopping Cart Design User-Friendly Tips and Best Practices",
    date: "20 May 2025",
  },
  {
    image: IMAGES.RecentBlog3,
    title: "Shopping Cart Security Keeping Your Customers' Data Safe",
    date: "22 May 2025",
  },
];

export const colorData = [
  { valuecolor: "black", inputid: "radioNoLabel01" },
  { valuecolor: "blue", inputid: "radioNoLabel02" },
  { valuecolor: "#21B290", inputid: "radioNoLabel03" },
  { valuecolor: "#FEC4C4", inputid: "radioNoLabel04" },
  { valuecolor: "#FF7354", inputid: "radioNoLabel05" },
  // { valuecolor: "#51EDC8", inputid: "radioNoLabel06" },
  // { valuecolor: "#B77CF3", inputid: "radioNoLabel07" },
  // { valuecolor: "#FF4A76", inputid: "radioNoLabel08" },
  // { valuecolor: "#3E68FF", inputid: "radioNoLabel09" },
  // { valuecolor: "#7BEF68", inputid: "radioNoLabel10" },
];

export const widgetSize = [
  { inputid: "btnradio101", number: 8 },
  { inputid: "btnradiol02", number: 10 },
  { inputid: "btnradiol03", number: 14 },
  { inputid: "btnradiol04", number: 16 },
  // { inputid: "btnradiol05", number: 12 },
  // { inputid: "btnradiol06", number: 14 },
  // { inputid: "btnradiol07", number: 16 },
  // { inputid: "btnradiol08", number: 18 },
  // { inputid: "btnradiol09", number: 20 },
];

interface BlogGridType {
  dealy: string;
  image: string;
  date: string;
  text: string;
}

export const BlogGridData: BlogGridType[] = [
  {
    dealy: "0.1s",
    image: IMAGES.BlogPost5Pic1,
    date: "15 May, 2025",
    text: "Trendsetter Chronicles: Unveiling the Latest in Fashion",
  },
  {
    dealy: "0.2s",
    image: IMAGES.BlogPost5Pic2,
    date: "16 May, 2025",
    text: "Runway Rundown: Decoding Fashion Week’s Best Looks",
  },
  {
    dealy: "0.3s",
    image: IMAGES.BlogPost5Pic3,
    date: "17 May, 2025",
    text: "Closet Confidential: Behind-the-Scenes of a Fashionista",
  },
  {
    dealy: "0.4s",
    image: IMAGES.BlogPost5Pic4,
    date: "20 May, 2025",
    text: "Fashion Forward: Spotlight on Emerging Designers",
  },
  {
    dealy: "0.5s",
    image: IMAGES.BlogPost5Pic5,
    date: "21 May, 2025",
    text: "DIY Couture: Crafting Your Own Fashion Masterpieces",
  },
  {
    dealy: "0.6s",
    image: IMAGES.BlogPost5Pic6,
    date: "22 May, 2025",
    text: "Fashion Fails and Fixes: Learn from Style Mistakes",
  },
];

interface Bloglight2Type {
  dealy: string;
  image: string;
  date: string;
  text: string;
}

export const Bloglight2: Bloglight2Type[] = [
  {
    dealy: "0.1s",
    image: IMAGES.BlogPostPic1,
    date: "25 May, 2025",
    text: "Trendsetter Chronicles: Unveiling the Latest in Fashion",
  },
  {
    dealy: "0.2s",
    image: IMAGES.BlogPostPic2,
    date: "30 May, 2025",
    text: "Chic & Unique: Personalized Fashion Finds",
  },
  {
    dealy: "0.3s",
    image: IMAGES.BlogPostPic3,
    date: "17 May, 2025",
    text: "Runway Rundown: Decoding Fashion Week’s Best Looks",
  },
  {
    dealy: "0.4s",
    image: IMAGES.BlogPostPic4,
    date: "21 May, 2025",
    text: "Closet Confidential: Behind-the-Scenes of a Fashionista",
  },
  {
    dealy: "0.5s",
    image: IMAGES.BlogPostPic5,
    date: "25 May, 2025",
    text: "Dress to Impress: Elevate Your Everyday Style",
  },
  {
    dealy: "0.6s",
    image: IMAGES.BlogPostPic6,
    date: "28 May, 2025",
    text: "Fashion Forward: Spotlight on Emerging Designers",
  },
];

interface shopStyletype {
  image: string;
  _id: string;
  category: string;
  name: string;
  priceValue?: string;
  inputtype?: string;
}

export const shopStyleData: shopStyletype[] = [
  {
    image: IMAGES.shopproduct1,
    inputtype: "favoriteCheck1",
    priceValue: "$80.00",
    name: "Sophisticated Swagger Suit",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct2,
    inputtype: "favoriteCheck2",
    priceValue: "$94.00",
    name: "Checkered Slim Collar Casual Shirt",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct3,
    inputtype: "favoriteCheck3",
    priceValue: "$35.00",
    name: "Solid Cut Away Collar Casual Shirt",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct4,
    inputtype: "favoriteCheck4",
    priceValue: "$45.00",
    name: "Athletic Mesh Sports Leggings",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct5,
    inputtype: "favoriteCheck5",
    priceValue: "$70.00",
    name: "Denim Overalls Shorts",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct6,
    inputtype: "favoriteCheck6",
    priceValue: "$36.00",
    name: "Plaid Wool Winter Coat",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct7,
    inputtype: "favoriteCheck7",
    priceValue: "$75.00",
    name: "Comfy Lounge Jogger Pants",
    _id: "",
    category: "",
  },
  {
    image: IMAGES.shopproduct8,
    inputtype: "favoriteCheck8",
    priceValue: "$90.00",
    name: "Water-Resistant Windbreaker Jacket",
    _id: "",
    category: "",
  },

  {
    image: IMAGES.shopproduct9,
    inputtype: "favoriteCheck9",
    priceValue: "$50.00",
    name: "Classic Denim Skinny Jeans",
    _id: "",
    category: "",
  },
];

interface ShopSlidertype {
  image: string;
  name: string;
  id: string;
}

export const ShopCatSlider: ShopSlidertype[] = [
  { image: IMAGES.shopproduct1, name: "Bliss Dress", id: "bliss-dress" },
  { image: IMAGES.shopproduct2, name: "Glam Pants", id: "glam-pants" },
  { image: IMAGES.shopproduct3, name: "Leggings", id: "leggings" },
  { image: IMAGES.shopproduct4, name: "Classic Capri", id: "classic-capri" },
  { image: IMAGES.shopproduct5, name: "Dapper Coat", id: "dapper-coat" },
  { image: IMAGES.shopproduct6, name: "Comfy Leggings", id: "comfy-leggings" },
  { image: IMAGES.shopproduct7, name: "Denim Jeans", id: "denim-jeans" },
  { image: IMAGES.shopproduct8, name: "Silk Dress", id: "silk-dress" },
];

export type ShopProductItemtype = {
  image: string;
  title: string;
  price: number;
  cutprice: string;
  quantity: number;
};
export const ShopProductItem: ShopProductItemtype[] = [
  {
    quantity: 1,
    image: IMAGES.ShopCardPic1,
    title: "Sophisticated Swagger Suit",
    price: 45,
    cutprice: "28",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic2,
    title: "Cozy Knit Cardigan Sweater",
    price: 95,
    cutprice: "56",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic3,
    title: "Athletic Mesh Sports Leggings",
    price: 56,
    cutprice: "20",
  },
];
export const ShopProductItemData: ShopProductItemtype[] = [
  {
    quantity: 1,
    image: IMAGES.ShopCardPic1,
    title: "Sophisticated Swagger Suit",
    price: 4,
    cutprice: "28",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic2,
    title: "Cozy Knit Cardigan Sweater",
    price: 9,
    cutprice: "56",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic3,
    title: "Athletic Mesh Sports Leggings",
    price: 5,
    cutprice: "20",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic4,
    title: "Plaid Wool Winter Coat",
    price: 84,
    cutprice: "42",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic5,
    title: "Satin Wrap Party Blouse",
    price: 70,
    cutprice: "35",
  },
  {
    quantity: 1,
    image: IMAGES.ShopCardPic6,
    title: "Suede Ankle Booties Collection",
    price: 76,
    cutprice: "38",
  },
];

// All header menu item
interface MenuItemOne {
  title: string;
  links: { name: string; path: string }[];
}
export const menuDataOne: MenuItemOne[] = [
  {
    title: "Shop Structure",
    links: [
      { name: "Shop With Category", path: "/shop-with-category" },
      { name: "Shop Standard", path: "/shop-standard" },
      // { name: "Shop List", path: "/shop-list" },

      // { name: "Shop Filters Top Bar", path: "/shop-filters-top-bar" },
      // { name: "Shop Sidebar", path: "/shop-sidebar" },
      // { name: "Shop Style 1", path: "/shop-style-1" },
      // { name: "Shop Style 2", path: "/shop-style-2" },
    ],
  },
  {
    title: "Product Structure",
    links: [
      { name: "Default", path: "/product-default" },
      { name: "Thumbnail", path: "/product-thumbnail" },
      { name: "Grid Media", path: "/product-grid-media" },
      { name: "Carousel", path: "/product-carousel" },
      { name: "Full Width", path: "/product-full-width" },
    ],
  },
  {
    title: "Shop Pages",
    links: [
      { name: "Wishlist", path: "/shop-wishlist" },
      { name: "Cart", path: "/shop-cart" },
      { name: "Checkout", path: "/shop-checkout" },
      { name: "Compare", path: "/shop-compare" },
      { name: "Order Tracking", path: "/shop-order-tracking" },
      { name: "Login", path: "/login" },
      { name: "Registration", path: "/registration" },
      { name: "Forget Password", path: "/forget-password" },
    ],
  },
];

// BlogM Menu items
export const menuData2 = [
  {
    mainmenu: [
      {
        title: "Blog Dark Style",
        link: "#",
        subMenu: [
          { title: "Blog 2 Column", link: "/blog-dark-2-column" },
          {
            title: "Blog 2 Column Sidebar",
            link: "/blog-dark-2-column-sidebar",
          },
          { title: "Blog 3 Column", link: "/blog-dark-3-column" },
          { title: "Blog Half Image", link: "/blog-dark-half-image" },
        ],
      },
      {
        title: "Blog Light Style",
        link: "#",
        subMenu: [
          { title: "Blog 2 Column", link: "/blog-light-2-column" },
          {
            title: "Blog 2 Column Sidebar",
            link: "/blog-light-2-column-sidebar",
          },
          { title: "Blog Half Image", link: "/blog-light-half-image" },
          { title: "Blog Exclusive", link: "/blog-exclusive" },
        ],
      },
    ],
  },
  {
    mainmenu: [
      {
        title: "Blog List Sidebar",
        link: "#",
        subMenu: [
          { title: "No Sidebar", link: "/blog-list-no-sidebar" },
          { title: "Left Sidebar", link: "/blog-list-left-sidebar" },
          { title: "Right Sidebar", link: "/blog-list-right-sidebar" },
          { title: "Both Sidebar", link: "/blog-list-both-sidebar" },
        ],
      },
      {
        title: "Blog Grid Sidebar",
        link: "#",
        subMenu: [
          { title: "No Sidebar", link: "/blog-grid-no-sidebar" },
          { title: "Left Sidebar", link: "/blog-grid-left-sidebar" },
          { title: "Right Sidebar", link: "/blog-grid-right-sidebar" },
          { title: "Both Sidebar", link: "/blog-grid-both-sidebar" },
          { title: "Wide Sidebar", link: "/blog-grid-wide-sidebar" },
        ],
      },
    ],
  },
  {
    mainmenu: [
      {
        title: "Blog Page",
        link: "#",
        subMenu: [
          { title: "Blog Archive", link: "/blog-archive" },
          { title: "Author", link: "/blog-author" },
          { title: "Blog Category", link: "/blog-category" },
          { title: "Blog Tag", link: "/blog-tag" },
        ],
      },
    ],
  },
];

// Post Type Menus
export const menuData3 = [
  {
    mainmenu: [
      {
        title: "Post Types",
        link: "#",
        subMenu: [
          { title: "Text Post", link: "/post-text" },
          { title: "Image Post", link: "/post-image" },
          { title: "Video Post", link: "/post-video" },
          { title: "Link Post", link: "/post-link" },
          { title: "Audio Post", link: "/post-audio" },
          { title: "Post Quote", link: "/post-quote" },
          { title: "Tutorial Post", link: "/post-tutorial" },
          { title: "Cateloge Post", link: "/post-cateloge" },
        ],
      },
    ],
  },
  {
    mainmenu: [
      {
        title: "Multiple Media",
        link: "#",
        subMenu: [
          { title: "Banner", link: "/post-banner" },
          { title: "Slider", link: "/post-slide-show" },
          { title: "Gallery", link: "/post-gallery" },
          { title: "Status Slider", link: "/post-status" },
        ],
      },
      {
        title: "Post Layout Type",
        link: "#",
        subMenu: [
          { title: "Standard Post", link: "/post-standard" },
          { title: "Corner Post", link: "/post-corner" },
          { title: "Side Post", link: "/post-side" },
        ],
      },
    ],
  },
  {
    mainmenu: [
      {
        title: "Side Bar",
        link: "#",
        subMenu: [
          { title: "Left Sidebar", link: "/post-left-sidebar" },
          { title: "Right Sidebar", link: "/post-right-sidebar" },
          { title: "Both Sidebar", link: "/post-both-sidebar" },
          { title: "No Sidebar", link: "/post-no-sidebar" },
        ],
      },
    ],
  },
];

export const menuData4 = [
  {
    mainMenu: [
      {
        title: "Pages",
        link: "#",
        subMenu: [
          { name: "About Us", path: "/about-us" },
          { name: "About Me", path: "/about-me" },
          { name: "Pricing Table", path: "/pricing-table" },
          { name: "Our Gift Vouchers", path: "/our-gift-vouchers" },
          { name: "What We Do", path: "/what-we-do" },
          { name: "Faqs 1", path: "/faqs-1" },
          { name: "Faqs 2", path: "/faqs-2" },
          { name: "Our Team", path: "/our-team" },
        ],
      },
    ],
  },
  {
    mainMenu: [
      {
        title: "Contact Us",
        link: "#",
        subMenu: [
          { name: "Contact Us 1", path: "/contact-us-1" },
          { name: "Contact Us 2", path: "/contact-us-2" },
          { name: "Contact Us 3", path: "/contact-us-3" },
        ],
      },
      {
        title: "Web Pages",
        link: "#",
        subMenu: [
          { name: "Error 404 1", path: "/error-1" },
          { name: "Error 404 2", path: "/error-2" },
          { name: "Coming Soon", path: "/coming-soon" },
          { name: "Under Construction", path: "/under-construction" },
        ],
      },
    ],
  },
  {
    mainMenu: [
      {
        title: "Banner Style",
        link: "#",
        subMenu: [
          { name: "Banner with BG Color", path: "/banner-with-bg-color" },
          { name: "Banner with Image", path: "/banner-with-image" },
          { name: "Banner with Video", path: "/banner-with-video" },
          { name: "Banner with Kanbern", path: "/banner-with-kanbern" },
          { name: "Banner Small", path: "/banner-small" },
          { name: "Banner Medium", path: "/banner-medium" },
          { name: "Banner Large", path: "/banner-large" },
        ],
      },
    ],
  },
  {
    mainMenu: [
      {
        title: "Header Style",
        link: "#",
        subMenu: [
          { name: "Header Style 1", path: "/header-style-1" },
          { name: "Header Style 2", path: "/header-style-2" },
          { name: "Header Style 3", path: "/header-style-3" },
          { name: "Header Style 4", path: "/header-style-4" },
          { name: "Header Style 5", path: "/header-style-5" },
          { name: "Header Style 6", path: "/header-style-6" },
          { name: "Header Style 7", path: "/header-style-7" },
          { outerlink: true },
        ],
      },
    ],
  },
  {
    mainMenu: [
      {
        title: "Footer Style",
        link: "#",
        subMenu: [
          { name: "Footer Style 1", path: "/footer-style-1" },
          { name: "Footer Style 2", path: "/footer-style-2" },
          { name: "Footer Style 3", path: "/footer-style-3" },
          { name: "Footer Style 4", path: "/footer-style-4" },
          { name: "Footer Style 5", path: "/footer-style-5" },
          { name: "Footer Style 6", path: "/footer-style-6" },
          { name: "Footer Style 7", path: "/footer-style-7" },
        ],
      },
    ],
  },
  {
    mainMenu: [
      {
        title: "Footer Style",
        link: "#",
        subMenu: [
          { name: "Dashboard", path: "/account-dashboard" },
          { name: "Orders", path: "/account-orders" },
          { name: "Orders Details", path: "/account-order-details" },
          { name: "Orders Confirmation", path: "/account-order-confirmation" },
          { name: "Downloads", path: "/account-downloads" },
          { name: "Return Request", path: "/account-return-request" },
          {
            name: "Return Request Detail",
            path: "/account-return-request-detail",
          },
          {
            name: "Return Request Confirmed",
            path: "/account-refund-requests-confirmed",
          },
        ],
      },
    ],
  },
];

// Postfolio menu item
interface portfolioMenuType {
  title: string;
  image: string;
  url: string;
}
export const portfolioMenu: portfolioMenuType[] = [
  {
    title: "Portfolio Tiles",
    url: "/portfolio-tiles",
    image: IMAGES.IconSvgHeader1,
  },
  {
    title: "Collage Style 1",
    url: "/collage-style-1",
    image: IMAGES.IconSvgHeader2,
  },
  {
    title: "Collage Style 2",
    url: "/collage-style-2",
    image: IMAGES.IconSvgHeader3,
  },
  { title: "Masonry Grid", url: "/masonry-grid", image: IMAGES.IconSvgHeader4 },
  {
    title: "Cobble Style 1",
    url: "/cobble-style-1",
    image: IMAGES.IconSvgHeader5,
  },
  {
    title: "Cobble Style 2",
    url: "/cobble-style-2",
    image: IMAGES.IconSvgHeader6,
  },
  {
    title: "Portfolio Thumbs Slider",
    url: "/portfolio-thumbs-slider",
    image: IMAGES.IconSvgHeader7,
  },
  {
    title: "Portfolio Film Strip",
    url: "/portfolio-film-strip",
    image: IMAGES.IconSvgHeader8,
  },
  {
    title: "Carousel Showcase",
    url: "/carousel-showcase",
    image: IMAGES.IconSvgHeader9,
  },
  {
    title: "Portfolio Split Slider",
    url: "/portfolio-split-slider",
    image: IMAGES.IconSvgHeader10,
  },
];

export const accountMenuItem = [
  { name: "Dashboard", url: "/account-dashboard" },
  { name: "Orders", url: "/account-orders" },
  { name: "Orders Details", url: "/account-order-details" },
  { name: "Orders Confirmation", url: "/account-order-confirmation" },
  { name: "Downloads", url: "/account-downloads" },
  { name: "Return Request", url: "/account-return-request" },
  { name: "Return Request Detail", url: "/account-return-request-detail" },
  {
    name: "Return Request Confirmed",
    url: "/account-refund-requests-confirmed",
  },
  { name: "Profile", url: "/account-profile" },
  { name: "Address", url: "/account-address" },
  { name: "Shipping methods", url: "/account-shipping-methods" },
  { name: "Payment Methods", url: "/account-payment-methods" },
  { name: "Review", url: "/account-review" },
  { name: "Billing address", url: "/account-billing-address" },
  { name: "Shipping address", url: "/account-shipping-address" },
  { name: "Cancellation Requests", url: "/account-cancellation-requests" },
];

export const TabData = () => {
  return (
    <Nav as="ul">
      <Nav.Item as="li" className="nav-item">
        <Nav.Link eventKey={"List"}>
          <svg
            width="512"
            height="512"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: SVGICON.ListSvg }}
          ></svg>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li" role="presentation">
        <Nav.Link eventKey={"Coloumn"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            width="512"
            height="512"
            dangerouslySetInnerHTML={{ __html: SVGICON.ColoumnSvg }}
          ></svg>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li" role="presentation">
        <Nav.Link eventKey={"Grid"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Capa_2"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            width="512"
            height="512"
            dangerouslySetInnerHTML={{ __html: SVGICON.GridSvg }}
          ></svg>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export const categories = [
  {
    name: "Women",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "New in Clothing", link: "/shop-list" },
          { name: "Dresses", link: "/shop-list", badge: "HOT" },
          { name: "Blazers & Co-ords", link: "/shop-list" },
          {
            name: "Cardigans",
            link: "/shop-list",
            badge: "NEW IN",
          },
          { name: "Hoodies & Sweatshirts", link: "/shop-list" },
          { name: "Jackets & Coats", link: "/shop-list" },
          { name: "Jeans", link: "/shop-list" },
          { name: "Tops & Blouses", link: "/shop-list" },
          { name: "Skirts & Shorts", link: "/shop-list" },
          { name: "Trousers & Leggings", link: "/shop-list" },
          { name: "Suits & Tailoring", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "New in Shoes", link: "/shop-list" },
          { name: "Heels", link: "/shop-list" },
          { name: "Boots & Ankle Boots", link: "/shop-list" },
          { name: "Loafers & Mules", link: "/shop-list" },
          { name: "Sneakers", link: "/shop-list" },
          { name: "Sandals & Slides", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Handbags", link: "/shop-list" },
          {
            name: "Mini Bags",
            link: "/shop-list",
            badge: "TRENDING",
          },
          { name: "Belts", link: "/shop-list" },
          { name: "Sunglasses", link: "/shop-list" },
          { name: "Hats & Caps", link: "/shop-list" },
          { name: "Scarves", link: "/shop-list" },
          { name: "Jewelry", link: "/shop-list" },
          { name: "Watches", link: "/shop-list" },
        ],
      },
      // {
      //   title: "Activewear",
      //   items: [
      //     { name: "Sports Bras", link: "/shop-list" },
      //     { name: "Leggings", link: "/shop-list" },
      //     { name: "Workout Tops", link: "/shop-list" },
      //     { name: "Track Jackets", link: "/shop-list" },
      //     { name: "Running Shoes", link: "/shop-list" },
      //     { name: "Gym Bags", link: "/shop-list" },
      //   ],
      // },
      {
        title: "Seasonal Picks",
        items: [
          { name: "Summer Dresses", link: "/shop-list" },
          { name: "Winter Coats", link: "/shop-list" },
          { name: "Rainwear", link: "/shop-list" },
          { name: "Holiday Shop", link: "/shop-list", badge: "HOT" },
          { name: "Resort Wear", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Men",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "New in Clothing", link: "/shop-list" },
          { name: "Chinos", link: "/shop-list" },
          { name: "Cardigans", link: "/shop-list", badge: "NEW IN IN" },
          { name: "Hoodies and Sweatshirts", link: "/shop-list" },
          { name: "Jackets and Coats", link: "/shop-list" },
          { name: "Jeans", link: "/shop-list" },
          { name: "Shirts", link: "/shop-list" },
          { name: "T-Shirts & Polos", link: "/shop-list" },
          { name: "Shorts", link: "/shop-list" },
          { name: "Suits & Tailoring", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "New in Shoes", link: "/shop-list" },
          { name: "Sneakers", link: "/shop-list" },
          { name: "Boots", link: "/shop-list" },
          { name: "Loafers", link: "/shop-list" },
          { name: "Sandals & Slides", link: "/shop-list" },
          { name: "Formal Shoes", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Bags & Backpacks", link: "/shop-list" },
          { name: "Belts", link: "/shop-list" },
          { name: "Sunglasses", link: "/shop-list" },
          { name: "Caps & Hats", link: "/shop-list" },
          { name: "Scarves & Gloves", link: "/shop-list" },
          { name: "Wallets", link: "/shop-list" },
          { name: "Watches", link: "/shop-list", badge: "TRENDING" },
        ],
      },
      {
        title: "Activewear",
        items: [
          { name: "Gym T-Shirts", link: "/shop-list" },
          { name: "Performance Shorts", link: "/shop-list" },
          { name: "Track Pants", link: "/shop-list" },
          { name: "Sports Jackets", link: "/shop-list" },
          { name: "Running Shoes", link: "/shop-list" },
          { name: "Sports Bags", link: "/shop-list" },
        ],
      },
      {
        title: "Seasonal Picks",
        items: [
          { name: "Summer Essentials", link: "/shop-list" },
          { name: "Winter Coats", link: "/shop-list" },
          { name: "Rain Jackets", link: "/shop-list" },
          { name: "Holiday Outfits", link: "/shop-list", badge: "HOT" },
          { name: "Resort Wear", link: "/shop-list" },
        ],
      },
    ],
  },

  {
    name: "Corporate but Chic",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "Blazers", link: "/shop-list", badge: "HOT" },
          { name: "Tailored Trousers", link: "/shop-list" },
          { name: "Pencil Skirts", link: "/shop-list" },
          { name: "Shirt Dresses", link: "/shop-list" },
          { name: "Silk Blouses", link: "/shop-list" },
          { name: "Smart Jumpsuits", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          {
            name: "Pointed Heels",
            link: "/shop-list",
            badge: "TRENDING",
          },
          { name: "Loafers", link: "/shop-list" },
          { name: "Block Heels", link: "/shop-list" },
          { name: "Ankle Boots", link: "/shop-list" },
          { name: "Chic Flats", link: "/shop-list" },
        ],
      },
      {
        title: "Outerwear",
        items: [
          { name: "Trench Coats", link: "/shop-list" },
          { name: "Tailored Coats", link: "/shop-list" },
          { name: "Structured Jackets", link: "/shop-list" },
          { name: "Cropped Blazers", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Leather Totes", link: "/shop-list", badge: "HOT" },
          { name: "Statement Belts", link: "/shop-list" },
          { name: "Minimalist Watches", link: "/shop-list" },
          { name: "Silk Scarves", link: "/shop-list" },
          { name: "Delicate Jewelry", link: "/shop-list" },
        ],
      },
      {
        title: "Workwear Essentials",
        items: [
          { name: "Classic White Shirts", link: "/shop-list" },
          { name: "Neutral Trousers", link: "/shop-list" },
          { name: "Black Dresses", link: "/shop-list" },
          { name: "Nude Pumps", link: "/shop-list" },
          { name: "Structured Handbags", link: "/shop-list" },
        ],
      },
    ],
  },

  {
    name: "Girls' Night Look",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "Bodycon Dresses", link: "/shop-list", badge: "HOT" },
          { name: "Mini Skirts", link: "/shop-list" },
          { name: "Sequin Tops", link: "/shop-list", badge: "NEW IN" },
          { name: "Leather Pants", link: "/shop-list" },
          { name: "Corset Tops", link: "/shop-list" },
          { name: "Co-ord Sets", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          {
            name: "Strappy Heels",
            link: "/shop-list",
            badge: "TRENDING",
          },
          { name: "Platform Sandals", link: "/shop-list" },
          { name: "Pointed Toe Heels", link: "/shop-list" },
          { name: "Ankle Boots", link: "/shop-list" },
        ],
      },
      {
        title: "Outerwear",
        items: [
          { name: "Faux Fur Jackets", link: "/shop-list", badge: "HOT" },
          { name: "Leather Jackets", link: "/shop-list" },
          { name: "Blazer Dresses", link: "/shop-list" },
          { name: "Chic Cropped Jackets", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Clutch Bags", link: "/shop-list", badge: "TRENDING" },
          { name: "Statement Earrings", link: "/shop-list" },
          { name: "Layered Necklaces", link: "/shop-list" },
          { name: "Bold Rings", link: "/shop-list" },
          { name: "Sparkly Hair Clips", link: "/shop-list" },
        ],
      },
      {
        title: "Party Essentials",
        items: [
          {
            name: "Little Black Dress",
            link: "/shop-list",
            badge: "ICONIC",
          },
          { name: "Metallic Dresses", link: "/shop-list" },
          { name: "High Shine Makeup", link: "/shop-list" },
          { name: "Statement Heels", link: "/shop-list" },
          { name: "Mini Shoulder Bags", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Smart Casual Staples",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "Blazers", link: "/shop-list", badge: "HOT" },
          { name: "Tailored Trousers", link: "/shop-list" },
          { name: "Polo Shirts", link: "/shop-list" },
          { name: "Oxford Shirts", link: "/shop-list" },
          { name: "Midi Skirts", link: "/shop-list" },
          { name: "Smart Jeans", link: "/shop-list", badge: "TRENDING" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "Loafers", link: "/shop-list", badge: "NEW IN" },
          { name: "Chelsea Boots", link: "/shop-list" },
          { name: "Block Heels", link: "/shop-list" },
          { name: "White Sneakers", link: "/shop-list" },
        ],
      },
      {
        title: "Outerwear",
        items: [
          { name: "Trench Coats", link: "/shop-list" },
          { name: "Light Blazers", link: "/shop-list" },
          { name: "Cardigans", link: "/shop-list" },
          { name: "Denim Jackets", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Leather Belts", link: "/shop-list" },
          { name: "Crossbody Bags", link: "/shop-list" },
          { name: "Watches", link: "/shop-list", badge: "CLASSIC" },
          { name: "Minimalist Jewelry", link: "/shop-list" },
          { name: "Silk Scarves", link: "/shop-list" },
        ],
      },
      {
        title: "Everyday Staples",
        items: [
          { name: "Neutral Tees", link: "/shop-list" },
          { name: "Slim-Fit Trousers", link: "/shop-list" },
          { name: "Breton Stripes", link: "/shop-list" },
          { name: "Chinos", link: "/shop-list" },
          { name: "Smart Knitwear", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Back to Campus",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "Hoodies & Sweatshirts", link: "/shop-list" },
          { name: "T-Shirts & Polos", link: "/shop-list" },
          { name: "Casual Shirts", link: "/shop-list" },
          { name: "Jeans & Chinos", link: "/shop-list" },
          { name: "Joggers & Track Pants", link: "/shop-list" },
          { name: "Jackets & Windbreakers", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "Sneakers", link: "/shop-list", badge: "TRENDING" },
          { name: "Casual Shoes", link: "/shop-list" },
          { name: "Slip-Ons", link: "/shop-list" },
          { name: "Boots", link: "/shop-list" },
          { name: "Sandals & Slides", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Backpacks", link: "/shop-list", badge: "HOT" },
          { name: "Laptop Bags", link: "/shop-list" },
          { name: "Caps & Hats", link: "/shop-list" },
          { name: "Watches", link: "/shop-list" },
          { name: "Wallets", link: "/shop-list" },
          { name: "Phone Accessories", link: "/shop-list" },
        ],
      },
      {
        title: "Essentials",
        items: [
          { name: "Water Bottles", link: "/shop-list" },
          { name: "Stationery", link: "/shop-list" },
          { name: "Tech Gadgets", link: "/shop-list" },
          { name: "Notebooks & Planners", link: "/shop-list" },
          { name: "Headphones & Earbuds", link: "/shop-list" },
        ],
      },
      {
        title: "Loungewear",
        items: [
          { name: "Comfy Joggers", link: "/shop-list" },
          { name: "Oversized Hoodies", link: "/shop-list" },
          { name: "Relaxed Tees", link: "/shop-list" },
          { name: "Slides", link: "/shop-list" },
          { name: "Pyjamas & Sleepwear", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Gym & Go",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Activewear",
        items: [
          { name: "Sports Bras", link: "/shop-list", badge: "HOT" },
          { name: "Leggings", link: "/shop-list" },
          { name: "Biker Shorts", link: "/shop-list", badge: "TRENDING" },
          { name: "Tank Tops", link: "/shop-list" },
          { name: "Performance Tees", link: "/shop-list" },
        ],
      },
      {
        title: "Outerwear",
        items: [
          { name: "Track Jackets", link: "/shop-list" },
          { name: "Zip-Up Hoodies", link: "/shop-list" },
          { name: "Lightweight Wind", link: "/shop-list", badge: "NEW IN" },
          { name: "Oversized Sweatshirts", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "Running Shoes", link: "/shop-list" },
          { name: "Training Sneakers", link: "/shop-list", badge: "HOT" },
          { name: "Slip-On Sneakers", link: "/shop-list" },
          { name: "Sport Sandals", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Gym Bags", link: "/shop-list", badge: "TRENDING" },
          { name: "Water Bottles", link: "/shop-list" },
          { name: "Fitness Trackers", link: "/shop-list" },
          { name: "Caps & Headbands", link: "/shop-list" },
          { name: "Sport Socks", link: "/shop-list" },
        ],
      },
      {
        title: "Athleisure Staples",
        items: [
          { name: "Joggers", link: "/shop-list" },
          { name: "Crop Hoodies", link: "/shop-list" },
          { name: "Oversized Tees", link: "/shop-list" },
          { name: "Seamless Sets", link: "/shop-list", badge: "HOT" },
          { name: "Everyday Sneakers", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Summer Looks",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          { name: "Summer Dresses", link: "/shop-list", badge: "HOT" },
          { name: "Linen Shirts", link: "/shop-list" },
          { name: "Shorts & Skirts", link: "/shop-list" },
          { name: "Crop Tops & Tanks", link: "/shop-list" },
          { name: "Kaftans & Kimonos", link: "/shop-list" },
          { name: "Lightweight Trousers", link: "/shop-list" },
        ],
      },
      {
        title: "Swimwear",
        items: [
          { name: "Bikinis", link: "/shop-list", badge: "TRENDING" },
          { name: "One-Piece Swimsuits", link: "/shop-list" },
          { name: "Swim Shorts", link: "/shop-list" },
          { name: "Cover-Ups", link: "/shop-list" },
          { name: "Beach Sets", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "Sandals", link: "/shop-list" },
          { name: "Slides", link: "/shop-list", badge: "NEW IN" },
          { name: "Espadrilles", link: "/shop-list" },
          { name: "Flip Flops", link: "/shop-list" },
          { name: "Light Sneakers", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Straw Hats", link: "/shop-list", badge: "HOT" },
          { name: "Sunglasses", link: "/shop-list" },
          { name: "Beach Bags", link: "/shop-list" },
          { name: "Light Scarves", link: "/shop-list" },
          { name: "Jewelry (Bright & Fun)", link: "/shop-list" },
        ],
      },
      {
        title: "Resort Wear",
        items: [
          { name: "Maxi Dresses", link: "/shop-list" },
          { name: "Printed Co-ords", link: "/shop-list" },
          { name: "Linen Co-ords", link: "/shop-list" },
          { name: "Holiday Party Dresses", link: "/shop-list" },
          { name: "Evening Sandals", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Travel Light",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Clothing",
        items: [
          {
            name: "Wrinkle-Free Dresses",
            link: "/shop-list",
            badge: "HOT",
          },
          { name: "Jumpsuits & Rompers", link: "/shop-list" },
          { name: "Lightweight Trousers", link: "/shop-list" },
          { name: "Breathable Tees", link: "/shop-list" },
          {
            name: "Packable Outerwear",
            link: "/shop-list",
            badge: "NEW IN",
          },
        ],
      },
      {
        title: "Footwear",
        items: [
          {
            name: "Slip-On Sneakers",
            link: "/shop-list",
            badge: "TRENDING",
          },
          { name: "Comfort Sandals", link: "/shop-list" },
          { name: "Lightweight Trainers", link: "/shop-list" },
          { name: "Foldable Flats", link: "/shop-list" },
        ],
      },
      {
        title: "Travel Essentials",
        items: [
          { name: "Carry-On Bags", link: "/shop-list", badge: "HOT" },
          { name: "Weekender Bags", link: "/shop-list" },
          { name: "Packing Cubes", link: "/shop-list" },
          { name: "Travel Wallets", link: "/shop-list" },
          { name: "Neck Pillows", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Crossbody Bags", link: "/shop-list" },
          { name: "Sunglasses", link: "/shop-list" },
          { name: "Scarves & Wraps", link: "/shop-list" },
          { name: "Hats & Caps", link: "/shop-list" },
          { name: "Compact Umbrellas", link: "/shop-list" },
        ],
      },
      {
        title: "Layering Staples",
        items: [
          { name: "Light Cardigans", link: "/shop-list" },
          { name: "Overshirts", link: "/shop-list" },
          { name: "Puffer Jackets", link: "/shop-list", badge: "NEW IN" },
          { name: "Denim Jackets", link: "/shop-list" },
          { name: "Versatile Blazers", link: "/shop-list" },
        ],
      },
    ],
  },
  {
    name: "Layered Looks",
    icon: "icon feather icon-arrow-right",
    menuIcon: "icon feather icon-chevron-right",
    subcategories: [
      {
        title: "Base Layers",
        items: [
          { name: "Turtlenecks", link: "/shop-list", badge: "TRENDING" },
          { name: "Long-Sleeve Tees", link: "/shop-list" },
          { name: "Slim Fit Tops", link: "/shop-list" },
          { name: "Camis & Tanks", link: "/shop-list" },
          { name: "Seamless Bodysuits", link: "/shop-list" },
        ],
      },
      {
        title: "Mid Layers",
        items: [
          { name: "Cardigans", link: "/shop-list" },
          { name: "Sweatshirts", link: "/shop-list" },
          { name: "Overshirts", link: "/shop-list" },
          { name: "Vests & Gilets", link: "/shop-list", badge: "HOT" },
          { name: "Lightweight Knits", link: "/shop-list" },
        ],
      },
      {
        title: "Outerwear",
        items: [
          { name: "Trench Coats", link: "/shop-list" },
          {
            name: "Denim Jackets",
            link: "/shop-list",
            badge: "TRENDING",
          },
          { name: "Blazers", link: "/shop-list" },
          { name: "Bomber Jackets", link: "/shop-list" },
          { name: "Wool Coats", link: "/shop-list" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Blanket Scarves", link: "/shop-list", badge: "NEW IN" },
          { name: "Beanies & Berets", link: "/shop-list" },
          { name: "Statement Belts", link: "/shop-list" },
          { name: "Gloves", link: "/shop-list" },
          { name: "Layered Jewelry", link: "/shop-list" },
        ],
      },
      {
        title: "Footwear",
        items: [
          { name: "Ankle Boots", link: "/shop-list", badge: "HOT" },
          { name: "Chunky Sneakers", link: "/shop-list" },
          { name: "Chelsea Boots", link: "/shop-list" },
          { name: "Knee-High Boots", link: "/shop-list" },
          { name: "Loafers", link: "/shop-list" },
        ],
      },
    ],
  },
];

// src/data/categoryData.ts
const categoryData = [
  {
    _id: "men",
    name: "Men",
    images: [
      "/assets/images/categories/men1.png",
      "/assets/images/categories/men1.png",
      "/assets/images/categories/men1.png",
    ],
  },
  {
    _id: "women",
    name: "Women",
    images: [
      "/assets/images/categories/women1.png",
      "/assets/images/categories/women1.png",
      "/assets/images/categories/women1.png",
    ],
  },
  {
    _id: "Corporate but Chic",
    name: "Corporate but Chic",
    images: [
      "/assets/images/categories/chic1.png",
      "/assets/images/categories/chic1.png",
      "/assets/images/categories/chic1.png",
    ],
  },

  {
    _id: "Girls' Night Look",
    name: "Girls' Night Look",
    images: [
      "/assets/images/categories/girl1.png",
      "/assets/images/categories/girl1.png",
      "/assets/images/categories/girl1.png",
    ],
  },

  {
    _id: "Smart Casual Staples",
    name: "Smart Casual Staples",
    images: [
      "/assets/images/categories/smart1.png",
      "/assets/images/categories/smart1.png",
      "/assets/images/categories/smart1.png",
    ],
  },

  {
    _id: "Back to Campus",
    name: "Back to Campus",
    images: [
      "/assets/images/categories/back1.png",
      "/assets/images/categories/back1.png",
      "/assets/images/categories/back1.png",
    ],
  },

  {
    _id: "Gym & Go",
    name: "Gym & Go",
    images: [
      "/assets/images/categories/gym1.png",
      "/assets/images/categories/gym1.png",
      "/assets/images/categories/gym1.png",
    ],
  },

  {
    _id: "Summer Looks",
    name: "Summer Looks",
    images: [
      "/assets/images/categories/summer1.png",
      "/assets/images/categories/summer1.png",
      "/assets/images/categories/summer2.png",
    ],
  },

  {
    _id: "Travel Light",
    name: "Travel Light",
    images: [
      "/assets/images/categories/travel1.png",
      "/assets/images/categories/travel1.png",
      "/assets/images/categories/travel1.png",
    ],
  },

  {
    _id: "Layered Looks",
    name: "Layered Looks",
    images: [
      "/assets/images/categories/layered1.png",
      "/assets/images/categories/layered1.png",
      "/assets/images/categories/layered1.png",
    ],
  },
];

export default categoryData;

const commentData = [
  {
    id: 1,
    image: "https://example.com/images/user1.jpg",
    name: "Michel Poe",
    content: "This is a sample comment.",
    replies: [
      {
        id: 2,
        image: "https://example.com/images/user2.jpg",
        name: "Celesto Anderson",
        content: "This is a reply to Michel.",
      },
    ],
  },
  {
    id: 3,
    image: "https://example.com/images/user3.jpg",
    name: "Monsur Rahman Lito",
    content: "Another top-level comment.",
  },
];
export { commentData };
