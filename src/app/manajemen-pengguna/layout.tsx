import { AppShell } from "@/components/layout/AppShell";

export default function ManajemanPenggunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
