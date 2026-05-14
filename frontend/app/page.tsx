import Link from "next/link";
import LoginForm from "../components/LoginForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[1.1fr_0.8fr]">
        <section className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
<p className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent mb-6">
  Consent Based Data Exchange
</p>              
              <p className="mt-4 text-slate-600"></p>
            </div>
          </div>
          <LoginForm />
        </section>

        <aside className="flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-slate-800 via-blue-800 to-slate-700 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">
  <div className="space-y-7">
    
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
        Why login?
      </p>

      <h2 className="mt-4 text-xl font-bold leading-tight">
        Secure access for individuals and organisations
      </h2>

      <p className="mt-3 text-slate-300 leading-relaxed">
        Choose a login method that suits your workflow and move quickly into
        the dashboard with a modern, responsive experience.
      </p>
    </div>

    <div className="grid gap-4">
      
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:bg-white/10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Individual users
        </p>

        <p className="mt-3 leading-relaxed text-slate-300">
          Login using username/password or OTP through email or mobile for
          quick and secure access.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:bg-white/10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Organisation users
        </p>

        <p className="mt-3 leading-relaxed text-slate-300">
          Access organisation dashboards securely using organisation
          credentials or email OTP verification.
        </p>
      </div>

    </div>
  </div>
          {/* <div className="mt-8 space-y-4 rounded-3xl bg-slate-800/80 p-6 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">New User?</p>
              <p className="mt-2">If you don’t have credentials yet, register as a consumer or provider to start managing datasets and requests.</p>
            </div>
            <div className="grid gap-3">
              <Link
                href="/registration/individual"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Register as Individual
              </Link>
              <Link
                href="/registration/organisation"
                className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Register as Organisation
              </Link>
            </div>
          </div> */}
        </aside>
      </div>
    </main>
  );
}
