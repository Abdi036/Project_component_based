"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent " />
      </div>
    );
  }

  if (!user) return <LandingPage />;
  return null;
}
