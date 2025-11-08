"use client";
import { useEffect, useState } from "react";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
}

export default function AccountProfile() {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileSelect = e.target.files ? e.target.files[0] : null;
    setFile(fileSelect);
  };

  return (
    <div className="page-content bg-light">
      <CommanBanner
        image={IMAGES.BackBg1.src}
        mainText="Your Profile"
        parentText="Home"
        currentText="Account Profile"
      />
      <div className="content-inner-1">
        <div className="container">
          <div className="row">
            <CommanSidebar />
            <section className="col-xl-9 account-wrapper">
              <div className="account-card">
                <div className="profile-edit">
                  <div className="avatar-upload d-flex align-items-center">
                    <div className="position-relative">
                      <div className="avatar-preview thumb d-flex justify-content-center align-items-center">
                        <div
                          className="d-flex justify-content-center align-items-center bg-light border"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                          }}
                        >
                          <i
                            className="fa-solid fa-user text-secondary"
                            style={{ fontSize: "48px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="clearfix">
                    <h2 className="title mb-0">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Loading..."}
                    </h2>
                    <span className="text text-primary">{user?.email}</span>
                  </div>
                </div>

                {/* same layout but showing info instead of inputs */}
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group m-b25">
                      <label className="label-title">First Name</label>
                      <p className="form-control-plaintext">
                        {user?.firstName || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group m-b25">
                      <label className="label-title">Last Name</label>
                      <p className="form-control-plaintext">
                        {user?.lastName || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group m-b25">
                      <label className="label-title">Email address</label>
                      <p className="form-control-plaintext">
                        {user?.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group m-b25">
                      <label className="label-title">Phone</label>
                      <p className="form-control-plaintext">
                        {user?.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
