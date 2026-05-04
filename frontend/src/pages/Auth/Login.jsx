import { useEffect, useState } from "react";
import { ArrowRight, Hospital, ShieldCheck } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import FormInput from "../../components/common/FormInput";
import { useAuth } from "../../contexts/useAuth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    document.title = "SHIIS | Sign In";
  }, []);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setError("Enter both username and password to continue.");
      return;
    }

    setLoading(true);

    signIn({ username: form.username, password: form.password })
      .then((user) => {
        const nextPath =
          from === "/login"
            ? user?.roleName?.toLowerCase() === "admin"
              ? "/"
              : "/"
            : from;

        navigate(nextPath, { replace: true });
      })
      .catch((loginError) => {
        setError(
          loginError.response?.data?.message ||
            "Login failed. Check your username and password.",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 text-surface-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at top, rgba(22, 163, 74, 0.08), transparent 30%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <section className="hidden lg:block space-y-6 pr-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary-200/60 bg-white/80 px-4 py-2 text-sm text-surface-600 backdrop-blur-xl">
            <Hospital className="h-4 w-4 text-primary-500" />
            SHIIS Healthcare Intelligence System
          </div>

          <div className="space-y-4 max-w-xl">
            <h1 className="text-5xl font-semibold tracking-tight leading-tight text-surface-900">
              Secure access for patient management and operations.
            </h1>
            <p className="text-surface-500 text-lg leading-8">
              Sign in to manage patients, dashboards, and healthcare workflows
              from a single control center.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            {[
              "Protected dashboard routes",
              "Persistent session sign-in",
              "Fast sign-out from the header",
              "Designed for future backend auth",
            ].map((item) => (
              <div
                key={item}
                className="glass-card p-4 text-sm text-surface-600"
              >
                <ShieldCheck className="mb-3 h-5 w-5 text-primary-500" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(22,163,74,0.25)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #16a34a 0%, #10b981 100%)",
              }}
            >
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-surface-900">
                Sign in
              </h2>
              <p className="text-sm text-surface-500">
                Use your SHIIS account to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-xs text-surface-400 leading-6">
              Authentication is backed by the database `User` and `Role` tables.
              Your visible tabs depend on the role assigned to the signed-in
              user.
            </p>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-surface-200/70 pt-5 text-xs text-surface-400">
            <span>Protected access</span>
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
