"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveUserProfile, saveUserSession } from "../lib/localStorage";
import { User, Building2 } from "lucide-react";

type UserType = "individual" | "organisation";
type AuthMethod = "password" | "otp";
type ContactType = "email" | "mobile";

interface LoginValues {
  username: string;
  password: string;
  rememberMe: boolean;
  contact: string;
  otp: string;
}

const users = [
  {
    userType: "individual" as UserType,
    username: "individualUser",
    password: "Password123",
    email: "user@example.com",
    mobile: "9999999999",
    displayName: "Individual User",
  },
  {
    userType: "organisation" as UserType,
    username: "organisationUser",
    password: "OrgPass123",
    email: "org@example.com",
    displayName: "Organisation Admin",
  },
];

const mockOtp = {
  individual: "123456",
  organisation: "654321",
};

export default function LoginForm() {
  const [selectedType, setSelectedType] = useState<UserType>("individual");
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod>("password");
  const [contactType, setContactType] = useState<ContactType>("email");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
      contact: "",
      otp: "",
    },
  });

  const contactLabel = selectedType === "organisation" ? "Organisation Email" : contactType === "email" ? "Email Address" : "Mobile Number";
  const contactPlaceholder = selectedType === "organisation" ? "org@example.com" : contactType === "email" ? "user@example.com" : "9999999999";
  const otpHint = selectedType === "individual" ? "123456" : "654321";

  useEffect(() => {
    setOtpSent(false);
    setMessage(null);
    clearErrors(["contact", "otp"]);
  }, [selectedType, selectedMethod, contactType, clearErrors]);

  const findUserByLogin = (username: string) => {
    return users.find((user) => user.userType === selectedType && user.username.toLowerCase() === username.toLowerCase());
  };

  const findUserByContact = (contact: string) => {
    return users.find((user) => {
      if (selectedType === "organisation") {
        return user.userType === "organisation" && user.email.toLowerCase() === contact.toLowerCase();
      }
      if (contactType === "email") {
        return user.userType === "individual" && user.email.toLowerCase() === contact.toLowerCase();
      }
      return user.userType === "individual" && user.mobile === contact;
    });
  };

  const saveLoginSession = (user: (typeof users)[number], method: AuthMethod, remember: boolean) => {
    saveUserProfile({
      registrationType: selectedType,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      mobile: user.mobile,
      organisationName: selectedType === "organisation" ? "Verified Organisation" : undefined,
      loginMethod: method,
    });
    saveUserSession({
      userType: selectedType,
      username: user.username,
      loginMethod: method,
      rememberMe: remember,
      loggedInAt: new Date().toISOString(),
    });
  };

  const handlePasswordLogin = async (values: LoginValues) => {
    setMessage(null);
    const trimmedUsername = values.username.trim();
    if (!trimmedUsername || !values.password) {
      if (!trimmedUsername) setError("username", { type: "required", message: "Username is required" });
      if (!values.password) setError("password", { type: "required", message: "Password is required" });
      return;
    }

    const user = findUserByLogin(trimmedUsername);
    if (!user || user.password !== values.password) {
      setMessage("Invalid username or password. Use the mock credentials provided.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    saveLoginSession(user, "password", values.rememberMe);
    router.push("/dashboard");
  };

  const handleSendOtp = async () => {
    setMessage(null);
    const contact = getValues("contact").trim();
    if (!contact) {
      setError("contact", { type: "required", message: `${contactLabel} is required` });
      return;
    }

    const user = findUserByContact(contact);
    if (!user) {
      setError("contact", { type: "validate", message: `No ${selectedType} account found for this contact.` });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setOtpSent(true);
    setMessage(`Mock OTP sent to ${contact}. Use ${otpHint} for verification.`);
    setLoading(false);
  };

  const handleVerifyOtp = async (values: LoginValues) => {
    setMessage(null);
    const contact = values.contact.trim();
    const otp = values.otp.trim();
    if (!contact) {
      setError("contact", { type: "required", message: `${contactLabel} is required` });
      return;
    }
    if (!otp) {
      setError("otp", { type: "required", message: "Enter the OTP" });
      return;
    }

    const user = findUserByContact(contact);
    if (!user) {
      setMessage(`No ${selectedType} account found for this contact.`);
      return;
    }

    if (otp !== otpHint) {
      setError("otp", { type: "validate", message: "OTP is invalid. Try the mock OTP provided." });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    saveLoginSession(user, "otp", values.rememberMe);
    router.push("/dashboard");
  };

  const handleForgotPassword = () => {
    setMessage("Mock password recovery is not available. Please contact support for help.");
  };

  const currentUserTypeLabel = selectedType === "individual" ? "Individual User" : "Organisation User";
  const currentMethodLabel = selectedMethod === "password" ? "Password login" : selectedType === "individual" ? "Email or Mobile OTP" : "Organisation Email OTP";

  return (
    <div className="space-y-8">
      {/* <div className="rounded-3xl border border-slate-200 bg-slate-950 p-1 text-slate-200 shadow-xl">
        <div className="grid gap-1 sm:grid-cols-2">
          {(["individual", "organisation"] as UserType[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedType(option)}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${selectedType === option ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:bg-slate-800"}`}
            >
              {option === "individual" ? "Individual" : "Organisation"}
            </button>
          ))}
        </div>
      </div> */}

      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-1 text-slate-200 shadow-xl">
  <div className="grid gap-1 sm:grid-cols-2">
    {(["individual", "organisation"] as UserType[]).map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => setSelectedType(option)}
        className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
          selectedType === option
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        {option === "individual" ? "Individual" : "Organisation"}
      </button>
    ))}
  </div>
</div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">{currentUserTypeLabel}</p>
            {/* <h1 className="mt-3 text-3xl font-semibold text-slate-900">Secure Login</h1> */}
            {/* <p className="mt-2 text-slate-600">Use password or OTP to access the dashboard with mock authentication.</p> */}
          </div>
          <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
            {/* <p className="font-semibold text-slate-900">Need access?</p>
            <p className="mt-2 leading-6">
              Use <span className="font-semibold">individualUser / Password123</span> or <span className="font-semibold">organisationUser / OrgPass123</span>.
            </p> */}
            {selectedType === "individual" ? (
    <>
      <User className="h-5 w-5 text-sky-600" />
    </>
  ) : (
    <>
      <Building2 className="h-5 w-5 text-sky-600" />
    </>
  )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-100 p-2">
          <div className="grid grid-cols-2 gap-2">
            {(["password", "otp"] as AuthMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${selectedMethod === method ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-200"}`}
              >
                {method === "password" ? "Username & Password" : selectedType === "organisation" ? "Organisation Email OTP" : "Email / Mobile OTP"}
              </button>
            ))}
          </div>
        </div>

        {message ? (
          <div className="mt-6 rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-900">{message}</div>
        ) : null}

        <form
          onSubmit={handleSubmit(selectedMethod === "password" ? handlePasswordLogin : handleVerifyOtp)}
          className="mt-8 space-y-6"
        >
          {selectedMethod === "password" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", { required: "Username is required" })}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.username ? <p className="text-sm text-rose-600">{errors.username.message}</p> : null}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.password ? <p className="text-sm text-rose-600">{errors.password.message}</p> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                  Remember me
                </label>
                <p className="text-sm text-slate-500">You can return to the dashboard quickly when remembered.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedType === "individual" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["email", "mobile"] as ContactType[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setContactType(option)}
                      className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${contactType === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"}`}
                    >
                      {option === "email" ? "Email" : "Mobile"}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">{contactLabel}</label>
                <input
                  type={contactType === "mobile" ? "tel" : "email"}
                  placeholder={contactPlaceholder}
                  {...register("contact", {
                    required: "Contact information is required",
                    pattern: selectedType === "organisation" || contactType === "email"
                      ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }
                      : { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" },
                  })}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.contact ? <p className="text-sm text-rose-600">{errors.contact.message}</p> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && !otpSent ? "Sending OTP..." : "Send OTP"}
                </button>
                {otpSent ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Enter <span className="font-semibold">{otpHint}</span> to complete verification.
                  </div>
                ) : null}
              </div>

              {otpSent ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">OTP Verification</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    {...register("otp", { required: "OTP is required" })}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {errors.otp ? <p className="text-sm text-rose-600">{errors.otp.message}</p> : null}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!otpSent || loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 rounded-3xl bg-slate-950 px-6 py-5 text-sm text-slate-300">
          <p className="font-semibold text-white">New User?</p>
          <p className="mt-2">Create a new profile and start onboarding with consent-aware registration.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/registration/individual" className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Register as Individual
            </Link>
            <Link href="/registration/organisation" className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Register as Organisation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
