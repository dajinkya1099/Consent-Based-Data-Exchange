import CreateOwnerForm from "../../../components/catalogue/owner/CreateOwnerForm";

;

export default function CreateOwnerPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">

          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
              Create Owner
            </h1>

            <p className="mt-3 text-slate-600">
              Register a new Owner entity in the catalogue.
            </p>
          </div>

          <CreateOwnerForm />

        </div>

      </div>
    </main>
  );
}