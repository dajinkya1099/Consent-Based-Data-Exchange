import Link from "next/link";
import OrganisationRegistrationForm from "../../../components/OrganisationRegistrationForm";

export default function OrganisationRegistrationPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">

<div className="mx-auto grid w-full max-w-[1500px] gap-8 xl:grid-cols-[0.75fr_1.25fr]">
        {/* LEFT SECTION */}
        

        <aside className="flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-slate-800 via-blue-800 to-slate-700 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">

          <div className="space-y-7">

            {/* HERO CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">

              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                Enterprise Onboarding
              </p>

              <h2 className="mt-4 text-2xl font-bold leading-tight">
                Secure organisation identity verification
              </h2>

              <p className="mt-3 text-slate-300 leading-relaxed">
                Register organisations securely with encrypted document
                validation, OTP verification, and consent-driven access
                management.
              </p>

            </div>

            {/* FEATURE CARDS */}
            <div className="grid gap-4">

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:bg-white/10">

                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                  Document Validation
                </p>

                <p className="mt-3 leading-relaxed text-slate-300">
                  Upload and validate organisation documents securely through
                  encrypted verification workflows.
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:bg-white/10">

                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                  Secure Team Access
                </p>

                <p className="mt-3 leading-relaxed text-slate-300">
                  Enable role-based access control and secure consent-driven
                  collaboration across organisation teams.
                </p>

              </div>

            </div>

            {/* ICON GRID */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:bg-white/10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Organisation Identity"
                  className="h-16 w-16"
                />

                <p className="mt-4 text-sm font-semibold text-white">
                  Identity Verification
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:bg-white/10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2092/2092663.png"
                  alt="Secure Exchange"
                  className="h-16 w-16"
                />

                <p className="mt-4 text-sm font-semibold text-white">
                  Secure Data Exchange
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:bg-white/10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2885/2885417.png"
                  alt="Data Protection"
                  className="h-16 w-16"
                />

                <p className="mt-4 text-sm font-semibold text-white">
                  Data Protection
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:bg-white/10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                  alt="Analytics"
                  className="h-16 w-16"
                />

                <p className="mt-4 text-sm font-semibold text-white">
                  AI Analytics
                </p>
              </div>

            </div>

          </div>

        </aside>

          {/* RIGHT SECTION */}

        <section className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">

          <div className="mb-10">

            <p className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Organisation Registration
            </p>

            <p className="mt-4 text-slate-600 leading-relaxed">
              Complete the secure multi-step onboarding process with
              organisation verification, document validation, and OTP-based
              authentication.
            </p>

            <div className="mt-4 text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-semibold text-sky-700 transition hover:text-blue-900"
              >
                Login Here
              </Link>
            </div>

          </div>

          {/* FORM */}
          <OrganisationRegistrationForm />

        </section>

      </div>

    </main>
  );
}