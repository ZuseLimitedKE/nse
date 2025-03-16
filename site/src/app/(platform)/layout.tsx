import { PlatformSidebar } from "@/components/platform-sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full">
      <PlatformSidebar />
      {children}
    </main>
  );
}
