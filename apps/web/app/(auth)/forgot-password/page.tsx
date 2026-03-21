/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { GlassButton } from "@/components/ui/glass-button";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post("/auth/forgotpassword", values);
      setSuccess(true);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-primary">
              {form.getValues("email")}
            </span>
            .
          </p>
        </div>
        <Link href="/login" className="w-full">
          <GlassButton className="w-full py-3">Back to login</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-muted-foreground">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">Email address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary/50 transition-colors"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <GlassButton
          primary
          type="submit"
          className="w-full py-3.5"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Send reset link
        </GlassButton>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </>
  );
}
