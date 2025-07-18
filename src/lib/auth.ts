import NetworkInstance from "@/app/api/NetworkInstance";
import { ToastContainer, toast } from "react-toastify";

const networkInstance = NetworkInstance();

interface AuthResponse {
  message: string;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    gender: string;
    isClient: boolean;
    isVerified: boolean;
    otp: string;
  };
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: string;
  isClient: boolean;
  isVerified: boolean;
  otp: string;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  try {
    const response = await networkInstance.post("/user/register", payload);
    if (response.data && response.data.message) {
      console.log("Backend message:", response.data.message);
    }
    // console.log(response.data);
    toast(response.data.message, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message?.includes("exists")) {
      toast(error.response.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
      throw new Error(error.response.data.message);
    }

    console.error("Registration error:", error);
    throw new Error("Registration failed. Please try again.");
  }
}


export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await networkInstance.post("/user/login", {
      email,
      password,
    });
    if (response.data && response.data.message) {
      console.log("Backend message:", response.data.message);
    }
    console.log(response.data);
    toast(response.data.message, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });
    return response.data;
  } catch (error: any) {
    // if (error.response.data.message.includes("not found")) {
    //   toast(error.response.data.message, {
    //     theme: "dark",
    //     hideProgressBar: true,
    //     position: "bottom-right",
    //     autoClose: 5000,
    //   });
    //   throw new Error(error.response.data.message);
    // }

    console.error("Login error:", error);
    throw new Error( error?.response?.data?.message);
  }}

  export async function verifyOtp(
    email: string,
    otp: string
  ): Promise<AuthResponse> {
    try {
      const response = await networkInstance.post("/user/verify-otp", {
        email,
        otp,
      });
      if (response.data && response.data.message) {
        console.log("Backend message:", response.data.message);
      }
      console.log(response.data);
      toast(response.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
      return response.data;
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw new Error(error?.response?.data?.message || "OTP verification failed. Please try again.");
    }
  }