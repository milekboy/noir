"use client";
import { verifyOtp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface OTPProps {
  otp: string;
  onVerify: () => void;
  email: string;
}

export default function OTP({ otp, onVerify, email }: OTPProps) {
  const [number, setNumber] = useState("");
  const router = useRouter();
  const handleVerifyOtp = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (number === otp) {
      await verifyOtp(email, number);
      toast("Success \n Email verified", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
      onVerify();
      router.push('/login');
      console.log("Email verified successfully");
    } else {
      toast("Invalid OTP",{
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <h2 className="text-secondary text-center">Registration Now</h2>
      <p>
        We sent an email to {email}. Check your inbox and enter the 4-digit code to verify your email
      </p>
      <div className="m-b25">
        <label className="label-title">OTP code</label>
        <input
          name="number"
          className="form-control"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="4-digit code"
          type="text"
        />
      </div>
      <button type="submit" className="btn btn-primary">Verify OTP</button>
    </form>
  );
}