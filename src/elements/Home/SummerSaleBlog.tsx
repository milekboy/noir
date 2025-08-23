import Link from "next/link";
import IMAGES from "../../constant/theme";

const SummerSaleBlog = () => {
    return (
        <div className="row product-style2 g-0" style={{ marginTop: "50px", borderRadius: "20px" }}>
            {/* <div className="col-lg-6 col-md-12">
                <div className="product-box style-4">
                    <div className="product-media" style={{backgroundImage: `url(${IMAGES.summer1.src})`, backgroundPosition: "center", height:"100%",borderRadius:"30px" }}></div>
                    <div className="sale-box ">
                        <div className="badge style-1 mb-1">Sale Up to 50% Off</div>	
                        <h2 className="sale-name">Summer<span>2024</span></h2>
                        <Link href="/shop-list" className="btn btn-outline-secondary btn-lg text-uppercase">Shop Now</Link>
                    </div>
                </div>
            </div> */}
            <div className="col-lg-12 col-md-12 ">
                <div className="product-box style-4">
                    <div className="product-media 100vhn" style={{backgroundImage: `url(${IMAGES.summer5.src})`, borderRadius:"30px", backgroundPosition: "top"}}></div>
                    <div className="product-content">
                        <div className="main-content " style={{color: "white !important"}}>
                            <div className="badge style-1 mb-3 text-white">Sale Up to 50% Off</div>
                            <h2 className="product-name text-white">New Summer Collection</h2>
                        </div>
                        <Link href="/shop-list" className="btn btn-secondary btn-lg text-uppercase">Shop Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummerSaleBlog;