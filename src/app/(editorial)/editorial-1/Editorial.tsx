import Link from "next/link";
import UniqueFashionBlog from "@/elements/About/UniqueFashionBlog";
import TeamCreators from "@/elements/About/TeamCreators";

const Editorial = () => {
  return (
    <div className="page-content bg-light">

      {/* Hero Section */}
      <section className="dz-bnr-inr dz-bnr-inr-sm bg-light">
        <div className="container">
          <div className="dz-bnr-inr-entry">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-8">
                <div className="text-start mb-xl-0 mb-4">
                  <h1 className="mb-3">
                    The <span className="text-dark">Noir Editorial</span> — Where Fashion Meets Storytelling
                  </h1>
                  <p className="lead text-gray">
                    Dive into our world of style, creativity, and craftsmanship.  
                    Discover behind-the-scenes stories, designer insights, and trend narratives that inspire every collection.
                  </p>
                  <nav aria-label="breadcrumb" className="breadcrumb-row mt-3">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                      <li className="breadcrumb-item active">Editorial</li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="text-center">
                  <img
                    src="/assets/images/background/editorial-banner.jpg"
                    alt="Editorial Banner"
                    className="img-fluid rounded shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="content-inner bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="/assets/images/blog/editorial-feature.jpg"
                alt="Feature Story"
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="title mb-3">Inside the Craft — The Art of Minimalist Fashion</h2>
              <p className="text">
                Our latest collection explores the balance between simplicity and sophistication.  
                Every stitch, texture, and silhouette tells a story of restraint and intention —  
                crafted for the modern individual who values quiet confidence.
              </p>
              <Link href="/blog-details" className="btn btn-outline-dark btn-sm rounded-pill mt-3">
                Read Full Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trend Highlights Section */}
      <section className="content-inner bg-light">
        <div className="container text-center">
          <h2 className="title mb-5">Trend Highlights</h2>
          <div className="row g-4">
            {[
              {
                image: "/assets/images/blog/trend1.jpg",
                title: "Bold Neutrals Are Redefining Streetwear",
                desc: "A closer look at how muted tones dominate the runway with attitude and elegance.",
              },
              {
                image: "/assets/images/blog/trend2.jpg",
                title: "Textures That Speak Volumes",
                desc: "From structured linen to brushed cotton — texture is this season’s language of luxury.",
              },
              {
                image: "/assets/images/blog/trend3.jpg",
                title: "The Revival of Modern Tailoring",
                desc: "Precision cuts and versatile layering breathe new life into tailored fashion.",
              },
            ].map((trend, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden">
                  <img
                    src={trend.image}
                    alt={trend.title}
                    className="img-fluid w-100 h-60 object-cover"
                  />
                  <div className="p-4 text-start">
                    <h5 className="mb-2">{trend.title}</h5>
                    <p className="text-muted mb-3">{trend.desc}</p>
                    <Link href="/blog-details" className="btn btn-outline-dark btn-sm rounded-pill">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Scenes Video Section */}
      <section className="about-banner overflow-visible">
        <video autoPlay loop muted id="video-background">
          <source src="/assets/videos/editorial-behind.mp4" type="video/mp4" />
        </video>
        <div className="about-info text-white">
          <h3 className="dz-title">
            <Link href="/editorial" className="text-white">Behind the Scenes</Link>
          </h3>
          <p className="text mb-0">
            Step into our creative studio where fabrics come alive,  
            ideas unfold, and craftsmanship meets innovation.  
            Every frame captures the heart of Noir’s artistry.
          </p>
        </div>
      </section>

      {/* Latest Editorial Posts */}
      <section className="content-inner">
        <UniqueFashionBlog />
      </section>

      {/* Editorial Team Section */}
      <section className="content-inner">
        <div className="container">
          <div className="section-head text-center mb-5">
            <h2 className="title">Meet the Editorial Team</h2>
            <p className="text-muted">
              The storytellers, photographers, and designers shaping Noir’s creative vision.
            </p>
          </div>
          <TeamCreators />
        </div>
      </section>

      {/* CTA Section */}
      <section className="get-in-touch bg-black text-white text-center">
        <div className="container py-5">
          <h2 className="mb-3">Share Your Story with Noir</h2>
          <p className="mb-4 text-gray-300">
            Have a creative idea, collaboration, or editorial feature in mind?  
            Let’s bring it to life together.
          </p>
          <Link href="/contact-us-1" className="btn btn-light rounded-pill">
            Get In Touch
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Editorial;
