import Link from "next/link";
import TeamCreators from "@/elements/About/TeamCreators";
import UniqueFashionBlog from "@/elements/About/UniqueFashionBlog";

const Career = () => {
    return (
        <div className="page-content bg-light">
            {/* Banner Section */}
            <section className="dz-bnr-inr dz-bnr-inr-sm bg-light">
                <div className="container">
                    <div className="dz-bnr-inr-entry">
                        <div className="row align-items-center">
                            <div className="col-lg-7 col-md-7">
                                <div className="text-start mb-xl-0 mb-4">
                                    <h1>Join the Noir Family — Shape the Future of Fashion</h1>
                                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link href="/">Home</Link>
                                            </li>
                                            <li className="breadcrumb-item">Careers</li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-5">
                                <div className="about-sale text-start">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-6 col-6">
                                            <div className="about-content">
                                                <h2 className="title"><span className="counter">25</span>+</h2>
                                                <p className="text">Creative Minds</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-5 col-md-6 col-6">
                                            <div className="about-content">
                                                <h2 className="title">100%</h2>
                                                <p className="text">Passion & Drive</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Work With Us Section */}
            <section className="about-banner overflow-visible">
                <video autoPlay loop muted id="video-background">
                    <source src="/assets/images/background/bg-video.mp4" type="video/mp4" />
                </video>
                <div className="about-info">
                    <h3 className="dz-title">
                        <Link href="/career">Why Work With Noir?</Link>
                    </h3>
                    <p className="text mb-0">
                        At Noir, we’re more than a clothing brand — we’re a movement driven by creativity, sustainability, 
                        and innovation. We believe in empowering our team to express their individuality while crafting 
                        timeless fashion that inspires confidence and culture.
                    </p>
                </div>
            </section>

            {/* Open Positions */}
            <section className="content-inner">
                <div className="container">
                    <div className="section-head text-center">
                        <h2 className="title">Current Openings</h2>
                        <p className="text mb-5">
                            Explore opportunities to join our growing team. Whether you're a designer, marketer, or content creator, 
                            there’s a place for your talent here.
                        </p>
                    </div>

                    <div className="row">
                        {[
                            {
                                title: "Fashion Designer",
                                type: "Full Time",
                                location: "Lagos, Nigeria",
                                desc: "Create cutting-edge designs and contribute to our seasonal fashion collections."
                            },
                            {
                                title: "Social Media Strategist",
                                type: "Remote",
                                location: "Anywhere",
                                desc: "Drive engagement and brand awareness through compelling digital storytelling."
                            },
                            {
                                title: "Store Manager",
                                type: "On-site",
                                location: "Abuja, Nigeria",
                                desc: "Lead our retail experience and ensure customer satisfaction at every level."
                            }
                        ].map((job, index) => (
                            <div key={index} className="col-lg-4 col-md-6 mb-4">
                                <div className="card shadow-sm border-0 p-4 h-100">
                                    <h4 className="title mb-2">{job.title}</h4>
                                    <p className="text-muted small mb-2">{job.type} • {job.location}</p>
                                    <p className="text mb-3">{job.desc}</p>
                                    <Link href="/contact-us-1" className="btn btn-dark btn-sm">
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section (You can replace with company culture posts) */}
            <section className="content-inner">
                <UniqueFashionBlog />
            </section>

            {/* Contact CTA */}
            <section className="get-in-touch">
                <div className="m-r100 m-md-r0 m-sm-r0">
                    <h3 className="dz-title mb-lg-0 mb-3">
                        Questions? 
                        <span>Our HR team will help you find the right opportunity.</span>
                    </h3>
                </div>
                <Link href="/contact-us-1" className="btn btn-light">Contact HR</Link>
            </section>

            {/* Team Section */}
            <section className="content-inner">
                <div className="container">
                    <TeamCreators />
                </div>
            </section>
        </div>
    );
};

export default Career;
