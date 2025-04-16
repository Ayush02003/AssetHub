import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Forget_pass = () => {
  const [username, setUsername] = useState("");
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
    const navigate = useNavigate()
  const handleSendOTP = async () => {
    if (!username.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/forgot_password/send_otp", {
        username,
      });
      if (res.data.success) {
        toast.success("OTP sent successfully! Check your email.");
        setStep(2);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!OTP.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/forgot_password/verify_otp", {
        username,
        otp:OTP,
      });
      if (res.data.success) {
        toast.success("OTP verified successfully!");
        setStep(3);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please enter both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forgot_password/reset_password", {
        username,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successful!");
        navigate("/")
        setStep(1);
      } else {
        toast.error("Failed to reset password. Try again.");
      }
    } catch (e) {
        console.error("Error Response:", e.response);
        toast.error(e.response?.data?.error || "Something went wrong.");
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen  pt-10  -translate-y-10">
      <div className="w-96 p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-xl lg:max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Forgot Password
        </h1>
        <form className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="label mt-1">
                  <span className="text-base label-text text-gray-500">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full input input-bordered bg-white text-gray-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <a
                href="/"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Login?
              </a>
              <button
                className="btn btn-block btn-sm mt-3 text-white"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="label mt-1">
                  <span className="text-base label-text text-gray-500">
                    Enter OTP
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full input input-bordered bg-white text-gray-500"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>
              <a
                href="/"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Login?
              </a>
              <button
                className="btn btn-block btn-sm mt-3 text-white"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="label mt-1">
                  <span className="text-base label-text text-gray-500">
                    New Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full input input-bordered bg-white text-gray-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="label mt-1">
                  <span className="text-base label-text text-gray-500">
                    Confirm Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full input input-bordered bg-white text-gray-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <a
                href="/"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Login?
              </a>
              <button
                className="btn btn-block btn-sm mt-3 text-white"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forget_pass;
