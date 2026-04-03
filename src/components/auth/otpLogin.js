'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyOtp } from "@/lib/otp";
import { useAuth } from "@/contexts/AuthContext";

export default function OtpLogin() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // 👈 use context

  const handleVerifyOtp = async () => {
    try {
      // 1. Verify with Firebase
      const firebaseUser = await verifyOtp(otp);

      // 2. Call backend
      const res = await fetch('/api/otp-login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: firebaseUser.phoneNumber
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 3. Save in context (NOT localStorage directly)
      login(data.user, data.token);

      // 4. Redirect based on role
      if (data.user.userType === "farmer") {
        router.push("/farmer");
      } else {
        router.push("/buyer");
      }

    } catch (error) {
      console.error("OTP Verify Error:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp}>
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}