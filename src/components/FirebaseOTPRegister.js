// 'use client';
// import { useState, useEffect } from 'react';
// import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '@/lib/firebaseClient';

// export default function FirebaseOTPRegister({ userData, onRegisterSuccess }) {
//   const [otp, setOtp] = useState('');
//   const [confirmation, setConfirmation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [firebaseReady, setFirebaseReady] = useState(false);
//   const [recaptchaReady, setRecaptchaReady] = useState(false);

//   useEffect(() => {
//     // Check if Firebase is properly configured
//     if (!auth) {
//       setError('Firebase is not configured. Please check environment variables.');
//       return;
//     }
    
//     setFirebaseReady(true);
    
//     // Initialize reCAPTCHA with better error handling
//     const initializeRecaptcha = async () => {
//       try {
//         // Create unique container for this component instance
//         const containerId = `recaptcha-container-register-${Date.now()}`;
        
//         // Check if container exists, if not create it
//         let container = document.getElementById(containerId);
//         if (!container) {
//           container = document.createElement('div');
//           container.id = containerId;
//           document.body.appendChild(container);
//         }
        
//         // Create new recaptcha with unique container
//         window.recaptchaVerifierRegister = new RecaptchaVerifier(auth, containerId, {
//           'size': 'invisible',
//           'callback': (response) => {
//             console.log('reCAPTCHA solved:', response);
//           },
//           'expired-callback': () => {
//             console.log('reCAPTCHA expired');
//           }
//         });
        
//         // Render the recaptcha
//         await window.recaptchaVerifierRegister.render();
//         setRecaptchaReady(true);
//         console.log('reCAPTCHA initialized successfully for registration');
//       } catch (error) {
//         console.error('reCAPTCHA initialization error:', error);
//         setError('Failed to initialize reCAPTCHA. Please refresh the page.');
//       }
//     };
    
//     // Delay initialization to ensure DOM is ready
//     const timer = setTimeout(initializeRecaptcha, 100);
    
//     return () => {
//       clearTimeout(timer);
//       // Clean up the recaptcha instance more safely
//       if (window.recaptchaVerifierRegister) {
//         try {
//           // Clear the recaptcha verifier
//           window.recaptchaVerifierRegister.clear();
//         } catch (error) {
//           // Ignore recaptcha cleanup errors - they're harmless
//           console.log('reCAPTCHA cleanup (harmless):', error.message);
//         }
//         // Remove the reference
//         delete window.recaptchaVerifierRegister;
//       }
      
//       // Clean up the dynamically created container
//       const containers = document.querySelectorAll('[id^="recaptcha-container-register-"]');
//       containers.forEach(container => {
//         try {
//           if (container.parentNode) {
//             container.parentNode.removeChild(container);
//           }
//         } catch (error) {
//           // Ignore cleanup errors
//         }
//       });
//     };
//   }, []);

//   // Auto-send OTP when recaptcha is ready and userData is available
//   useEffect(() => {
//     if (recaptchaReady && firebaseReady && userData?.phone && !confirmation) {
//       sendOTP();
//     }
//   }, [recaptchaReady, firebaseReady, userData, confirmation]);

//   const sendOTP = async () => {
//     if (!firebaseReady || !recaptchaReady || !userData?.phone || !window.recaptchaVerifierRegister) return;
    
//     setLoading(true);
//     setError('');

//     try {
//       // Ensure phone number has country code for Firebase
//       let phoneNumber = userData.phone;
//       if (!phoneNumber.startsWith('+')) {
//         phoneNumber = `+91${phoneNumber}`;
//       }
      
//       console.log('Sending registration OTP to:', phoneNumber);
      
//       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifierRegister);
//       setConfirmation(confirmationResult);
//       console.log('OTP sent successfully for registration');
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       setError(error.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (e) => {
//     e.preventDefault();
//     if (!firebaseReady) return;
    
//     setLoading(true);
//     setError('');

//     try {
//       const result = await confirmation.confirm(otp);
//       const idToken = await result.user.getIdToken();
      
//       // Send ID token and user data to your backend
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           ...userData, 
//           idToken 
//         }),
//       });

//       // Check if response is JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text);
//         setError('Server error: Invalid response format');
//         return;
//       }

//       const data = await response.json();
      
//       if (response.ok) {
//         console.log('Registration successful:', data);
//         onRegisterSuccess(data);
//       } else {
//         setError(data.error || 'Registration failed');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setError(error.message || 'Failed to verify OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!firebaseReady) {
//     return (
//       <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//         <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
//           Firebase is not configured. Please add environment variables.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Phone</h2>
      
//       <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//         <p className="text-sm text-gray-600">
//           <strong>Registering as:</strong> {userData?.userType === 'farmer' ? 'Farmer' : 'Buyer'}
//         </p>
//         <p className="text-sm text-gray-600">
//           <strong>Name:</strong> {userData?.name}
//         </p>
//         <p className="text-sm text-gray-600">
//           <strong>Phone:</strong> +91{userData?.phone}
//         </p>
//         {userData?.company && (
//           <p className="text-sm text-gray-600">
//             <strong>Company:</strong> {userData?.company}
//           </p>
//         )}
//       </div>
      
//       {!recaptchaReady ? (
//         <div className="text-center py-8">
//           <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
//           <p className="text-gray-600">Initializing secure verification...</p>
//         </div>
//       ) : (
//         <>
//           {confirmation ? (
//             <form onSubmit={verifyOTP} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Enter 6-digit OTP
//                 </label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   maxLength={6}
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   OTP sent to +91{userData?.phone}
//                 </p>
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
//               >
//                 {loading ? 'Verifying...' : 'Complete Registration'}
//               </button>

//               <button
//                 type="button"
//                 onClick={sendOTP}
//                 disabled={loading}
//                 className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
//               >
//                 Resend OTP
//               </button>
//             </form>
//           ) : (
//             <div className="text-center py-8">
//               <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
//               <p className="text-gray-600">Sending OTP to +91{userData?.phone}...</p>
//             </div>
//           )}
//         </>
//       )}
      
//       {error && (
//         <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }
