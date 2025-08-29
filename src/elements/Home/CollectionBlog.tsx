"use client";

import React from 'react';
import IMAGES from '../../constant/theme';
import Link from 'next/link';
import Image from 'next/image';

const collectionImgData = [
    { image: IMAGES.CollectionPng1, design: 'collection1' },
    { image: IMAGES.CollectionPng2, design: 'collection2' },
    { image: IMAGES.CollectionPng3, design: 'collection3' },
    { image: IMAGES.CollectionPng4, design: 'collection4' },
    // { image: IMAGES.CollectionPng5, design: 'collection5' },
];

const CollectionBlog = () => {
    return (
        <React.Fragment>
            {/* Background Section */}
            <div
                style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1681510321636-24615988c470?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`, // 👈 change IMAGES.BgTexture to your background image
                    // backgroundColor: "blue", // fallback color
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    padding: "100px 60px",
                    paddingBottom: "195px",
                    marginTop: "50px",
                    zIndex: 1,
                }}
            >
                <div className="container text-center">
                    <h2
                        className="title wow fadeInUp"
                        data-wow-delay="0.2s"
                        style={{ color: "#fff" }} // white text looks better on bg
                    >
                        Upgrade your style with our top-notch collection.
                    </h2>
                    <div>
                        <Link
                            href="/collections"
                            className="btn btn-secondary btn-lg wow fadeInUp m-b30"
                            data-wow-delay="0.4s"
                        >
                            All Collections
                        </Link>
                    </div>
                </div>

                {/* Collection images */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                        justifyContent: "center",
                        marginTop: "30px",
                    }}
                >
                    {collectionImgData.map(({ image, design }, ind) => (
                        <div
                            style={{
                                width: "220px",
                                height: "180px",
                                overflow: "hidden",
                                borderRadius: "12px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            }}
                            className={design}
                            key={ind}
                        >
                            <Image
                                src={image}
                                alt={`collection-${ind}`}
                                width={220}
                                height={180}
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default CollectionBlog;
