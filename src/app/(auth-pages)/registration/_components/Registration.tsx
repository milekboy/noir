"use client";
import Link from "next/link";
import IMAGES from "@/constant/theme";
import PasswordInputBox from "@/components/PasswordInputBox";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Stepper } from "../_components/Stepper";
import { steps } from "../_components/Stepper";
import { register } from "@/lib/auth";
import { toast } from "react-toastify";
import OTP from "./OTP";
// no import for setTimeout — use the browser's setTimeout/clearTimeout instead

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [date, setDate] = useState("");
  const [error2, setError2] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User registered successfully: ", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      number,
      gender,
    });
    const res = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber: number,
      gender,
    });
    alert("hello");
    setShowOtpStep(true);

    console.log("User registered successfully: ", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      number,
      gender,
    });

    //  localStorage.setItem("userData", JSON.stringify(res.userData);
    return res;
  };

  const verifyPassword = () => {
    // Check if email or password is empty first
    if (email.trim() === "" || password.trim() === "") {
      setError("Email and Password cannot be empty");
      // console.log("Email and Password cannot be empty");
      return setConfirm(false);
    }

    // Check password strength requirements
    if (
      password.length < 7 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      setError(
        "Password must be at least 7 characters and include uppercase, lowercase, number, and symbol."
      );
      console.log("Password does not meet criteria");
      return setConfirm(false);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setConfirm(false);
      console.log(confirm);

      return;
    }

    // All validations passed
    setError("");
    setCurrentStep(currentStep + 1);
    setConfirm(true);
    console.log("passwords match");
  };

  const verifyName = () => {
    if (firstName.trim() === "" || lastName.trim() === "") {
      setError2("Names cannot be empty");
      return false;
    } else if (
      Number(new Date().getFullYear() - Number(date.slice(0, 4))) < 18
    ) {
      setError2("You must be at least 18 years old to register");
      return false;
    } else {
      setError("");
      setError2("");
      return true; // Proceed to the next step if names are valid
    }
  };

  const validateNum = () => {
    if (number.length < 14 || number.length > 14) {

      setError2("Invalid Number, Please chack again");
    } else {
      setError2("");
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (number.length === 0) {
        setError2("Phone Number cannot be empty");
        return;
      } else if (number.startsWith("+234")) {
        validateNum();
        return true;
      }else if(number.length < 11  || number.length > 11) {
        setError2("Phone Number must be 11 digits");
      } else if (number.length === 11) {
        const cleaned = "+234" + number.slice(1);
        setNumber(cleaned);
        setError2("");
        console.log("cleaned number: ", cleaned);
      }
      
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [number]);
  return (
    <div className="page-content bg-light">
      <section className="px-3">
        <div className="row flex">
          <div
            className="col-xxl-6 col-xl-6 col-lg-6 start-side-conten p-5 mb-"
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
              <h1>Registration</h1>
              <nav
                aria-label="breadcrumb text-align-start text-white"
                className="breadcrumb-row"
              >
                <ul className="breadcrumb text-white">
                  <li className="breadcrumb-item text-white">
                    <Link href="/" className="text-white">
                      {" "}
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item text-white">Registration</li>
                </ul>
              </nav>
            </div>
            {/* <div className="registration-media ">
              <Image src={IMAGES.loginpic4} alt="/"  className="" />
            </div> */}
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-conten justify-content-center mb-3">
            {showOtpStep ? (
              <OTP email={email} />
            ) : (
              <div className="login-area">
                <h2 className="text-secondary text-center">Registration Now</h2>
                <p className="text-center m-b20">
                  Welcome please registration to your account
                </p>

                <form onSubmit={handleSubmit}>
                  <Stepper
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    steps={steps}
                    passwordConfirmation={confirm}
                    verifyPassword={verifyPassword}
                    verifyName={verifyName}
                    firstName={firstName}
                    lastName={lastName}
                    gender={gender}
                    number={number}
                    date={date}
                    error={setError2}
                  >
                    <>
                      {/* =============== STEP ONE =========== */}

                      <div
                        className={`${
                          steps[currentStep].id === 1 ? "block" : "d-none"
                        }`}
                      >
                        <div className="m-b25">
                          <label className="label-title">Email Address</label>
                          <input
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            placeholder="Email Address"
                            type="email"
                          />
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error.includes("Email") && error}
                          </p>
                        </div>

                        <div className="m-b25">
                          <label className="label-title">Password</label>
                          <div className="secure-input ">
                            <PasswordInputBox
                              placeholder="Password"
                              value={password}
                              onChange={(e: any) => {
                                setPassword(e.target.value);
                              }}
                            />
                          </div>
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error}
                          </p>
                        </div>
                        <div className="m-b20">
                          <label className="label-title">
                            Confirm Password
                          </label>
                          <div className="secure-input ">
                            <PasswordInputBox
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e: any) => {
                                setConfirmPassword(e.target.value);
                              }}
                              // onBlur={verifyPassword}
                            />
                          </div>
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error}
                          </p>
                        </div>
                      </div>

                      {/* =============== STEP TWO =========== */}

                      <div
                        className={`${
                          steps[currentStep].id === 2 ? "block" : "d-none"
                        }`}
                      >
                        <div className="d-flex gap-2">
                          <div className="m-b">
                            <label className="label-title">Firstname</label>
                            <input
                              name="firstName"
                              className="form-control"
                              value={firstName}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                              }}
                              placeholder="John"
                              type="text"
                            />
                            <p
                              className="text-danger mt-1 "
                              style={{ fontSize: "12px" }}
                            >
                              {error2.includes("Names") && error2}
                            </p>
                          </div>

                          <div className="m-b">
                            <label className="label-title">Lastname</label>
                            <input
                              name="lastName"
                              className="form-control"
                              value={lastName}
                              onChange={(e) => {
                                setLastName(e.target.value);
                              }}
                              placeholder="Doe"
                              type="name"
                            />
                            <p
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {error2.includes("Names") && error2}
                            </p>
                          </div>
                        </div>
                        <div className="m-b20">
                          <label className="label-title">Date of Birth</label>
                          <input
                            name="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => {
                              setDate(e.target.value);
                            }}
                            placeholder="DD/MM/YYYY"
                            type="date"
                          />
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error2.includes("18") && error2}
                          </p>
                        </div>

                        <div className="m-b25">
                          <label className="label-title">Gender</label>
                          <select
                            id="fruit"
                            name="gender"
                            className="rounded-2 broder border-black text-black"
                            value={gender}
                            onChange={(e) => {
                              setGender(e.target.value);
                            }}
                          >
                            <option value="">
                              --Please choose an option--
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error2.includes("Gender") && error2}
                          </p>
                        </div>
                        <div className="m-b25">
                          <label className="label-title">Phone Number</label>
                          <input
                            name="phoneNumber"
                            className="form-control"
                            value={number}
                            onChange={(e) => {
                              setNumber(e.target.value);
                            }}
                            placeholder="e.g. 08012345678"
                            // pattern="[0-9]{11}"
                            // type="tel"
                          />
                          <p
                            className="text-danger "
                            style={{ fontSize: "12px" }}
                          >
                            {error2.includes("Number") && error2}
                          </p>
                        </div>
                      </div>
                    </>
                  </Stepper>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
