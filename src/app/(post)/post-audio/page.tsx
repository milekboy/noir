import CommanLayout from "@/components/CommanLayout";
import IMAGES from "@/constant/theme";
import BlogSidebar from "@/elements/Blog/BlogSidebar";
import AdditionalInfo from "@/elements/Post/AdditionalInfo";
import AuthorProfile from "@/elements/Post/AuthorProfile";
import Comments from "@/elements/Post/Comments";
import PostTag from "@/elements/Post/PostTag";
import PostTitleWithImage from "@/elements/Post/PostTitleWithImage";
import RelatedPost from "@/elements/Post/RelatedPost";
import SocialIcon from "@/elements/SocialIcon";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function PostAudio(){
    return(
        <CommanLayout>
            <div className="page-content bg-light">
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-8">
                                <div className="dz-blog blog-single style-1 sidebar"> 
                                    <PostTitleWithImage image={false} />
                                    <div className="dz-media post-audio rounded">
                                        <iframe allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/539018871&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" style={{width: "100%"}}></iframe>
                                    </div>
                                    
                                    <div className="dz-info">
                                        <div className="dz-post-text">
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"></i></blockquote>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <figure className="wp-container-5 wp-block-gallery-2 wp-block-gallery has-nested-images columns-2 is-cropped">
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic2} alt="/" /></figure>
                                            </figure>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <AdditionalInfo />
                                        </div>
                                        <div className="dz-share-post meta-bottom">
                                            <PostTag />
                                            <div className="dz-social-icon primary-light">
                                                <ul>
                                                    <SocialIcon />
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="author-box style-1">
                                    <AuthorProfile />
                                </div>
                                <div className="dz-related-post">
                                    <RelatedPost />
                                </div>	
                                <div className="clear" id="comment-list">
                                    <Comments />
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-8 m-b30">
                                <aside className="side-bar sticky-top">
                                    <BlogSidebar />
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </CommanLayout>
    )
}