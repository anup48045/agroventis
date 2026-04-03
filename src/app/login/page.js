'use client'
import { useState } from "react";
import { sendOtp, verifyOtp } from "@/lib/otp";

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async () => {
    await sendOtp(phone);
    setStep(2);
  };

  const handleVerifyOtp = async () => {
    const user = await verifyOtp(otp);
    console.log("Logged in:", user);
  };

  return (
    <div className="p-4">
      {step === 1 && (
        <>
          <input
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {/* Required for Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}