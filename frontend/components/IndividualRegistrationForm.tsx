"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { individualStep1Schema, individualStep2Schema, individualStep3Schema } from "../lib/validation";
import { saveFormData, loadFormData, clearFormData, saveUserProfile, STORAGE_KEYS } from "../lib/localStorage";
import { verifyAadhaar } from "../lib/api";
import { FormNavigation } from "./FormNavigation";
import { Stepper } from "./Stepper";

interface IndividualFormValues {
  role: "Consumer" | "Provider";
  email: string;
  aadhaarNumber: string;
  firstName: string;
  lastName: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  username: string;
  password: string;
  confirmPassword: string;
  aadhaarVerified: boolean;
  mobileVerified: boolean;
}

const stepTitles = ["Basic Details", "Address Details", "Account Credentials"];

export default function IndividualRegistrationForm() {
  const [step, setStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const stepSchemas = [individualStep1Schema, individualStep2Schema, individualStep3Schema];
  const currentSchema = useMemo(() => stepSchemas[step], [step]);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IndividualFormValues>({
    resolver: zodResolver(currentSchema),
    mode: "onTouched",
    defaultValues: {
      role: "Consumer",
      email: "",
      aadhaarNumber: "",
      firstName: "",
      lastName: "",
      mobile: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      username: "",
      password: "",
      confirmPassword: "",
      aadhaarVerified: false,
      mobileVerified: false,
    },
  });

  useEffect(() => {
    const saved = loadFormData<IndividualFormValues>(STORAGE_KEYS.individual);
    if (saved) reset(saved);
  }, [reset]);

  useEffect(() => {
    const subscription = watch((values) => saveFormData(STORAGE_KEYS.individual, values));
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleNext = async (values: IndividualFormValues) => {
    setStatusMessage(null);
    if (step < stepTitles.length - 1) {
      setStep(step + 1);
      return;
    }

    const profile = {
      registrationType: "individual",
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
      mobile: values.mobile,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      country: values.country,
      username: values.username,
      aadhaarVerified: values.aadhaarVerified,
      mobileVerified: values.mobileVerified,
    };

    saveUserProfile(profile);
    clearFormData(STORAGE_KEYS.individual);
    router.push("/dashboard");
  };

  const handleVerifyAadhaar = async () => {
    setStatusMessage(null);
    const aadhaarNumber = watch("aadhaarNumber");
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setStatusMessage("Enter a valid 12-digit Aadhaar number before verification.");
      return;
    }

    try {
      const result = await verifyAadhaar(aadhaarNumber);
      if (result.verified) {
        setValue("firstName", result.first_name || "");
        setValue("lastName", result.last_name || "");
        setValue("mobile", result.mobile || "");
        setValue("aadhaarVerified", true);
        setValue("mobileVerified", true);
        setStatusMessage("Aadhaar verified and personal details were auto-filled.");
      } else {
        setStatusMessage(result.message || "Aadhaar verification failed.");
      }
    } catch (error) {
      setStatusMessage("Unable to verify Aadhaar at this time.");
    }
  };

  const onSubmit = handleSubmit(handleNext);

  return (
    <div className="space-y-8">
      <Stepper steps={stepTitles} activeStep={step} />
      {statusMessage ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-blue-700">{statusMessage}</div>
      ) : null}

      {submitted ? (
        <div className="rounded-3xl border border-slate-200 bg-sky-50 px-6 py-8 text-slate-900">
          <h2 className="text-xl font-semibold">Registration Complete</h2>
          <p className="mt-2 text-slate-700">Your individual registration flow is complete. Refresh the page to start a new registration.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          {step === 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Registration role</label>
                <select
                  {...register("role")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="Consumer">Consumer</option>
                  <option value="Provider">Provider</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Aadhaar Number</label>
                <input
                  type="text"
                  maxLength={12}
                  {...register("aadhaarNumber")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.aadhaarNumber ? <p className="text-sm text-rose-600">{errors.aadhaarNumber.message}</p> : null}
              </div>
              
              <div className="sm:col-span-2 space-y-2">
                <button
                  type="button"
                  onClick={handleVerifyAadhaar}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900"
                >
                  Verify Aadhaar
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <input
                  type="text"
                  {...register("firstName")}
                  readOnly={watch("firstName")?.length > 0}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  readOnly={watch("lastName")?.length > 0}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                <input
                  type="text"
                  {...register("mobile")}
                  readOnly={watch("mobile")?.length > 0}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Address Line 1</label>
                <input
                  type="text"
                  {...register("addressLine1")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.addressLine1 ? <p className="text-sm text-rose-600">{errors.addressLine1.message}</p> : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Address Line 2</label>
                <input
                  type="text"
                  {...register("addressLine2")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.city ? <p className="text-sm text-rose-600">{errors.city.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">State</label>
                <input
                  type="text"
                  {...register("state")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.state ? <p className="text-sm text-rose-600">{errors.state.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Pincode</label>
                <input
                  type="text"
                  {...register("pincode")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.pincode ? <p className="text-sm text-rose-600">{errors.pincode.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <input
                  type="text"
                  {...register("country")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.country ? <p className="text-sm text-rose-600">{errors.country.message}</p> : null}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.username ? <p className="text-sm text-rose-600">{errors.username.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.password ? <p className="text-sm text-rose-600">{errors.password.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {errors.confirmPassword ? <p className="text-sm text-rose-600">{errors.confirmPassword.message}</p> : null}
              </div>
            </div>
          )}
          <FormNavigation
            step={step}
            maxStep={stepTitles.length - 1}
            onBack={() => setStep((value) => Math.max(value - 1, 0))}
            onNext={onSubmit}
            isNextDisabled={isSubmitting}
            submitLabel={step === stepTitles.length - 1 ? "Complete Registration" : "Next"}
          />
        </form>
      )}
    </div>
  );
}
