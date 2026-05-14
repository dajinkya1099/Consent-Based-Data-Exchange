"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  organisationStep1Schema,
  organisationStep2Schema,
  organisationStep3Schema,
  organisationStep4Schema,
  organisationStep5Schema,
} from "../lib/validation";
import { saveFormData, loadFormData, clearFormData, saveUserProfile, STORAGE_KEYS } from "../lib/localStorage";
import { verifyOtp, validateOrganisationDocument } from "../lib/api";
import { FormNavigation } from "./FormNavigation";
import { Stepper } from "./Stepper";

interface OrganisationFormValues {
  role: "Consumer" | "Provider";
  organisationName: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonMobile: string;
  emailOtp: string;
  mobileOtp: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  documentType: "GST" | "CIN" | "MSME" | "PAN";
  registrationNumber: string;
  documentValidated: boolean;
  organisationAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  secondaryContactName: string;
  secondaryContactEmail: string;
  secondaryContactMobile: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const stepTitles = [
  "Organisation Basic Details",
  "Organisation Verification",
  "Organisation Address",
  "Secondary Contact Details",
  "Account Credentials",
];

export default function OrganisationRegistrationForm() {
  const [step, setStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const stepSchemas = [
    organisationStep1Schema,
    organisationStep2Schema,
    organisationStep3Schema,
    organisationStep4Schema,
    organisationStep5Schema,
  ];
  const currentSchema = useMemo(() => stepSchemas[step], [step]);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OrganisationFormValues>({
    resolver: zodResolver(currentSchema),
    mode: "onTouched",
    defaultValues: {
      role: "Consumer",
      organisationName: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonMobile: "",
      emailOtp: "",
      mobileOtp: "",
      emailVerified: false,
      mobileVerified: false,
      documentType: "GST",
      registrationNumber: "",
      documentValidated: false,
      organisationAddress: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      secondaryContactName: "",
      secondaryContactEmail: "",
      secondaryContactMobile: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const saved = loadFormData<OrganisationFormValues>(STORAGE_KEYS.organisation);
    if (saved) reset(saved);
  }, [reset]);

  useEffect(() => {
    const subscription = watch((values) => saveFormData(STORAGE_KEYS.organisation, values));
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleNext = async (values: OrganisationFormValues) => {
    setStatusMessage(null);
    if (step === 0 && (!values.emailVerified || !values.mobileVerified)) {
      setStatusMessage("Please verify both email and mobile OTP before continuing.");
      return;
    }
    if (step === 1 && !values.documentValidated) {
      setStatusMessage("Please validate the organisation document before continuing.");
      return;
    }

    if (step < stepTitles.length - 1) {
      setStep(step + 1);
      return;
    }

    const profile = {
      registrationType: "organisation",
      role: values.role,
      contactPersonEmail: values.contactPersonEmail,
      contactPersonMobile: values.contactPersonMobile,
      emailVerified: values.emailVerified,
      mobileVerified: values.mobileVerified,
      documentType: values.documentType,
      registrationNumber: values.registrationNumber,
      documentValidated: values.documentValidated,
      organisationAddress: values.organisationAddress,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      country: values.country,
      secondaryContactName: values.secondaryContactName,
      secondaryContactEmail: values.secondaryContactEmail,
      secondaryContactMobile: values.secondaryContactMobile,
      username: values.username,
    };

    saveUserProfile(profile);
    clearFormData(STORAGE_KEYS.organisation);
    router.push("/dashboard");
  };

  const handleVerifyOtp = async (type: "email" | "mobile") => {
    setStatusMessage(null);
    const contact = type === "email" ? getValues("contactPersonEmail") : getValues("contactPersonMobile");
    const otp = type === "email" ? getValues("emailOtp") : getValues("mobileOtp");
    if (!contact || !otp) {
      setStatusMessage("Please enter contact details and OTP before verification.");
      return;
    }
    try {
      const result = await verifyOtp(type, contact, otp);
      if (result.verified) {
        setValue(type === "email" ? "emailVerified" : "mobileVerified", true);
        setStatusMessage(`${type === "email" ? "Email" : "Mobile"} OTP verified successfully.`);
      } else {
        setStatusMessage(result.message || "OTP verification failed.");
      }
    } catch (error) {
      setStatusMessage("Unable to verify OTP at this time.");
    }
  };

  const handleDocumentValidation = async () => {
    setStatusMessage(null);
    const documentType = getValues("documentType");
    const registrationNumber = getValues("registrationNumber");
    if (!registrationNumber) {
      setStatusMessage("Enter a registration number to validate.");
      return;
    }
    try {
      const result = await validateOrganisationDocument(documentType, registrationNumber);
      if (result.valid) {
        setValue("documentValidated", true);
        setStatusMessage("Organisation document validated successfully.");
      } else {
        setValue("documentValidated", false);
        setStatusMessage(result.message || "Document validation failed.");
      }
    } catch (error) {
      setStatusMessage("Unable to validate document at this time.");
    }
  };

  const onSubmit = handleSubmit(handleNext);

  return (
    <div className="space-y-8">
      <Stepper steps={stepTitles} activeStep={step} />
      {statusMessage ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">{statusMessage}</div>
      ) : null}
      {submitted ? (
        <div className="rounded-3xl border border-slate-200 bg-sky-50 px-6 py-8 text-slate-900">
          <h2 className="text-xl font-semibold">Registration Complete</h2>
          <p className="mt-2 text-slate-700">Your organisation registration is complete. Refresh the page to start again.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          {step === 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Registration role</label>
                <select
                  {...register("role")}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="Consumer">Consumer</option>
                  <option value="Provider">Provider</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Organisation Name</label>
                <input type="text" {...register("organisationName")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.organisationName ? <p className="text-sm text-rose-600">{errors.organisationName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Contact Person Name</label>
                <input type="text" {...register("contactPersonName")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.contactPersonName ? <p className="text-sm text-rose-600">{errors.contactPersonName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Contact Person Email</label>
                <input type="email" {...register("contactPersonEmail")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.contactPersonEmail ? <p className="text-sm text-rose-600">{errors.contactPersonEmail.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Contact Person Mobile</label>
                <input type="text" {...register("contactPersonMobile")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.contactPersonMobile ? <p className="text-sm text-rose-600">{errors.contactPersonMobile.message}</p> : null}
              </div>
              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email OTP</label>
                  <input type="text" {...register("emailOtp")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <button type="button" onClick={() => handleVerifyOtp("email")} className="rounded-2xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900">
                    Verify Email OTP
                  </button>
                  <p className="text-sm text-slate-600">Email verified: {getValues("emailVerified") ? "Yes" : "No"}</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Mobile OTP</label>
                  <input type="text" {...register("mobileOtp")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <button type="button" onClick={() => handleVerifyOtp("mobile")} className="rounded-2xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900">
                    Verify Mobile OTP
                  </button>
                  <p className="text-sm text-slate-600">Mobile verified: {getValues("mobileVerified") ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Document Type</label>
                <select {...register("documentType")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                  <option>GST</option>
                  <option>CIN</option>
                  <option>MSME</option>
                  <option>PAN</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Registration Number</label>
                <input type="text" {...register("registrationNumber")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.registrationNumber ? <p className="text-sm text-rose-600">{errors.registrationNumber.message}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <button type="button" onClick={handleDocumentValidation} className="rounded-2xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900">
                  Validate Document
                </button>
                <p className="mt-3 text-sm text-slate-600">Document validated: {getValues("documentValidated") ? "Yes" : "No"}</p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Organisation Address</label>
                <input type="text" {...register("organisationAddress")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.organisationAddress ? <p className="text-sm text-rose-600">{errors.organisationAddress.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input type="text" {...register("city")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.city ? <p className="text-sm text-rose-600">{errors.city.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">State</label>
                <input type="text" {...register("state")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.state ? <p className="text-sm text-rose-600">{errors.state.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Pincode</label>
                <input type="text" {...register("pincode")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.pincode ? <p className="text-sm text-rose-600">{errors.pincode.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <input type="text" {...register("country")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.country ? <p className="text-sm text-rose-600">{errors.country.message}</p> : null}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Secondary Contact Person Name</label>
                <input type="text" {...register("secondaryContactName")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.secondaryContactName ? <p className="text-sm text-rose-600">{errors.secondaryContactName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Secondary Contact Email</label>
                <input type="email" {...register("secondaryContactEmail")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.secondaryContactEmail ? <p className="text-sm text-rose-600">{errors.secondaryContactEmail.message}</p> : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Secondary Contact Mobile</label>
                <input type="text" {...register("secondaryContactMobile")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.secondaryContactMobile ? <p className="text-sm text-rose-600">{errors.secondaryContactMobile.message}</p> : null}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input type="text" {...register("username")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.username ? <p className="text-sm text-rose-600">{errors.username.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" {...register("password")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                {errors.password ? <p className="text-sm text-rose-600">{errors.password.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input type="password" {...register("confirmPassword")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
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
