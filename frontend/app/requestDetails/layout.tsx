import AppLayout from "../../components/layouts/AppLayout";

export default function RequestDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
