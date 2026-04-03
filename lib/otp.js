import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// store globally (important)
let confirmationResult = null;

// Setup Recaptcha (only once)
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified");
        }
      }
    );
  }
};

// Send OTP
export const sendOtp = async (phone) => {
  setupRecaptcha();

  const appVerifier = window.recaptchaVerifier;

  confirmationResult = await signInWithPhoneNumber(
    auth,
    "+91" + phone,
    appVerifier
  );

  return true;
};

// Verify OTP
export const verifyOtp = async (otp) => {
  if (!confirmationResult) {
    throw new Error("OTP not sent or expired");
  }

  const result = await confirmationResult.confirm(otp);

  return result.user;
};