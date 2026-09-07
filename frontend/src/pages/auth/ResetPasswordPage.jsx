import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../lib/authApi.js";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await authApi.resetPassword({ token, password });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "This reset link is invalid or expired.");
    }
  };

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={handleSubmit}>
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="mb-4 text-[13px] text-red">{error}</p>}
        <Button type="submit" variant="primary" className="w-full justify-center">
          Reset password
        </Button>
      </form>
    </AuthCard>
  );
}