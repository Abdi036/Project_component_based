/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { GlassButton } from "@/components/ui/glass-button";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");
  const confirmValue = form.watch("confirmPassword");
  const passwordsMatch =
    passwordValue && confirmValue && passwordValue === confirmValue;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.patch(`/auth/resetpassword/${token}`, {
        password: values.password,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
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
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Password reset!</h2>
          <p className="text-sm text-muted-foreground">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Reset password
        </h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base outline-none focus:border-primary/50 transition-colors"
              {...form.register("password")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium pl-1">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className={`w-full bg-white/5 border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base outline-none transition-colors ${
                confirmValue
                  ? passwordsMatch
                    ? "border-emerald-500/50"
                    : "border-red-400/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
              {...form.register("confirmPassword")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-red-400 pl-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
          {confirmValue && passwordsMatch && (
            <p className="text-xs text-emerald-400 pl-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Passwords match
            </p>
          )}
        </div>

        <GlassButton
          primary
          type="submit"
          className="w-full py-3.5 mt-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Reset password
        </GlassButton>
      </form>
    </>
  );
}
