"use client";
import Link from "next/link";
import IMAGES from "@/constant/theme";

import PasswordInputBox from "@/components/PasswordInputBox";
import Image from "next/image";
import { useState } from "react";
import { login } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.warning("Please enter your email and password", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    } else if (!email.includes(".com")) {
      toast.warning("Please enter a valid email address", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 2000,
      });
    }
    await login(email, password);

    // console.log("User Logged In successfully: ", { email, password });
    router.push("/");
    // setTimeout(() => window.location.reload(), 1500);
    setLoading(true);
  };
  return (
    <div className="page-content bg-light">
      <section className="px-3">
        <div className="row">
          <div
            className="col-xxl-6 col-xl-6 col-lg-6 start-side-conten p-5"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(${IMAGES.loginpic4.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "30vh",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="dz-bnr-inr-entry">
              <h1>Login</h1>
              <nav
                aria-label="breadcrumb text-align-start"
                className="breadcrumb-row"
              >
                <ul className="breadcrumb" style={{ color: "white!important" }}>
                  <li className="breadcrumb-item text-white">
                    <Link href="/" className="text-white">
                      {" "}
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item text-white">Login</li>
                </ul>
              </nav>
            </div>
            {/* <div className="registration-media">
              <Image src={IMAGES.RegistrationPng3} alt="/" />
            </div> */}
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
            <div className="login-area">
              <h2 className="text-secondary text-center">Login</h2>
              <p className="text-center m-b25">
                welcome please login to your account
              </p>
              <form onSubmit={handleSubmit} className="dz-form">
                <div className="m-b30">
                  <label className="label-title">Email Address</label>
                  <input
                    name="dzName"
                    required
                    className="form-control"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <div className="m-b15">
                  <label className="label-title">Password</label>
                  <div className="secure-input ">
                    <PasswordInputBox
                      value={password}
                      onChange={(e: any) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="form-row d-flex justify-content-between m-b30">
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="basic_checkbox_1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <Link className="text-primary" href="/forget-password">
                      Forgot Password
                    </Link>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-secondary btnhover text-uppercase me-2 sign-btn"
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                  <Link
                    href="/registration"
                    className="btn btn-outline-secondary btnhover text-uppercase"
                  >
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
