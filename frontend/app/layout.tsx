import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Consent Based Data Exchange",
  description: "Multi-step registration platform with Aadhaar and organisation verification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
