import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthCard from "../../components/auth/AuthCard.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../lib/authApi.js";

export default function RegisterPage() {
  const [form, setForm] = useState({ companyName: "", name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.registerCompany(form);
      navigate("/verify-otp", { state: { phone: form.phone } });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      visualHeadline="Set up your delivery operations in minutes"
      visualSubtext="Invite agents, build routes, and verify every drop-off with a customer OTP — all from one dashboard."
    >
      <AuthCard
        title="Register your company"
        subtitle="Create your dispatcher account to get started."
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue hover:underline">Log in</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input label="Company name" value={form.companyName} onChange={update("companyName")} required />
          <Input label="Your name" value={form.name} onChange={update("name")} required />
          <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
          <Input label="Phone" type="tel" value={form.phone} onChange={update("phone")} required />
          <Input label="Password" type="password" value={form.password} onChange={update("password")} required />
          {error && <p className="mb-4 text-[13px] text-red">{error}</p>}
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}