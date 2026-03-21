/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { GlassButton } from "@/components/ui/glass-button";

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.patch(`/auth/verifyemail/${token}`);
        setStatus("success");
        setMessage(response.data?.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            "Verification failed. The link may be invalid or expired.",
        );
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verifying your email</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Email verified!</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Link href="/login" className="w-full">
            <GlassButton primary className="w-full py-3">
              Go to login
            </GlassButton>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verification failed</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Link href="/login" className="w-full">
            <GlassButton className="w-full py-3">Back to login</GlassButton>
          </Link>
        </>
      )}
    </div>
  );
}
