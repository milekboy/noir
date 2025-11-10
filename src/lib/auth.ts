import NetworkInstance from "@/app/api/NetworkInstance";
import { useRouter } from "next/router";
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
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  try {
    const response = await networkInstance.post("/auth/register", payload);
    if (response.data) {
      console.log("Backend message:", response.data);
    } else {
      throw new Error("Registration failed. Please try again.");
    }

    toast(response?.data.devMessage, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message?.includes("exists")) {
      toast.error(error.response.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
      throw new Error(error.response.data.message);
    } else if (error.message.includes("429")) {
      toast.error("Registration Failed, Too many request. Try again later", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
    }

    console.error("Registration error:", error);

    toast.error(error.response.data.message, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });
    throw new Error("Registration failed. Please try again.");
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await networkInstance.post(
      "auth/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    if (response.data && response.data.message) {
      console.log("Backend message:", response.data.message);
    }
    console.log(response.data.user);
    localStorage.setItem("userData", JSON.stringify(response.data.user));
    toast(response.data.message, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });
    return response.data;
  } catch (error: any) {
    if (error.response.data.message.includes("not found")) {
      toast(error.response.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });

      throw new Error(error.response.data.message);
    }
    toast(error.response.data.message, {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 5000,
    });

    console.error("Login error:", error);
    throw new Error(error?.response?.data?.message);
  }
}

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
    throw new Error(
      error?.response?.data?.message ||
        "OTP verification failed. Please try again."
    );
  }
}
