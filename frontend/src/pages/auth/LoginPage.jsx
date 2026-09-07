import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthCard from "../../components/auth/AuthCard.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../lib/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.accessToken, data.user);
      navigate(data.user.role === "agent" ? "/agent" : "/dispatcher");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      visualHeadline="Welcome back"
      visualSubtext="Your routes, agents, and delivery history are exactly where you left them."
    >
      <AuthCard
        title="Log in"
        footer={
          <>
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue hover:underline">Register</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
          <Input label="Password" type="password" value={form.password} onChange={update("password")} required />
          {error && <p className="mb-4 text-[13px] text-red">{error}</p>}
          <Button type="submit" variant="primary" className="mb-4 w-full justify-center" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <Link to="/forgot-password" className="block text-center text-[13.5px] text-muted hover:text-fg">
          Forgot password?
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}