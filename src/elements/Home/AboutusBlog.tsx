import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import Image from "next/image";

const AboutusBlog = () => {
    return (
        <div className="row about-style1">
            <div className="col-lg-6 col-md-12 m-b30">
                <div className="about-thumb wow fadeInUp  position-relative" data-wow-delay="0.2s">
                    <div className="dz-media h-55" style={{marginTop: 108}} >	
                        <Image src={IMAGES.Womenpng} alt="" />
                    </div>	
                    <Link href="/shop-list" className="btn btn-outline-secondary btn-light btn-xl" style={{marginBottom: 180}}>Woman collection</Link>	
                </div>
            </div>
            <div className="col-lg-6 col-md-12 align-self-center">
                <div className="about-content">
                    <div className="section-head style-1 wow fadeInUp" data-wow-delay="0.4s">
                        <h3 className="title ">Set your wardrobe with our  amazing selection!</h3>
                        <p>Refresh your closet with must-have looks. From everyday basics to statement styles — shop now and redefine your wardrobe.</p>
                    </div>
                    <Link href="/about-us" className="service-btn-2 wow fadeInUp" data-wow-delay="0.6s">
                        <span className="icon-wrapper" dangerouslySetInnerHTML={{__html: SVGICON.ArrowUpSvg}}></span>
                    </Link>                    
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="shop-card style-6 wow fadeInUp" data-wow-delay="0.8s">
                                <div className="dz-media"  style={{height: 400}}>
                                    <Image src={IMAGES.Genz} alt="image" />
                                </div>
                                <div className="dz-content">
                                    <Link href="/shop-list" className="btn btn-outline-secondary btn-light btn-md">Gen Z Fashion</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="shop-card style-6 wow fadeInUp" data-wow-delay="1.0s">
                                <div className="dz-media" style={{height: 400}}>
                                    <Image src={IMAGES.productmedium2} alt="image" />
                                </div>
                                <div className="dz-content">
                                    <Link href="/shop-list" className="btn btn-outline-secondary btn-light btn-md">Man collection</Link>
                                </div>
                                <span className="sale-badge">50% <br/>Sale <Image src={IMAGES.starpng} alt="" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutusBlog;