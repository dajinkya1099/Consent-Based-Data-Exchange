import AppLayout from "../../components/layouts/AppLayout";

export default function RequestAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
