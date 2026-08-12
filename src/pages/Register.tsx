import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      await register(
        name.trim(),
        email.trim(),
        phone.trim(),
        password,
        passwordConfirm
      );

      navigate("/");
    } catch (error: any) {
      console.error("Registration failed:", error);

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
            "Unable to create account. Please try again."
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

          {/* Heading */}
          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
              {language === "hi"
                ? "अनमोल ऑटोमोबाइल्स"
                : "Anmol Automobiles"}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#123C35]">
              {language === "hi"
                ? "खाता बनाएं"
                : "Create Account"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {language === "hi"
                ? "Anmol Automobiles के साथ अपना खाता बनाएं।"
                : "Create your Anmol Automobiles account."}
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {language === "hi" ? "नाम" : "Name"}
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={
                  language === "hi"
                    ? "अपना नाम दर्ज करें"
                    : "Enter your name"
                }
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

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

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {language === "hi"
                  ? "मोबाइल नंबर"
                  : "Phone Number"}
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                placeholder="10-digit mobile number"
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
                minLength={8}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {language === "hi"
                  ? "पासवर्ड की पुष्टि करें"
                  : "Confirm Password"}
              </label>

              <input
                type="password"
                value={passwordConfirm}
                onChange={(event) =>
                  setPasswordConfirm(event.target.value)
                }
                placeholder="Confirm your password"
                required
                minLength={8}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0F5C4D] text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : language === "hi"
                ? "खाता बनाएं"
                : "Create Account"}
            </button>

          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[#0F5C4D] hover:underline"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Register;