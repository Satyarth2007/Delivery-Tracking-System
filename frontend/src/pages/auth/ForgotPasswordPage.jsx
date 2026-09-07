import { useState } from "react";
import AuthCard from "../../components/auth/AuthCard.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { authApi } from "../../lib/authApi.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authApi.forgotPassword({ email });
    // Backend always returns the same generic response, whether or not the
    // email exists, to avoid enumeration — so this always shows "sent".
    setSent(true);
  };

  return (
    <AuthCard title="Forgot password" subtitle={sent ? undefined : "We'll email you a reset link."}>
      {sent ? (
        <p className="text-[14px] text-muted">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full justify-center">
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}