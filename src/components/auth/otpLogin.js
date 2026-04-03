'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: enter phone, Step 2: enter OTP
  const confirmationResultRef = useRef(null);
  const router = useRouter();
  const { login } = useAuth();

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    try {
      // Dynamically import OTP module to avoid SSR issues
      const { sendOtp } = await import("@/lib/otp");
      confirmationResultRef.current = await sendOtp(phone); // returns confirmationResult
      setStep(2); // move to OTP verification step
    } catch (err) {
      console.error("Send OTP error:", err);
      alert(err.message || "Failed to send OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      if (!confirmationResultRef.current) {
        throw new Error("OTP not sent or expired");
      }

      // Dynamically import OTP module
      const { verifyOtp } = await import("@/lib/otp");
      const firebaseUser = await verifyOtp(otp, confirmationResultRef.current);

      // Call backend API
      const res = await fetch("/api/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: firebaseUser.phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save in context
      login(data.user, data.token);

      // Redirect based on role
      if (data.user.userType === "farmer") router.push("/farmer");
      else router.push("/buyer");
    } catch (err) {
      console.error("OTP verification error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {step === 1 && (
        <>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-600 text-white p-2 w-full"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-600 text-white p-2 w-full"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Recaptcha container required by Firebase */}
      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
}