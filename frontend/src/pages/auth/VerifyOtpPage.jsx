import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthCard from "../../components/auth/AuthCard.jsx";
import OtpInput from "../../components/ui/OtpInput.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../lib/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const { state } = useLocation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const phone = state?.phone;

  const handleVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.verifyOwner({ phone, otp });
      login(data.accessToken, data.user);
      navigate("/dispatcher");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await authApi.resendOtp({ phone });
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <AuthLayout
      visualHeadline="One code, real proof"
      visualSubtext="The same OTP flow your customers will use to confirm every delivery — starting with your own account."
    >
      <AuthCard
        title="Verify your phone"
        subtitle={phone ? `Enter the 6-digit code sent to ${phone}` : "Enter the 6-digit code sent to your phone"}
      >
        <div className="mb-6">
          <OtpInput value={otp} onChange={setOtp} />
        </div>
        {error && <p className="mb-4 text-center text-[13px] text-red">{error}</p>}
        <Button
          variant="primary"
          className="mb-3 w-full justify-center"
          onClick={handleVerify}
          disabled={otp.length < 6 || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <Button variant="ghost" className="w-full justify-center" onClick={handleResend}>
          {resent ? "Code resent" : "Resend code"}
        </Button>
      </AuthCard>
    </AuthLayout>
  );
}