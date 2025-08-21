// import {motion} from 'framer-motion'
import IMAGES from "../constant/theme";
import { Company, FooterMenu, OurStores, 
    WidgetData 
} 
from "../constant/Alldata";
import SubscribeNewsletter from "./SubscribeNewsletter";
import Image from "next/image";
import Link from "next/link";

interface footertype{
    footerStyle? : string
}

const Footer = (props : footertype) => {
    let year = new Date().getFullYear();
    return (
        <footer className={`site-footer ${props.footerStyle || "style-1" }`}>
		{/* <!-- Footer Top --> */}
            <div className="footer-top" style={{backgroundColor: "#000"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-3 col-md-4 col-sm-6"  >
                            <div className="widget widget_about me-2">
                                <div className="footer-logo logo-white">
                                    <Link href={"/"}>
                                        {props.footerStyle === "footer-dark" ?                                        
                                            <Image src={IMAGES.logo} alt="" />
                                            :
                                            <Image style={{width: "90px"}} src={IMAGES.LogoWhite} alt="" />
                                        }

                                    </Link> 
                                </div>
                                <ul className="widget-address">
                                    {/* <li>
                                        <p><span>Address</span> : 5b college road, Lagos State</p>
                                    </li> */}
                                    <li>
                                        <p><span>E-mail</span> : noir@gmail.com</p>
                                    </li>
                                    <li>
                                        <p><span>Phone</span> : (+234) 80 234 453 3509</p>
                                    </li>
                                </ul>
                                <div className="subscribe_widget">
                                    <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                                    <SubscribeNewsletter />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-6">
                            {/* <div className="widget widget_post">
                                <h5 className="footer-title">Recent Posts</h5>
                                <ul>
                                    {WidgetData.map((item, ind)=>(
                                        <li key={ind}>
                                            <div className="dz-media">
                                                <Image src={item.image} alt="" />
                                            </div>
                                            <div className="dz-content">
                                                <h6 className="name"><Link href="/post-standard">{item.name}</Link></h6>
                                                <span className="time">Jan 23, 2025</span>
                                            </div>
                                        </li>
                                    ))}                                    
                                </ul>
                            </div> */}

                             <div className="widget widget_services" style={{marginLeft: "40px"}}>
                                <h5 className="footer-title">Customer Care</h5>
                                <ul>
                                    {WidgetData.map((item, i)=>(
                                        <li key={i}><Link style={{color: "#fff"}} href="#">{item.name}</Link></li>
                                    ))}                                    
                                </ul>
                            </div>
                        </div>
                        {/* <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                            <div className="widget widget_services">
                                <h5 className="footer-title">Our Stores</h5>
                                <ul>
                                    {OurStores.map((item,ind)=>(
                                        <li key={ind}><Link href={"#"}>{item.name}</Link></li>
                                    ))}                                    
                                </ul>   
                            </div>
                        </div> */}
                        <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                            <div className="widget widget_services">
                                <h5 className="footer-title">Company</h5>
                                <ul>
                                    {Company.map((item, i)=>(
                                        <li key={i}><Link style={{color: "#fff"}} href="#">{item.name}</Link></li>
                                    ))}                                    
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4">
                            <div className="widget widget_services">
                                <h5 className="footer-title">Categories</h5>
                                <ul>
                                    {FooterMenu.map((item,ind)=>(
                                        <li key={ind}><Link style={{color: "#fff"}} href={"/shop-with-category"}>{item.name}</Link></li>
                                    ))}                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Footer Top End  */}
            
            {/*  Footer Bottom  */}
            {/* <div className="footer-bottom">
                <div className="container">
                    <div className="row fb-inner">
                        <div className="col-lg-6 col-md-12 text-start"> 
                            <p className="copyright-text">© <span className="current-year">{year}</span> <a href="https://www.dexignzone.com/"> DexignZone</a> Theme. All Rights Reserved.</p>
                        </div>
                        <div className="col-lg-6 col-md-12 text-end"> 
                            <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                                <span className="me-3">We Accept: </span>
                                <Image src={IMAGES.FooterImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/*  Footer Bottom End  */}
        </footer>
    );
};

export default Footer;