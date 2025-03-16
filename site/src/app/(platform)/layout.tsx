import { PlatformSidebar } from "@/components/platform-sidebar";
import { Navbar } from "../(marketing)/_components/navbar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex w-full">
        <PlatformSidebar />
        {children}
      </main>
    </>
  );
}
