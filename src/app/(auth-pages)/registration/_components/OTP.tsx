"use client";
import NetworkInstance from "@/app/api/NetworkInstance";
import { verifyOtp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const networkInstance = NetworkInstance();
interface OTPProps {
  email: string;
}

export default function OTP({ email }: OTPProps) {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
   try{
     const res = await networkInstance.post("auth/verify-otp", {
      email,
      otp,
    });
    if (res.data.success) {
      toast.success(res.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
       localStorage.setItem("userData", JSON.stringify(res.data.user));
      router.push("/");
    setTimeout(() => window.location.reload(), 1500);
    }
   }catch(error: any){
      toast.error(error.response.data.message, {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
      console.log(email, otp);
      console.error("Error verifying OTP:", error);
   }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <h2 className="text-secondary text-center">Registration Now</h2>
      <p>
        We sent an email to {email}. Check your inbox and enter the 4-digit code
        to verify your email
      </p>
      <div className="m-b25">
        <label className="label-title">OTP code</label>
        <input
          name="number"
          className="form-control"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="4-digit code"
          type="text"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Verify OTP
      </button>
    </form>
  );
}
