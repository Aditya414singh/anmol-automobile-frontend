import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);

      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      const responseData = error?.response?.data;

      if (responseData?.errors) {
        const firstError = Object.values(
          responseData.errors
        )[0];

        if (Array.isArray(firstError)) {
          setError(String(firstError[0]));
        } else {
          setError(String(firstError));
        }
      } else {
        setError(
          responseData?.message ||
            "Unable to login. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#F4F8F5] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
              {language === "hi"
                ? "स्वागत है"
                : "Welcome Back"}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#123C35]">
              {language === "hi"
                ? "लॉगिन करें"
                : "Login"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {language === "hi"
                ? "अपने Anmol Automobiles खाते में लॉगिन करें।"
                : "Login to your Anmol Automobiles account."}
            </p>

          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {language === "hi"
                  ? "पासवर्ड"
                  : "Password"}
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0F5C4D] text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : language === "hi"
                ? "लॉगिन करें"
                : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-[#0F5C4D] hover:underline"
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Login;