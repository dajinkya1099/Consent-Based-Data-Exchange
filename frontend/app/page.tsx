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
{/* <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
  Login
</h1> */}
              <p className="mt-4 text-slate-600"></p>
            </div>
            {/* <div className="rounded-3xl bg-slate-100 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Login Tips</p>
              <p className="mt-3 leading-6">Use the mock credentials shown in the form or register a new account to explore the platform.</p>
            </div> */}
          </div>
          <LoginForm />
        </section>

        <aside className="flex flex-col justify-between rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-slate-800 sm:p-10">
          <div className="space-y-7">
            <div className="rounded-3xl bg-slate-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Why login?</p>
              <h2 className="mt-4 text-2xl font-semibold">Secure access for individuals and organisations</h2>
              <p className="mt-3 text-slate-300">Choose a login method that suits your workflow and move quickly into the dashboard with a clean, responsive interface.</p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Individual users</p>
                <p className="mt-3 text-slate-300">Login with username/password or OTP using email or mobile. Easy verification for individuals.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Organisation users</p>
                <p className="mt-3 text-slate-300">Use organisation credentials or email OTP to access shared organisation dashboards.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-3xl bg-slate-800/80 p-6 text-sm text-slate-300">
            <p className="font-semibold text-white">New User?</p>
            <p className="mt-2">If you don’t have credentials yet, start registration for individual or organisation access.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
