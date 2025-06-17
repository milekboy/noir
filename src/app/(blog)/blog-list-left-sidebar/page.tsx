import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import BlogSidebar from "@/elements/Blog/BlogSidebar";
import { Bloglight2 } from "@/constant/Alldata";
import Image from "next/image";
import CommanLayout from "@/components/CommanLayout";
 

export default function BlogListLeftSidebar(){
    return(
        <CommanLayout>
            <div className="page-content bg-light">
                <CommanBanner mainText="Blog List Left Sidebar" parentText="Home" currentText="Blog List Left Sidebar" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-4 col-lg-4 order-lg-1 order-2">
                                <aside className="side-bar left sticky-top m-b30">
                                    <BlogSidebar />
                                </aside>
                            </div>
                            <div className="col-xl-8 col-lg-8 order-lg-2 order-1">
                                <div className="row">
                                    {Bloglight2.map((item, ind)=>(
                                        <div className="col-lg-12 m-b30 wow fadeInUp" data-wow-delay={item.dealy} key={ind}>
                                            <div className="dz-card blog-half style-5">
                                                <div className="dz-media">
                                                    <Image src={item.image} alt="/" />
                                                </div>
                                                <div className="dz-info">
                                                    <div className="dz-meta">
                                                        <ul>
                                                            <li className="post-date">{item.date}</li>
                                                        </ul>
                                                    </div>
                                                    <h4 className="dz-title">
                                                        <Link href="/blog-grid-both-sidebar">{item.text}</Link>
                                                    </h4>
                                                    <Link href="/blog-grid-both-sidebar" className="font-14 read-btn">Read More 
                                                        <i className="icon feather icon-chevron-right"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}                                
                                    <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.7s">
                                        <Link href="/blog-dark-half-image" className="btn btn-secondary">
                                            Load More
                                        </Link>
                                    </div>
                                </div>
                            </div>				
                        </div>
                    </div>
                </section>
            </div>
        </CommanLayout>
    )
}