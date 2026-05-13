import Link from "next/link";
import IndividualRegistrationForm from "../../../components/IndividualRegistrationForm";

export default function IndividualRegistrationPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 shadow-xl ring-1 ring-slate-200 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Individual User Registration</h1>
        <p className="mt-4 text-slate-600">Complete the three-step registration process with Aadhaar verification.</p>
        <div className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/" className="font-semibold text-sky-600 hover:text-sky-700">
            Login Here
          </Link>
        </div>
        <div className="mt-10">
          <IndividualRegistrationForm />
        </div>
      </div>
    </main>
  );
}
