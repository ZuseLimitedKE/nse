"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

export default function AuthRouter() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Check for admin role in the user metadata
    const isAdmin = user?.publicMetadata?.role === "admin";

    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      Redirecting...
    </div>
  );
}
